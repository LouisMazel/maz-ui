// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-expect-error
import postcss from 'maz-ui/postcss.config.js'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: ['maz-ui/nuxt', '@nuxtjs/tailwindcss'],
  css: ['maz-ui/tailwindcss/tailwind.css', '@/css/main.css'],
  devServer: {
    port: 3333,
  },
  mazUi: {
    injectToaster: true,
    injectUseThemeHandler: true,
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
