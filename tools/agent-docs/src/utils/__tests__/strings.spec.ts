import { kebabToCamel, kebabToPascal, pascalToKebab, splitWords, truncate, unique } from '../strings'

describe('given kebabToPascal', () => {
  describe('when the value is kebab or snake case', () => {
    it('then returns PascalCase', () => {
      expect(kebabToPascal('maz-input-phone-number')).toBe('MazInputPhoneNumber')
      expect(kebabToPascal('click_outside')).toBe('ClickOutside')
      expect(kebabToPascal('--a--b')).toBe('AB')
    })
  })
})

describe('given kebabToCamel', () => {
  describe('when the value is kebab case', () => {
    it('then returns camelCase', () => {
      expect(kebabToCamel('use-form-validator')).toBe('useFormValidator')
    })
  })
})

describe('given pascalToKebab', () => {
  describe('when the value is PascalCase with acronyms and digits', () => {
    it('then returns kebab case', () => {
      expect(pascalToKebab('MazInputPhoneNumber')).toBe('maz-input-phone-number')
      expect(pascalToKebab('MazUIProvider')).toBe('maz-ui-provider')
      expect(pascalToKebab('Cog6Tooth')).toBe('cog6-tooth')
    })
  })
})

describe('given splitWords', () => {
  describe('when the value mixes cases and separators', () => {
    it('then returns lowercase words', () => {
      expect(splitWords('MazInputPhoneNumber')).toEqual(['maz', 'input', 'phone', 'number'])
      expect(splitWords('use-form_validator')).toEqual(['use', 'form', 'validator'])
      expect(splitWords('HTMLElement')).toEqual(['html', 'element'])
    })
  })
})

describe('given unique', () => {
  describe('when the iterable has duplicates', () => {
    it('then keeps the first occurrences in order', () => {
      expect(unique(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c'])
    })
  })
})

describe('given truncate', () => {
  describe('when the value fits', () => {
    it('then returns it unchanged', () => {
      expect(truncate('short', 10)).toBe('short')
    })
  })

  describe('when the value is too long', () => {
    it('then cuts it and adds an ellipsis', () => {
      expect(truncate('a very long sentence', 10)).toBe('a very...')
    })
  })
})
