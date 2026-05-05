import type { colors } from './constantes'

export type MazColor = (typeof colors)[number]

export type MazSize = 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

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
