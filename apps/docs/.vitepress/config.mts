import type { Plugin } from 'postcss'
import type { Plugin as VitePlugin } from 'vite'
import type { DefaultTheme, HeadConfig, UserConfig } from 'vitepress'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildSeparateThemeFiles,
  CSS_ID,
  mazUi,
} from '@maz-ui/themes'
import tailwindcssPostcss from '@tailwindcss/postcss'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import postcssUrl from 'postcss-url'
import svgLoader from 'vite-svg-loader'
import { defineConfig, postcssIsolateStyles } from 'vitepress'
import { head, nav, sidebar } from './configs/index.mjs'

import { getOgImage } from './og-image'

// Flatten postcss-nested `&-child` concatenation BEFORE @tailwindcss/vite
// sees the CSS — its internal lightningcss engine only speaks native CSS
// nesting, and leaves `&-sm`/`&-loader-container`/etc. as garbled selectors.
// Needed because .vitepress/theme/index.ts imports `maz-ui/src/*` directly,
// so raw SFC styles pass through this Vitepress pipeline.
function PreNestedCss(): VitePlugin {
  const processor = postcss([postcssNested()])
  return {
    name: 'maz-ui:pre-nested-css',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.vue\?.*type=style/.test(id) && !id.endsWith('.css'))
        return
      if (!code.includes('&'))
        return
      const { css } = await processor.process(code, { from: id, to: id })
      return { code: css, map: null }
    },
  }
}

const _dirname = dirname(fileURLToPath(import.meta.url))

// Generate complete CSS
const {
  full,
} = buildSeparateThemeFiles(mazUi, {
  darkSelector: 'class',
})

function pascalCaseToKebabCase(value: string): string {
  return value.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function getAssetBaseUrl(path: string): string {
  const base = process.env.NODE_ENV === 'production' ? 'https://maz-ui.com' : ''
  return `${base}${path}`
}

export default defineConfig<DefaultTheme.Config>({
  srcDir: 'src',
  lang: 'en-US',
  title: 'Maz-UI',
  titleTemplate: ':title | Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt',

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

  head: [
    ...head,
    ['style', { id: CSS_ID, type: 'text/css' }, full],
  ] satisfies HeadConfig[],

  themeConfig: {
    siteTitle: 'Maz-UI',

    logo: { src: '/img/logo-linear.svg', alt: 'Maz-UI logo' },
    sidebar,
    nav,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LouisMazel/maz-ui' },
      { icon: 'twitter', link: 'https://twitter.com/maz__ui' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/maz-ui' },
    ],
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Made by LouisMazel with 🖤',
    },

    editLink: {
      pattern: 'https://github.com/LouisMazel/maz-ui/edit/master/apps/docs/src/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'algolia',
      options: {
        appId: '4ML7HKE73Z',
        apiKey: 'a98bd8a34144a39eb5c59898582e093f',
        indexName: 'maz-ui-3',
      },
    },
  } satisfies DefaultTheme.Config,

  vite: {
    build: {
      rollupOptions: {
        external: ['node:child_process', 'colorette'],
      },
      target: 'esnext',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      PreNestedCss(),
      svgLoader(),
      {
        name: 'redirect-plugin',
        configureServer(server) {
          server.middlewares.use('/components/maz-phone-number-input', (_req, res) => {
            res.writeHead(301, { Location: '/components/maz-input-phone-number' })
            res.end()
          })
          server.middlewares.use('/components/maz-picker', (_req, res) => {
            res.writeHead(301, { Location: '/components/maz-date-picker' })
            res.end()
          })
          server.middlewares.use('/composables/use-language-display-names', (_req, res) => {
            res.writeHead(301, { Location: '/composables/use-display-names' })
            res.end()
          })
          server.middlewares.use('/plugins/toaster', (_req, res) => {
            res.writeHead(301, { Location: '/plugins/toast' })
            res.end()
          })
          server.middlewares.use('/components/maz-dialog-promise', (_req, res) => {
            res.writeHead(301, { Location: '/components/maz-dialog-confirm' })
            res.end()
          })
        },
      },
    ],
    css: {
      postcss: {
        plugins: [
          postcssUrl() as Plugin,
          tailwindcssPostcss() as Plugin,
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

    let image: string | undefined

    if (process.env.TEST_ENV !== 'true') {
      image = await getOgImage({
        outputFolder: join(_dirname, `./dist`, outputDistFolder),
        filename: ogImageFilename,
        title: currentTitle,
        description: currentDescription,
      })
    }

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
