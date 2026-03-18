import { MetadataExtractor } from '../MetadataExtractor'

describe('Given MetadataExtractor', () => {
  let extractor: MetadataExtractor

  beforeEach(() => {
    extractor = new MetadataExtractor()
  })

  describe('When extracting frontmatter', () => {
    it('Then extracts title and description from YAML frontmatter', () => {
      const content = `---
title: MazBtn
description: A beautiful button component
---

# MazBtn`

      const result = extractor.extractFrontmatter(content)

      expect(result).toEqual({
        title: 'MazBtn',
        description: 'A beautiful button component',
      })
    })

    it('Then returns empty object when no frontmatter is present', () => {
      const content = '# Just a heading\n\nSome content'

      const result = extractor.extractFrontmatter(content)

      expect(result).toEqual({})
    })

    it('Then extracts only title when description is missing', () => {
      const content = `---
title: MazDialog
---

# Dialog`

      const result = extractor.extractFrontmatter(content)

      expect(result).toEqual({ title: 'MazDialog' })
    })
  })

  describe('When extracting props from generated docs', () => {
    it('Then extracts prop names from the Props table', () => {
      const content = `## Props

| Name | Description | Type | Required | Default |
| ---- | ----------- | ---- | -------- | ------- |
| **size** | The size of the component | \`string\` | No | \`md\` |
| **color** | The color | \`string\` | No | \`primary\` |
| **disabled** | Disable the component | \`boolean\` | No | \`false\` |`

      const result = extractor.extractProps(content)

      expect(result).toEqual(['size', 'color', 'disabled'])
    })

    it('Then returns empty array when no Props section exists', () => {
      const content = '# Component\n\nSome description without props.'

      const result = extractor.extractProps(content)

      expect(result).toEqual([])
    })
  })

  describe('When extracting slots from generated docs', () => {
    it('Then extracts slot names from the Slots table', () => {
      const content = `## Slots

| Name | Description | Bindings |
| ---- | ----------- | -------- |
| default | Default content | |
| header | Header slot | |
| footer | Footer slot | **close** \`Function\` |`

      const result = extractor.extractSlots(content)

      expect(result).toEqual(['default', 'header', 'footer'])
    })
  })

  describe('When extracting events from generated docs', () => {
    it('Then extracts event names from the Events table', () => {
      const content = `## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| close | | emitted when modal is close |
| open | | emitted when modal is open |
| update:model-value | | emitted when value changes |`

      const result = extractor.extractEvents(content)

      expect(result).toEqual(['close', 'open', 'update:model-value'])
    })

    it('Then returns empty array when no Events section exists', () => {
      const content = '# Component\n\nNo events here.'

      const result = extractor.extractEvents(content)

      expect(result).toEqual([])
    })
  })

  describe('When extracting sections', () => {
    it('Then extracts h2 and h3 section titles with leading text', () => {
      const content = `---
title: MazBtn
description: Button component
---

# MazBtn

## Basic usage

Use the button like this.

## Sizes

Use the attribute \`size\` with value mini, xs, sm, md, lg, xl

### Custom sizes

You can also pass custom sizes.`

      const result = extractor.extractSections(content)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({
        title: 'Basic usage',
        level: 2,
        content: 'Use the button like this.',
      })
      expect(result[1]).toEqual({
        title: 'Sizes',
        level: 2,
        content: 'Use the attribute `size` with value mini, xs, sm, md, lg, xl',
      })
      expect(result[2]).toEqual({
        title: 'Custom sizes',
        level: 3,
        content: 'You can also pass custom sizes.',
      })
    })

    it('Then skips HTML elements and code blocks as lead text', () => {
      const content = `## Demo

<ComponentDemo>
  <MazBtn>Click me</MazBtn>
</ComponentDemo>

## Usage

This is the real text.

\`\`\`vue
<MazBtn />
\`\`\``

      const result = extractor.extractSections(content)

      expect(result[0].content).toBe('')
      expect(result[1].content).toBe('This is the real text.')
    })
  })

  describe('When merging manual and extracted tags', () => {
    it('Then combines both tag sets without duplicates', () => {
      const manualTags = ['button', 'btn', 'form']
      const extractedTags = ['maz-btn', 'form', 'prop:size']

      const result = extractor.mergeTags(manualTags, extractedTags)

      expect(result).toContain('button')
      expect(result).toContain('btn')
      expect(result).toContain('form')
      expect(result).toContain('maz-btn')
      expect(result).toContain('prop:size')
      expect(result.filter(t => t === 'form')).toHaveLength(1)
    })

    it('Then lowercases all tags for consistency', () => {
      const result = extractor.mergeTags(['Button', 'FORM'], ['MazBtn'])

      expect(result).toContain('button')
      expect(result).toContain('form')
      expect(result).toContain('mazbtn')
    })
  })

  describe('When calling extract with full content', () => {
    it('Then produces complete DocumentMetadata from component doc', () => {
      const content = `---
title: MazBtn
description: MazBtn is a standalone component that replaces the standard html button
---

# MazBtn

## Basic usage

Use the button component for actions.

## Props

| Name | Description | Type | Required | Default |
| ---- | ----------- | ---- | -------- | ------- |
| **size** | The size | \`string\` | No | \`md\` |
| **color** | The color | \`string\` | No | \`primary\` |

## Slots

| Name | Description | Bindings |
| ---- | ----------- | -------- |
| default | Default content | |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| click | | emitted on click |`

      const result = extractor.extract('maz-btn', 'component', content, ['button', 'btn'])

      expect(result.name).toBe('maz-btn')
      expect(result.displayName).toBe('MazBtn')
      expect(result.type).toBe('component')
      expect(result.description).toBe('MazBtn is a standalone component that replaces the standard html button')
      expect(result.props).toEqual(['size', 'color'])
      expect(result.slots).toEqual(['default'])
      expect(result.events).toEqual(['click'])
      expect(result.tags).toContain('button')
      expect(result.tags).toContain('btn')
      expect(result.tags).toContain('maz-btn')
      expect(result.tags).toContain('prop:size')
      expect(result.tags).toContain('slot:default')
      expect(result.tags).toContain('event:click')
      expect(result.sections.length).toBeGreaterThanOrEqual(1)
    })

    it('Then omits props, slots, events when not present', () => {
      const content = `---
title: Getting Started
description: Install and configure Maz-UI
---

# Getting Started

## Installation

Run npm install maz-ui.`

      const result = extractor.extract('getting-started', 'guide', content)

      expect(result.name).toBe('getting-started')
      expect(result.displayName).toBe('Getting Started')
      expect(result.type).toBe('guide')
      expect(result.props).toBeUndefined()
      expect(result.slots).toBeUndefined()
      expect(result.events).toBeUndefined()
    })

    it('Then generates displayName from name when no frontmatter title', () => {
      const content = '# Some heading\n\nSome paragraph text.'

      const result = extractor.extract('maz-dialog', 'component', content)

      expect(result.displayName).toBe('MazDialog')
      expect(result.description).toBe('Some paragraph text.')
    })

    it('Then extracts first paragraph as description when no frontmatter', () => {
      const content = `# Title

This is the first paragraph of content.

This is the second paragraph.`

      const result = extractor.extract('my-doc', 'guide', content)

      expect(result.description).toBe('This is the first paragraph of content.')
    })
  })
})
