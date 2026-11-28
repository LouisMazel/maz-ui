import type { ProjectPreset } from './preset.ts'

/** Presets a project passes to the theme (`preset:` option of `MazUi`, `MazUiTheme`, `MazUiProvider`, `useTheme`, `updateTheme(...)`) */
export interface PresetUsage {
  /** Names of the presets passed to the theme: export names, `default:<file name>` for default imports, bundled names */
  used: string[]
  /** Files where a `definePreset` without name is passed to the theme inline */
  inlineFiles: string[]
  /** The preset is picked at runtime (condition, function call, lookup): every candidate is in `used` */
  dynamic: boolean
  /** A preset is passed to the theme somewhere */
  wired: boolean
}

export function emptyPresetUsage(): PresetUsage {
  return { used: [], inlineFiles: [], dynamic: false, wired: false }
}

export function mergePresetUsage(target: PresetUsage, other: PresetUsage): void {
  target.used = [...new Set([...target.used, ...other.used])]
  target.inlineFiles = [...new Set([...target.inlineFiles, ...other.inlineFiles])]
  target.dynamic ||= other.dynamic
  target.wired ||= other.wired
}

/** Whether a `definePreset` of the project is among the presets passed to the theme */
export function isPresetUsed(preset: ProjectPreset, usage: PresetUsage): boolean {
  if (preset.exportName && usage.used.includes(preset.exportName))
    return true

  if (!preset.exportName && usage.inlineFiles.includes(preset.file))
    return true

  const fileName = preset.file.split('/').pop()?.replace(/\.[cm]?[jt]s$/, '')

  return usage.used.includes(`default:${fileName}`)
}
