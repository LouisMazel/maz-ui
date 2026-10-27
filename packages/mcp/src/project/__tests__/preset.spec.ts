import { readPresets } from '../preset'

const PRESET = `import { definePreset, mazUi } from '@maz-ui/themes'
import { palette } from './palette'

export const brandPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'throw',
    foundation: {
      'font-family': \`'Archivo', sans-serif\`,
      'border-width': '2px' as const,
    },
    scales: {
      rounded: { md: '4px', 2: '8px' },
    },
    colors: {
      light: { primary: '#C7330F', secondary: palette.ink, ...palette.states },
      dark: { 'primary': '#FF5A36', [palette.key]: 'red' },
    },
    tags: ['a', palette.tag, ...palette.more],
    weight: 700,
    enabled: true,
    empty: null,
    accent: \`#\${palette.accent}\`,
  },
})
`

describe('given readPresets', () => {
  describe('when a file defines a preset with definePreset', () => {
    const [preset] = readPresets('config/brand-preset.ts', PRESET)

    it('then it reads the file, the exported name and the base', () => {
      expect(preset).toMatchObject({ file: 'config/brand-preset.ts', exportName: 'brandPreset', base: 'mazUi' })
    })

    it('then it evaluates the literal overrides', () => {
      expect(preset.overrides).toMatchObject({
        name: 'throw',
        foundation: { 'font-family': '\'Archivo\', sans-serif', 'border-width': '2px' },
        scales: { rounded: { md: '4px', 2: '8px' } },
        colors: { dark: { primary: '#FF5A36' } },
        weight: 700,
        enabled: true,
        empty: null,
      })
    })

    it('then it keeps the source of the expressions it cannot evaluate', () => {
      expect(preset.overrides.colors).toMatchObject({ light: { primary: '#C7330F', secondary: '<expr: palette.ink>' } })
      expect(preset.overrides.tags).toEqual(['a', '<expr: palette.tag>', null])
      expect(preset.overrides.accent).toMatch(/^<expr: `#\$\{palette\.accent\}`>$/)
    })
  })

  describe('when the preset is a default export based on a preset name', () => {
    it('then it has no export name', () => {
      const [preset] = readPresets('preset.js', 'export default definePreset({ base: \'ocean\', overrides: { name: \'sea\' } })')

      expect(preset).toEqual({ file: 'preset.js', exportName: undefined, base: 'ocean', overrides: { name: 'sea' } })
    })
  })

  describe('when definePreset has no object argument or no overrides', () => {
    it('then only the calls with an object are kept', () => {
      expect(readPresets('a.ts', 'const a = definePreset(options)\nconst b = definePreset({ base: mazUi })')).toEqual([
        { file: 'a.ts', exportName: 'b', base: 'mazUi', overrides: {} },
      ])
    })
  })

  describe('when the file cannot be parsed', () => {
    it('then it returns no preset', () => {
      expect(readPresets('a.ts', 'definePreset({ ')).toEqual([])
    })
  })
})
