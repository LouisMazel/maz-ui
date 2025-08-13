import type { colors } from './constantes'

export type MazColor = (typeof colors)[number]

export type MazSize = 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function getColor(color: MazColor | 'background' | 'muted') {
  return color === 'background' ? 'surface' : color
}
