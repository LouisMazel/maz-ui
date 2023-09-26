import { defineNuxtPlugin } from 'nuxt/app'
import { vClickOutsideInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vClickOutsideInstall)
})
