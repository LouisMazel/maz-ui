import type { ThemeConfig } from 'tailwindcss/types/config'
import { baseColors, colorScales, noForegroundColors, scaleColors } from '../variables/colors'

export function getColors(): ThemeConfig['colors'] {
  const colors: ThemeConfig['colors'] = baseColors

  // Générer les couleurs avec échelles complètes
  for (const [colorNameTailwind, variableName] of Object.entries(scaleColors)) {
    const colorVariations = colorScales.reduce((variants, scale) => {
      variants[scale] = `color-mix(in srgb, var(--maz-${variableName}-${scale}) <alpha-value>, transparent)`
      return variants
    }, {} as Record<string, string>)

    colorVariations.DEFAULT = `color-mix(in srgb, var(--maz-${variableName}) <alpha-value>, transparent)`

    if (!noForegroundColors.includes(colorNameTailwind as any)) {
      colorVariations.foreground = `color-mix(in srgb, var(--maz-${variableName}-foreground) <alpha-value>, transparent)`
    }

    colors[colorNameTailwind] = colorVariations
  }

  return colors
}

// Fonction utilitaire pour créer une couleur personnalisée avec échelle
export function createScaleColor(colorName: string) {
  const variants = colorScales.reduce((acc, scale) => {
    acc[scale] = `color-mix(in srgb, var(--maz-${colorName}-${scale}) <alpha-value>, transparent)`
    return acc
  }, {} as Record<string, string>)

  variants.DEFAULT = `color-mix(in srgb, var(--maz-${colorName}) <alpha-value>, transparent)`
  variants.foreground = `color-mix(in srgb, var(--maz-${colorName}-foreground) <alpha-value>, transparent)`

  return variants
}

// Fonction utilitaire pour créer une couleur simple (sans échelle)
export function createSimpleColor(colorName: string, withForeground: boolean = false) {
  const color = `color-mix(in srgb, var(--maz-${colorName}) <alpha-value>, transparent)`

  if (withForeground) {
    return {
      DEFAULT: color,
      foreground: `color-mix(in srgb, var(--maz-${colorName}-foreground) <alpha-value>, transparent)`,
    }
  }

  return color
}
