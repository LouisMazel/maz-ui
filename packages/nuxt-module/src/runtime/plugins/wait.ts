import { defineNuxtPlugin } from '#imports'
import { installWait } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(installWait)
})
