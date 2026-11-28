const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const SCRAMBLABLE = /[\p{L}\p{N}]/u

export type Random = () => number

/**
 * The text to show at `progress` (0 to 1) of a scramble: the letters from left to right settle on their real value,
 * with some jitter, the others show a random character. Spaces and punctuation never change
 * @example scrambleText('Hello', 0.5, [0.1, 0.2, 0.3, 0.4, 0.5])
 */
export function scrambleText(text: string, progress: number, jitter: number[], random: Random = Math.random): string {
  const characters = [...text]
  const total = Math.max(characters.length - 1, 1)

  return characters
    .map((character, index) => {
      if (!SCRAMBLABLE.test(character))
        return character

      const threshold = (index / total) * 0.7 + (jitter[index] ?? 0) * 0.3

      return progress >= threshold ? character : POOL[Math.floor(random() * POOL.length)]!
    })
    .join('')
}

/**
 * Plays a scramble with one `requestAnimationFrame` loop that stops at the end. Returns the function that cancels it
 */
export function runScramble(text: string, options: { duration: number, onFrame: (value: string) => void, onDone: () => void, random?: Random }): () => void {
  const random = options.random ?? Math.random
  const jitter = [...text].map(() => random())
  const step = 40
  let frame = 0
  let start: number | undefined
  let last = Number.NEGATIVE_INFINITY

  const tick = (time: number) => {
    start ??= time
    const progress = Math.min((time - start) / options.duration, 1)

    if (progress >= 1) {
      options.onDone()
      return
    }

    if (time - last >= step) {
      last = time
      options.onFrame(scrambleText(text, progress, jitter, random))
    }

    frame = requestAnimationFrame(tick)
  }

  options.onFrame(scrambleText(text, 0, jitter, random))
  frame = requestAnimationFrame(tick)

  return () => cancelAnimationFrame(frame)
}

/**
 * The delay in milliseconds before each character of a typed text: a human rhythm, a little random, longer after a
 * comma and a full stop
 */
export function typingDelays(text: string, random: Random = Math.random): number[] {
  return [...text].map((character, index, characters) => {
    const previous = characters[index - 1] ?? ''
    const base = character === ' ' ? 35 : 55
    const pause = /[.!?]/.test(previous) ? 320 : /[,;:]/.test(previous) ? 160 : 0

    return Math.round(base + random() * 70 + pause)
  })
}

/**
 * Types a text one character at a time (timeouts, no polling). Returns the function that cancels it
 */
export function runTypewriter(text: string, options: { onType: (value: string) => void, onDone: () => void, delay?: number, random?: Random }): () => void {
  const characters = [...text]
  const delays = typingDelays(text, options.random)
  let timer: ReturnType<typeof setTimeout>
  let index = 0

  const next = () => {
    if (index >= characters.length) {
      options.onDone()
      return
    }

    timer = setTimeout(() => {
      index++
      options.onType(characters.slice(0, index).join(''))
      next()
    }, delays[index])
  }

  options.onType('')
  timer = setTimeout(next, options.delay ?? 0)

  return () => clearTimeout(timer)
}

export interface TextSegment {
  text: string
  mark: boolean
}

/**
 * Splits a text around the words to highlight (case insensitive, the longest first)
 */
export function splitHighlights(text: string, words: string | string[] | undefined): TextSegment[] {
  const list = (Array.isArray(words) ? words : words ? [words] : [])
    .map(word => word.trim())
    .filter(Boolean)
    .toSorted((a, b) => b.length - a.length)

  if (list.length === 0)
    return [{ text, mark: false }]

  const escaped = list.map(word => word.replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi')
  const lower = new Set(list.map(word => word.toLowerCase()))

  return text
    .split(pattern)
    .filter(Boolean)
    .map(part => ({ text: part, mark: lower.has(part.toLowerCase()) }))
}
