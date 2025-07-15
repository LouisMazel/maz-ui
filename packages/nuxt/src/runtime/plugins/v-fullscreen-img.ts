import {
  type VFullscreenImgDirective,
  vFullscreenImgInstall,
} from 'maz-ui/directives/vFullscreenImg'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(vFullscreenImgInstall)
})

declare module 'vue' {
  interface GlobalDirectives {
    vFullscreenImg: VFullscreenImgDirective
  }
}
