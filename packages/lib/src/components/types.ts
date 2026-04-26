import type { colors } from './constantes'

export type MazColor = (typeof colors)[number]

export type MazSize = 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Convert a color to a class name.
 * @param color The color to convert.
 * @returns The class name.
 */
export function getColor(color: MazColor | 'background' | 'muted' | 'inherit') {
  return color === 'background' ? 'surface' : color
}
