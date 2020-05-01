const Mode = require('frontmatter-markdown-loader/mode')
// const webpack = require('webpack')

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('frontmatter-markdown-loader')
      .loader('frontmatter-markdown-loader')
      .tap(() => {
        return {
          mode: [Mode.VUE_COMPONENT]
        }
      })
  },
  // configureWebpack: {
  //   plugins: [
  //     new webpack.IgnorePlugin({
  //       resourceRegExp: /^\.\/locale$/,
  //       contextRegExp: /moment$/
  //     })
  //   ]
  // },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/maz-ui/'
    : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/../packages/scss/vars";`
      }
    }
  }
}
