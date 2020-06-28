export default [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
  {
    hid: 'robots',
    name: 'robots',
    content: 'index, follow'
  },
  { name: 'msapplication-TileColor', content: '#2d89ef' },
  { name: 'msapplication-config', content: 'icons/browserconfig.xml' },
  { name: 'msapplication-TileImage', content: 'img/maz-ui-cover.jpg' },
  { name: 'theme-color', content: '#ffffff' },
  { property: 'og:site_name', content: 'Maz UI' },
  { property: 'og:type', content: 'website' },
  { property: 'og:image', content: 'img/maz-ui-cover.jpg' },
  { name: 'twitter:card', content: 'summary' },
  { name: 'twitter:creator', content: '@mazeel' },
  { name: 'twitter:image:src', content: 'img/maz-ui-cover.jpg' },
  { itemprop: 'image', content: 'img/maz-ui-cover.jpg' },
  {
    hid: 'description',
    name: 'description',
    content: 'Maz UI is a components library for Nuxt.JS et Vue.JS',
  }
]
