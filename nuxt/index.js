const { resolve } = require('path')

module.exports = function MazUi () {
  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, './plugin.js'),
    fileName: 'maz-ui.js'
  })
}

module.exports.meta = require(__dirname, './../package.json')
