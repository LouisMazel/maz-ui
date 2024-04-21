import { defineNuxtPlugin } from '#imports'
import { vTooltipInstall } from 'maz-ui'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const installVTooltip = $config.public.mazUi?.installVTooltip

  const options = typeof installVTooltip === 'object' ? installVTooltip : undefined

  vueApp.use(vTooltipInstall, options)
})
