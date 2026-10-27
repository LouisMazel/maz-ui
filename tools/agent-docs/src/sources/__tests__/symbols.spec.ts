import type { DocCategory } from '../../types'
import type { SourcePage } from '../pages'

import { getSourcePaths } from '../../paths'
import { extractImports, formatImport, parseExportedNames, resolvePageSymbols } from '../symbols'

const paths = getSourcePaths()

function page(id: string, category: DocCategory, packageName: string, body = ''): SourcePage {
  return {
    file: `/docs/${id}.md`,
    sourcePath: `${id}.md`,
    id,
    category,
    slug: id.split('/').at(-1) as string,
    package: packageName,
    frontmatter: {},
    body,
  }
}

function fence(code: string): string {
  return `\`\`\`ts\n${code}\n\`\`\``
}

describe('given extractImports', () => {
  describe('when the code has default, named, aliased and type imports', () => {
    it('then returns every statement', () => {
      const code = [
        'import MazBtn from \'maz-ui/components/MazBtn\'',
        'import { useToast, useDialog as dialog, type Foo } from "maz-ui/composables"',
        'import type { ThemePreset } from \'@maz-ui/themes\'',
        'import Default, { named } from \'pkg\'',
      ].join('\n')

      expect(extractImports(code)).toEqual([
        { specifier: 'maz-ui/components/MazBtn', names: [], defaultName: 'MazBtn', typeOnly: false },
        { specifier: 'maz-ui/composables', names: ['useToast', 'useDialog', 'Foo'], typeOnly: false },
        { specifier: '@maz-ui/themes', names: ['ThemePreset'], typeOnly: true },
        { specifier: 'pkg', names: ['named'], defaultName: 'Default', typeOnly: false },
      ])
    })
  })
})

describe('given formatImport', () => {
  describe('when the statement has a default and named imports', () => {
    it('then formats a single import line', () => {
      expect(formatImport({ specifier: 'pkg', names: ['a', 'b'], defaultName: 'Def', typeOnly: false })).toBe('import Def, { a, b } from \'pkg\'')
    })
  })

  describe('when the statement is type only', () => {
    it('then keeps the type keyword', () => {
      expect(formatImport({ specifier: '@maz-ui/themes', names: ['ThemePreset'], typeOnly: true })).toBe('import type { ThemePreset } from \'@maz-ui/themes\'')
    })
  })
})

describe('given parseExportedNames', () => {
  const source = [
    'export function debounce() {}',
    'export async function load() {}',
    'export const sleep = () => {}',
    'export class Swipe {}',
    'export type Options = {}',
    'export interface Config {}',
    'export enum Mode { A }',
    'export declare const declared: string',
    'export { internal as publicName, type HiddenType, plain }',
  ].join('\n')

  describe('when all exports are requested', () => {
    it('then returns runtime and type exports', () => {
      expect(parseExportedNames(source)).toEqual(['debounce', 'load', 'sleep', 'Swipe', 'Options', 'Config', 'Mode', 'declared', 'publicName', 'HiddenType', 'plain'])
    })
  })

  describe('when only runtime exports are requested', () => {
    it('then skips types', () => {
      expect(parseExportedNames(source, { runtimeOnly: true })).toEqual(['debounce', 'load', 'sleep', 'Swipe', 'declared', 'publicName', 'plain'])
    })
  })
})

describe('given resolvePageSymbols', () => {
  describe('when the page is a curated ecosystem page', () => {
    it('then returns the curated symbols', () => {
      const result = resolvePageSymbols(page('ecosystem/themes', 'ecosystem', '@maz-ui/themes'), paths)

      expect(result.symbols).toContain('useTheme')
      expect(result.imports[0]).toContain('@maz-ui/themes')
    })
  })

  describe('when the page documents an existing composable', () => {
    it('then returns its deep import', () => {
      expect(resolvePageSymbols(page('composables/use-toast', 'composable', 'maz-ui'), paths)).toEqual({
        symbols: ['useToast'],
        imports: ['import { useToast } from \'maz-ui/composables/useToast\''],
      })
    })
  })

  describe('when the page documents an unknown composable', () => {
    it('then falls back to the imports of its examples', () => {
      const body = fence('import { useNothing } from \'maz-ui/composables\'\nimport { other } from \'vue\'')

      expect(resolvePageSymbols(page('composables/use-nothing', 'composable', 'maz-ui', body), paths)).toEqual({
        symbols: ['useNothing'],
        imports: ['import { useNothing } from \'maz-ui/composables\''],
      })
    })
  })

  describe('when the page documents a directive in a file or a folder', () => {
    it('then returns the directive import', () => {
      expect(resolvePageSymbols(page('directives/tooltip', 'directive', 'maz-ui'), paths).imports).toEqual(['import { vTooltip } from \'maz-ui/directives/vTooltip\''])
      expect(resolvePageSymbols(page('directives/lazy-img', 'directive', 'maz-ui'), paths).symbols).toEqual(['vLazyImg'])
    })
  })

  describe('when the page documents an unknown directive', () => {
    it('then falls back to the examples', () => {
      expect(resolvePageSymbols(page('directives/nothing', 'directive', 'maz-ui'), paths)).toEqual({ symbols: [], imports: [] })
    })
  })

  describe('when the page documents a plugin', () => {
    it('then returns the exported plugin', () => {
      expect(resolvePageSymbols(page('plugins/toast', 'plugin', 'maz-ui'), paths)).toEqual({
        symbols: ['ToastPlugin'],
        imports: ['import { ToastPlugin } from \'maz-ui/plugins/toast\''],
      })
    })
  })

  describe('when the page documents an unknown plugin', () => {
    it('then falls back to the examples', () => {
      expect(resolvePageSymbols(page('plugins/nothing', 'plugin', 'maz-ui'), paths)).toEqual({ symbols: [], imports: [] })
    })
  })

  describe('when a util page imports its helper from the helpers path', () => {
    it('then returns the exports of the most used helper', () => {
      const body = fence('import { formatCurrency } from \'@maz-ui/utils/helpers/formatCurrency\'\nimport { formatCurrency as f } from \'@maz-ui/utils/helpers/formatCurrency\'\nimport { sleep } from \'@maz-ui/utils/helpers/sleep\'')
      const result = resolvePageSymbols(page('ecosystem/utils/currency', 'util', '@maz-ui/utils', body), paths)

      expect(result.symbols).toContain('formatCurrency')
      expect(result.imports[0]).toMatch(/from '@maz-ui\/utils\/helpers\/formatCurrency'$/)
    })
  })

  describe('when a util page imports from the root of @maz-ui/utils', () => {
    it('then maps the imported name to its helper file', () => {
      const body = fence('import { debounce } from \'@maz-ui/utils\'')

      expect(resolvePageSymbols(page('ecosystem/utils/whatever', 'util', '@maz-ui/utils', body), paths).imports).toEqual(['import { debounce } from \'@maz-ui/utils/helpers/debounce\''])
    })
  })

  describe('when a util page has no import but matches a helper file name', () => {
    it('then uses the camelCase or PascalCase file', () => {
      expect(resolvePageSymbols(page('ecosystem/utils/is-equal', 'util', '@maz-ui/utils'), paths).symbols).toEqual(['isEqual'])
      expect(resolvePageSymbols(page('ecosystem/utils/textarea-autogrow', 'util', '@maz-ui/utils'), paths).symbols).toContain('TextareaAutogrow')
    })
  })

  describe('when a util page matches no helper', () => {
    it('then falls back to the examples', () => {
      expect(resolvePageSymbols(page('ecosystem/utils/unknown-helper', 'util', '@maz-ui/utils'), paths)).toEqual({ symbols: [], imports: [] })
    })
  })

  describe('when a util page documents a TypeScript helper', () => {
    it('then returns a type import', () => {
      expect(resolvePageSymbols(page('ecosystem/utils/types/deep-partial', 'util', '@maz-ui/utils'), paths)).toEqual({
        symbols: ['DeepPartial'],
        imports: ['import type { DeepPartial } from \'@maz-ui/utils/ts-helpers/DeepPartial\''],
      })
    })
  })

  describe('when a TypeScript helper page matches no file', () => {
    it('then falls back to the examples', () => {
      expect(resolvePageSymbols(page('ecosystem/utils/types/nothing', 'util', '@maz-ui/utils'), paths)).toEqual({ symbols: [], imports: [] })
    })
  })

  describe('when the page documents a node utility', () => {
    it('then imports it from @maz-ui/node', () => {
      expect(resolvePageSymbols(page('ecosystem/node/logger', 'node', '@maz-ui/node'), paths).imports[0]).toMatch(/^import \{ .*logger.* \} from '@maz-ui\/node'$/)
    })
  })

  describe('when the page documents an unknown node utility', () => {
    it('then falls back to the examples', () => {
      expect(resolvePageSymbols(page('ecosystem/node/nothing', 'node', '@maz-ui/node'), paths)).toEqual({ symbols: [], imports: [] })
    })
  })

  describe('when the page is a guide', () => {
    it('then returns no symbol even if its examples import some', () => {
      const body = fence('import MazBtn from \'maz-ui/components/MazBtn\'')

      expect(resolvePageSymbols(page('guide/getting-started', 'guide', 'maz-ui', body), paths)).toEqual({ symbols: [], imports: [] })
    })
  })

  describe('when the page is an ecosystem page without curated symbols', () => {
    it('then keeps the imports of its own package only', () => {
      const body = fence([
        'import Default, { a } from \'@maz-ui/new\'',
        'import { b } from \'@maz-ui/new/sub\'',
        'import { c } from \'@maz-ui/other\'',
        'import { d } from \'@maz-ui/new\'',
        'import { e } from \'@maz-ui/new\'',
        'import { f } from \'@maz-ui/new\'',
      ].join('\n'))

      expect(resolvePageSymbols(page('ecosystem/new', 'ecosystem', '@maz-ui/new', body), paths)).toEqual({
        symbols: ['Default', 'a', 'b', 'd', 'e', 'f'],
        imports: [
          'import Default, { a } from \'@maz-ui/new\'',
          'import { b } from \'@maz-ui/new/sub\'',
          'import { d } from \'@maz-ui/new\'',
          'import { e } from \'@maz-ui/new\'',
        ],
      })
    })
  })
})
