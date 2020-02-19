const path = require('path')
const nodeExternals = require('webpack-node-externals')
const Components = require('./components.js')

let externals = {}

Object.keys(Components).forEach(function (key) {
  externals[`maz-ui/packages/components/${key}`] = `maz-ui/dist/${key}`
})

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()]

exports.externals = externals

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  'maz-ui': path.resolve(__dirname, '../')
}

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
}

exports.jsexclude = /node_modules/
