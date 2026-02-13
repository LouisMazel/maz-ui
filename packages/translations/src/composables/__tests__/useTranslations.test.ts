import type { MazUiTranslationsInstance } from '../../types'
import { getCurrentInstance, inject } from 'vue'
import { useTranslations } from '../useTranslations'

const mockInstance: MazUiTranslationsInstance = {
  locale: { value: 'en' },
  t: vi.fn(),
  setLocale: vi.fn(),
  isLocaleLoaded: vi.fn(),
  isLocaleLoading: vi.fn(),
  setLocaleMessage: vi.fn(),
  getMessages: vi.fn(),
  getLoadedLocales: vi.fn(),
  getAvailableLocales: vi.fn(),
} as unknown as MazUiTranslationsInstance

vi.mock('vue', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue')>()

  return {
    ...original,
    inject: vi.fn(),
    getCurrentInstance: vi.fn(),
  }
})

describe('useTranslations', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given useTranslations composable', () => {
    describe('when translations instance is available via inject', () => {
      it('then it returns the injected instance', () => {
        vi.mocked(inject).mockReturnValue(mockInstance)

        const result = useTranslations()

        expect(result).toBe(mockInstance)
      })
    })

    describe('when inject returns undefined', () => {
      describe('when globalProperties has $mazTranslations', () => {
        it('then it returns the instance from globalProperties', () => {
          vi.mocked(inject).mockReturnValue(undefined)
          vi.mocked(getCurrentInstance).mockReturnValue({
            appContext: {
              app: {
                config: {
                  globalProperties: {
                    $mazTranslations: mockInstance,
                  },
                },
              },
            },
          } as never)

          const result = useTranslations()

          expect(result).toBe(mockInstance)
        })
      })

      describe('when getCurrentInstance returns null', () => {
        it('then it throws an error with the installation message', () => {
          vi.mocked(inject).mockReturnValue(undefined)
          vi.mocked(getCurrentInstance).mockReturnValue(null)

          expect(() => useTranslations()).toThrowError(
            '[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin, or wrap your components in a MazUiProvider, before using useTranslations composable',
          )
        })
      })

      describe('when getCurrentInstance returns incomplete context', () => {
        it('then it throws an error with the installation message', () => {
          vi.mocked(inject).mockReturnValue(undefined)
          vi.mocked(getCurrentInstance).mockReturnValue({
            appContext: {
              app: {
                config: {
                  globalProperties: {},
                },
              },
            },
          } as never)

          expect(() => useTranslations()).toThrowError(
            '[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin, or wrap your components in a MazUiProvider, before using useTranslations composable',
          )
        })
      })

      describe('when getCurrentInstance returns context with undefined globalProperties', () => {
        it('then it throws an error with the installation message', () => {
          vi.mocked(inject).mockReturnValue(undefined)
          vi.mocked(getCurrentInstance).mockReturnValue({
            appContext: {
              app: {
                config: {
                  globalProperties: undefined,
                },
              },
            },
          } as never)

          expect(() => useTranslations()).toThrowError(
            '[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin, or wrap your components in a MazUiProvider, before using useTranslations composable',
          )
        })
      })
    })
  })
})
