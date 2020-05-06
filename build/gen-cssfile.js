var fs = require('fs')
var path = require('path')
var Components = require('./components.js')
var themes = [
  'components'
]
Components = Object.keys(Components)
var basepath = path.resolve(__dirname, './../packages/scss')

const fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    return false
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'components'
  console.log('key')
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n'
  Components.forEach((key) => {
    console.log('key', key)
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return
    var fileName = key + (isSCSS ? '.scss' : '.css')
    indexContent += '@import "./' + fileName + '";\n'
    var filePath = path.resolve(basepath, theme, fileName)
    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8')
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件')
    }
  })
  fs.writeFileSync(path.resolve(basepath, theme, isSCSS ? 'index.scss' : 'index.css'), indexContent)
})
