import type { App } from 'vue'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { MazUiTranslations } from '@maz-ui/translations/plugin'
import { AosPlugin } from '@plugins/aos.ts'
import { MazUi } from '@plugins/maz-ui.ts'
import { vi } from 'vitest'
import { EXTERNAL_LINKS_INJECTION_KEY } from '@/utils/externalLinks.ts'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

vi.mock('@maz-ui/themes/plugin', () => ({
  MazUiTheme: {
    install: vi.fn(),
  },
}))

vi.mock('@maz-ui/translations/plugin', () => ({
  MazUiTranslations: {
    install: vi.fn(),
  },
}))

describe('given MazUi plugin', () => {
  let mockApp: App

  beforeEach(() => {
    mockApp = {
      use: vi.fn(),
      provide: vi.fn(),
    } as unknown as App
    vi.clearAllMocks()
  })

  describe('when installing with no options', () => {
    it('then it should install theme and translations plugins with undefined options', () => {
      MazUi.install?.(mockApp, {
        theme: {
          preset: {} as any,
        },
        translations: undefined,
      })

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, {
        preset: {} as any,
      })
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, undefined)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with empty options', () => {
    it('then it should install theme and translations plugins with undefined options', () => {
      MazUi.install?.(mockApp, {
        theme: {
          preset: {} as any,
        },
        translations: undefined,
      })

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, {
        preset: {} as any,
      })
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, undefined)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with theme options', () => {
    it('then it should install theme plugin with provided options', () => {
      const themeOptions = {
        preset: {} as any,
        strategy: 'runtime' as const,
        darkMode: 'class' as const,
      }

      MazUi.install?.(mockApp, { theme: themeOptions })

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, themeOptions)
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, undefined)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with translations options', () => {
    it('then it should install translations plugin with provided options', () => {
      const translationsOptions = {
        locale: 'en',
        translations: {
          en: { hello: 'Hello' },
          fr: { hello: 'Bonjour' },
        },
      }

      MazUi.install?.(mockApp, {
        theme: {
          preset: {} as any,
        },
        translations: translationsOptions,
      })

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, {
        preset: {} as any,
      })
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, translationsOptions)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with both theme and translations options', () => {
    it('then it should install both plugins with their respective options', () => {
      const themeOptions = {
        preset: {} as any,
        strategy: 'runtime' as const,
        darkMode: 'class' as const,
      }

      const translationsOptions = {
        locale: 'fr',
        translations: {
          en: { hello: 'Hello' },
          fr: { hello: 'Bonjour' },
        },
      }

      MazUi.install?.(mockApp, {
        theme: themeOptions,
        translations: translationsOptions,
      })

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, themeOptions)
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, translationsOptions)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with toast and dialog options', () => {
    it('then it provides the app and the options to the composables', () => {
      const toast = { position: 'top-right' as const }
      const dialog = { acceptText: 'Yes' }

      MazUi.install?.(mockApp, {
        theme: {
          preset: {} as any,
        },
        toast,
        dialog,
      })

      expect(mockApp.provide).toHaveBeenCalledWith(MAZ_UI_CONTEXT_INJECTION_KEY, { app: mockApp, toast, dialog })
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with aos enabled', () => {
    it('then it installs the aos plugin with the default options', () => {
      MazUi.install?.(mockApp, {
        theme: {
          preset: {} as any,
        },
        aos: true,
      })

      expect(mockApp.use).toHaveBeenCalledWith(AosPlugin, undefined)
    })
  })

  describe('when installing with aos options', () => {
    it('then it installs the aos plugin with these options', () => {
      const aos = { delay: 200 }

      MazUi.install?.(mockApp, {
        theme: {
          preset: {} as any,
        },
        aos,
      })

      expect(mockApp.use).toHaveBeenCalledWith(AosPlugin, aos)
    })
  })

  describe('when installing with openExternal', () => {
    it('then it provides the external links options', () => {
      const openExternal = vi.fn()
      const isExternalLink = vi.fn()

      MazUi.install?.(mockApp, { theme: { preset: {} as any }, openExternal, isExternalLink })

      expect(mockApp.provide).toHaveBeenCalledWith(EXTERNAL_LINKS_INJECTION_KEY, { openExternal, isExternalLink })
    })
  })

  describe('when installing without openExternal', () => {
    it('then it provides nothing for the external links', () => {
      MazUi.install?.(mockApp, { theme: { preset: {} as any } })

      expect(mockApp.provide).not.toHaveBeenCalledWith(EXTERNAL_LINKS_INJECTION_KEY, expect.anything())
    })
  })
})
