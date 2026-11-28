export const colors = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'destructive',
  'contrast',
  'neutral',
  'transparent',
] as const

/** The neutral colors of the theme: `surface` (background of the page) and `container` (background of the cards, panels and fields) */
export const neutralColors = ['surface', 'container'] as const

export const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const

export const SIZE_TEXT_CLASS = {
  xl: 'maz:text-xl',
  lg: 'maz:text-lg',
  md: 'maz:text-base',
  sm: 'maz:text-sm',
  xs: 'maz:text-xs',
  mini: 'maz:text-xs',
} as const

/**
 * The radius classes of the `roundedSize` props: one scale for every component (a component keeps a
 * different value only where it always had one)
 */
export const ROUNDED_SIZE_CLASS = {
  'none': '',
  'sm': 'maz:rounded-xs',
  'md': 'maz:rounded-md',
  'lg': 'maz:rounded-lg',
  'xl': 'maz:rounded-xl',
  '2xl': 'maz:rounded-2xl',
  '3xl': 'maz:rounded-3xl',
  'full': 'maz:rounded-full',
} as const
