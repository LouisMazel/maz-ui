import { defineUserConfig, SiteData, defaultTheme, viteBundler } from 'vuepress'
import { path } from '@vuepress/utils'

import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { searchPlugin } from '@vuepress/plugin-search'
import { sitemapPlugin } from "vuepress-plugin-sitemap2"
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'

import { sidebar, navbar, head } from './configs'

export default defineUserConfig({
  // site config
  lang: 'en-US',
  title: 'Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt (v3.x)',
  clientConfigFile: path.resolve(__dirname, 'client.ts'),
  base: `/maz-ui-3/`,

  head,

  // theme and its config
  theme: defaultTheme({
    logo: '/img/logo.svg',
    repo: 'LouisMazel/maz-ui',
    docsDir: 'packages/docs/docs',
    docsBranch: 'master',
    navbar,
    sidebar,
  }),

  bundler: viteBundler({
    // viteOptions: {
    //   // @ts-ignore
    //   ssr: {
    //     noExternal: ['maz-ui'],
    //   },
    // },
  }),
  plugins: [
    googleAnalyticsPlugin({
      id: 'G-EM35TM23ZC',
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    sitemapPlugin({
      hostname: 'https://louismazel.github.io/maz-ui-3/',
      changefreq: 'daily'
    }),
    mediumZoomPlugin({
      selector: 'img.zoom-custom-imgs'
    }),
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'Search',
        }
      }
    })
  ],

  alias: {
    '@assets': path.resolve(__dirname, './assets'),
  },
})