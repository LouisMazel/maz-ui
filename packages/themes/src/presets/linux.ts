import type { ThemePreset } from '../types'
import {
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
  DEFAULT_SPACE,
} from './_defaults'

/**
 * Linux preset: the look of a native GNOME app (libadwaita).
 *
 * Identity:
 * - Adwaita Sans (Cantarell before GNOME 48) at 14px.
 * - `primary` is the default Adwaita blue, in its text step so that labels and
 *   filled controls keep the AA contrast. An app that reads the accent of the
 *   desktop natively overrides `primary` and `accent`.
 * - Light window (`surface`) with white cards, rounded controls (6px) and
 *   cards (12px).
 * - GNOME draws no blurred material: `glass` stays opaque, the color of the
 *   cards. Controls keep the arrow cursor.
 */
const FONT_FAMILY = `'Adwaita Sans', Cantarell, 'Noto Sans', Ubuntu, system-ui, sans-serif`
const FONT_MONO = `'Adwaita Mono', 'Source Code Pro', 'DejaVu Sans Mono', monospace`

export const linux: ThemePreset = {
  name: 'linux',
  foundation: {
    'base-font-size': '14px',
    'border-width': '1px',
    'font-family': FONT_FAMILY,
    'font-mono-stack': FONT_MONO,
    'font-display-stack': FONT_FAMILY,
    'motion-fast': '100ms',
    'motion-normal': '200ms',
    'motion-slow': '300ms',
    'easing-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'easing-in': 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
    'easing-in-out': 'cubic-bezier(0.65, 0.05, 0.36, 1)',
    'disabled-opacity': DEFAULT_DISABLED_OPACITY,
    'disabled-cursor': 'default',
    'interactive-cursor': 'default',
    'space': DEFAULT_SPACE,
  },
  scales: {
    color: 'perceptual',
    rounded: {
      'xs': '3px',
      'sm': '4px',
      'md': '6px',
      'lg': '9px',
      'xl': '12px',
      '2xl': '15px',
      '3xl': '24px',
    },
    shadow: {
      sm: '0 1px 2px rgb(0 0 6 / 0.07)',
      md: '0 0 0 1px rgb(0 0 6 / 0.03), 0 1px 3px 1px rgb(0 0 6 / 0.07), 0 2px 6px 2px rgb(0 0 6 / 0.03)',
      lg: '0 1px 5px 1px rgb(0 0 6 / 0.09), 0 2px 14px 3px rgb(0 0 6 / 0.05)',
      xl: '0 2px 8px 2px rgb(0 0 6 / 0.13), 0 3px 20px 10px rgb(0 0 6 / 0.09)',
      elevation: '0 0 0 1px rgb(0 0 6 / 0.03), 0 1px 3px 1px rgb(0 0 6 / 0.07), 0 2px 6px 2px rgb(0 0 6 / 0.03)',
    },
  },
  // libadwaita style classes, relative to the 14px body: large-title 300%
  // light, title-1 181%, title-2 136% extra bold, title-3 136%, title-4 118%
  // and heading 100% bold, caption 82%.
  typography: {
    'display': {
      size: '3rem',
      weight: '300',
      leading: '1.15',
      tracking: '0',
    },
    'title-1': {
      size: '1.81rem',
      weight: '800',
      leading: '1.2',
      tracking: '0',
    },
    'title-2': {
      size: '1.36rem',
      weight: '800',
      leading: '1.25',
      tracking: '0',
    },
    'title-3': {
      size: '1.36rem',
      weight: '700',
      leading: '1.25',
      tracking: '0',
    },
    'title-4': {
      size: '1.18rem',
      weight: '700',
      leading: '1.3',
      tracking: '0',
    },
    'body-lg': { size: '1.18rem', leading: '1.5', tracking: '0' },
    'body': { size: '1rem', leading: '1.45', tracking: '0' },
    'body-sm': { size: '0.82rem', leading: '1.4', tracking: '0' },
    'label': {
      size: '1rem',
      weight: '400',
      leading: '1.4',
      tracking: '0',
    },
    'caption': { size: '0.82rem', leading: '1.35', tracking: '0' },
    'overline': {
      size: '0.82rem',
      weight: '700',
      leading: '1.35',
      tracking: '0',
    },
  },
  components: {
    btn: { 'font-weight': '700' },
    container: {
      bg: { light: '#ffffff', dark: '#2e2e32' },
    },
    input: {
      'bg': { light: 'rgb(0 0 6 / 0.05)', dark: 'rgb(255 255 255 / 0.08)' },
      'top-label-font-weight': DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
    },
    glass: {
      bg: { light: '#ffffff', dark: '#36363a' },
      border: { light: 'rgb(0 0 6 / 0.12)', dark: 'rgb(255 255 255 / 0.1)' },
      blur: '0px',
      saturate: '1',
    },
    dialog: { 'max-width': '34rem', 'min-width': '22rem' },
  },
  colors: {
    light: {
      'surface': '#fafafb',
      'foreground': '#2e2e33',
      'primary': '#1c71d8',
      'primary-foreground': '#ffffff',
      'secondary': '#e8e8ea',
      'secondary-foreground': '#2e2e33',
      'accent': '#1c71d8',
      'accent-foreground': '#ffffff',
      'info': '#1c71d8',
      'info-foreground': '#ffffff',
      'success': '#1b8553',
      'success-foreground': '#ffffff',
      'warning': '#9c6e03',
      'warning-foreground': '#ffffff',
      'destructive': '#c01c28',
      'destructive-foreground': '#ffffff',
      'contrast': '#2e2e33',
      'contrast-foreground': '#ffffff',
      'muted': '#6b6b70',
      'divider': '#dfdfe1',
      'overlay': 'rgb(0 0 6 / 0.25)',
      'shadow': '#000006',
    },
    dark: {
      'surface': '#222226',
      'foreground': '#ffffff',
      'primary': '#78aeed',
      'primary-foreground': '#000000',
      'secondary': '#3a3a3e',
      'secondary-foreground': '#ffffff',
      'accent': '#78aeed',
      'accent-foreground': '#000000',
      'info': '#78aeed',
      'info-foreground': '#000000',
      'success': '#8ff0a4',
      'success-foreground': '#000000',
      'warning': '#f8e45c',
      'warning-foreground': '#000000',
      'destructive': '#ff7b63',
      'destructive-foreground': '#000000',
      'contrast': '#ffffff',
      'contrast-foreground': '#222226',
      'muted': '#a8a8ad',
      'divider': '#3a3a3e',
      'overlay': 'rgb(0 0 0 / 0.5)',
      'shadow': '#000000',
    },
  },
}
