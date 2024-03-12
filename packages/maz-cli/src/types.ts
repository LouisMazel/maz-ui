export interface MazUiConfig {
  /**
   * Path and name of generate CSS file
   * @example './css/maz-ui-variables.css'
   */
  outputCssFilePath: string
  theme: {
    colors: {
      primary?: string
      secondary?: string
      info?: string
      danger?: string
      success?: string
      warning?: string
      bgOverlay?: string
      lightTheme?: {
        textColor?: string
        colorMuted?: string
        bgColor?: string
      }
      darkTheme?: {
        textColor?: string
        colorMuted?: string
        bgColor?: string
      }
    }
    /**
     * Border color applied to components like: inputs, card, etc
     */
    borderColor?: string
    /**
     * Border width applied to components like: inputs, card, etc
     */
    borderWidth?: string
    /**
     * Radius applied to rounded components like: buttons, inputs, card, etc.
     */
    borderRadius?: string
    fontFamily?: string
  }
}

export type VariantColor = keyof Omit<
  MazUiConfig['theme']['colors'],
  'bgOverlay' | 'lightTheme' | 'darkTheme'
>

export interface OutputColorVariant {
  50: string
  100: string
  200: string
  300: string
  400: string
  base: string
  600: string
  700: string
  800: string
  900: string
  contrast: string
  alpha: string
  'alpha-20': string
  'alpha-10': string
  'alpha-05': string
}

export type VariantColors = Record<VariantColor, OutputColorVariant>
