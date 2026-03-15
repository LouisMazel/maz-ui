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

describe('translations plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInstall.mockReturnValue({ setLocale: mockSetLocale })
    mockSetLocale.mockResolvedValue(undefined)
  })

  it('should install MazUiTranslations on the vueApp', async () => {
    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: { locale: 'en' },
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(mockInstall).toHaveBeenCalledWith(vueApp, { locale: 'en' })
  })

  it('should use empty object when translations config is falsy', async () => {
    const vueApp = {}
    const context = {
      vueApp,
      $config: {
        public: {
          mazUi: {
            translations: undefined,
          },
        },
      },
    }

    await (translationsPlugin as (...args: any[]) => any)(context)

    expect(mockInstall).toHaveBeenCalledWith(vueApp, {})
  })
})
