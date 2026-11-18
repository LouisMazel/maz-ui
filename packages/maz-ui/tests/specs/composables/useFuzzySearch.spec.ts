import { useFuzzySearch } from '@composables/useFuzzySearch'
import { effectScope, nextTick, ref } from 'vue'

const fruits = [
  { name: 'Banana', color: 'yellow' },
  { name: 'Apple', color: 'red' },
  { name: 'Cherry', color: 'red' },
]

describe('given useFuzzySearch', () => {
  describe('when the query is empty', () => {
    it('then every item is returned', () => {
      const { items } = useFuzzySearch(fruits, '', {
        keys: ['name'],
      })

      expect(items.value).toEqual(fruits)
    })
  })

  describe('when the list and the query are missing', () => {
    it('then there is no result', () => {
      const { items } = useFuzzySearch<string>(undefined, undefined)

      expect(items.value).toEqual([])
    })
  })

  describe('when the query changes', () => {
    it('then the results follow it', async () => {
      const query = ref('ban')
      const { items, results } = useFuzzySearch(fruits, query, {
        keys: ['name'],
      })

      expect(items.value.map(fruit => fruit.name)).toEqual(['Banana'])
      expect(results.value[0]?.matches[0]?.indexes).toEqual([0, 1, 2])

      query.value = 'red'
      await nextTick()

      expect(items.value.map(fruit => fruit.name)).toEqual([])
    })
  })

  describe('when the list changes', () => {
    it('then it is indexed again', () => {
      const list = ref([...fruits])
      const { items } = useFuzzySearch(list, 'kiwi', {
        keys: ['name'],
      })

      list.value = [
        ...fruits,
        { name: 'Kiwi', color: 'green' },
      ]

      expect(items.value.map(fruit => fruit.name)).toEqual(['Kiwi'])
    })
  })

  describe('when a debounce delay is set', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('then the search waits for the delay', async () => {
      const query = ref('')
      const { items, isPending } = useFuzzySearch(fruits, query, {
        keys: ['name', 'color'],
        debounce: 200,
      })

      query.value = 'red'
      await nextTick()

      expect(isPending.value).toBe(true)
      expect(items.value).toHaveLength(3)

      vi.advanceTimersByTime(200)

      expect(isPending.value).toBe(false)
      expect(items.value.map(fruit => fruit.name)).toEqual(['Apple', 'Cherry'])
    })
  })

  describe('when the debounce delay is removed', () => {
    it('then the search runs at once', async () => {
      const query = ref('')
      const options = ref({
        keys: ['name' as const],
        debounce: 200,
      })
      const { items, isPending } = useFuzzySearch(fruits, query, options)

      options.value = {
        keys: ['name'],
        debounce: 0,
      }
      query.value = 'cher'
      await nextTick()

      expect(isPending.value).toBe(false)
      expect(items.value.map(fruit => fruit.name)).toEqual(['Cherry'])
    })
  })

  describe('when the scope is disposed during a debounce', () => {
    it('then the pending search is cancelled', async () => {
      vi.useFakeTimers()
      const scope = effectScope()
      const query = ref('')
      const search = scope.run(() => useFuzzySearch(fruits, query, {
        keys: ['name'],
        debounce: 200,
      }))!

      query.value = 'cher'
      await nextTick()
      scope.stop()
      vi.advanceTimersByTime(200)

      expect(search.isPending.value).toBe(true)
      vi.useRealTimers()
    })
  })
})
