import type { ColorScale } from '../types'

export function parseHSL(hsl: string): { h: number, s: number, l: number } {
  // eslint-disable-next-line sonarjs/slow-regex
  const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
  if (!match) {
    throw new Error(`Invalid HSL format: ${hsl}`)
  }
  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  }
}

export function formatHSL(h: number, s: number, l: number): string {
  const roundedH = Math.round(h * 10) / 10
  const roundedS = Math.round(s * 10) / 10
  const roundedL = Math.round(l * 10) / 10
  return `${roundedH} ${roundedS}% ${roundedL}%`
}

export function generateColorScale(baseColor: string): ColorScale {
  const { h, s, l } = parseHSL(baseColor)

  // Créer une progression linéaire de 95% à 5%
  const lightnessValues = [95, 90, 80, 70, 60, 50, 40, 30, 20, 10]

  // Trouver où placer la couleur de base dans cette progression
  let baseIndex = 5 // par défaut au milieu (index 5 = 50%)

  // Ajuster l'index selon la lightness de la couleur de base
  if (l >= 85)
    baseIndex = 1 // très claire -> 100
  else if (l >= 75)
    baseIndex = 2 // claire -> 200
  else if (l >= 65)
    baseIndex = 3 // assez claire -> 300
  else if (l >= 55)
    baseIndex = 4 // moyen-claire -> 400
  else if (l >= 45)
    baseIndex = 5 // moyenne -> 500
  else if (l >= 35)
    baseIndex = 6 // moyen-sombre -> 600
  else if (l >= 25)
    baseIndex = 7 // sombre -> 700
  else if (l >= 15)
    baseIndex = 8 // très sombre -> 800
  else baseIndex = 9 // ultra sombre -> 900

  // Générer les variants avec la couleur de base à sa position logique
  const variants = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  const scale: any = {}

  variants.forEach((variant, index) => {
    if (index === baseIndex) {
      // Utiliser la couleur de base originale
      scale[variant] = formatHSL(h, s, l)
    }
    else {
      // Générer les autres variants
      const targetLightness = lightnessValues[index]
      const saturationMultiplier = index < 5 ? 0.2 + (index * 0.16) : 1 + ((index - 5) * 0.1)
      const adjustedSaturation = Math.min(100, Math.max(5, s * saturationMultiplier))

      scale[variant] = formatHSL(h, adjustedSaturation, targetLightness)
    }
  })

  return scale as ColorScale
}

export function getContrastColor(baseColor: string): string {
  const { l } = parseHSL(baseColor)
  return l > 50 ? '0 0% 0%' : '0 0% 100%'
}

export function adjustColorLightness(baseColor: string, adjustment: number): string {
  const { h, s, l } = parseHSL(baseColor)
  const newL = Math.max(0, Math.min(100, l + adjustment))
  return formatHSL(h, s, newL)
}
