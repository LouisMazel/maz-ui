import { defineNuxtPlugin } from 'nuxt/app'
import { vFullscreenImgInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vFullscreenImgInstall)
})
