import type { ThemeColors, ThemePreset, ThemePresetOverrides } from '../types'

export function mergePresets(base: ThemePreset, overrides: ThemePresetOverrides): ThemePreset {
  return {
    name: overrides.name || base.name,
    foundation: {
      ...base.foundation,
      ...overrides.foundation,
    },
    colors: {
      light: mergeColors(base.colors.light, overrides.colors?.light),
      dark: mergeColors(base.colors.dark, overrides.colors?.dark),
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

export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (sourceValue !== undefined) {
      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      }
      else {
        result[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
