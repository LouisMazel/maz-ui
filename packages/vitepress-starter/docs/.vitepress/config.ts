import { defineConfig, HeadConfig } from 'vitepress'
import { sidebar, head, nav } from './configs'

import { createWriteStream } from 'node:fs'
import { join, resolve } from 'node:path'
import { SitemapStream } from 'sitemap'

const links: { url: string, lastmod?: number }[] = []

export default defineConfig({
  lang: 'en-US',
  title: 'Maz-UI',
  titleTemplate: ':title | Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt (v3.x)',

  appearance: true,
  lastUpdated: true,
  cleanUrls: 'without-subfolders',
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

    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // },
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

  // transformHead: ({siteConfig, siteData, pageData, title, description, head, content}) => {

  //   console.log(
  //     'transformHead',
  //     { siteConfig, siteData, pageData, title, description, head, content }
  //   )

  //   const returns: HeadConfig[] = []

  //   return returns
  // },

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

