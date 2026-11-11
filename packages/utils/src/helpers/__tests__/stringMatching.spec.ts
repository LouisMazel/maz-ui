import { getMatchingScore, isStringMatching, levenshteinDistance } from '../stringMatching'

describe('given levenshteinDistance', () => {
  describe('when the strings are compared', () => {
    it.each([
      ['', '', 0],
      ['abc', '', 3],
      ['', 'abc', 3],
      ['kitten', 'sitting', 3],
      ['sitting', 'kitten', 3],
      ['france', 'franse', 1],
      ['same', 'same', 0],
    ])('then %s and %s are %i edits apart', (string1, string2, expected) => {
      expect(levenshteinDistance(string1, string2)).toBe(expected)
    })
  })
})

describe('given getMatchingScore', () => {
  describe('when both strings are empty', () => {
    it('then the score is 1', () => {
      expect(getMatchingScore('', '')).toBe(1)
    })
  })

  describe('when the strings differ by one character out of four', () => {
    it('then the score is 0.75', () => {
      expect(getMatchingScore('test', 'tent')).toBe(0.75)
    })
  })
})

describe('given isStringMatching', () => {
  describe('when the similarity reaches the default threshold', () => {
    it('then the strings match', () => {
      expect(isStringMatching('france', 'franse')).toBe(true)
    })
  })

  describe('when the lengths are too far apart for the threshold', () => {
    it('then the strings do not match', () => {
      expect(isStringMatching('mazvan', 'maz')).toBe(false)
    })
  })

  describe('when the threshold is below 0', () => {
    it('then it is clamped to 0 and everything matches', () => {
      expect(isStringMatching('abc', 'xyz', -1)).toBe(true)
    })
  })

  describe('when the threshold is above 1', () => {
    it('then it is clamped to 1 and only identical strings match', () => {
      expect(isStringMatching('abc', 'abc', 2)).toBe(true)
      expect(isStringMatching('abc', 'abd', 2)).toBe(false)
    })
  })

  describe('when both strings are empty', () => {
    it('then they match', () => {
      expect(isStringMatching('', '')).toBe(true)
    })
  })
})
