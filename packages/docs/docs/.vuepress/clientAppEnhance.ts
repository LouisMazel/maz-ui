import { defineClientAppEnhance } from '@vuepress/client'
import 'maz-ui/css/main.css'

const mazIconPath = process.env.NODE_ENV === 'production'
    ? '/maz-ui-3/icons'
    : '/icons'

import { ToasterOptions, installToaster } from 'maz-ui'
import components from 'maz-ui/components'

export default defineClientAppEnhance(async ({ app }) => {
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
})
