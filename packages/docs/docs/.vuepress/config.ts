import { defineUserConfig, SiteData } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'
import { navbar, sidebar } from './configs'

const getBaseUrl = (path: string) => {
  const base = process.env.NODE_ENV === 'production' ? '/maz-ui-3' : ''
  return `${base}${path}`
}

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  lang: 'en-US',
  title: 'Maz-UI',
  description: 'Library of standalone components for Vue & Nuxt',
  clientAppEnhanceFiles: path.resolve(__dirname, 'clientAppEnhance.ts'),
  base: getBaseUrl('/') as SiteData['base'],

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: getBaseUrl('/img/icons/favicon-16x16.png'),
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: getBaseUrl('/img/icons/favicon-32x32.png'),
      },
    ],
    ['link', { rel: 'manifest', href: getBaseUrl('/manifest.webmanifest') }],
    ['meta', { name: 'application-name', content: 'Maz UI' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Maz UI' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    [
      'meta',
      { name: 'title', content: 'Maz UI - Stand-alone components library for Vue.JS & Nuxt.JS' },
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
      'link',
      { rel: 'apple-touch-icon', href: getBaseUrl('/img/icons/apple-touch-icon.png') },
    ],
    [
      'link',
      { property: 'og:site_name', content: 'Maz UI' },
    ],
    [
      'link',
      { property: 'og:type', content: 'website' },
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: getBaseUrl('/img/icons/safari-pinned-tab.svg'),
        color: '#3eaf7c',
      },
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#2d89ef' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'msapplication-TileImage', content: getBaseUrl('/img/maz-ui-preview.jpg') }],
    ['meta', { property: 'og:image', content: getBaseUrl('/img/maz-ui-preview.jpg') }],
    ['meta', { name: 'twitter:image', content: getBaseUrl('/img/maz-ui-preview.jpg') }]
  ],

  // theme and its config
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/img/logo.svg',
    repo: 'LouisMazel/maz-ui',
    docsDir: 'packages/docs/docs',
    docsBranch: 'master',
    navbar,
    sidebar,
  },
  plugins: [
    [
      '@vuepress/medium-zoom',
      {
        selector: 'img.zoom-custom-imgs'
      }
    ],
    [
      '@vuepress/plugin-register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
    [
      '@vuepress/plugin-google-analytics',
      {
        // we have multiple deployments, which would use different id
        id: 'G-EM35TM23Z',
      },
    ],
  ],

  alias: {
    '@assets': path.resolve(__dirname, './assets'),
  },
})