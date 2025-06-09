// https://nuxt.com/docs/api/configuration/nuxt-config
import postcss from 'maz-ui/postcss.config.cjs'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt', '@nuxtjs/tailwindcss'],

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
    composables: {
      useTheme: true,
    }
  },
})
