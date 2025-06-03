import { vLazyImgInstall } from 'maz-ui/directives'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const vLazyImgOptions = $config.public.mazUi?.installVLazyImg

  const options = typeof vLazyImgOptions === 'object' ? vLazyImgOptions : undefined

  vueApp.use(vLazyImgInstall, options)
})
