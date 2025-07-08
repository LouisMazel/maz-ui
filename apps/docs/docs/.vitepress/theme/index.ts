/* eslint-disable ts/ban-ts-comment */
import type { Theme } from 'vitepress'

// @ts-ignore
import * as components from 'maz-ui/src/components/index.js'
// @ts-ignore
import { MazUi } from 'maz-ui/src/plugins/maz-ui.js'

import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import { type Component, watch } from 'vue'
import ComponentDemo from './components/ComponentDemo.vue'

import Layout from './components/Layout.vue'
import NpmBadge from './components/NpmBadge.vue'
import 'maz-ui/src/plugins/aos/scss/index.scss'

import 'maz-ui/styles'
import './main.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router: { route } }) {
    app.use(MazUi, {
      theme: {
        darkModeStrategy: 'class',
        strategy: 'hybrid',
        preset: 'maz-ui',
      },
      translations: {
        locale: 'fr',
      },
      plugins: {
        dialog: true,
        toast: {
          persistent: false,
          position: 'bottom-right',
          timeout: 10_000,
        },
        wait: true,
        aos: {
          delay: 500,
          animation: {
            duration: 400,
            once: false,
            delay: 0,
          },
        },
      },
    })

    app.provide('mazIconPath', '/icons')

    app.component('NpmBadge', NpmBadge)
    app.component('ComponentDemo', ComponentDemo)

    Object.entries(components).forEach(([componentName, component]) => {
      app.component(componentName, component as Component)
    })

    watch(
      () => route.path,
      (path, oldPath) => {
        if (inBrowser && path !== oldPath) {
          app.config.globalProperties.$mazAos.runAnimations()
        }
      },
    )
  },
} satisfies Theme
