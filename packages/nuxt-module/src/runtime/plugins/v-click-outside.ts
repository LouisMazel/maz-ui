import { vClickOutsideInstall } from 'maz-ui/directives/vClickOutside'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vClickOutsideInstall)
})
