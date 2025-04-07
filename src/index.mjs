import { parse, print } from 'recast'
import { transformFromAstSync } from '@babel/core'

import amdToEsm from './plugin.mjs'

export const recaster = (code) => {
  const ast = parse(code, {
    parser: require('recast/parsers/babel'),
  })
  const options = {
    cloneInputAst: false,
    code: false,
    ast: true,
    sourceType: 'script',
    babelrc: false,
    configFile: false,
    plugins: [amdToEsm],
  }
  const { ast: transformedAST } = transformFromAstSync(ast, code, options)

  return print(transformedAST).code
}

export default (file) => recaster(file.source, file.path)
