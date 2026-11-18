import type { Plugin, UserConfig } from 'vite'
import { dirname, extname } from 'node:path'
import { version as viteVersion } from 'vite'

export interface MazUiThemePresetsOptions {
  /**
   * Named presets of @maz-ui/themes the app loads by name (`theme.preset`, `updateTheme('ocean')`,
   * `definePreset({ base: 'ocean' })`, the `maz-preset` cookie): the other presets are not in the build.
   * `[]` keeps none, for an app that only uses preset objects.
   */
  presets: string[]
}

/** The module of @maz-ui/themes with the loaders of the named presets (`dist` when installed, `src` in the monorepo) */
const PRESET_REGISTRY_MODULE = /[\\/]themes[\\/](?:dist|src)[\\/]utils[\\/]preset-loaders\.[jt]s(?:\?.*)?$/
const PRESET_NAME = /^[a-z]+$/i
const PRESET_ALIASES: Record<string, string> = {
  'maz-ui': 'mazUi',
}

function normalizePresetNames(presets: string[]): string[] {
  const names = presets.map(name => PRESET_ALIASES[name] ?? name)
  const invalid = names.find(name => !PRESET_NAME.test(name))

  if (invalid !== undefined)
    throw new TypeError(`[maz-ui:theme-presets] Invalid preset name "${invalid}": use the name of a preset of @maz-ui/themes ("ocean", "maz-ui"...)`)

  return [
    ...new Set(names),
  ]
}

/** Source of the `preset-loaders` module of @maz-ui/themes with the given presets only */
export function renderPresetRegistry(names: string[], extension: string): string {
  const loaders = names.map(name => `    ${name}: () => import('../presets/${name}${extension}').then(module => module.${name}),`)

  return [
    'export const presetRegistry = {',
    '  restricted: true,',
    '  loaders: {',
    ...loaders,
    '  },',
    '}',
    '',
  ].join('\n')
}

interface EsbuildPlugin {
  name: string
  setup: (build: {
    onLoad: (
      options: { filter: RegExp },
      callback: (args: { path: string }) => { contents: string, loader: 'js', resolveDir: string } | undefined,
    ) => void
  }) => void
}

/**
 * Keep in the build only the named presets of @maz-ui/themes the app loads by name: `getPreset` (used by `useTheme`,
 * `definePreset` and the plugin) imports each preset on demand, so every preset is a chunk of the build otherwise.
 * Loading another preset by name throws an error that names this option. Applies to the dev server too, through the
 * dependency optimizer.
 */
export function MazUiThemePresets(options: MazUiThemePresetsOptions): Plugin {
  const names = normalizePresetNames(options.presets)

  function loadRegistry(id: string): string | undefined {
    if (!PRESET_REGISTRY_MODULE.test(id))
      return

    return renderPresetRegistry(names, extname(id.split('?')[0]!))
  }

  const esbuildPlugin: EsbuildPlugin = {
    name: 'maz-ui:theme-presets',
    setup(build) {
      build.onLoad({ filter: PRESET_REGISTRY_MODULE }, ({ path }) => ({
        contents: loadRegistry(path)!,
        loader: 'js',
        resolveDir: dirname(path),
      }))
    },
  }

  return {
    name: 'maz-ui:theme-presets',
    enforce: 'pre',

    config() {
      // Vite 8 pre-bundles the dependencies with Rolldown, Vite 6 and 7 with esbuild
      const optimizeDeps = Number.parseInt(viteVersion) >= 8
        ? {
            rolldownOptions: {
              plugins: [
                { name: 'maz-ui:theme-presets', load: loadRegistry },
              ],
            },
          }
        : {
            esbuildOptions: {
              plugins: [esbuildPlugin],
            },
          }

      return { optimizeDeps } as UserConfig
    },

    load: loadRegistry,
  }
}
