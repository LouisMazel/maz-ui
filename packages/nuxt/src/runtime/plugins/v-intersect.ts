import type { VIntersectDirective } from 'maz-ui/directives/vIntersect'
import { vIntersectInstall } from 'maz-ui/directives/vIntersect'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vIntersectInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vIntersect: VIntersectDirective
  }
}
