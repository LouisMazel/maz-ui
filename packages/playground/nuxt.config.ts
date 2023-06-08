// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-expect-error
import postcss from 'maz-ui/postcss.config.js'
import svgLoader from 'vite-svg-loader'
import mazUiNuxt from 'maz-ui/nuxt/index'

export default defineNuxtConfig({
  modules: [mazUiNuxt, '@nuxtjs/tailwindcss'],
  css: ['maz-ui/tailwindcss/tailwind.css', '@/css/main.css'],
  devServer: {
    port: 3333,
  },
  mazUi: {
    injectComponents: true,
    injectToaster: true,
  },
  components: true,
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
