import type { Plugin } from 'postcss'
import type { HeadConfig, UserConfig } from 'vitepress'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'

import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import postcssUrl from 'postcss-url'
import tailwind from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'
import svgLoader from 'vite-svg-loader'
import { defineConfig, postcssIsolateStyles } from 'vitepress'
import { head, nav, sidebar } from './configs/index.mjs'
import { getOgImage } from './og-image'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

function pascalCaseToKebabCase(value: string): string {
  return value.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function getAssetBaseUrl(path: string): string {
  const base = process.env.NODE_ENV === 'production' ? 'https://maz-ui.com' : ''
  return `${base}${path}`
}

export default defineConfig({
  lang: 'en-US',
  title: 'Maz-UI',
  titleTemplate: ':title | Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt (v3.x)',

  appearance: true,
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  base: '/',

  markdown: {
    theme: {
      light: 'github-dark',
      dark: 'tokyo-night',
    },
  },

  sitemap: {
    hostname: 'https://maz-ui.com/',
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
    },
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
      copyright: 'Made by LouisMazel with ❤️',
    },

    editLink: {
      pattern: 'https://github.com/LouisMazel/maz-ui/edit/master/packages/docs/docs/:path',
      text: 'Edit this page on GitHub',
    },

    algolia: {
      appId: '4ML7HKE73Z',
      apiKey: 'a98bd8a34144a39eb5c59898582e093f',
      indexName: 'maz-ui-3',
    },
  },

  vite: {
    build: {
      rollupOptions: {
        external: ['node:child_process', 'colorette'],
      },
    },
    plugins: [
      svgLoader(),
      {
        name: 'redirect-plugin',
        configureServer(server) {
          server.middlewares.use('/components/maz-phone-number-input', (req, res) => {
            res.writeHead(301, { Location: '/components/maz-input-phone-number' })
            res.end()
          })
          server.middlewares.use('/components/maz-picker', (req, res) => {
            res.writeHead(301, { Location: '/components/maz-date-picker' })
            res.end()
          })
          server.middlewares.use('/composables/use-language-display-names', (req, res) => {
            res.writeHead(301, { Location: '/composables/use-display-names' })
            res.end()
          })
          server.middlewares.use('/plugins/toaster', (req, res) => {
            res.writeHead(301, { Location: '/plugins/toast' })
            res.end()
          })
        },
      },
    ],
    server: {
      fs: {
        allow: [join(_dirname, './../../../lib')],
      },
    },
    css: {
      postcss: {
        plugins: [
          postcssUrl() as Plugin,
          postcssNested(),
          tailwindcssNesting(),
          postcssImport(),
          autoprefixer(),
          tailwind(),
          postcssIsolateStyles({
            includeFiles: [/vp-doc\.css/],
          }),
        ],
      },
    },
  },

  transformHead: async ({ siteData, pageData, title, description, head }) => {
    // const baseUrl = 'https://maz-ui.com'

    const currentTitle = title ?? pageData.title ?? pageData.frontmatter.title ?? siteData.title
    const currentDescription = description ?? pageData.frontmatter.description ?? pageData.description ?? siteData.description

    const currentUrl = getAssetBaseUrl(`/${pageData.relativePath.replace('.md', '') === 'index' ? '' : pageData.relativePath.replace('.md', '')}`)

    const ogImageFilename = pascalCaseToKebabCase(currentTitle.split(' ')[0].replace(' | Maz-UI', '').replaceAll(' ', '').replace('/', '-'))
    const outputDistFolder = '/og-images'
    const imagePublicPath = `${outputDistFolder}/${ogImageFilename}.png`

    const image = await getOgImage({
      outputFolder: join(_dirname, `./dist`, outputDistFolder),
      filename: ogImageFilename,
      title: currentTitle,
      description: currentDescription,
    })

    const ogImage = image ? getAssetBaseUrl(imagePublicPath) : getAssetBaseUrl('/img/maz-ui-preview.jpg')

    const pageHead: HeadConfig[] = [
      ['meta', { name: 'og:title', content: currentTitle }],
      ['link', { rel: 'canonical', href: currentUrl }],
      ['meta', { name: 'og:url', content: currentUrl }],
      ['meta', { name: 'og:type', content: pageData.relativePath === 'index.md' ? 'website' : 'article' }],
      ['meta', { name: 'description', content: currentDescription }],
      ['meta', { name: 'og:description', content: currentDescription }],
      ['meta', { name: 'twitter:title', content: currentTitle }],
      ['meta', { name: 'twitter:image', content: ogImage }],
      ['meta', { name: 'twitter:description', content: currentDescription }],
      ['meta', { name: 'twitter:image:alt', content: currentDescription }],
      ['meta', { name: 'og:image', content: ogImage }],
      ['meta', { name: 'og:image:alt', content: currentDescription }],
      ['meta', { name: 'og:updated_time', content: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString() }],
      ['meta', { name: 'article:modified_time', content: pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString() }],
    ]

    return [...head, ...pageHead]
  },
} as UserConfig)
