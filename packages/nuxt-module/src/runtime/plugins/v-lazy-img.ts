import { vLazyImgInstall } from 'maz-ui/directives/vLazyImg'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const vLazyImgOptions = $config.public.mazUi?.installVLazyImg

  const options = typeof vLazyImgOptions === 'object' ? vLazyImgOptions : undefined

  vueApp.use(vLazyImgInstall, options)
})
