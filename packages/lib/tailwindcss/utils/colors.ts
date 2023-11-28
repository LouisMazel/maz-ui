import type { ThemeConfig } from 'tailwindcss/types/config'
import { baseColors, variations, variatingColors } from '../variables/colors'

export function getColors() {
  const colors = {
    ...baseColors,
  }

  for (const color of Object.keys(variatingColors)) {
    colors[color] = variations.reduce((colorVariations, variation) => {
      colorVariations[variation] =
        variation === 'DEFAULT'
          ? `var(--maz-color-${color})`
          : `var(--maz-color-${color}-${variation})`
      return colorVariations
    }, {})
  }

  return colors satisfies ThemeConfig['colors']
}
