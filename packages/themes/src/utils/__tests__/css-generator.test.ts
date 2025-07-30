import { mazUi } from '../../presets/mazUi'
import { generateCriticalCSS, generateFullCSS } from '../css-generator'

describe('cSS Generator', () => {
  describe('given generateCriticalCSS function', () => {
    describe('when generating critical CSS with proper variable naming', () => {
      it('then it generates critical CSS with layer and variables', () => {
        const css = generateCriticalCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          criticalColors: ['accent'],
          criticalFoundation: ['border-width'],
          darkSelectorStrategy: 'class',
        })

        expect(css).toContain('@layer maz-ui-theme {\n')
        expect(css).toContain(':root {')
        expect(css).toContain('--maz-accent:')
        expect(css).toContain('--maz-border-width:')
      })
    })

    describe('when generating dark mode variables', () => {
      it('then it generates dark mode variables', () => {
        const css = generateCriticalCSS(mazUi, {
          prefix: 'maz',
          mode: 'dark',
          darkSelectorStrategy: 'class',
          criticalColors: ['accent'],
          criticalFoundation: ['border-width'],
        })

        expect(css).toContain('@layer maz-ui-theme {\n')
        expect(css).toContain('.dark {')
        expect(css).toContain('--maz-accent:')
        expect(css).toContain('--maz-border-width:')
      })
    })

    describe('when generating both light and dark modes', () => {
      it('then it generates both light and dark modes', () => {
        const css = generateCriticalCSS(mazUi, {
          prefix: 'maz',
          mode: 'both',
          darkSelectorStrategy: 'class',
        })

        expect(css).toContain(':root {')
        expect(css).toContain('.dark {')
      })
    })
  })

  describe('given generateFullCSS function', () => {
    describe('when generating full CSS with proper variable naming', () => {
      it('then it generates full CSS with layer and variables', () => {
        const css = generateFullCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
        })

        expect(css).toContain('@layer maz-ui-theme {\n')
        expect(css).toContain(':root {')
        expect(css).toContain('--maz-primary-500:')
        expect(css).toContain('--maz-contrast-600:')
      })
    })

    describe('when excluding critical variables from full CSS', () => {
      it('then it excludes critical variables from full CSS', () => {
        const criticalCSS = generateCriticalCSS(mazUi, {
          criticalColors: ['accent'],
          criticalFoundation: ['border-width'],
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
        })

        const fullCSS = generateFullCSS(mazUi, {
          excludeCritical: ['accent', 'border-width'],
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
        })

        // Critical variables bes in critical CSS
        expect(criticalCSS).toContain('--maz-accent:')
        expect(criticalCSS).toContain('--maz-border-width:')

        // Critical variables NOTs be in full CSS
        expect(fullCSS).not.toContain('--maz-accent:')
        expect(fullCSS).not.toContain('--maz-border-width:')
      })
    })
  })

  describe('given variable formatting', () => {
    describe('when formatting base variables', () => {
      it('then it formats base variables correctly', () => {
        const css = generateFullCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
        })

        expect(css).toContain('--maz-primary-500:')
        expect(css).toContain('--maz-contrast-600:')
      })
    })

    describe('when formatting shadow variables', () => {
      it('then it formats shadow variables correctly', () => {
        const css = generateCriticalCSS(mazUi, {
          prefix: 'maz',
          mode: 'light',
          darkSelectorStrategy: 'class',
        })

        expect(css).toMatch(/--maz-shadow:/)
      })
    })
  })
})
