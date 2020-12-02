const { isColorName, colorNameToHex, shadeColor, hexToRgba } = require('color-transformer-ui')
const generateRootCss = require('./generate-root-css')

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

// const getLighDarkShades = (color) => {
//   if (isColorName(color)) color = colorNameToHex(color)
//   const darken = shadeColor(color, -15)
//   const lighten = shadeColor(color, 15)

//   return [lighten, color, darken]
// }

// const setCssVariables = (vars) => {
//   const rootStyle = document.documentElement.style

//   Object.entries(vars).forEach((values) => {
//     rootStyle.setProperty(values[0], values[1])
//   })
// }

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
    dark: '#21222E',
    grey: '#999999',
    default: '#CCCCCC',
    black: 'black',
    white: 'white',
    transparent: '#FFFFFF00',
    disabled: '#F2F2F2'
  },
  border: {
    'border-width': '2px',
    'border-radius': '8px'
  },
  light: {
    typo: {
      'text-color': '#212121',
      'muted-color': 'rgba(0, 0, 0, .54)',
      'placeholder-color': '#A7A7A7',
      'icon-color': '#DEDEDE'
    },
    layout: {
      'bg-color': 'white',
      'bg-color-light': '#F2F2F2',
      'overlay-color': 'rgba(86, 87, 117, .7)'
    },
    borderColor: {
      'border-color': '#EEEEEE',
    },
    state: {
      'hover-color': '#F2F2F2',
      'disabled-color': '#F2F2F2'
    },
  },
  dark: {
    typo: {
      'text-color': '#EEEEEE',
      'muted-color': 'rgba(255, 255, 255, .54)',
      'placeholder-color': 'rgba(255, 255, 255, .6)',
      'icon-color': '#65678F'
    },
    layout: {
      'bg-color': '#21222E',
      'bg-color-light': '#303144',
      'overlay-color': 'rgba(86, 87, 117, .7)'
    },
    borderColor: {
      'border-color': '#3B3C53',
    },
    state: {
      'hover-color': '#2E2F40',
      'disabled-color': '#CCCCCC'
    }
  },
  breakpoints: {
    'mobile-s': '320px',
    'mobile-m': '375px',
    'mobile-l': '425px',
    'tablet': '768px',
    'laptop-s': '1024px',
    'laptop-m': '1280px',
    'laptop-l': '1440px',
    '4k': '1920px',
  }
}

const getOptions = (opts) => {
  return {
    mainColors: {
      ...defaultOptions.mainColors,
      ...opts.mainColors
    },
    border: {
      ...defaultOptions.border,
      ...opts.border
    },
    light: {
      typo: {
        ...defaultOptions.light.typo,
        ...(opts.light ? opts.light.typo : {})
      },
      layout: {
        ...defaultOptions.light.layout,
        ...(opts.light ? opts.light.layout : {})
      },
      state: {
        ...defaultOptions.light.state,
        ...(opts.light ? opts.light.state : {})
      },
      borderColor: {
        ...defaultOptions.light.borderColor,
        ...(opts.light ? opts.light.borderColor : {})
      },
    },
    dark: {
      typo: {
        ...defaultOptions.dark.typo,
        ...(opts.dark ? opts.dark.typo : {})
      },
      layout: {
        ...defaultOptions.dark.layout,
        ...(opts.dark ? opts.dark.layout : {})
      },
      state: {
        ...defaultOptions.dark.state,
        ...(opts.dark ? opts.dark.state : {})
      },
      borderColor: {
        ...defaultOptions.dark.borderColor,
        ...(opts.dark ? opts.dark.borderColor : {})
      },
    },
    breakpoints: {
      ...defaultOptions.breakpoints,
      ...opts.breakpoints
    }
  }
}

const builder = (opts = {}) => {
  const options = getOptions(opts)

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
  console.log('options', options)
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

  /**
   * Breakpoints
   */

  Object.entries(options.breakpoints).forEach((values) => {
    results.light[`--breakpoint-${values[0]}`] = values[1]
  })

  console.log(results)
  // setCssVariables(results)
  generateRootCss(results)
  return results
}

builder()

exports = defaultOptions
