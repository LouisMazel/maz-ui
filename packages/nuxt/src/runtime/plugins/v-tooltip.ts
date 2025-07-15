import { type VTooltipDirective, vTooltipInstall } from 'maz-ui/directives/vTooltip'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const vTooltipOptions = $config.public.mazUi?.directives?.vTooltip

  const options = typeof vTooltipOptions === 'object' ? vTooltipOptions : undefined

  vueApp.use(vTooltipInstall, options)
})

declare module 'vue' {
  interface GlobalDirectives {
    vTooltip: VTooltipDirective
  }
}
