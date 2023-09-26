import { defineNuxtPlugin } from 'nuxt/app'
import { installWait } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(installWait)
})
