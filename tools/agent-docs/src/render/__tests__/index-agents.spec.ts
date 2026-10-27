import type { DocEntry } from '../../types'

import { parseFrontmatter } from '../../markdown/frontmatter'
import { getSourcePaths } from '../../paths'
import { loadAgentContent, renderAgentsMdSection, renderClaudeRule, renderRulesDoc, renderSkill, SKILL_DESCRIPTION } from '../agents'
import { CATEGORY_ORDER, renderBundleIndex, renderLlmsFullTxt, renderLlmsTxt } from '../index'

function doc(overrides: Partial<DocEntry>): DocEntry {
  return {
    id: 'components/maz-btn',
    category: 'component',
    slug: 'maz-btn',
    title: 'MazBtn',
    description: 'A button',
    package: 'maz-ui',
    file: 'components/maz-btn.md',
    symbols: [],
    imports: [],
    aliases: [],
    headings: [],
    related: [],
    chars: 0,
    ...overrides,
  }
}

const docs = [
  doc({}),
  doc({ id: 'guide/tailwind', category: 'guide', slug: 'tailwind', title: 'Tailwind', file: 'guide/tailwind.md', description: 'x'.repeat(300) }),
  doc({ id: 'ecosystem/utils/debounce', category: 'util', slug: 'debounce', title: 'debounce', file: 'ecosystem/utils/debounce.md' }),
]

describe('given CATEGORY_ORDER', () => {
  describe('when listing the categories', () => {
    it('then starts with guides and ends with references', () => {
      expect(CATEGORY_ORDER[0]).toBe('guide')
      expect(CATEGORY_ORDER.at(-1)).toBe('reference')
    })
  })
})

describe('given renderBundleIndex', () => {
  describe('when rendering the bundle README', () => {
    const markdown = renderBundleIndex(docs)

    it('then links the rules and every doc with relative paths in section order', () => {
      expect(markdown).toContain('# maz-ui documentation for AI agents')
      expect(markdown).toContain('[rules.md](rules.md)')
      expect(markdown).toContain('- [MazBtn](components/maz-btn.md): A button')
      expect(markdown.indexOf('## Guides')).toBeLessThan(markdown.indexOf('## Components (maz-ui)'))
      expect(markdown).toContain('## Helpers (@maz-ui/utils)')
      expect(markdown).not.toContain('## Composables')
    })

    it('then truncates long descriptions', () => {
      expect(markdown).toContain(`${'x'.repeat(177)}...`)
    })
  })
})

describe('given renderLlmsTxt', () => {
  describe('when rendering the site index', () => {
    it('then uses absolute markdown urls', () => {
      const markdown = renderLlmsTxt(docs, 'https://maz-ui.com')

      expect(markdown.startsWith('# maz-ui\n')).toBe(true)
      expect(markdown).toContain('- [MazBtn](https://maz-ui.com/components/maz-btn.md): A button')
      expect(markdown).toContain('(https://maz-ui.com/rules.md)')
      expect(markdown).toContain('Documentation of the latest maz-ui release')
    })
  })
})

describe('given renderLlmsFullTxt', () => {
  describe('when rendering the full site content', () => {
    it('then puts the rules first and the source of each page', () => {
      const text = renderLlmsFullTxt([{ doc: docs[0], content: '# MazBtn' }], 'RULES', 'https://maz-ui.com')

      expect(text).toBe('<SYSTEM>Full documentation of maz-ui (https://maz-ui.com). Rules first, then every page.</SYSTEM>\n\nRULES\n\n---\nsource: https://maz-ui.com/components/maz-btn.md\n---\n\n# MazBtn')
    })
  })
})

describe('given the agent content renderers', () => {
  const content = { rules: 'Use **maz-ui**.', workflow: '### Workflow\n\n1. Search' }
  const versionNote = '> These rules and the docs in `node_modules/maz-ui/docs` match the installed version of maz-ui (`node_modules/maz-ui/package.json`).'

  describe('when rendering the rules doc', () => {
    it('then adds a frontmatter, a title and the version note without version number', () => {
      const markdown = renderRulesDoc(content)
      const { frontmatter, body } = parseFrontmatter(markdown)

      expect(frontmatter.title).toBe('maz-ui rules for AI agents')
      expect(body).toBe(`\n# maz-ui rules for AI agents\n\n${versionNote}\n\nUse **maz-ui**.\n`)
    })
  })

  describe('when rendering the Claude rule and the AGENTS.md section', () => {
    it('then adds the title without version, setupAgents adds the installed one', () => {
      expect(renderClaudeRule(content)).toBe('# maz-ui\n\nUse **maz-ui**.\n')
      expect(renderAgentsMdSection(content)).toBe('## maz-ui\n\nUse **maz-ui**.\n')
    })
  })

  describe('when rendering the plugin skill', () => {
    it('then adds the skill frontmatter, the rules and the workflow without version', () => {
      const { frontmatter, body } = parseFrontmatter(renderSkill(content))

      expect(frontmatter).toEqual({ name: 'maz-ui', description: SKILL_DESCRIPTION })
      expect(body).toBe('\n# maz-ui\n\nUse **maz-ui**.\n\n### Workflow\n\n1. Search\n')
      expect(SKILL_DESCRIPTION.length).toBeLessThanOrEqual(1024)
    })
  })

  describe('when loading the authored content', () => {
    it('then reads trimmed rules and workflow', () => {
      const loaded = loadAgentContent(getSourcePaths().content)

      expect(loaded.rules.startsWith('This project is built with **maz-ui**')).toBe(true)
      expect(loaded.rules).not.toContain('{{')
      expect(loaded.workflow.startsWith('### Workflow')).toBe(true)
    })
  })
})
