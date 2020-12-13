import FMMode from 'frontmatter-markdown-loader/mode'
import path from 'path'
import link from './config/link'
import meta from './config/defaultMeta'

const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/maz-ui/'
  }
} : {}

export default {
  server: {
    port: 2000,
    host: '0.0.0.0'
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Maz UI - Stand-alone components library for Vue.JS & Nuxt.JS',
    titleTemplate: '%s | Maz UI',
    link,
    meta
  },
  /*
   ** Global CSS
   */
  loading: { color: 'dodgerblue' },
  plugins: [
    '~/filters',
    '~/plugins',
    { src: '~/plugins/maz-ui/client.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    ['@nuxtjs/google-analytics', {
      id: 'UA-171163623-1'
    }],
    '@nuxtjs/robots'
  ],
  sitemap: {
    hostname: 'https://louismazel.github.io/'
  },
  css: ['~/assets/scss/main.scss'],
  styleResources: {
    scss: [
      '~/assets/scss/_root-variables.scss',
      '~/assets/scss/_responsive.scss'
    ]
  },
  ...routerBase,
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    loaders: {
      scss: { sourceMap: process.env.NODE_ENV === 'production' }
    },
    extend (config) {
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: 'frontmatter-markdown-loader',
          include: path.resolve(__dirname, './../packages/components/'),
          options: {
            mode: [FMMode.VUE_COMPONENT],
            vue: {
              root: 'markdown-body'
            }
          }
        }
      )
    }
  }
}