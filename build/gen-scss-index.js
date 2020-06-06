const fs = require('fs')
const path = require('path')
let Components = require('./components.js')

const SCSS_DIRECTORIES = 'components'
const BASE_PATH = path.resolve(__dirname, './../packages/scss')

Components = Object.keys(Components)

let indexContent = ''

Components.forEach(key => {
  const fileName = `${key}.scss`
  indexContent += `@import './${fileName}';\n`
})

fs.writeFileSync(path.resolve(BASE_PATH, SCSS_DIRECTORIES, 'index.scss'), indexContent)
