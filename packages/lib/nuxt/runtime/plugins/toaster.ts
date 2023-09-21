import { installToaster } from './../../../modules'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const toasterOptions = $config.public.mazUi?.injectUseToast

  const options = typeof toasterOptions === 'object' ? toasterOptions : undefined

  vueApp.use(installToaster, options)
})
