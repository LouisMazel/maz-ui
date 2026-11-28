import { isPresetUsed } from '../preset-usage.ts'
import { readPresets, readPresetUsage } from '../preset.ts'

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
        scales: {
          rounded: { md: '4px', 2: '8px' },
        },
        colors: {
          dark: { primary: '#FF5A36' },
        },
        weight: 700,
        enabled: true,
        empty: null,
      })
    })

    it('then it keeps the source of the expressions it cannot evaluate', () => {
      expect(preset.overrides.colors).toMatchObject({
        light: { primary: '#C7330F', secondary: '<expr: palette.ink>' },
      })
      expect(preset.overrides.tags).toEqual(['a', '<expr: palette.tag>', null])
      expect(preset.overrides.accent).toMatch(/^<expr: `#\$\{palette\.accent\}`>$/)
    })
  })

  describe('when the preset is a default export based on a preset name', () => {
    it('then it has no export name', () => {
      const [preset] = readPresets('preset.js', 'export default definePreset({ base: \'ocean\', overrides: { name: \'sea\' } })')

      expect(preset).toEqual({
        file: 'preset.js',
        exportName: undefined,
        base: 'ocean',
        overrides: { name: 'sea' },
      })
    })
  })

  describe('when definePreset has no object argument or no overrides', () => {
    it('then only the calls with an object are kept', () => {
      expect(readPresets('a.ts', 'const a = definePreset(options)\nconst b = definePreset({ base: mazUi })')).toEqual([
        {
          file: 'a.ts',
          exportName: 'b',
          base: 'mazUi',
          overrides: {},
        },
      ])
    })
  })

  describe('when the file cannot be parsed', () => {
    it('then it returns no preset', () => {
      expect(readPresets('a.ts', 'definePreset({ ')).toEqual([])
    })
  })
})

describe('given readPresets with constants of the file', () => {
  const SOURCE = `import { definePreset } from '@maz-ui/themes'
import { imported } from './palette'

const NUIT = '#141B5E'
const ALIAS = NUIT
const palette = { ink: '#111111', states: { error: '#ff0000' }, nested: { deep: 'x' } }
const radius = \`4px\`
const label = \`\${radius}-big\`
const loop: string = loop

export const brandPreset = definePreset({
  base: 'ocean',
  overrides: {
    name: label,
    colors: {
      light: { primary: NUIT, secondary: ALIAS, accent: palette.ink, ...palette.states, info: palette.nested.deep, muted: imported, missing: palette.nope, loop },
      dark: { primary: NUIT as string, surface: \`\${NUIT}\` },
    },
  },
})
`
  const [preset] = readPresets('brand.ts', SOURCE)

  describe('when a color is a top-level const', () => {
    it('then it is resolved, through aliases, members, spreads and templates', () => {
      expect(preset.overrides.name).toBe('4px-big')
      expect(preset.overrides.colors).toMatchObject({
        light: { primary: '#141B5E', secondary: '#141B5E', accent: '#111111', error: '#ff0000', info: 'x' },
        dark: { primary: '#141B5E', surface: '#141B5E' },
      })
    })
  })

  describe('when a value cannot be resolved', () => {
    it('then it keeps its source', () => {
      expect(preset.overrides.colors).toMatchObject({
        light: { muted: '<expr: imported>', missing: '<expr: palette.nope>', loop: '<expr: loop>' },
      })
    })
  })
})

describe('given readPresetUsage', () => {
  describe('when a preset is passed to the plugin', () => {
    it('then it is used and not dynamic', () => {
      const usage = readPresetUsage('main.ts', 'import { brandPreset as brand } from \'./preset\'\napp.use(MazUi, { theme: { preset: brand } })')

      expect(usage).toEqual({ used: ['brandPreset'], inlineFiles: [], dynamic: false, wired: true })
    })
  })

  describe('when a preset is picked by a function of the file', () => {
    it('then every candidate is used and the choice is dynamic', () => {
      const usage = readPresetUsage('main.ts', `import { linux, macos, windows } from '@maz-ui/themes/presets'
import { brandPreset } from './preset'

function getNativePreset() {
  if (isMac()) return macos
  if (isWindows()) { return windows }
  return linux
}

const choice = isDev ? brandPreset : getNativePreset()
app.use(MazUi, { theme: { preset: choice } })`)

      expect(usage.dynamic).toBe(true)
      expect(usage.used.toSorted()).toEqual(['brandPreset', 'linux', 'macos', 'windows'])
    })
  })

  describe('when presets are looked up in a table, by name, or set with updateTheme', () => {
    it('then each one is used', () => {
      const usage = readPresetUsage('app.vue', `const table = { a: ocean, b: 'nova' }
useTheme({ preset: table[platform] })
const { updateTheme } = useTheme()
updateTheme(pristine)
theme.setPreset('folio')`)

      expect(usage.dynamic).toBe(true)
      expect(usage.used.toSorted()).toEqual(['folio', 'nova', 'ocean', 'pristine'])
    })
  })

  describe('when the preset is an inline definePreset or a default import', () => {
    it('then it is attached to the file or to the file name', () => {
      const inline = readPresetUsage('main.ts', 'app.use(MazUi, { theme: { preset: definePreset({ base: \'ocean\' }) } })')
      const imported = readPresetUsage('main.ts', 'import brand from \'./config/brand-preset.ts\'\napp.use(MazUi, { theme: { preset: brand } })')

      expect(inline.inlineFiles).toEqual(['main.ts'])
      expect(isPresetUsed({ file: 'main.ts', overrides: {} }, inline)).toBe(true)
      expect(isPresetUsed({ file: 'config/brand-preset.ts', overrides: {} }, imported)).toBe(true)
      expect(isPresetUsed({ file: 'other.ts', exportName: 'x', overrides: {} }, imported)).toBe(false)
    })
  })

  describe('when the file has nothing about a preset, or cannot be parsed', () => {
    it('then no preset is wired', () => {
      expect(readPresetUsage('a.ts', 'export const a = 1').wired).toBe(false)
      expect(readPresetUsage('a.ts', 'preset: {{{').wired).toBe(false)
    })
  })

  describe('when the preset is something else than a name', () => {
    it('then the choice is dynamic', () => {
      const usage = readPresetUsage('a.ts', 'use({ preset: await load() })\nuse({ preset: compute() })\nuse({ preset: a ?? b })')

      expect(usage.dynamic).toBe(true)
      expect(usage.used.toSorted()).toEqual(['a', 'b'])
    })
  })
})
