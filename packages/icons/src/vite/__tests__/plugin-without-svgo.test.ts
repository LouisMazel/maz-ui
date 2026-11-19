import type { Logger } from 'vite'
import { rmSync } from 'node:fs'
import { MazUiIcons } from '../plugin.ts'
import { createProject, HERO_SVG } from './fixtures.ts'

vi.mock('@maz-ui/vite-svg-loader/optimize', () => {
  throw new Error('Cannot find module \'@maz-ui/vite-svg-loader/optimize\'')
})

type Handler = (...args: any[]) => any

describe('given a project without @maz-ui/vite-svg-loader', () => {
  let root: string

  beforeAll(() => {
    root = createProject({
      files: { 'src/icons/hero.svg': HERO_SVG },
    })
  })

  afterAll(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when a SVG of the project is loaded twice', () => {
    it('then it exports the SVG as it is, with a single warning', async () => {
      const plugin = MazUiIcons({ dts: false })
      const logger = {
        warn: vi.fn(),
        info: vi.fn(),
        error: vi.fn(),
      } as unknown as Logger
      ;(plugin.configResolved as Handler)({ root, logger })
      const load = (plugin.load as { handler: Handler }).handler
      const context = {
        addWatchFile: vi.fn(),
        resolve: vi.fn(),
      }

      const hero = await load.call(context, '\0virtual:maz-icon/hero')
      await load.call(context, '\0virtual:maz-icon/hero')

      expect(hero).toBe(`export default ${JSON.stringify(HERO_SVG)}\n`)
      expect(logger.warn).toHaveBeenCalledExactlyOnceWith('[maz-ui:icons] @maz-ui/vite-svg-loader not found: the SVG are not optimized, install it to run svgo on them', { timestamp: true })
    })
  })
})
