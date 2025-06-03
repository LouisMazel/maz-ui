import { vZoomImgInstall } from 'maz-ui/directives'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vZoomImgInstall)
})
