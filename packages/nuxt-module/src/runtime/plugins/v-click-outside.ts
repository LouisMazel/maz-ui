import { vClickOutsideInstall } from 'maz-ui/directives'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vClickOutsideInstall)
})
