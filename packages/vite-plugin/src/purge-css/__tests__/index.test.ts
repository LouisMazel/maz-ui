import type { ResolvedConfig } from 'vite'
import type { PurgeManifest } from '../manifest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { MazUiPurgeCss } from '../index'

interface Hooks {
  configResolved: (config: ResolvedConfig) => void
  buildStart: () => void
  transform: (code: string, id: string) => Promise<{ code: string, map: null } | undefined>
  generateBundle: (options: unknown, bundle: Record<string, unknown>) => void
  closeBundle: () => void
}

const manifest: PurgeManifest = {
  version: '5.7.0',
  classes: ['maz:p-2', 'maz:flex', 'maz:mt-2'],
  utilities: ['text-title-1', 'padded-container'],
  entries: {
    'components/MazBtn': {
      aliases: ['MazBtn'],
      classes: [0],
    },
    'components/MazCard': {
      aliases: ['MazCard'],
      classes: [1],
    },
  },
}

const CSS = '.maz\\:p-2{padding:1px}.maz\\:flex{display:flex}.maz\\:mt-2{margin:1px}@layer maz{.text-title-1{a:b}.padded-container{c:d}}'

const roots: string[] = []

function write(file: string, content: string) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

function createProject(options: { withManifest?: boolean } = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'maz-plugin-'))
  roots.push(root)
  write(join(root, 'package.json'), '{"name":"app"}')
  write(join(root, 'src/App.vue'), '<MazBtn class="text-title-1" />')
  write(join(root, 'extra/other.txt'), 'MazCard')

  if (options.withManifest ?? true) {
    write(join(root, 'node_modules/maz-ui/package.json'), JSON.stringify({
      name: 'maz-ui',
      version: '5.7.0',
      exports: { './purge-manifest.json': './purge-manifest.json' },
    }))
    write(join(root, 'node_modules/maz-ui/purge-manifest.json'), JSON.stringify(manifest))
  }
  else {
    write(join(root, 'node_modules/maz-ui/package.json'), JSON.stringify({
      name: 'maz-ui',
      version: '5.0.0',
      exports: { '.': './index.js' },
    }))
  }

  return root
}

function createConfig(root: string, ssr = false) {
  return {
    root,
    build: { ssr },
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
    },
  }
}

function setup(options: Parameters<typeof MazUiPurgeCss>[0] = {}, projectOptions: { withManifest?: boolean, ssr?: boolean } = {}) {
  const root = createProject(projectOptions)
  const config = createConfig(root, projectOptions.ssr)
  const plugin = MazUiPurgeCss(options)
  const hooks = plugin as unknown as Hooks

  hooks.configResolved(config as unknown as ResolvedConfig)
  hooks.buildStart()

  return { root, config, plugin, hooks }
}

afterAll(() => {
  for (const root of roots)
    rmSync(root, { recursive: true, force: true })
})

describe('given MazUiPurgeCss', () => {
  describe('when the plugin is created', () => {
    it('then it only applies to builds', () => {
      const plugin = MazUiPurgeCss()

      expect(plugin.name).toBe('maz-ui:purge-css')
      expect(plugin.apply).toBe('build')
    })
  })

  describe('when the manifest of maz-ui is not found', () => {
    it('then it warns and does not transform anything', async () => {
      const { config, hooks } = setup({}, { withManifest: false })

      expect(config.logger.warn).toHaveBeenCalledWith(expect.stringContaining('maz-ui/purge-manifest.json not found'))
      expect(await hooks.transform(CSS, '/app/style.css')).toBeUndefined()
      hooks.generateBundle({}, {})
      hooks.closeBundle()
      expect(config.logger.info).not.toHaveBeenCalled()
    })
  })

  describe('when transform runs before buildStart', () => {
    it('then it returns nothing', async () => {
      const root = createProject()
      const hooks = MazUiPurgeCss() as unknown as Hooks
      hooks.configResolved(createConfig(root) as unknown as ResolvedConfig)

      expect(await hooks.transform(CSS, '/app/style.css')).toBeUndefined()
    })
  })

  describe('when a CSS file of maz-ui is transformed', () => {
    it('then it removes the classes the app does not use', async () => {
      const { hooks } = setup()

      const result = await hooks.transform(CSS, '/app/node_modules/maz-ui/style.css')

      expect(result?.map).toBeNull()
      expect(result?.code).toContain('maz\\:p-2')
      expect(result?.code).toContain('text-title-1')
      expect(result?.code).not.toContain('maz\\:flex')
      expect(result?.code).not.toContain('maz\\:mt-2')
      expect(result?.code).not.toContain('padded-container')
    })

    it('then the content option adds usage from other files, with relative or absolute globs', async () => {
      const root = createProject()
      const hooks = MazUiPurgeCss({
        content: ['extra/*.txt'],
      }) as unknown as Hooks
      hooks.configResolved(createConfig(root) as unknown as ResolvedConfig)
      hooks.buildStart()
      const relative = await hooks.transform(CSS, '/a/style.css')

      const absoluteHooks = MazUiPurgeCss({
        content: [
          join(root, 'extra/*.txt'),
        ],
      }) as unknown as Hooks
      absoluteHooks.configResolved(createConfig(root) as unknown as ResolvedConfig)
      absoluteHooks.buildStart()
      const absolute = await absoluteHooks.transform(CSS, '/a/style.css')

      expect(relative?.code).toContain('maz\\:flex')
      expect(absolute?.code).toContain('maz\\:flex')
    })

    it('then the entries and safelist options keep classes', async () => {
      const { hooks } = setup({
        entries: ['MazCard'],
        safelist: ['maz:mt-2', /^padded/],
      })

      const result = await hooks.transform(CSS, '/a/style.css')

      expect(result).toBeUndefined()
    })
  })

  describe('when the CSS request is not a stylesheet', () => {
    it('then transform returns nothing', async () => {
      const { hooks } = setup()

      expect(await hooks.transform(CSS, '/app/main.ts')).toBeUndefined()
    })
  })

  describe('when the CSS request has a query or a lang parameter', () => {
    it('then transform handles it', async () => {
      const { hooks } = setup()

      expect(await hooks.transform(CSS, '/app/style.css?inline')).toBeDefined()
      expect(await hooks.transform(CSS, '/app/App.vue?vue&type=style&index=0&lang.css')).toBeDefined()
    })
  })

  describe('when the CSS has no maz-ui class', () => {
    it('then transform returns nothing', async () => {
      const { hooks } = setup()

      expect(await hooks.transform('.foo{a:b}', '/app/style.css')).toBeUndefined()
    })
  })

  describe('when every class of the CSS is used', () => {
    it('then transform returns nothing', async () => {
      const { hooks } = setup()

      expect(await hooks.transform('.maz\\:p-2{a:b}', '/app/style.css')).toBeUndefined()
    })
  })

  describe('when the CSS only has the public layer', () => {
    it('then transform detects it', async () => {
      const { hooks } = setup()

      const result = await hooks.transform('@layer maz{.padded-container{a:b}}', '/app/utilities.css')

      expect(result?.code).toBe('')
    })
  })

  describe('when generateBundle runs without removed classes', () => {
    it('then it does not warn', () => {
      const { config, hooks } = setup()

      hooks.generateBundle({}, {
        'a.js': { type: 'chunk', code: 'maz:flex' },
      })

      expect(config.logger.warn).not.toHaveBeenCalled()
    })
  })

  describe('when purged classes are still in the bundle', () => {
    it('then it warns with the classes found in chunks and assets', async () => {
      const { config, hooks } = setup()
      await hooks.transform(CSS, '/app/style.css')

      hooks.generateBundle({}, {
        'a.js': { type: 'chunk', code: 'const a = "maz:flex"' },
        'a.css': { type: 'asset', source: '.x{a:b}' },
        'a.bin': {
          type: 'asset',
          source: new Uint8Array([1, 2]),
        },
        'b.html': { type: 'asset', source: '<div class="maz:mt-2">' },
      })

      expect(config.logger.warn).toHaveBeenCalledTimes(1)
      const message = config.logger.warn.mock.calls[0]![0] as string
      expect(message).toContain('2 purged classes are in the bundle: maz:flex, maz:mt-2')
      expect(message).not.toContain('...')
    })

    it('then it truncates the list after ten classes', async () => {
      const many: PurgeManifest = {
        version: '1',
        classes: Array.from({ length: 12 }, (_, index) => `maz:c${index}`),
        utilities: [],
        entries: {},
      }
      const root = createProject({ withManifest: false })
      write(join(root, 'node_modules/maz-ui/package.json'), JSON.stringify({
        name: 'maz-ui',
        exports: { './purge-manifest.json': './m.json' },
      }))
      write(join(root, 'node_modules/maz-ui/m.json'), JSON.stringify(many))
      const config = createConfig(root)
      const hooks = MazUiPurgeCss() as unknown as Hooks
      hooks.configResolved(config as unknown as ResolvedConfig)
      hooks.buildStart()
      await hooks.transform(many.classes.map(name => `.${name.replace(':', '\\:')}{a:b}`).join(''), '/a/style.css')

      hooks.generateBundle({}, {
        'a.js': {
          type: 'chunk',
          code: many.classes.join(' '),
        },
      })

      expect(config.logger.warn.mock.calls[0]![0]).toContain('12 purged classes are in the bundle')
      expect(config.logger.warn.mock.calls[0]![0]).toContain('...')
    })
  })

  describe('when purged classes are not in the bundle', () => {
    it('then it does not warn', async () => {
      const { config, hooks } = setup()
      await hooks.transform(CSS, '/app/style.css')

      hooks.generateBundle({}, {
        'a.js': { type: 'chunk', code: 'nothing' },
      })

      expect(config.logger.warn).not.toHaveBeenCalled()
    })
  })

  describe('when the build closes after a purge', () => {
    it('then it reports the saved size once per file', async () => {
      const { config, hooks } = setup()
      await hooks.transform(CSS, '/app/style.css')
      await hooks.transform(CSS, '/app/style.css?inline')

      hooks.closeBundle()

      expect(config.logger.info).toHaveBeenCalledTimes(1)
      expect(config.logger.info.mock.calls[0]![0]).toMatch(/^\[maz-ui:purge-css\] \d+\.\d kB -> \d+\.\d kB of maz-ui CSS \(-\d+%, 3 unused classes removed\)$/)
    })
  })

  describe('when report is disabled', () => {
    it('then closeBundle prints nothing', async () => {
      const { config, hooks } = setup({ report: false })
      await hooks.transform(CSS, '/app/style.css')

      hooks.closeBundle()

      expect(config.logger.info).not.toHaveBeenCalled()
    })
  })

  describe('when nothing was purged', () => {
    it('then closeBundle prints nothing', () => {
      const { config, hooks } = setup()

      hooks.closeBundle()

      expect(config.logger.info).not.toHaveBeenCalled()
    })
  })

  describe('when the build is a server-side build', () => {
    it('then closeBundle prints nothing', async () => {
      const { config, hooks } = setup({}, { ssr: true })
      await hooks.transform(CSS, '/app/style.css')

      hooks.closeBundle()

      expect(config.logger.info).not.toHaveBeenCalled()
    })
  })
})
