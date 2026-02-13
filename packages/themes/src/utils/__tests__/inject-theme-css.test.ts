import type { MazUiThemeOptions } from '../../plugin'
import type { ThemePreset } from '../../types'
import { nextTick } from 'vue'
import { injectThemeCSS } from '../inject-theme-css'

vi.mock('../css-generator', () => ({
  CSS_ID: 'maz-theme-css',
  generateCSS: vi.fn(() => 'generated-css'),
  injectCSS: vi.fn(),
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    nextTick: vi.fn((fn: () => void) => fn()),
  }
})

function createMockPreset(): ThemePreset {
  return {
    name: 'test-preset',
    colors: {
      light: {
        'background': '0 0% 100%',
        'foreground': '0 0% 0%',
        'primary': '210 50% 50%',
        'primary-foreground': '0 0% 100%',
        'secondary': '180 30% 60%',
        'secondary-foreground': '0 0% 0%',
        'accent': '300 40% 50%',
        'accent-foreground': '0 0% 100%',
        'info': '200 80% 50%',
        'info-foreground': '0 0% 100%',
        'contrast': '0 0% 10%',
        'contrast-foreground': '0 0% 100%',
        'destructive': '0 70% 50%',
        'destructive-foreground': '0 0% 100%',
        'success': '120 50% 40%',
        'success-foreground': '0 0% 100%',
        'warning': '40 90% 50%',
        'warning-foreground': '0 0% 0%',
        'overlay': '0 0% 0%',
        'muted': '0 0% 90%',
        'border': '0 0% 80%',
        'shadow': '0 0% 0%',
      },
      dark: {
        'background': '0 0% 10%',
        'foreground': '0 0% 100%',
        'primary': '210 50% 60%',
        'primary-foreground': '0 0% 0%',
        'secondary': '180 30% 40%',
        'secondary-foreground': '0 0% 100%',
        'accent': '300 40% 60%',
        'accent-foreground': '0 0% 0%',
        'info': '200 80% 60%',
        'info-foreground': '0 0% 0%',
        'contrast': '0 0% 90%',
        'contrast-foreground': '0 0% 0%',
        'destructive': '0 70% 60%',
        'destructive-foreground': '0 0% 0%',
        'success': '120 50% 50%',
        'success-foreground': '0 0% 0%',
        'warning': '40 90% 60%',
        'warning-foreground': '0 0% 0%',
        'overlay': '0 0% 0%',
        'muted': '0 0% 20%',
        'border': '0 0% 30%',
        'shadow': '0 0% 0%',
      },
    },
    foundation: {
      'radius': '0.5rem',
      'border-width': '1px',
    },
  } as unknown as ThemePreset
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
    injectCriticalCSS: false,
    injectFullCSS: true,
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

        const preset = createMockPreset()
        const config = createConfig()

        injectThemeCSS(preset, config)

        expect(generateCSS).not.toHaveBeenCalled()
        expect(injectCSS).not.toHaveBeenCalled()
      })
    })

    describe('when injectCriticalCSS is true', () => {
      it('then it generates and injects critical CSS', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')

        const preset = createMockPreset()
        const config = createConfig({ injectCriticalCSS: true, injectFullCSS: false })

        injectThemeCSS(preset, config)

        expect(generateCSS).toHaveBeenCalledWith(preset, expect.objectContaining({
          onlyCritical: true,
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        }))
        expect(injectCSS).toHaveBeenCalledWith('maz-theme-css', 'generated-css')
      })
    })

    describe('when injectCriticalCSS is false', () => {
      it('then it does not generate critical CSS', async () => {
        const { generateCSS } = await import('../css-generator')

        const preset = createMockPreset()
        const config = createConfig({ injectCriticalCSS: false, injectFullCSS: true, strategy: 'runtime' })

        injectThemeCSS(preset, config)

        expect(generateCSS).not.toHaveBeenCalledWith(preset, expect.objectContaining({
          onlyCritical: true,
        }))
      })
    })

    describe('when injectFullCSS is false', () => {
      it('then it returns early after critical CSS', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')

        const preset = createMockPreset()
        const config = createConfig({ injectCriticalCSS: false, injectFullCSS: false })

        injectThemeCSS(preset, config)

        expect(generateCSS).not.toHaveBeenCalled()
        expect(injectCSS).not.toHaveBeenCalled()
      })

      it('then critical CSS is still injected if injectCriticalCSS is true', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')

        const preset = createMockPreset()
        const config = createConfig({ injectCriticalCSS: true, injectFullCSS: false })

        injectThemeCSS(preset, config)

        expect(generateCSS).toHaveBeenCalledOnce()
        expect(generateCSS).toHaveBeenCalledWith(preset, expect.objectContaining({ onlyCritical: true }))
        expect(injectCSS).toHaveBeenCalledOnce()
      })
    })

    describe('when strategy is runtime', () => {
      it('then it injects full CSS synchronously', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')

        const preset = createMockPreset()
        const config = createConfig({ strategy: 'runtime', injectFullCSS: true })

        injectThemeCSS(preset, config)

        expect(generateCSS).toHaveBeenCalledWith(preset, expect.objectContaining({
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        }))
        expect(injectCSS).toHaveBeenCalledWith('maz-theme-css', 'generated-css')
      })
    })

    describe('when strategy is hybrid and requestIdleCallback is available', () => {
      it('then it defers injection via requestIdleCallback', async () => {
        const { injectCSS } = await import('../css-generator')
        const mockRequestIdleCallback = vi.fn((cb: IdleRequestCallback) => {
          cb({} as IdleDeadline)
          return 1
        })
        vi.stubGlobal('requestIdleCallback', mockRequestIdleCallback)

        const preset = createMockPreset()
        const config = createConfig({ strategy: 'hybrid', injectFullCSS: true })

        injectThemeCSS(preset, config)

        expect(mockRequestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 100 })
        expect(injectCSS).toHaveBeenCalledWith('maz-theme-css', 'generated-css')

        vi.unstubAllGlobals()
      })
    })

    describe('when strategy is hybrid and requestIdleCallback is unavailable', () => {
      it('then it falls back to nextTick', async () => {
        const { injectCSS } = await import('../css-generator')
        vi.stubGlobal('requestIdleCallback', undefined)

        const preset = createMockPreset()
        const config = createConfig({ strategy: 'hybrid', injectFullCSS: true })

        injectThemeCSS(preset, config)

        expect(nextTick).toHaveBeenCalledWith(expect.any(Function))
        expect(injectCSS).toHaveBeenCalledWith('maz-theme-css', 'generated-css')

        vi.unstubAllGlobals()
      })
    })

    describe('when both critical and full CSS are enabled with runtime strategy', () => {
      it('then it generates both critical and full CSS', async () => {
        const { generateCSS, injectCSS } = await import('../css-generator')

        const preset = createMockPreset()
        const config = createConfig({ injectCriticalCSS: true, injectFullCSS: true, strategy: 'runtime' })

        injectThemeCSS(preset, config)

        expect(generateCSS).toHaveBeenCalledTimes(2)
        expect(generateCSS).toHaveBeenCalledWith(preset, expect.objectContaining({ onlyCritical: true }))
        expect(generateCSS).toHaveBeenCalledWith(preset, expect.not.objectContaining({ onlyCritical: true }))
        expect(injectCSS).toHaveBeenCalledTimes(2)
      })
    })

    describe('when CSS options reflect the config values', () => {
      it('then it passes the correct mode and darkModeStrategy', async () => {
        const { generateCSS } = await import('../css-generator')

        const preset = createMockPreset()
        const config = createConfig({
          mode: 'dark',
          darkModeStrategy: 'media',
          darkClass: 'night-mode',
          strategy: 'runtime',
          injectFullCSS: true,
        })

        injectThemeCSS(preset, config)

        expect(generateCSS).toHaveBeenCalledWith(preset, {
          mode: 'dark',
          darkSelectorStrategy: 'media',
          darkClass: 'night-mode',
        })
      })
    })
  })
})
