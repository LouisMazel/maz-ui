import type { ThemeColors, ThemeComponents, ThemePreset, ThemePresetOverrides, ThemeScales, ThemeTypography, TypographyLevel } from '../types'

export function mergePresets(base: ThemePreset, overrides: ThemePresetOverrides): ThemePreset {
  return {
    name: overrides.name || base.name,
    foundation: {
      ...base.foundation,
      ...overrides.foundation,
    },
    scales: mergeScales(base.scales, overrides.scales),
    components: mergeComponents(base.components, overrides.components),
    colors: {
      light: mergeColors(base.colors.light, overrides.colors?.light),
      dark: mergeColors(base.colors.dark, overrides.colors?.dark),
    },
    ...((base.typography || overrides.typography) && {
      typography: mergeTypography(base.typography, overrides.typography),
    }),
    ...((base.systemColors || overrides.systemColors) && {
      systemColors: {
        ...base.systemColors,
        ...overrides.systemColors,
      },
    }),
  }
}

function mergeTypography(base?: ThemeTypography, overrides?: ThemeTypography): ThemeTypography {
  const levels = new Set([
    ...Object.keys(base ?? {}),
    ...Object.keys(overrides ?? {}),
  ]) as Set<TypographyLevel>

  return Object.fromEntries([...levels].map(level => [
    level,
    {
      ...base?.[level],
      ...overrides?.[level],
    },
  ]))
}

function mergeScales(base: ThemeScales, overrides?: ThemePresetOverrides['scales']): ThemeScales {
  if (!overrides)
    return base

  const color = overrides.color ?? base.color

  return {
    rounded: {
      ...base.rounded,
      ...overrides.rounded,
    },
    shadow: {
      ...base.shadow,
      ...overrides.shadow,
    },
    ...(color && { color }),
  }
}

function mergeComponents(base?: ThemeComponents, overrides?: ThemeComponents): ThemeComponents | undefined {
  if (!base && !overrides)
    return undefined

  return {
    btn: {
      ...base?.btn,
      ...overrides?.btn,
    },
    container: {
      bg: {
        ...base?.container?.bg,
        ...overrides?.container?.bg,
      },
    },
    input: {
      ...base?.input,
      ...overrides?.input,
      bg: {
        ...base?.input?.bg,
        ...overrides?.input?.bg,
      },
    },
    dialog: {
      ...base?.dialog,
      ...overrides?.dialog,
    },
    ...mergeGlass(base?.glass, overrides?.glass),
  }
}

function mergeGlass(base?: ThemeComponents['glass'], overrides?: ThemeComponents['glass']): Pick<ThemeComponents, 'glass'> {
  if (!base && !overrides)
    return {}

  return {
    glass: {
      ...base,
      ...overrides,
      bg: {
        ...base?.bg,
        ...overrides?.bg,
      },
      border: {
        ...base?.border,
        ...overrides?.border,
      },
    },
  }
}

function mergeColors(base: ThemeColors, overrides?: Partial<ThemeColors>): ThemeColors {
  if (!overrides)
    return base

  return {
    ...base,
    ...overrides,
  }
}

export function deepMerge<
  T extends Record<string, any>,
  S extends Record<string, any>,
>(target: T, source: S): T & S {
  const result = { ...target } as Record<string, any>

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (sourceValue !== undefined) {
      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      }
      else {
        result[key] = sourceValue
      }
    }
  }

  return result as T & S
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
