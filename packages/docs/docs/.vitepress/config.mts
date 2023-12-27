import { defineConfig, HeadConfig } from 'vitepress'
import { sidebar, head, nav } from './configs/index.mjs'
import { join } from 'node:path'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

import svgLoader from 'vite-svg-loader'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  lang: 'en-US',
  title: 'Maz-UI',
  titleTemplate: ':title | Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt (v3.x)',

  appearance: true,
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  base: '/maz-ui-3/',

  sitemap: {
    hostname: 'https://louismazel.github.io/maz-ui-3/',
    transformItems: (items) => {
      // add new items or modify/filter existing items
      const modifyItems: typeof items = []

      for (const item of items) {
        if (item.url.includes('404')) {
          continue
        }
        modifyItems.push({
          ...item,
          changefreq: 'daily',
          priority: 1,
        })
      }

      return modifyItems
    }
  },

  head,

  themeConfig: {
    siteTitle: 'Maz-UI',

    logo: { src: '/img/logo.svg', alt: 'Maz-UI logo' },
    sidebar,
    nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LouisMazel/maz-ui' },
      { icon: 'twitter', link: 'https://twitter.com/maz__ui' },
    ],
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Made by LouisMazel with ❤️'
    },

    editLink: {
      pattern: 'https://github.com/LouisMazel/maz-ui-3/edit/master/packages/docs/docs/:path',
      text: 'Edit this page on GitHub'
    },

    algolia: {
      appId: '4ML7HKE73Z',
      apiKey: 'a98bd8a34144a39eb5c59898582e093f',
      indexName: 'maz-ui-3'
    },
  },

  vite: {
    plugins: [svgLoader()],
    server: {
      fs: {
        allow: [join(_dirname, './../../../lib')],
      },
    },
  },

  transformHead: ({ siteConfig, siteData, pageData, title, description, head }) => {

    const baseUrl = 'https://louismazel.github.io'

    const currentTitle = title ?? pageData.title ?? pageData.frontmatter.title ?? siteData.title
    const currentDescription = description ?? pageData.frontmatter.description ?? pageData.description ?? siteData.description
    const currentUrl = `${baseUrl}${siteConfig.site.base}${pageData.relativePath.replace('.md', '')}`

    const pageHead: HeadConfig[] = [
      ['meta', { name: 'og:title', content: currentTitle }],
      ['meta', { name: 'og:url', content: currentUrl }],
      ['meta', { name: 'og:type', content: pageData.relativePath === 'index.md' ? 'website' : 'article' }],
      ['meta', { name: 'twitter:title', content: currentTitle }],
      ['meta', { name: 'description', content: currentDescription }],
      ['meta', { name: 'og:description', content: currentDescription }],
      ['meta', { name: 'twitter:description', content: currentDescription }],
      ['meta', { name: 'twitter:image:alt', content: currentDescription }],
      ['meta', { name: 'og:image:alt', content: currentDescription }],
      ['meta', { name: 'og:updated_time', content: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString() }],
      ['meta', { name: 'article:modified_time', content: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString() }],
      ['link', { rel: 'canonical', href: currentUrl }],
    ]

    return [...head, ...pageHead]
  },
})