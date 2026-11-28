import { runScramble, runTypewriter, scrambleText, splitHighlights, typingDelays } from '@/utils/animatedText.ts'

describe('given scrambleText', () => {
  describe('when the progress is 0', () => {
    it('then the letters are random and the spaces and punctuation stay', () => {
      const result = scrambleText('Hi, you!', 0, [1, 1, 1, 1, 1, 1, 1, 1], () => 0)

      expect(result).toBe('AA, AAA!')
    })
  })

  describe('when the progress is 1', () => {
    it('then the text is the real one', () => {
      expect(scrambleText('Hi, you!', 1, [1, 1, 1, 1, 1, 1, 1, 1])).toBe('Hi, you!')
    })
  })

  describe('when the progress is in the middle', () => {
    it('then the first letters are settled and the last ones are not', () => {
      const result = scrambleText('abcdef', 0.4, [0, 0, 0, 0, 0, 0], () => 0)

      expect(result.startsWith('abc')).toBe(true)
      expect(result.endsWith('AAA')).toBe(true)
    })
  })

  describe('when the text is a single letter', () => {
    it('then it does not divide by zero', () => {
      expect(scrambleText('a', 1, [0])).toBe('a')
    })
  })
})

describe('given runScramble', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when it runs to the end', () => {
    it('then frames are sent, then onDone is called once', () => {
      const onFrame = vi.fn()
      const onDone = vi.fn()

      runScramble('Hello', { duration: 200, onFrame, onDone, random: () => 0.5 })

      expect(onFrame).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(500)

      expect(onFrame.mock.calls.length).toBeGreaterThan(2)
      expect(onDone).toHaveBeenCalledTimes(1)
    })
  })

  describe('when it is cancelled', () => {
    it('then onDone is never called', () => {
      const onDone = vi.fn()
      const cancel = runScramble('Hello', { duration: 200, onFrame: vi.fn(), onDone })

      cancel()
      vi.advanceTimersByTime(500)

      expect(onDone).not.toHaveBeenCalled()
    })
  })
})

describe('given typingDelays', () => {
  describe('when the text has punctuation', () => {
    it('then a pause follows a comma and a full stop', () => {
      const delays = typingDelays('a, b. c', () => 0)

      expect(delays[2]).toBe(160 + 35)
      expect(delays[5]).toBe(320 + 35)
      expect(delays[0]).toBe(55)
    })
  })
})

describe('given runTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when it runs', () => {
    it('then the text is typed one character at a time, then onDone is called', () => {
      const onType = vi.fn()
      const onDone = vi.fn()

      runTypewriter('abc', { onType, onDone, delay: 100, random: () => 0 })

      expect(onType).toHaveBeenLastCalledWith('')

      vi.advanceTimersByTime(100 + 55)

      expect(onType).toHaveBeenLastCalledWith('a')

      vi.advanceTimersByTime(1000)

      expect(onType).toHaveBeenLastCalledWith('abc')
      expect(onDone).toHaveBeenCalledTimes(1)
    })
  })

  describe('when it is cancelled', () => {
    it('then nothing more is typed', () => {
      const onType = vi.fn()
      const cancel = runTypewriter('abc', { onType, onDone: vi.fn() })

      cancel()
      vi.advanceTimersByTime(1000)

      expect(onType).toHaveBeenCalledTimes(1)
    })
  })
})

describe('given splitHighlights', () => {
  describe('when there is no word', () => {
    it('then the text is a single plain segment', () => {
      expect(splitHighlights('Hello world', undefined)).toEqual([{ text: 'Hello world', mark: false }])
      expect(splitHighlights('Hello world', ['  '])).toEqual([{ text: 'Hello world', mark: false }])
    })
  })

  describe('when words are given', () => {
    it('then they are marked, whatever their case', () => {
      expect(splitHighlights('Fast and Beautiful', ['beautiful', 'fast'])).toEqual([
        { text: 'Fast', mark: true },
        { text: ' and ', mark: false },
        { text: 'Beautiful', mark: true },
      ])
    })

    it('then a single string works and special characters are escaped', () => {
      expect(splitHighlights('Is it c++?', 'c++')).toEqual([
        { text: 'Is it ', mark: false },
        { text: 'c++', mark: true },
        { text: '?', mark: false },
      ])
    })
  })
})
