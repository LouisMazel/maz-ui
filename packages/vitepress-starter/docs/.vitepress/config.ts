import { defineConfig } from 'vitepress'
import { sidebar, head } from './configs'

export default defineConfig({
  lang: 'en-US',
  title: 'Maz-UI',
  titleTemplate: 'Maz-UI',
  description: 'Library of standalone components and tools for Vue & Nuxt (v3.x)',
  appearance: true,
  base: '/maz-ui-3/',
  head,
  themeConfig: {
    sidebar,
  },
  vite: {
    server: {
      fs: {
        allow: ['./../../lib'],
      },
    },
  }
})

