import type { ColorScale } from '../types'

export function parseHSL(hsl: string): { h: number, s: number, l: number } {
  const match = hsl.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/)
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

// Calculate luminosity offsets relative to base (500)
// These values provide a natural and consistent progression
const LUMINOSITY_OFFSETS = {
  50: +45, // Base + 45% = very light
  100: +40, // Base + 40% = light
  200: +30, // Base + 30% = moderately light
  300: +20, // Base + 20% = light-medium
  400: +10, // Base + 10% = slightly lighter
  500: 0, // Base (original color)
  600: -10, // Base - 10% = slightly darker
  700: -20, // Base - 20% = dark
  800: -30, // Base - 30% = very dark
  900: -40, // Base - 40% = extremely dark
}

// Saturation adjustments to maintain visual consistency
function calculateSaturationMultiplier(baseVariant: number, targetVariant: number, baseSaturation: number): number {
  if (targetVariant === baseVariant) {
    return 1 // Base color unchanged
  }

  const saturationFactor = Math.min(baseSaturation / 100, 1)
  const variantDiff = Math.abs(targetVariant - baseVariant)

  if (targetVariant < baseVariant) {
    // Lighter variants: slightly reduce saturation to avoid garish colors
    const reduction = (variantDiff / 500) * 0.25 * saturationFactor // Max 25% reduction
    return Math.max(0.3, 1 - reduction)
  }
  else {
    // Darker variants: slight increase to maintain richness
    const increase = (variantDiff / 400) * 0.15 * saturationFactor // Max 15% increase
    return Math.min(1.3, 1 + increase)
  }
}

export function generateColorScale(baseColor: string): ColorScale {
  const { h, s, l } = parseHSL(baseColor)

  // Base color ALWAYS corresponds to variant 500
  const baseVariant = 500
  const baseLuminosity = l

  const variants = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  const scale: any = {}

  variants.forEach((variant) => {
    if (variant === baseVariant) {
      // Variant 500 uses exactly the base color
      scale[variant.toString()] = formatHSL(h, s, l)
    }
    else {
      // Calculate target luminosity based on offset
      const luminosityOffset = LUMINOSITY_OFFSETS[variant as keyof typeof LUMINOSITY_OFFSETS]
      let targetLuminosity = baseLuminosity + luminosityOffset

      // Constrain luminosity within acceptable limits
      targetLuminosity = Math.min(95, Math.max(5, targetLuminosity))

      // Intelligently adjust saturation
      const saturationMultiplier = calculateSaturationMultiplier(baseVariant, variant, s)
      const adjustedSaturation = Math.min(100, Math.max(5, s * saturationMultiplier))

      scale[variant.toString()] = formatHSL(h, adjustedSaturation, targetLuminosity)
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
