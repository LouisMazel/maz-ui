import LINK_BASE from './linkBase'

export default ({ description, title, img = 'maz-ui-cover' }) => [
  { name: 'msapplication-TileImage', content: `${LINK_BASE}img/${img}.jpg` },
  { itemprop: 'image', content: `${LINK_BASE}img/${img}.jpg` },
  { hid: 'description', name: 'description', content: description },
  // facebook & linkedin
  { property: 'og:title', content: title },
  { property: 'og:image', content: `${LINK_BASE}img/${img}.jpg` },
  { property: 'og:description', content: description },
  // twitter
  { name: 'twitter:title', content: title },
  { name: 'twitter:description', content: description },
  { name: 'twitter:image', content: `${LINK_BASE}img/${img}.jpg` }
]
