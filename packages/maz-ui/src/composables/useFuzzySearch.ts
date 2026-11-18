import type { FuzzySearchOptions, FuzzySearchResult } from '@maz-ui/utils/helpers/fuzzySearch'
import type { MaybeRefOrGetter } from 'vue'
import { createFuzzySearch } from '@maz-ui/utils/helpers/fuzzySearch'
import { computed, onScopeDispose, ref, toValue, watch } from 'vue'

export interface UseFuzzySearchOptions<T> extends FuzzySearchOptions<T> {
  /** Delay in ms between the last change of the query and the search, for big lists */
  debounce?: number
}

/**
 * Reactive fuzzy search in a list: the list is indexed when it changes, and searched when the query changes. See
 * `fuzzySearch` of `@maz-ui/utils` for the matching (prefixes, words in any order, scattered letters, typos, accents).
 * @param list The items to search in
 * @param query The text typed by the user, an empty query returns every item
 * @param options The keys, the typo tolerance, the order, the limit and the debounce delay
 * @returns The `results` (item, score, matched characters), the matching `items` and `isPending` while the debounce runs
 * @example
 * ```ts
 * const query = ref('')
 * const { items, results } = useFuzzySearch(users, query, { keys: ['name', { key: 'email', weight: 0.5 }] })
 * ```
 */
export function useFuzzySearch<T>(
  list: MaybeRefOrGetter<readonly T[] | null | undefined>,
  query: MaybeRefOrGetter<string | null | undefined>,
  options: MaybeRefOrGetter<UseFuzzySearchOptions<T>> = {},
) {
  const searchedQuery = ref(toValue(query) ?? '')
  const isPending = ref(false)
  let timeout: ReturnType<typeof setTimeout> | undefined

  watch(() => toValue(query) ?? '', (value) => {
    clearTimeout(timeout)

    const delay = toValue(options).debounce

    if (!delay) {
      searchedQuery.value = value
      isPending.value = false
      return
    }

    isPending.value = true
    timeout = setTimeout(() => {
      searchedQuery.value = value
      isPending.value = false
    }, delay)
  })

  onScopeDispose(() => clearTimeout(timeout))

  const index = computed(() => createFuzzySearch(toValue(list) ?? [], toValue(options)))

  const results = computed<FuzzySearchResult<T>[]>(() => index.value.search(searchedQuery.value))

  const items = computed(() => results.value.map(result => result.item))

  return {
    results,
    items,
    isPending,
  }
}
