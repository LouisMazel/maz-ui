import type { ThemeState } from '../../types'
import { updateDocumentClass } from '../update-document-class'

vi.mock('../no-transition', () => ({
  noTransition: vi.fn((fn: () => void) => fn()),
}))

function createThemeState(overrides: Partial<ThemeState> = {}): ThemeState {
  return {
    colorMode: 'auto',
    isDark: false,
    mode: 'both',
    strategy: 'runtime',
    darkModeStrategy: 'class',
    darkClass: 'dark',
    lightClass: 'light',
    colorTransition: false,
    _rawColorTransition: false,
    persistPreset: true,
    ...overrides,
  }
}

describe('update-document-class', () => {
  afterEach(() => {
    vi.clearAllMocks()
    document.documentElement.classList.remove('dark', 'light', 'custom-dark', 'custom-light')
  })

  describe('given updateDocumentClass function', () => {
    describe('when document is undefined', () => {
      afterEach(() => {
        vi.unstubAllGlobals()
      })

      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')
        vi.stubGlobal('document', undefined)

        const state = createThemeState()
        updateDocumentClass('dark', state)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when no state is provided', () => {
      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')

        updateDocumentClass('dark', undefined)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when darkModeStrategy is media', () => {
      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ darkModeStrategy: 'media' })

        updateDocumentClass('dark', state)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when mode is light', () => {
      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ mode: 'light' })

        updateDocumentClass('dark', state)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when mode is dark', () => {
      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ mode: 'dark' })

        updateDocumentClass('dark', state)

        expect(noTransition).not.toHaveBeenCalled()
        expect(document.documentElement.classList.contains('dark')).toBe(false)
        expect(document.documentElement.classList.contains('light')).toBe(false)
      })
    })

    describe('when colorMode is dark and state is valid', () => {
      it('then it adds the dark class to documentElement', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState()

        updateDocumentClass('dark', state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(document.documentElement.classList.contains('light')).toBe(false)
      })
    })

    describe('when colorMode is light and state is valid', () => {
      it('then it adds the light class and removes the dark class', async () => {
        const { noTransition } = await import('../no-transition')
        document.documentElement.classList.add('dark')
        const state = createThemeState()

        updateDocumentClass('light', state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('light')).toBe(true)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })
    })

    describe('when colorMode is auto and state is valid', () => {
      it('then it removes both dark and light classes', async () => {
        const { noTransition } = await import('../no-transition')
        document.documentElement.classList.add('dark', 'light')
        const state = createThemeState()

        updateDocumentClass('auto', state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(false)
        expect(document.documentElement.classList.contains('light')).toBe(false)
      })
    })

    describe('when a custom darkClass is configured', () => {
      it('then it adds the custom dark class when colorMode is dark', () => {
        const state = createThemeState({ darkClass: 'custom-dark' })

        updateDocumentClass('dark', state)

        expect(document.documentElement.classList.contains('custom-dark')).toBe(true)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })

      it('then it removes the custom dark class when colorMode is light', () => {
        document.documentElement.classList.add('custom-dark')
        const state = createThemeState({ darkClass: 'custom-dark' })

        updateDocumentClass('light', state)

        expect(document.documentElement.classList.contains('custom-dark')).toBe(false)
      })
    })

    describe('when a custom lightClass is configured', () => {
      it('then it adds the custom light class when colorMode is light', () => {
        const state = createThemeState({ lightClass: 'custom-light' })

        updateDocumentClass('light', state)

        expect(document.documentElement.classList.contains('custom-light')).toBe(true)
        expect(document.documentElement.classList.contains('light')).toBe(false)
      })

      it('then it removes the custom light class when colorMode is auto', () => {
        document.documentElement.classList.add('custom-light')
        const state = createThemeState({ lightClass: 'custom-light' })

        updateDocumentClass('auto', state)

        expect(document.documentElement.classList.contains('custom-light')).toBe(false)
      })
    })

    describe('when mode is both and darkModeStrategy is class', () => {
      it('then it proceeds with class manipulation', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ mode: 'both', darkModeStrategy: 'class' })

        updateDocumentClass('dark', state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    describe('when colorTransition is enabled (object)', () => {
      it('then it skips the noTransition wrap so the CSS transition plays', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ colorTransition: { duration: '200ms', easing: 'ease-in-out' } })

        updateDocumentClass('dark', state)

        expect(noTransition).not.toHaveBeenCalled()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    describe('when colorTransition is false', () => {
      it('then it wraps in noTransition for an instant switch', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ colorTransition: false })

        updateDocumentClass('dark', state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })
  })
})
