import { vFullscreenImgInstall } from 'maz-ui/directives/vFullscreenImg'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vFullscreenImgInstall)
})
