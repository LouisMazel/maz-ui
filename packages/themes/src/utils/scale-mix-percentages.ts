/**
 * Mix percentages used to derive the 50-950 palette from a base color via `color-mix(in oklch, ...)`.
 *
 * Below 500 we mix with white (tints). Above 500 we mix with black (shades). The 500 step is the
 * base color itself (`var(--maz-X)`) — emitted directly without `color-mix` for clarity and
 * to keep the runtime reactive to base-color overrides.
 *
 * Values aligned with Tailwind v4's default palette steps. Adjust here if visual validation
 * (apps/vue-app) reveals a per-step mismatch with the previous JS-derived scales.
 */
export const SCALE_MIX_PERCENTAGES = {
  50: { mixWith: 'white', percent: 95 },
  100: { mixWith: 'white', percent: 85 },
  200: { mixWith: 'white', percent: 70 },
  300: { mixWith: 'white', percent: 50 },
  400: { mixWith: 'white', percent: 25 },
  500: { mixWith: null },
  600: { mixWith: 'black', percent: 15 },
  700: { mixWith: 'black', percent: 30 },
  800: { mixWith: 'black', percent: 45 },
  900: { mixWith: 'black', percent: 60 },
  950: { mixWith: 'black', percent: 75 },
} as const satisfies Record<number, { mixWith: 'white' | 'black' | null, percent?: number }>

export type ScaleStep = keyof typeof SCALE_MIX_PERCENTAGES

/**
 * Color names that receive a 50-950 scale. Each name must match a key in `ThemeColors`.
 * Foreground variants (`primary-foreground`, etc.) are intentionally NOT scaled — they're
 * meant to be used as-is for text on the matched base color.
 */
export const SCALED_COLOR_NAMES = [
  'primary',
  'secondary',
  'accent',
  'destructive',
  'success',
  'warning',
  'info',
  'contrast',
  'surface',
  'foreground',
  'divider',
  'muted',
  'overlay',
  'shadow',
] as const

export type ScaledColorName = (typeof SCALED_COLOR_NAMES)[number]
