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
  /**
   * Monospace font stack. Used by `MazInputCode`, `<code>`, `<kbd>`.
   * Bridged into Tailwind's `--font-mono` token. Named `font-mono-stack`
   * (not `font-mono`) to avoid the `prefix(maz)` self-cycle.
   */
  'font-mono-stack'?: string
  /**
   * Display / heading font stack. Defaults to the same value as `font-family`
   * — no behavioural change unless the consumer overrides it. Bridged into
   * Tailwind's `--font-display`. Named `font-display-stack` to avoid the
   * `prefix(maz)` self-cycle.
   */
  'font-display-stack'?: string
  /**
   * Transition durations. Bridged into Tailwind's `--duration-fast`,
   * `--duration-normal`, `--duration-slow`. Named `motion-*` (not
   * `duration-*`) to avoid the `prefix(maz)` self-cycle.
   */
  'motion-fast'?: Duration
  'motion-normal'?: Duration
  'motion-slow'?: Duration
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
  /**
   * Cursor of the interactive controls (buttons, checkboxes, radios, switches,
   * selects, sidebar items…). Links keep the pointer. Desktop platform presets
   * set `'default'`: native controls keep the arrow cursor.
   * @default 'pointer'
   */
  'interactive-cursor'?: string
  /**
   * Base spacing unit. Tailwind multiplies this for every `p-N`, `m-N`,
   * `gap-N`, etc. Bridged into Tailwind's `--spacing` token.
   * @default '0.25rem'
   */
  'space'?: SizeUnit
}

/**
 * Rounded / shadow scales. Bridged into Tailwind v4 via `@theme inline` so the
 * consumer's own utilities benefit too (e.g. `rounded-md`, `shadow-lg`).
 *
 * Single-value design tokens (`space`, `base-font-size`, `border-width`, …)
 * live on `foundation` instead — only true multi-step scales belong here.
 */
/**
 * Rounded scale keys. `md` is the anchor — every preset must declare it.
 * The other keys can be left undefined and the CSS generator will emit
 * a `calc(var(--maz-rounded-md) * <ratio>)` fallback so the whole scale
 * tracks `md` automatically.
 */
export type RoundedScaleKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

/**
 * Derivation of the 50..950 steps of the brand colors (`primary`, `secondary`,
 * `accent`, `info`, `success`, `warning`, `destructive`).
 *
 * - `relative`: fixed lightness offsets from the base. Collapses to white or
 *   black with a very light or very dark base.
 * - `perceptual`: each step travels a share of the way between the base and a
 *   light or dark bound, with a lower chroma at the ends. The scale keeps its
 *   order and its hue whatever the base.
 *
 * `surface`, `foreground`, `contrast` and `divider` always use `relative`.
 */
export type ColorScaleMode = 'relative' | 'perceptual'

export interface ThemeScales {
  /**
   * Border-radius scale. Maps to Tailwind utilities `rounded-{key}` and is
   * emitted as `--maz-rounded-{key}` (the name is decoupled from Tailwind's
   * `--radius-*` to avoid prefix collisions in `prefix(maz)` setups).
   * `full` is intentionally not included — Tailwind keeps `rounded-full`
   * at 9999px regardless.
   *
   * Only `md` is required; missing keys are computed at CSS-generation time
   * as `calc(var(--maz-rounded-md) * <DEFAULT_ROUNDED_RATIOS[key]>)`. Set
   * any other key to override that key's fallback with a literal value.
   */
  rounded: { md: SizeUnit } & Partial<Record<Exclude<RoundedScaleKey, 'md'>, SizeUnit>>
  /**
   * Box-shadow scale. Maps to Tailwind utilities `shadow-{key}`. `elevation`
   * is the maz-ui specific elevated-surface shadow used by MazCard,
   * MazContainer, MazPopover, etc.
   */
  shadow: Record<'sm' | 'md' | 'lg' | 'xl' | 'elevation', string>
  /**
   * Derivation of the 50..950 steps of the brand colors.
   * @default 'relative'
   */
  color?: ColorScaleMode
}

/**
 * Optional, per-mode background overrides for "container" surfaces — defaults
 * to `var(--maz-surface)` light, and a relative-color-syntax tint derived
 * from `--maz-surface` (one OKLCh lightness tier above) for dark.
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
    'bg'?: ThemeComponentBg
    /**
     * Font-weight applied on `.m-input`'s top-label when `top-label` prop is set. Defaults to '600'.
     */
    'top-label-font-weight'?: string
  }
  /**
   * Translucent material ("glass") of the floating surfaces: sidebars, toolbars,
   * popovers and menus over a blurred background. Used by the `glass` utility
   * and the `bg-glass` / `border-glass` colors. Falls back to the container
   * background when the user reduces transparency (system setting or the
   * `reduce-transparency` class on an ancestor).
   */
  glass?: {
    /**
     * Background of the material, usually translucent.
     * Defaults to the container background at 72% opacity.
     */
    bg?: ThemeComponentBg
    /**
     * Hairline edge drawn around the material.
     * Defaults to the divider color.
     */
    border?: ThemeComponentBg
    /**
     * Blur radius of the backdrop. `'0px'` turns the blur off (platforms without
     * a blurred material).
     * @default '24px'
     */
    blur?: SizeUnit
    /**
     * Saturation of the backdrop, as a `saturate()` factor.
     * @default '1.4'
     */
    saturate?: string
  }
  /**
   * Dialog sizing on tablet and up (`MazDialog`). Both values map to
   * `--maz-dialog-max-width` / `--maz-dialog-min-width` and are consumed by
   * the component through `var(--maz-dialog-max-width, 38rem)` /
   * `var(--maz-dialog-min-width, 32rem)`. The `max-width` / `min-width` props
   * on `MazDialog` still override the preset per instance.
   */
  dialog?: {
    /**
     * Max-width of the dialog. Defaults to `'38rem'` (anchored on a 14px
     * `base-font-size`).
     */
    'max-width'?: SizeUnit
    /**
     * Min-width of the dialog. Defaults to `'32rem'` (anchored on a 14px
     * `base-font-size`).
     */
    'min-width'?: SizeUnit
  }
}

/** Levels of the type scale: one `text-<level>` utility each (`text-title-2`, `text-caption`...) */
export type TypographyLevel
  = | 'display'
    | 'title-1'
    | 'title-2'
    | 'title-3'
    | 'title-4'
    | 'body-lg'
    | 'body'
    | 'body-sm'
    | 'label'
    | 'caption'
    | 'overline'
    | 'code'

/**
 * Values of a level of the type scale, emitted as `--maz-typography-<level>-<key>`.
 * A missing key keeps the default of the `text-<level>` utility.
 */
export interface TypographyLevelTokens {
  /** Font stack, e.g. `var(--maz-font-display-stack)` */
  font?: string
  /** Font size, e.g. `'1.5rem'` or `'clamp(2rem, 1.5rem + 2vw, 3rem)'` */
  size?: string
  /** Font weight, e.g. `'600'` */
  weight?: string
  /** Line height, e.g. `'1.3'` */
  leading?: string
  /** Letter spacing, e.g. `'-0.01em'` */
  tracking?: string
  /** Text color, only used by `caption` (muted by default) */
  color?: CSSColor
}

/** Type scale of the preset, by level. See {@link TypographyLevel}. */
export type ThemeTypography = Partial<Record<TypographyLevel, TypographyLevelTokens>>

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
   * Theme scales (rounded, shadow, color)
   * @default undefined
   */
  scales?: {
    rounded?: Partial<ThemeScales['rounded']>
    shadow?: Partial<ThemeScales['shadow']>
    color?: ColorScaleMode
  }

  /**
   * Theme component-level overrides
   * @default undefined
   */
  components?: ThemeComponents

  /**
   * Type scale overrides, by level
   * @default undefined
   */
  typography?: ThemeTypography

  /**
   * System colors of the platform, by color role
   * @default undefined
   */
  systemColors?: ThemeSystemColors
}

/**
 * System color keywords of the platform, by color role: `AccentColor`,
 * `Canvas`, or the WebKit keywords of macOS (`-apple-system-control-accent`,
 * `-apple-system-label`…). Each keyword replaces the color of its role only
 * where the browser supports it (`@supports`), so the color of `colors` stays
 * the fallback everywhere else. A system color follows the color scheme by
 * itself: one keyword serves the light and the dark mode.
 */
export type ThemeSystemColors = Partial<Record<keyof ThemeColors, string>>

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
  /**
   * Type scale (`text-display`, `text-title-1`... `text-caption`). Each level
   * keeps the defaults of maz-ui for the keys it does not set.
   */
  typography?: ThemeTypography
  /**
   * System colors of the platform (user accent, labels, separators), applied
   * where the browser supports them. See {@link ThemeSystemColors}.
   */
  systemColors?: ThemeSystemColors
}

export type ThemePresetName = 'mazUi' | 'ocean' | 'pristine' | 'obsidian' | 'nova' | 'folio' | 'macos' | 'windows' | 'linux' | 'maz-ui'

export type ColorMode = 'light' | 'dark' | 'auto'

export type ThemeMode = 'light' | 'dark' | 'both'

/**
 * Dark mode strategy.
 *
 * - `'class'`: A `.dark` or `.light` class on `<html>` forces `color-scheme: only dark|only light`.
 *   `setColorMode()` adds/removes the class. With no class, `color-scheme: light dark` lets the
 *   browser follow the system preference.
 * - `'media'`: Only `color-scheme: light dark` on `:root`. The browser follows `prefers-color-scheme`.
 *   `setColorMode()` updates the cookie but does NOT toggle any class — system preference always wins.
 */
export type DarkModeStrategy = 'class' | 'media'

export type Strategy = 'runtime' | 'buildtime'

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
   * - `runtime`: CSS generated and injected at runtime (recommended).
   * - `buildtime`: CSS generated at build time and included in bundle —
   *   nothing is injected at runtime.
   * @default 'runtime'
   */
  strategy?: Strategy

  /**
   * Dark mode class
   * @description Class added to the document root when dark mode is active
   * @default 'dark'
   */
  darkClass?: string

  /**
   * Light mode class
   * @description Class added to the document root when light mode is explicitly forced.
   * Mirror of `darkClass` — used when `colorMode === 'light'` to force `color-scheme: only light`,
   * which prevents the browser from switching to dark via system preference.
   * @default 'light'
   */
  lightClass?: string

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

  /**
   * Persist the active preset name in the `maz-preset` cookie so the
   * user's last-used theme is restored across reloads. The value is
   * read at boot only when `preset` is not provided, and is written
   * after every successful preset resolution and `updateTheme()` call.
   * Set to `false` to opt out of any cookie read or write.
   * @default true
   */
  persistPreset?: boolean
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
   * @values 'runtime', 'buildtime'
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
  /**
   * Light class
   * @description The class added to the document root when light mode is explicitly forced.
   */
  lightClass: string
  /**
   * Whether the active preset name is persisted in the `maz-preset` cookie.
   */
  persistPreset: boolean
  /**
   * Name of the preset configured in the app, the identity of the `maz-preset` cookie (`<presetBase>:<active>`)
   * @internal
   */
  presetBase?: string
}
