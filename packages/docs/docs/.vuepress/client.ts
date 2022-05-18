import { defineClientConfig } from '@vuepress/client'
import 'maz-ui/css/main.css'
import 'maz-ui/css/aos.css'

const mazIconPath = process.env.NODE_ENV === 'production'
    ? '/maz-ui-3/icons'
    : '/icons'

import { ToasterOptions, AosOptions } from 'maz-ui'

export default defineClientConfig({
  enhance: async ({ app, router }) => {
    // @ts-ignore
    if (!__VUEPRESS_SSR__) {
      const components = (await import('maz-ui/components')).default
      const { installToaster, installWait, installAos } = await import('maz-ui')

      app.provide('mazIconPath', mazIconPath)

      Object.entries(components).forEach(([componentName, component]) => {
        app.component(componentName, component)
      })

      const toasterOptions: ToasterOptions = {
        persistent: false,
        position: 'bottom-right',
        timeout: 10000,
      }


      app.use(installToaster, toasterOptions)
      app.use(installWait)
      const aosOptions: AosOptions = {
        router,
        delay: 500,
        animation: {
          duration: 400,
          once: false
        }
      }
      app.use(installAos, aosOptions)
    }
  }
})