import type { CatalogGroup } from '../../catalog.ts'
import type { PageSymbols } from '../../sources/symbols.ts'
import type { CatalogLookup } from '../catalog.ts'

import { getSourcePaths } from '../../paths.ts'
import { loadAgentContent } from '../agents.ts'
import { catalogProblems, renderCatalog } from '../catalog.ts'

const PAGES: Record<string, PageSymbols> = {
  'composables/use-wait': { symbols: ['useWait'], imports: ['import { useWait } from \'maz-ui/composables/useWait\''] },
  'plugins/wait': { symbols: ['WaitPlugin'], imports: ['import { WaitPlugin } from \'maz-ui/plugins/wait\''] },
  'ecosystem/utils/camel-case': { symbols: ['camelCase'], imports: ['import { camelCase } from \'@maz-ui/utils/helpers/camelCase\''] },
  'ecosystem/utils/kebab-case': { symbols: ['kebabCase'], imports: ['import { kebabCase } from \'@maz-ui/utils/helpers/kebabCase\''] },
  'ecosystem/utils/cookie': { symbols: ['getCookie', 'setCookie'], imports: ['import { getCookie, setCookie } from \'@maz-ui/utils/helpers/cookie\''] },
  'ecosystem/themes': { symbols: ['useTheme', 'definePreset'], imports: ['import { definePreset, useTheme } from \'@maz-ui/themes\''] },
  'ecosystem/utils/no-import': { symbols: ['noImport'], imports: [] },
}

const lookup: CatalogLookup = id => PAGES[id]

function catalogOf(needs: CatalogGroup['needs']): CatalogGroup[] {
  return [{ title: 'Tools', needs }]
}

describe('given the catalog of the ecosystem by need', () => {
  describe('when it is rendered', () => {
    const rendered = renderCatalog(catalogOf([
      { need: 'shared loading state', docs: ['composables/use-wait', 'plugins/wait'] },
      { need: 'change the case', docs: ['ecosystem/utils/camel-case', 'ecosystem/utils/kebab-case'] },
      { need: 'cookies', docs: ['ecosystem/utils/cookie'] },
      { need: 'dark mode', docs: ['ecosystem/themes'], symbols: ['useTheme'] },
      { need: 'unknown', docs: ['ecosystem/utils/unknown'] },
    ]), lookup)

    it('then it lists each need with the symbols and their import', () => {
      expect(rendered).toContain('### The ecosystem by need')
      expect(rendered).toContain('**Tools**')
      expect(rendered).toContain('- shared loading state: `useWait` (`maz-ui/composables/useWait`), `app.use(WaitPlugin)` once (`maz-ui/plugins/wait`)')
      expect(rendered).toContain('- cookies: `getCookie`, `setCookie` (`@maz-ui/utils/helpers/cookie`)')
    })

    it('then it groups the modules named after their symbol', () => {
      expect(rendered).toContain('- change the case: `camelCase`, `kebabCase` (`@maz-ui/utils/helpers/<name>`)')
    })

    it('then it only keeps the requested symbols', () => {
      expect(rendered).toContain('- dark mode: `useTheme` (`@maz-ui/themes`)')
    })

    it('then it leaves out the needs without a known doc', () => {
      expect(rendered).not.toContain('unknown')
    })
  })

  describe('when it is rendered in its compact form', () => {
    const rendered = renderCatalog(catalogOf([
      { need: 'a `ref` shared by components (or a module) for a loading state (spinner, `disabled`)', docs: ['composables/use-wait', 'plugins/wait'] },
    ]), lookup, { compact: true })

    it('then it lists the symbols without their import nor the examples in parentheses', () => {
      expect(rendered).toContain('- a `ref` shared by components for a loading state (spinner, `disabled`): `useWait`, `app.use(WaitPlugin)`')
      expect(rendered).toContain('`search_docs` gives their import and API')
    })
  })

  describe('when it is checked', () => {
    it('then it reports unknown docs, unknown symbols, needs without import and missing tools', () => {
      const problems = catalogProblems(catalogOf([
        { need: 'loading', docs: ['composables/use-wait', 'composables/use-nope'] },
        { need: 'theme', docs: ['ecosystem/themes'], symbols: ['useNope'] },
        { need: 'no import', docs: ['ecosystem/utils/no-import'] },
      ]), lookup, ['composables/use-wait', 'plugins/wait', 'ecosystem/utils/cookie'], { 'ecosystem/utils/cookie': 'reason', 'ecosystem/utils/gone': 'reason' })

      expect(problems).toEqual([
        'catalog.ts references the unknown doc "composables/use-nope"',
        'catalog.ts: "useNope" is not a symbol of ecosystem/themes',
        'catalog.ts: no import found for "theme"',
        'catalog.ts: no import found for "no import"',
        'plugins/wait is missing from the catalog of the agent rules (tools/agent-docs/src/catalog.ts): add the need it covers, or add it to CATALOG_OMITTED',
        'CATALOG_OMITTED references the unknown doc "ecosystem/utils/gone"',
      ])
    })
  })

  describe('when the rules are loaded with the catalog', () => {
    it('then the catalog replaces its include in the rules and in their core', () => {
      const { rules, rulesCore } = loadAgentContent(getSourcePaths().content, '### The ecosystem by need')

      expect(rules).toContain('\n\n### The ecosystem by need\n\n### Which package for what')
      expect(rulesCore).toContain('\n\n### The ecosystem by need\n\n### Rules')
      expect(rules).not.toContain('@include')
    })
  })
})
