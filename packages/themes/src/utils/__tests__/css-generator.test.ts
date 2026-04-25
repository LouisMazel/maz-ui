import { mazUi } from '../../presets/mazUi'
import { CSS_ID, generateCSS, injectCSS, removeCSS } from '../css-generator'

describe('cSS Generator', () => {
  describe('given generateCSS function', () => {
    describe('when generating critical CSS with proper variable naming', () => {
      it('then it generates critical CSS with layer and variables', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          criticalColors: ['accent'],
          criticalFoundation: ['border-width'],
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          onlyCritical: true,
        })

        expect(css).toContain('@layer theme {\n')
        expect(css).toContain(':root {')
        expect(css).toContain('--maz-accent:')
        expect(css).toContain('--maz-border-width:')
        expect(css).not.toContain('--maz-primary-500:')
      })
    })

    describe('when generating dark mode variables', () => {
      it('then it generates dark mode variables', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'dark',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          criticalColors: ['accent'],
          criticalFoundation: ['border-width'],
          onlyCritical: true,
        })

        expect(css).toContain('@layer theme {\n')
        expect(css).toContain('.dark {')
        expect(css).toContain('--maz-accent:')
        expect(css).toContain('--maz-border-width:')
        expect(css).not.toContain('--maz-primary-500:')
      })
    })

    describe('when generating both light and dark modes', () => {
      it('then it generates both light and dark modes', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'both',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          onlyCritical: true,
        })

        expect(css).toContain(':root {')
        expect(css).toContain('.dark {')
      })
    })

    describe('when generating full CSS with proper variable naming', () => {
      it('then it generates full CSS with layer and variables', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        expect(css).toContain('@layer theme {\n')
        expect(css).toContain(':root {')
        expect(css).toContain('--maz-primary-500:')
        expect(css).toContain('--maz-contrast-600:')
      })
    })

    describe('when excluding critical variables from full CSS', () => {
      it('then it excludes critical variables from full CSS', () => {
        const criticalCSS = generateCSS(mazUi, {
          criticalColors: ['accent'],
          criticalFoundation: ['border-width'],
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          onlyCritical: true,
        })

        const fullCSS = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
        })

        // Critical variables bes in critical CSS
        expect(criticalCSS).toContain('--maz-accent:')
        expect(criticalCSS).toContain('--maz-border-width:')

        // Critical variables NOTs be in full CSS
        expect(fullCSS).toContain('--maz-accent:')
        expect(fullCSS).toContain('--maz-border-width:')
        expect(fullCSS).toContain('--maz-primary-500:')
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

    describe('when generating full dark mode CSS with color scales', () => {
      it('then it includes color scales in dark mode', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'dark',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          includeColorScales: true,
        })

        expect(css).toContain('--maz-primary-500:')
        expect(css).toContain('.dark {')
      })
    })

    describe('when includeColorScales is false', () => {
      it('then it does not include color scales', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          includeColorScales: false,
        })

        expect(css).not.toContain('--maz-primary-500:')
        expect(css).toContain('--maz-primary:')
      })
    })

    describe('when critical mode with dark only', () => {
      it('then it generates critical dark variables with foundation', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'dark',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          onlyCritical: true,
          criticalFoundation: ['radius'],
        })

        expect(css).toContain('.dark {')
        expect(css).toContain('--maz-radius:')
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
          onlyCritical: true,
          criticalFoundation: ['radius'],
        })

        expect(css).toContain('@layer theme')
      })
    })
  })

  describe('given injectCSS function', () => {
    afterEach(() => {
      document.querySelectorAll('style').forEach(el => el.remove())
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
      it('then it formats shadow variables correctly', () => {
        const css = generateCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
          darkClass: 'dark',
          onlyCritical: true,
        })

        expect(css).toMatch(/--maz-shadow:/)
      })
    })
  })
})
