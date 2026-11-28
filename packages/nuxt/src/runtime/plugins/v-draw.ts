import type { VDrawDirective } from 'maz-ui/directives/vDraw'
import { vDrawInstall } from 'maz-ui/directives/vDraw'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vDrawInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vDraw: VDrawDirective
  }
}
