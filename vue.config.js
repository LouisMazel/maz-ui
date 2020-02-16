const Mode = require('frontmatter-markdown-loader/mode')

module.exports = {
  // configureWebpack: {
  //   module: {
  //     rules: [ {
  //       test: /\.md$/,
  //       loader: 'frontmatter-markdown-loader'
  //     }]
  //   }
  // },
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
