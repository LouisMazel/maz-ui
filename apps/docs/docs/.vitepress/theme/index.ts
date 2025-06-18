/* eslint-disable ts/ban-ts-comment */
import type { AosOptions, ToasterOptions } from 'maz-ui/plugins'
import type { Theme } from 'vitepress'

// @ts-ignore
import * as components from 'maz-ui/src/components/index.js'
// @ts-ignore
import { vFullscreenImgInstall } from 'maz-ui/src/directives/vFullscreenImg.js'
// @ts-ignore
import { AosPlugin, DialogPlugin, ToasterPlugin, WaitPlugin } from 'maz-ui/src/plugins/index.js'
// @ts-ignore
import { MazUiPlugin } from 'maz-ui/src/plugins/maz-ui.js'

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
  enhanceApp(ctx) {
    const { app, router: { route } } = ctx

    app.use(MazUiPlugin, { darkModeStrategy: 'class', strategy: 'runtime' })

    app.provide('mazIconPath', '/icons')

    app.component('NpmBadge', NpmBadge)
    app.component('ComponentDemo', ComponentDemo)

    Object.entries(components).forEach(([componentName, component]) => {
      app.component(componentName, component as Component)
    })

    const toasterOptions: ToasterOptions = {
      persistent: false,
      position: 'bottom-right',
      timeout: 10_000,
    }
    app.use(ToasterPlugin, toasterOptions)

    const aosOptions: AosOptions = {
      delay: 500,
      animation: {
        duration: 400,
        once: false,
        delay: 0,
      },
    }
    app.use(AosPlugin, aosOptions)

    app.use(WaitPlugin)
    app.use(DialogPlugin)
    app.use(vFullscreenImgInstall)

    watch(
      () => route.path,
      (path, oldPath) => {
        if (inBrowser && path !== oldPath) {
          app.config.globalProperties.$aos.runAnimations()
        }
      },
    )
  },
} satisfies Theme
