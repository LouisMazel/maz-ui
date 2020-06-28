import FMMode from 'frontmatter-markdown-loader/mode'
import path from 'path'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/main.scss'],
  plugins: [
    '~/filters',
    '~/plugins',
    { src: '~/plugins/maz-ui/client.js', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt'
  ],
  styleResources: {
    scss: [
      '~/assets/scss/_variables.scss',
      '~/../packages/scss/variables.scss'
    ]
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    babel: {
      presets () {
        return [
          ['@vue/cli-plugin-babel/preset', {
            useBuiltIns: 'entry'
          }]
        ]
      }
    },
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
