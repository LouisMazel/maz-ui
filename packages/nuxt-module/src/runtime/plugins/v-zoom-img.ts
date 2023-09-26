import { defineNuxtPlugin } from 'nuxt/app'
import { vZoomImgInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vZoomImgInstall)
})
