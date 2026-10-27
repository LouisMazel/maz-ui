import type { GeneratedKnowledge } from '../generate'

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateKnowledge } from '../generate'
import { getSourcePaths } from '../paths'

function page(directory: string, path: string, content: string): void {
  const file = join(directory, path)

  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, content)
}

describe('given a documentation folder with mistakes', () => {
  let docsSrc: string
  let knowledge: GeneratedKnowledge

  beforeAll(async () => {
    docsSrc = mkdtempSync(join(tmpdir(), 'agent-docs-warnings-'))

    page(docsSrc, 'components/maz-btn.md', [
      '---',
      'title: MazBtn',
      'description: Button',
      '---',
      '',
      '<!--@include: ./missing-mixin.md-->',
      '<!--@include: ./../../.vitepress/generated-docs/maz-unknown.doc.md-->',
      '',
      'See [the guide](/guide/nowhere) and [the blog](/blog/v5).',
      '',
      '<!--@include: ./../../.vitepress/generated-docs/maz-btn.doc.md-->',
    ].join('\n'))
    page(docsSrc, 'components/maz-not-a-component.md', '---\ntitle: MazNotAComponent\ndescription: Nothing\n---\n\n# Title\n')
    page(docsSrc, 'random/unclassified.md', '# Not part of the bundle\n')

    knowledge = await generateKnowledge({ ...getSourcePaths(), docsSrc })
  }, 120_000)

  afterAll(() => {
    rmSync(docsSrc, { recursive: true, force: true })
  })

  describe('when the knowledge is generated', () => {
    it('then a missing include is reported', () => {
      expect(knowledge.warnings).toContain('components/maz-btn.md: include not found ./missing-mixin.md')
    })

    it('then an include of an unknown component API is reported', () => {
      expect(knowledge.warnings).toContain('components/maz-btn.md: no component API for include ./../../.vitepress/generated-docs/maz-unknown.doc.md')
    })

    it('then a broken internal link is reported', () => {
      expect(knowledge.warnings).toContain('components/maz-btn.md: broken internal link "/guide/nowhere"')
    })

    it('then a link to a page deliberately left out is not reported', () => {
      expect(knowledge.warnings.some(warning => warning.includes('/blog/v5'))).toBe(false)
    })

    it('then a component page without component is reported', () => {
      expect(knowledge.warnings).toContain('components/maz-not-a-component.md: no component named MazNotAComponent')
    })

    it('then the aliases of unknown docs are reported', () => {
      expect(knowledge.warnings).toContain('aliases.ts references the unknown doc "guide/tailwind"')
    })

    it('then unclassified pages are left out of the bundle', () => {
      expect(knowledge.manifest.docs.some(doc => doc.id.startsWith('random/'))).toBe(false)
    })

    it('then components without page still get a generated page', () => {
      expect(knowledge.manifest.docs.some(doc => doc.id === 'components/maz-select')).toBe(true)
    })
  })
})
