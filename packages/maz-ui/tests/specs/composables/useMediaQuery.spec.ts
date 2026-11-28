import { useMediaQuery } from '@composables/useMediaQuery.ts'
import { useReducedMotion } from '@composables/useReducedMotion.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { nextTick, ref } from 'vue'

function createMatchMedia(initial: Record<string, boolean>) {
  const lists: Record<string, { matches: boolean, listeners: Set<() => void> }> = {}
  const matchMedia = vi.fn((query: string) => {
    lists[query] ??= { matches: initial[query] ?? false, listeners: new Set() }
    const entry = lists[query]

    return {
      get matches() {
        return entry.matches
      },
      addEventListener: (_: string, listener: () => void) => entry.listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => entry.listeners.delete(listener),
    }
  })

  function set(query: string, matches: boolean) {
    lists[query].matches = matches
    for (const listener of lists[query].listeners) listener()
  }

  return { matchMedia, set, lists }
}

describe('given the useMediaQuery composable', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('when it is used inside a component', () => {
    it('then matches equals initialValue until the component is mounted', () => {
      vi.stubGlobal('matchMedia', createMatchMedia({ '(min-width: 768px)': true }).matchMedia)
      let valueDuringSetup: boolean | undefined
      const [{ matches }, app] = withSetup(() => {
        const result = useMediaQuery('(min-width: 768px)', { initialValue: false })
        valueDuringSetup = result.matches.value
        return result
      })

      expect(valueDuringSetup).toBe(false)
      expect(matches.value).toBe(true)
      app.unmount()
    })
  })

  describe('when matchMedia is available', () => {
    it('then matches reflects the query and updates on change', () => {
      const media = createMatchMedia({ '(min-width: 768px)': true })
      vi.stubGlobal('matchMedia', media.matchMedia)
      const [{ matches, isSupported }, app] = withSetup(() => useMediaQuery('(min-width: 768px)'))

      expect(isSupported).toBe(true)
      expect(matches.value).toBe(true)

      media.set('(min-width: 768px)', false)
      expect(matches.value).toBe(false)

      app.unmount()
      expect(media.lists['(min-width: 768px)'].listeners.size).toBe(0)
    })
  })

  describe('when the query is a ref', () => {
    it('then it re-evaluates when the query changes', async () => {
      const media = createMatchMedia({ '(max-width: 600px)': true })
      vi.stubGlobal('matchMedia', media.matchMedia)
      const query = ref('(min-width: 1000px)')
      const [{ matches }, app] = withSetup(() => useMediaQuery(query))

      expect(matches.value).toBe(false)

      query.value = '(max-width: 600px)'
      await nextTick()

      expect(matches.value).toBe(true)
      app.unmount()
    })
  })

  describe('when matchMedia is not available', () => {
    it('then matches is the initial value and isSupported is false', () => {
      vi.stubGlobal('matchMedia', undefined)
      const [{ matches, isSupported }, app] = withSetup(() => useMediaQuery('(min-width: 768px)', { initialValue: true }))

      expect(isSupported).toBe(false)
      expect(matches.value).toBe(true)
      app.unmount()
    })
  })
})

describe('given the useReducedMotion composable', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('when the user prefers reduced motion', () => {
    it('then prefersReducedMotion is true and follows the preference', () => {
      const media = createMatchMedia({ '(prefers-reduced-motion: reduce)': true })
      vi.stubGlobal('matchMedia', media.matchMedia)
      const [{ prefersReducedMotion }, app] = withSetup(() => useReducedMotion())

      expect(prefersReducedMotion.value).toBe(true)

      media.set('(prefers-reduced-motion: reduce)', false)
      expect(prefersReducedMotion.value).toBe(false)
      app.unmount()
    })
  })
})
