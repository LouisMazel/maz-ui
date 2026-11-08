import type { GeneratedFragment, GeneratedKnowledge } from '../generate'

import { posix, resolve } from 'node:path'
import { generateKnowledge, HOMEPAGE, resolveHrefToId } from '../generate'
import { PACKAGE_DEFINITIONS } from '../packages'
import { getSourcePaths } from '../paths'
import { findOutdatedFiles } from '../write'

describe('given resolveHrefToId', () => {
  const knownIds = new Set([
    'components/maz-btn',
    'guide/vue',
    'ecosystem/utils',
    'ecosystem/utils/debounce',
  ])

  describe('when the href is relative with an extension and an anchor', () => {
    it('then resolves it from the source page', () => {
      expect(resolveHrefToId('../guide/vue.md#install', 'components/maz-btn.md', knownIds)).toEqual({ id: 'guide/vue', anchor: '#install' })
    })
  })

  describe('when the href is an absolute site path without extension', () => {
    it('then resolves it', () => {
      expect(resolveHrefToId('/components/maz-btn', 'guide/vue.md', knownIds)).toEqual({ id: 'components/maz-btn', anchor: '' })
    })
  })

  describe('when the href targets a folder index or an html page', () => {
    it('then resolves the index and strips the html extension', () => {
      expect(resolveHrefToId('/ecosystem/utils/', 'guide/vue.md', knownIds)).toEqual({ id: 'ecosystem/utils', anchor: '' })
      expect(resolveHrefToId('./debounce.html', 'ecosystem/utils/index.md', knownIds)).toEqual({ id: 'ecosystem/utils/debounce', anchor: '' })
    })
  })

  describe('when the href is external, an anchor or a mail', () => {
    it('then returns undefined', () => {
      expect(resolveHrefToId('https://maz-ui.com', 'guide/vue.md', knownIds)).toBeUndefined()
      expect(resolveHrefToId('//cdn.example.com/a.js', 'guide/vue.md', knownIds)).toBeUndefined()
      expect(resolveHrefToId('#props', 'guide/vue.md', knownIds)).toBeUndefined()
      expect(resolveHrefToId('mailto:me@example.com', 'guide/vue.md', knownIds)).toBeUndefined()
    })
  })

  describe('when the href targets an unknown page', () => {
    it('then returns undefined', () => {
      expect(resolveHrefToId('./unknown.md', 'guide/vue.md', knownIds)).toBeUndefined()
    })
  })
})

describe('given generateKnowledge', () => {
  describe('when generating the knowledge of the repository', () => {
    let knowledge: GeneratedKnowledge

    beforeAll(async () => {
      knowledge = await generateKnowledge()
    }, 120_000)

    const fragmentOf = (name: string): GeneratedFragment => knowledge.fragments.find(item => item.fragment.package === name) as GeneratedFragment
    const fragmentFile = (name: string, path: string): string | undefined => fragmentOf(name).files.find(file => file.path === path)?.content
    const siteFile = (path: string): string | undefined => knowledge.site.find(file => file.path === path)?.content
    const allFragmentFiles = (): GeneratedKnowledge['site'] => knowledge.fragments.flatMap(item => item.files)
    const markdownFiles = (): GeneratedKnowledge['site'] => [
      ...allFragmentFiles(),
      ...knowledge.site,
    ].filter(file => file.path.endsWith('.md'))

    it('then reports no warning apart from the AI agents guide being written', () => {
      expect(knowledge.warnings.filter(warning => !warning.includes('guide/ai-agents'))).toEqual([])
    })

    it('then produces one valid fragment per published package', () => {
      expect(knowledge.fragments.map(item => item.fragment.package)).toEqual(PACKAGE_DEFINITIONS.map(definition => definition.name))

      for (const { fragment, files } of knowledge.fragments) {
        expect(fragment.schemaVersion).toBe(2)
        expect(fragment.version).toMatch(/^\d+\.\d+\.\d+/)
        expect(fragment.homepage.startsWith(HOMEPAGE)).toBe(true)
        expect(fragment.docs.length, fragment.package).toBeGreaterThan(0)
        expect(fragment.docs.every(doc => doc.package === fragment.package)).toBe(true)
        expect(JSON.parse(files.find(file => file.path === 'manifest.json')?.content as string)).toEqual(fragment)
        expect(files.some(file => file.path === 'README.md')).toBe(true)
      }
    })

    it('then gives the components and the Tailwind tokens to maz-ui only and the icon names to @maz-ui/icons only', () => {
      for (const { fragment } of knowledge.fragments) {
        const isLibrary = fragment.package === 'maz-ui'

        expect(fragment.components.length > 0).toBe(isLibrary)
        expect(fragment.tailwind !== undefined).toBe(isLibrary)
        expect(fragment.icons !== undefined).toBe(fragment.package === '@maz-ui/icons')
      }

      expect(fragmentOf('@maz-ui/icons').fragment.icons?.names).toContain('MazTrash')
    })

    it('then ships the rules and the agent files with maz-ui only', () => {
      for (const path of ['rules.md', 'agents/claude-rule.md', 'agents/agents-md.md']) {
        expect(fragmentFile('maz-ui', path), path).toBeDefined()
        expect(fragmentFile('@maz-ui/themes', path), path).toBeUndefined()
      }

      expect(knowledge.skill.map(file => file.path)).toEqual(['skills/maz-ui/SKILL.md'])
    })

    it('then gives each doc to the fragment of its package', () => {
      const ids = (name: string): string[] => fragmentOf(name).fragment.docs.map(doc => doc.id)

      expect(ids('maz-ui')).toEqual(expect.arrayContaining(['components/maz-btn', 'guide/getting-started', 'reference/tailwind-tokens']))
      expect(ids('@maz-ui/icons')).toEqual(expect.arrayContaining(['ecosystem/icons', 'reference/icons']))
      expect(ids('@maz-ui/utils')).toContain('ecosystem/utils/debounce')
      expect(ids('@maz-ui/upgrade')).toEqual(['ecosystem/upgrade'])
      expect(ids('@maz-ui/eslint-config')).toEqual(['ecosystem/eslint-config'])
    })

    it('then documents every component on a page of maz-ui', () => {
      const { fragment } = fragmentOf('maz-ui')
      const ids = new Set(fragment.docs.map(doc => doc.id))

      for (const component of fragment.components)
        expect(ids.has(component.docId), component.name).toBe(true)
    })

    it('then gives every doc a file of its fragment and a consistent size', () => {
      for (const { fragment, files } of knowledge.fragments) {
        for (const doc of fragment.docs) {
          const content = files.find(file => file.path === doc.file)?.content

          expect(content, doc.id).toBeDefined()
          expect(doc.chars).toBe(content?.length)
        }
      }
    })

    it('then resolves the full API of components with inherited props', () => {
      const { components } = fragmentOf('maz-ui').fragment
      const select = components.find(component => component.name === 'MazSelect')
      const color = components.find(component => component.name === 'MazBtn')?.props.find(prop => prop.name === 'color')

      expect(select?.props.length).toBeGreaterThan(20)
      expect(color?.strictValues).toBe(true)
      expect(color?.values).toContain('primary')
    })

    it('then marks sub-components with their parent', () => {
      expect(fragmentOf('maz-ui').fragment.components.find(component => component.name === 'MazSidebarGroup')?.parent).toBe('MazSidebar')
    })

    it('then never keeps the internal prefix in code fences', () => {
      for (const file of markdownFiles()) {
        let inFence = false

        for (const line of file.content.split('\n')) {
          if (/^\s*(?:`{3,}|~{3,})/.test(line)) {
            inFence = !inFence
            continue
          }

          if (inFence)
            expect(/(?:^|[\s"'`{(,[=])maz:[\w!@[\-*/.(]/.test(line), `${file.path}: ${line}`).toBe(false)
        }
      }
    })

    it('then never contains em or en dashes', () => {
      for (const file of [
        ...allFragmentFiles(),
        ...knowledge.site,
        ...knowledge.skill,
      ])
        expect(/[–—]/.test(file.content), file.path).toBe(false)
    })

    it('then lists the pages with absolute urls in llms.txt', () => {
      expect(siteFile('llms.txt')).toContain(`(${HOMEPAGE}/components/maz-btn.md)`)
      expect(siteFile('llms-full.txt')).toContain(`source: ${HOMEPAGE}/components/maz-btn.md`)
    })

    it('then publishes every page flat on the site without manifest', () => {
      const paths = new Set(knowledge.site.map(file => file.path))

      for (const { fragment } of knowledge.fragments) {
        for (const doc of fragment.docs)
          expect(paths.has(doc.file), doc.id).toBe(true)
      }

      expect(paths.has('manifest.json')).toBe(false)
      expect(paths.has('rules.md')).toBe(true)
      expect(siteFile('README.md')).toContain('## Ecosystem packages')
    })

    it('then only links to files of the same fragment with relative links', () => {
      for (const { fragment, files } of knowledge.fragments) {
        const paths = new Set(files.map(file => file.path))

        for (const file of files.filter(item => item.path.endsWith('.md'))) {
          for (const match of file.content.matchAll(/\]\(([^)\s]+?\.md)(?:#[^)\s]*)?\)/g)) {
            if (/^https?:/.test(match[1]))
              continue

            const target = posix.normalize(posix.join(posix.dirname(file.path), match[1]))

            expect(paths.has(target), `${fragment.package}: ${file.path} -> ${match[1]}`).toBe(true)
          }
        }
      }
    })

    it('then links to the other packages with absolute urls', () => {
      expect(fragmentFile('maz-ui', 'guide/getting-started.md')).toContain(`(${HOMEPAGE}/ecosystem/themes.md`)
      expect(fragmentFile('maz-ui', 'guide/getting-started.md')).not.toContain('(../ecosystem/themes.md')
    })

    it('then generates the references in the fragment of their package', () => {
      expect(fragmentFile('maz-ui', 'reference/tailwind-tokens.md')).toContain('# Tailwind CSS theme reference')
      expect(fragmentFile('@maz-ui/icons', 'reference/icons.md')).toContain('MazTrash')
    })

    it('then lists the other packages in the README of maz-ui', () => {
      const readme = fragmentFile('maz-ui', 'README.md')

      expect(readme).toContain('node_modules/@maz-ui/upgrade/agent-docs/README.md')
      expect(readme).toContain(`${HOMEPAGE}/ecosystem/eslint-config`)
    })

    it('then adds the nuxt auto-import note to components', () => {
      expect(fragmentFile('maz-ui', 'components/maz-btn.md')).toContain('- Nuxt: auto-imported by `@maz-ui/nuxt`')
    })

    it('then the committed Claude Code plugin skill is up to date', () => {
      expect(findOutdatedFiles(resolve(__dirname, '../../../../plugins/claude-code'), knowledge.skill)).toEqual([])
    })

    it('then generates an API table for every component of the website', () => {
      expect(knowledge.vitepress.map(file => file.path)).toContain('maz-select.doc.md')
      expect(knowledge.vitepress.find(file => file.path === 'maz-select.doc.md')?.content).toContain('**option-value-key**')
    })
  })

  describe('when generating the fragment of a package without the site', () => {
    let knowledge: GeneratedKnowledge

    beforeAll(async () => {
      knowledge = await generateKnowledge(getSourcePaths(), {
        packages: ['@maz-ui/themes'],
        site: false,
        vitepress: false,
      })
    }, 120_000)

    it('then builds that fragment only, without component APIs nor site files', () => {
      expect(knowledge.fragments.map(item => item.fragment.package)).toEqual(['@maz-ui/themes'])
      expect(knowledge.fragments[0].fragment.components).toEqual([])
      expect(knowledge.fragments[0].fragment.tailwind).toBeUndefined()
      expect(knowledge.fragments[0].files.some(file => file.path.startsWith('components/'))).toBe(false)
      expect(knowledge.site).toEqual([])
      expect(knowledge.vitepress).toEqual([])
    })

    it('then keeps the links to the other packages absolute and reports no warning', () => {
      const themes = knowledge.fragments[0].files.find(file => file.path === 'ecosystem/themes.md')?.content

      expect(themes).toContain(`](${HOMEPAGE}/`)
      expect(knowledge.warnings).toEqual([])
    })
  })

  describe('when generating only the component API tables', () => {
    it('then builds no fragment', async () => {
      const knowledge = await generateKnowledge(getSourcePaths(), { packages: [], site: false })

      expect(knowledge.fragments).toEqual([])
      expect(knowledge.vitepress.length).toBeGreaterThan(0)
    }, 120_000)
  })

  describe('when generating an unknown package', () => {
    it('then throws with the known packages', async () => {
      await expect(generateKnowledge(getSourcePaths(), {
        packages: ['@maz-ui/unknown'],
      })).rejects.toThrow('Unknown package "@maz-ui/unknown", expected one of: maz-ui, @maz-ui/icons')
    })
  })
})
