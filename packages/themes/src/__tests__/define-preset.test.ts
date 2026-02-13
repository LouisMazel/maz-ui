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
      'background': '0 0% 100%',
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
      'border': '220 13% 91%',
      'shadow': '240 6% 10%',
    },
    dark: {
      'background': '235 16% 15%',
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
      'border': '238 17% 25%',
      'shadow': '240 4% 16%',
    },
  },
  foundation: {
    'radius': '0.5rem',
    'border-width': '1px',
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
          foundation: { radius: '1rem' },
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
