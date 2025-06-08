export const baseColors = {
  overlay: 'hsl(var(--maz-overlay) / <alpha-value>)',
  muted: 'hsl(var(--maz-muted) / <alpha-value>)',
  divider: 'hsl(var(--maz-border) / <alpha-value>)',
}

export const scaleColors = {
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  destructive: 'destructive',
  success: 'success',
  warning: 'warning',
  contrast: 'contrast',
  info: 'info',
  foreground: 'foreground',
  surface: 'background',
} as const

export const colorScales = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
] as const

export type ScaleColorName = keyof typeof scaleColors
export type ColorScale = typeof colorScales[number]
