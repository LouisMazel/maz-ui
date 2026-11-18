/**
 * Levenshtein distance between two strings: the minimal number of insertions, deletions and substitutions to turn one
 * into the other. Two rolling rows keep the memory to the length of the shortest string.
 * @param string1 The first string
 * @param string2 The second string
 * @returns The edit distance
 */
export function levenshteinDistance(string1: string, string2: string): number {
  const [long, short] = string1.length >= string2.length
    ? [string1, string2]
    : [string2, string1]

  let previous = Array.from({ length: short.length + 1 }, (_, index) => index)
  let current = Array.from<number>({ length: short.length + 1 })

  for (let longIndex = 1; longIndex <= long.length; longIndex++) {
    current[0] = longIndex

    for (let shortIndex = 1; shortIndex <= short.length; shortIndex++) {
      const cost = long[longIndex - 1] === short[shortIndex - 1]
        ? 0
        : 1

      current[shortIndex] = Math.min(
        previous[shortIndex]! + 1,
        current[shortIndex - 1]! + 1,
        previous[shortIndex - 1]! + cost,
      )
    }

    [previous, current] = [current, previous]
  }

  return previous[short.length]!
}

/**
 * Similarity of two whole strings, from 0 (nothing in common) to 1 (identical): `1 - distance / longest length`.
 * Two empty strings are identical. It compares the strings as they are: normalize them first to ignore the case or the
 * accents (`normalizeString`).
 * @param string1 The first string
 * @param string2 The second string
 * @returns The similarity, between 0 and 1
 */
export function getMatchingScore(string1: string, string2: string): number {
  const maxLength = Math.max(string1.length, string2.length)

  if (maxLength === 0) {
    return 1
  }

  return 1 - levenshteinDistance(string1, string2) / maxLength
}

/**
 * `true` when the similarity of two whole strings (`getMatchingScore`) reaches the threshold. The threshold is clamped
 * between 0 (everything matches) and 1 (identical strings only). The lengths are compared first: when they are too far
 * apart to reach the threshold, the distance is not computed.
 * @param string1 The first string
 * @param string2 The second string
 * @param threshold The minimal similarity, between 0 and 1
 * @returns Whether the strings match
 */
export function isStringMatching(string1: string, string2: string, threshold = 0.75): boolean {
  const minScore = Math.min(Math.max(threshold, 0), 1)
  const maxLength = Math.max(string1.length, string2.length)

  if (maxLength > 0 && Math.abs(string1.length - string2.length) / maxLength > 1 - minScore) {
    return false
  }

  return getMatchingScore(string1, string2) >= minScore
}
