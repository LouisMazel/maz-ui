import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getSourcePaths } from '../../paths'
import { classifyPage, collectSourcePages, sourcePathToId } from '../pages'

describe('given sourcePathToId', () => {
  describe('when the path is a page or an index', () => {
    it('then removes the extension and the index segment', () => {
      expect(sourcePathToId('components/maz-btn.md')).toBe('components/maz-btn')
      expect(sourcePathToId('ecosystem/utils/index.md')).toBe('ecosystem/utils')
    })
  })
})

describe('given classifyPage', () => {
  describe('when the page belongs to a maz-ui section', () => {
    it('then returns its category and the maz-ui package', () => {
      expect(classifyPage('components/maz-btn.md')).toEqual({ category: 'component', package: 'maz-ui' })
      expect(classifyPage('composables/use-toast.md')).toEqual({ category: 'composable', package: 'maz-ui' })
      expect(classifyPage('directives/tooltip.md')).toEqual({ category: 'directive', package: 'maz-ui' })
      expect(classifyPage('plugins/toast.md')).toEqual({ category: 'plugin', package: 'maz-ui' })
      expect(classifyPage('guide/tailwind.md')).toEqual({ category: 'guide', package: 'maz-ui' })
    })
  })

  describe('when the page belongs to an ecosystem package', () => {
    it('then returns the package', () => {
      expect(classifyPage('ecosystem/utils/index.md')).toEqual({ category: 'ecosystem', package: '@maz-ui/utils' })
      expect(classifyPage('ecosystem/utils/debounce.md')).toEqual({ category: 'util', package: '@maz-ui/utils' })
      expect(classifyPage('ecosystem/node/index.md')).toEqual({ category: 'ecosystem', package: '@maz-ui/node' })
      expect(classifyPage('ecosystem/node/logger.md')).toEqual({ category: 'node', package: '@maz-ui/node' })
      expect(classifyPage('ecosystem/icons/icon-set.md')).toEqual({ category: 'ecosystem', package: '@maz-ui/icons' })
      expect(classifyPage('ecosystem/themes.md')).toEqual({ category: 'ecosystem', package: '@maz-ui/themes' })
    })
  })

  describe('when the page is outside the documented sections', () => {
    it('then returns undefined', () => {
      expect(classifyPage('blog/v5.md')).toBeUndefined()
      expect(classifyPage('ecosystem/unknown.md')).toBeUndefined()
    })
  })
})

describe('given collectSourcePages', () => {
  describe('when reading the maz-ui docs', () => {
    const pages = collectSourcePages(getSourcePaths().docsSrc)

    it('then returns sorted pages with their frontmatter', () => {
      const ids = pages.map(page => page.id)

      expect(ids).toEqual([...ids].sort((a, b) => a.localeCompare(b)))
      expect(pages.find(page => page.id === 'components/maz-btn')?.frontmatter.title).toBe('MazBtn')
    })

    it('then excludes marketing, history and v3 pages', () => {
      const ids = new Set(pages.map(page => page.id))

      for (const excluded of ['index', 'changelog', 'components', 'guide/cli', 'guide/migration-v4', 'blog/v5'])
        expect(ids.has(excluded)).toBe(false)
    })
  })
})

describe('given a page with an invalid frontmatter', () => {
  describe('when the pages are collected', () => {
    it('then the error names the file', () => {
      const docsSrc = mkdtempSync(join(tmpdir(), 'agent-docs-pages-'))

      mkdirSync(join(docsSrc, 'components'))
      writeFileSync(join(docsSrc, 'components/maz-btn.md'), '---\ntitle: MazBtn\ndescription: @maz-ui: the button\n---\n')

      expect(() => collectSourcePages(docsSrc)).toThrow('Invalid frontmatter in components/maz-btn.md')
      rmSync(docsSrc, { recursive: true, force: true })
    })
  })
})
