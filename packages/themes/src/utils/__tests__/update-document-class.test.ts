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
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    darkClass: 'dark',
    ...overrides,
  }
}

describe('update-document-class', () => {
  afterEach(() => {
    vi.clearAllMocks()
    document.documentElement.classList.remove('dark', 'custom-dark')
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
        updateDocumentClass(true, state)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when no state is provided', () => {
      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')

        updateDocumentClass(true, undefined)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when darkModeStrategy is media', () => {
      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ darkModeStrategy: 'media' })

        updateDocumentClass(true, state)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when mode is light', () => {
      it('then it returns early without modifications', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ mode: 'light' })

        updateDocumentClass(true, state)

        expect(noTransition).not.toHaveBeenCalled()
      })
    })

    describe('when isDark is true and state is valid', () => {
      it('then it adds the dark class to documentElement', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState()

        updateDocumentClass(true, state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    describe('when isDark is false and state is valid', () => {
      it('then it removes the dark class from documentElement', async () => {
        const { noTransition } = await import('../no-transition')
        document.documentElement.classList.add('dark')
        const state = createThemeState()

        updateDocumentClass(false, state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })
    })

    describe('when a custom darkClass is configured', () => {
      it('then it adds the custom class when isDark is true', () => {
        const state = createThemeState({ darkClass: 'custom-dark' })

        updateDocumentClass(true, state)

        expect(document.documentElement.classList.contains('custom-dark')).toBe(true)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })

      it('then it removes the custom class when isDark is false', () => {
        document.documentElement.classList.add('custom-dark')
        const state = createThemeState({ darkClass: 'custom-dark' })

        updateDocumentClass(false, state)

        expect(document.documentElement.classList.contains('custom-dark')).toBe(false)
      })
    })

    describe('when mode is both and darkModeStrategy is class', () => {
      it('then it proceeds with class manipulation', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ mode: 'both', darkModeStrategy: 'class' })

        updateDocumentClass(true, state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    describe('when mode is dark and darkModeStrategy is class', () => {
      it('then it proceeds with class manipulation', async () => {
        const { noTransition } = await import('../no-transition')
        const state = createThemeState({ mode: 'dark', darkModeStrategy: 'class' })

        updateDocumentClass(true, state)

        expect(noTransition).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })
  })
})
