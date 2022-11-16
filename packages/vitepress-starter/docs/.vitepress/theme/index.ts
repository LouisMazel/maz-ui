import DefaultTheme from 'vitepress/theme'

import 'maz-ui/css/main.css'
import 'maz-ui/css/aos.css'
import './main.css'

import { ToasterOptions, installToaster, installWait, installAos, AosOptions } from 'maz-ui'
import components from 'maz-ui/components'

import ColorContainer from './components/ColorContainer.vue'
import NpmBadge from './components/NpmBadge.vue'
import ComponentPropDoc from './components/ComponentPropDoc.vue'

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)

    ctx.app.provide('mazIconPath', '/maz-ui-3/icons')

    ctx.app.component('ColorContainer', ColorContainer)
    ctx.app.component('NpmBadge', NpmBadge)
    ctx.app.component('ComponentPropDoc', ComponentPropDoc)

    Object.entries(components).forEach(([componentName, component]) => {
      ctx.app.component(componentName, component)
    })

    const toasterOptions: ToasterOptions = {
      persistent: false,
      position: 'bottom-right',
      timeout: 10000,
    }

    // console.log('ctx.router', process.env)

    const aosOptions: AosOptions = {
      // router: ctx.router,
      delay: 500,
      animation: {
        duration: 400,
        once: false
      }
    }

    ctx.app.use(installToaster, toasterOptions)
    ctx.app.use(installWait)

    ctx.app.use(installAos, aosOptions)
    // @ts-ignore
    // if (!__VITEPRESS_SSR__) {
    // }
  },
}

export default theme