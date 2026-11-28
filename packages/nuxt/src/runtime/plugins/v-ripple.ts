import type { VRippleDirective } from 'maz-ui/directives/vRipple'
import { vRippleInstall } from 'maz-ui/directives/vRipple'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vRippleInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vRipple: VRippleDirective
  }
}
