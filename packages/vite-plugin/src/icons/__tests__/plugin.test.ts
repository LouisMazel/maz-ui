import type { Logger, Plugin, Rollup, UserConfig } from 'vite'
import { EventEmitter } from 'node:events'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { build } from 'vite'
import { generateRegistration, generateRuntime, MazUiIcons } from '../index'
import { createProject, HERO_SVG, write } from './fixtures'

const { packageMissing } = vi.hoisted(() => ({
  packageMissing: { enabled: false },
}))

vi.mock('../sources', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../sources')>()
  return {
    ...actual,
    locateIconsPackage: (root: string) => packageMissing.enabled
      ? undefined
      : actual.locateIconsPackage(root),
  }
})

type Handler = (...args: any[]) => any

const roots: string[] = []

function project(...args: Parameters<typeof createProject>) {
  const root = createProject(...args)
  roots.push(root)
  return root
}

afterAll(() => {
  for (const root of roots)
    rmSync(root, { recursive: true, force: true })
})

function createLogger() {
  return {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  } as unknown as Logger & { warn: ReturnType<typeof vi.fn> }
}

function hook(plugin: Plugin, name: 'resolveId' | 'load' | 'transform'): Handler {
  return (plugin[name] as { handler: Handler }).handler
}

function setup(options: Parameters<typeof MazUiIcons>[0], root: string, config: Record<string, unknown> = {}) {
  const plugin = MazUiIcons(options)
  const logger = createLogger()
  ;(plugin.configResolved as Handler)({ root, logger, ...config })
  return { plugin, logger }
}

function createServer() {
  const watcher = Object.assign(new EventEmitter(), {
    add: vi.fn(),
  })
  const graph = () => ({
    getModuleById: vi.fn((id: string) => id === '/src/page.vue'
      ? { id }
      : undefined),
    invalidateModule: vi.fn(),
  })
  return {
    watcher,
    ws: {
      send: vi.fn(),
    },
    environments: {
      client: {
        moduleGraph: graph(),
      },
      ssr: {
        moduleGraph: graph(),
      },
    },
  }
}

describe('given a vite build with MazUiIcons', () => {
  let root: string
  let output: Rollup.RollupOutput

  beforeAll(async () => {
    root = project({
      files: {
        'src/icons/hero.svg': HERO_SVG,
        'src/entry.js': 'console.log({ icon: "home" })\nimport("./page.js").then(page => console.log(page))\n',
        'src/page.js': 'export const close = { icon: "x-mark" }\nexport const hero = "app:hero"\n',
      },
    })

    output = await build({
      root,
      configFile: false,
      logLevel: 'silent',
      plugins: [
        MazUiIcons({ prefix: 'app', dts: false }),
      ],
      build: {
        write: false,
        minify: false,
        rollupOptions: {
          input: join(root, 'src/entry.js'),
        },
      },
    }) as Rollup.RollupOutput
  })

  describe('when a page uses an icon', () => {
    it('then the icon is in the chunk of the page, not in the entry', () => {
      const chunks = output.output.filter((file): file is Rollup.OutputChunk => file.type === 'chunk')
      const entry = chunks.find(chunk => chunk.isEntry)!
      const page = chunks.find(chunk => !chunk.isEntry && chunk.code.includes('close'))!

      expect(entry.code).toContain('"home"')
      expect(entry.code).not.toContain('currentColor')
      expect(page.code).toContain('currentColor')
      expect(page.code).toContain('"app:hero"')
      expect(page.code).toContain('#7dd3fc')
    })
  })
})

describe('given a vite build of TypeScript with MazUiIcons', () => {
  let code: string

  beforeAll(async () => {
    const root = project({
      files: {
        'src/entry.ts': [
          'type Kind = \'invite\' | \'close\'',
          'const ICONS: Record<Kind, string> = { invite: \'home\', close: \'x-mark\' }',
          'console.log(ICONS)',
          '',
        ].join('\n'),
      },
    })

    const output = await build({
      root,
      configFile: false,
      logLevel: 'silent',
      plugins: [
        MazUiIcons({ dts: false }),
      ],
      build: {
        write: false,
        minify: false,
        rollupOptions: {
          input: join(root, 'src/entry.ts'),
        },
      },
    }) as Rollup.RollupOutput

    code = output.output.map(file => file.type === 'chunk'
      ? file.code
      : '').join('\n')
  })

  describe('when a variable has a type annotation', () => {
    it('then its icons are registered: the types are removed before the scan', () => {
      expect(code).toContain('"home": "<svg')
      expect(code).toContain('"x-mark": "<svg')
    })
  })
})

describe('given the generated code', () => {
  describe('when a file uses icons', () => {
    it('then it imports and registers them', () => {
      expect(generateRegistration(['moon', 'app:hero'])).toBe([
        'import { r as __mazIconRegister } from "virtual:maz-icon-runtime";',
        'import __mazIcon0 from "virtual:maz-icon/moon";',
        'import __mazIcon1 from "virtual:maz-icon/app:hero";',
        '__mazIconRegister({ "moon": __mazIcon0, "app:hero": __mazIcon1 });',
        '',
      ].join('\n'))
    })
  })

  describe('when the runtime has a safelist', () => {
    it('then it registers the icons of the safelist', () => {
      const runtime = generateRuntime(['home'])

      expect(runtime).toContain('import __mazIcon0 from "virtual:maz-icon/home";')
      expect(runtime).toContain('r({ "home": __mazIcon0 });')
      expect(generateRuntime([])).not.toContain('import')
    })
  })
})

describe('given the config of the app', () => {
  describe('when it does not set the pre-bundling of @maz-ui/icons', () => {
    it('then @maz-ui/icons is excluded from it', () => {
      const config = (MazUiIcons().config as Handler)({})

      expect(config).toEqual({
        optimizeDeps: {
          exclude: ['@maz-ui/icons'],
        },
      })
    })
  })

  describe('when it includes or excludes @maz-ui/icons', () => {
    it('then the config is kept', () => {
      const config = MazUiIcons().config as Handler

      expect(config({
        optimizeDeps: {
          include: ['@maz-ui/icons'],
        },
      } satisfies UserConfig)).toBeUndefined()
      expect(config({
        optimizeDeps: {
          exclude: ['@maz-ui/icons'],
        },
      } satisfies UserConfig)).toBeUndefined()
    })
  })
})

describe('given the types of the names', () => {
  describe('when the project has a src folder', () => {
    it('then they are written in it', () => {
      const root = project({
        files: { 'src/main.ts': '' },
      })

      setup({}, root)

      expect(readFileSync(join(root, 'src/maz-icons.d.ts'), 'utf8')).toContain('\'x-mark\': true')
    })
  })

  describe('when the project has no src folder', () => {
    it('then they are written at the root, in strict mode with the option', () => {
      const root = project()

      setup({ strict: true }, root)

      expect(readFileSync(join(root, 'maz-icons.d.ts'), 'utf8')).toContain('strict: true')
    })
  })

  describe('when the file is set or disabled', () => {
    it('then they are written in it, or not at all', () => {
      const root = project({
        files: { 'src/main.ts': '' },
      })

      setup({ dts: 'types/icons.d.ts' }, root)
      setup({ dts: false }, project())

      expect(existsSync(join(root, 'types/icons.d.ts'))).toBe(true)
      expect(existsSync(join(root, 'src/maz-icons.d.ts'))).toBe(false)
    })
  })
})

describe('given the sources of the icons', () => {
  describe('when @maz-ui/icons is not found', () => {
    it('then only the project icons are names, with a warning', () => {
      packageMissing.enabled = true
      const root = project({
        files: { 'src/icons/hero.svg': HERO_SVG },
      })

      const { plugin, logger } = setup({ dts: false }, root)
      packageMissing.enabled = false

      expect(logger.warn).toHaveBeenCalledWith('[maz-ui:icons] @maz-ui/icons not found: only the SVG of the project can be used by name', { timestamp: true })
      const { code } = hook(plugin, 'transform')('const a = { icon: "x-mark" }; const b = { icon: "hero" }', '/src/a.ts')
      expect(code).toContain('virtual:maz-icon/hero')
      expect(code).not.toContain('virtual:maz-icon/x-mark')
    })
  })

  describe('when project icons replace icons of maz-ui, have invalid names or are missing from the safelist', () => {
    it('then each one is reported once', () => {
      const root = project({
        files: { 'src/icons/home.svg': HERO_SVG, 'src/icons/ü.svg': HERO_SVG },
      })

      const { logger } = setup({
        dts: false,
        safelist: ['home', 'unknown'],
      }, root)

      expect(logger.warn.mock.calls.map(([message]) => message)).toEqual([
        '[maz-ui:icons] src/icons/home.svg replaces the icon "home" of maz-ui: rename it or set the `prefix` option',
        '[maz-ui:icons] src/icons/ü.svg is not a valid icon name (letters, digits and dashes)',
        '[maz-ui:icons] unknown icons in the safelist: unknown',
      ])
    })
  })
})

describe('given an import of icons from a barrel of @maz-ui/icons', () => {
  const code = 'import { MazHome } from "@maz-ui/icons/raw"\nconsole.log(MazHome)\n'

  describe('when building', () => {
    it('then the icon is imported from its own module', () => {
      const { plugin } = setup({ dts: false }, project(), { command: 'build' })

      expect(hook(plugin, 'transform')(code, '/src/a.ts').code).toBe('import { MazHome } from "@maz-ui/icons/raw/MazHome";\nconsole.log(MazHome)\n')
    })
  })

  describe('when serving with @maz-ui/icons out of the pre-bundling', () => {
    it('then the icon is imported from its own module', () => {
      const { plugin } = setup({ dts: false }, project(), {
        command: 'serve',
        optimizeDeps: {
          exclude: ['@maz-ui/icons'],
        },
      })

      expect(hook(plugin, 'transform')(code, '/src/a.ts').code).toContain('"@maz-ui/icons/raw/MazHome"')
    })
  })

  describe('when serving with @maz-ui/icons pre-bundled', () => {
    it('then the import is kept', () => {
      const { plugin } = setup({ dts: false }, project(), {
        command: 'serve',
        optimizeDeps: {
          include: ['@maz-ui/icons'],
        },
      })

      expect(hook(plugin, 'transform')(code, '/src/a.ts')).toBeUndefined()
    })
  })
})

describe('given the virtual modules', () => {
  let root: string

  beforeAll(() => {
    root = project({
      files: { 'src/icons/hero.svg': HERO_SVG },
    })
  })

  describe('when their ids are resolved', () => {
    it('then they are private, and other ids are left to Vite', () => {
      const resolveId = hook(MazUiIcons(), 'resolveId')

      expect(resolveId('virtual:maz-icon-runtime')).toBe('\0virtual:maz-icon-runtime')
      expect(resolveId('virtual:maz-icon/x-mark')).toBe('\0virtual:maz-icon/x-mark')
      expect(resolveId('virtual:other')).toBeUndefined()
    })
  })

  describe('when an icon of maz-ui is loaded', () => {
    it('then it exports the raw module of its component, resolved from maz-ui', async () => {
      const { plugin } = setup({ dts: false }, root)
      const context = {
        addWatchFile: vi.fn(),
        resolve: vi.fn(() => Promise.resolve({ id: '/icons/dist/raw/MazXMark.js', external: false })),
      }

      const icon = await hook(plugin, 'load').call(context, '\0virtual:maz-icon/x-mark')

      expect(icon).toBe('export { MazXMark as default } from "/icons/dist/raw/MazXMark.js"\n')
      expect(context.resolve).toHaveBeenCalledWith('@maz-ui/icons/raw/MazXMark', join(root, 'node_modules/maz-ui/package.json'))
      expect(context.addWatchFile).not.toHaveBeenCalled()
    })
  })

  describe('when the raw module of an icon is not resolved, or is external', () => {
    it('then it exports the optimized SVG', async () => {
      const { plugin } = setup({ dts: false }, root)
      const load = hook(plugin, 'load')
      const unresolved = {
        addWatchFile: vi.fn(),
        resolve: vi.fn(() => Promise.resolve(null)),
      }
      const external = {
        addWatchFile: vi.fn(),
        resolve: vi.fn(() => Promise.resolve({ id: '@maz-ui/icons/raw/MazXMark', external: true })),
      }

      expect(await load.call(unresolved, '\0virtual:maz-icon/x-mark')).toMatch(/^export default "<svg/)
      expect(await load.call(external, '\0virtual:maz-icon/x-mark')).toMatch(/^export default "<svg/)
      expect(unresolved.addWatchFile).toHaveBeenCalledWith(join(root, 'node_modules/maz-ui/node_modules/@maz-ui/icons/svg/x-mark.svg'))
    })
  })

  describe('when an icon of the project is loaded', () => {
    it('then it exports the optimized SVG, read once', async () => {
      const svgoConfig = vi.fn((defaults: object) => defaults)
      const { plugin } = setup({ dts: false, prefix: 'app', svgoConfig }, root)
      const load = hook(plugin, 'load')
      const context = {
        addWatchFile: vi.fn(),
        resolve: vi.fn(),
      }

      const hero = await load.call(context, '\0virtual:maz-icon/app:hero')
      await load.call(context, '\0virtual:maz-icon/app:hero')

      expect(hero).toContain('#7dd3fc')
      expect(svgoConfig).toHaveBeenCalledTimes(1)
      expect(context.resolve).not.toHaveBeenCalled()
      expect(context.addWatchFile).toHaveBeenCalledWith(join(root, 'src/icons/hero.svg'))
    })
  })

  describe('when an icon that no longer exists is loaded', () => {
    it('then it exports an empty SVG, rendered as the fallback', async () => {
      const { plugin } = setup({ dts: false }, root)

      expect(await hook(plugin, 'load').call({}, '\0virtual:maz-icon/removed')).toBe('export default ""\n')
    })
  })

  describe('when the runtime is loaded', () => {
    it('then it has the known icons of the safelist', async () => {
      const { plugin } = setup({
        dts: false,
        safelist: ['home', 'unknown'],
      }, project())

      const runtime = await hook(plugin, 'load').call({}, '\0virtual:maz-icon-runtime')

      expect(runtime).toContain('"home": __mazIcon0')
      expect(runtime).not.toContain('unknown')
    })
  })

  describe('when another module is loaded', () => {
    it('then it is left to Vite', async () => {
      expect(await hook(MazUiIcons(), 'load').call({}, '/src/main.ts')).toBeUndefined()
    })
  })
})

describe('given the files of the app', () => {
  let root: string

  beforeAll(() => {
    root = project()
  })

  describe('when a file uses known icons', () => {
    it('then the registration is added before its code, with a source map', () => {
      const { plugin } = setup({ dts: false }, root)

      const result = hook(plugin, 'transform')('export default { icon: "x-mark", other: { icon: "nope" } }', '/src/page.vue')

      expect(result.code).toBe(`${generateRegistration(['x-mark'])}export default { icon: "x-mark", other: { icon: "nope" } }`)
      expect(result.map.mappings).not.toBe('')
    })
  })

  describe('when a file uses no known icon', () => {
    it('then it is not changed', () => {
      const { plugin } = setup({ dts: false }, root)

      expect(hook(plugin, 'transform')('export default { icon: item.icon }', '/src/page.vue')).toBeUndefined()
    })
  })

  describe('when a file has an icon built at runtime and the app has a safelist', () => {
    it('then it loads the runtime, that registers the safelist', () => {
      const { plugin } = setup({
        dts: false,
        safelist: ['home'],
      }, root)

      const result = hook(plugin, 'transform')('export default { icon: item.icon }', '/src/page.vue')

      expect(result.code).toContain('__mazIconRegister({  });')
    })
  })

  describe('when the file is a dependency, a style or not a script', () => {
    it('then it is not read', () => {
      const transform = hook(setup({ dts: false }, root).plugin, 'transform')
      const code = 'export default { icon: "x-mark" }'

      expect(transform(code, '/node_modules/lib/index.js')).toBeUndefined()
      expect(transform(code, '/src/page.vue?vue&type=style&index=0&lang.css')).toBeUndefined()
      expect(transform(code, '/src/data.json')).toBeUndefined()
      expect(transform(code, '\0virtual:other.js')).toBeUndefined()
    })
  })
})

describe('given the dev server', () => {
  describe('when a SVG is added to the icons folder', () => {
    it('then the types are written again and the files that use its name are transformed again', () => {
      const root = project({
        files: { 'src/main.ts': '' },
      })
      const { plugin } = setup({}, root)
      const server = createServer()
      ;(plugin.configureServer as Handler)(server)
      hook(plugin, 'transform')('export default { icon: "hero" }', '/src/page.vue')
      hook(plugin, 'transform')('export default { icon: "hero" }', '/src/not-loaded.vue')
      hook(plugin, 'transform')('export default { icon: "x-mark" }', '/src/other.vue')

      const file = join(root, 'src/icons/hero.svg')
      write(file, HERO_SVG)
      server.watcher.emit('add', file)

      expect(server.watcher.add).toHaveBeenCalledWith(join(root, 'src/icons'))
      expect(readFileSync(join(root, 'src/maz-icons.d.ts'), 'utf8')).toContain('\'hero\': true')
      expect(server.environments.client.moduleGraph.invalidateModule).toHaveBeenCalledWith({ id: '/src/page.vue' })
      expect(server.environments.client.moduleGraph.invalidateModule).toHaveBeenCalledTimes(1)
      expect(server.ws.send).toHaveBeenCalledWith({ type: 'full-reload' })
    })
  })

  describe('when a SVG is removed from the icons folder', () => {
    it('then the files that use its name are transformed again', () => {
      const root = project({
        files: { 'src/icons/hero.svg': HERO_SVG },
      })
      const { plugin } = setup({ dts: false }, root)
      const server = createServer()
      ;(plugin.configureServer as Handler)(server)
      hook(plugin, 'transform')('export default { icon: "hero" }', '/src/page.vue')

      rmSync(join(root, 'src/icons/hero.svg'))
      server.watcher.emit('unlink', join(root, 'src/icons/hero.svg'))

      expect(server.environments.ssr.moduleGraph.invalidateModule).toHaveBeenCalledWith({ id: '/src/page.vue' })
    })
  })

  describe('when a SVG is added while a project icon replaces an icon of maz-ui', () => {
    it('then the replacement is reported once', () => {
      const root = project({
        files: { 'src/icons/home.svg': HERO_SVG },
      })
      const { plugin, logger } = setup({ dts: false }, root)
      const server = createServer()
      ;(plugin.configureServer as Handler)(server)

      write(join(root, 'src/icons/hero.svg'), HERO_SVG)
      server.watcher.emit('add', join(root, 'src/icons/hero.svg'))

      expect(logger.warn).toHaveBeenCalledTimes(1)
    })
  })

  describe('when another file is added', () => {
    it('then nothing is reloaded', () => {
      const root = project()
      const { plugin } = setup({ dts: false }, root)
      const server = createServer()
      ;(plugin.configureServer as Handler)(server)

      server.watcher.emit('add', join(root, 'src/main.ts'))
      server.watcher.emit('add', join(root, 'src/icons/readme.md'))

      expect(server.ws.send).not.toHaveBeenCalled()
    })
  })

  describe('when the SVG of a loaded icon changes', () => {
    it('then its modules are invalidated and the page reloads', () => {
      const root = project({
        files: { 'src/icons/hero.svg': HERO_SVG },
      })
      const { plugin } = setup({ dts: false }, root)
      hook(plugin, 'load').call({
        addWatchFile: vi.fn(),
      }, '\0virtual:maz-icon/hero')
      const file = join(root, 'src/icons/hero.svg')
      const modules = [
        { id: '\0virtual:maz-icon/hero' },
      ]
      const client = {
        name: 'client',
        moduleGraph: {
          invalidateModule: vi.fn(),
        },
        hot: {
          send: vi.fn(),
        },
      }
      const ssr = {
        name: 'ssr',
        moduleGraph: {
          invalidateModule: vi.fn(),
        },
        hot: {
          send: vi.fn(),
        },
      }

      const fromClient = (plugin.hotUpdate as Handler).call({ environment: client }, { file, modules })
      const fromSsr = (plugin.hotUpdate as Handler).call({ environment: ssr }, { file, modules })

      expect(fromClient).toEqual([])
      expect(fromSsr).toEqual([])
      expect(client.moduleGraph.invalidateModule).toHaveBeenCalledWith(modules[0])
      expect(ssr.moduleGraph.invalidateModule).toHaveBeenCalledWith(modules[0])
      expect(client.hot.send).toHaveBeenCalledWith({ type: 'full-reload' })
      expect(ssr.hot.send).not.toHaveBeenCalled()
    })
  })

  describe('when another file changes', () => {
    it('then the update is left to Vite', () => {
      const { plugin } = setup({ dts: false }, project())

      expect((plugin.hotUpdate as Handler).call({}, { file: '/src/main.ts', modules: [] })).toBeUndefined()
    })
  })
})
