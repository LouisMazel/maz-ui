import type { colors, neutralColors, sizes } from './constants'

export type MazColor = (typeof colors)[number]

/** `surface` (background of the page) or `container` (background of the cards, panels and fields), with `text-foreground` */
export type MazNeutralColor = (typeof neutralColors)[number]

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
export function getColor(color: MazColor | MazNeutralColor | 'muted' | 'inherit') {
  return color
}

/**
 * The names of the icons and SVG of `MazIcon` and `MazSvg`: the types `MazUi()` (`@maz-ui/vite-plugin`, included
 * in `@maz-ui/nuxt`) generates add the icons of maz-ui and of the project to it, by augmentation of `maz-ui`.
 * A component with an icon prop is generic (`generic="_T"`): passed as a `Component` (`h()`, a route), the
 * `LooseRequired<props>` of a `DefineComponent` intersects the 870+ names with themselves, over the limit of
 * TypeScript (TS2590).
 */
export interface MazIconNames {}

export type MazIconName = keyof MazIconNames

/** Augmented with `{ strict: true }`: `icon` only accepts the known names, URLs and raw SVG, a typo is an error */
export interface MazIconOptions {}

export type MazIconSource = `/${string}` | `http://${string}` | `https://${string}` | `data:${string}` | `blob:${string}` | `<svg${string}`

/**
 * A string `icon`: a name (`'x-mark'`, `'app:logo'`), a URL or a raw SVG. `string &` gives `String` to the compiler of
 * Vue, that does not read the conditional type, for the runtime check of the prop
 */
export type MazIconString = MazIconName | (string & (MazIconOptions extends { strict: true } ? MazIconSource : Record<never, never>))
