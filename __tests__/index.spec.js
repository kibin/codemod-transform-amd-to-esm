import pluginTester from 'babel-plugin-tester'
import path from 'path'
import { fileURLToPath } from 'url'

import plugin from '../src/plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),
  babelOptions: {
    retainLines: true,
    parserOpts: {
      tokens: true,
      createParenthesizedExpressions: true,
    },
  },
})
