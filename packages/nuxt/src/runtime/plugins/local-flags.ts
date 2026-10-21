import type { MazUiDefaultsOptions } from 'maz-ui/composables/useGlobalConfig'
import { GLOBAL_CONFIG_INJECTION_KEY } from 'maz-ui/composables/useGlobalConfig'
import { defineNuxtPlugin } from 'nuxt/app'

/**
 * Added only with `flags: 'local'`. The loaders of the flags are imported on demand,
 * so they stay out of the entry chunk: each flag is a separate chunk, downloaded only when displayed.
 */
async function loadCountryFlag(code: string): Promise<string | undefined> {
  const { loadCountryFlag } = await import('maz-ui/country-flags')

  return loadCountryFlag(code)
}

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const defaults = ($config.public.mazUi?.defaults ?? {}) as MazUiDefaultsOptions

  vueApp.provide(GLOBAL_CONFIG_INJECTION_KEY, {
    ...defaults,
    global: { flagSrc: loadCountryFlag, ...defaults.global },
  })
})
