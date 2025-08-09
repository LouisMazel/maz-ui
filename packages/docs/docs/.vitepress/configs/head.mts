import type { UserConfig } from 'vitepress'

export function getAssetBaseUrl(path: string): string {
  const base = process.env.NODE_ENV === 'production' ? 'https://v3.maz-ui.com' : ''
  return `${base}${path}`
}

export const head = [
  ['meta', { name: 'theme-color', content: '#1d90ff' }],
  [
    'link',
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
  ],
  [
    'link',
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
  ],
  [
    'link',
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;800&display=swap',
      crossorigin: 'anonymous',
    },
  ],
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
  ['meta', { name: 'robots', content: 'noindex, nofollow' }],
  ['meta', { name: 'application-name', content: 'Maz-UI' }],
  ['meta', { name: 'apple-mobile-web-app-title', content: 'Maz-UI' }],
  [
    'meta',
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
  ],
  [
    'meta',
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  [
    'meta',
    { name: 'twitter:site', content: '@maz__ui' },
  ],
  ['meta', { name: 'twitter:creator', content: '@mazeel' }],
  [
    'link',
    { rel: 'apple-touch-icon', href: getAssetBaseUrl('/img/icons/apple-touch-icon.png') },
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
  ['meta', { name: 'og:site_name', content: 'Maz-UI' }],
  ['meta', { name: 'og:locale', content: 'en-US' }],
  ['meta', { name: 'article:author', content: 'Loïc Mazuel' }],
  // ['script', { src: 'https://www.googletagmanager.com/gtag/js?id=G-EM35TM23ZC', async: 'true' }]
] satisfies UserConfig['head']
