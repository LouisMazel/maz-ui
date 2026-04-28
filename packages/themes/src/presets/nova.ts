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
 * Nova preset — modern startup / AI / creative.
 *
 * Identity:
 * - `primary` is an electric violet (Linear / Vercel / OpenAI energy).
 * - `accent` is a cyan-leaning electric blue — gradient-ready partner
 *   for the violet primary.
 * - `secondary` is a hot coral-pink, the third creative voice that
 *   pops on chips, badges and secondary CTAs.
 * - `surface` carries a subtle warm tint in light mode and a deep
 *   violet-tinted "AI dark" in dark mode.
 * - Modern font stack (Geist / Inter), tight 0.5rem `md` radius, snappy
 *   ease-out spring.
 *
 * Distinct from `pristine` (sober monochrome + system blue + system
 * purple), `ocean` (teal + sand + navy), `obsidian` (deep indigo +
 * gold + fuchsia).
 */
const FONT_FAMILY = `'Geist', 'Inter', system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen, ubuntu, cantarell, 'Helvetica Neue', sans-serif`
const FONT_DISPLAY = `'Geist', 'Inter', system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', sans-serif`
const FONT_MONO = `'Geist Mono', 'JetBrains Mono', ${DEFAULT_FONT_MONO}`

export const nova: ThemePreset = {
  name: 'nova',
  foundation: {
    'base-font-size': '14px',
    'border-width': '1px',
    'font-family': FONT_FAMILY,
    'font-mono': FONT_MONO,
    'font-display': FONT_DISPLAY,
    'duration-fast': '100ms',
    'duration-normal': '180ms',
    'duration-slow': '280ms',
    'easing-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
    'easing-in': 'cubic-bezier(0.55, 0, 0.85, 0)',
    'easing-in-out': 'cubic-bezier(0.83, 0, 0.17, 1)',
    'disabled-opacity': DEFAULT_DISABLED_OPACITY,
    'disabled-cursor': DEFAULT_DISABLED_CURSOR,
    'spacing': DEFAULT_SPACING,
  },
  scales: {
    radius: {
      'xs': '0.25rem',
      'sm': '0.375rem',
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
      'surface': 'oklch(0.99 0.005 320)',
      'foreground': 'oklch(0.21 0.018 290)',
      'primary': 'oklch(0.6 0.23 290)',
      'primary-foreground': 'oklch(1 0 0)',
      'secondary': 'oklch(0.68 0.22 15)',
      'secondary-foreground': 'oklch(1 0 0)',
      'accent': 'oklch(0.75 0.16 200)',
      'accent-foreground': 'oklch(0.21 0.018 290)',
      'success': 'oklch(0.72 0.18 150)',
      'success-foreground': 'oklch(1 0 0)',
      'warning': 'oklch(0.85 0.18 95)',
      'warning-foreground': 'oklch(0.21 0.018 290)',
      'destructive': 'oklch(0.63 0.24 27)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.72 0.16 230)',
      'info-foreground': 'oklch(1 0 0)',
      'contrast': 'oklch(0.21 0.018 290)',
      'contrast-foreground': 'oklch(1 0 0)',
      'muted': 'oklch(0.62 0.018 290)',
      'divider': 'oklch(0.91 0.012 290)',
      'overlay': 'oklch(0.21 0.018 290)',
      'shadow': 'oklch(0.32 0.07 290)',
    },
    dark: {
      'surface': 'oklch(0.18 0.015 290)',
      'foreground': 'oklch(0.97 0.005 290)',
      'primary': 'oklch(0.72 0.2 290)',
      'primary-foreground': 'oklch(0.18 0.015 290)',
      'secondary': 'oklch(0.74 0.2 15)',
      'secondary-foreground': 'oklch(0.18 0.015 290)',
      'accent': 'oklch(0.82 0.15 200)',
      'accent-foreground': 'oklch(0.18 0.015 290)',
      'success': 'oklch(0.78 0.17 150)',
      'success-foreground': 'oklch(0.18 0.015 290)',
      'warning': 'oklch(0.86 0.17 95)',
      'warning-foreground': 'oklch(0.18 0.015 290)',
      'destructive': 'oklch(0.7 0.21 27)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.78 0.15 230)',
      'info-foreground': 'oklch(0.18 0.015 290)',
      'contrast': 'oklch(0.97 0.005 290)',
      'contrast-foreground': 'oklch(0.18 0.015 290)',
      'muted': 'oklch(0.68 0.018 290)',
      'divider': 'oklch(0.3 0.025 290)',
      'overlay': 'oklch(0.18 0.015 290)',
      'shadow': 'oklch(0.12 0.025 290)',
    },
  },
}
