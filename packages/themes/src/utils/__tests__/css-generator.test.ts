import { isServer } from '@maz-ui/utils/helpers/isServer'
import { mazUi } from '../../presets/mazUi'
import { CSS_ID, generateCSS, injectCSS, removeCSS } from '../css-generator'

vi.mock('@maz-ui/utils/helpers/isServer', () => ({
  isServer: vi.fn(() => false),
}))

describe('given generateCSS function', () => {
  describe('when generating with mode=both and darkSelectorStrategy=class', () => {
    const css = generateCSS(mazUi, {
      prefix: 'maz',
      mode: 'both',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
    })

    it('then wraps the output in @layer theme', () => {
      expect(css).toMatch(/^@layer theme \{/)
      expect(css.trim().endsWith('}')).toBe(true)
    })

    it('then emits color-scheme: light dark on :root', () => {
      expect(css).toContain('color-scheme: light dark')
    })

    it('then emits a single :root block', () => {
      const rootMatches = css.match(/:root\s*\{/g) ?? []
      expect(rootMatches.length).toBe(1)
    })

    it('then emits each base color as light-dark()', () => {
      expect(css).toMatch(/--maz-primary: light-dark\(/)
      expect(css).toMatch(/--maz-surface: light-dark\(/)
      expect(css).toMatch(/--maz-foreground: light-dark\(/)
    })

    it('then never emits @media prefers-color-scheme dark', () => {
      expect(css).not.toContain('@media (prefers-color-scheme: dark)')
    })

    it('then emits .dark and .light overrides forcing color-scheme', () => {
      expect(css).toContain('.dark { color-scheme: only dark; }')
      expect(css).toContain('.light { color-scheme: only light; }')
    })

    it('then aliases palette step 500 directly to var(--maz-X)', () => {
      expect(css).toContain('--maz-primary-500: var(--maz-primary)')
      expect(css).not.toMatch(/--maz-primary-500: color-mix/)
    })

    it('then emits color-mix(in oklch) for tints below 500', () => {
      expect(css).toContain('--maz-primary-50: color-mix(in oklch, var(--maz-primary), white 95%)')
      expect(css).toContain('--maz-primary-100: color-mix(in oklch, var(--maz-primary), white 85%)')
      expect(css).toContain('--maz-primary-400: color-mix(in oklch, var(--maz-primary), white 25%)')
    })

    it('then emits color-mix(in oklch) for shades above 500', () => {
      expect(css).toContain('--maz-primary-600: color-mix(in oklch, var(--maz-primary), black 15%)')
      expect(css).toContain('--maz-primary-900: color-mix(in oklch, var(--maz-primary), black 60%)')
      expect(css).toContain('--maz-primary-950: color-mix(in oklch, var(--maz-primary), black 75%)')
    })

    it('then emits the contrast-600 scale entry', () => {
      expect(css).toContain('--maz-contrast-600:')
    })

    it('then matches the snapshot', () => {
      expect(css).toMatchSnapshot()
    })
  })

  describe('when generating with mode=both and darkSelectorStrategy=media', () => {
    const css = generateCSS(mazUi, {
      prefix: 'maz',
      mode: 'both',
      darkSelectorStrategy: 'media',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
    })

    it('then still emits color-scheme: light dark on :root', () => {
      expect(css).toContain('color-scheme: light dark')
    })

    it('then never emits .dark or .light overrides', () => {
      expect(css).not.toContain('.dark { color-scheme:')
      expect(css).not.toContain('.light { color-scheme:')
    })

    it('then never emits @media prefers-color-scheme dark', () => {
      expect(css).not.toContain('@media (prefers-color-scheme: dark)')
    })

    it('then wraps base colors in light-dark()', () => {
      expect(css).toMatch(/--maz-primary: light-dark\(/)
    })
  })

  describe('when generating with mode=light only', () => {
    const css = generateCSS(mazUi, {
      prefix: 'maz',
      mode: 'light',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
    })

    it('then emits color-scheme: only light on :root', () => {
      expect(css).toContain('color-scheme: only light')
    })

    it('then never wraps colors in light-dark()', () => {
      expect(css).not.toContain('light-dark(')
    })

    it('then never emits .dark or .light overrides', () => {
      expect(css).not.toContain('.dark { color-scheme:')
      expect(css).not.toContain('.light { color-scheme:')
    })

    it('then emits the light color value directly', () => {
      expect(css).toContain('--maz-primary: oklch(0.6495 0.1913 253.63);')
    })

    it('then emits the rounded scale (xs..3xl)', () => {
      for (const key of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']) {
        expect(css).toContain(`--maz-rounded-${key}:`)
      }
    })
  })

  describe('when generating with mode=dark only', () => {
    const css = generateCSS(mazUi, {
      prefix: 'maz',
      mode: 'dark',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
    })

    it('then emits color-scheme: only dark on :root', () => {
      expect(css).toContain('color-scheme: only dark')
    })

    it('then never wraps colors in light-dark()', () => {
      expect(css).not.toContain('light-dark(')
    })

    it('then emits the dark color value directly', () => {
      expect(css).toContain('--maz-surface: oklch(0.2524 0.0212 280.69);')
    })

    it('then emits a single :root block', () => {
      const rootMatches = css.match(/:root\s*\{/g) ?? []
      expect(rootMatches.length).toBe(1)
    })

    it('then never emits .dark or .light overrides', () => {
      expect(css).not.toContain('.dark { color-scheme:')
      expect(css).not.toContain('.light { color-scheme:')
    })
  })

  describe('given foundation tokens', () => {
    describe('when generating CSS with the default preset', () => {
      const css = generateCSS(mazUi, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then emits the space token', () => {
        expect(css).toContain('--maz-space:')
      })

      it('then emits the base-font-size token', () => {
        expect(css).toContain('--maz-base-font-size:')
      })

      it('then emits the border-width token', () => {
        expect(css).toContain('--maz-border-width:')
      })

      it('then emits the font-family token', () => {
        expect(css).toContain('--maz-font-family:')
      })
    })

    describe('when foundation is undefined', () => {
      const css = generateCSS({ ...mazUi, foundation: undefined as any }, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then no foundation vars are emitted', () => {
        expect(css).not.toContain('--maz-border-width:')
        expect(css).not.toContain('--maz-base-font-size:')
      })
    })

    describe('when a foundation entry is falsy', () => {
      const css = generateCSS(
        { ...mazUi, foundation: { ...mazUi.foundation, 'border-width': '' as any } },
        {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          scaleColorVariables: true,
        },
      )

      it('then the falsy token is skipped', () => {
        expect(css).not.toContain('--maz-border-width:')
        expect(css).toContain('--maz-base-font-size:')
      })
    })
  })

  describe('given the rounded scale', () => {
    describe('when only md is set in the preset', () => {
      const css = generateCSS(mazUi, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then the md anchor is emitted as a literal value', () => {
        expect(css).toContain('--maz-rounded-md: 0.7rem;')
      })

      it('then other keys fall back to calc(var(--maz-rounded-md) * ratio)', () => {
        expect(css).toContain('--maz-rounded-xs: calc(var(--maz-rounded-md) * 0.25);')
        expect(css).toContain('--maz-rounded-sm: calc(var(--maz-rounded-md) * 0.5);')
        expect(css).toContain('--maz-rounded-lg: calc(var(--maz-rounded-md) * 1.5);')
        expect(css).toContain('--maz-rounded-xl: calc(var(--maz-rounded-md) * 2);')
        expect(css).toContain('--maz-rounded-2xl: calc(var(--maz-rounded-md) * 3);')
        expect(css).toContain('--maz-rounded-3xl: calc(var(--maz-rounded-md) * 4);')
      })
    })

    describe('when a literal value is set on a non-md key', () => {
      const css = generateCSS(
        { ...mazUi, scales: { ...mazUi.scales, rounded: { md: '1rem' as const, xs: '0.1rem' as const } } },
        {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          scaleColorVariables: true,
        },
      )

      it('then the literal value wins over the calc fallback', () => {
        expect(css).toContain('--maz-rounded-md: 1rem;')
        expect(css).toContain('--maz-rounded-xs: 0.1rem;')
        expect(css).not.toContain('--maz-rounded-xs: calc(')
        expect(css).toContain('--maz-rounded-sm: calc(var(--maz-rounded-md) * 0.5);')
      })
    })

    describe('when the preset has no scales block', () => {
      const css = generateCSS({ ...mazUi, scales: undefined as any }, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then no rounded or shadow style vars are emitted', () => {
        expect(css).not.toMatch(/--maz-rounded-/)
        expect(css).not.toMatch(/--maz-shadow-style-/)
      })
    })
  })

  describe('given the shadow scale', () => {
    describe('when the preset ships the default shadow values', () => {
      const css = generateCSS(mazUi, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then sm/md/lg/xl/elevation shadow-style vars are emitted', () => {
        for (const key of ['sm', 'md', 'lg', 'xl', 'elevation']) {
          expect(css).toContain(`--maz-shadow-style-${key}:`)
        }
      })
    })

    describe('when a shadow entry is empty', () => {
      const css = generateCSS(
        { ...mazUi, scales: { ...mazUi.scales, shadow: { ...mazUi.scales.shadow, sm: '' } } } as any,
        {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          scaleColorVariables: true,
        },
      )

      it('then the empty shadow is skipped', () => {
        expect(css).not.toContain('--maz-shadow-style-sm:')
        expect(css).toContain('--maz-shadow-style-md:')
      })
    })
  })

  describe('given typography', () => {
    describe('when generating CSS', () => {
      const css = generateCSS(mazUi, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then no fontSize scale is emitted', () => {
        expect(css).not.toMatch(/--maz-text-(?:mini|xs|sm|md|lg|xl):/)
      })
    })
  })

  describe('given renamed color tokens', () => {
    describe('when generating CSS', () => {
      const css = generateCSS(mazUi, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then --maz-surface and --maz-divider are emitted', () => {
        expect(css).toContain('--maz-surface:')
        expect(css).toContain('--maz-divider:')
      })

      it('then --maz-background is never emitted', () => {
        expect(css).not.toMatch(/--maz-background\b/)
      })

      it('then --maz-border: (the color) is never emitted, only --maz-border-width:', () => {
        expect(css).not.toMatch(/--maz-border:[^-]/)
        expect(css).toContain('--maz-border-width:')
      })
    })
  })

  describe('given per-component bg vars', () => {
    describe('when components.container.bg and components.input.bg are set and mode=both', () => {
      const preset = {
        ...mazUi,
        components: {
          container: { bg: { light: 'oklch(0.9 0 0)', dark: 'oklch(0.3 0 0)' } },
          input: { bg: { light: 'oklch(0.95 0 0)', dark: 'oklch(0.25 0 0)' } },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then --maz-container-bg is wrapped in light-dark()', () => {
        expect(css).toContain('--maz-container-bg: light-dark(oklch(0.9 0 0), oklch(0.3 0 0));')
      })

      it('then --maz-input-bg is wrapped in light-dark()', () => {
        expect(css).toContain('--maz-input-bg: light-dark(oklch(0.95 0 0), oklch(0.25 0 0));')
      })
    })

    describe('when mode=light only and component bg is set per-mode', () => {
      const preset = {
        ...mazUi,
        components: {
          container: { bg: { light: 'oklch(0.9 0 0)', dark: 'oklch(0.3 0 0)' } },
          input: { bg: { light: 'oklch(0.95 0 0)', dark: 'oklch(0.25 0 0)' } },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then --maz-container-bg uses only the light value', () => {
        expect(css).toContain('--maz-container-bg: oklch(0.9 0 0);')
        expect(css).not.toContain('light-dark(')
      })

      it('then --maz-input-bg uses only the light value', () => {
        expect(css).toContain('--maz-input-bg: oklch(0.95 0 0);')
      })
    })

    describe('when mode=dark only and component bg is set per-mode', () => {
      const preset = {
        ...mazUi,
        components: {
          container: { bg: { light: 'oklch(0.9 0 0)', dark: 'oklch(0.3 0 0)' } },
          input: { bg: { light: 'oklch(0.95 0 0)', dark: 'oklch(0.25 0 0)' } },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'dark',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then --maz-container-bg uses only the dark value', () => {
        expect(css).toContain('--maz-container-bg: oklch(0.3 0 0);')
      })

      it('then --maz-input-bg uses only the dark value', () => {
        expect(css).toContain('--maz-input-bg: oklch(0.25 0 0);')
      })
    })

    describe('when components.container.bg.light equals bg.dark and mode=both', () => {
      const preset = {
        ...mazUi,
        components: {
          container: { bg: { light: 'var(--maz-surface)', dark: 'var(--maz-surface)' } },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        lightClass: 'light',
        scaleColorVariables: false,
      })

      it('then it emits the value directly without light-dark wrapping', () => {
        expect(css).toContain('--maz-container-bg: var(--maz-surface);')
        expect(css).not.toMatch(/--maz-container-bg: light-dark\(/)
      })
    })

    describe('when components.btn.font-weight is provided', () => {
      const preset = { ...mazUi, components: { btn: { 'font-weight': '600' } } }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then --maz-btn-font-weight is emitted', () => {
        expect(css).toContain('--maz-btn-font-weight: 600')
      })
    })

    describe('when components is provided without container or input bg', () => {
      const preset = { ...mazUi, components: { btn: { 'font-weight': '700' } } }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then only the available component vars are emitted', () => {
        expect(css).toContain('--maz-btn-font-weight: 700')
        expect(css).not.toContain('--maz-container-bg:')
        expect(css).not.toContain('--maz-input-bg:')
      })
    })

    describe('when the preset has no components block at all', () => {
      const preset = { ...mazUi, components: undefined as any }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then no component vars are emitted', () => {
        expect(css).not.toContain('--maz-btn-font-weight')
        expect(css).not.toContain('--maz-container-bg:')
        expect(css).not.toContain('--maz-input-bg:')
      })
    })
  })

  describe('given no prefix is provided', () => {
    describe('when generateCSS is called without options.prefix', () => {
      const css = generateCSS(mazUi, {
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then it defaults the prefix to "maz"', () => {
        expect(css).toContain('--maz-primary:')
      })
    })
  })

  describe('given a preset where dark side has a missing color and mode=dark', () => {
    describe('when --maz-key is emitted in dark mode and dark color is undefined', () => {
      const preset = {
        ...mazUi,
        colors: {
          ...mazUi.colors,
          dark: { ...mazUi.colors.dark, primary: undefined as any },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'dark',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then it falls back to the light value', () => {
        expect(css).toContain(`--maz-primary: ${mazUi.colors.light.primary};`)
      })
    })

    describe('when --maz-key is emitted in mode=both and dark color is undefined', () => {
      const preset = {
        ...mazUi,
        colors: {
          ...mazUi.colors,
          dark: { ...mazUi.colors.dark, accent: undefined as any },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then light-dark falls back to the light value on the dark side', () => {
        expect(css).toContain(`--maz-accent: light-dark(${mazUi.colors.light.accent}, ${mazUi.colors.light.accent});`)
      })
    })
  })

  describe('given a preset with no shadow scales', () => {
    describe('when scales has no shadow block', () => {
      const preset = {
        ...mazUi,
        scales: { rounded: mazUi.scales.rounded } as any,
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then no shadow-style vars are emitted', () => {
        expect(css).not.toMatch(/--maz-shadow-style-/)
      })
    })
  })

  describe('given a preset with only one side of component bg defined', () => {
    describe('when mode=both and container.bg.light is set but bg.dark is missing', () => {
      const preset = {
        ...mazUi,
        components: {
          container: { bg: { light: 'oklch(0.9 0 0)' } },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then the short-circuit emits the light value directly (light === dark via fallback)', () => {
        expect(css).toContain('--maz-container-bg: oklch(0.9 0 0);')
      })
    })

    describe('when mode=both and container.bg.dark is set but bg.light is missing', () => {
      const preset = {
        ...mazUi,
        components: {
          container: { bg: { dark: 'oklch(0.3 0 0)' } },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then the short-circuit emits the dark value directly (light === dark via fallback)', () => {
        expect(css).toContain('--maz-container-bg: oklch(0.3 0 0);')
      })
    })
  })

  describe('given a preset with a falsy color value on the light side', () => {
    describe('when a key is explicitly set to undefined', () => {
      const preset = {
        ...mazUi,
        colors: {
          ...mazUi.colors,
          light: { ...mazUi.colors.light, primary: undefined as any },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then the falsy key is skipped (no --maz-primary line)', () => {
        expect(css).not.toMatch(/--maz-primary:\s/)
      })
    })
  })

  describe('given legacy HSL color input', () => {
    describe('when a raw HSL channel string is provided', () => {
      const preset = {
        ...mazUi,
        colors: {
          ...mazUi.colors,
          light: { ...mazUi.colors.light, primary: '210 100% 50%' as any },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then the raw HSL is wrapped in hsl()', () => {
        expect(css).toContain('--maz-primary: hsl(210 100% 50%);')
      })
    })
  })

  describe('given hex color input', () => {
    describe('when a hex color is provided', () => {
      const preset = {
        ...mazUi,
        colors: {
          ...mazUi.colors,
          light: { ...mazUi.colors.light, primary: '#ff00ff' },
          dark: { ...mazUi.colors.dark, primary: '#00ffff' },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then the hex value is emitted as-is', () => {
        expect(css).toContain('--maz-primary: #ff00ff;')
      })
    })
  })

  describe('given scaleColorVariables: false', () => {
    describe('when generating CSS', () => {
      const css = generateCSS(mazUi, {
        prefix: 'maz',
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then no per-step palette vars are emitted', () => {
        expect(css).not.toContain('--maz-primary-100')
        expect(css).not.toContain('--maz-primary-500')
        expect(css).not.toContain('--maz-primary-900')
      })

      it('then no color-mix declarations are emitted', () => {
        expect(css).not.toContain('color-mix(in oklch')
      })

      it('then the base color vars are still emitted', () => {
        expect(css).toMatch(/--maz-primary: light-dark\(/)
      })
    })
  })

  describe('given a missing scaled color base', () => {
    describe('when one entry of colors.light is falsy', () => {
      const preset = {
        ...mazUi,
        colors: {
          ...mazUi.colors,
          light: { ...mazUi.colors.light, muted: '' as any },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: true,
      })

      it('then no per-step scale vars are emitted for the missing color', () => {
        expect(css).not.toMatch(/--maz-muted-500:/)
      })

      it('then other scaled colors still have their per-step vars', () => {
        expect(css).toContain('--maz-primary-500:')
      })
    })
  })

  describe('given a falsy base color', () => {
    describe('when one color entry is empty', () => {
      const preset = {
        ...mazUi,
        colors: {
          ...mazUi.colors,
          light: { ...mazUi.colors.light, accent: '' as any },
        },
      }
      const css = generateCSS(preset, {
        prefix: 'maz',
        mode: 'light',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        scaleColorVariables: false,
      })

      it('then the falsy color is skipped and other colors are emitted', () => {
        expect(css).not.toMatch(/--maz-accent:\s/)
        expect(css).toContain('--maz-primary:')
      })
    })
  })

  describe('given no @property blocks ever emitted', () => {
    const css = generateCSS(mazUi, {
      prefix: 'maz',
      mode: 'both',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      scaleColorVariables: false,
    })

    it('then no @property blocks are emitted', () => {
      expect(css).not.toContain('@property --maz-')
    })

    it('then no transition rule is emitted', () => {
      expect(css).not.toMatch(/transition:\s*--maz-/)
    })
  })
})

describe('given injectCSS function', () => {
  afterEach(() => {
    document.querySelectorAll('style').forEach(el => el.remove())
    vi.mocked(isServer).mockReturnValue(false)
  })

  describe('when running on the server', () => {
    it('then it returns early without touching the DOM', () => {
      vi.mocked(isServer).mockReturnValue(true)
      const initialChildren = document.head.children.length

      injectCSS(CSS_ID, ':root { --test: 1; }')

      expect(document.head.children.length).toBe(initialChildren)
    })
  })

  describe('when no style element exists', () => {
    it('then it creates a new style element and injects CSS', () => {
      injectCSS(CSS_ID, ':root { --test: 1; }')

      const el = document.querySelector(`#${CSS_ID}`)
      expect(el).not.toBeNull()
      expect(el?.textContent).toBe(':root { --test: 1; }')
    })
  })

  describe('when a single style element already exists', () => {
    it('then it updates the existing element content', () => {
      const style = document.createElement('style')
      style.id = CSS_ID
      style.textContent = 'old-css'
      document.head.appendChild(style)

      injectCSS(CSS_ID, 'new-css')

      expect(style.textContent).toBe('new-css')
    })
  })

  describe('when multiple style elements with the same id exist', () => {
    it('then it removes duplicates and keeps the last one', () => {
      for (let i = 0; i < 3; i++) {
        const style = document.createElement('style')
        style.id = CSS_ID
        document.head.appendChild(style)
      }

      injectCSS(CSS_ID, 'final-css')

      const elements = document.querySelectorAll(`#${CSS_ID}`)
      expect(elements.length).toBe(1)
      expect(elements[0].textContent).toBe('final-css')
    })
  })
})

describe('given removeCSS function', () => {
  afterEach(() => {
    document.querySelectorAll('style').forEach(el => el.remove())
    vi.mocked(isServer).mockReturnValue(false)
  })

  describe('when running on the server', () => {
    it('then it returns early without touching the DOM', () => {
      const style = document.createElement('style')
      style.id = CSS_ID
      document.head.appendChild(style)

      vi.mocked(isServer).mockReturnValue(true)

      removeCSS(CSS_ID)

      expect(document.querySelector(`#${CSS_ID}`)).not.toBeNull()
    })
  })

  describe('when style element exists', () => {
    it('then it removes the style element', () => {
      const style = document.createElement('style')
      style.id = CSS_ID
      document.head.appendChild(style)

      removeCSS(CSS_ID)

      expect(document.querySelector(`#${CSS_ID}`)).toBeNull()
    })
  })

  describe('when no style element exists', () => {
    it('then it does nothing', () => {
      expect(() => removeCSS(CSS_ID)).not.toThrow()
    })
  })

  describe('when multiple style elements exist', () => {
    it('then it removes all of them', () => {
      for (let i = 0; i < 3; i++) {
        const style = document.createElement('style')
        style.id = CSS_ID
        document.head.appendChild(style)
      }

      removeCSS(CSS_ID)

      expect(document.querySelectorAll(`#${CSS_ID}`).length).toBe(0)
    })
  })
})
