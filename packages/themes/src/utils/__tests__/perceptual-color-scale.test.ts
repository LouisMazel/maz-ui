import type { OklchChannels } from '../color-conversions'
import { mazUi } from '../../presets/mazUi'
import { nova } from '../../presets/nova'
import { obsidian } from '../../presets/obsidian'
import { ocean } from '../../presets/ocean'
import { pristine } from '../../presets/pristine'
import { colorToHex, parseColorAsOklch } from '../color-conversions'
import {
  BRAND_COLOR_ROLES,
  generateCSS,
  getPerceptualDarkBound,
  PERCEPTUAL_COLOR_SCALE,
  PERCEPTUAL_LIGHT_BOUND,
} from '../css-generator'
import { mergePresets } from '../preset-merger'

const STEPS = [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950,
] as const

const cssOptions = {
  prefix: 'maz',
  mode: 'both',
  darkSelectorStrategy: 'class',
  darkClass: 'dark',
  lightClass: 'light',
} as const

function computeScale(base: OklchChannels): Record<number, OklchChannels> {
  const scale: Record<number, OklchChannels> = { 500: base }
  for (const [step, { mix, chroma, maxChroma }] of Object.entries(PERCEPTUAL_COLOR_SCALE.tints)) {
    scale[Number(step)] = {
      l: base.l + (Math.max(PERCEPTUAL_LIGHT_BOUND, base.l) - base.l) * mix,
      c: Math.min(base.c * chroma, maxChroma),
      h: base.h,
    }
  }
  for (const [step, { mix, chroma, maxChroma }] of Object.entries(PERCEPTUAL_COLOR_SCALE.shades)) {
    scale[Number(step)] = {
      l: base.l - (base.l - getPerceptualDarkBound(base.l)) * mix,
      c: Math.min(base.c * chroma, maxChroma),
      h: base.h,
    }
  }
  return scale
}

function hueDifference(expected: OklchChannels, actual: OklchChannels): number {
  const distance = Math.abs(expected.h - actual.h) % 360
  const angle = Math.min(distance, 360 - distance)
  return 2 * Math.sqrt(expected.c * actual.c) * Math.sin((angle * Math.PI) / 360)
}

const issueBases = {
  navy: '#0E1450',
  gold: '#FFC93C',
}

const presetBases = [mazUi, nova, obsidian, ocean, pristine].flatMap(preset =>
  (['light', 'dark'] as const).flatMap(mode =>
    BRAND_COLOR_ROLES.map(role => ({ name: `${preset.name} ${mode} ${role}`, value: preset.colors[mode][role] })),
  ),
)

const allBases = [
  ...Object.entries(issueBases).map(([name, value]) => ({ name, value })),
  ...presetBases,
]

describe('given the perceptual color scale', () => {
  describe('when the preset uses scales.color = perceptual', () => {
    const preset = mergePresets(mazUi, {
      scales: { color: 'perceptual' },
    })
    const css = generateCSS(preset, cssOptions)

    it('then matches the snapshot', () => {
      expect(css).toMatchSnapshot()
    })

    it('then redefines the 10 steps of the 7 brand roles under both variable names', () => {
      for (const role of BRAND_COLOR_ROLES) {
        for (const step of STEPS.filter(step => step !== 500)) {
          expect(css).toContain(`--maz-color-${role}-${step}: oklch(from var(--maz-${role}) `)
          expect(css).toContain(`--color-${role}-${step}: oklch(from var(--maz-${role}) `)
        }
      }
    })

    it('then leaves the 500 step to the base color', () => {
      expect(css).not.toMatch(/--(?:maz-)?color-[a-z]+-500:/)
    })

    it('then leaves surface, foreground, contrast and divider relative', () => {
      expect(css).not.toMatch(/--(?:maz-)?color-(?:surface|foreground|contrast|divider)-\d+:/)
    })

    it('then emits the redefinitions in a :root:root block inside @layer theme', () => {
      expect(css).toMatch(/^@layer theme \{[\s\S]*\n {2}:root:root \{\n/)
    })
  })

  describe('when the preset uses scales.color = perceptual with mode=dark only', () => {
    const preset = mergePresets(mazUi, {
      scales: { color: 'perceptual' },
    })
    const css = generateCSS(preset, { ...cssOptions, mode: 'dark' })

    it('then still emits the redefinitions', () => {
      expect(css).toContain('--maz-color-primary-300: oklch(from var(--maz-primary) ')
    })
  })

  describe('when the preset keeps the default relative scale', () => {
    const css = generateCSS(mazUi, cssOptions)

    it('then emits no step redefinition', () => {
      expect(css).not.toContain(':root:root')
      expect(css).not.toMatch(/--(?:maz-)?color-[a-z]+-\d+:/)
    })
  })

  describe('when the preset sets scales.color = relative', () => {
    const preset = mergePresets(mazUi, {
      scales: { color: 'relative' },
    })
    const css = generateCSS(preset, cssOptions)

    it('then emits the same CSS as the default', () => {
      expect(css).toBe(generateCSS(mazUi, cssOptions))
    })
  })

  describe('when the steps are computed for the issue bases and the bundled presets', () => {
    const scales = allBases.map(({ name, value }) => ({
      name,
      scale: computeScale(parseColorAsOklch(value)),
    }))

    it('then the lightness decreases from 50 to 950', () => {
      for (const { name, scale } of scales) {
        for (let index = 1; index < STEPS.length; index++) {
          const previous = scale[STEPS[index - 1]].l
          const current = scale[STEPS[index]].l
          const lighterThanBound = STEPS[index] <= 500 && current >= PERCEPTUAL_LIGHT_BOUND
          expect(lighterThanBound
            ? current <= previous
            : current < previous, `${name} ${STEPS[index]}`).toBe(true)
        }
      }
    })

    it('then the shades stay above the dark bound', () => {
      for (const { name, scale } of scales) {
        expect(scale[950].l, name).toBeGreaterThan(getPerceptualDarkBound(scale[500].l))
      }
    })
  })

  describe('when the steps of the issue bases are converted to sRGB', () => {
    const hexes = Object.entries(issueBases).map(([name, value]) => {
      const scale = computeScale(parseColorAsOklch(value))
      return {
        name,
        hexes: STEPS.map(step => colorToHex(`oklch(${scale[step].l} ${scale[step].c} ${scale[step].h})`)),
      }
    })

    it('then no step is pure white or pure black', () => {
      for (const { name, hexes: steps } of hexes) {
        expect(steps, name).not.toContain('#ffffff')
        expect(steps, name).not.toContain('#000000')
      }
    })

    it('then every step is distinct', () => {
      for (const { name, hexes: steps } of hexes) {
        expect(new Set(steps).size, name).toBe(STEPS.length)
      }
    })
  })

  describe('when the steps are clipped to sRGB', () => {
    const clip = (color: OklchChannels) => parseColorAsOklch(colorToHex(`oklch(${color.l} ${color.c} ${color.h})`))
    const differences = allBases.flatMap(({ name, value }) => {
      const base = parseColorAsOklch(value)
      const baseDifference = hueDifference(base, clip(base))
      const scale = computeScale(base)
      return STEPS.map(step => ({
        name: `${name} ${step}`,
        difference: hueDifference(scale[step], clip(scale[step])) - baseDifference,
      }))
    })

    it('then the hue shifts by less than 0.03 in OKLab', () => {
      for (const { name, difference } of differences) {
        expect(difference, name).toBeLessThan(0.03)
      }
    })
  })
})
