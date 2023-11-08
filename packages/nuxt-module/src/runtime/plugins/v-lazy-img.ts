import { defineNuxtPlugin } from '#imports'
import { vLazyImgInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const vLazyImgOptions = $config.public.mazUi?.installVLazyImg

  const options = typeof vLazyImgOptions === 'object' ? vLazyImgOptions : undefined

  vueApp.use(vLazyImgInstall, options)
})
