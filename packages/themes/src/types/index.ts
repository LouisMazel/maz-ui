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

export interface ThemeAppearance {
  'radius': SizeUnit
  'border-width': SizeUnit
  'font-family': string
}

export interface ThemePreset {
  name: string
  colors?: {
    light?: Partial<ThemeColors>
    dark?: Partial<ThemeColors>
  }
  appearance?: Partial<ThemeAppearance>
}

export interface BaseThemePreset extends Required<ThemePreset> {
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  appearance: ThemeAppearance
}

export interface ThemeConfig {
  preset?: BaseThemePreset
  overrides?: ThemePreset
  strategy?: Strategy
  darkModeStrategy?: DarkMode
}

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
}

export type ColorMode = 'light' | 'dark' | 'auto'

export type DarkMode = 'class' | 'media' | 'auto'

export type Strategy = 'runtime' | 'buildtime' | 'hybrid'

export interface ThemeState {
  currentPreset: BaseThemePreset
  colorMode: ColorMode
  isDark: boolean
  strategy: Strategy
  darkModeStrategy: DarkMode
}
