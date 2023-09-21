// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-expect-error
import postcss from 'maz-ui/postcss.config.js'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: ['maz-ui/nuxt', '@nuxtjs/tailwindcss'],
  css: ['@/css/main.css'],
  devServer: {
    port: 3333,
  },
  mazUi: {
    injectComponents: true,
    injectCss: true,
    injectAos: {
      router: true,
      injectCss: true,
      delay: 1000,
    },
    injectToaster: {
      position: 'bottom-right',
      timeout: 1000,
      persistent: false,
    },
    injectUseThemeHandler: {
      darkClass: 'dark',
      lightClass: 'light',
      storageThemeKey: 'theme',
      storageThemeValueDark: 'dark',
      storageThemeValueLight: 'light',
    },
    injectUseIdleTimeout: true,
    injectUseUserVisibility: true,
    injectUseWait: true,
    injectVZoomImg: true,
    injectVLazyImg: true,
    injectVClickOutside: true,
    devtools: true,
  },
  srcDir: 'src/',
  app: {
    head: {
      title: 'Dev App - Maz-UI',
    },
  },
  postcss,
  vite: {
    plugins: [svgLoader()],
  },
  devtools: { enabled: true },
})
