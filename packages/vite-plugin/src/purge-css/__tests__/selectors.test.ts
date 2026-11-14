import { getRequiredClasses, splitSelectorList } from '../selectors'

describe('given splitSelectorList', () => {
  describe('when the selector has top-level commas', () => {
    it('then it splits and trims the selectors', () => {
      expect(splitSelectorList('.a, .b ,.c')).toEqual(['.a', '.b', '.c'])
    })
  })

  describe('when the commas are inside functions or attributes', () => {
    it('then it keeps them in the same selector', () => {
      expect(splitSelectorList('.a:is(.b, .c), [data-x="1,2"], .d')).toEqual(['.a:is(.b, .c)', '[data-x="1,2"]', '.d'])
    })
  })

  describe('when a comma is escaped', () => {
    it('then it does not split on it', () => {
      expect(splitSelectorList('.a\\,b, .c')).toEqual(['.a\\,b', '.c'])
    })
  })

  describe('when a comma is inside quotes', () => {
    it('then it does not split on it', () => {
      expect(splitSelectorList('[a=\'x,y\'], .b')).toEqual(['[a=\'x,y\']', '.b'])
    })
  })

  describe('when the quotes contain an escaped quote', () => {
    it('then it skips the escaped character', () => {
      expect(splitSelectorList('[a="x\\",y"], .b')).toEqual(['[a="x\\",y"]', '.b'])
    })
  })

  describe('when a string is not closed', () => {
    it('then it keeps the rest in one selector', () => {
      expect(splitSelectorList('[a="x, .b')).toEqual(['[a="x, .b'])
    })
  })

  describe('when the selector is empty or has empty parts', () => {
    it('then it filters the empty selectors', () => {
      expect(splitSelectorList('')).toEqual([])
      expect(splitSelectorList('.a,,')).toEqual(['.a'])
    })
  })
})

describe('given getRequiredClasses', () => {
  describe('when the selector has plain classes', () => {
    it('then it returns every class', () => {
      expect(getRequiredClasses('.a.b > .c:hover')).toEqual(['a', 'b', 'c'])
    })
  })

  describe('when a class has escapes', () => {
    it('then it resolves the escaped characters', () => {
      expect(getRequiredClasses('.maz\\:p-2\\.5')).toEqual(['maz:p-2.5'])
      expect(getRequiredClasses('.maz\\:w-\\[10px\\]')).toEqual(['maz:w-[10px]'])
    })
  })

  describe('when a class has hexadecimal escapes', () => {
    it('then it decodes them and consumes the trailing whitespace', () => {
      expect(getRequiredClasses('.\\31 0')).toEqual(['10'])
      expect(getRequiredClasses('.a\\41 b')).toEqual(['aAb'])
    })

    it('then it keeps the following character when there is no whitespace', () => {
      expect(getRequiredClasses('.\\41.b')).toEqual(['A', 'b'])
    })

    it('then it decodes an escape at the end of the selector', () => {
      expect(getRequiredClasses('.\\41')).toEqual(['A'])
    })
  })

  describe('when the selector ends with a lone backslash', () => {
    it('then it ignores it', () => {
      expect(getRequiredClasses('.a\\')).toEqual(['a'])
    })
  })

  describe('when a class has a non-ASCII character', () => {
    it('then it is part of the class', () => {
      expect(getRequiredClasses('.café')).toEqual(['café'])
    })
  })

  describe('when a dot has no identifier', () => {
    it('then it returns no class', () => {
      expect(getRequiredClasses('. a')).toEqual([])
    })
  })

  describe('when classes are inside pseudo-class functions', () => {
    it('then it ignores them', () => {
      expect(getRequiredClasses('.a:not(.b):is(.c, .d):where(.e):has(.f) .g')).toEqual(['a', 'g'])
    })
  })

  describe('when classes are inside attribute selectors or strings', () => {
    it('then it ignores them', () => {
      expect(getRequiredClasses('[data-x=".no"].yes[data-y=\'.no\']')).toEqual(['yes'])
    })
  })

  describe('when the selector has an escaped dot outside a class', () => {
    it('then it skips the escaped character', () => {
      expect(getRequiredClasses('a\\.b.c')).toEqual(['c'])
    })
  })
})
