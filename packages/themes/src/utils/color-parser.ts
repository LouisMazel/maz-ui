const COMPLETE_COLOR_PATTERN = /^(?:hsla?|rgba?|hwb|oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i
const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const CSS_VAR_PATTERN = /^var\(\s*--[\w-]+/i
/** Named, system (`Canvas`, `AccentColor`) and vendor (`-apple-system-control-accent`) color keywords. */
const COLOR_KEYWORD_PATTERN = /^-?[a-z][a-z\d-]*$/i
// eslint-disable-next-line sonarjs/regex-complexity -- Legacy `H S% L%` form needs the three-capture alternation to extract decimal channels.
const LEGACY_PATTERN = /^(-?\d+\.\d+|-?\d+)\s+(\d+\.\d+|\d+)%\s+(\d+\.\d+|\d+)%$/

/** Whether the value is a color keyword: `transparent`, `currentColor`, `AccentColor`, `-apple-system-label`… */
export function isColorKeyword(value: string): boolean {
  return COLOR_KEYWORD_PATTERN.test(value.trim())
}

export function isCompleteCSSColor(value: string): boolean {
  const trimmed = value.trim()
  return (
    COMPLETE_COLOR_PATTERN.test(trimmed)
    || HEX_COLOR_PATTERN.test(trimmed)
    || CSS_VAR_PATTERN.test(trimmed)
    || isColorKeyword(trimmed)
  )
}

/**
 * Normalize an authored color value. Already-complete CSS colors (functions,
 * hex, `var()` and color keywords) pass through unchanged; the legacy raw
 * `"H S% L%"` form gets wrapped in `hsl(...)`.
 */
export function normalizeColor(value: string): string {
  if (isCompleteCSSColor(value)) {
    return value
  }
  const legacy = value.trim().match(LEGACY_PATTERN)
  if (legacy) {
    return `hsl(${legacy[1]} ${legacy[2]}% ${legacy[3]}%)`
  }
  throw new Error(`Invalid color format: ${value}`)
}
