// https://nuxt.com/docs/api/configuration/nuxt-config
import postcss from 'maz-ui/postcss.config.cjs'
import svgLoader from 'vite-svg-loader'

import mazUiModule from '@maz-ui/nuxt/src/module.js'

export default defineNuxtConfig({
  modules: [mazUiModule, '@nuxtjs/tailwindcss'],

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Dev App - Maz-UI',
      htmlAttrs: {
        class: 'dark',
      },
    },
  },
  css: ['~/css/main.css'],

  srcDir: 'src/',

  devServer: {
    port: 3333,
  },

  compatibilityDate: '2024-07-22',

  vite: {
    plugins: [svgLoader()],
  },

  postcss,

  mazUi: {
    defaultMazIconPath: '/icons',
    injectAos: {
      router: true,
      injectCss: true,
      delay: 1000,
    },
    injectUseToast: {
      position: 'bottom-right',
      timeout: 3000,
      persistent: false,
    },
    injectUseThemeHandler: {
      darkClass: 'dark',
      lightClass: 'light',
      storageThemeKey: 'theme',
      storageThemeValueDark: 'dark',
      storageThemeValueLight: 'light',
    },
    installVLazyImg: true,
    installVTooltip: {
      position: 'top',
    },
    injectCss: true,
    injectComponents: true,
    devtools: true,
  },
})
