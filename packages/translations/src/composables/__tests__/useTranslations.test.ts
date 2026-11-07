import type { MazUiTranslationsInstance } from '../../types'
import { createApp, defineComponent } from 'vue'
import { getActiveTranslations, setActiveTranslations } from '../../utils/active-instance'
import { createMazUiTranslations } from '../../utils/instance'
import { useTranslations } from '../useTranslations'

const { isServer } = vi.hoisted(() => ({
  isServer: vi.fn(() => false),
}))

vi.mock('@maz-ui/utils/helpers/isServer', () => ({ isServer }))

vi.mock('../../utils/active-instance', () => {
  let active: MazUiTranslationsInstance | undefined
  return {
    getActiveTranslations: vi.fn(() => active),
    setActiveTranslations: vi.fn((i18n: MazUiTranslationsInstance | undefined) => {
      active = i18n
    }),
  }
})

describe('useTranslations', () => {
  afterEach(() => {
    isServer.mockReturnValue(false)
    setActiveTranslations(undefined as never)
  })

  describe('given a provided instance', () => {
    describe('when useTranslations is called', () => {
      it('then it returns it', () => {
        const i18n = createMazUiTranslations()
        const app = createApp({})
        app.provide('mazTranslations', i18n)

        expect(app.runWithContext(() => useTranslations())).toBe(i18n)
      })
    })
  })

  describe('given an instance on the global properties only', () => {
    describe('when useTranslations is called in a component', () => {
      it('then it returns it', () => {
        const i18n = createMazUiTranslations()
        let result: MazUiTranslationsInstance | undefined
        const app = createApp(defineComponent({
          setup() {
            result = useTranslations()
            return () => null
          },
        }))
        app.config.globalProperties.$mazTranslations = i18n

        app.mount(document.createElement('div'))

        expect(result).toBe(i18n)
        app.unmount()
      })
    })
  })

  describe('given a call outside a component in the browser', () => {
    describe('when an instance was installed before', () => {
      it('then it returns the installed instance', () => {
        const i18n = createMazUiTranslations()
        setActiveTranslations(i18n)

        expect(useTranslations()).toBe(i18n)
        expect(getActiveTranslations).toHaveBeenCalled()
      })
    })
  })

  describe('given an injection context without instance', () => {
    describe('when an instance was installed before', () => {
      it('then it returns the installed instance', () => {
        const i18n = createMazUiTranslations()
        setActiveTranslations(i18n)

        expect(createApp({}).runWithContext(() => useTranslations())).toBe(i18n)
      })
    })
  })

  describe('given a call outside a component on the server', () => {
    describe('when an instance was installed before', () => {
      it('then it never reuses it', () => {
        isServer.mockReturnValue(true)
        setActiveTranslations(createMazUiTranslations())

        expect(() => useTranslations()).toThrow('[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin')
      })
    })
  })

  describe('given no instance', () => {
    describe('when useTranslations is called', () => {
      it('then it throws an installation error', () => {
        expect(() => useTranslations()).toThrow('[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin')
      })
    })
  })
})
