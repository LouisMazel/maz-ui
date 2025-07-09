import type {
  MazUiConfig,
  OutputColorVariant,
  VariantColor,
  VariantColors,
} from '../../types'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import tinycolor from 'tinycolor2'
import { generateColorVariants } from './colors'
import { defaultMazUiConfig } from './default-maz-ui.config'

function getVariable({ key, value }: { key: string, value: string }) {
  return `  --maz-${key}: ${value};\n`
}

export function getVariantColorsCSSVariables(colors: VariantColors) {
  let variables = ''

  for (const key in colors) {
    const color = colors[key as keyof VariantColors]

    for (const shade in color) {
      const value = color[shade as keyof OutputColorVariant]
      variables
        += shade === 'base'
          ? getVariable({ key: `color-${key}`, value })
          : getVariable({ key: `color-${key}-${shade}`, value })
    }

    variables += '\n'
  }

  return variables
}

function getVariablesInRoot(variables: string[]) {
  let css = ':root {\n'

  for (const variable of variables) {
    css += variable
  }
  css += '}\n'

  return css
}

function getFontFamily(config: MazUiConfig) {
  const fontFamily = config.theme.fontFamily
    ? `${config.theme.fontFamily}, ${defaultMazUiConfig.theme.fontFamily}`
    : defaultMazUiConfig.theme.fontFamily
  return typeof config.theme.fontFamily === 'string'
    ? fontFamily
    : undefined
}

// eslint-disable-next-line complexity
function getNormalCSSVariables(config: MazUiConfig) {
  const normalVariables = [
    {
      key: 'color-text-light',
      value: config.theme.colors.lightTheme?.textColor
        ? tinycolor(config.theme.colors.lightTheme?.textColor).toHslString()
        : undefined,
    },
    {
      key: 'color-muted-light',
      value: config.theme.colors.lightTheme?.colorMuted
        ? tinycolor(config.theme.colors.lightTheme?.colorMuted).toHslString()
        : undefined,
    },
    ...(config.theme.colors.lightTheme?.bgColor
      ? [
          {
            key: 'bg-color-light',
            value: tinycolor(config.theme.colors.lightTheme?.bgColor).toHslString(),
          },
          {
            key: 'bg-color-light-light',
            value: tinycolor(config.theme.colors.lightTheme?.bgColor).darken(3.75).toHslString(),
          },
          {
            key: 'bg-color-light-lighter',
            value: tinycolor(config.theme.colors.lightTheme?.bgColor).darken(7.5).toHslString(),
          },
          {
            key: 'bg-color-light-dark',
            value: tinycolor(config.theme.colors.lightTheme?.bgColor).darken(11.5).toHslString(),
          },
          {
            key: 'bg-color-light-darker',
            value: tinycolor(config.theme.colors.lightTheme?.bgColor).darken(15.5).toHslString(),
          },
        ]
      : []),
    {
      key: 'color-text-dark',
      value: config.theme.colors.darkTheme?.textColor
        ? tinycolor(config.theme.colors.darkTheme?.textColor).toHslString()
        : undefined,
    },
    {
      key: 'color-muted-dark',
      value: config.theme.colors.darkTheme?.textColor
        ? tinycolor(config.theme.colors.darkTheme?.colorMuted).toHslString()
        : undefined,
    },
    ...(config.theme.colors.darkTheme?.bgColor
      ? [
          {
            key: 'bg-color-dark',
            value: tinycolor(config.theme.colors.darkTheme?.bgColor).toHslString(),
          },
          {
            key: 'bg-color-dark-light',
            value: tinycolor(config.theme.colors.darkTheme?.bgColor).lighten(3.75).toHslString(),
          },
          {
            key: 'bg-color-dark-lighter',
            value: tinycolor(config.theme.colors.darkTheme?.bgColor).lighten(7.5).toHslString(),
          },
          {
            key: 'bg-color-dark-dark',
            value: tinycolor(config.theme.colors.darkTheme?.bgColor).darken(3.75).toHslString(),
          },
          {
            key: 'bg-color-dark-darker',
            value: tinycolor(config.theme.colors.darkTheme?.bgColor).darken(7.5).toHslString(),
          },
        ]
      : []),
    {
      key: 'bg-overlay',
      value: config.theme.colors.bgOverlay
        ? tinycolor(config.theme.colors.bgOverlay).toHslString()
        : undefined,
    },
    { key: 'border-width', value: config.theme.borderWidth },
    { key: 'border-color', value: config.theme.borderColor },
    { key: 'border-radius', value: config.theme.borderRadius },
    {
      key: 'font-family',
      value: getFontFamily(config),
    },
  ]

  let normalVariablesCss: string = ''

  for (const { key, value } of normalVariables) {
    if (!value) {
      continue
    }

    normalVariablesCss += getVariable({ key, value })
  }

  return normalVariablesCss
}

export async function generateCssFile({
  config,
  outputCssFilePath,
}: {
  config: MazUiConfig
  outputCssFilePath: string
}) {
  if (!config.theme.colors) {
    throw new Error('No colors found in "config.theme.colors"')
  }

  const variantColors = Object.keys(config.theme.colors).filter(
    color => !['bgOverlay', 'lightTheme', 'darkTheme'].includes(color),
  ) as VariantColor[]

  const colorsConfig = {} as unknown as VariantColors

  for (const color of variantColors) {
    const variants = generateColorVariants({
      kind: color,
      config,
    })

    colorsConfig[color] = variants
  }
  const css = getVariablesInRoot([
    getVariantColorsCSSVariables(colorsConfig),
    getNormalCSSVariables(config),
  ])

  const outputPath = resolve(process.cwd(), outputCssFilePath)

  await writeFile(outputPath, css)

  return { outputPath, css }
}
