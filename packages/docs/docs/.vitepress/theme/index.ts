import 'maz-ui/tailwindcss/tailwind.css'

import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import googleAnalytics from 'vitepress-plugin-google-analytics'

// import 'maz-ui/css/main.css'
import 'maz-ui/modules/plugins/aos/scss/index.scss'
import './main.css'

import { ToasterOptions, installToaster, installWait, AosOptions, installAos, aosInstance, vFullscreenImgInstall } from 'maz-ui'

import * as components from 'maz-ui/components/index'

import ColorContainer from './components/ColorContainer.vue'
import NpmBadge from './components/NpmBadge.vue'
import { watch } from 'vue'

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    googleAnalytics({
      id: 'G-EM35TM23ZC',
    })

    const { app, router: { route } } = ctx

    app.provide('mazIconPath', '/maz-ui-3/icons')

    app.component('ColorContainer', ColorContainer)
    app.component('NpmBadge', NpmBadge)

    Object.entries(components).forEach(([componentName, component]) => {
      app.component(componentName, component)
    })

    const toasterOptions: ToasterOptions = {
      persistent: false,
      position: 'bottom-right',
      timeout: 10_000,
    }

    const aosOptions: AosOptions = {
      // router: router,
      delay: 500,
      animation: {
        duration: 400,
        once: false,
        delay: 0,
      }
    }

    app.use(installToaster, toasterOptions)
    app.use(installWait)
    app.use(installAos, aosOptions)
    app.use(vFullscreenImgInstall)

    watch(
      () => route.path,
      () => {
        if (inBrowser) {
          aosInstance.runAnimations()
        }
      },
    )
  },
}

export default theme