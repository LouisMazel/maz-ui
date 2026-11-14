import type { ThemePreset, ThemePresetName, ThemePresetOverrides } from '../types'

export function isPresetObject(preset?: ThemePresetName | ThemePreset | ThemePresetOverrides): preset is ThemePreset {
  return typeof preset === 'object' && preset !== null && !!preset.name
}

export async function getPreset(preset?: ThemePresetName | ThemePreset) {
  if (isPresetObject(preset)) {
    return preset
  }

  if (preset === 'mazUi' || !preset || preset === 'maz-ui') {
    const { mazUi } = await import('../presets/mazUi')
    return mazUi
  }

  if (preset === 'ocean') {
    const { ocean } = await import('../presets/ocean')
    return ocean
  }

  if (preset === 'pristine') {
    const { pristine } = await import('../presets/pristine')
    return pristine
  }

  if (preset === 'obsidian') {
    const { obsidian } = await import('../presets/obsidian')
    return obsidian
  }

  if (preset === 'nova') {
    const { nova } = await import('../presets/nova')
    return nova
  }

  if (preset === 'folio') {
    const { folio } = await import('../presets/folio')
    return folio
  }

  if (preset === 'macos') {
    const { macos } = await import('../presets/macos')
    return macos
  }

  if (preset === 'windows') {
    const { windows } = await import('../presets/windows')
    return windows
  }

  if (preset === 'linux') {
    const { linux } = await import('../presets/linux')
    return linux
  }

  throw new TypeError(`[@maz-ui/themes] Preset ${preset} not found`)
}
