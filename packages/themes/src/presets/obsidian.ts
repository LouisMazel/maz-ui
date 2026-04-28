import type { ThemePreset } from '../types'
import {
  DEFAULT_BTN_FONT_WEIGHT,
  DEFAULT_CONTAINER_BG,
  DEFAULT_DISABLED_CURSOR,
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_FONT_MONO,
  DEFAULT_INPUT_BG,
  DEFAULT_SHADOW,
  DEFAULT_SPACING,
} from './_defaults'

/**
 * Obsidian preset — dark luxe / cinematic.
 *
 * Identity:
 * - `primary` is a deep indigo-violet (the obsidian stone) — confident
 *   and rich, not just dark.
 * - `accent` is a warm gold — luxe contrast, plays well on both modes.
 * - `secondary` is a vivid fuchsia / magenta — third voice with serious
 *   pop, used for highlights, badges, secondary CTAs.
 * - Tighter, premium radii (md = 0.5rem) and a snappy expo easing
 *   give the theme a clean, technical edge.
 *
 * Distinct from `pristine` (sober monochrome + system blue + system
 * purple) and `ocean` (teal + navy + sand).
 */
const FONT_FAMILY = `'Inter', system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen, ubuntu, cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`

export const obsidian: ThemePreset = {
  name: 'obsidian',
  foundation: {
    'base-font-size': '14px',
    'border-width': '1px',
    'font-family': FONT_FAMILY,
    'font-mono': DEFAULT_FONT_MONO,
    'font-display': FONT_FAMILY,
    'duration-fast': '80ms',
    'duration-normal': '160ms',
    'duration-slow': '240ms',
    'easing-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
    'easing-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
    'easing-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
    'disabled-opacity': DEFAULT_DISABLED_OPACITY,
    'disabled-cursor': DEFAULT_DISABLED_CURSOR,
  },
  scales: {
    spacing: DEFAULT_SPACING,
    radius: {
      'xs': '0.125rem',
      'sm': '0.25rem',
      'md': '0.5rem',
      'lg': '0.75rem',
      'xl': '1rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
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
      'surface': 'oklch(0.985 0.005 280)',
      'foreground': 'oklch(0.245 0.012 280)',
      'primary': 'oklch(0.55 0.205 275)',
      'primary-foreground': 'oklch(1 0 0)',
      'secondary': 'oklch(0.6 0.235 0)',
      'secondary-foreground': 'oklch(1 0 0)',
      'accent': 'oklch(0.77 0.155 78)',
      'accent-foreground': 'oklch(0.245 0.012 280)',
      'success': 'oklch(0.66 0.14 162)',
      'success-foreground': 'oklch(1 0 0)',
      'warning': 'oklch(0.795 0.165 76)',
      'warning-foreground': 'oklch(0.245 0.012 280)',
      'destructive': 'oklch(0.605 0.215 22)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.72 0.13 230)',
      'info-foreground': 'oklch(1 0 0)',
      'contrast': 'oklch(0.245 0.012 280)',
      'contrast-foreground': 'oklch(1 0 0)',
      'muted': 'oklch(0.585 0.022 280)',
      'divider': 'oklch(0.918 0.01 280)',
      'overlay': 'oklch(0.245 0.012 280)',
      'shadow': 'oklch(0.27 0.018 280)',
    },
    dark: {
      'surface': 'oklch(0.2 0.012 280)',
      'foreground': 'oklch(0.965 0.003 280)',
      'primary': 'oklch(0.69 0.175 275)',
      'primary-foreground': 'oklch(0.2 0.012 280)',
      'secondary': 'oklch(0.7 0.21 0)',
      'secondary-foreground': 'oklch(1 0 0)',
      'accent': 'oklch(0.815 0.155 78)',
      'accent-foreground': 'oklch(0.2 0.012 280)',
      'success': 'oklch(0.755 0.15 162)',
      'success-foreground': 'oklch(0.2 0.012 280)',
      'warning': 'oklch(0.815 0.165 76)',
      'warning-foreground': 'oklch(0.2 0.012 280)',
      'destructive': 'oklch(0.64 0.18 22)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.745 0.14 230)',
      'info-foreground': 'oklch(0.2 0.012 280)',
      'contrast': 'oklch(1 0 0)',
      'contrast-foreground': 'oklch(0.2 0.012 280)',
      'muted': 'oklch(0.665 0.018 280)',
      'divider': 'oklch(0.31 0.02 280)',
      'overlay': 'oklch(0.2 0.012 280)',
      'shadow': 'oklch(0.14 0.005 280)',
    },
  },
}
