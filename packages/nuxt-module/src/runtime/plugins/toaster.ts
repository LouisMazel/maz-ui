import { defineNuxtPlugin } from '#imports'
import { installToaster } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const toasterOptions = $config.public.mazUi?.injectUseToast

  const options = typeof toasterOptions === 'object' ? toasterOptions : undefined

  vueApp.use(installToaster, options)
})
