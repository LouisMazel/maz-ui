import type { Theme } from 'vitepress'

import type { Component } from 'vue'

import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { en } from '@maz-ui/translations'
import * as components from 'maz-ui/src/components/index.js'
import { AosPlugin } from 'maz-ui/src/plugins/aos.js'
import { DialogPlugin } from 'maz-ui/src/plugins/dialog.js'
import { ToastPlugin } from 'maz-ui/src/plugins/toast.js'
import { WaitPlugin } from 'maz-ui/src/plugins/wait.js'
import { MazUiTheme } from 'maz-ui/src/themes.js'
import { MazUiTranslations } from 'maz-ui/src/translations.js'

import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import { h, watch } from 'vue'
import ComponentDemo from './components/ComponentDemo.vue'
import Layout from './components/Layout.vue'

import NpmBadge from './components/NpmBadge.vue'
import 'maz-ui/src/plugins/aos/scss/index.scss'

import 'maz-ui/styles'
import './main.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router: { route } }) {
    app.use(MazUiTheme, {
      preset: mazUi,
      darkModeStrategy: 'class',
      strategy: 'hybrid',
    })
    app.use(MazUiTranslations, {
      locale: 'en',
      fallbackLocale: 'fr',
      preloadFallback: false,
      messages: {
        en,
      },
    })

    app.use(DialogPlugin)
    app.use(ToastPlugin, {
      persistent: false,
      position: 'bottom-right',
      timeout: 10_000,
    })
    app.use(WaitPlugin)
    app.use(AosPlugin, {
      delay: 500,
      animation: {
        duration: 400,
        once: false,
        delay: 0,
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
