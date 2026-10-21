import { GLOBAL_CONFIG_INJECTION_KEY } from 'maz-ui/composables/useGlobalConfig'
import { describe, expect, it, vi } from 'vitest'

import localFlagsPlugin from '../local-flags'

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: (plugin: unknown) => plugin,
}))

function runPlugin(defaults?: Record<string, unknown>) {
  const provide = vi.fn()

  ;(localFlagsPlugin as unknown as (nuxtApp: unknown) => void)({
    vueApp: { provide },
    $config: { public: { mazUi: { defaults } } },
  })

  return provide.mock.calls[0] ?? []
}

describe('given the local flags plugin', () => {
  describe('when it runs without other defaults', () => {
    it('then it provides a global flag source that loads the flags of @maz-ui/icons', async () => {
      const [key, value] = runPlugin()

      expect(key).toBe(GLOBAL_CONFIG_INJECTION_KEY)
      expect(await value.global.flagSrc('FR')).toMatch(/^data:image\/svg\+xml/)
      expect(await value.global.flagSrc('XX')).toBeUndefined()
    })
  })

  describe('when other defaults are set', () => {
    it('then it keeps them and a global flag source set in defaults wins', () => {
      const [, value] = runPlugin({ MazBtn: { size: 'lg' }, global: { roundedSize: 'full', flagSrc: '/mine/{code}.svg' } })

      expect(value).toEqual({ MazBtn: { size: 'lg' }, global: { roundedSize: 'full', flagSrc: '/mine/{code}.svg' } })
    })
  })
})
