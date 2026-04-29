import { isServer } from '@maz-ui/utils/helpers/isServer'
import { mazUi } from '../../presets/mazUi'
import { CSS_ID, generateCSS, injectCSS, removeCSS } from '../css-generator'

vi.mock('@maz-ui/utils/helpers/isServer', () => ({
  isServer: vi.fn(() => false),
}))

describe('cSS Generator', () => {
  describe('given generateCSS function', () => {
    describe('when generating light mode CSS', () => {
      it('then it generates a layered :root block with the full token set', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('@layer theme {\n')
        expect(css).toContain(':root {')
        expect(css).toContain('--maz-primary:')
        expect(css).toContain('--maz-border-width:')
        expect(css).toContain('--maz-primary-500:')
        expect(css).toContain('--maz-contrast-600:')
      })
    })

    describe('when generating dark mode CSS', () => {
      it('then it generates a layered .dark block with foundation and color scales', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'dark',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('@layer theme {\n')
        expect(css).toContain('.dark {')
        expect(css).toContain('--maz-primary:')
        expect(css).toContain('--maz-border-width:')
        expect(css).toContain('--maz-primary-500:')
      })
    })

    describe('when generating both light and dark modes', () => {
      it('then it generates :root and .dark blocks', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain(':root {')
        expect(css).toContain('.dark {')
      })
    })

    describe('when generating dark mode with media query strategy', () => {
      it('then it wraps dark variables in @media prefers-color-scheme', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'dark',
          darkSelectorStrategy: 'media',
          darkClass: 'dark',
        })

        expect(css).toContain('@media (prefers-color-scheme: dark)')
        expect(css).toContain(':root {')
      })
    })

    describe('when generating both modes with media query strategy', () => {
      it('then it generates both light root and media query dark', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'both',
          darkSelectorStrategy: 'media',
          darkClass: 'dark',
        })

        expect(css).toContain(':root {')
        expect(css).toContain('@media (prefers-color-scheme: dark)')
      })
    })

    describe('when full CSS is generated', () => {
      it('then it emits the foundation space token', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('--maz-space:')
      })

      it('then it emits the rounded scale (xs..3xl)', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        for (const key of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'])
          expect(css).toContain(`--maz-rounded-${key}:`)
      })

      it('then it emits the shadow style scale (with the maz-specific elevation key)', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        for (const key of ['sm', 'md', 'lg', 'xl', 'elevation'])
          expect(css).toContain(`--maz-shadow-style-${key}:`)
      })

      it('then it does not emit a fontSize scale (typography stays driven by base-font-size)', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).not.toMatch(/--maz-text-(?:mini|xs|sm|md|lg|xl):/)
      })

      it('then it emits the renamed surface / divider color vars (no background / border anymore)', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('--maz-surface:')
        expect(css).toContain('--maz-divider:')
        expect(css).not.toMatch(/--maz-background\b/)
        expect(css).not.toMatch(/--maz-border:[^-]/)
      })
    })

    describe('when components.container.bg / input.bg are provided', () => {
      it('then it emits --maz-container-bg / --maz-input-bg per mode', () => {
        const presetWithComponents = {
          ...mazUi,
          components: {
            container: { bg: { light: 'oklch(0.9 0 0)', dark: 'oklch(0.3 0 0)' } },
            input: { bg: { light: 'oklch(0.95 0 0)', dark: 'oklch(0.25 0 0)' } },
          },
        }

        const css = generateCSS(presetWithComponents, {
          prefix: 'maz',
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        const lightBlock = css.split('.dark {')[0]
        expect(lightBlock).toContain('--maz-container-bg: oklch(0.9 0 0)')
        expect(lightBlock).toContain('--maz-input-bg: oklch(0.95 0 0)')

        const darkBlock = css.split('.dark {')[1]
        expect(darkBlock).toContain('--maz-container-bg: oklch(0.3 0 0)')
        expect(darkBlock).toContain('--maz-input-bg: oklch(0.25 0 0)')
      })
    })

    describe('when scales.shadow has a falsy entry', () => {
      it('then the falsy shadow value is skipped without emitting a var', () => {
        const presetWithEmptyShadow = {
          ...mazUi,
          scales: {
            ...mazUi.scales,
            shadow: { ...mazUi.scales.shadow, sm: '' },
          },
        }

        const css = generateCSS(presetWithEmptyShadow as any, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).not.toContain('--maz-shadow-style-sm:')
        expect(css).toContain('--maz-shadow-style-md:')
      })
    })

    describe('when components.btn.font-weight is provided', () => {
      it('then it emits --maz-btn-font-weight on the light root', () => {
        const presetWithBtn = {
          ...mazUi,
          components: {
            btn: { 'font-weight': '600' },
          },
        }

        const css = generateCSS(presetWithBtn, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('--maz-btn-font-weight: 600')
      })
    })

    describe('when preset has no foundation', () => {
      it('then it generates CSS without foundation variables', () => {
        const presetWithoutFoundation = {
          ...mazUi,
          foundation: undefined as any,
        }

        const css = generateCSS(presetWithoutFoundation, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('@layer theme')
        expect(css).not.toContain('--maz-border-width:')
      })
    })

    describe('when colors entries contain falsy values', () => {
      it('then it skips falsy colors and emits the truthy ones', () => {
        const presetWithFalsyColor = {
          ...mazUi,
          colors: {
            ...mazUi.colors,
            light: { ...mazUi.colors.light, accent: '' as any },
          },
        }

        const css = generateCSS(presetWithFalsyColor, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).not.toMatch(/--maz-accent:\s/)
        expect(css).toContain('--maz-primary:')
      })
    })

    describe('when foundation entries contain falsy values', () => {
      it('then it skips falsy foundation tokens and emits the truthy ones', () => {
        const presetWithFalsyFoundation = {
          ...mazUi,
          foundation: { ...mazUi.foundation, 'border-width': '' as any },
        }

        const css = generateCSS(presetWithFalsyFoundation, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).not.toContain('--maz-border-width:')
        expect(css).toContain('--maz-base-font-size:')
      })
    })

    describe('when preset has no scales block', () => {
      it('then no rounded or shadow style vars are emitted', () => {
        const presetWithoutScales = {
          ...mazUi,
          scales: undefined as any,
        }

        const css = generateCSS(presetWithoutScales, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).not.toMatch(/--maz-rounded-/)
        expect(css).not.toMatch(/--maz-shadow-style-/)
      })
    })

    describe('when components is provided without container or input bg', () => {
      it('then it only emits the available component vars', () => {
        const presetWithBtnOnly = {
          ...mazUi,
          components: { btn: { 'font-weight': '700' } },
        }

        const css = generateCSS(presetWithBtnOnly, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('--maz-btn-font-weight: 700')
        expect(css).not.toContain('--maz-container-bg:')
        expect(css).not.toContain('--maz-input-bg:')
      })
    })

    describe('when components.container.bg is missing the active mode', () => {
      it('then it does not emit the container var for that mode', () => {
        const presetLightOnlyContainer = {
          ...mazUi,
          components: {
            container: { bg: { light: 'oklch(0.9 0 0)' } },
          },
        }

        const css = generateCSS(presetLightOnlyContainer, {
          prefix: 'maz',
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        const lightBlock = css.split('.dark {')[0]
        const darkBlock = css.split('.dark {')[1]

        expect(lightBlock).toContain('--maz-container-bg: oklch(0.9 0 0)')
        expect(darkBlock).not.toContain('--maz-container-bg:')
      })
    })

    describe('when a scaleColor base is missing', () => {
      it('then no per-step scale vars are emitted for the missing color', () => {
        const presetMissingMuted = {
          ...mazUi,
          colors: {
            ...mazUi.colors,
            light: { ...mazUi.colors.light, muted: '' as any },
          },
        }

        const css = generateCSS(presetMissingMuted, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).not.toMatch(/--maz-muted-500:/)
        expect(css).toContain('--maz-primary-500:')
      })
    })

    describe('when generateCSS is called without options', () => {
      it('then it falls back to default options', () => {
        const css = generateCSS(mazUi)

        expect(css).toContain('@layer theme {\n')
        expect(css).toContain(':root {')
        expect(css).toContain('.dark {')
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

  describe('given variable formatting', () => {
    describe('when formatting base variables', () => {
      it('then it formats base variables correctly', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('--maz-primary-500:')
        expect(css).toContain('--maz-contrast-600:')
      })
    })

    describe('when formatting shadow variables', () => {
      it('then it emits the shadow color variable', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toMatch(/--maz-shadow:/)
      })
    })
  })
})
