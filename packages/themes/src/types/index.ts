export type HSL = `${number} ${number}% ${number}%`
export type SizeUnit = `${number}${'rem' | 'px' | 'em' | 'vw' | 'vh' | 'vmin' | 'vmax' | '%'}`

export interface ThemeColors {
  'background': HSL
  'foreground': HSL
  'primary': HSL
  'primary-foreground': HSL
  'secondary': HSL
  'secondary-foreground': HSL
  'accent': HSL
  'accent-foreground': HSL
  'info': HSL
  'info-foreground': HSL
  'contrast': HSL
  'contrast-foreground': HSL
  'destructive': HSL
  'destructive-foreground': HSL
  'success': HSL
  'success-foreground': HSL
  'warning': HSL
  'warning-foreground': HSL
  'overlay': HSL
  'muted': HSL
  'border': HSL
  'shadow': HSL
}

export interface ThemeFoundation {
  'base-font-size'?: SizeUnit
  'radius': SizeUnit
  'border-width': SizeUnit
  'font-family'?: string
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
}

export type ThemePresetName = 'mazUi' | 'ocean' | 'pristine' | 'obsidian' | 'maz-ui'

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
  preset: ThemePreset

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
  currentPreset?: ThemePreset
  colorMode: ColorMode
  mode: ThemeMode
  isDark: boolean
  strategy: Strategy
  darkModeStrategy: DarkModeStrategy
}
