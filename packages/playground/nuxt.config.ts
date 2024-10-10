// https://nuxt.com/docs/api/configuration/nuxt-config
import postcss from 'maz-ui/postcss.config.cjs'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: ['nuxt-module', '@nuxtjs/tailwindcss'],
  css: ['~/css/main.css'],

  devServer: {
    port: 3333,
  },

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
  },

  srcDir: 'src/',

  app: {
    head: {
      title: 'Dev App - Maz-UI',
      htmlAttrs: {
        class: 'dark',
      },
    },
  },

  postcss,

  vite: {
    plugins: [svgLoader()],
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-07-22',
})
