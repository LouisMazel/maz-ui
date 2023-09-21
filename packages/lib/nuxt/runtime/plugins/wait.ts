import { installWait } from '../../../modules'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(installWait)
})
