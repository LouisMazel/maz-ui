import { defineNuxtPlugin } from 'nuxt/app'
import { vFullscreenImgInstall } from '../../../modules'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vFullscreenImgInstall)
})
