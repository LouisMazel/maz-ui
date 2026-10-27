import { getKnowledge } from '../../__tests__/helpers'
import { closest, editDistance, normalizeName, resolveComponent, resolveDoc, toKebab } from '../resolve'

describe('given resolveDoc on the real bundle', () => {
  describe('when the query is an id', () => {
    it('then it returns the doc', () => {
      expect(resolveDoc(getKnowledge(), 'components/maz-btn')?.id).toBe('components/maz-btn')
      expect(resolveDoc(getKnowledge(), 'guide/tailwind')?.id).toBe('guide/tailwind')
    })
  })

  describe('when the query is a symbol or a name', () => {
    it.each([
      ['MazBtn', 'components/maz-btn'],
      ['useToast', 'composables/use-toast'],
      ['vTooltip', 'directives/tooltip'],
      ['v-tooltip', 'directives/tooltip'],
      ['debounce', 'ecosystem/utils/debounce'],
      ['btn', 'components/maz-btn'],
      ['maz-avatar', 'components/maz-avatar'],
      ['mazbtn', 'components/maz-btn'],
    ])('then "%s" resolves to %s', (query, id) => {
      expect(resolveDoc(getKnowledge(), query)?.id).toBe(id)
    })
  })

  describe('when the query is a URL, a legacy URI or a partial path', () => {
    it.each([
      ['https://maz-ui.com/components/maz-btn', 'components/maz-btn'],
      ['component://maz-btn', 'components/maz-btn'],
      ['maz-ui://components/maz-btn', 'components/maz-btn'],
      ['utils/debounce', 'ecosystem/utils/debounce'],
      ['components/maz-btn.md', 'components/maz-btn'],
      ['guides/tailwind', 'guide/tailwind'],
    ])('then "%s" resolves to %s', (query, id) => {
      expect(resolveDoc(getKnowledge(), query)?.id).toBe(id)
    })
  })

  describe('when a category is given', () => {
    it('then only this category is searched', () => {
      expect(resolveDoc(getKnowledge(), 'dialog', 'plugin')?.id).toBe('plugins/dialog')
      expect(resolveDoc(getKnowledge(), 'components/maz-btn', 'plugin')).toBeUndefined()
    })
  })

  describe('when the title matches', () => {
    it('then it resolves by title', () => {
      expect(resolveDoc(getKnowledge(), 'Tailwind CSS')?.id).toBe('guide/tailwind')
    })
  })

  describe('when nothing matches', () => {
    it('then it returns undefined', () => {
      expect(resolveDoc(getKnowledge(), 'definitely-not-a-doc')).toBeUndefined()
      expect(resolveDoc(getKnowledge(), 'nothing/definitely-not-a-doc')).toBeUndefined()
    })
  })
})

describe('given resolveComponent', () => {
  describe('when the name has various forms', () => {
    it.each(['MazBtn', 'maz-btn', 'btn', '<MazBtn>', 'components/MazBtn', '<MazBtn />'])('then "%s" resolves to MazBtn', (query) => {
      expect(resolveComponent(getKnowledge(), query)?.name).toBe('MazBtn')
    })
  })

  describe('when the component does not exist', () => {
    it('then it returns undefined', () => {
      expect(resolveComponent(getKnowledge(), 'MazNothing')).toBeUndefined()
    })
  })
})

describe('given the string helpers', () => {
  describe('when toKebab is called', () => {
    it('then it converts PascalCase and acronyms', () => {
      expect(toKebab('MazInputPhoneNumber')).toBe('maz-input-phone-number')
      expect(toKebab('HTMLElement')).toBe('html-element')
    })
  })

  describe('when normalizeName is called', () => {
    it('then it strips brackets, URLs, schemes and extensions', () => {
      expect(normalizeName(' <MazBtn/> ')).toBe('MazBtn')
      expect(normalizeName('https://www.maz-ui.com/guide/vue/')).toBe('guide/vue')
      expect(normalizeName('directive://tooltip')).toBe('directives/tooltip')
      expect(normalizeName('guide/vue.md')).toBe('guide/vue')
    })
  })

  describe('when editDistance is called', () => {
    it('then it returns the Levenshtein distance', () => {
      expect(editDistance('color', 'colour')).toBe(1)
      expect(editDistance('same', 'same')).toBe(0)
      expect(editDistance('', 'abc')).toBe(3)
    })

    it('then it stops above the maximum', () => {
      expect(editDistance('a', 'abcdefgh', 3)).toBe(4)
      expect(editDistance('abcdef', 'uvwxyz', 2)).toBe(3)
    })
  })

  describe('when closest is called', () => {
    it('then it returns the nearest candidates first', () => {
      expect(closest('colour', ['color', 'size', 'colors'])).toEqual(['color', 'colors'])
    })

    it('then it respects the limit and the maximum distance', () => {
      expect(closest('abc', ['abd', 'abe', 'abf'], { limit: 1 })).toHaveLength(1)
      expect(closest('abc', ['xyz'], { max: 1 })).toEqual([])
    })
  })
})

describe('given resolveDoc with several candidates', () => {
  describe('when a symbol belongs to several docs of the same priority', () => {
    it('then one of them is returned', () => {
      expect(resolveDoc(getKnowledge(), 'defineConfig')?.id).toMatch(/^ecosystem\/(?:eslint|stylelint)-config$/)
    })
  })
})
