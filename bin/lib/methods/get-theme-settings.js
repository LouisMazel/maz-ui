const defaultTheme = require('./../_constantes/default-colors')

module.exports = (opts) => {
  return {
    mainColors: {
      ...defaultTheme.mainColors,
      ...opts.mainColors
    },
    typo: {
      ...defaultTheme.typo,
      ...opts.typo
    },
    border: {
      ...defaultTheme.border,
      ...opts.border
    },
    light: {
      typo: {
        ...defaultTheme.light.typo,
        ...(opts.light ? opts.light.typo : {})
      },
      layout: {
        ...defaultTheme.light.layout,
        ...(opts.light ? opts.light.layout : {})
      },
      state: {
        ...defaultTheme.light.state,
        ...(opts.light ? opts.light.state : {})
      },
      borderColor: {
        ...defaultTheme.light.borderColor,
        ...(opts.light ? opts.light.borderColor : {})
      }
    },
    dark: {
      typo: {
        ...defaultTheme.dark.typo,
        ...(opts.dark ? opts.dark.typo : {})
      },
      layout: {
        ...defaultTheme.dark.layout,
        ...(opts.dark ? opts.dark.layout : {})
      },
      state: {
        ...defaultTheme.dark.state,
        ...(opts.dark ? opts.dark.state : {})
      },
      borderColor: {
        ...defaultTheme.dark.borderColor,
        ...(opts.dark ? opts.dark.borderColor : {})
      }
    },
    breakpoints: {
      ...defaultTheme.breakpoints,
      ...opts.breakpoints
    }
  }
}
