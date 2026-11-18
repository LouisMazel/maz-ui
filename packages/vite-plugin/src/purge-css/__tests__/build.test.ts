import type { Rollup } from 'vite'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { build } from 'vite'
import { MazUiPurgeCss } from '../index'

function write(file: string, content: string) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

describe('given a vite build with MazUiPurgeCss', () => {
  let root: string

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'maz-build-'))
    write(join(root, 'package.json'), '{"name":"app","type":"module"}')
    write(join(root, 'node_modules/maz-ui/package.json'), JSON.stringify({
      name: 'maz-ui',
      version: '5.7.0',
      exports: {
        './purge-manifest.json': './purge-manifest.json',
        './style.css': './style.css',
      },
    }))
    write(join(root, 'node_modules/maz-ui/purge-manifest.json'), JSON.stringify({
      version: '5.7.0',
      classes: ['maz:p-2', 'maz:flex'],
      utilities: [],
      entries: {
        'components/MazBtn': {
          aliases: ['MazBtn'],
          classes: [0],
        },
      },
    }))
    write(join(root, 'node_modules/maz-ui/style.css'), '.maz\\:p-2{padding:2px}.maz\\:flex{display:flex}.plain{color:red}')
    write(join(root, 'entry.js'), 'import "maz-ui/style.css"\nconsole.log("MazBtn")\n')
  })

  afterAll(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when the app uses a single component', () => {
    it('then the emitted CSS keeps the used class and drops the unused one', async () => {
      const output = await build({
        root,
        configFile: false,
        logLevel: 'silent',
        plugins: [
          MazUiPurgeCss(),
        ],
        build: {
          write: false,
          rollupOptions: {
            input: join(root, 'entry.js'),
          },
        },
      }) as Rollup.RollupOutput

      const css = output.output.find((file): file is Rollup.OutputAsset => file.type === 'asset' && file.fileName.endsWith('.css'))
      const source = String(css?.source)

      expect(source).toContain('maz\\:p-2')
      expect(source).toContain('.plain')
      expect(source).not.toContain('maz\\:flex')
    })
  })
})
