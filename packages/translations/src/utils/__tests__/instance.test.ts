import { createTranslationsStore, legacyStore, locale } from '../../states'
import { createMazUiTranslations } from '../instance'

describe('instance', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('given createMazUiTranslations', () => {
    describe('when called with no options', () => {
      it('then the English messages are available at once', () => {
        const i18n = createMazUiTranslations()

        expect(i18n.locale.value).toBe('en')
        expect(i18n.t('pagination.navAriaLabel')).toBe('page navigation')
        expect(i18n.isLocaleLoaded('en')).toBe(true)
      })

      it('then it exposes the instance API', () => {
        const i18n = createMazUiTranslations()

        expect(i18n.getAvailableLocales()).toContain('fr')
        expect(i18n.getLoadedLocales()).toEqual(['en'])
        expect(i18n.getMessages().en).toHaveProperty('pagination')
        expect(i18n.isLocaleLoading('en')).toBe(false)
      })
    })

    describe('when called with another locale', () => {
      it('then ready resolves once the locale and the fallback are loaded', async () => {
        const i18n = createMazUiTranslations({ locale: 'fr' })

        expect(i18n.isLocaleLoading('fr')).toBe(true)
        await i18n.ready

        expect(i18n.isLocaleLoaded('fr')).toBe(true)
        expect(i18n.isLocaleLoaded('en')).toBe(true)
        expect(i18n.t('pagination.navAriaLabel')).not.toBe('page navigation')
      })
    })

    describe('when the locale is not loaded yet', () => {
      it('then the English message is shown instead of the key', () => {
        const i18n = createMazUiTranslations({ locale: 'pt' })

        expect(i18n.t('pagination.navAriaLabel')).toBe('page navigation')
      })
    })

    describe('when preloadFallback is disabled', () => {
      it('then only the locale is loaded', async () => {
        const i18n = createMazUiTranslations({ locale: 'fr', fallbackLocale: 'de', preloadFallback: false })

        await i18n.ready

        expect(i18n.isLocaleLoaded('de')).toBe(false)
      })
    })

    describe('when called with object and lazy user messages', () => {
      it('then they are merged over the default messages', async () => {
        const i18n = createMazUiTranslations({
          locale: 'en',
          fallbackLocale: 'fr',
          messages: {
            en: {
              pagination: { navAriaLabel: 'Custom nav' },
            },
            fr: () => Promise.resolve({
              default: {
                pagination: { navAriaLabel: 'Navigation perso' },
              },
            }),
          },
        })

        await i18n.ready

        expect(i18n.t('pagination.navAriaLabel')).toBe('Custom nav')
        expect(i18n.t('pagination.screenReader.firstPage', { page: 1 })).toBe('First Page, page 1')
        await i18n.setLocale('fr')
        expect(i18n.t('pagination.navAriaLabel')).toBe('Navigation perso')
      })
    })

    describe('when two instances are created', () => {
      it('then each one keeps its own locale and messages', async () => {
        const first = createMazUiTranslations({
          locale: 'en',
          messages: {
            en: {
              pagination: { navAriaLabel: 'First' },
            },
          },
        })
        const second = createMazUiTranslations({ locale: 'de' })

        await second.ready

        expect(first.locale.value).toBe('en')
        expect(first.t('pagination.navAriaLabel')).toBe('First')
        expect(second.t('pagination.navAriaLabel')).not.toBe('First')
        expect(locale.value).toBe('en')
      })
    })

    describe('when an instance is created again on the same store', () => {
      it('then the default messages of a customized group are kept', async () => {
        const store = createTranslationsStore()
        const options = {
          messages: {
            en: {
              pagination: { navAriaLabel: 'Custom nav' },
            },
          },
        }

        await createMazUiTranslations(options, { store }).ready
        const again = createMazUiTranslations(options, { store })
        await again.ready

        expect(again.t('pagination.navAriaLabel')).toBe('Custom nav')
        expect(again.t('pagination.screenReader.firstPage', { page: 1 })).toBe('First Page, page 1')
      })
    })

    describe('when an instance is created again with new messages', () => {
      it('then the locale is loaded again with them', async () => {
        const store = createTranslationsStore()

        await createMazUiTranslations({
          messages: {
            en: {
              pagination: { navAriaLabel: 'Old' },
            },
          },
        }, { store }).ready
        const again = createMazUiTranslations({
          messages: {
            en: {
              pagination: { navAriaLabel: 'New' },
            },
          },
        }, { store })
        await again.ready

        expect(again.t('pagination.navAriaLabel')).toBe('New')
      })
    })

    describe('when setLocaleMessage is called on the instance', () => {
      it('then the messages are added to its store only', () => {
        const i18n = createMazUiTranslations()

        i18n.setLocaleMessage('en', {
          pagination: { navAriaLabel: 'Added' },
        })

        expect(i18n.t('pagination.navAriaLabel')).toBe('Added')
        expect(legacyStore.state.messages.en).toBeUndefined()
      })
    })
  })
})
