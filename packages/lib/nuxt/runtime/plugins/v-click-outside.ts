import { vClickOutsideInstall } from '../../../modules'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vClickOutsideInstall)
})
