import type { MazUiDefaultsOptions } from 'maz-ui/composables/useGlobalConfig'
import { GLOBAL_CONFIG_INJECTION_KEY } from 'maz-ui/composables/useGlobalConfig'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const defaults = $config.public.mazUi?.defaults as MazUiDefaultsOptions | undefined

  if (defaults && Object.keys(defaults).length > 0) {
    vueApp.provide(GLOBAL_CONFIG_INJECTION_KEY, defaults)
  }
})
