import mazUiModule from '@maz-ui/nuxt/src/module.js'
import postcss from 'maz-ui/postcss.config.cjs'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: [mazUiModule, '@nuxtjs/tailwindcss'],

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Dev App - Maz-UI',
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
    theme: {
      preset: 'maz-ui',
      mode: 'dark',
      colorMode: 'light',
    },
    translations: {
      locale: 'fr',
      preloadFallback: true,
      fallbackLocale: 'en',
    },
    plugins: {
      aos: true,
      dialog: true,
      toast: true,
      wait: true,
    },
    directives: {
      vTooltip: true,
    },
  },
})
