import type { UserConfig } from 'vite'
import { MazUiThemePresets, renderPresetRegistry } from '../index'

const vite = vi.hoisted(() => ({ version: '8.3.8' }))

vi.mock('vite', () => vite)

interface EsbuildBuild {
  onLoad: (options: { filter: RegExp }, callback: (args: { path: string }) => unknown) => void
}

interface Hooks {
  config: () => UserConfig
  load: (id: string) => string | undefined
}

function hooks(presets: string[]): Hooks {
  return MazUiThemePresets({ presets }) as unknown as Hooks
}

const DIST_MODULE = '/app/node_modules/@maz-ui/themes/dist/utils/preset-loaders.js'
const SRC_MODULE = 'C:\\maz-ui\\packages\\themes\\src\\utils\\preset-loaders.ts'

describe('MazUiThemePresets', () => {
  describe('given renderPresetRegistry function', () => {
    describe('when presets are given', () => {
      it('then it renders a restricted registry with their loaders', () => {
        const result = renderPresetRegistry(['ocean', 'nova'], '.js')

        expect(result).toBe([
          'export const presetRegistry = {',
          '  restricted: true,',
          '  loaders: {',
          '    ocean: () => import(\'../presets/ocean.js\').then(module => module.ocean),',
          '    nova: () => import(\'../presets/nova.js\').then(module => module.nova),',
          '  },',
          '}',
          '',
        ].join('\n'))
      })
    })
  })

  describe('given the load hook', () => {
    describe('when the preset loaders module of the package is loaded', () => {
      it('then it returns the registry of the presets of the option', () => {
        const result = hooks(['ocean']).load(`${DIST_MODULE}?v=123`)

        expect(result).toBe(renderPresetRegistry(['ocean'], '.js'))
      })
    })

    describe('when the preset loaders module of the sources is loaded', () => {
      it('then the loaders import the sources', () => {
        const result = hooks(['ocean']).load(SRC_MODULE)

        expect(result).toContain('import(\'../presets/ocean.ts\')')
      })
    })

    describe('when another module is loaded', () => {
      it('then it returns nothing', () => {
        const result = hooks(['ocean']).load('/app/src/utils/preset-loaders.js')

        expect(result).toBeUndefined()
      })
    })

    describe('when the presets have aliases and duplicates', () => {
      it('then the names are normalized once', () => {
        const result = hooks(['maz-ui', 'mazUi', 'ocean']).load(DIST_MODULE)

        expect(result).toBe(renderPresetRegistry(['mazUi', 'ocean'], '.js'))
      })
    })

    describe('when no preset is given', () => {
      it('then the registry has no loader', () => {
        const result = hooks([]).load(DIST_MODULE)

        expect(result).toBe(renderPresetRegistry([], '.js'))
      })
    })
  })

  describe('given an invalid preset name', () => {
    describe('when the plugin is created', () => {
      it('then it throws an error', () => {
        expect(() => hooks(['../evil'])).toThrow('[maz-ui:theme-presets] Invalid preset name "../evil"')
      })
    })
  })

  describe('given the config hook', () => {
    describe('when Vite pre-bundles with Rolldown', () => {
      it('then the dependency optimizer loads the same registry', () => {
        vite.version = '8.3.8'
        const plugin = hooks(['ocean'])

        const config = plugin.config()
        const optimizerPlugin = config.optimizeDeps?.rolldownOptions?.plugins as unknown as Array<{ load: Hooks['load'] }>

        expect(optimizerPlugin[0]!.load(DIST_MODULE)).toBe(renderPresetRegistry(['ocean'], '.js'))
      })
    })

    describe('when Vite pre-bundles with esbuild', () => {
      it('then the esbuild plugin loads the same registry', () => {
        vite.version = '7.1.0'
        const plugin = hooks(['ocean'])
        let filter: RegExp | undefined
        let callback: ((args: { path: string }) => unknown) | undefined
        const build: EsbuildBuild = {
          onLoad: (options, onLoad) => {
            filter = options.filter
            callback = onLoad
          },
        }

        const config = plugin.config() as unknown as { optimizeDeps: { esbuildOptions: { plugins: Array<{ setup: (build: EsbuildBuild) => void }> } } }
        config.optimizeDeps.esbuildOptions.plugins[0]!.setup(build)

        expect(filter?.test(DIST_MODULE)).toBe(true)
        expect(callback?.({ path: DIST_MODULE })).toEqual({
          contents: renderPresetRegistry(['ocean'], '.js'),
          loader: 'js',
          resolveDir: '/app/node_modules/@maz-ui/themes/dist/utils',
        })
      })
    })
  })
})
