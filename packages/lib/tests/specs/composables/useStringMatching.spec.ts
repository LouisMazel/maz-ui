import { useStringMatching } from '@composables/useStringMatching'
import { ref } from 'vue'

describe('given useStringMatching composable', () => {
  describe('when comparing identical strings', () => {
    it('then it should return perfect match', () => {
      const { score, isMatching } = useStringMatching('hello', 'hello')

      expect(score.value).toBe(1)
      expect(isMatching.value).toBe(true)
    })
  })

  describe('when comparing completely different strings', () => {
    it('then it should return low score and no match', () => {
      const { score, isMatching } = useStringMatching('hello', 'world')

      expect(score.value).toBeLessThan(0.75)
      expect(isMatching.value).toBe(false)
    })
  })

  describe('when comparing similar strings', () => {
    it('then it should return high score and match', () => {
      const { score, isMatching } = useStringMatching('hello', 'helo')

      expect(score.value).toBeGreaterThan(0.75)
      expect(isMatching.value).toBe(true)
    })
  })

  describe('when using reactive string values', () => {
    it('then it should update when values change', () => {
      const string1 = ref('hello')
      const string2 = ref('hello')

      const { score, isMatching } = useStringMatching(string1, string2)

      expect(score.value).toBe(1)
      expect(isMatching.value).toBe(true)

      string2.value = 'world'

      expect(score.value).toBeLessThan(0.75)
      expect(isMatching.value).toBe(false)
    })
  })

  describe('when using custom threshold', () => {
    it('then it should use custom threshold for matching', () => {
      const { isMatching } = useStringMatching('hello', 'helo', 0.9)

      expect(isMatching.value).toBe(false)
    })

    it('then it should use reactive threshold', () => {
      const threshold = ref(0.9)
      const { isMatching } = useStringMatching('hello', 'helo', threshold)

      expect(isMatching.value).toBe(false)

      threshold.value = 0.5

      expect(isMatching.value).toBe(true)
    })
  })

  describe('when comparing empty strings', () => {
    it('then it should return perfect match for both empty', () => {
      const { score, isMatching } = useStringMatching('', '')

      expect(score.value).toBe(1)
      expect(isMatching.value).toBe(true)
    })

    it('then it should return no match for empty vs non-empty', () => {
      const { score, isMatching } = useStringMatching('', 'hello')

      expect(score.value).toBe(0)
      expect(isMatching.value).toBe(false)
    })
  })

  describe('when comparing strings with different cases', () => {
    it('then it should normalize case for comparison', () => {
      const { score, isMatching } = useStringMatching('Hello', 'hello')

      expect(score.value).toBe(1)
      expect(isMatching.value).toBe(true)
    })
  })

  describe('when comparing strings with accents', () => {
    it('then it should normalize accents for comparison', () => {
      const { score, isMatching } = useStringMatching('café', 'cafe')

      expect(score.value).toBe(1)
      expect(isMatching.value).toBe(true)
    })
  })

  describe('when comparing strings with special characters', () => {
    it('then it should normalize special characters', () => {
      const { score, isMatching } = useStringMatching('hello-world', 'hello world')

      expect(score.value).toBeGreaterThan(0.75)
      expect(isMatching.value).toBe(true)
    })
  })

  describe('when using getter functions', () => {
    it('then it should work with getter functions', () => {
      const getValue1 = () => 'hello'
      const getValue2 = () => 'hello'

      const { score, isMatching } = useStringMatching(getValue1, getValue2)

      expect(score.value).toBe(1)
      expect(isMatching.value).toBe(true)
    })
  })

  describe('when comparing strings with different lengths', () => {
    it('then it should handle length differences properly', () => {
      const { score, isMatching } = useStringMatching('hello', 'hello world')

      expect(score.value).toBeLessThan(1)
      expect(isMatching.value).toBe(false)
    })
  })
})
