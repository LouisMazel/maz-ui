import type { VMagneticDirective } from 'maz-ui/directives/vMagnetic'
import { vMagneticInstall } from 'maz-ui/directives/vMagnetic'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vMagneticInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vMagnetic: VMagneticDirective
  }
}
