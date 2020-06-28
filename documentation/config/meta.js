const linkBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? '/maz-ui/'  : '/'

export default [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
  {
    hid: 'robots',
    name: 'robots',
    content: 'index, follow'
  },
  { name: 'msapplication-TileColor', content: '#2d89ef' },
  { name: 'msapplication-config', content: `${linkBase}icons/browserconfig.xml` },
  { name: 'msapplication-TileImage', content: `${linkBase}img/maz-ui-cover.jpg` },
  { name: 'theme-color', content: '#ffffff' },
  { property: 'og:site_name', content: 'Maz UI' },
  { property: 'og:type', content: 'website' },
  { property: 'og:image', content: `${linkBase}img/maz-ui-cover.jpg` },
  { name: 'twitter:card', content: 'summary' },
  { name: 'twitter:creator', content: '@mazeel' },
  { name: 'twitter:image:src', content: `${linkBase}img/maz-ui-cover.jpg` },
  { itemprop: 'image', content: `${linkBase}img/maz-ui-cover.jpg` },
  {
    hid: 'description',
    name: 'description',
    content: 'Maz UI is a components library for Nuxt.JS et Vue.JS',
  }
]
