import { analyze, processTerm, stem, tokenize } from '../text'

describe('given stem', () => {
  describe('when a word is short or contains digits', () => {
    it('then it is kept as is', () => {
      expect(stem('bars')).toBe('bars')
      expect(stem('i18n')).toBe('i18n')
    })
  })

  describe('when a word has an English suffix', () => {
    it.each([
      ['categories', 'category'],
      ['boxes', 'box'],
      ['matches', 'match'],
      ['buttons', 'button'],
      ['loading', 'load'],
      ['clicked', 'click'],
    ])('then "%s" becomes "%s"', (word, expected) => {
      expect(stem(word)).toBe(expected)
    })
  })

  describe('when a word ends with a protected suffix', () => {
    it.each(['class', 'status', 'basis', 'string', 'speed'])('then "%s" is kept', (word) => {
      expect(stem(word)).toBe(word)
    })
  })
})

describe('given tokenize', () => {
  describe('when an identifier is compound', () => {
    it('then it returns the joined form and the parts', () => {
      expect(tokenize('MazInputPhoneNumber')).toEqual(['MazInputPhoneNumber', 'Maz', 'Input', 'Phone', 'Number'])
      expect(tokenize('use-form-validator')).toEqual(['useformvalidator', 'use', 'form', 'validator'])
    })
  })

  describe('when a word mixes letters and digits', () => {
    it('then it splits them', () => {
      expect(tokenize('Bars3')).toEqual(['Bars3', 'Bars', '3'])
    })
  })

  describe('when the text has punctuation and underscores', () => {
    it('then it splits on them', () => {
      expect(tokenize('hello, world__again')).toEqual(['hello', 'world', 'again'])
    })
  })
})

describe('given processTerm', () => {
  describe('when the term is a stopword or too short', () => {
    it('then it returns null', () => {
      expect(processTerm('the')).toBeNull()
      expect(processTerm('Maz')).toBeNull()
      expect(processTerm('a')).toBeNull()
    })
  })

  describe('when the term is meaningful', () => {
    it('then it is lowercased and stemmed', () => {
      expect(processTerm('Buttons')).toBe('button')
      expect(processTerm('$Avatar')).toBe('avatar')
    })
  })
})

describe('given analyze', () => {
  describe('when a sentence is analyzed', () => {
    it('then it returns the meaningful stemmed terms', () => {
      expect(analyze('How do I use the MazBtn buttons?')).toEqual(['mazbtn', 'btn', 'button'])
    })
  })
})
