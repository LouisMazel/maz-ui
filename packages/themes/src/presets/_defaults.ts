import type { ThemeComponentBg, ThemeScales } from '../types'

/**
 * Defaults for `scales.{spacing, shadow, fontSize}` shared across the four
 * bundled presets. Each preset can spread these and override the keys it
 * cares about. `radius` is intentionally NOT shared — every preset declares
 * its own scale anchored on its visual identity.
 */
export const DEFAULT_SPACING: ThemeScales['spacing'] = '0.25rem'

export const DEFAULT_SHADOW: ThemeScales['shadow'] = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  elevation: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
}

export const DEFAULT_FONT_SIZE: ThemeScales['fontSize'] = {
  mini: ['0.625rem', '0.875rem'],
  xs: ['0.75rem', '1rem'],
  sm: ['0.875rem', '1.25rem'],
  md: ['1rem', '1.5rem'],
  lg: ['1.125rem', '1.75rem'],
  xl: ['1.25rem', '1.75rem'],
}

export const DEFAULT_DISABLED_OPACITY = '0.5'
export const DEFAULT_DISABLED_CURSOR = 'not-allowed'

/**
 * Default mono stack — used when a preset doesn't override `font-mono`.
 */
export const DEFAULT_FONT_MONO
  = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`

/**
 * Per-mode default bg for containers (cards, dialogs, popovers, dropdowns,
 * drawers). Both modes resolve to the active `surface` color so the bg
 * inherits any preset palette change automatically.
 */
export const DEFAULT_CONTAINER_BG: ThemeComponentBg = {
  light: 'var(--maz-surface)',
  dark: 'var(--maz-surface)',
}

/**
 * Per-mode default bg for inputs. Light uses the bare `surface`; dark uses
 * `surface-400` so inputs read as one tier above the page background — the
 * same contrast pattern the v4 components shipped with.
 */
export const DEFAULT_INPUT_BG: ThemeComponentBg = {
  light: 'var(--maz-surface)',
  dark: 'var(--maz-surface-400)',
}

/**
 * Default font weight used by `MazBtn` — medium (500). Presets can
 * override via `components.btn.font-weight` to bias the button text
 * heavier or lighter for their visual identity.
 */
export const DEFAULT_BTN_FONT_WEIGHT = '500'
