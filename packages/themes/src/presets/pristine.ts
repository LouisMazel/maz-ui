import type { ThemePreset } from '../types'
import {
  DEFAULT_BTN_FONT_WEIGHT,
  DEFAULT_CONTAINER_BG,
  DEFAULT_DISABLED_CURSOR,
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_FONT_MONO,
  DEFAULT_INPUT_BG,
  DEFAULT_SPACE,
} from './_defaults'

/**
 * Apple-style preset — sober and monochrome by default.
 *
 * `primary` deliberately stays near-black (light) / near-white (dark) so
 * the chrome reads as quiet and minimal — Apple-like "system gray"
 * sobriety. The vivid system colors (blue, teal, red, green, orange) are
 * reserved for `accent`, `info`, `destructive`, `success`, `warning`.
 *
 * Uses the SF system stack, Apple's spring easing
 * (`cubic-bezier(0.32, 0.72, 0, 1)`), and a low-intensity shadow ramp.
 * Radius anchors on `0.625rem` (≈ 10px) — Apple's standard control radius.
 */
const FONT_FAMILY = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif`
const FONT_DISPLAY = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif`

export const pristine: ThemePreset = {
  name: 'pristine',
  foundation: {
    'base-font-size': '14px',
    'border-width': '1px',
    'font-family': FONT_FAMILY,
    'font-mono-stack': DEFAULT_FONT_MONO,
    'font-display-stack': FONT_DISPLAY,
    'motion-fast': '120ms',
    'motion-normal': '220ms',
    'motion-slow': '380ms',
    'easing-out': 'cubic-bezier(0.32, 0.72, 0, 1)',
    'easing-in': 'cubic-bezier(0.5, 0, 0.75, 0)',
    'easing-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
    'disabled-opacity': DEFAULT_DISABLED_OPACITY,
    'disabled-cursor': DEFAULT_DISABLED_CURSOR,
    'space': DEFAULT_SPACE,
  },
  scales: {
    rounded: {
      'xs': '0.25rem',
      'sm': '0.375rem',
      'md': '0.625rem',
      'lg': '0.875rem',
      'xl': '1.25rem',
      '2xl': '1.75rem',
      '3xl': '2.5rem',
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
      md: '0 2px 6px -1px rgb(0 0 0 / 0.06), 0 1px 3px -1px rgb(0 0 0 / 0.04)',
      lg: '0 8px 16px -4px rgb(0 0 0 / 0.08), 0 3px 6px -2px rgb(0 0 0 / 0.04)',
      xl: '0 16px 28px -8px rgb(0 0 0 / 0.1), 0 6px 12px -4px rgb(0 0 0 / 0.06)',
      elevation: '0 4px 12px -2px rgb(0 0 0 / 0.06), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
    },
  },
  components: {
    btn: { 'font-weight': DEFAULT_BTN_FONT_WEIGHT },
    container: { bg: DEFAULT_CONTAINER_BG },
    input: { bg: DEFAULT_INPUT_BG },
  },
  colors: {
    light: {
      'surface': 'oklch(1 0 0)',
      'foreground': 'oklch(0.21 0.005 286)',
      'primary': 'oklch(0.22 0.005 286)',
      'primary-foreground': 'oklch(1 0 0)',
      'secondary': 'oklch(0.555 0.205 305)',
      'secondary-foreground': 'oklch(1 0 0)',
      'accent': 'oklch(0.612 0.215 254)',
      'accent-foreground': 'oklch(1 0 0)',
      'success': 'oklch(0.708 0.18 145)',
      'success-foreground': 'oklch(1 0 0)',
      'warning': 'oklch(0.745 0.179 56)',
      'warning-foreground': 'oklch(0.21 0.005 286)',
      'destructive': 'oklch(0.652 0.252 28)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.795 0.12 220)',
      'info-foreground': 'oklch(0.21 0.005 286)',
      'contrast': 'oklch(0.207 0.002 286)',
      'contrast-foreground': 'oklch(1 0 0)',
      'muted': 'oklch(0.6 0.005 286)',
      'divider': 'oklch(0.917 0.005 286)',
      'overlay': 'oklch(0.21 0.005 286)',
      'shadow': 'oklch(0 0 0)',
    },
    dark: {
      'surface': 'oklch(0.207 0.002 286)',
      'foreground': 'oklch(0.97 0 0)',
      'primary': 'oklch(0.97 0 0)',
      'primary-foreground': 'oklch(0.207 0.002 286)',
      'secondary': 'oklch(0.66 0.18 305)',
      'secondary-foreground': 'oklch(1 0 0)',
      'accent': 'oklch(0.643 0.211 256)',
      'accent-foreground': 'oklch(1 0 0)',
      'success': 'oklch(0.738 0.197 145)',
      'success-foreground': 'oklch(0.207 0.002 286)',
      'warning': 'oklch(0.76 0.171 60)',
      'warning-foreground': 'oklch(0.207 0.002 286)',
      'destructive': 'oklch(0.682 0.245 28)',
      'destructive-foreground': 'oklch(1 0 0)',
      'info': 'oklch(0.802 0.115 220)',
      'info-foreground': 'oklch(0.207 0.002 286)',
      'contrast': 'oklch(0.97 0 0)',
      'contrast-foreground': 'oklch(0.207 0.002 286)',
      'muted': 'oklch(0.65 0.005 286)',
      'divider': 'oklch(0.31 0.003 286)',
      'overlay': 'oklch(0.16 0.002 286)',
      'shadow': 'oklch(0 0 0)',
    },
  },
}
