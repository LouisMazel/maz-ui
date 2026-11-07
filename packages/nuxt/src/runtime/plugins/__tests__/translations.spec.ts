import type { MazUiTranslationsInstance } from '@maz-ui/translations'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

import translationsPlugin from '../translations'

vi.mock('#build/maz-ui-translations.mjs', () => ({
  default: {
    fr: {
      pagination: { navAriaLabel: 'Navigation perso' },
    },
  },
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

async function runPlugin(translations: Record<string, unknown>) {
  const vueApp = createApp({})
  await (translationsPlugin as (...args: any[]) => any)({
    vueApp,
    $config: {
      public: {
        mazUi: { translations },
      },
    },
  })

  return vueApp.config.globalProperties.$mazTranslations as MazUiTranslationsInstance
}

describe('translations plugin', () => {
  describe('given messages from the module template', () => {
    describe('when the plugin resolves', () => {
      it('then the locale and the fallback locale are loaded with them', async () => {
        const i18n = await runPlugin({ locale: 'fr', fallbackLocale: 'en' })

        expect(i18n.locale.value).toBe('fr')
        expect(i18n.isLocaleLoaded('fr')).toBe(true)
        expect(i18n.isLocaleLoaded('en')).toBe(true)
        expect(i18n.t('pagination.navAriaLabel')).toBe('Navigation perso')
      })
    })
  })

  describe('given preloadFallback disabled', () => {
    describe('when the plugin resolves', () => {
      it('then only the locale is loaded', async () => {
        const i18n = await runPlugin({ locale: 'fr', fallbackLocale: 'de', preloadFallback: false })

        expect(i18n.isLocaleLoaded('fr')).toBe(true)
        expect(i18n.isLocaleLoaded('de')).toBe(false)
      })
    })
  })

  describe('given no translations config', () => {
    describe('when the plugin resolves', () => {
      it('then the locale is English', async () => {
        const vueApp = createApp({})
        await (translationsPlugin as (...args: any[]) => any)({
          vueApp,
          $config: {
            public: { mazUi: {} },
          },
        })

        expect(vueApp.config.globalProperties.$mazTranslations.t('pagination.navAriaLabel')).toBe('page navigation')
      })
    })
  })
})
