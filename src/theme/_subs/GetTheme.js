import { ShadeColor, HexToRgba, isColorName, colorNameToHex } from 'color-transformer-ui'
import { pascalCaseToKebabCase } from '@/utils'

export default ({ color, lightColor, darkColor, validColor, borderRadius, errorColor, breakPoints }) => {
  const theme = {
    '--maz-text-color': 'black',
    '--maz-text-color-dark': '#F2F2F2',
    '--maz-primary-color': color,
    '--maz-second-color': '#747474',
    '--maz-second-color-dark': 'rgba(255, 255, 255, 0.7)',
    '--maz-third-color': '#CCC',
    '--maz-third-color-dark': 'rgba(255, 255, 255, 0.7)',
    '--maz-bg-color': lightColor,
    '--maz-bg-color-dark': darkColor,
    '--maz-error-color': errorColor,
    '--maz-valid-color': validColor,
    '--maz-hover-color': '#F2F2F2',
    '--maz-hover-color-dark': ShadeColor(darkColor, 40),
    '--maz-muted-color': '#747474',
    '--maz-muted-color-dark': 'rgba(255, 255, 255, 0.3)',
    '--maz-primary-color-transparency': isColorName(color) ? HexToRgba(colorNameToHex(color), 0.7) : HexToRgba(color, 0.7),
    '--maz-error-color-transparency': isColorName(errorColor) ? HexToRgba(colorNameToHex(errorColor), 0.7) : HexToRgba(errorColor, 0.7),
    '--maz-valid-color-transparency': isColorName(validColor) ? HexToRgba(colorNameToHex(validColor), 0.7) : HexToRgba(validColor, 0.7),
    '--maz-border-radius': `${borderRadius}px`
  }
  Object.entries(breakPoints).map(entry => {
    theme[`--maz-${pascalCaseToKebabCase(entry[0])}`] = entry[1]
  })
  return theme
}
