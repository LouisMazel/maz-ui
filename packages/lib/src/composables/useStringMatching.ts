import type { MaybeRefOrGetter } from 'vue'
import { normalizeString } from '@maz-ui/utils/helpers/normalizeString'
import { computed, toValue } from 'vue'

function levenshteinDistance(string1: string, string2: string): number {
  const length1 = string1.length
  const length2 = string2.length

  const matrix: number[][] = []

  for (let index = 0; index <= length1; index++) {
    matrix[index] = [index]
  }
  for (let index = 0; index <= length2; index++) {
    matrix[0][index] = index
  }

  // Calcul de la distance de Levenshtein
  for (let index = 1; index <= length1; index++) {
    for (let index_ = 1; index_ <= length2; index_++) {
      const cost = string1[index - 1] === string2[index_ - 1] ? 0 : 1
      matrix[index][index_] = Math.min(
        matrix[index - 1][index_] + 1,
        matrix[index][index_ - 1] + 1,
        matrix[index - 1][index_ - 1] + cost,
      )
    }
  }

  return matrix[length1][length2]
}

function getMatchingScore(string1: string, string2: string): number {
  const distance = levenshteinDistance(string1, string2)

  const maxLength = Math.max(string1.length, string2.length)

  // Handle case where both strings are empty
  if (maxLength === 0) {
    return 1 // Perfect match for two empty strings
  }

  return 1 - distance / maxLength
}

function getMatchingResults(string1: string, string2: string, threshold = 0.75): boolean {
  const score = getMatchingScore(string1, string2)

  return score >= threshold
}

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
    getMatchingResults(_string1.value, _string2.value, toValue(threshold)),
  )

  return {
    isMatching,
    score,
  }
}
