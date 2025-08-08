import type { App } from 'vue'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { MazUiTranslations } from '@maz-ui/translations'
import { MazUi } from '@plugins/maz-ui'
import { vi } from 'vitest'

vi.mock('@maz-ui/themes/plugin', () => ({
  MazUiTheme: {
    install: vi.fn(),
  },
}))

vi.mock('@maz-ui/translations', () => ({
  MazUiTranslations: {
    install: vi.fn(),
  },
}))

describe('given MazUi plugin', () => {
  let mockApp: App

  beforeEach(() => {
    mockApp = {
      use: vi.fn(),
    } as unknown as App
    vi.clearAllMocks()
  })

  describe('when installing with no options', () => {
    it('then it should install theme and translations plugins with undefined options', () => {
      MazUi.install?.(mockApp)

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, undefined)
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, undefined)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with empty options', () => {
    it('then it should install theme and translations plugins with undefined options', () => {
      MazUi.install?.(mockApp, {})

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, undefined)
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, undefined)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with theme options', () => {
    it('then it should install theme plugin with provided options', () => {
      const themeOptions = {
        strategy: 'hybrid' as const,
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

      MazUi.install?.(mockApp, { translations: translationsOptions })

      expect(mockApp.use).toHaveBeenCalledWith(MazUiTheme, undefined)
      expect(mockApp.use).toHaveBeenCalledWith(MazUiTranslations, translationsOptions)
      expect(mockApp.use).toHaveBeenCalledTimes(2)
    })
  })

  describe('when installing with both theme and translations options', () => {
    it('then it should install both plugins with their respective options', () => {
      const themeOptions = {
        strategy: 'hybrid' as const,
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
})
