import type { GeneratedKnowledge } from '../generate'

import { posix, resolve } from 'node:path'
import { generateKnowledge, HOMEPAGE, resolveHrefToId } from '../generate'
import { findOutdatedFiles } from '../write'

describe('given resolveHrefToId', () => {
  const knownIds = new Set(['components/maz-btn', 'guide/vue', 'ecosystem/utils', 'ecosystem/utils/debounce'])

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

    const bundleFile = (path: string): string | undefined => knowledge.bundle.find(file => file.path === path)?.content
    const markdownFiles = (): GeneratedKnowledge['bundle'] => knowledge.bundle.filter(file => file.path.endsWith('.md'))

    it('then reports no warning apart from the AI agents guide being written', () => {
      expect(knowledge.warnings.filter(warning => !warning.includes('guide/ai-agents'))).toEqual([])
    })

    it('then produces a valid manifest', () => {
      const { manifest } = knowledge

      expect(manifest.schemaVersion).toBe(1)
      expect(manifest.name).toBe('maz-ui')
      expect(manifest.homepage).toBe(HOMEPAGE)
      expect(manifest.version).toMatch(/^\d+\.\d+\.\d+/)
      expect(manifest.icons.names).toContain('MazTrash')
      expect(manifest.packages.map(entry => entry.name)).toEqual(expect.arrayContaining(['@maz-ui/themes', '@maz-ui/utils']))
      expect(JSON.parse(bundleFile('manifest.json') as string)).toEqual(manifest)
    })

    it('then documents every component on a page', () => {
      const ids = new Set(knowledge.manifest.docs.map(doc => doc.id))

      for (const component of knowledge.manifest.components)
        expect(ids.has(component.docId), component.name).toBe(true)
    })

    it('then gives every doc a file of the bundle and a consistent size', () => {
      for (const doc of knowledge.manifest.docs) {
        const content = bundleFile(doc.file)

        expect(content, doc.id).toBeDefined()
        expect(doc.chars).toBe(content?.length)
      }
    })

    it('then resolves the full API of components with inherited props', () => {
      const select = knowledge.manifest.components.find(component => component.name === 'MazSelect')
      const color = knowledge.manifest.components.find(component => component.name === 'MazBtn')?.props.find(prop => prop.name === 'color')

      expect(select?.props.length).toBeGreaterThan(20)
      expect(color?.strictValues).toBe(true)
      expect(color?.values).toContain('primary')
    })

    it('then marks sub-components with their parent', () => {
      expect(knowledge.manifest.components.find(component => component.name === 'MazSidebarGroup')?.parent).toBe('MazSidebar')
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
      for (const file of [...knowledge.bundle, ...knowledge.site, ...knowledge.skill])
        expect(/[–—]/.test(file.content), file.path).toBe(false)
    })

    it('then ships the index, the rules and the agent files', () => {
      for (const path of ['README.md', 'rules.md', 'agents/claude-rule.md', 'agents/agents-md.md'])
        expect(bundleFile(path), path).toBeDefined()

      expect(knowledge.skill.map(file => file.path)).toEqual(['skills/maz-ui/SKILL.md'])
    })

    it('then lists the pages with absolute urls in llms.txt', () => {
      const llms = knowledge.site.find(file => file.path === 'llms.txt')?.content

      expect(llms).toContain(`(${HOMEPAGE}/components/maz-btn.md)`)
      expect(knowledge.site.find(file => file.path === 'llms-full.txt')?.content).toContain(`source: ${HOMEPAGE}/components/maz-btn.md`)
    })

    it('then only links to files of the bundle', () => {
      const paths = new Set(knowledge.bundle.map(file => file.path))

      for (const file of markdownFiles()) {
        for (const match of file.content.matchAll(/\]\(([^)\s]+?\.md)(?:#[^)\s]*)?\)/g)) {
          if (/^https?:/.test(match[1]))
            continue

          const target = posix.normalize(posix.join(posix.dirname(file.path), match[1]))

          expect(paths.has(target), `${file.path} -> ${match[1]}`).toBe(true)
        }
      }
    })

    it('then generates the references', () => {
      expect(bundleFile('reference/tailwind-tokens.md')).toContain('# Tailwind CSS theme reference')
      expect(bundleFile('reference/icons.md')).toContain('MazTrash')
    })

    it('then adds the nuxt auto-import note to components', () => {
      expect(bundleFile('components/maz-btn.md')).toContain('- Nuxt: auto-imported by `@maz-ui/nuxt`')
    })

    it('then the committed Claude Code plugin skill is up to date', () => {
      expect(findOutdatedFiles(resolve(__dirname, '../../../../plugins/claude-code'), knowledge.skill)).toEqual([])
    })

    it('then generates an API table for every component of the website', () => {
      expect(knowledge.vitepress.map(file => file.path)).toContain('maz-select.doc.md')
      expect(knowledge.vitepress.find(file => file.path === 'maz-select.doc.md')?.content).toContain('**option-value-key**')
    })
  })
})
