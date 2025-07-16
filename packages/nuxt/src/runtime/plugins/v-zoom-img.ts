import { type VZoomImgDirective, vZoomImgInstall } from 'maz-ui/directives/vZoomImg'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vZoomImgInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vZoomImg: VZoomImgDirective
  }
}
