const COMPLETE_COLOR_PATTERN = /^(?:hsla?|rgba?|oklch|oklab|lab|lch|color)\s*\(/i
const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const CSS_VAR_PATTERN = /^var\(\s*--[\w-]+/i
// eslint-disable-next-line sonarjs/regex-complexity -- Legacy `H S% L%` form needs the three-capture alternation to extract decimal channels.
const LEGACY_PATTERN = /^(-?\d+\.\d+|-?\d+)\s+(\d+\.\d+|\d+)%\s+(\d+\.\d+|\d+)%$/

export function isCompleteCSSColor(value: string): boolean {
  const trimmed = value.trim()
  return (
    COMPLETE_COLOR_PATTERN.test(trimmed)
    || HEX_COLOR_PATTERN.test(trimmed)
    || CSS_VAR_PATTERN.test(trimmed)
  )
}

/**
 * Normalize an authored color value. Already-complete CSS colors pass through
 * unchanged; the legacy raw `"H S% L%"` form gets wrapped in `hsl(...)`.
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
