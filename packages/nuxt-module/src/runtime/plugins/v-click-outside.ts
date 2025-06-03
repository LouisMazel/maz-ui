import { vClickOutsideInstall } from 'maz-ui/directives'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vClickOutsideInstall)
})
