import type { VPressDirective } from 'maz-ui/directives/vPress'
import { vPressInstall } from 'maz-ui/directives/vPress'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vPressInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vPress: VPressDirective
  }
}
