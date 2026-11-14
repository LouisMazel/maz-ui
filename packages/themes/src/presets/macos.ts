import type { ThemePreset } from '../types'
import {
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
  DEFAULT_SPACE,
} from './_defaults'

/**
 * macOS preset: the look of a native Mac app (macOS 26).
 *
 * Identity:
 * - System font at 13px, the body size of macOS: the whole `rem` scale
 *   (spacing included) tightens with it.
 * - `primary` follows the accent color chosen by the user in System
 *   Settings, `foreground`, `muted` and `divider` the system label and
 *   separator colors (`systemColors`, WebKit only). Everywhere else the
 *   Apple values below are the fallback.
 * - `secondary` is the system purple, `accent` the system pink and `info`
 *   the system teal (pink and teal darkened on light for their white text):
 *   four strong colors that never look alike.
 * - White text on the accent colors and on red, like macOS: these pairs reach the 3:1
 *   of WCAG for controls and large text, not the 4.5:1 of body text. Green and
 *   yellow keep a dark text in dark mode, the body text stays AA.
 * - Grouped content on a light gray window (`surface`) inside white blocks
 *   (`container`), translucent `glass` for sidebars, toolbars and menus.
 * - Controls keep the arrow cursor, like native controls.
 */
const FONT_FAMILY = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro', system-ui, 'Helvetica Neue', sans-serif`
const FONT_DISPLAY = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro', system-ui, 'Helvetica Neue', sans-serif`
const FONT_MONO = `ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace`

export const macos: ThemePreset = {
  name: 'macos',
  foundation: {
    'base-font-size': '13px',
    'border-width': '1px',
    'font-family': FONT_FAMILY,
    'font-mono-stack': FONT_MONO,
    'font-display-stack': FONT_DISPLAY,
    'motion-fast': '120ms',
    'motion-normal': '200ms',
    'motion-slow': '300ms',
    'easing-out': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'easing-in': 'cubic-bezier(0.42, 0, 1, 1)',
    'easing-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
    'disabled-opacity': DEFAULT_DISABLED_OPACITY,
    'disabled-cursor': 'default',
    'interactive-cursor': 'default',
    'space': DEFAULT_SPACE,
  },
  scales: {
    color: 'perceptual',
    rounded: {
      'xs': '4px',
      'sm': '5px',
      'md': '7px',
      'lg': '10px',
      'xl': '12px',
      '2xl': '16px',
      '3xl': '22px',
    },
    shadow: {
      sm: '0 0.5px 1px rgb(0 0 0 / 0.12), 0 0 0 0.5px rgb(0 0 0 / 0.06)',
      md: '0 1px 3px rgb(0 0 0 / 0.12), 0 0 0 0.5px rgb(0 0 0 / 0.08)',
      lg: '0 6px 16px rgb(0 0 0 / 0.16), 0 0 0 0.5px rgb(0 0 0 / 0.1)',
      xl: '0 12px 32px rgb(0 0 0 / 0.22), 0 0 0 0.5px rgb(0 0 0 / 0.12)',
      elevation: '0 10px 30px rgb(0 0 0 / 0.2), 0 0 0 0.5px rgb(0 0 0 / 0.12)',
    },
  },
  // macOS text styles (points = px): Large Title 26, Title 1 22, Title 2 17,
  // Headline 13 bold, Body 13, Callout 12, Subheadline 11. SF tracks itself
  // by optical size, so no letter spacing.
  typography: {
    'display': {
      size: '34px',
      weight: '700',
      leading: '1.2',
      tracking: '0',
    },
    'title-1': {
      size: '26px',
      weight: '700',
      leading: '1.23',
      tracking: '0',
    },
    'title-2': {
      size: '22px',
      weight: '700',
      leading: '1.27',
      tracking: '0',
    },
    'title-3': {
      size: '17px',
      weight: '600',
      leading: '1.3',
      tracking: '0',
    },
    'title-4': {
      size: '13px',
      weight: '600',
      leading: '1.23',
      tracking: '0',
    },
    'body-lg': { size: '15px', leading: '1.33', tracking: '0' },
    'body': { size: '13px', leading: '1.38', tracking: '0' },
    'body-sm': { size: '12px', leading: '1.33', tracking: '0' },
    'label': {
      size: '13px',
      weight: '500',
      leading: '1.23',
      tracking: '0',
    },
    'caption': { size: '11px', leading: '1.27', tracking: '0' },
    'overline': {
      size: '11px',
      weight: '600',
      leading: '1.27',
      tracking: '0',
    },
    'code': { size: '0.92em' },
  },
  components: {
    btn: { 'font-weight': '500' },
    container: {
      bg: { light: '#ffffff', dark: '#262628' },
    },
    input: {
      'bg': { light: '#ffffff', dark: 'rgb(255 255 255 / 0.08)' },
      'top-label-font-weight': DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
    },
    glass: {
      bg: { light: 'rgb(246 246 248 / 0.72)', dark: 'rgb(48 48 52 / 0.62)' },
      border: { light: 'rgb(0 0 0 / 0.08)', dark: 'rgb(255 255 255 / 0.1)' },
      blur: '24px',
      saturate: '1.4',
    },
    dialog: { 'max-width': '28rem', 'min-width': '20rem' },
  },
  systemColors: {
    primary: '-apple-system-control-accent',
    foreground: '-apple-system-label',
    muted: '-apple-system-secondary-label',
    divider: '-apple-system-separator',
  },
  colors: {
    light: {
      'surface': '#f6f6f7',
      'foreground': '#1d1d1f',
      'primary': '#007aff',
      'primary-foreground': '#ffffff',
      'secondary': '#af52de',
      'secondary-foreground': '#ffffff',
      'accent': '#d30f45',
      'accent-foreground': '#ffffff',
      'info': '#00809d',
      'info-foreground': '#ffffff',
      'success': '#1e7f34',
      'success-foreground': '#ffffff',
      'warning': '#a35c00',
      'warning-foreground': '#ffffff',
      'destructive': '#ff3b30',
      'destructive-foreground': '#ffffff',
      'contrast': '#1d1d1f',
      'contrast-foreground': '#ffffff',
      'muted': '#6e6e73',
      'divider': '#e0e0e2',
      'overlay': 'rgb(0 0 0 / 0.2)',
      'shadow': '#000000',
    },
    dark: {
      'surface': '#1c1c1e',
      'foreground': '#f5f5f7',
      'primary': '#0a84ff',
      'primary-foreground': '#ffffff',
      'secondary': '#bf5af2',
      'secondary-foreground': '#ffffff',
      'accent': '#ff375f',
      'accent-foreground': '#ffffff',
      'info': '#40c8e0',
      'info-foreground': '#000000',
      'success': '#32d74b',
      'success-foreground': '#000000',
      'warning': '#ff9f0a',
      'warning-foreground': '#000000',
      'destructive': '#ff453a',
      'destructive-foreground': '#ffffff',
      'contrast': '#f5f5f7',
      'contrast-foreground': '#1d1d1f',
      'muted': '#98989d',
      'divider': '#38383a',
      'overlay': 'rgb(0 0 0 / 0.4)',
      'shadow': '#000000',
    },
  },
}
