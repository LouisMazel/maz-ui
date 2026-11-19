import type { ThemePreset } from '../types/index.ts'

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
    mazUi: () => import('../presets/mazUi.ts').then(module => module.mazUi),
    ocean: () => import('../presets/ocean.ts').then(module => module.ocean),
    pristine: () => import('../presets/pristine.ts').then(module => module.pristine),
    obsidian: () => import('../presets/obsidian.ts').then(module => module.obsidian),
    nova: () => import('../presets/nova.ts').then(module => module.nova),
    folio: () => import('../presets/folio.ts').then(module => module.folio),
    macos: () => import('../presets/macos.ts').then(module => module.macos),
    windows: () => import('../presets/windows.ts').then(module => module.windows),
    linux: () => import('../presets/linux.ts').then(module => module.linux),
  },
}
