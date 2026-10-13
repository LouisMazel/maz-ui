import type { colors, sizes } from './constants'

export type MazColor = (typeof colors)[number]

export type MazSize = (typeof sizes)[number]

export type MazRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Source of the country flags of `MazSelectCountry` and `MazInputPhoneNumber`:
 * - a URL template with the code: `{code}` (lowercase) or `{CODE}` (uppercase), e.g. `/flags/{code}.svg`
 * - a function giving the image source (URL or data URL) of a code, or `undefined` to display the code in a badge
 */
export type MazCountryFlagSrc = string | ((code: string) => string | undefined | Promise<string | undefined>)

export type MazSizeUnit = `${number}${'rem' | 'px' | 'em' | 'vw' | 'vh' | 'vmin' | 'vmax' | '%' | 'ch' | 'cm' | 'mm' | 'in' | 'ex' | 'pc' | 'pt'}`

/**
 * Convert a color to a class name. Identity for every value the consumer
 * can pass — kept as a hook for components that historically aliased a
 * value to another (e.g. `'background'` → `'surface'` in v4).
 *
 * @param color The color to convert.
 * @returns The class name.
 */
export function getColor(color: MazColor | 'surface' | 'muted' | 'inherit') {
  return color
}
