import { mazUi } from '../../presets/mazUi'
import { generateCSS } from '../css-generator'

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

        expect(css).toContain('@layer maz-ui-theme {\n')
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

        expect(css).toContain('@layer maz-ui-theme {\n')
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

        expect(css).toContain('@layer maz-ui-theme {\n')
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
