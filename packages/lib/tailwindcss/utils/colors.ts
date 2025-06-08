import type { ThemeConfig } from 'tailwindcss/types/config'
import { baseColors, colorScales, scaleColors } from '../variables/colors'

export function getColors(): ThemeConfig['colors'] {
  const colors: ThemeConfig['colors'] = {
    ...baseColors,
  }

  // Générer les couleurs avec échelles complètes
  for (const [colorNameTailwind, variableName] of Object.entries(scaleColors)) {
    const colorVariations = colorScales.reduce((variants, scale) => {
      variants[scale] = `hsl(var(--maz-${variableName}-${scale}) / <alpha-value>)`
      return variants
    }, {} as Record<string, string>)

    // Ajouter DEFAULT qui pointe vers 500
    colorVariations.DEFAULT = `hsl(var(--maz-${variableName}) / <alpha-value>)`

    // Ajouter foreground pour chaque couleur
    colorVariations.foreground = `hsl(var(--maz-${variableName}-foreground) / <alpha-value>)`

    colors[colorNameTailwind] = colorVariations
  }

  return colors
}

// Fonction utilitaire pour créer une couleur personnalisée avec échelle
export function createScaleColor(colorName: string) {
  const variants = colorScales.reduce((acc, scale) => {
    acc[scale] = `hsl(var(--maz-${colorName}-${scale}) / <alpha-value>)`
    return acc
  }, {} as Record<string, string>)

  variants.DEFAULT = `hsl(var(--maz-${colorName}) / <alpha-value>)`
  variants.foreground = `hsl(var(--maz-${colorName}-foreground) / <alpha-value>)`

  return variants
}

// Fonction utilitaire pour créer une couleur simple (sans échelle)
export function createSimpleColor(colorName: string, withForeground: boolean = false) {
  const color = `hsl(var(--maz-${colorName}) / <alpha-value>)`

  if (withForeground) {
    return {
      DEFAULT: color,
      foreground: `hsl(var(--maz-${colorName}-foreground) / <alpha-value>)`,
    }
  }

  return color
}
