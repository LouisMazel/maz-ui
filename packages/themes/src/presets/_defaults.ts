import type { RoundedScaleKey, ThemeComponentBg, ThemeComponents, ThemeFoundation, ThemeScales } from '../types'

/**
 * Defaults shared across the bundled presets. Each preset can spread these
 * and override the keys it cares about. The bundled presets only declare
 * `scales.rounded.md` — the other rounded keys are filled at CSS-generation
 * time via `calc(var(--maz-rounded-md) * DEFAULT_ROUNDED_RATIOS[key])`. A
 * preset (or user override) may still set any rounded key to a literal value
 * to opt out of the calc fallback for that key.
 */
export const DEFAULT_SPACE: NonNullable<ThemeFoundation['space']> = '0.25rem'

/**
 * Multipliers used to derive the rounded scale from `md` when a key is not
 * explicitly set. Anchored on `md = 1` (implicit). Picked to match the
 * scale shared by `nova`, `obsidian` and `ocean`.
 */
export const DEFAULT_ROUNDED_RATIOS: Record<Exclude<RoundedScaleKey, 'md'>, number> = {
  'xs': 0.25,
  'sm': 0.5,
  'lg': 1.5,
  'xl': 2,
  '2xl': 3,
  '3xl': 4,
}

export const DEFAULT_SHADOW: ThemeScales['shadow'] = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  elevation: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
}

export const DEFAULT_DISABLED_OPACITY = '0.5'
export const DEFAULT_DISABLED_CURSOR = 'not-allowed'

/**
 * Default mono stack — used when a preset doesn't override `font-mono-stack`.
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
 * Per-mode default bg for inputs. Light uses the bare `surface`; dark
 * derives one tier above the page background via relative OKLCh syntax
 * (mirrors SCALE_OFFSETS step -400: l+0.06) — same contrast pattern the
 * v4 components shipped with. Self-contained, no Tailwind dependency.
 */
export const DEFAULT_INPUT_BG: ThemeComponentBg = {
  light: 'var(--maz-surface)',
  dark: 'oklch(from var(--maz-surface) clamp(0, calc(l + 0.06), 1) c h)',
}

/**
 * Default font-weight used by the top-label in `.m-input` when the
 * `top-label` prop is set. The value is '600' by default, allowing
 * presets to easily increase or decrease it when needed.
 */
export const DEFAULT_INPUT_TOP_LABEL_FONT_WEIGHT = '600'

/**
 * Default font weight used by `MazBtn` — medium (500). Presets can
 * override via `components.btn.font-weight` to bias the button text
 * heavier or lighter for their visual identity.
 */
export const DEFAULT_BTN_FONT_WEIGHT = '500'

/**
 * Default `max-width` / `min-width` for `MazDialog` on tablet and up.
 * Anchored on a 14px `base-font-size` (38rem ≈ 532px, 32rem ≈ 448px).
 * Presets with a different `base-font-size` (e.g. ocean at 16px) should
 * scale these in rem to keep the rendered pixel width consistent.
 * Consumed by the component via `var(--maz-dialog-max-width, 38rem)` /
 * `var(--maz-dialog-min-width, 32rem)`, and still overridable per-instance
 * through the `max-width` / `min-width` props.
 */
export const DEFAULT_DIALOG_MAX_WIDTH: NonNullable<ThemeComponents['dialog']>['max-width'] = '38rem'
export const DEFAULT_DIALOG_MIN_WIDTH: NonNullable<ThemeComponents['dialog']>['min-width'] = '32rem'
