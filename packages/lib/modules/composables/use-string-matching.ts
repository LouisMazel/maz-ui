import { computed, type Ref } from 'vue'

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

function normalizeString(str: string): string {
  const normalized = str.normalize('NFD').replaceAll(/[\u0300-\u036F]/g, '')

  return normalized.toLowerCase()
}

function getMatchingScore(string1: string, string2: string): number {
  const distance = levenshteinDistance(string1, string2)

  const maxLength = Math.max(string1.length, string2.length)
  return 1 - distance / maxLength
}

function getMatchingResults(string1: string, string2: string, threshold = 0.75): boolean {
  const score = getMatchingScore(string1, string2)

  return score >= threshold
}

export function useStringMatching(
  string1: string | Ref<string>,
  string2: string | Ref<string>,
  threshold: number | Ref<number> = 0.75,
) {
  const _string1 = computed(() =>
    normalizeString(typeof string1 === 'string' ? string1 : string1.value),
  )
  const _string2 = computed(() =>
    normalizeString(typeof string2 === 'string' ? string2 : string2.value),
  )
  const _threshold = computed(() => (typeof threshold === 'number' ? threshold : threshold.value))

  const score = computed(() => getMatchingScore(_string1.value, _string2.value))

  const isMatching = computed(() =>
    getMatchingResults(_string1.value, _string2.value, _threshold.value),
  )

  return {
    isMatching,
    score,
  }
}
