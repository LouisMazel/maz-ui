const fs = require('fs')
const path = require('path')
let Components = require('./components.js')
const themes = [
  'components'
]
Components = Object.keys(Components)
const basepath = path.resolve(__dirname, './../packages/scss')

const fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    return false
  }
}

themes.forEach((theme) => {
  const isSCSS = theme !== 'components'
  console.log('key')
  let indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n'
  Components.forEach((key) => {
    console.log('key', key)
    const fileName = key + (isSCSS ? '.scss' : '.css')
    indexContent += '@import "./' + fileName + '";\n'
    const filePath = path.resolve(basepath, theme, fileName)
    if (!fileExists(filePath)) {
      // fs.writeFileSync(filePath, '', 'utf8')
      console.log(theme, fileName)
    }
  })
  fs.writeFileSync(path.resolve(basepath, theme, isSCSS ? 'index.scss' : 'index.css'), indexContent)
})
