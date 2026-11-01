import type { ServerContext } from '../../context'
import type { DocSearch } from '../../search/engine'

import { cleanTempDirs, createContextFor, createTempDir, fakeDoc, fakeManifest, getContext, getKnowledge, writeFakeBundle, writeFile } from '../../__tests__/helpers'
import { createContext } from '../../context'
import { Knowledge } from '../../knowledge/load'
import { findIcons } from '../find-icons'
import { getComponentApi } from '../get-component-api'
import { getDoc, MAX_FULL_DOC_CHARS } from '../get-doc'
import { getSetupGuide } from '../get-setup-guide'
import { getThemeTokens } from '../get-theme-tokens'
import { describeSource, listDocs } from '../list-docs'
import { formatDocLine, nextCall, searchDocs, WEAK_MATCH_SCORE } from '../search-docs'
import { ToolInputError } from '../types'

function contextWithSearch(hits: Array<{ id: string, score: number }>): ServerContext {
  const context = getContext()
  const search = {
    search: () => hits.map(hit => ({ doc: context.knowledge.docsById.get(hit.id), score: hit.score, matched: [] })),
  } as unknown as DocSearch

  return { ...context, search }
}

function longDocContext(): ServerContext {
  const directory = createTempDir()
  const body = `# MazLong\n\nIntro of the long page\n\n## First section\n\n${'a'.repeat(MAX_FULL_DOC_CHARS)}\n\n## Second section\n\nEnd\n`
  const manifest = fakeManifest({
    docs: [
      fakeDoc({ id: 'components/maz-long', slug: 'maz-long', title: 'MazLong', file: 'components/maz-long.md', symbols: ['MazLong'], related: ['guide/other', 'guide/missing'] }),
      fakeDoc({ id: 'guide/other', slug: 'other', title: 'Other guide', category: 'guide', file: 'guide/other.md', symbols: [] }),
    ],
  })

  writeFakeBundle(directory, manifest, { 'components/maz-long.md': body, 'guide/other.md': '# Other\n\nShort' })

  return createContext({ knowledge: new Knowledge(manifest, { kind: 'custom', directory }), cwd: directory })
}

describe('given search_docs', () => {
  describe('when the query matches docs', () => {
    it('then it lists ranked results with their import and next call', () => {
      const output = searchDocs(getContext(), { query: 'MazBtn', limit: 3 })

      expect(output).toContain(`# maz-ui ${getKnowledge().version} results for "MazBtn"`)
      expect(output).toContain('1. **MazBtn** (component, `components/maz-btn`)')
      expect(output).toContain('import MazBtn from \'maz-ui/components/MazBtn\'')
      expect(output).toContain('get_component_api({ names: ["MazBtn"] })')
    })
  })

  describe('when a category is given', () => {
    it('then the header mentions it', () => {
      expect(searchDocs(getContext(), { query: 'toast', category: 'composable' })).toContain('(category: composable)')
    })
  })

  describe('when nothing matches', () => {
    it('then it suggests other words', () => {
      expect(searchDocs(getContext(), { query: 'the of' })).toContain('No result.')
    })
  })

  describe('when the best result is weak', () => {
    it('then it warns that maz-ui may not provide it', () => {
      const output = searchDocs(contextWithSearch([{ id: 'components/maz-card', score: WEAK_MATCH_SCORE - 1 }]), { query: 'empty state' })

      expect(output).toContain('weak matches')
    })
  })

  describe('when the query is about icons', () => {
    it('then it appends matching icons', () => {
      const output = searchDocs(contextWithSearch([{ id: 'ecosystem/icons', score: 900 }]), { query: 'delete icon' })

      expect(output).toContain('Icons: MazTrash')
    })

    it('then nothing is appended when no icon matches', () => {
      const output = searchDocs(contextWithSearch([{ id: 'ecosystem/icons', score: 900 }]), { query: 'qwxzv icon' })

      expect(output).not.toContain('Icons:')
    })
  })

  describe('when formatting a doc line', () => {
    it('then the next call depends on the doc', () => {
      const docs = getKnowledge().docsById

      expect(nextCall(docs.get('reference/tailwind-tokens')!)).toBe('get_theme_tokens()')
      expect(nextCall(docs.get('reference/icons')!)).toContain('find_icons')
      expect(nextCall(docs.get('guide/vue')!)).toBe('get_doc({ id: "guide/vue" })')
      expect(formatDocLine(docs.get('guide/vue')!)).toMatch(/^- \*\*/)
    })
  })
})

describe('given get_doc', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when the doc is short', () => {
    it('then it returns the whole page without frontmatter, links as ids and related docs', () => {
      const output = getDoc(getContext(), { id: 'useToast' })

      expect(output.startsWith('# useToast')).toBe(true)
      expect(output).not.toContain('.md)')
      expect(output).toContain('Related:')
    })
  })

  describe('when sections are requested', () => {
    it('then only these sections are returned and missing ones are listed', () => {
      const output = getDoc(getContext(), { id: 'composables/use-toast', sections: ['Usage', 'Nope'] })

      expect(output).toContain('# useToast (`composables/use-toast`)')
      expect(output).toContain('## Usage')
      expect(output).toContain('Sections not found: Nope.')
    })

    it('then it throws with the outline when no section exists', () => {
      expect(() => getDoc(getContext(), { id: 'composables/use-toast', sections: ['Nope'] })).toThrow(ToolInputError)
      expect(() => getDoc(getContext(), { id: 'composables/use-toast', sections: ['Nope'] })).toThrow('Available sections')
    })
  })

  describe('when the doc is longer than the maximum', () => {
    it('then it returns the intro, the outline and the hints', () => {
      const output = getDoc(longDocContext(), { id: 'components/maz-long' })

      expect(output).toContain('Intro of the long page')
      expect(output).toContain('This page is long')
      expect(output).toContain('get_component_api({ names: ["MazLong"] })')
      expect(output).toContain('- First section\n- Second section')
      expect(output).toContain('Related: `guide/other` (Other guide)')
      expect(output).not.toContain('guide/missing')
    })

    it('then full returns the whole page', () => {
      expect(getDoc(longDocContext(), { id: 'components/maz-long', full: true })).toContain('## Second section\n\nEnd')
    })
  })

  describe('when a long non component doc has no section', () => {
    it('then it previews the beginning without the API hint', () => {
      const directory = createTempDir()
      const manifest = fakeManifest({ docs: [fakeDoc({ id: 'guide/long', category: 'guide', slug: 'long', title: 'Long', file: 'guide/long.md', symbols: [] })] })

      writeFakeBundle(directory, manifest, { 'guide/long.md': 'b'.repeat(MAX_FULL_DOC_CHARS + 10) })

      const context = createContext({ knowledge: new Knowledge(manifest, { kind: 'custom', directory }), cwd: directory })
      const output = getDoc(context, { id: 'guide/long' })

      expect(output).toContain('This page is long')
      expect(output).not.toContain('get_component_api')
    })
  })

  describe('when the doc does not exist', () => {
    it('then it throws with suggestions', () => {
      expect(() => getDoc(getContext(), { id: 'MazButon' })).toThrow('Closest docs')
    })

    it('then it throws without suggestions when nothing is close', () => {
      expect(() => getDoc(getContext(), { id: 'the of' })).toThrow('No maz-ui doc matches "the of".')
    })
  })
})

describe('given get_component_api', () => {
  describe('when several components are requested', () => {
    it('then it returns each API with an examples hint', () => {
      const output = getComponentApi(getContext(), { names: ['MazBtn', 'maz-dialog', 'MazBtn'] })

      expect(output).toContain('## MazBtn API')
      expect(output).toContain('## MazDialog API')
      expect(output.match(/## MazBtn API/g)).toHaveLength(1)
      expect(output).toContain('Examples: `get_doc({ id: "components/maz-btn" })`')
    })
  })

  describe('when a component is a building block', () => {
    it('then it points to its parent', () => {
      expect(getComponentApi(getContext(), { names: ['MazSidebarGroup'] })).toContain('Building block of `MazSidebar`')
    })
  })

  describe('when some names are unknown', () => {
    it('then they are listed with suggestions', () => {
      const output = getComponentApi(getContext(), { names: ['MazBtn', 'MazButon', 'Qwxzv'] })

      expect(output).toContain('Unknown: MazButon, Qwxzv. Did you mean MazBtn')
    })

    it('then it lists them without suggestion when nothing is close', () => {
      expect(getComponentApi(getContext(), { names: ['MazBtn', 'Qwxzvqwxzv'] })).toContain('Unknown: Qwxzvqwxzv.')
    })
  })

  describe('when every name is unknown', () => {
    it('then it throws with suggestions', () => {
      expect(() => getComponentApi(getContext(), { names: ['MazButon'] })).toThrow('Did you mean: MazBtn')
      expect(() => getComponentApi(getContext(), { names: ['Qwxzvqwxzv', 'Zzzzzzzz'] })).toThrow('Unknown maz-ui components: Qwxzvqwxzv, Zzzzzzzz.')
    })
  })

  describe('when the doc has no API section', () => {
    it('then it falls back to the import', () => {
      const directory = createTempDir()
      const manifest = fakeManifest({
        components: [{ name: 'MazFake', docId: 'components/maz-fake', import: 'import MazFake from \'maz-ui/components/MazFake\'', props: [], events: [], slots: [], expose: [] }],
      })

      writeFakeBundle(directory, manifest)

      const context = createContext({ knowledge: new Knowledge(manifest, { kind: 'custom', directory }), cwd: directory })

      expect(getComponentApi(context, { names: ['MazFake'] })).toContain('## MazFake API\n\n`import MazFake from \'maz-ui/components/MazFake\'`')
      cleanTempDirs()
    })
  })
})

describe('given find_icons', () => {
  describe('when icons match', () => {
    it('then it lists them with the import patterns of the first one', () => {
      const output = findIcons(getContext(), { query: 'settings', limit: 3 })

      expect(output).toContain('- `MazCog`')
      expect(output).toContain('import { MazCog } from \'@maz-ui/icons/static/MazCog\'')
    })
  })

  describe('when the query is an exact icon name', () => {
    it('then the icon comes first', () => {
      expect(findIcons(getContext(), { query: 'mazxmark' })).toContain('- `MazXMark`')
    })
  })

  describe('when no icon matches', () => {
    it('then it suggests close names', () => {
      expect(findIcons(getContext(), { query: 'Trahs' })).toContain('Close names: MazTrash')
      expect(findIcons(getContext(), { query: 'MazTrahs' })).toContain('Close names: MazTrash')
    })

    it('then it gives the naming hints when nothing is close', () => {
      const output = findIcons(getContext(), { query: 'qwxzvqwxzv' })

      expect(output).toContain('No icon matches "qwxzvqwxzv"')
      expect(output).not.toContain('Close names')
    })
  })
})

describe('given get_theme_tokens', () => {
  describe('when no topic is given', () => {
    it('then it returns the whole reference with the extend hint', async () => {
      const output = await getThemeTokens(getContext(), {})

      expect(output).toContain('## Colors')
      expect(output).toContain('## Breakpoints')
      expect(output).toContain('get_doc({ id: "guide/tailwind" })')
    })
  })

  describe('when topics are given', () => {
    it('then only these topics are returned', async () => {
      const output = await getThemeTokens(getContext(), { topics: ['breakpoints', 'utilities'] })

      expect(output).toContain('`mob-s:`')
      expect(output).toContain('`flex-center`')
      expect(output).not.toContain('## Colors')
    })
  })

  describe('when the project extends the theme', () => {
    function projectContext(): ServerContext {
      const directory = createTempDir()

      writeFile(directory, 'package.json', '{}')
      writeFile(directory, 'src/main.css', '@import \'tailwindcss\';\n@import \'maz-ui/tailwindcss/theme.css\';\n@theme {\n  --animate-rise: rise 0.5s ease-out;\n}\n')

      return createContextFor(directory)
    }

    it('then the project theme comes before the maz-ui theme', async () => {
      const output = await getThemeTokens(projectContext(), {})

      expect(output.indexOf('## Your project theme')).toBe(0)
      expect(output.indexOf('| `animate-rise`')).toBeLessThan(output.indexOf('## Colors'))
      cleanTempDirs()
    })

    it('then the project theme follows the topics', async () => {
      const output = await getThemeTokens(projectContext(), { topics: ['typography'] })

      expect(output).toContain('| `animate-rise`')
      expect(output).toContain('Tailwind theme\n')
      cleanTempDirs()
    })

    it('then it can be left out', async () => {
      expect(await getThemeTokens(projectContext(), { project: false })).not.toContain('## Your project theme')
      cleanTempDirs()
    })
  })

  describe('when the bundle has no Tailwind reference', () => {
    it('then it throws', async () => {
      const directory = createTempDir()
      const manifest = fakeManifest()

      writeFakeBundle(directory, manifest)

      const context = createContext({ knowledge: new Knowledge(manifest, { kind: 'custom', directory }), cwd: directory })

      await expect(getThemeTokens(context, {})).rejects.toThrow('does not ship the Tailwind reference')
      cleanTempDirs()
    })
  })

  describe('when a topic has no section', () => {
    it('then it is skipped', async () => {
      const directory = createTempDir()
      const manifest = fakeManifest({ docs: [fakeDoc({ id: 'reference/tailwind-tokens', category: 'reference', file: 'reference/tailwind-tokens.md' })] })

      writeFakeBundle(directory, manifest, { 'reference/tailwind-tokens.md': '# Tokens\n\n## Colors\n\nred\n' })

      const context = createContext({ knowledge: new Knowledge(manifest, { kind: 'custom', directory }), cwd: directory })
      const output = await getThemeTokens(context, { topics: ['colors', 'shadows'] })

      expect(output).toContain('## Colors')
      expect(output).not.toContain('Shadows')
      cleanTempDirs()
    })
  })
})

describe('given list_docs', () => {
  describe('when no category is given', () => {
    it('then it lists every category with counts', () => {
      const output = listDocs(getContext(), {})

      expect(output).toContain('# maz-ui ecosystem catalog')
      expect(output).toMatch(/## Components \(maz-ui\) \(\d+\)/)
      expect(output).toMatch(/## Helpers \(@maz-ui\/utils\) \(\d+\)/)
      expect(output).toContain('`components/maz-btn`')
    })
  })

  describe('when a category is given', () => {
    it('then only this category is listed', () => {
      const output = listDocs(getContext(), { category: 'directive' })

      expect(output).toContain('## Directives (maz-ui) (5)')
      expect(output).not.toContain('## Components')
    })
  })

  describe('when a category has no doc', () => {
    it('then it is omitted', () => {
      const directory = createTempDir()
      const manifest = fakeManifest()

      writeFakeBundle(directory, manifest)

      const context = createContext({ knowledge: new Knowledge(manifest, { kind: 'custom', directory }), cwd: directory })

      expect(listDocs(context, { category: 'node' })).not.toContain('##')
      cleanTempDirs()
    })
  })
})

describe('given describeSource', () => {
  function sourceContext(source: Knowledge['source'], version = '5.0.0'): ServerContext {
    return { knowledge: new Knowledge(fakeManifest({ version }), source) } as ServerContext
  }

  describe('when the docs come from the project', () => {
    it('then it says so', () => {
      expect(describeSource(sourceContext({ kind: 'project', directory: '/p' }))).toContain('read from the project')
    })
  })

  describe('when the docs come from a custom directory', () => {
    it('then it shows the directory', () => {
      expect(describeSource(sourceContext({ kind: 'custom', directory: '/custom' }))).toContain('read from /custom')
    })
  })

  describe('when the bundled docs differ from the project version', () => {
    it('then it warns about the mismatch', () => {
      expect(describeSource(sourceContext({ kind: 'bundled', directory: '/b', projectVersion: '4.0.0' }))).toContain('The project uses maz-ui 4.0.0')
    })
  })

  describe('when the bundled docs are used without mismatch', () => {
    it('then it mentions the bundle', () => {
      expect(describeSource(sourceContext({ kind: 'bundled', directory: '/b', projectVersion: '5.0.0' }))).toBe('Docs of maz-ui 5.0.0 (bundled with @maz-ui/mcp).')
      expect(describeSource(sourceContext({ kind: 'bundled', directory: '/b' }))).toBe('Docs of maz-ui 5.0.0 (bundled with @maz-ui/mcp).')
    })
  })
})

describe('given get_setup_guide', () => {
  describe('when the framework is Nuxt with Tailwind', () => {
    it('then it composes the Nuxt install, the Tailwind setup and the agents step', () => {
      const output = getSetupGuide(getContext(), { framework: 'nuxt' })

      expect(output).toContain('in a Nuxt app')
      expect(output).toContain('@maz-ui/nuxt')
      expect(output).toContain('## Tailwind CSS')
      expect(output).toContain('injectCss: false')
      expect(output).toContain('npx @maz-ui/mcp init')
    })
  })

  describe('when the framework is Vue without Tailwind', () => {
    it('then it composes the Vue install only', () => {
      const output = getSetupGuide(getContext(), { framework: 'vue', tailwind: false })

      expect(output).toContain('in a Vue app')
      expect(output).not.toContain('## Tailwind CSS')
      expect(output).toContain('get_doc({ id: "guide/vue" })')
    })
  })

  describe('when the framework is Vue with Tailwind', () => {
    it('then it does not mention the Nuxt CSS option', () => {
      expect(getSetupGuide(getContext(), { framework: 'vue' })).not.toContain('set `mazUi.css.injectCss: false`')
    })
  })

  describe('when the source docs are missing', () => {
    it('then it still returns the generic steps', () => {
      const directory = createTempDir()
      const manifest = fakeManifest()

      writeFakeBundle(directory, manifest)

      const context = createContext({ knowledge: new Knowledge(manifest, { kind: 'custom', directory }), cwd: directory })

      expect(getSetupGuide(context, { framework: 'vue' })).toContain('## AI agents')
      cleanTempDirs()
    })
  })
})
