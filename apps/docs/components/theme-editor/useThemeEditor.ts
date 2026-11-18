import type { ThemePreset, ThemePresetOverrides } from '@maz-ui/themes'
import type { InjectionKey } from 'vue'
import { mergePresets } from '@maz-ui/themes/utils/preset-merger'
import { getContrastRatio, resolvePreset } from '@maz-ui/themes/utils/resolve-preset'
import { computed, inject, provide, ref } from 'vue'
import { findEditorPreset } from './presets'
import { clonePlain, countChanges, diffPreset, getAt, setAt } from './serialize'

export type EditorPath = readonly string[]

export type ColorMode = 'light' | 'dark'

export interface SavedTheme {
  base: string
  name: string
  overrides: ThemePresetOverrides
}

function asRecord(value: object): Record<string, unknown> {
  return value as Record<string, unknown>
}

function createThemeEditor(initialBase: string) {
  const baseName = ref(findEditorPreset(initialBase).preset.name)
  const base = computed(() => findEditorPreset(baseName.value))
  const draft = ref<ThemePreset>(clonePlain(base.value.preset))
  const themeName = ref('brand')
  const mode = ref<ColorMode>('light')

  const overrides = computed(() => diffPreset(asRecord(base.value.preset), asRecord(draft.value)))
  const changeCount = computed(() => Object.keys(overrides.value).length > 0
    ? countChanges(overrides.value)
    : 0)

  let lastResolved: ReturnType<typeof resolvePreset> | undefined
  const resolved = computed(() => {
    try {
      lastResolved = resolvePreset(draft.value)
    }
    catch {}

    return lastResolved
  })

  function selectBase(name: string, keep?: ThemePresetOverrides) {
    baseName.value = findEditorPreset(name).preset.name
    draft.value = clonePlain(keep
      ? mergePresets(base.value.preset, keep)
      : base.value.preset)
  }

  function reset() {
    draft.value = clonePlain(base.value.preset)
  }

  function get(path: EditorPath): string {
    const value = getAt(draft.value, path)

    return typeof value === 'string'
      ? value
      : ''
  }

  function baseValue(path: EditorPath): string {
    const value = getAt(base.value.preset, path)

    return typeof value === 'string'
      ? value
      : ''
  }

  function isModified(path: EditorPath): boolean {
    return JSON.stringify(getAt(draft.value, path)) !== JSON.stringify(getAt(base.value.preset, path))
  }

  function resetPath(path: EditorPath) {
    const value = getAt(base.value.preset, path)
    setAt(asRecord(draft.value), path, value === undefined
      ? undefined
      : clonePlain(value))
  }

  /** An empty value goes back to the value of the base preset */
  function set(path: EditorPath, value: string | number | null | undefined) {
    const text = value === null || value === undefined
      ? ''
      : String(value).trim()
    if (text === '')
      resetPath(path)
    else
      setAt(asRecord(draft.value), path, text)
  }

  function contrast(first: string, second: string, colorMode: ColorMode = mode.value): number | undefined {
    const colors = resolved.value?.[colorMode].colors as Record<string, { hex: string }> | undefined
    const a = colors?.[first]?.hex
    const b = colors?.[second]?.hex

    return a && b
      ? getContrastRatio(a, b)
      : undefined
  }

  function save(): SavedTheme {
    return {
      base: baseName.value,
      name: themeName.value,
      overrides: clonePlain(overrides.value),
    }
  }

  function load(saved: SavedTheme) {
    themeName.value = saved.name || 'brand'
    selectBase(saved.base, saved.overrides)
  }

  return {
    baseName,
    base,
    draft,
    themeName,
    mode,
    overrides,
    changeCount,
    resolved,
    selectBase,
    reset,
    get,
    baseValue,
    set,
    isModified,
    resetPath,
    contrast,
    save,
    load,
  }
}

export type ThemeEditor = ReturnType<typeof createThemeEditor>

const THEME_EDITOR: InjectionKey<ThemeEditor> = Symbol('theme-editor')

export function provideThemeEditor(initialBase: string): ThemeEditor {
  const editor = createThemeEditor(initialBase)
  provide(THEME_EDITOR, editor)

  return editor
}

export function useThemeEditor(): ThemeEditor {
  const editor = inject(THEME_EDITOR)
  if (!editor)
    throw new Error('useThemeEditor() needs provideThemeEditor() in a parent component')

  return editor
}

export function encodeTheme(saved: SavedTheme): string {
  const bytes = new TextEncoder().encode(JSON.stringify(saved))

  return btoa(String.fromCodePoint(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

export function decodeTheme(value: string): SavedTheme | undefined {
  try {
    const binary = atob(value.replaceAll('-', '+').replaceAll('_', '/'))
    const saved = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, char => char.codePointAt(0)!))) as SavedTheme

    return typeof saved?.base === 'string' && typeof saved.overrides === 'object'
      ? saved
      : undefined
  }
  catch {
    return undefined
  }
}
