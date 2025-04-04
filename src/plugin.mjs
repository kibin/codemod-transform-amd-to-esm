import {
  REQUIRE,
  MODULE,
  EXPORTS,
  DEFINE,
  AMD_DEFINE_RESULT,
  MAYBE_FUNCTION,
} from './constants.mjs'
import createHelpers from './helpers.mjs'

export default ({ types: t, template }) => {
  const {
    decodeDefineArguments,
    decodeRequireArguments,
    isModuleOrExportsInjected,
    isSimplifiedCommonJSWrapper,
    createDependencyInjectionExpression,
    createRestDependencyInjectionExpression,
    replaceRequireDeclarationWithImport,
    replaceRequireStatementWithImport,
    replaceCommonExportsWithESM,
    createModuleExportsResultCheck,
    getUniqueIdentifier,
    isFunctionExpression,
    createFactoryReplacementExpression,
    createFunctionCheck,
    isExplicitDependencyInjection,
    hasIgnoreComment,
    createFactoryInvocationWithUnknownArgTypes,
  } = createHelpers({ types: t, template })

  const argumentDecoders = {
    [DEFINE]: decodeDefineArguments,
    [REQUIRE]: decodeRequireArguments,
  }

  // Simple version of zip that only pairs elements until the end of the first array
  const zip = (array1, array2) => {
    return array1.map((element, index) => [element, array2[index]])
  }

  const Program = (path, ...rest) => {
    const { node } = path

    if (hasIgnoreComment(node)) return

    path.traverse({ ExpressionStatement, VariableDeclaration }, ...rest)

    const body = path.get('body')
    const lastImportIndex = body.findLastIndex(p => p.isImportDeclaration())
    const lastImport = body[lastImportIndex]
    const nonImportPaths = body.slice(0, lastImportIndex).filter(p => !p.isImportDeclaration()).reverse()
    const declarations = [...nonImportPaths.map(nonImportPath => nonImportPath.node)]

    if (lastImport && nonImportPaths.length) {
      nonImportPaths.forEach(path => path.remove())
      declarations.forEach(dec => lastImport.insertAfter(dec))
    }
  }

  const VariableDeclaration = (path) => {
    const { node, parent } = path

    if (t.isProgram(parent)) {
      path.replaceWithMultiple(replaceRequireDeclarationWithImport(node))
    }
  }

  const ExpressionStatement = (path, { opts }) => {
    const { node, parent } = path
    const { expression } = node

    if (t.isProgram(parent) && t.isAssignmentExpression(expression)) {
      replaceCommonExportsWithESM(path)
    }

    if (!t.isCallExpression(expression)) return

    const options = Object.assign({ restrictToTopLevelDefine: true }, opts)

    const { name } = expression.callee
    const isDefineCall = name === DEFINE

    if (!isDefineCall && t.isProgram(parent)) {
      path.replaceWithMultiple(replaceRequireStatementWithImport(node))
    }

    if (isDefineCall && options.restrictToTopLevelDefine && !t.isProgram(parent)) return

    const argumentDecoder = argumentDecoders[name]

    if (!argumentDecoder) return

    const { dependencyList, factory } = argumentDecoder(expression.arguments)
    const isDependencyArray = dependencyList && t.isArrayExpression(dependencyList)

    if (!isDependencyArray && !factory) return

    const isFunctionFactory = isFunctionExpression(factory)

    const isFactoryTypeUnknowable =
      // true if we can't determine the type of the factory at build time
      t.isIdentifier(factory) ||
      t.isMemberExpression(factory) ||
      t.isOptionalMemberExpression(factory) ||
      t.isCallExpression(factory) ||
      t.isOptionalCallExpression(factory) ||
      t.isLogicalExpression(factory) ||
      t.isConditionalExpression(factory) ||
      t.isAssignmentExpression(factory) ||
      t.isParenthesizedExpression(factory)

    const dependencyInjections = []

    const handleUnknownArgTypes =
      // define/require call with unknown factory type and/or non-array literal dependencies.
      // Note that we ignore some cases that are already handled by pre-existing code.  These
      // include define calls with array type dependencies and unknown type function factories:
      //    define(['dep1', 'dep2'], myFactory)
      // as well as require calls with array dependencies and factories who's types can be
      // determined known at compile time (function or non-function):
      //    require(['dep1', 'dep2'], {nonFunction: 'factory'})
      factory && dependencyList && ((isDefineCall && !isDependencyArray)
        || (!isDefineCall && (!isDependencyArray || isFactoryTypeUnknowable)))

    if (handleUnknownArgTypes) {
      path.replaceWithMultiple(
        createFactoryInvocationWithUnknownArgTypes({
          path,
          dependencyList,
          factory,
          isDefineCall,
          arity: expression.arguments.length,
        })
      )
      return
    }
    if (isDependencyArray) {
      const dependencyParameterPairs = zip(
        dependencyList.elements,
        isFunctionFactory ? factory.params : []
      )

      if (isFunctionFactory) {
        const factoryArity = factory.params.length
        const lastFactoryParam = factory.params[factoryArity - 1]
        if (t.isRestElement(lastFactoryParam)) {
          const restDependencyNodes = dependencyList.elements.slice(factoryArity - 1)
          const restDependencyInjections =
            createRestDependencyInjectionExpression(restDependencyNodes)
          dependencyParameterPairs.splice(
            factoryArity - 1,
            dependencyParameterPairs.length - factoryArity + 1,
            [restDependencyInjections, lastFactoryParam.argument]
          )
        }
      }

      const dependencyInjectionExpressions = dependencyParameterPairs.map(
        ([dependency, paramName]) => {
          return createDependencyInjectionExpression(dependency, paramName)
        }
      )

      dependencyInjections.push(...dependencyInjectionExpressions)
    }

    const explicitDependencyInjections = dependencyInjections.filter(isExplicitDependencyInjection)

    if (isFunctionFactory) {
      const factoryArity = factory.params.length
      let replacementFuncExpr = createFactoryReplacementExpression(
        factory,
        explicitDependencyInjections
      )
      let replacementCallExprParams = []

      if (isSimplifiedCommonJSWrapper(dependencyList, factoryArity)) {
        replacementFuncExpr = factory

        // Order is important here for the simplified commonjs wrapper
        const amdKeywords = [REQUIRE, EXPORTS, MODULE]

        replacementCallExprParams = amdKeywords
          .slice(0, factoryArity)
          .map((keyword) => t.identifier(keyword))
      }

      const factoryReplacement = t.callExpression(replacementFuncExpr, replacementCallExprParams)

      if (isDefineCall) {
        if (!isModuleOrExportsInjected(dependencyList, factoryArity)) {
          const funcBody = factory.body

          if (
            t.isObjectExpression(funcBody)
            || t.isArrayExpression(funcBody)
            || t.isParenthesizedExpression(funcBody)
            || t.isFunctionExpression(funcBody)
          ) {
            path.replaceWith(t.exportDefaultDeclaration(funcBody))
          }

          if (t.isBlockStatement(funcBody)) {
            path.replaceWithMultiple(funcBody.body.flatMap(node => {
              switch (true) {
                case t.isReturnStatement(node):
                  return t.exportDefaultDeclaration(node.argument)
                case t.isVariableDeclaration(node):
                  return replaceRequireDeclarationWithImport(node)
                case t.isExpressionStatement(node):
                  return replaceRequireStatementWithImport(node)
                default:
                  return node
              }
            }))
          }
        } else {
          const resultCheckIdentifier = getUniqueIdentifier(path.scope, AMD_DEFINE_RESULT)
          path.replaceWithMultiple(
            createModuleExportsResultCheck(factoryReplacement, resultCheckIdentifier)
          )
        }
      } else {
        path.replaceWith(factoryReplacement)
      }
    } else if (factory && isDefineCall) {
      const functionCheckNodes = createFunctionCheck(
        factory,
        getUniqueIdentifier(path.scope, MAYBE_FUNCTION),
        getUniqueIdentifier(path.scope, AMD_DEFINE_RESULT),
        dependencyInjections
      )
      path.replaceWithMultiple(functionCheckNodes)
    } else {
      path.replaceWithMultiple(explicitDependencyInjections)
    }
  }

  return {
    visitor: {
      Program,
    },
  }
}
