const { isColorName, colorNameToHex, shadeColor, hexToRgba } = require('color-transformer-ui')
const generateRootCss = require('./methods/generate-root-css')
const setCssVars = require('./methods/set-css-vars')
const getThemeSettings = require('./methods/get-theme-settings')

const getAlpha = (color, coef) => {
  const alpha = color.length === 7 ? hexToRgba(color, coef) : 'transparent'

  const outputCoef = coef * 100 < 10 ? `0${coef * 100}` : coef * 100

  return {
    alpha,
    coef: outputCoef
  }
}

const getMainVariants = (color) => {
  if (isColorName(color)) color = colorNameToHex(color)
  const darken = shadeColor(color, -20)
  const alpha = getAlpha(color, 0.05)
  const alpha5 = getAlpha(color, 0.5)
  const alpha4 = getAlpha(color, 0.4)
  const alpha6 = getAlpha(color, 0.6)

  return [color, darken, [alpha, alpha4, alpha5, alpha6]]
}

const getLayoutVariants = (color) => {
  if (isColorName(color)) color = colorNameToHex(color)
  const darken = shadeColor(color, -10)

  return [color, darken]
}

const getStateVariants = (color) => {
  if (isColorName(color)) color = colorNameToHex(color)
  const darken = shadeColor(color, -20)

  return [color, darken]
}

module.exports = (variables = {}, setVars) => {
  const options = getThemeSettings(variables)

  const results = {
    light: {},
    dark: {}
  }

  /**
   * Main Colors
   */

  Object.entries(options.mainColors).forEach((values) => {
    const variants = getMainVariants(values[1])
    results.light[`--${values[0]}`] = variants[0]
    results.light[`--${values[0]}-darken`] = variants[1]
    variants[2].forEach((v) => {
      results.light[`--${values[0]}-alpha-${v.coef}`] = v.alpha
    })
  })

  /**
   * Typo base
   */

  Object.entries(options.typo).forEach((values) => {
    results.light[`--${values[0]}`] = values[1]
  })

  /**
   * Border
   */

  Object.entries(options.border).forEach((values) => {
    results.light[`--${values[0]}`] = values[1]
  })

  /**
   * Light
   */

  Object.entries(options.light.typo).forEach((values) => {
    results.light[`--${values[0]}`] = values[1]
  })
  Object.entries(options.light.layout).forEach((values) => {
    results.light[`--${values[0]}`] = values[1]
  })

  Object.entries(options.light.borderColor).forEach((values) => {
    const variants = getLayoutVariants(values[1])
    results.light[`--${values[0]}`] = variants[0]
    results.light[`--${values[0]}-darken`] = variants[1]
  })
  Object.entries(options.light.state).forEach((values) => {
    const variants = getStateVariants(values[1])
    results.light[`--${values[0]}`] = variants[0]
    results.light[`--${values[0]}-darken`] = variants[1]
  })

  /**
   * Dark
   */

  Object.entries(options.dark.typo).forEach((values) => {
    results.dark[`--${values[0]}`] = values[1]
  })
  Object.entries(options.dark.layout).forEach((values) => {
    results.dark[`--${values[0]}`] = values[1]
  })
  Object.entries(options.dark.borderColor).forEach((values) => {
    const variants = getLayoutVariants(values[1])
    results.dark[`--${values[0]}`] = variants[0]
    results.dark[`--${values[0]}-darken`] = variants[1]
  })
  Object.entries(options.dark.state).forEach((values) => {
    const variants = getStateVariants(values[1])
    results.dark[`--${values[0]}`] = variants[0]
    results.dark[`--${values[0]}-darken`] = variants[1]
  })

  if (setVars) setCssVars(results)
  else generateRootCss(results)
  return results
}
