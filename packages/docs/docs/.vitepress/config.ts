import { defineConfig, HeadConfig } from 'vitepress'
import { sidebar, head, nav } from './configs'

import { createWriteStream } from 'node:fs'
import { join, resolve } from 'node:path'
import { SitemapStream } from 'sitemap'

const links: { url: string, lastmod?: number, changefreq: string }[] = []

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

  head,

  themeConfig: {
    siteTitle: 'Maz-UI',

    logo: { src: '/img/logo.svg', alt: 'Maz-UI logo'},
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
      pattern: 'https://github.com/LouisMazel/maz-ui/edit/master/packages/docs/docs/:path',
      text: 'Edit this page on GitHub'
    },

    algolia: {
      appId: '4ML7HKE73Z',
      apiKey: 'a98bd8a34144a39eb5c59898582e093f',
      indexName: 'maz-ui-3'
    },
  },

  vite: {
    server: {
      fs: {
        allow: [join(__dirname, './../../../lib')],
      },
    },
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
        '~': join(__dirname, 'src'),
        '@package': join(__dirname, './../../../lib/package'),
        '@components': join(__dirname, './../../../lib/package/components'),
      }
    }
  },

  // og:title
  // og:url
  // og:description
  // og:image

  transformHead: ({siteConfig, siteData, pageData, title, description, head }) => {

    const baseUrl = 'https://louismazel.github.io'

    const currentTitle = title ?? pageData.title ?? pageData.frontmatter.title ?? siteData.title
    const currentDescription = description ?? pageData.frontmatter.description ?? pageData.description ?? siteData.description
    const currentUrl = `${baseUrl}${siteConfig.site.base}${pageData.relativePath.replace('.md', '')}`

    const pageHead: HeadConfig[] = [
      ['meta', { name: 'og:url', content: currentTitle }],
      ['meta', { name: 'og:url', content: currentUrl }],
      ['meta', { name: 'og:type', content: pageData.relativePath === 'index.md' ? 'website' : 'article' }],
      ['meta', { name: 'twitter:title', content: currentTitle }],
      ['meta', { name: 'twitter:description', content: currentDescription }],
      ['meta', { name: 'twitter:image:alt', content: currentDescription }],
      ['meta', { name: 'og:image:alt', content: currentDescription }],
      ['meta', { name: 'og:updated_time', content: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString() }],
      ['meta', { name: 'article:modified_time', content: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString() }],
      ['link', { rel: 'canonical', href: currentUrl }],
    ]

    return [...head, ...pageHead]
  },

  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id)) {
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated,
        changefreq: 'daily'
      })
    }
  },

  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({
      hostname: 'https://louismazel.github.io/maz-ui-3/'
    })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach((link) => sitemap.write(link))
    sitemap.end()
    await new Promise((r) => writeStream.on('finish', r))
  }
})