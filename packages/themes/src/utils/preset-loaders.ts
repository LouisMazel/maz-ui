import type { ThemePreset } from '../types'

export interface PresetRegistry {
  /** Whether the loaders are a selection of the app (`presets` option of `MazUiThemePresets`) */
  restricted: boolean
  loaders: Record<string, () => Promise<ThemePreset>>
}

/**
 * Loaders of the named presets, used by `getPreset`. `MazUiThemePresets` (@maz-ui/vite-plugin) replaces this module
 * at build time with the presets of its `presets` option only: the other presets are not in the build.
 */
export const presetRegistry: PresetRegistry = {
  restricted: false,
  loaders: {
    mazUi: () => import('../presets/mazUi').then(module => module.mazUi),
    ocean: () => import('../presets/ocean').then(module => module.ocean),
    pristine: () => import('../presets/pristine').then(module => module.pristine),
    obsidian: () => import('../presets/obsidian').then(module => module.obsidian),
    nova: () => import('../presets/nova').then(module => module.nova),
    folio: () => import('../presets/folio').then(module => module.folio),
    macos: () => import('../presets/macos').then(module => module.macos),
    windows: () => import('../presets/windows').then(module => module.windows),
    linux: () => import('../presets/linux').then(module => module.linux),
  },
}
