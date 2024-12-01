import type { AosOptions, ToasterOptions } from 'maz-ui'
import { getAosInstance, installAos, installDialog, installToaster, installWait, vFullscreenImgInstall } from 'maz-ui'

import * as components from 'maz-ui/components'
import { inBrowser } from 'vitepress'
import googleAnalytics from 'vitepress-plugin-google-analytics'

import DefaultTheme from 'vitepress/theme-without-fonts'
import { watch } from 'vue'

import ColorContainer from './components/ColorContainer.vue'

import ComponentDemo from './components/ComponentDemo.vue'

import NpmBadge from './components/NpmBadge.vue'
import 'maz-ui/tailwindcss/tailwind.css'
// import 'maz-ui/css/main.css'
import 'maz-ui/modules/plugins/aos/scss/index.scss'
import './main.css'

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    googleAnalytics({
      id: 'G-EM35TM23ZC',
    })

    const { app, router: { route } } = ctx

    app.provide('mazIconPath', '/icons')

    app.component('ColorContainer', ColorContainer)
    app.component('NpmBadge', NpmBadge)
    app.component('ComponentDemo', ComponentDemo)

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
}

export default theme
