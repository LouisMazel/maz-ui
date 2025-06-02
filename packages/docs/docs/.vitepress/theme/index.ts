import type { AosOptions, ToasterOptions } from 'maz-ui'

import type { Theme } from 'vitepress'
import { getAosInstance, installAos, installDialog, installToaster, installWait, vFullscreenImgInstall } from 'maz-ui'

import * as components from 'maz-ui/src/components/index'
import { inBrowser } from 'vitepress'
import googleAnalytics from 'vitepress-plugin-google-analytics'
import DefaultTheme from 'vitepress/theme-without-fonts'

import { watch } from 'vue'
import ColorContainer from './components/ColorContainer.vue'

import ComponentDemo from './components/ComponentDemo.vue'

import DemoAuthPage from './components/DemoAuthPage.vue'
import DemoDashboardPage from './components/DemoDashboardPage.vue'
import DemoProductPage from './components/DemoProductPage.vue'
import Layout from './components/Layout.vue'
import NpmBadge from './components/NpmBadge.vue'
import 'maz-ui/src/plugins/aos/scss/index.scss'
import 'maz-ui/tailwindcss/tailwind.css'

import './main.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    googleAnalytics({
      id: 'G-EM35TM23ZC',
    })

    const { app, router: { route } } = ctx

    app.provide('mazIconPath', '/icons')

    app.component('ColorContainer', ColorContainer)
    app.component('NpmBadge', NpmBadge)
    app.component('ComponentDemo', ComponentDemo)
    app.component('DemoProductPage', DemoProductPage)
    app.component('DemoAuthPage', DemoAuthPage)
    app.component('DemoDashboardPage', DemoDashboardPage)

    Object.entries(components).forEach(([componentName, component]) => {
      app.component(componentName, component)
    })

    const toasterOptions: ToasterOptions = {
      persistent: false,
      position: 'bottom-right',
      timeout: 10_000,
    }

    const aosOptions: AosOptions = {
      delay: 500,
      animation: {
        duration: 400,
        once: false,
        delay: 0,
      },
    }

    app.use(installToaster, toasterOptions)
    app.use(installWait)
    app.use(installAos, aosOptions)
    app.use(installDialog)
    app.use(vFullscreenImgInstall)

    watch(
      () => route.path,
      () => {
        if (inBrowser) {
          getAosInstance().runAnimations()
        }
      },
    )
  },
} satisfies Theme
