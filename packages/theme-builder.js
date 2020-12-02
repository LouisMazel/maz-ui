import { isColorName, colorNameToHex, shadeColor } from 'color-transformer-ui'

const getColorShades = (color) => {
  if (isColorName(color)) color = colorNameToHex(color)
  const darken = shadeColor(color, -15)

  return [color, darken]
}

const defaultOptions = {
  mainColors: {
    primary: 'dodgerblue',
    secondary: '#1CD1A1',
    third: '#C41AF9',
    danger: 'orangered',
    success: 'yellowgreen',
    info: '#17A2B8',
    warning: '#FFA300',
    light: 'whitesmoke',
    default: '#CCC'
  }
}

export default (opts = {}) => {
  const options = {
    ...opts,
    ...defaultOptions
  }

  const results = {}

  Object.entries(options.mainColors).forEach((values) => {
    const shades = getColorShades(values[1])
    results[`--${values[0]}`] = shades[0]
    results[`--${values[0]}-darken`] = shades[1]
  })
  console.log(results)
}