import { createApp } from 'vue'
import { MazUiTranslations } from '../plugin'
import { globalState, locale } from '../states'
import { getActiveTranslations } from '../utils/active-instance'

const { isServer } = vi.hoisted(() => ({
  isServer: vi.fn(() => false),
}))

vi.mock('@maz-ui/utils/helpers/isServer', () => ({ isServer }))

describe('plugin', () => {
  afterEach(() => {
    isServer.mockReturnValue(false)
    locale.value = 'en'
  })

  describe('given MazUiTranslations', () => {
    describe('when it is installed in the browser', () => {
      it('then it provides the instance and keeps the deprecated exports in sync', async () => {
        const app = createApp({})

        app.use(MazUiTranslations, { locale: 'fr' })
        const i18n = app.config.globalProperties.$mazTranslations
        await i18n.ready

        expect(getActiveTranslations()).toBe(i18n)
        expect(i18n.locale).toBe(locale)
        expect(locale.value).toBe('fr')
        expect(globalState.loadedLocales.has('fr')).toBe(true)
      })
    })

    describe('when it is installed without options', () => {
      it('then the locale is English', () => {
        const app = createApp({})

        app.use(MazUiTranslations)

        expect(app.config.globalProperties.$mazTranslations.locale.value).toBe('en')
      })
    })

    describe('when it is installed on the server', () => {
      it('then every request gets its own state', () => {
        isServer.mockReturnValue(true)
        const first = createApp({})
        const second = createApp({})

        first.use(MazUiTranslations, { locale: 'fr' })
        second.use(MazUiTranslations, { locale: 'de' })

        expect(first.config.globalProperties.$mazTranslations.locale.value).toBe('fr')
        expect(second.config.globalProperties.$mazTranslations.locale.value).toBe('de')
        expect(first.config.globalProperties.$mazTranslations.locale).not.toBe(locale)
      })
    })
  })
})
