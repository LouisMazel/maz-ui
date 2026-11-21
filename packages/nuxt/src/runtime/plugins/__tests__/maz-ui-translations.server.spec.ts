import type { MazUiTranslationsInstance } from '@maz-ui/translations'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

import mazUiPlugin from '../maz-ui'

vi.mock('#build/maz-ui-translations.mjs', () => ({
  default: {
    en: {
      pagination: { navAriaLabel: 'Custom nav' },
    },
  },
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  useHead: vi.fn(),
  useRequestHeaders: vi.fn(() => ({})),
  useRouter: vi.fn(),
}))

vi.mock('maz-ui/plugins/maz-ui', async () => {
  const { MazUiTranslations } = await import('@maz-ui/translations/plugin')

  return {
    MazUi: {
      install: (app: any, options: any) => MazUiTranslations.install?.(app, options.translations),
    },
  }
})

vi.mock('maz-ui/plugins/aos', () => ({
  getAosInstance: vi.fn(),
}))

vi.mock('@maz-ui/themes/utils', () => ({
  getRequestThemeContext: vi.fn(),
  getSystemColorMode: vi.fn(),
  getThemeHead: vi.fn(() => Promise.resolve({})),
  getThemeHeadTags: vi.fn(),
  resolveThemeContext: vi.fn(() => Promise.resolve({})),
}))

async function renderRequest(translations: Record<string, unknown> = { locale: 'en' }) {
  const vueApp = createApp({})
  await (mazUiPlugin as (...args: any[]) => any)({
    vueApp,
    $config: {
      public: {
        mazUi: { translations },
      },
    },
  })

  return vueApp.config.globalProperties.$mazTranslations as MazUiTranslationsInstance
}

describe('maz-ui plugin translations (server)', () => {
  describe('given two requests', () => {
    describe('when the first one switches its locale', () => {
      it('then the second one keeps the configured locale', async () => {
        const first = await renderRequest()
        await first.setLocale('de')

        const second = await renderRequest()

        expect(first.locale.value).toBe('de')
        expect(second.locale.value).toBe('en')
      })
    })

    describe('when the messages are customized', () => {
      it('then every request keeps the default messages of the customized group', async () => {
        await renderRequest()

        const second = await renderRequest()

        expect(second.t('pagination.navAriaLabel')).toBe('Custom nav')
        expect(second.t('pagination.screenReader.firstPage', { page: 1 })).toBe('First Page, page 1')
      })
    })
  })

  describe('given a locale other than the fallback', () => {
    describe('when the request renders', () => {
      it('then both are loaded without switching the locale', async () => {
        const i18n = await renderRequest({ locale: 'it', fallbackLocale: 'en' })

        expect(i18n.locale.value).toBe('it')
        expect(i18n.isLocaleLoaded('it')).toBe(true)
        expect(i18n.isLocaleLoaded('en')).toBe(true)
      })
    })
  })
})
