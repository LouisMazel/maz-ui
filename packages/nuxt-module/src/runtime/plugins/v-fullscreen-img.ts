import { vFullscreenImgInstall } from 'maz-ui/directives'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vFullscreenImgInstall)
})
