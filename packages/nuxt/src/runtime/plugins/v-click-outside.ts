import type { VClickOutsideDirective } from 'maz-ui/directives/vClickOutside'
import { vClickOutsideInstall } from 'maz-ui/directives/vClickOutside'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vClickOutsideInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vClickOutside: VClickOutsideDirective
  }
}
