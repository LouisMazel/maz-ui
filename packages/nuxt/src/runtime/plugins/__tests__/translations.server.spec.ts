import { beforeEach, describe, expect, it, vi } from 'vitest'

import translationsPlugin from '../translations'

const { mockSetLocale, mockInstall } = vi.hoisted(() => {
  const mockSetLocale = vi.fn(() => Promise.resolve(undefined))
  return {
    mockSetLocale,
    mockInstall: vi.fn(() => ({
      setLocale: mockSetLocale,
    })),
  }
})

vi.mock('@maz-ui/translations/plugin', () => ({
  MazUiTranslations: { install: mockInstall },
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('translations plugin (server)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInstall.mockReturnValue({ setLocale: mockSetLocale })
    mockSetLocale.mockResolvedValue(undefined)
  })

  it('should set locale on server', async () => {
    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: { locale: 'fr', fallbackLocale: 'en', preloadFallback: true },
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(mockSetLocale).toHaveBeenCalledWith('fr')
  })

  it('should preload fallback locale when different from main locale', async () => {
    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: { locale: 'fr', fallbackLocale: 'en', preloadFallback: true },
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(mockSetLocale).toHaveBeenCalledTimes(3)
    expect(mockSetLocale).toHaveBeenNthCalledWith(1, 'fr')
    expect(mockSetLocale).toHaveBeenNthCalledWith(2, 'en')
    expect(mockSetLocale).toHaveBeenNthCalledWith(3, 'fr')
  })

  it('should not preload fallback locale when same as main locale', async () => {
    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: { locale: 'en', fallbackLocale: 'en' },
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(mockSetLocale).toHaveBeenCalledTimes(1)
    expect(mockSetLocale).toHaveBeenCalledWith('en')
  })

  it('should not preload fallback when preloadFallback is false', async () => {
    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: { locale: 'fr', fallbackLocale: 'en', preloadFallback: false },
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(mockSetLocale).toHaveBeenCalledTimes(1)
    expect(mockSetLocale).toHaveBeenCalledWith('fr')
  })

  it('should use default locale en when not specified', async () => {
    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: {},
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(mockSetLocale).toHaveBeenCalledWith('en')
  })

  it('should warn on locale loading failure', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockSetLocale.mockRejectedValueOnce(new Error('Locale not found'))

    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: { locale: 'zz', fallbackLocale: 'en' },
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(consoleSpy).toHaveBeenCalledWith('Failed to preload locale:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})
