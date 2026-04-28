import type { ThemePreset, ThemePresetOverrides } from '../../types'
import { deepMerge, mergePresets } from '../preset-merger'

describe('preset-merger', () => {
  describe('given mergePresets function', () => {
    describe('when no overrides provided', () => {
      it('then it returns base preset', () => {
        const basePreset = {
          name: 'base',
          colors: {
            light: {
              primary: '#000000',
            },
            dark: {
              primary: '#ffffff',
            },
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        } as unknown as ThemePreset

        const overrides = {}

        const result = mergePresets(basePreset, overrides)

        expect(result.name).toBe('base')
        expect(result.colors.light.primary).toBe('#000000')
        expect(result.foundation['base-font-size']).toBe('16px')
      })
    })

    describe('when merging overrides into base preset', () => {
      it('then it merges overrides while preserving base values', () => {
        const basePreset = {
          name: 'base',
          colors: {
            light: {
              primary: '11 11% 11%',
              destructive: '11 11% 11%',
            },
            dark: {
              primary: '12 12% 12%',
            },
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          name: 'custom',
          colors: {
            light: {
              primary: '11 11% 11%',
            },
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.name).toBe('custom')
        expect(result.colors.light.primary).toBe('11 11% 11%')
        expect(result.colors.light.destructive).toBe('11 11% 11%')
        expect(result.colors.dark.primary).toBe('12 12% 12%')
        expect(result.foundation['base-font-size']).toBe('16px')
        // scale moved out of foundation
        expect(result.foundation['border-width']).toBe('1px')
        expect(result.foundation['font-family']).toBe('Arial')
      })
    })

    describe('when deep merging nested objects', () => {
      it('then it deep merges nested objects correctly', () => {
        const basePreset = {
          name: 'base',
          colors: {
            light: {
              primary: '11 11% 11%',
              destructive: '11 11% 11%',
              accent: '11 11% 11%',
            },
            dark: {
              primary: '12 12% 12%',
              destructive: '12 12% 12%',
            },
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          colors: {
            light: {
              primary: '11 11% 11%',
            },
            dark: {
              accent: '22 22% 22%',
            },
          },
          foundation: {
            'font-family': 'Helvetica',
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.colors.light.primary).toBe('11 11% 11%')
        expect(result.colors.light.destructive).toBe('11 11% 11%')
        expect(result.colors.light.accent).toBe('11 11% 11%')
        expect(result.colors.dark.primary).toBe('12 12% 12%')
        expect(result.colors.dark.destructive).toBe('12 12% 12%')
        expect(result.foundation['base-font-size']).toBe('16px')
        // scale moved out of foundation
        expect(result.foundation['border-width']).toBe('1px')
        expect(result.foundation['font-family']).toBe('Helvetica')
      })
    })

    describe('when handling arrays in overrides', () => {
      it('then it handles arrays in overrides correctly', () => {
        const basePreset = {
          name: 'base',
          colors: {
            light: {
              primary: '11 11% 11%',
            },
            dark: {
              primary: '12 12% 12%',
            },
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          name: 'custom',
          colors: {
            light: {
              primary: '11 11% 11%',
            },
            dark: {
              primary: '12 12% 12%',
            },
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.colors.light.primary).toBe('11 11% 11%')
        expect(result.colors.dark.primary).toBe('12 12% 12%')
      })
    })

    describe('when replacing primitive values', () => {
      it('then it completely replaces primitive values', () => {
        const basePreset = {
          name: 'base',
          colors: {
            light: {
              primary: '11 11% 11%',
            },
            dark: {
              primary: '12 12% 12%',
            },
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          name: 'override',
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.name).toBe('override')
        expect(result.foundation['base-font-size']).toBe('16px')
        // scale moved out of foundation
        expect(result.foundation['border-width']).toBe('1px')
        expect(result.foundation['font-family']).toBe('Arial')
      })
    })

    describe('when overrides omit the scales block', () => {
      it('then mergeScales returns the base scales untouched', () => {
        const basePreset = {
          name: 'base',
          colors: { light: {}, dark: {} },
          foundation: {},
          scales: {
            spacing: '0.25rem',
            radius: { md: '0.5rem' },
            shadow: { md: '0 1px 2px rgba(0,0,0,0.1)' },
            fontSize: { md: ['1rem', '1.5rem'] },
          },
        } as unknown as ThemePreset

        const result = mergePresets(basePreset, {})

        expect(result.scales).toBe(basePreset.scales)
      })
    })

    describe('when overrides extend the scales block but omit spacing', () => {
      it('then mergeScales falls back to the base spacing value', () => {
        const basePreset = {
          name: 'base',
          colors: { light: {}, dark: {} },
          foundation: {},
          scales: {
            spacing: '0.25rem',
            radius: { md: '0.5rem' },
            shadow: {},
            fontSize: {},
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          scales: {
            radius: { md: '1rem' },
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.scales.spacing).toBe('0.25rem')
        expect(result.scales.radius?.md).toBe('1rem')
      })
    })

    describe('when overrides extend the scales block', () => {
      it('then mergeScales merges radius/shadow/fontSize and overrides spacing', () => {
        const basePreset = {
          name: 'base',
          colors: { light: {}, dark: {} },
          foundation: {},
          scales: {
            spacing: '0.25rem',
            radius: { sm: '0.25rem', md: '0.5rem' },
            shadow: { sm: 'shadow-base-sm' },
            fontSize: { sm: ['0.875rem', '1.25rem'] },
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          scales: {
            spacing: '0.5rem',
            radius: { md: '1rem' },
            shadow: { md: 'shadow-override-md' },
            fontSize: { lg: ['1.125rem', '1.75rem'] },
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.scales.spacing).toBe('0.5rem')
        expect(result.scales.radius).toEqual({ sm: '0.25rem', md: '1rem' })
        expect(result.scales.shadow).toEqual({
          sm: 'shadow-base-sm',
          md: 'shadow-override-md',
        })
        expect(result.scales.fontSize).toEqual({
          sm: ['0.875rem', '1.25rem'],
          lg: ['1.125rem', '1.75rem'],
        })
      })
    })

    describe('when neither base nor overrides declare components', () => {
      it('then mergeComponents returns undefined', () => {
        const basePreset = {
          name: 'base',
          colors: { light: {}, dark: {} },
          foundation: {},
          scales: { spacing: '0.25rem' },
        } as unknown as ThemePreset

        const result = mergePresets(basePreset, {})

        expect(result.components).toBeUndefined()
      })
    })

    describe('when only overrides declare components', () => {
      it('then mergeComponents adopts the overrides shape', () => {
        const basePreset = {
          name: 'base',
          colors: { light: {}, dark: {} },
          foundation: {},
          scales: { spacing: '0.25rem' },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          components: {
            btn: { 'font-weight': '700' },
            container: { bg: { light: 'oklch(0.9 0 0)', dark: 'oklch(0.3 0 0)' } },
            input: { bg: { light: 'oklch(0.95 0 0)', dark: 'oklch(0.25 0 0)' } },
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.components?.btn).toEqual({ 'font-weight': '700' })
        expect(result.components?.container?.bg?.light).toBe('oklch(0.9 0 0)')
        expect(result.components?.input?.bg?.dark).toBe('oklch(0.25 0 0)')
      })
    })

    describe('when both base and overrides declare components', () => {
      it('then mergeComponents merges per-mode bg values', () => {
        const basePreset = {
          name: 'base',
          colors: { light: {}, dark: {} },
          foundation: {},
          scales: { spacing: '0.25rem' },
          components: {
            btn: { 'font-weight': '500' },
            container: { bg: { light: 'oklch(1 0 0)', dark: 'oklch(0.2 0 0)' } },
            input: { bg: { light: 'oklch(0.95 0 0)' } },
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          components: {
            container: { bg: { dark: 'oklch(0.4 0 0)' } },
            input: { bg: { dark: 'oklch(0.3 0 0)' } },
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.components?.btn).toEqual({ 'font-weight': '500' })
        expect(result.components?.container?.bg).toEqual({
          light: 'oklch(1 0 0)',
          dark: 'oklch(0.4 0 0)',
        })
        expect(result.components?.input?.bg).toEqual({
          light: 'oklch(0.95 0 0)',
          dark: 'oklch(0.3 0 0)',
        })
      })
    })

    describe('when adding new properties from overrides', () => {
      it('then it adds new properties from overrides', () => {
        const basePreset = {
          name: 'base',
          colors: {
            light: { primary: '#000000' },
            dark: {},
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        } as unknown as ThemePreset

        const overrides: ThemePresetOverrides = {
          colors: {
            light: {
              primary: '11 11% 11%',
              accent: '22 22% 22%',
            },
            dark: {
              primary: '12 12% 12%',
            },
          },
          foundation: {
            'base-font-size': '16px',
            'border-width': '1px',
            'font-family': 'Arial',
          },
        }

        const result = mergePresets(basePreset, overrides)

        expect(result.colors.light.primary).toBe('11 11% 11%')
        expect(result.colors.light.accent).toBe('22 22% 22%')
        expect(result.colors.dark.primary).toBe('12 12% 12%')
        expect(result.foundation['base-font-size']).toBe('16px')
        // scale moved out of foundation
        expect(result.foundation['border-width']).toBe('1px')
        expect(result.foundation['font-family']).toBe('Arial')
      })
    })
  })

  describe('given deepMerge function', () => {
    describe('when merging flat objects', () => {
      it('then it merges source into target', () => {
        const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 })

        expect(result).toEqual({ a: 1, b: 3, c: 4 })
      })
    })

    describe('when merging nested objects', () => {
      it('then it deep merges nested structures', () => {
        const result = deepMerge(
          { a: { x: 1, y: 2 }, b: 'keep' },
          { a: { y: 3, z: 4 } },
        )

        expect(result).toEqual({ a: { x: 1, y: 3, z: 4 }, b: 'keep' })
      })
    })

    describe('when source has undefined values', () => {
      it('then it preserves target values', () => {
        const result = deepMerge({ a: 1, b: 2 }, { a: undefined })

        expect(result).toEqual({ a: 1, b: 2 })
      })
    })

    describe('when source contains an array', () => {
      it('then it replaces the target value with the array', () => {
        const result = deepMerge({ a: [1, 2] }, { a: [3, 4] })

        expect(result).toEqual({ a: [3, 4] })
      })
    })

    describe('when source value is a primitive overriding an object', () => {
      it('then it replaces the object with the primitive', () => {
        const result = deepMerge({ a: { x: 1 } } as any, { a: 'string' } as any)

        expect(result).toEqual({ a: 'string' })
      })
    })
  })
})
