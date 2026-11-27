import type { ThemePreset } from '../types.ts'
import {
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
  DEFAULT_SPACE,
} from './_defaults.ts'

/**
 * macOS preset: the look of a native Mac app (macOS 26).
 *
 * Identity:
 * - System font at 13px, the body size of macOS: the whole `rem` scale
 *   (spacing included) tightens with it.
 * - Colors measured on macOS 26 (`NSColor`, Aqua and Dark Aqua): neutral
 *   grays, `primary` is the default accent (#007aff in both modes), the
 *   system purple, pink and teal for `secondary`, `accent` and `info`.
 * - `foreground` and `divider` are the translucent system label and
 *   separator colors (`systemColors`, Safari and WebKit views only), the
 *   values below are the same colors flattened on the window. WebKit always
 *   returns #007aff for the accent of the user (fingerprinting), so the
 *   accent is not a system color: an app that reads it natively overrides
 *   `primary`.
 * - White text on the accent colors and on red, like macOS: these pairs reach the 3:1
 *   of WCAG for controls and large text, not the 4.5:1 of body text. Pink,
 *   teal, green and orange are darkened on light for their white text, green,
 *   teal and orange keep a dark text in dark mode. `muted` stays darker than
 *   the secondary label of macOS (3.9:1) to keep the AA contrast.
 * - Content blocks (`container`) on the window (`surface`), translucent
 *   `glass` for sidebars, toolbars and menus.
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
    // Measured on macOS 26: push buttons ~6pt, grouped blocks ~12pt, windows ~26pt.
    rounded: {
      'xs': '4px',
      'sm': '5px',
      'md': '7px',
      'lg': '12px',
      'xl': '12px',
      '2xl': '16px',
      '3xl': '26px',
    },
    shadow: {
      sm: '0 0.5px 1px rgb(0 0 0 / 0.12), 0 0 0 0.5px rgb(0 0 0 / 0.06)',
      md: '0 1px 3px rgb(0 0 0 / 0.12), 0 0 0 0.5px rgb(0 0 0 / 0.08)',
      lg: '0 6px 16px rgb(0 0 0 / 0.16), 0 0 0 0.5px rgb(0 0 0 / 0.1)',
      xl: '0 12px 32px rgb(0 0 0 / 0.22), 0 0 0 0.5px rgb(0 0 0 / 0.12)',
      elevation: '0 10px 30px rgb(0 0 0 / 0.2), 0 0 0 0.5px rgb(0 0 0 / 0.12)',
    },
  },
  // macOS text styles (points = px): Large Title 26/32, Title 1 22/26, Title 2
  // 17/22, Title 3 15/20 (all regular), Headline 13/16 bold, Body 13/16,
  // Callout 12/15, Subheadline 11/14. SF tracks itself by optical size, so no
  // letter spacing.
  typography: {
    'display': {
      size: '26px',
      weight: '400',
      leading: '1.23',
      tracking: '0',
    },
    'title-1': {
      size: '22px',
      weight: '400',
      leading: '1.18',
      tracking: '0',
    },
    'title-2': {
      size: '17px',
      weight: '400',
      leading: '1.29',
      tracking: '0',
    },
    'title-3': {
      size: '15px',
      weight: '400',
      leading: '1.33',
      tracking: '0',
    },
    'title-4': {
      size: '13px',
      weight: '700',
      leading: '1.23',
      tracking: '0',
    },
    'body-lg': { size: '15px', leading: '1.33', tracking: '0' },
    'body': { size: '13px', leading: '1.23', tracking: '0' },
    'body-sm': { size: '12px', leading: '1.25', tracking: '0' },
    'label': {
      size: '13px',
      weight: '400',
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
    btn: { 'font-weight': '400' },
    container: {
      bg: { light: '#ffffff', dark: '#282828' },
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
    foreground: '-apple-system-label',
    divider: '-apple-system-separator',
  },
  colors: {
    light: {
      'surface': '#f4f5f5',
      'foreground': '#272727',
      'primary': '#007aff',
      'primary-foreground': '#ffffff',
      'secondary': '#cb30e0',
      'secondary-foreground': '#ffffff',
      'accent': '#d30f45',
      'accent-foreground': '#ffffff',
      'info': '#00838c',
      'info-foreground': '#ffffff',
      'success': '#1e7f34',
      'success-foreground': '#ffffff',
      'warning': '#b26119',
      'warning-foreground': '#ffffff',
      'destructive': '#ff383c',
      'destructive-foreground': '#ffffff',
      'contrast': '#272727',
      'contrast-foreground': '#ffffff',
      'muted': '#707070',
      'divider': '#e6e6e6',
      'overlay': 'rgb(0 0 0 / 0.2)',
      'shadow': '#000000',
    },
    dark: {
      'surface': '#1e1e1e',
      'foreground': '#dddddd',
      'primary': '#007aff',
      'primary-foreground': '#ffffff',
      'secondary': '#db34f2',
      'secondary-foreground': '#ffffff',
      'accent': '#ff375f',
      'accent-foreground': '#ffffff',
      'info': '#00d2e0',
      'info-foreground': '#000000',
      'success': '#30d158',
      'success-foreground': '#000000',
      'warning': '#ff9230',
      'warning-foreground': '#000000',
      'destructive': '#ff4245',
      'destructive-foreground': '#ffffff',
      'contrast': '#dddddd',
      'contrast-foreground': '#1e1e1e',
      'muted': '#9a9a9a',
      'divider': '#343434',
      'overlay': 'rgb(0 0 0 / 0.4)',
      'shadow': '#000000',
    },
  },
}
