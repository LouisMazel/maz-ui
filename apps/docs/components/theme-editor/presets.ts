import type { ThemePreset } from '@maz-ui/themes'
import { folio, linux, macos, mazUi, nova, obsidian, ocean, pristine, windows } from '@maz-ui/themes/presets'

export interface EditorPreset {
  preset: ThemePreset
  label: string
  /** Named export of `@maz-ui/themes/presets/<importName>` */
  importName: string
}

export const EDITOR_PRESETS: readonly EditorPreset[] = [
  { preset: mazUi, label: 'Maz-UI', importName: 'mazUi' },
  { preset: pristine, label: 'Pristine', importName: 'pristine' },
  { preset: ocean, label: 'Ocean', importName: 'ocean' },
  { preset: obsidian, label: 'Obsidian', importName: 'obsidian' },
  { preset: nova, label: 'Nova', importName: 'nova' },
  { preset: folio, label: 'Folio', importName: 'folio' },
  { preset: macos, label: 'macOS', importName: 'macos' },
  { preset: windows, label: 'Windows', importName: 'windows' },
  { preset: linux, label: 'Linux', importName: 'linux' },
]

export function findEditorPreset(name: string): EditorPreset {
  return EDITOR_PRESETS.find(item => item.preset.name === name) ?? EDITOR_PRESETS[0]!
}

/** First family of a font stack, for display */
export function fontName(stack?: string): string {
  const first = stack?.split(',')[0]?.trim().replaceAll(/['"]/g, '') ?? ''

  return first.startsWith('-apple-system') || first === 'system-ui'
    ? 'System UI'
    : first
}
