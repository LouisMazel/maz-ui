import type { ThemeConfig } from 'tailwindcss/types/config'
import { baseColors, variations, variatingColors } from '../variables/colors'

export function getColors() {
  const colors: Record<keyof typeof variatingColors & keyof typeof baseColors, string> = {
    ...baseColors,
  }

  for (const color of Object.keys(variatingColors)) {
    colors[color] = variations.reduce(
      (colorVariations, variation) => {
        colorVariations[variation] =
          variation === 'DEFAULT'
            ? `var(--maz-color-${color})`
            : `var(--maz-color-${color}-${variation})`
        return colorVariations
      },
      {} as Record<string, string>,
    )
  }

  return colors satisfies ThemeConfig['colors']
}
