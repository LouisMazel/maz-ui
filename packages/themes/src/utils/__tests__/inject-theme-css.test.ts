import type { MazUiThemeOptions } from '../../plugin'
import type { ThemePreset } from '../../types'
import { injectThemeCSS } from '../inject-theme-css'

vi.mock('../css-generator', () => ({
  CSS_ID: 'maz-theme-css',
  generateCSS: vi.fn(() => 'generated-css'),
  injectCSS: vi.fn(),
}))

function createMockPreset(): ThemePreset {
  return {
    name: 'test-preset',
    colors: {
      light: {} as never,
      dark: {} as never,
    },
    foundation: {
      'border-width': '1px',
    },
    scales: {
      rounded: { md: '0.5rem' },
      shadow: { md: '0 1px 2px rgba(0,0,0,0.1)' },
    } as never,
  }
}

type FullConfig = Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>

function createConfig(overrides: Partial<FullConfig> = {}): FullConfig {
  return {
    preset: createMockPreset(),
    strategy: 'runtime',
    darkClass: 'dark',
    darkModeStrategy: 'class',
    colorMode: 'auto',
    mode: 'both',
    overrides: {},
    persistPreset: true,
    ...overrides,
  } as FullConfig
}

describe('inject-theme-css', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given injectThemeCSS function', () => {
    describe('when document is undefined', () => {
      afterEach(() => {
        vi.unstubAllGlobals()
      })

      it('then it returns early without generating CSS', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')
        vi.stubGlobal('document', undefined)

        injectThemeCSS(createMockPreset(), createConfig())

        expect(generateCSS).not.toHaveBeenCalled()
        expect(injectCSS).not.toHaveBeenCalled()
      })
    })

    describe('when strategy is runtime', () => {
      it('then it generates and injects the full CSS in one shot', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')
        const preset = createMockPreset()

        injectThemeCSS(preset, createConfig({ strategy: 'runtime' }))

        expect(generateCSS).toHaveBeenCalledTimes(1)
        expect(generateCSS).toHaveBeenCalledWith(preset, expect.objectContaining({
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        }))
        expect(injectCSS).toHaveBeenCalledWith('maz-theme-css', 'generated-css')
      })
    })

    describe('when strategy is buildtime', () => {
      it('then it skips the runtime injection', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')

        injectThemeCSS(createMockPreset(), createConfig({ strategy: 'buildtime' }))

        expect(generateCSS).not.toHaveBeenCalled()
        expect(injectCSS).not.toHaveBeenCalled()
      })
    })

    describe('when CSS options reflect the config values', () => {
      it('then it forwards mode, darkSelectorStrategy and darkClass', async () => {
        const { generateCSS } = await import('../css-generator')
        const preset = createMockPreset()

        injectThemeCSS(preset, createConfig({
          mode: 'dark',
          darkModeStrategy: 'media',
          darkClass: 'night-mode',
        }))

        expect(generateCSS).toHaveBeenCalledWith(preset, {
          mode: 'dark',
          darkSelectorStrategy: 'media',
          darkClass: 'night-mode',
        })
      })
    })
  })
})
