/**
 * @deprecated Use {@link CSSColor}. The raw HSL form is still accepted at runtime
 * (auto-wrapped in `hsl()`), but prefer a complete CSS color value in new code.
 */
export type HSL = `${number} ${number}% ${number}%`

/**
 * Any valid CSS color value. Accepts complete forms (`hsl(210 100% 56%)`,
 * `oklch(0.7 0.15 30)`, `rgb(255 0 0)`, `#ff0000`) and the legacy raw form
 * `"210 100% 56%"` for backwards compatibility with v4 presets.
 */
// eslint-disable-next-line sonarjs/redundant-type-aliases -- Semantic alias used throughout the public ThemeColors contract; kept for documentation even though it widens to string.
export type CSSColor = string

export type SizeUnit = `${number}${'rem' | 'px' | 'em' | 'vw' | 'vh' | 'vmin' | 'vmax' | '%'}`

export type Duration = `${number}${'ms' | 's'}`

export interface ThemeColors {
  'surface': CSSColor
  'foreground': CSSColor
  'primary': CSSColor
  'primary-foreground': CSSColor
  'secondary': CSSColor
  'secondary-foreground': CSSColor
  'accent': CSSColor
  'accent-foreground': CSSColor
  'info': CSSColor
  'info-foreground': CSSColor
  'contrast': CSSColor
  'contrast-foreground': CSSColor
  'destructive': CSSColor
  'destructive-foreground': CSSColor
  'success': CSSColor
  'success-foreground': CSSColor
  'warning': CSSColor
  'warning-foreground': CSSColor
  'overlay': CSSColor
  'muted': CSSColor
  'divider': CSSColor
  'shadow': CSSColor
}

export interface ThemeFoundation {
  'base-font-size'?: SizeUnit
  'border-width': SizeUnit
  /** Body / sans font stack. */
  'font-family'?: string
  /** Monospace font stack. Used by `MazInputCode`, `<code>`, `<kbd>`. */
  'font-mono'?: string
  /**
   * Display / heading font stack. Defaults to the same value as `font-family`
   * — no behavioural change unless the consumer overrides it.
   */
  'font-display'?: string
  'duration-fast'?: Duration
  'duration-normal'?: Duration
  'duration-slow'?: Duration
  'easing-out'?: string
  'easing-in'?: string
  'easing-in-out'?: string
  /**
   * Opacity applied to disabled interactive elements (buttons, inputs, etc.).
   * @default '0.5'
   */
  'disabled-opacity'?: string
  /**
   * Cursor applied to disabled interactive elements.
   * @default 'not-allowed'
   */
  'disabled-cursor'?: string
}

/**
 * Spacing / radius / shadow scales. Bridged into Tailwind v4 via
 * `@theme inline` so the consumer's own utilities benefit too (e.g. `p-4`,
 * `rounded-md`, `shadow-lg`).
 *
 * Typography is intentionally NOT part of the scale — `foundation.base-font-size`
 * is the single knob that drives every relative `em` value in the lib.
 */
export interface ThemeScales {
  /**
   * Base spacing unit. Tailwind multiplies this for every `p-N`, `m-N`,
   * `gap-N`, etc.
   * @default '0.25rem'
   */
  spacing: SizeUnit
  /**
   * Border-radius scale. Maps to Tailwind utilities `rounded-{key}`.
   * `full` is intentionally not included — Tailwind keeps `rounded-full`
   * at 9999px regardless.
   */
  radius: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl', SizeUnit>
  /**
   * Box-shadow scale. Maps to Tailwind utilities `shadow-{key}`. `elevation`
   * is the maz-ui specific elevated-surface shadow used by MazCard,
   * MazContainer, MazPopover, etc.
   */
  shadow: Record<'sm' | 'md' | 'lg' | 'xl' | 'elevation', string>
}

/**
 * Optional, per-mode background overrides for "container" surfaces — defaults
 * to `var(--maz-surface)` light, `var(--maz-surface-400)` dark.
 */
export interface ThemeComponentBg {
  light?: CSSColor
  dark?: CSSColor
}

/**
 * Per-component theme overrides. Every entry is optional; omit a key and the
 * component falls back to its existing surface tokens (= zero behaviour change).
 */
export interface ThemeComponents {
  btn?: {
    /**
     * Font-weight applied on `.m-btn`. Defaults to `'500'` (medium).
     */
    'font-weight'?: string
  }
  /**
   * Background of "container" surfaces (Card, Container, Dialog, Popover,
   * Dropdown menu panel, Drawer, BottomSheet, …).
   */
  container?: {
    bg?: ThemeComponentBg
  }
  /**
   * Background of input controls (Input, Textarea, Select, Checkbox, Radio,
   * Switch, InputCode, InputTags, DatePicker trigger, Dropzone surface, …).
   */
  input?: {
    bg?: ThemeComponentBg
  }
}

export interface ThemePresetOverrides {
  /**
   * Theme name
   * @default undefined
   */
  name?: string

  /**
   * Theme colors
   * @default undefined
   */
  colors?: {
    light?: Partial<ThemeColors>
    dark?: Partial<ThemeColors>
  }

  /**
   * Theme foundation
   * @default undefined
   */
  foundation?: Partial<ThemeFoundation>

  /**
   * Theme scales (spacing, radius, shadow)
   * @default undefined
   */
  scales?: {
    spacing?: ThemeScales['spacing']
    radius?: Partial<ThemeScales['radius']>
    shadow?: Partial<ThemeScales['shadow']>
  }

  /**
   * Theme component-level overrides
   * @default undefined
   */
  components?: ThemeComponents
}

export interface ThemePreset {
  /**
   * Theme name
   */
  name: string
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  foundation: ThemeFoundation
  scales: ThemeScales
  components?: ThemeComponents
}

export type ThemePresetName = 'mazUi' | 'ocean' | 'pristine' | 'obsidian' | 'nova' | 'maz-ui'

export type ColorMode = 'light' | 'dark' | 'auto'

export type ThemeMode = 'light' | 'dark' | 'both'

export type DarkModeStrategy = 'class' | 'media'

export type Strategy = 'runtime' | 'buildtime' | 'hybrid'

interface BaseThemeConfig {
  /**
   * CSS variables prefix
   * @description Prefix for CSS variables
   * @default 'maz'
   * @private
   */
  prefix?: string

  /**
   * Theme preset to use - Optional if you use buildtime strategy
   * @description Can be a predefined preset name or a custom preset object
   * @default undefined
   */
  preset?: ThemePreset

  /**
   * Custom preset overrides
   * @description Allows customizing specific parts of the preset without redefining it entirely
   * @default undefined
   */
  overrides?: ThemePresetOverrides

  /**
   * CSS generation strategy
   * @description
   * - `runtime`: CSS generated (critical and full) injected immediately
   * - `buildtime`: CSS generated at build time and included in bundle
   * - `hybrid`: Critical CSS injected inline, full CSS loaded asynchronously (recommended)
   * @default 'hybrid'
   */
  strategy?: Strategy

  /**
   * Dark mode class
   * @description Class added to the document root when dark mode is active
   * @default 'dark'
   */
  darkClass?: string

  /**
   * Dark mode handling
   * @description
   * - `class`: Dark mode activated with `.dark` class
   * - `media`: Dark mode based on `prefers-color-scheme` (automatic detection of system preferences)
   * @default 'class'
   */
  darkModeStrategy?: DarkModeStrategy

  /**
   * Initial color mode to use
   * @description
   * - `light`: Light mode
   * - `dark`: Dark mode
   * - `auto`: Automatic detection of system preferences
   * @default 'auto'
   */
  colorMode?: ColorMode

  /**
   * Supported color modes to use
   * @description
   * - `light`: Will inject only light CSS variables
   * - `dark`: Will inject only dark CSS variables
   * - `both`: Will inject both light and dark CSS variables
   * @default 'both'
   */
  mode?: ThemeMode
}

export type ThemeConfig
  = | (BaseThemeConfig & { strategy?: Exclude<Strategy, 'buildtime'> })
    | (Omit<BaseThemeConfig, 'preset'> & {
      preset?: ThemePreset
      strategy: 'buildtime'
    })

export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface ThemeState {
  /**
   * Current preset
   * @description The preset used
   */
  preset?: ThemePreset
  /**
   * Color mode
   * @description The color mode chosen
   * @values 'light', 'dark', 'auto'
   */
  colorMode: ColorMode
  /**
   * Whether the current color mode is dark
   */
  isDark: boolean
  /**
   * Theme mode
   * @description The theme mode chosen
   * @values 'light', 'dark', 'both'
   */
  mode: ThemeMode
  /**
   * CSS generation strategy
   * @description The strategy used to generate CSS
   * @values 'runtime', 'buildtime', 'hybrid'
   */
  strategy: Strategy
  /**
   * Dark mode strategy
   * @description The strategy used to handle dark mode
   * @values 'class', 'media'
   */
  darkModeStrategy: DarkModeStrategy
  /**
   * Dark class
   * @description The class added to the document root when dark mode is active
   */
  darkClass: string
}
