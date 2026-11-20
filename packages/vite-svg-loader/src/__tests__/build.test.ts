import type { Rollup } from 'vite'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { build } from 'vite'
import { svgLoader } from '../plugin.ts'

function write(file: string, content: string) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

describe('given a vite build with svgLoader', () => {
  let root: string

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'maz-svg-build-'))
    write(join(root, 'icons/logo.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><clipPath id="clip"><rect width="24" height="24"/></clipPath></defs><path clip-path="url(#clip)" d="M0 0h24v24H0z"/></svg>')
    write(join(root, 'entry.js'), 'import raw from "./icons/logo.svg?raw"\nimport Logo from "./icons/logo.svg?component"\nexport { Logo, raw }\n')
  })

  afterAll(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when the app imports an SVG as a string and as a component', () => {
    it('then both come from the optimized SVG with prefixed ids', async () => {
      const output = await build({
        root,
        logLevel: 'silent',
        configFile: false,
        plugins: [
          svgLoader(),
        ],
        build: {
          write: false,
          minify: false,
          lib: {
            entry: join(root, 'entry.js'),
            formats: ['es'],
            fileName: 'entry',
          },
          rolldownOptions: {
            external: ['vue'],
          },
        },
      }) as Rollup.RollupOutput[]

      const code = output.flatMap(({ output: chunks }) => chunks).map(chunk => chunk.type === 'chunk'
        ? chunk.code
        : '').join('\n')

      expect(code).toContain('url(#icons-logo__a)')
      expect(code).toContain('"icons-logo__a"')
      expect(code).toContain('from "vue"')
      expect(code).not.toContain('clip"')
    })
  })

  describe('when the app imports an SVG with ?uri and with ?url', () => {
    it('then both are the same module, of one URL', async () => {
      write(join(root, 'uri.js'), 'import uri from "./icons/logo.svg?uri"\nimport url from "./icons/logo.svg?url"\nexport const same = [uri, url]\n')
      const output = await build({
        root,
        logLevel: 'silent',
        configFile: false,
        plugins: [
          svgLoader(),
        ],
        build: {
          write: false,
          minify: false,
          assetsInlineLimit: 0,
          rolldownOptions: {
            input: join(root, 'uri.js'),
            preserveEntrySignatures: 'strict',
          },
        },
      }) as Rollup.RollupOutput
      const entry = output.output.find((chunk): chunk is Rollup.OutputChunk => chunk.type === 'chunk' && chunk.isEntry)!

      expect(entry.code.match(/"[^"]*logo[^"]*\.svg[^"]*"/g)).toEqual([expect.stringMatching(/^"\/assets\/logo-[\w-]+\.svg"$/)])
      expect(entry.code).toMatch(/same = \[(\w+), \1\]/)
      expect(output.output.filter(file => file.type === 'asset' && file.fileName.endsWith('.svg'))).toHaveLength(1)
    })
  })
})
