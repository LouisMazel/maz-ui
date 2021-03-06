const Components = require('./components.js')
const { writeFile, copyFile } = require('fs/promises')
const render = require('json-templater/string')
const path = require('path')

const COMPONENTS_DECLARATION_PATH = path.join(__dirname, './../lib')
const INDEX_D_PATH = path.join(__dirname, './../index.d.ts')
const MODULE_DECLARATION_TEMPLATE = `
/* Automatically generated by './build/generate-types-declarations.js' */
declare module 'maz-ui/lib/{{component_name}}';
`

const ComponentsNameArray = Object.keys(Components)

const generateDeclarationComponents = async () => {
  const outIndexPath = path.join(COMPONENTS_DECLARATION_PATH, 'index.d.ts')
  const mazUiIndexPath = path.join(COMPONENTS_DECLARATION_PATH, 'maz-ui.common.d.ts')

  await copyFile(INDEX_D_PATH, outIndexPath)
  await copyFile(INDEX_D_PATH, mazUiIndexPath)

  for await (const name of ComponentsNameArray) {
    const template = render(MODULE_DECLARATION_TEMPLATE, {
      component_name: name
    })
    await writeFile(`${COMPONENTS_DECLARATION_PATH}/${name}.d.ts`, template)
  }
}

generateDeclarationComponents()