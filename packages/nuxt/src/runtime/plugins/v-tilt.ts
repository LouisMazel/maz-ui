import type { VTiltDirective } from 'maz-ui/directives/vTilt'
import { vTiltInstall } from 'maz-ui/directives/vTilt'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vTiltInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vTilt: VTiltDirective
  }
}
