import type { Plugin } from 'vite'
import type { SvgLoaderOptions } from '../plugin'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { svgLoader } from '../plugin'

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">\n  <path d="M6.12345 18.12345L18 6" stroke="currentColor"/>\n</svg>\n'

let root: string
let file: string

interface LoadHook {
  filter: { id: RegExp }
  handler: (id: string) => Promise<string | undefined>
}

function setup(options?: SvgLoaderOptions) {
  const plugin = svgLoader(options) as Plugin & { load: LoadHook, configResolved: (config: { root: string }) => void }
  plugin.configResolved({ root })
  return plugin
}

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'maz-svg-loader-'))
  file = join(root, 'icon.svg')
  writeFileSync(file, SVG)
})

afterAll(() => {
  rmSync(root, { recursive: true, force: true })
})

describe('given the svgLoader plugin', () => {
  describe('when it is created', () => {
    it('then it runs before the other plugins and filters the SVG ids', () => {
      const plugin = setup()

      expect(plugin.name).toBe('maz-ui:vite-svg-loader')
      expect(plugin.enforce).toBe('pre')
      expect(plugin.load.filter.id.test('/a/icon.svg')).toBe(true)
      expect(plugin.load.filter.id.test('/a/icon.svg?raw')).toBe(true)
      expect(plugin.load.filter.id.test('/a/icon.svg.ts')).toBe(false)
    })
  })

  describe('when a file is imported with ?raw', () => {
    it('then it returns the optimized string', async () => {
      const code = await setup().load.handler(`${file}?raw`)

      expect(code).toBe(`export default ${JSON.stringify('<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path stroke="currentColor" d="M6.123 18.123 18 6"/></svg>')}`)
    })
  })

  describe('when a file is imported with ?raw&skipsvgo', () => {
    it('then it returns the source', async () => {
      expect(await setup().load.handler(`${file}?raw&skipsvgo`)).toBe(`export default ${JSON.stringify(SVG)}`)
    })
  })

  describe('when a file is imported with ?component', () => {
    it('then it returns a component of the optimized SVG', async () => {
      const code = await setup().load.handler(`${file}?component`)

      expect(code).toContain('export default { render }')
      expect(code).toContain('"M6.123 18.123 18 6"')
    })
  })

  describe('when a file is imported with ?skipsvgo', () => {
    it('then it returns a component of the source', async () => {
      const code = await setup().load.handler(`${file}?skipsvgo`)

      expect(code).toContain('export default { render }')
      expect(code).toContain('"M6.12345 18.12345L18 6"')
    })
  })

  describe('when a file is imported without query', () => {
    it('then it is left to Vite by default', async () => {
      expect(await setup().load.handler(file)).toBeUndefined()
    })

    it('then defaultImport decides what it returns', async () => {
      expect(await setup({ defaultImport: 'component' }).load.handler(file)).toContain('export default { render }')
      expect(await setup({ defaultImport: 'raw' }).load.handler(file)).toMatch(/^export default "<svg/)
      expect(await setup({ defaultImport: 'url' }).load.handler(file)).toBeUndefined()
    })
  })

  describe('when a file is imported with a query of Vite', () => {
    it('then it is left to Vite', async () => {
      const plugin = setup({ defaultImport: 'component' })

      expect(await plugin.load.handler(`${file}?url`)).toBeUndefined()
      expect(await plugin.load.handler(`${file}?inline`)).toBeUndefined()
    })
  })

  describe('when the id is not an SVG file', () => {
    it('then it is left to the other plugins', async () => {
      const plugin = setup({ defaultImport: 'component' })

      expect(await plugin.load.handler('/a/icon.svg.ts?raw')).toBeUndefined()
      expect(await plugin.load.handler(join(root, 'missing.svg?raw'))).toBeUndefined()
    })
  })

  describe('when svgo is disabled', () => {
    it('then the source is returned', async () => {
      expect(await setup({ svgo: false }).load.handler(`${file}?raw`)).toBe(`export default ${JSON.stringify(SVG)}`)
    })
  })

  describe('when a svgo config is given', () => {
    it('then it is used', async () => {
      const code = await setup({
        svgoConfig: defaults => ({ ...defaults, floatPrecision: 1 }),
      }).load.handler(`${file}?raw`)

      expect(code).toContain('M6.1 18.1 18 6')
    })
  })
})
