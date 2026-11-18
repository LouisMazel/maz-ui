import type { Rollup } from 'vite'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { build } from 'vite'
import { svgLoader } from '../plugin'

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
})
