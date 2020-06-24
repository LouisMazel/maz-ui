const { resolve } = require('path')

export default () => {
  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'maz-ui.js'
  })
}

module.exports.meta = require(__dirname, './../package.json')
