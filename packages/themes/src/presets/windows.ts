import type { ThemePreset } from '../types'
import {
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
  DEFAULT_SPACE,
} from './_defaults'

/**
 * Windows preset: the look of a native Windows 11 app (Fluent 2).
 *
 * Identity:
 * - Segoe UI Variable at 14px, the body size of Fluent.
 * - `primary` is the default Windows accent (its darker step on light, its
 *   lighter step on dark, as Fluent does for text and filled controls).
 *   Windows does not expose the user accent to the web: an app that reads it
 *   natively overrides `primary` and `accent`.
 * - Light gray window (Mica) and lighter cards, small radii (4px controls,
 *   8px cards and flyouts), the Acrylic material for `glass`.
 * - Fluent motion: fast decelerated curves. Controls keep the arrow cursor.
 */
const FONT_FAMILY = `'Segoe UI Variable Text', 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif`
const FONT_DISPLAY = `'Segoe UI Variable Display', 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif`
const FONT_MONO = `'Cascadia Mono', Consolas, 'Courier New', monospace`

export const windows: ThemePreset = {
  name: 'windows',
  foundation: {
    'base-font-size': '14px',
    'border-width': '1px',
    'font-family': FONT_FAMILY,
    'font-mono-stack': FONT_MONO,
    'font-display-stack': FONT_DISPLAY,
    'motion-fast': '83ms',
    'motion-normal': '167ms',
    'motion-slow': '250ms',
    'easing-out': 'cubic-bezier(0, 0, 0, 1)',
    'easing-in': 'cubic-bezier(1, 0, 1, 1)',
    'easing-in-out': 'cubic-bezier(0.33, 0, 0.67, 1)',
    'disabled-opacity': DEFAULT_DISABLED_OPACITY,
    'disabled-cursor': 'default',
    'interactive-cursor': 'default',
    'space': DEFAULT_SPACE,
  },
  scales: {
    color: 'perceptual',
    rounded: {
      'xs': '2px',
      'sm': '3px',
      'md': '4px',
      'lg': '8px',
      'xl': '8px',
      '2xl': '12px',
      '3xl': '16px',
    },
    shadow: {
      sm: '0 1px 2px rgb(0 0 0 / 0.14)',
      md: '0 2px 4px rgb(0 0 0 / 0.14)',
      lg: '0 8px 16px rgb(0 0 0 / 0.14)',
      xl: '0 32px 64px rgb(0 0 0 / 0.19), 0 2px 21px rgb(0 0 0 / 0.15)',
      elevation: '0 8px 16px rgb(0 0 0 / 0.14), 0 0 0 1px rgb(0 0 0 / 0.06)',
    },
  },
  // Fluent type ramp (px): Display 68/92, Title Large 40/52, Title 28/36,
  // Subtitle 20/28, Body Large 18/24, Body 14/20, Caption 12/16. Semibold
  // titles, no letter spacing (Segoe UI Variable tracks by optical size).
  typography: {
    'display': {
      size: '68px',
      weight: '600',
      leading: '1.35',
      tracking: '0',
    },
    'title-1': {
      size: '28px',
      weight: '600',
      leading: '1.29',
      tracking: '0',
    },
    'title-2': {
      size: '20px',
      weight: '600',
      leading: '1.4',
      tracking: '0',
    },
    'title-3': {
      size: '18px',
      weight: '600',
      leading: '1.33',
      tracking: '0',
    },
    'title-4': {
      size: '14px',
      weight: '600',
      leading: '1.43',
      tracking: '0',
    },
    'body-lg': { size: '18px', leading: '1.33', tracking: '0' },
    'body': { size: '14px', leading: '1.43', tracking: '0' },
    'body-sm': { size: '12px', leading: '1.33', tracking: '0' },
    'label': {
      size: '14px',
      weight: '400',
      leading: '1.43',
      tracking: '0',
    },
    'caption': { size: '12px', leading: '1.33', tracking: '0' },
    'overline': {
      size: '12px',
      weight: '600',
      leading: '1.33',
      tracking: '0',
    },
  },
  components: {
    btn: { 'font-weight': '400' },
    container: {
      bg: { light: '#fbfbfb', dark: '#2b2b2b' },
    },
    input: {
      'bg': { light: '#ffffff', dark: 'rgb(255 255 255 / 0.06)' },
      'top-label-font-weight': DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
    },
    glass: {
      bg: { light: 'rgb(249 249 249 / 0.8)', dark: 'rgb(44 44 44 / 0.8)' },
      border: { light: 'rgb(0 0 0 / 0.06)', dark: 'rgb(255 255 255 / 0.08)' },
      blur: '30px',
      saturate: '1.25',
    },
    dialog: { 'max-width': '34rem', 'min-width': '22rem' },
  },
  colors: {
    light: {
      'surface': '#f3f3f3',
      'foreground': '#1b1b1b',
      'primary': '#005fb8',
      'primary-foreground': '#ffffff',
      'secondary': '#e9e9e9',
      'secondary-foreground': '#1b1b1b',
      'accent': '#005fb8',
      'accent-foreground': '#ffffff',
      'info': '#005fb8',
      'info-foreground': '#ffffff',
      'success': '#0f7b0f',
      'success-foreground': '#ffffff',
      'warning': '#9d5d00',
      'warning-foreground': '#ffffff',
      'destructive': '#c42b1c',
      'destructive-foreground': '#ffffff',
      'contrast': '#1b1b1b',
      'contrast-foreground': '#ffffff',
      'muted': '#5d5d5d',
      'divider': '#e5e5e5',
      'overlay': 'rgb(0 0 0 / 0.3)',
      'shadow': '#000000',
    },
    dark: {
      'surface': '#202020',
      'foreground': '#ffffff',
      'primary': '#60cdff',
      'primary-foreground': '#000000',
      'secondary': '#3a3a3a',
      'secondary-foreground': '#ffffff',
      'accent': '#60cdff',
      'accent-foreground': '#000000',
      'info': '#60cdff',
      'info-foreground': '#000000',
      'success': '#6ccb5f',
      'success-foreground': '#000000',
      'warning': '#fce100',
      'warning-foreground': '#000000',
      'destructive': '#ff99a4',
      'destructive-foreground': '#000000',
      'contrast': '#ffffff',
      'contrast-foreground': '#1b1b1b',
      'muted': '#c5c5c5',
      'divider': '#353535',
      'overlay': 'rgb(0 0 0 / 0.5)',
      'shadow': '#000000',
    },
  },
}
