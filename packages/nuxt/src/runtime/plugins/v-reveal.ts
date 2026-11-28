import type { VRevealDirective } from 'maz-ui/directives/vReveal'
import { vRevealInstall } from 'maz-ui/directives/vReveal'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vRevealInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: VRevealDirective
  }
}
