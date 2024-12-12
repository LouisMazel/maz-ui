import type { ThemeConfig } from 'tailwindcss/types/config'
import { baseColors, variatingColors, variations } from '../variables/colors'

type VariatingColorKeys = keyof typeof variatingColors

export function getColors() {
  const colors: ThemeConfig['colors'] = {
    ...baseColors,
  }

  for (const color of Object.keys(variatingColors) as VariatingColorKeys[]) {
    const colorVariations = variations.reduce(
      (colorVariations, variation) => {
        colorVariations[variation]
          = variation === 'DEFAULT'
            ? `var(--maz-color-${color})`
            : `var(--maz-color-${color}-${variation})`
        return colorVariations
      },
      {} as Record<typeof variations[number], string>,
    )

    colors[color] = colorVariations
  }

  return colors
}
