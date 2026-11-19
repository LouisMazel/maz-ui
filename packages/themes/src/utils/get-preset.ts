import type { ThemePreset, ThemePresetName, ThemePresetOverrides } from '../types.ts'
import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import { presetRegistry } from './preset-loaders.ts'

export function isPresetObject(preset?: ThemePresetName | ThemePreset | ThemePresetOverrides): preset is ThemePreset {
  return typeof preset === 'object' && preset !== null && !!preset.name
}

export async function getPreset(preset?: ThemePresetName | ThemePreset) {
  if (isPresetObject(preset)) {
    return preset
  }

  const name = !preset || preset === 'maz-ui'
    ? 'mazUi'
    : preset
  const load = Object.hasOwn(presetRegistry.loaders, name)
    ? presetRegistry.loaders[name]
    : undefined

  if (load) {
    return await load()
  }

  if (presetRegistry.restricted) {
    throw new TypeError(`[@maz-ui/themes] Preset "${preset}" is not in the presets of the app: add it to the "presets" option of MazUi (@maz-ui/vite-plugin), or to "theme.presets" with @maz-ui/nuxt`)
  }

  throw new TypeError(`[@maz-ui/themes] Preset ${preset} not found`)
}

/** Warns that the preset saved in the `maz-preset` cookie cannot be loaded: the configured preset is used instead */
export function warnSavedPresetFallback(error: unknown): void {
  console.warn(`${getErrorMessage(error)}. The configured preset is used instead.`)
}
