import type { ThemeColors, ThemeComponents, ThemePreset, ThemePresetOverrides, ThemeScales } from '../types'

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
  }
}

function mergeScales(base: ThemeScales, overrides?: ThemePresetOverrides['scales']): ThemeScales {
  if (!overrides)
    return base

  return {
    rounded: { ...base.rounded, ...overrides.rounded },
    shadow: { ...base.shadow, ...overrides.shadow },
  }
}

function mergeComponents(base?: ThemeComponents, overrides?: ThemeComponents): ThemeComponents | undefined {
  if (!base && !overrides)
    return undefined

  return {
    btn: { ...base?.btn, ...overrides?.btn },
    container: {
      bg: { ...base?.container?.bg, ...overrides?.container?.bg },
    },
    input: {
      bg: { ...base?.input?.bg, ...overrides?.input?.bg },
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
