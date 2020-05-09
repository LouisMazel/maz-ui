const fs = require('fs')
const path = require('path')
let Components = require('./components.js')

const SCSS_DIRECTORIES = 'components'
const COMPONENTS_WITHOUT_STYLE = ['maz-flex', 'maz-list-item', 'maz-tabs-content', 'maz-tabs-content-item']

Components = Object.keys(Components)
const basepath = path.resolve(__dirname, './../packages/scss')

let indexContent = '@import url(\'https://fonts.googleapis.com/css?family=Material+Icons\');\n@import \'./../style-helpers/index.scss\';\n@import \'./_maz-arrow-icon.scss\';\n'

Components.forEach(key => {
  if (COMPONENTS_WITHOUT_STYLE.includes(key)) return
  const fileName = `${key}.scss`
  indexContent += `@import './${fileName}';\n`
})

fs.writeFileSync(path.resolve(basepath, SCSS_DIRECTORIES, 'index.scss'), indexContent)
