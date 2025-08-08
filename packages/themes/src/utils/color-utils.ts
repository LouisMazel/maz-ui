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

const LUMINOSITY_OFFSETS = {
  50: +37.5,
  100: +30,
  200: +22.5,
  300: +15,
  400: +7.5,
  500: 0,
  600: -7.5,
  700: -15,
  800: -22.5,
  900: -30,
  950: -37.5,
} as const

function calculateSaturationMultiplier(baseVariant: number, targetVariant: number, baseSaturation: number): number {
  if (targetVariant === baseVariant) {
    return 1
  }

  const saturationFactor = Math.min(baseSaturation / 100, 1)
  const variantDiff = Math.abs(targetVariant - baseVariant)

  if (targetVariant < baseVariant) {
    const reduction = (variantDiff / 500) * 0.25 * saturationFactor
    return Math.max(0.3, 1 - reduction)
  }
  else {
    const increase = (variantDiff / 400) * 0.15 * saturationFactor
    return Math.min(1.3, 1 + increase)
  }
}

export function generateColorScale(baseColor: string): ColorScale {
  const { h, s, l } = parseHSL(baseColor)

  const baseVariant = 500
  const baseLuminosity = l

  const variants = Object.keys(LUMINOSITY_OFFSETS).map(Number) as (keyof typeof LUMINOSITY_OFFSETS)[]
  const scale: Partial<ColorScale> = {}

  variants.forEach((variant) => {
    if (variant === baseVariant) {
      scale[variant] = formatHSL(h, s, l)
    }
    else {
      const isUnderBase = variant < baseVariant
      const isOverBase = variant > baseVariant

      const luminosityOffset = LUMINOSITY_OFFSETS[variant as keyof typeof LUMINOSITY_OFFSETS]
      let targetLuminosity: number | undefined

      if (isUnderBase && l >= 100) {
        targetLuminosity = baseLuminosity
      }
      else {
        targetLuminosity = baseLuminosity + luminosityOffset
      }

      if (isOverBase && l <= 0) {
        targetLuminosity = 0
      }

      targetLuminosity = Math.min(100, Math.max(0, targetLuminosity))

      const saturationMultiplier = calculateSaturationMultiplier(baseVariant, variant, s)
      const adjustedSaturation = Math.min(100, Math.max(5, s * saturationMultiplier))

      scale[variant] = formatHSL(h, adjustedSaturation, targetLuminosity)
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
