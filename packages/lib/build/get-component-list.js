const { readdirSync } = require('fs')
const { resolve } = require('path')

const INPUT_COMPONENT_DIR = resolve(__dirname, './../package/components')

/** @type {{ name: string, path: string }[]} */
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
