const ASCII_DIGIT_REGEX = /\d/
const ARABIC_DIGIT_REGEX = /[\u0660-\u0669\u06F0-\u06F9]/
const ARABIC_INDIC_ZERO = 0x0660
const EXTENDED_ARABIC_INDIC_ZERO = 0x06F0
const ARABIC_INDIC_LAST = 0x0669

export interface CaretValue {
  value: string
  caret: number
}

export type DeletionDirection = 'backward' | 'forward'

function isDigit(character: string) {
  return ASCII_DIGIT_REGEX.test(character) || ARABIC_DIGIT_REGEX.test(character)
}

function toAsciiDigit(character: string) {
  const codePoint = character.codePointAt(0) ?? ARABIC_INDIC_ZERO

  if (codePoint < ARABIC_INDIC_ZERO) {
    return character
  }

  return String(codePoint - (codePoint <= ARABIC_INDIC_LAST ? ARABIC_INDIC_ZERO : EXTENDED_ARABIC_INDIC_ZERO))
}

function getSignificantFlags(value: string) {
  let hasDigitBefore = false
  let hasPlusBefore = false

  return Array.from(value, (character) => {
    if (isDigit(character)) {
      hasDigitBefore = true
      return true
    }

    if (character === '+' && !hasDigitBefore && !hasPlusBefore) {
      hasPlusBefore = true
      return true
    }

    return false
  })
}

/**
 * Keep only the significant characters of a phone number: the digits (as ASCII) and a leading "+"
 */
export function extractSignificant(value: string) {
  const flags = getSignificantFlags(value)

  return Array.from(value).filter((_, index) => flags[index]).map(character => toAsciiDigit(character)).join('')
}

/**
 * Count the significant characters (digits and a leading "+") before the position
 */
export function countSignificantBefore(value: string, position: number) {
  return getSignificantFlags(value.slice(0, Math.max(0, position))).filter(Boolean).length
}

/**
 * Position right after the n-th significant character, 0 when n is 0, the end of the value when there are fewer
 */
export function getPositionAfterSignificant(value: string, count: number) {
  if (count <= 0) {
    return 0
  }

  const flags = getSignificantFlags(value)
  let seen = 0

  for (const [index, isSignificant] of flags.entries()) {
    if (isSignificant) {
      seen++
      if (seen === count) {
        return index + 1
      }
    }
  }

  return value.length
}

/**
 * Position of the caret in a rewritten value (the formatting changed), so that it stays after the same significant characters.
 * Returns undefined when the significant characters changed: there is nothing to keep.
 */
export function getCaretInRewrittenValue({
  previousValue,
  previousCaret,
  value,
}: {
  previousValue: string
  previousCaret: number
  value: string
}) {
  if (extractSignificant(previousValue) !== extractSignificant(value)) {
    return undefined
  }

  return getPositionAfterSignificant(value, countSignificantBefore(previousValue, previousCaret))
}

/**
 * Format the significant characters of the value and move the caret after the same number of significant characters
 */
export function formatWithCaret(
  value: string,
  caret: number,
  format: (significant: string) => string | undefined | null,
): CaretValue {
  const significantCount = countSignificantBefore(value, caret)
  const significant = extractSignificant(value)
  const formatted = format(significant) ?? significant

  return {
    value: formatted,
    caret: getPositionAfterSignificant(formatted, significantCount),
  }
}

/**
 * Compute the value after a Backspace or Delete that must not be left to the browser:
 * a selection is removed, a punctuation next to the caret removes the nearest significant character with it.
 * Returns undefined when the native behavior is fine.
 */
export function computeDeletion({
  value,
  selectionStart,
  selectionEnd,
  direction,
}: {
  value: string
  selectionStart: number
  selectionEnd: number
  direction: DeletionDirection
}): CaretValue | undefined {
  if (selectionStart !== selectionEnd) {
    return {
      value: value.slice(0, selectionStart) + value.slice(selectionEnd),
      caret: selectionStart,
    }
  }

  const flags = getSignificantFlags(value)

  if (direction === 'backward') {
    if (selectionStart === 0 || flags[selectionStart - 1]) {
      return undefined
    }

    let index = selectionStart - 1
    while (index >= 0 && !flags[index]) {
      index--
    }

    if (index < 0) {
      return undefined
    }

    return {
      value: value.slice(0, index) + value.slice(selectionStart),
      caret: index,
    }
  }

  if (selectionStart >= value.length || flags[selectionStart]) {
    return undefined
  }

  let index = selectionStart
  while (index < value.length && !flags[index]) {
    index++
  }

  if (index >= value.length) {
    return undefined
  }

  return {
    value: value.slice(0, selectionStart) + value.slice(index + 1),
    caret: selectionStart,
  }
}
