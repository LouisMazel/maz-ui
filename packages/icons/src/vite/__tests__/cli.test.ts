import { readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { HELP, runCli } from '../cli.ts'
import { createProject, HOME_SVG, write } from './fixtures.ts'

const PLUGIN = fileURLToPath(new URL('../index.ts', import.meta.url))
const VITE = import.meta.resolve('vite')

function fakeVite(exports: unknown, packageExport: string | null = './package.json'): Record<string, string> {
  return {
    'node_modules/vite/package.json': JSON.stringify({ name: 'vite', exports: { '.': exports, './package.json': packageExport } }),
    'node_modules/vite/dist/index.js': `import { resolveConfig as resolve } from '${VITE}'\n\nexport function resolveConfig(...args) {\n  globalThis.projectVite = true\n  return resolve(...args)\n}\n`,
  }
}

function config(options: string): string {
  return `import { MazUiIcons } from '${PLUGIN}'\n\nexport default { plugins: [[MazUiIcons(${options})]] }\n`
}

function createLogger() {
  return {
    log: vi.fn<(message: string) => void>(),
    error: vi.fn<(message: string) => void>(),
  }
}

describe('given a project with MazUiIcons() in its Vite config', () => {
  let root: string

  beforeAll(() => {
    root = createProject({
      files: {
        'vite.config.mjs': config('{ prefix: \'app\' }'),
        'src/icons/logo.svg': HOME_SVG,
      },
    })
  })

  afterAll(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when the types command runs', () => {
    it('then the types of the names are written, without a build', async () => {
      const logger = createLogger()

      expect(await runCli(['types', '--root', root], logger)).toBe(0)
      expect(readFileSync(join(root, 'src/maz-icons.d.ts'), 'utf8')).toContain('\'app:logo\': true')
      expect(logger.log).toHaveBeenCalledWith('[maz-ui:icons] Types written in src/maz-icons.d.ts')
    })
  })

  describe('when the types command runs in its folder', () => {
    it('then the config of the folder is read', async () => {
      vi.spyOn(process, 'cwd').mockReturnValue(root)

      expect(await runCli(['types'], createLogger())).toBe(0)
      vi.restoreAllMocks()
    })
  })

  describe('when the types command runs with another config and a mode', () => {
    it('then the types of that config are written', async () => {
      write(join(root, 'config/icons.config.mjs'), config('{ prefix: \'brand\', dts: \'types/icons.d.ts\' }'))
      const logger = createLogger()

      expect(await runCli(['types', '--root', root, '--config', 'config/icons.config.mjs', '--mode', 'development'], logger)).toBe(0)
      expect(readFileSync(join(root, 'types/icons.d.ts'), 'utf8')).toContain('\'brand:logo\': true')
    })
  })

  describe('when the config does not write the types', () => {
    it('then it fails, with the option to remove', async () => {
      write(join(root, 'no-dts.config.mjs'), config('{ dts: false }'))
      const logger = createLogger()

      expect(await runCli(['types', '--root', root, '--config', 'no-dts.config.mjs'], logger)).toBe(1)
      expect(logger.error).toHaveBeenCalledWith('[maz-ui:icons] MazUiIcons() does not write the types: remove `dts: false`')
    })
  })

  describe('when the config has no MazUiIcons()', () => {
    it('then it fails, with the plugin to add', async () => {
      write(join(root, 'empty.config.mjs'), 'export default {}\n')
      const logger = createLogger()

      expect(await runCli(['types', '--root', root, '--config', 'empty.config.mjs'], logger)).toBe(1)
      expect(logger.error).toHaveBeenCalledWith('[maz-ui:icons] MazUiIcons() is not in the Vite config: add it, or MazUi() of @maz-ui/vite-plugin')
    })
  })
})

describe('given a project with its own Vite', () => {
  describe.each([
    ['a path', './dist/index.js'],
    ['conditions', { import: { types: './dist/index.d.ts', default: './dist/index.js' }, require: './index.cjs' }],
  ])('when its exports are %s and the types command runs', (_, exports) => {
    it('then the Vite of the project resolves the config', async () => {
      const root = createProject({
        files: {
          ...fakeVite(exports),
          'vite.config.mjs': config('{}'),
        },
      })

      expect(await runCli(['types', '--root', root], createLogger())).toBe(0)
      expect((globalThis as { projectVite?: boolean }).projectVite).toBe(true)
      delete (globalThis as { projectVite?: boolean }).projectVite
      rmSync(root, { recursive: true, force: true })
    })
  })
})

describe('given a project with a Vite that does not export its package.json', () => {
  describe('when the types command runs', () => {
    it('then the Vite of @maz-ui/icons resolves the config', async () => {
      const root = createProject({
        files: {
          ...fakeVite('./dist/index.js', null),
          'vite.config.mjs': config('{}'),
        },
      })

      expect(await runCli(['types', '--root', root], createLogger())).toBe(0)
      expect((globalThis as { projectVite?: boolean }).projectVite).toBeUndefined()
      rmSync(root, { recursive: true, force: true })
    })
  })
})

describe('given the cli', () => {
  describe('when it runs with --help', () => {
    it('then the help is shown', async () => {
      const logger = createLogger()

      expect(await runCli(['--help'], logger)).toBe(0)
      expect(logger.log).toHaveBeenCalledWith(HELP)
    })
  })

  describe('when it runs without a command', () => {
    it('then the help is shown, and it fails', async () => {
      const logger = createLogger()

      expect(await runCli([], logger)).toBe(1)
      expect(logger.log).toHaveBeenCalledWith(HELP)
    })
  })

  describe('when it runs an unknown command', () => {
    it('then it fails, with the help', async () => {
      const logger = createLogger()

      expect(await runCli(['build'], logger)).toBe(1)
      expect(logger.error).toHaveBeenCalledWith(`[maz-ui:icons] Unknown command "build"\n\n${HELP}`)
    })
  })

  describe('when it runs with an unknown option', () => {
    it('then it fails', async () => {
      const logger = createLogger()

      expect(await runCli(['types', '--watch'], logger)).toBe(1)
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('--watch'))
    })
  })
})
