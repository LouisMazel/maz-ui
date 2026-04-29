import type { ThemePreset, ThemePresetOverrides } from '../types'
import { definePreset } from '../define-preset'

vi.mock('../utils', () => ({
  getPreset: vi.fn(),
}))

vi.mock('../utils/preset-merger', () => ({
  mergePresets: vi.fn(),
}))

const { getPreset } = await import('../utils')
const { mergePresets } = await import('../utils/preset-merger')

const mockPreset: ThemePreset = {
  name: 'test',
  colors: {
    light: {
      'surface': '0 0% 100%',
      'foreground': '210 8% 14%',
      'primary': '210 100% 56%',
      'primary-foreground': '0 0% 100%',
      'secondary': '272 99% 54%',
      'secondary-foreground': '0 0% 100%',
      'accent': '164 76% 46%',
      'accent-foreground': '0 0% 100%',
      'info': '188 78% 41%',
      'info-foreground': '0 0% 100%',
      'contrast': '235 16% 15%',
      'contrast-foreground': '255 0% 95%',
      'destructive': '356 96% 58%',
      'destructive-foreground': '0 0% 100%',
      'success': '80 61% 50%',
      'success-foreground': '210 8% 14%',
      'warning': '40 97% 59%',
      'warning-foreground': '210 8% 14%',
      'overlay': '0 0% 40%',
      'muted': '0 0% 54%',
      'divider': '220 13% 91%',
      'shadow': '240 6% 10%',
    },
    dark: {
      'surface': '235 16% 15%',
      'foreground': '0 0% 85%',
      'primary': '210 100% 56%',
      'primary-foreground': '0 0% 100%',
      'secondary': '272 99% 54%',
      'secondary-foreground': '0 0% 100%',
      'accent': '164 76% 46%',
      'accent-foreground': '0 0% 100%',
      'info': '188 78% 41%',
      'info-foreground': '0 0% 100%',
      'contrast': '0 0% 100%',
      'contrast-foreground': '210 8% 14%',
      'destructive': '1 100% 71%',
      'destructive-foreground': '0 0% 100%',
      'success': '80 61% 50%',
      'success-foreground': '210 8% 14%',
      'warning': '40 97% 59%',
      'warning-foreground': '210 8% 14%',
      'overlay': '0 0% 15%',
      'muted': '255 0% 54%',
      'divider': '238 17% 25%',
      'shadow': '240 4% 16%',
    },
  },
  foundation: {
    'border-width': '1px',
    'space': '0.25rem',
  },
  scales: {
    rounded: {
      'xs': '0.125rem',
      'sm': '0.25rem',
      'md': '0.5rem',
      'lg': '0.75rem',
      'xl': '1rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      elevation: '0 4px 12px -2px rgb(0 0 0 / 0.08)',
    },
  },
}

describe('define-preset', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given definePreset function', () => {
    describe('when base is a ThemePreset object (sync path)', () => {
      it('then it calls mergePresets with the base object and overrides', () => {
        const overrides: ThemePresetOverrides = {
          colors: { light: { primary: '100 50% 50%' } },
        }
        const mergedResult = { ...mockPreset, name: 'merged' }
        vi.mocked(mergePresets).mockReturnValue(mergedResult)

        const result = definePreset({ base: mockPreset, overrides })

        expect(mergePresets).toHaveBeenCalledWith(mockPreset, overrides)
        expect(result).toBe(mergedResult)
      })

      it('then it returns a ThemePreset synchronously, not a Promise', () => {
        vi.mocked(mergePresets).mockReturnValue(mockPreset)

        const result = definePreset({ base: mockPreset, overrides: {} })

        expect(result).not.toBeInstanceOf(Promise)
        expect(result).toBe(mockPreset)
      })
    })

    describe('when base is a string preset name (async path)', () => {
      it('then it calls getPreset with the preset name and returns a Promise', async () => {
        const overrides: ThemePresetOverrides = {
          scales: { rounded: { md: '1rem' } },
        }
        const mergedResult = { ...mockPreset, name: 'merged-async' }
        vi.mocked(getPreset).mockResolvedValue(mockPreset)
        vi.mocked(mergePresets).mockReturnValue(mergedResult)

        const result = definePreset({ base: 'maz-ui', overrides })

        expect(result).toBeInstanceOf(Promise)

        const resolved = await result

        expect(getPreset).toHaveBeenCalledWith('maz-ui')
        expect(mergePresets).toHaveBeenCalledWith(mockPreset, overrides)
        expect(resolved).toBe(mergedResult)
      })

      it('then it resolves getPreset before calling mergePresets', async () => {
        const resolvedPreset = { ...mockPreset, name: 'ocean-resolved' }
        vi.mocked(getPreset).mockResolvedValue(resolvedPreset)
        vi.mocked(mergePresets).mockReturnValue(resolvedPreset)

        await definePreset({ base: 'ocean', overrides: {} })

        expect(getPreset).toHaveBeenCalledWith('ocean')
        expect(mergePresets).toHaveBeenCalledWith(resolvedPreset, {})
      })
    })

    describe('when overrides is an empty object', () => {
      it('then it passes the empty overrides to mergePresets', () => {
        vi.mocked(mergePresets).mockReturnValue(mockPreset)

        definePreset({ base: mockPreset, overrides: {} })

        expect(mergePresets).toHaveBeenCalledWith(mockPreset, {})
      })
    })
  })
})
