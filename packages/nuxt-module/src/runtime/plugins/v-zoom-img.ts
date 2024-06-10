import { vZoomImgInstall } from 'maz-ui'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vZoomImgInstall)
})
