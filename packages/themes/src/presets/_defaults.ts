import type { RoundedScaleKey, ThemeComponentBg, ThemeComponents, ThemeFoundation, ThemeScales, ThemeTypography, TypographyLevel } from '../types.ts'

/**
 * Defaults shared across the bundled presets. Each preset can spread these
 * and override the keys it cares about. The bundled presets only declare
 * `scales.rounded.md` — the other rounded keys are filled at CSS-generation
 * time via `calc(var(--maz-rounded-md) * DEFAULT_ROUNDED_RATIOS[key])`. A
 * preset (or user override) may still set any rounded key to a literal value
 * to opt out of the calc fallback for that key.
 */
export const DEFAULT_SPACE: NonNullable<ThemeFoundation['space']> = '0.25rem'

/** Border width of a boxed field with the focus (WCAG 2.4.13). */
export const DEFAULT_FOCUS_BORDER_WIDTH: NonNullable<ThemeFoundation['focus-border-width']> = '2px'

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

/**
 * The light shadows of the first presets, without color mode (a preset with one mode only)
 */
export const DEFAULT_LIGHT_SHADOW = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  elevation: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
} satisfies ThemeScales['shadow']

/**
 * On a dark background a black shadow at 5-10% is invisible: the dark shadows are deeper, and the large
 * ones get a hairline light edge that detaches the surface. The light ones are unchanged.
 */
export const DEFAULT_SHADOW: ThemeScales['shadow'] = {
  'sm': { light: DEFAULT_LIGHT_SHADOW.sm, dark: '0 1px 2px 0 rgb(0 0 0 / 0.4)' },
  'md': { light: DEFAULT_LIGHT_SHADOW.md, dark: '0 4px 6px -1px rgb(0 0 0 / 0.45), 0 2px 4px -2px rgb(0 0 0 / 0.4)' },
  'lg': { light: DEFAULT_LIGHT_SHADOW.lg, dark: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.45), 0 0 0 1px rgb(255 255 255 / 0.04)' },
  'xl': { light: DEFAULT_LIGHT_SHADOW.xl, dark: '0 20px 25px -5px rgb(0 0 0 / 0.55), 0 8px 10px -6px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(255 255 255 / 0.05)' },
  'elevation': { light: DEFAULT_LIGHT_SHADOW.elevation, dark: '0 4px 12px -2px rgb(0 0 0 / 0.45), 0 2px 4px -1px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(255 255 255 / 0.04)' },
  'elevation-1': {
    light: '0 2px 6px -1px rgb(0 0 0 / 0.1), 0 1px 3px -1px rgb(0 0 0 / 0.08)',
    dark: '0 2px 6px -1px rgb(0 0 0 / 0.65), 0 0 0 1px rgb(255 255 255 / 0.1)',
  },
  'elevation-2': {
    light: '0 8px 20px -4px rgb(0 0 0 / 0.14), 0 3px 8px -2px rgb(0 0 0 / 0.08)',
    dark: '0 8px 20px -4px rgb(0 0 0 / 0.6), 0 3px 8px -2px rgb(0 0 0 / 0.45), 0 0 0 1px rgb(255 255 255 / 0.16)',
  },
  'elevation-3': {
    light: '0 20px 40px -8px rgb(0 0 0 / 0.22), 0 8px 16px -4px rgb(0 0 0 / 0.12)',
    dark: '0 20px 44px -8px rgb(0 0 0 / 0.75), 0 8px 18px -4px rgb(0 0 0 / 0.55), 0 0 0 1px rgb(255 255 255 / 0.24)',
  },
}

/**
 * Motion tokens added after the first presets: shared by every preset, which keeps its own
 * `motion-fast/normal/slow` and `easing-out/in/in-out`. The springs are `springEasing()` and
 * `springEasing({ stiffness: 260, damping: 20 })`, written out to cost nothing at runtime.
 */
export const DEFAULT_MOTION = {
  'motion-instant': '80ms',
  'motion-slower': '450ms',
  'motion-scale': '1',
  'easing-spring': 'linear(0, 0.062, 0.184, 0.318, 0.451, 0.568, 0.665, 0.744, 0.807, 0.854, 0.891, 0.919, 0.941, 0.957, 0.968, 0.977, 0.983, 0.988, 0.991, 0.994, 0.995, 0.997, 0.998, 0.998, 0.999, 0.999, 0.999, 1, 1, 1, 1, 1, 1)',
  'easing-bounce': 'linear(0, 0.066, 0.211, 0.388, 0.566, 0.726, 0.857, 0.955, 1.021, 1.06, 1.079, 1.081, 1.074, 1.061, 1.047, 1.032, 1.019, 1.009, 1.002, 0.997, 0.995, 0.993, 0.993, 0.994, 0.995, 0.996, 0.998, 0.999, 0.999, 1, 1, 1, 1)',
} satisfies Partial<ThemeFoundation>

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

/**
 * Default type scale, the values of the `text-<level>` utilities of
 * `maz-ui/tailwindcss/utilities.css` (their CSS fallbacks are the same). Sizes
 * are in `rem`: they follow `base-font-size`. `font` is left out: titles use
 * the display font and the other levels the sans font of the foundation.
 */
export const DEFAULT_TYPOGRAPHY = {
  'display': {
    size: 'clamp(2.25rem, 1.6rem + 2.4vw, 3.25rem)',
    weight: '700',
    leading: '1.1',
    tracking: '-0.025em',
  },
  'title-1': {
    size: '2rem',
    weight: '700',
    leading: '1.2',
    tracking: '-0.02em',
  },
  'title-2': {
    size: '1.5rem',
    weight: '600',
    leading: '1.25',
    tracking: '-0.015em',
  },
  'title-3': {
    size: '1.25rem',
    weight: '600',
    leading: '1.3',
    tracking: '-0.01em',
  },
  'title-4': {
    size: '1.0625rem',
    weight: '600',
    leading: '1.4',
    tracking: '0',
  },
  'body-lg': {
    size: '1.125rem',
    weight: '400',
    leading: '1.65',
    tracking: '0',
  },
  'body': {
    size: '1rem',
    weight: '400',
    leading: '1.6',
    tracking: '0',
  },
  'body-sm': {
    size: '0.875rem',
    weight: '400',
    leading: '1.5',
    tracking: '0',
  },
  'label': {
    size: '0.875rem',
    weight: '500',
    leading: '1.4',
    tracking: '0',
  },
  'caption': {
    size: '0.75rem',
    weight: '400',
    leading: '1.4',
    tracking: '0.01em',
    color: 'var(--maz-muted)',
  },
  'overline': {
    size: '0.75rem',
    weight: '600',
    leading: '1.4',
    tracking: '0.08em',
  },
  'code': {
    size: '0.875em',
    weight: '400',
    leading: '1.5',
    tracking: '0',
  },
} as const satisfies Required<ThemeTypography>

/** The default type scale with some keys of some levels changed */
export function typographyWith(overrides: ThemeTypography): ThemeTypography {
  return Object.fromEntries((Object.keys(DEFAULT_TYPOGRAPHY) as TypographyLevel[]).map(level => [
    level,
    {
      ...DEFAULT_TYPOGRAPHY[level],
      ...overrides[level],
    },
  ]))
}
