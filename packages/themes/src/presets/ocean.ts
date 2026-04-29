import type { ThemePreset } from '../types'
import {
  DEFAULT_BTN_FONT_WEIGHT,
  DEFAULT_CONTAINER_BG,
  DEFAULT_DISABLED_CURSOR,
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_FONT_MONO,
  DEFAULT_INPUT_BG,
  DEFAULT_SHADOW,
  DEFAULT_SPACE,
} from './_defaults'

/**
 * Ocean preset — calm, fluid, water-inspired.
 *
 * Identity:
 * - `primary` is a teal-blue (the wave) — confident but cool.
 * - `secondary` drops to a deep navy (the ocean floor) so it reads as a
 *   contrasting second voice, not a pale washed sibling of primary.
 * - `accent` is a warm sandy ochre — the sunset on the water, a true
 *   complementary to the blues.
 * - Larger radii (md = 1rem) and a heavier border (0.125rem) feel
 *   buoyant; soft Apple-style spring easing keeps motion fluid.
 *
 * Distinct from `pristine` (sober monochrome + system blue accent +
 * system purple secondary) and `obsidian` (dark luxe indigo + gold +
 * fuchsia).
 */
const FONT_FAMILY = `'Poppins', 'Inter', system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen, ubuntu, cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`

export const ocean: ThemePreset = {
  name: 'ocean',
  foundation: {
    'base-font-size': '16px',
    'border-width': '0.125rem',
    'font-family': FONT_FAMILY,
    'font-mono-stack': DEFAULT_FONT_MONO,
    'font-display-stack': FONT_FAMILY,
    'motion-fast': '120ms',
    'motion-normal': '240ms',
    'motion-slow': '360ms',
    'easing-out': 'cubic-bezier(0.32, 0.72, 0, 1)',
    'easing-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
    'easing-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
    'disabled-opacity': DEFAULT_DISABLED_OPACITY,
    'disabled-cursor': DEFAULT_DISABLED_CURSOR,
    'space': DEFAULT_SPACE,
  },
  scales: {
    rounded: {
      'xs': '0.25rem',
      'sm': '0.5rem',
      'md': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    shadow: DEFAULT_SHADOW,
  },
  components: {
    btn: { 'font-weight': DEFAULT_BTN_FONT_WEIGHT },
    container: { bg: DEFAULT_CONTAINER_BG },
    input: { bg: DEFAULT_INPUT_BG },
  },
  colors: {
    light: {
      'surface': 'oklch(0.985 0.005 215)',
      'foreground': 'oklch(0.22 0.025 235)',
      'primary': 'oklch(0.58 0.13 220)',
      'primary-foreground': 'oklch(1 0 0)',
      'secondary': 'oklch(0.42 0.13 252)',
      'secondary-foreground': 'oklch(1 0 0)',
      'accent': 'oklch(0.76 0.13 50)',
      'accent-foreground': 'oklch(0.22 0.025 235)',
      'success': 'oklch(0.625 0.13 170)',
      'success-foreground': 'oklch(1 0 0)',
      'warning': 'oklch(0.745 0.135 75)',
      'warning-foreground': 'oklch(0.22 0.025 235)',
      'destructive': 'oklch(0.58 0.2 25)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.72 0.11 215)',
      'info-foreground': 'oklch(1 0 0)',
      'contrast': 'oklch(0.22 0.025 235)',
      'contrast-foreground': 'oklch(0.985 0.005 215)',
      'muted': 'oklch(0.62 0.03 225)',
      'divider': 'oklch(0.89 0.02 200)',
      'overlay': 'oklch(0.22 0.025 235)',
      'shadow': 'oklch(0.35 0.04 225)',
    },
    dark: {
      'surface': 'oklch(0.2 0.02 240)',
      'foreground': 'oklch(0.945 0.01 200)',
      'primary': 'oklch(0.73 0.12 198)',
      'primary-foreground': 'oklch(0.2 0.02 240)',
      'secondary': 'oklch(0.6 0.16 252)',
      'secondary-foreground': 'oklch(1 0 0)',
      'accent': 'oklch(0.78 0.12 55)',
      'accent-foreground': 'oklch(0.2 0.02 240)',
      'success': 'oklch(0.64 0.115 170)',
      'success-foreground': 'oklch(1 0 0)',
      'warning': 'oklch(0.75 0.13 75)',
      'warning-foreground': 'oklch(0.2 0.02 240)',
      'destructive': 'oklch(0.65 0.18 25)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.74 0.11 215)',
      'info-foreground': 'oklch(1 0 0)',
      'contrast': 'oklch(0.945 0.01 200)',
      'contrast-foreground': 'oklch(0.2 0.02 240)',
      'muted': 'oklch(0.68 0.02 230)',
      'divider': 'oklch(0.355 0.025 232)',
      'overlay': 'oklch(0.2 0.02 240)',
      'shadow': 'oklch(0.15 0.005 220)',
    },
  },
}
