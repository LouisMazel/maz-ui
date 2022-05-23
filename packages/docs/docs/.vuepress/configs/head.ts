import { UserConfig } from 'vuepress'

const getAssetBaseUrl = (path: string): string => {
  const base = process.env.NODE_ENV === 'production' ? 'https://louismazel.github.io/maz-ui-3' : ''
  return `${base}${path}`
}

export const head: UserConfig['head'] = [
  [
    'link',
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: getAssetBaseUrl('/img/icons/favicon-16x16.png'),
    },
  ],
  [
    'link',
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: getAssetBaseUrl('/img/icons/favicon-32x32.png'),
    },
  ],
  ['link', { rel: 'manifest', href: getAssetBaseUrl('/manifest.webmanifest') }],
  ['meta', { name: 'robots', content: 'index, follow' }],
  ['meta', { name: 'application-name', content: 'Maz UI' }],
  ['meta', { name: 'apple-mobile-web-app-title', content: 'Maz UI' }],
  [
    'meta',
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
  ],
  [
    'meta',
    { name: 'twitter:creator', content: '@mazeel' },
  ],
  [
    'meta',
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  [
    'meta',
    { name: 'twitter:site', content: '@maz__ui' },
  ],
  [
    'meta',
    { property: 'og:title', content: 'Maz-UI - Vue.JS & Nuxt.JS library' },
  ],
  [
    'meta',
    { property: 'og:description', content: 'Library of standalone components and tools for Vue & Nuxt (v3.x)' },
  ],
  [
    'meta',
    { property: 'og:type', content: 'website' },
  ],
  [
    'meta',
    { name: 'twitter:title', content: 'Maz-UI - Vue.JS & Nuxt.JS library' },
  ],
  [
    'meta',
    { name: 'twitter:description', content: 'Library of standalone components and tools for Vue & Nuxt (v3.x)' },
  ],
  ['meta', { property: 'og:image', content: getAssetBaseUrl('/img/maz-ui-preview.jpg') }],
  ['meta', { name: 'twitter:image', content: getAssetBaseUrl('/img/maz-ui-preview.jpg') }],
  [
    'link',
    { rel: 'apple-touch-icon', href: getAssetBaseUrl('/img/icons/apple-touch-icon.png') },
  ],
  [
    'link',
    { property: 'og:site_name', content: 'Maz UI' },
  ],
  [
    'link',
    {
      rel: 'mask-icon',
      href: getAssetBaseUrl('/img/icons/safari-pinned-tab.svg'),
      color: '#3eaf7c',
    },
  ],
  ['meta', { name: 'msapplication-TileColor', content: '#2d89ef' }],
  ['meta', { name: 'theme-color', content: '#ffffff' }],
  ['meta', { name: 'msapplication-TileImage', content: getAssetBaseUrl('/img/maz-ui-preview.jpg') }],
]