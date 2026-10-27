import { fakeDoc } from '../../__tests__/helpers'
import { findSection, linksToDocIds, listSections, outline, sectionContent, stripFrontmatter, truncateText } from '../markdown'

const MARKDOWN = `# Title

Intro

## Basic usage

Text

\`\`\`md
## Not a heading
\`\`\`

### Sizes

Sizes text

## Loading state

Loading text

#### Deep detail

Deep text

## API

API text
`

describe('given stripFrontmatter', () => {
  describe('when the markdown starts with a frontmatter', () => {
    it('then it removes it', () => {
      expect(stripFrontmatter('---\ntitle: x\n---\n\n# Title')).toBe('# Title')
    })
  })

  describe('when there is no frontmatter', () => {
    it('then it returns the markdown unchanged', () => {
      expect(stripFrontmatter('# Title')).toBe('# Title')
    })
  })
})

describe('given linksToDocIds', () => {
  describe('when the doc contains relative links between bundle files', () => {
    it('then they become doc ids, anchors kept', () => {
      const doc = fakeDoc({ file: 'components/maz-btn.md' })
      const markdown = '[Vue](../guide/vue.md#install), [Icons](../ecosystem/icons/index.md), [Self](./maz-avatar.md), [Web](https://maz-ui.com)'

      expect(linksToDocIds(markdown, doc)).toBe('[Vue](guide/vue#install), [Icons](ecosystem/icons), [Self](components/maz-avatar), [Web](https://maz-ui.com)')
    })
  })
})

describe('given the section helpers', () => {
  describe('when sections are listed', () => {
    it('then headings in code fences are ignored and ends are computed by level', () => {
      const sections = listSections(MARKDOWN)

      expect(sections.map(section => section.title)).toEqual(['Basic usage', 'Sizes', 'Loading state', 'Deep detail', 'API'])
      expect(sectionContent(MARKDOWN, sections[0])).toContain('Sizes text')
      expect(sectionContent(MARKDOWN, sections[0])).not.toContain('Loading text')
    })
  })

  describe('when a section is searched', () => {
    it('then it matches exactly, then by prefix, then by inclusion', () => {
      expect(findSection(MARKDOWN, 'basic usage')?.title).toBe('Basic usage')
      expect(findSection(MARKDOWN, 'loading')?.title).toBe('Loading state')
      expect(findSection(MARKDOWN, 'state')?.title).toBe('Loading state')
      expect(findSection(MARKDOWN, 'nothing')).toBeUndefined()
    })
  })

  describe('when the outline is built', () => {
    it('then it lists h2 and indented h3 only', () => {
      expect(outline(MARKDOWN)).toBe('- Basic usage\n  - Sizes\n- Loading state\n- API')
    })
  })
})

describe('given truncateText', () => {
  describe('when the text is longer than the maximum', () => {
    it('then it is cut with an ellipsis', () => {
      expect(truncateText('abcdefghij', 6)).toBe('abc...')
    })
  })

  describe('when the text is short enough', () => {
    it('then it is unchanged', () => {
      expect(truncateText('abc', 6)).toBe('abc')
    })
  })
})
