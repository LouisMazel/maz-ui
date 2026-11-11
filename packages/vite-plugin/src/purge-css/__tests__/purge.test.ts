import type { PurgeDecision } from '../purge'
import { PUBLIC_UTILITIES_LAYER, purgeCss } from '../purge'

function createDecision(used: string[], utilities: string[] = []): PurgeDecision {
  return {
    isManaged: (className, inPublicLayer) => className.startsWith('maz:') || (inPublicLayer && utilities.includes(className)),
    isUsed: className => used.includes(className),
  }
}

describe('given purgeCss', () => {
  describe('when every managed class is used', () => {
    it('then it returns the original CSS untouched', () => {
      const css = '.maz\\:p-2{padding:1px}'
      const result = purgeCss(css, createDecision(['maz:p-2']))

      expect(result.css).toBe(css)
      expect(result.removed.size).toBe(0)
    })
  })

  describe('when a managed class is unused', () => {
    it('then it removes the rule and reports the class', () => {
      const result = purgeCss('.maz\\:p-2{padding:1px}.maz\\:flex{display:flex}', createDecision(['maz:p-2']))

      expect(result.css).toBe('.maz\\:p-2{padding:1px}')
      expect([...result.removed]).toEqual(['maz:flex'])
    })
  })

  describe('when a selector list mixes used and unused classes', () => {
    it('then it keeps only the selectors that remain valid', () => {
      const result = purgeCss('.maz\\:a, .maz\\:b, .other{color:red}', createDecision(['maz:a']))

      expect(result.css).toBe('.maz\\:a,.other{color:red}')
    })
  })

  describe('when the selector is not managed', () => {
    it('then it keeps the rule', () => {
      const css = '.foo{color:red}a:hover{color:blue}'

      expect(purgeCss(css, createDecision([])).css).toBe(css)
    })
  })

  describe('when a managed class is inside a pseudo-class function', () => {
    it('then the rule does not depend on it', () => {
      const css = '.foo:not(.maz\\:x){color:red}'

      expect(purgeCss(css, createDecision([])).css).toBe(css)
    })
  })

  describe('when a public utility is outside the public layer', () => {
    it('then it is not managed and stays', () => {
      const css = '.text-title-1{font-size:2rem}'

      expect(purgeCss(css, createDecision([], ['text-title-1'])).css).toBe(css)
    })
  })

  describe('when a public utility is inside the public layer', () => {
    it('then it is removed when unused', () => {
      const css = `@layer ${PUBLIC_UTILITIES_LAYER}{.text-title-1{font-size:2rem}.padded{padding:0}}`
      const result = purgeCss(css, createDecision(['padded'], ['text-title-1', 'padded']))

      expect(result.css).toBe('@layer maz{.padded{padding:0}}')
      expect([...result.removed]).toEqual(['text-title-1'])
    })

    it('then it is found through nested at-rules', () => {
      const css = '@layer maz{@media (min-width:1px){.text-title-1{font-size:2rem}}}'

      expect(purgeCss(css, createDecision([], ['text-title-1'])).css).toBe('')
    })
  })

  describe('when a rule is inside another layer or at-rule', () => {
    it('then it is not in the public layer', () => {
      const css = '@layer other{.text-title-1{a:b}}@media print{.text-title-1{a:b}}'

      expect(purgeCss(css, createDecision([], ['text-title-1'])).css).toBe(css)
    })
  })

  describe('when a rule is inside keyframes', () => {
    it('then it is skipped', () => {
      const css = '@keyframes spin{from{opacity:0}to{opacity:1}}@-webkit-keyframes spin{from{opacity:0}}.maz\\:x{a:b}'
      const result = purgeCss(css, createDecision([]))

      expect(result.css).toBe('@keyframes spin{from{opacity:0}to{opacity:1}}@-webkit-keyframes spin{from{opacity:0}}')
    })
  })

  describe('when an at-rule is left empty by the purge', () => {
    it('then it removes it and its empty parents', () => {
      const css = '@layer a, b;@media (min-width:1px){@supports (display:grid){.maz\\:x{a:b}}}.keep{a:b}@layer c{.maz\\:y{a:b}}'
      const result = purgeCss(css, createDecision([]))

      expect(result.css).toBe('@layer a, b;.keep{a:b}')
    })
  })

  describe('when an at-rule without body stays in a changed file', () => {
    it('then the statement is kept', () => {
      const css = '@import "x.css";@layer a, b;.maz\\:x{a:b}'

      expect(purgeCss(css, createDecision([])).css).toBe('@import "x.css";@layer a, b;')
    })
  })
})
