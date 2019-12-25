module.exports = {
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
