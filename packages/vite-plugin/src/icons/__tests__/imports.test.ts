import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import MagicString from 'magic-string'
import { loadIconIds, rewriteIconImports } from '../imports'
import { write } from './fixtures'

const IDS = new Set(['MazHome', 'MazStar'])

function rewrite(code: string) {
  const output = new MagicString(code)
  const changed = rewriteIconImports(output, code, IDS)
  return {
    changed,
    code: output.toString(),
  }
}

describe('given the imports of @maz-ui/icons', () => {
  describe('when icons are imported from the root', () => {
    it('then the static and the lazy icons are imported from their own module', () => {
      expect(rewrite('import { MazStar, LazyMazHome } from "@maz-ui/icons";\nrender(MazStar)\n').code).toBe([
        'import { MazStar } from "@maz-ui/icons/static/MazStar"; import { MazHome as LazyMazHome } from "@maz-ui/icons/lazy/MazHome";',
        'render(MazStar)',
        '',
      ].join('\n'))
    })
  })

  describe('when icons are imported from a variant, with an alias and on several lines', () => {
    it('then they are imported from the module of the variant', () => {
      expect(rewrite('import {\n  MazStar as Star,\n  MazHome,\n} from \'@maz-ui/icons/raw\'\n').code).toBe(
        'import { MazStar as Star } from \'@maz-ui/icons/raw/MazStar\'; import { MazHome } from \'@maz-ui/icons/raw/MazHome\';\n',
      )
    })
  })

  describe('when the statement imports other exports', () => {
    it('then they stay in the original import', () => {
      expect(rewrite('import { MazStar, MazUnknown } from "@maz-ui/icons/lazy"').code).toBe(
        'import { MazUnknown } from "@maz-ui/icons/lazy"; import { MazStar } from "@maz-ui/icons/lazy/MazStar";',
      )
    })
  })

  describe('when no known icon is imported', () => {
    it('then the code is kept', () => {
      const code = 'import { MazUnknown } from "@maz-ui/icons"\nimport { MazStar } from "@maz-ui/icons/raw/MazStar"\n'

      expect(rewrite(code)).toEqual({ changed: false, code })
    })
  })
})

describe('given the ids of the icons', () => {
  let packageDir: string

  beforeEach(() => {
    packageDir = mkdtempSync(join(tmpdir(), 'maz-icon-ids-'))
  })

  afterEach(() => {
    rmSync(packageDir, { recursive: true, force: true })
  })

  describe('when the package is built', () => {
    it('then they are the modules of dist/raw', () => {
      write(join(packageDir, 'dist/raw/MazStar.js'), '')
      write(join(packageDir, 'dist/raw/MazStar.d.ts'), '')
      write(join(packageDir, 'dist/raw/index.js'), '')

      expect(loadIconIds(packageDir)).toEqual(new Set(['MazStar']))
    })
  })

  describe('when the package only has its sources', () => {
    it('then they are the modules of src/raw', () => {
      write(join(packageDir, 'src/raw/MazHome.ts'), '')

      expect(loadIconIds(packageDir)).toEqual(new Set(['MazHome']))
    })
  })

  describe('when the package has no raw icons', () => {
    it('then there is no id', () => {
      expect(loadIconIds(packageDir)).toEqual(new Set())
    })
  })
})
