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

module.exports = (theme, output) => {
  if (!output) throw new Error('No "output" found in maz-ui.config.js - Ex: "output: ./assets/root-vars.css"')
  if (!theme || !Object.keys(theme).length) throw new Error('No colors provided in maz-ui-config.js - Ex: "{ theme: { mainColors: { primary: "red" } } }"')

  const results = {
    light: {},
    dark: {}
  }

  /**
   * Main Colors
   */
  if (output.main) {
    Object.entries(output.main).forEach((values) => {
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
  if (output.typo) {
    Object.entries(output.typo).forEach((values) => {
      results.light[`--${values[0]}`] = values[1]
    })
  }

  /**
   * Border
   */
  if (output.border) {
    Object.entries(output.border).forEach((values) => {
      results.light[`--${values[0]}`] = values[1]
    })
  }

  /**
   * Light
   */
  if (output.light) {
    if (output.light.typo) {
      Object.entries(output.light.typo).forEach((values) => {
        results.light[`--${values[0]}`] = values[1]
      })
    }
    if (output.light.layout) {
      Object.entries(output.light.layout).forEach((values) => {
        results.light[`--${values[0]}`] = values[1]
      })
    }

    if (output.light.borderColor) {
      Object.entries(output.light.borderColor).forEach((values) => {
        const variants = getLayoutVariants(values[1])
        results.light[`--${values[0]}`] = variants[0]
        results.light[`--${values[0]}-darken`] = variants[1]
      })
    }
    if (output.light.state) {
      Object.entries(output.light.state).forEach((values) => {
        const variants = getStateVariants(values[1])
        results.light[`--${values[0]}`] = variants[0]
        results.light[`--${values[0]}-darken`] = variants[1]
      })
    }
  }

  /**
   * Dark
   */
  if (output.dark) {
    if (output.dark.typo) {
      Object.entries(output.dark.typo).forEach((values) => {
        results.dark[`--${values[0]}`] = values[1]
      })
    }
    if (output.dark.layout) {
      Object.entries(output.dark.layout).forEach((values) => {
        results.dark[`--${values[0]}`] = values[1]
      })
    }
    if (output.dark.borderColor) {
      Object.entries(output.dark.borderColor).forEach((values) => {
        const variants = getLayoutVariants(values[1])
        results.dark[`--${values[0]}`] = variants[0]
        results.dark[`--${values[0]}-darken`] = variants[1]
      })
    }
    if (output.dark.state) {
      Object.entries(output.dark.state).forEach((values) => {
        const variants = getStateVariants(values[1])
        results.dark[`--${values[0]}`] = variants[0]
        results.dark[`--${values[0]}-darken`] = variants[1]
      })
    }
  }

  generateRootCss(results, output)
  return results
}
