import type { colors } from './constantes'

export type MazModelValue = string | number | null | undefined | boolean

export type MazColor = (typeof colors)[number]

export type MazSize = 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type MazPosition =
  | 'top'
  | 'top right'
  | 'top left'
  | 'bottom'
  | 'bottom right'
  | 'bottom left'
  | 'left'
  | 'right'
