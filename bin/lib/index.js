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

const getStateVariants = (color) => {
  if (isColorName(color)) color = colorNameToHex(color)
  const darken = shadeColor(color, -20)

  return [color, darken]
}

module.exports = (colors, output) => {
  if (!colors || !Object.keys(colors).length) throw new Error('No colors provided in maz-ui-config.js - Ex: "{ mainColors: { primary: "red" } }"')
  if (!output) throw new Error('No "output" found in maz-ui.config.js - Ex: "output: ./assets/root-vars.css"')

  const results = {
    light: {},
    dark: {}
  }

  /**
   * Main Colors
   */
  if (colors.main) {
    Object.entries(colors.main).forEach((values) => {
      const variants = getMainVariants(values[1])
      results.light[`--${values[0]}`] = variants[0]
      results.light[`--${values[0]}-darken`] = variants[1]
      variants[2].forEach((v) => {
        results.light[`--${values[0]}-alpha-${v.coef}`] = v.alpha
      })
    })
  }

  /**
   * Typo base
   */
  if (colors.typo) {
    Object.entries(colors.typo).forEach((values) => {
      results.light[`--${values[0]}`] = values[1]
    })
  }

  /**
   * Border
   */
  if (colors.border) {
    Object.entries(colors.border).forEach((values) => {
      results.light[`--${values[0]}`] = values[1]
    })
  }

  /**
   * Light
   */
  if (colors.light) {
    if (colors.light.typo) {
      Object.entries(colors.light.typo).forEach((values) => {
        results.light[`--${values[0]}`] = values[1]
      })
    }
    if (colors.light.layout) {
      Object.entries(colors.light.layout).forEach((values) => {
        results.light[`--${values[0]}`] = values[1]
      })
    }

    if (colors.light.borderColor) {
      Object.entries(colors.light.borderColor).forEach((values) => {
        const variants = getLayoutVariants(values[1])
        results.light[`--${values[0]}`] = variants[0]
        results.light[`--${values[0]}-darken`] = variants[1]
      })
    }
    if (colors.light.state) {
      Object.entries(colors.light.state).forEach((values) => {
        const variants = getStateVariants(values[1])
        results.light[`--${values[0]}`] = variants[0]
        results.light[`--${values[0]}-darken`] = variants[1]
      })
    }
  }

  /**
   * Dark
   */
  if (colors.dark) {
    if (colors.dark.typo) {
      Object.entries(colors.dark.typo).forEach((values) => {
        results.dark[`--${values[0]}`] = values[1]
      })
    }
    if (colors.dark.layout) {
      Object.entries(colors.dark.layout).forEach((values) => {
        results.dark[`--${values[0]}`] = values[1]
      })
    }
    if (colors.dark.borderColor) {
      Object.entries(colors.dark.borderColor).forEach((values) => {
        const variants = getLayoutVariants(values[1])
        results.dark[`--${values[0]}`] = variants[0]
        results.dark[`--${values[0]}-darken`] = variants[1]
      })
    }
    if (colors.dark.state) {
      Object.entries(colors.dark.state).forEach((values) => {
        const variants = getStateVariants(values[1])
        results.dark[`--${values[0]}`] = variants[0]
        results.dark[`--${values[0]}-darken`] = variants[1]
      })
    }
  }

  generateRootCss(results, output)
  return results
}
