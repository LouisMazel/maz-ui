import LINK_BASE from './linkBase'



export default ({ description, title, img = 'maz-ui-cover' }) => [
  { hid: 'msapplication-TileImage', name: 'msapplication-TileImage', content: `${LINK_BASE}img/${img}.jpg` },
  (description ? { hid: 'itemprop', itemprop: 'image', content: `${LINK_BASE}img/${img}.jpg` } : {}),
  // facebook & linkedin
  (description ? { hid: 'description', name: 'description', content: description } : {}),
  (title ? { hid: 'og:title', property: 'og:title', content: title } : {}),
  { hid: 'og:image', property: 'og:image', content: `${LINK_BASE}img/${img}.jpg` },
  (description ? { hid: 'og:description', property: 'og:description', content: description } : {}),
  // twitter
  (title ? { hid: 'twitter:title', name: 'twitter:title', content: title } : {}),
  (description ? { hid: 'twitter:description', name: 'twitter:description', content: description } : {}),
  { hid: 'twitter:image', name: 'twitter:image', content: `${LINK_BASE}img/${img}.jpg` },
  { hid: 'google-site-verification', name: 'google-site-verification', content: 'snu4cvJ7Djbi4aVNKj-7RSP9NGvGqW_Vrilis_iUmT0' }
]
