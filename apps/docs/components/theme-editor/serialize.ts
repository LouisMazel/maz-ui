import type { ThemePresetOverrides } from '@maz-ui/themes'
import type { EditorPreset } from './presets'

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function diffValue(base: unknown, draft: unknown): unknown {
  if (!isPlainObject(draft)) {
    return draft === base
      ? undefined
      : draft
  }

  const result: PlainObject = {}
  for (const [key, value] of Object.entries(draft)) {
    const changed = diffValue(isPlainObject(base)
      ? base[key]
      : undefined, value)
    if (changed !== undefined)
      result[key] = changed
  }

  return Object.keys(result).length > 0
    ? result
    : undefined
}

/** The values of `draft` that differ from `base`, as preset overrides (without `name`) */
export function diffPreset(base: PlainObject, draft: PlainObject): ThemePresetOverrides {
  const { name: _name, ...rest } = draft

  return (diffValue(base, rest) ?? {}) as ThemePresetOverrides
}

export function countChanges(value: unknown): number {
  return isPlainObject(value)
    ? Object.values(value).reduce<number>((total, item) => total + countChanges(item), 0)
    : 1
}

export function getAt(source: unknown, path: readonly string[]): unknown {
  return path.reduce<unknown>((value, key) => isPlainObject(value)
    ? value[key]
    : undefined, source)
}

export function setAt(target: PlainObject, path: readonly string[], value: unknown): void {
  const parents = path.slice(0, -1)
  const key = path.at(-1)!
  let cursor = target
  for (const segment of parents) {
    if (!isPlainObject(cursor[segment]))
      cursor[segment] = {}
    cursor = cursor[segment] as PlainObject
  }

  if (value === undefined)
    delete cursor[key]
  else
    cursor[key] = value
}

export function clonePlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const IDENTIFIER = /^[a-z_$][\w$]*$/i

function literal(value: unknown, depth: number): string {
  if (!isPlainObject(value))
    return `'${String(value).replaceAll('\\', '\\\\').replaceAll('\'', '\\\'')}'`

  const keys = Object.keys(value)
  if (keys.length === 0)
    return '{}'

  const quoted = keys.some(key => !IDENTIFIER.test(key))
  const pad = '  '.repeat(depth)
  const lines = keys.map(key => `${pad}  ${quoted
    ? `'${key}'`
    : key}: ${literal(value[key], depth + 1)},`)

  return `{\n${lines.join('\n')}\n${pad}}`
}

export type ExportFormat = 'vue' | 'nuxt' | 'preset'

export function toCamelCase(value: string): string {
  const words = value.trim().toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  const camel = words.map((word, index) => index === 0
    ? word
    : word[0]!.toUpperCase() + word.slice(1)).join('')

  return /^[a-z]/.test(camel)
    ? camel
    : `theme${camel}`
}

export function exportCode({ format, base, overrides, name }: {
  format: ExportFormat
  base: EditorPreset
  overrides: ThemePresetOverrides
  name: string
}): string {
  const importBase = `import { ${base.importName} } from '@maz-ui/themes/presets/${base.importName}'`

  if (format === 'nuxt') {
    return `export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    theme: {
      preset: '${base.preset.name}',
      overrides: ${literal(overrides, 3)},
    },
  },
})
`
  }

  if (format === 'vue') {
    return `import { ${base.importName} } from '@maz-ui/themes/presets/${base.importName}'
import { MazUi } from 'maz-ui/plugins/maz-ui'

app.use(MazUi, {
  theme: {
    preset: ${base.importName},
    overrides: ${literal(overrides, 2)},
  },
})
`
  }

  const variable = `${toCamelCase(name || 'brand')}Preset`

  return `import { definePreset } from '@maz-ui/themes'
${importBase}

export const ${variable} = definePreset({
  base: ${base.importName},
  overrides: ${literal({ name: name || 'brand', ...overrides }, 1)},
})

// app.use(MazUi, { theme: { preset: ${variable} } })
`
}
