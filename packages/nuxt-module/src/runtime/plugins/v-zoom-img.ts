import { defineNuxtPlugin } from '#imports'
import { vZoomImgInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vZoomImgInstall)
})
