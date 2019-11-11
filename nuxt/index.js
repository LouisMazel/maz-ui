const { resolve } = require('path')

module.exports = function VueSelectInputUi () {
  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'vue-select-input-ui.js'
  })
}

module.exports.meta = require(__dirname, './../package.json')
