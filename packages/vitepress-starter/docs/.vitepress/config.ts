import { defineConfig } from 'vitepress'
import { sidebar, head, nav } from './configs'

import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'

const links: { url: string, lastmod?: number }[] = []

export default defineConfig({
  lang: 'en-US',
  title: 'Maz-UI',
  titleTemplate: 'Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt (v3.x)',

  appearance: true,
  lastUpdated: true,
  cleanUrls: 'without-subfolders',
  ignoreDeadLinks: true,

  base: '/maz-ui-3/',

  head,

  themeConfig: {
    siteTitle: false,
    logo: '/img/logo.svg',
    sidebar,
    nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { icon: 'twitter', link: 'https://twitter.com/maz__ui' },
    ],
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Made by LouisMazel with ❤️'
    },
  },

  vite: {
    server: {
      fs: {
        allow: ['./../../lib'],
      },
    },
  },

  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id)) {
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData.lastUpdated
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

