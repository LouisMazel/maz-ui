// @ts-check

const { readdirSync } = require('node:fs')
const { resolve } = require('node:path')

const INPUT_COMPONENT_DIR = resolve(__dirname, './../package/components')

const componentsList = readdirSync(INPUT_COMPONENT_DIR)
  .filter((name) => name.endsWith('.vue'))
  .map((name) => ({
    name: name.split('.')[0],
    relativePath: `./${name}`,
    path: `${INPUT_COMPONENT_DIR}/${name}`,
    buildPath: `./${name.split('.')[0]}.js`,
  }))

module.exports = {
  componentsList,
}
