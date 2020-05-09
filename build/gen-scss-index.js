const fs = require('fs')
const path = require('path')
let Components = require('./components.js')

const SCSS_DIRECTORIES = 'components'
const BASE_PATH = path.resolve(__dirname, './../packages/scss')

Components = Object.keys(Components)

let indexContent = '@import url(\'https://fonts.googleapis.com/css?family=Material+Icons\');\n@import \'./../style-helpers/index.scss\';\n@import \'./_maz-arrow-icon.scss\';\n'

Components.forEach(key => {
  const fileName = `${key}.scss`
  indexContent += `@import './${fileName}';\n`
})

fs.writeFileSync(path.resolve(BASE_PATH, SCSS_DIRECTORIES, 'index.scss'), indexContent)
