import { vTooltipInstall } from 'maz-ui/directives/vTooltip'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const installVTooltip = $config.public.mazUi?.installVTooltip

  const options = typeof installVTooltip === 'object' ? installVTooltip : undefined

  vueApp.use(vTooltipInstall, options)
})
