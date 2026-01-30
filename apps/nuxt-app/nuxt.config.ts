import postcss from 'maz-ui/postcss.config.cjs'
import svgLoader from 'vite-svg-loader'
import mazUiModule from './../../packages/nuxt/src/module'

export default defineNuxtConfig({
  modules: [mazUiModule, '@nuxtjs/tailwindcss'],

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Dev App - Maz-UI',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
        },
      ],
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
      mode: 'both',
      colorMode: 'auto',
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
