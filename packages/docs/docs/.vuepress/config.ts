import { defineUserConfig, SiteData } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'
import { navbar, sidebar } from './configs'

const getBaseUrl = (path: string): string => {
  const base = process.env.NODE_ENV === 'production' ? '/maz-ui-3' : ''
  return `${base}${path}`
}

const getAssetBaseUrl = (path: string): string => {
  const base = process.env.NODE_ENV === 'production' ? 'https://louismazel.github.io/maz-ui-3' : ''
  return `${base}${path}`
}

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  lang: 'en-US',
  title: 'Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt',
  clientAppEnhanceFiles: path.resolve(__dirname, 'clientAppEnhance.ts'),
  base: getBaseUrl('/') as SiteData['base'],

  head: [
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
      { property: 'og:description', content: 'Library of standalone components and tools for Vue & Nuxt' },
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
      { name: 'twitter:description', content: 'Library of standalone components and tools for Vue & Nuxt' },
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
  ],

  // theme and its config
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/img/logo.svg',
    repo: 'LouisMazel/maz-ui',
    docsDir: 'packages/docs/docs',
    docsBranch: 'next',
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
        id: 'G-EM35TM23ZC',
      },
    ],
    ['vuepress-plugin-sitemap2']
  ],

  alias: {
    '@assets': path.resolve(__dirname, './assets'),
  },
})