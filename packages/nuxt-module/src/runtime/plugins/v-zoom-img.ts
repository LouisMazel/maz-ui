import { vZoomImgInstall } from 'maz-ui/src/directives/vZoomImg'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vZoomImgInstall)
})
