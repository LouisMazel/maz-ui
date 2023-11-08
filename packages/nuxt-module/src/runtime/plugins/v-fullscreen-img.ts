import { defineNuxtPlugin } from '#imports'
import { vFullscreenImgInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vFullscreenImgInstall)
})
