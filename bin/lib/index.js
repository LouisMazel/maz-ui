const { isColorName, colorNameToHex, shadeColor, hexToRgba } = require('color-transformer-ui')
const generateRootCss = require('./methods/generate-root-css')

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

const getStateVariants = (color, dark) => {
  if (isColorName(color)) color = colorNameToHex(color)
  const darken = dark ? shadeColor(color, 15) : shadeColor(color, -10)

  return [color, darken]
}

module.exports = (prefix, theme, output) => {
  if (!prefix) throw new Error('The "prefix" should be defined')
  if (!output) throw new Error('No "output" found in maz-ui.config.js - Ex: "output: ./assets/root-vars.css"')
  if (!theme || !Object.keys(theme).length) throw new Error('No colors provided in maz-ui-config.js - Ex: "{ theme: { mainColors: { primary: "red" } } }"')

  const results = {
    light: {},
    dark: {}
  }

  /**
   * Main Colors
   */
  if (theme.main) {
    Object.entries(theme.main).forEach((values) => {
      const variants = getMainVariants(values[1])
      results.light[`--${prefix}${values[0]}`] = variants[0]
      results.light[`--${prefix}${values[0]}-darken`] = variants[1]
      variants[2].forEach((v) => {
        results.light[`--${prefix}${values[0]}-alpha-${v.coef}`] = v.alpha
      })
    })
  }

  /**
   * Typo base
   */
  if (theme.typo) {
    Object.entries(theme.typo).forEach((values) => {
      results.light[`--${prefix}${values[0]}`] = values[1]
    })
  }

  /**
   * Border
   */
  if (theme.border) {
    Object.entries(theme.border).forEach((values) => {
      results.light[`--${prefix}${values[0]}`] = values[1]
    })
  }

  /**
   * Light
   */
  if (theme.light) {
    if (theme.light.typo) {
      Object.entries(theme.light.typo).forEach((values) => {
        results.light[`--${prefix}${values[0]}`] = values[1]
      })
    }
    if (theme.light.layout) {
      Object.entries(theme.light.layout).forEach((values) => {
        results.light[`--${prefix}${values[0]}`] = values[1]
      })
    }

    if (theme.light.borderColor) {
      Object.entries(theme.light.borderColor).forEach((values) => {
        const variants = getLayoutVariants(values[1])
        results.light[`--${prefix}${values[0]}`] = variants[0]
        results.light[`--${prefix}${values[0]}-darken`] = variants[1]
      })
    }
    if (theme.light.state) {
      Object.entries(theme.light.state).forEach((values) => {
        const variants = getStateVariants(values[1])
        results.light[`--${prefix}${values[0]}`] = variants[0]
        results.light[`--${prefix}${values[0]}-darken`] = variants[1]
      })
    }
  }

  /**
   * Dark
   */
  if (theme.dark) {
    if (theme.dark.typo) {
      Object.entries(theme.dark.typo).forEach((values) => {
        results.dark[`--${prefix}${values[0]}`] = values[1]
      })
    }
    if (theme.dark.layout) {
      Object.entries(theme.dark.layout).forEach((values) => {
        results.dark[`--${prefix}${values[0]}`] = values[1]
      })
    }
    if (theme.dark.borderColor) {
      Object.entries(theme.dark.borderColor).forEach((values) => {
        const variants = getLayoutVariants(values[1])
        results.dark[`--${prefix}${values[0]}`] = variants[0]
        results.dark[`--${prefix}${values[0]}-darken`] = variants[1]
      })
    }
    if (theme.dark.state) {
      Object.entries(theme.dark.state).forEach((values) => {
        const variants = getStateVariants(values[1], true)
        results.dark[`--${prefix}${values[0]}`] = variants[0]
        results.dark[`--${prefix}${values[0]}-darken`] = variants[1]
      })
    }
  }

  generateRootCss(results, output)
  return results
}
