import type { ThemePreset } from '../types'
import {
  DEFAULT_BTN_FONT_WEIGHT,
  DEFAULT_CONTAINER_BG,
  DEFAULT_DIALOG_MAX_WIDTH,
  DEFAULT_DIALOG_MIN_WIDTH,
  DEFAULT_DISABLED_CURSOR,
  DEFAULT_DISABLED_OPACITY,
  DEFAULT_FONT_MONO,
  DEFAULT_INPUT_BG,
  DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT,
  DEFAULT_SHADOW,
  DEFAULT_SPACE,
  typographyWith,
} from './_defaults'

/**
 * Folio preset - "plasma": electric and modern, made for long reading. It styles maz-ui.com.
 *
 * Identity:
 * - `primary` is an electric blue (the Maz-UI blue, pushed further), `secondary`
 *   an electric magenta, `accent` a cyan: three vivid voices that blend into a
 *   plasma gradient.
 * - Surfaces carry a faint violet tint: an almost white light mode and a
 *   violet-black dark mode.
 * - In dark mode the roles turn into bright tones carrying dark text, so they
 *   stay readable as text on the surface too (links, active states).
 * - Fraunces (serif) for the headings, Inter for the text, Geist Mono for the code.
 * - A soft 0.625rem `md` radius and an unhurried spring easing (120 / 240 / 360 ms).
 * - Every text pair reaches WCAG AA (4.5:1).
 *
 * Distinct from `mazUi` (blue + purple), `pristine` (monochrome), `ocean`
 * (teal + sand), `obsidian` (indigo + gold) and `nova` (violet + coral).
 */
const FONT_FAMILY = `'Inter', system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen, ubuntu, cantarell, 'Helvetica Neue', sans-serif`
const FONT_DISPLAY = `'Fraunces', 'Iowan Old Style', 'Palatino Linotype', palatino, georgia, serif`
const FONT_MONO = `'Geist Mono', ${DEFAULT_FONT_MONO}`

const INK = 'oklch(0.2 0.03 290)'
const PAPER = 'oklch(0.99 0.004 300)'
const NIGHT = 'oklch(0.16 0.025 285)'
const MOONLIGHT = 'oklch(0.96 0.01 300)'
const WHITE = 'oklch(1 0 0)'

export const folio: ThemePreset = {
  name: 'folio',
  foundation: {
    'base-font-size': '14px',
    'font-family': FONT_FAMILY,
    'font-mono-stack': FONT_MONO,
    'font-display-stack': FONT_DISPLAY,
    'border-width': '1px',
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
    rounded: { md: '0.625rem' },
    shadow: DEFAULT_SHADOW,
  },
  typography: typographyWith({
    'display': { weight: '600', tracking: '-0.01em' },
    'title-1': { weight: '600', tracking: '-0.01em' },
    'title-2': { tracking: '-0.005em' },
    'title-3': { tracking: '0' },
    'body-lg': { leading: '1.75' },
    'body': { leading: '1.7' },
  }),
  components: {
    btn: { 'font-weight': DEFAULT_BTN_FONT_WEIGHT },
    container: { bg: DEFAULT_CONTAINER_BG },
    input: { 'bg': DEFAULT_INPUT_BG, 'top-label-font-weight': DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT },
    dialog: { 'max-width': DEFAULT_DIALOG_MAX_WIDTH, 'min-width': DEFAULT_DIALOG_MIN_WIDTH },
  },
  colors: {
    light: {
      'surface': PAPER,
      'foreground': INK,
      'primary': 'oklch(0.54 0.25 264)',
      'primary-foreground': WHITE,
      'secondary': 'oklch(0.56 0.24 345)',
      'secondary-foreground': WHITE,
      'accent': 'oklch(0.53 0.12 210)',
      'accent-foreground': WHITE,
      'success': 'oklch(0.76 0.17 150)',
      'success-foreground': INK,
      'warning': 'oklch(0.82 0.15 80)',
      'warning-foreground': INK,
      'destructive': 'oklch(0.57 0.22 25)',
      'destructive-foreground': WHITE,
      'info': 'oklch(0.55 0.13 240)',
      'info-foreground': WHITE,
      'contrast': INK,
      'contrast-foreground': PAPER,
      'divider': 'oklch(0.91 0.012 295)',
      'overlay': INK,
      'muted': 'oklch(0.5 0.03 290)',
      'shadow': 'oklch(0.25 0.04 290)',
    },
    dark: {
      'surface': NIGHT,
      'foreground': MOONLIGHT,
      'primary': 'oklch(0.7 0.19 264)',
      'primary-foreground': NIGHT,
      'secondary': 'oklch(0.72 0.2 345)',
      'secondary-foreground': NIGHT,
      'accent': 'oklch(0.8 0.13 200)',
      'accent-foreground': NIGHT,
      'success': 'oklch(0.8 0.17 150)',
      'success-foreground': NIGHT,
      'warning': 'oklch(0.84 0.15 80)',
      'warning-foreground': NIGHT,
      'destructive': 'oklch(0.7 0.18 25)',
      'destructive-foreground': NIGHT,
      'info': 'oklch(0.75 0.12 240)',
      'info-foreground': NIGHT,
      'contrast': MOONLIGHT,
      'contrast-foreground': NIGHT,
      'divider': 'oklch(0.3 0.03 285)',
      'overlay': 'oklch(0.1 0.02 285)',
      'muted': 'oklch(0.74 0.03 290)',
      'shadow': 'oklch(0.08 0.02 285)',
    },
  },
}
