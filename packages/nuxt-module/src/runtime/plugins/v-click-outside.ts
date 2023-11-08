import { defineNuxtPlugin } from '#imports'
import { vClickOutsideInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vClickOutsideInstall)
})
