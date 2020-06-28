const linkBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? '/maz-ui/'  : '/'

export default [
  { rel: 'apple-touch-icon', sizes: '180x180', href: `${linkBase}icons/apple-touch-icon.png` },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${linkBase}icons/favicon-32x32.png` },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${linkBase}icons/favicon-16x16.png` },
  { rel: 'manifest', href: `${linkBase}icons/site.webmanifest` },
  { rel: 'mask-icon', color: '#5bbad5', href: `${linkBase}icons/safari-pinned-tab.svg` },
  { rel: 'shortcut icon', href: `${linkBase}icons/favicon.ico` }
]
