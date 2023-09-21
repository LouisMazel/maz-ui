import { vLazyImgInstall } from '../../../modules'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const vLazyImgOptions = $config.public.mazUi?.injectVLazyImg

  const options = typeof vLazyImgOptions === 'object' ? vLazyImgOptions : undefined

  vueApp.use(vLazyImgInstall, options)
})
