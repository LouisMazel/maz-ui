import type { MaybeRefOrGetter } from 'vue'
import { normalizeString } from '@maz-ui/utils/helpers/normalizeString'
import { getMatchingScore, isStringMatching } from '@maz-ui/utils/helpers/stringMatching'
import { computed, toValue } from 'vue'

/**
 * Similarity of two whole strings, case and accents ignored: `score` from 0 to 1, and `isMatching` when it reaches the
 * threshold (clamped between 0 and 1). It compares whole strings (`maz` is far from `mazvan`): to search in a list, use
 * `useFuzzySearch`.
 * @param string1 The first string
 * @param string2 The second string
 * @param threshold The minimal similarity, between 0 and 1
 * @returns The reactive `score` and `isMatching`
 */
export function useStringMatching(
  string1: MaybeRefOrGetter<string>,
  string2: MaybeRefOrGetter<string>,
  threshold: MaybeRefOrGetter<number> = 0.75,
) {
  const _string1 = computed(() =>
    normalizeString(toValue(string1)),
  )
  const _string2 = computed(() =>
    normalizeString(toValue(string2)),
  )

  const score = computed(() => getMatchingScore(_string1.value, _string2.value))

  const isMatching = computed(() =>
    isStringMatching(_string1.value, _string2.value, toValue(threshold)),
  )

  return {
    isMatching,
    score,
  }
}
