import type { CleanMarkdownContext } from '../clean'

import {
  cleanMarkdown,
  extractCodeBlocks,
  extractHeadings,
  normalizeBlankLines,
  normalizeDashes,
  resolveIncludes,
  stripInternalPrefix,
  stripLeadingTitle,
} from '../clean'

function createContext(overrides: Partial<CleanMarkdownContext> = {}): CleanMarkdownContext {
  return {
    frontmatter: { title: 'MazBtn', description: 'A button component' },
    resolveInclude: () => undefined,
    resolveLink: () => undefined,
    ...overrides,
  }
}

describe('given stripInternalPrefix', () => {
  describe('when a class list uses the maz: prefix', () => {
    it('then removes the prefix from every class', () => {
      expect(stripInternalPrefix('<div class="maz:flex maz:gap-2">')).toBe('<div class="flex gap-2">')
    })
  })

  describe('when the prefix is combined with variants', () => {
    it('then keeps the variants', () => {
      expect(stripInternalPrefix('class="maz:hover:bg-surface-600 maz:dark:text-muted"')).toBe('class="hover:bg-surface-600 dark:text-muted"')
    })
  })

  describe('when the prefix is used with arbitrary values and important modifiers', () => {
    it('then strips it', () => {
      expect(stripInternalPrefix('@apply maz:text-[0.7rem] maz:!flex;')).toBe('@apply text-[0.7rem] !flex;')
    })
  })

  describe('when prose mentions the prefix in inline code', () => {
    it('then leaves it untouched', () => {
      expect(stripInternalPrefix('Never use the `maz:` prefix')).toBe('Never use the `maz:` prefix')
    })
  })

  describe('when an object key is named maz', () => {
    it('then leaves it untouched', () => {
      expect(stripInternalPrefix('plugins: { maz: mazPlugin }')).toBe('plugins: { maz: mazPlugin }')
    })
  })

  describe('when the line starts with the prefix', () => {
    it('then strips it', () => {
      expect(stripInternalPrefix('maz:flex')).toBe('flex')
    })
  })
})

describe('given resolveIncludes', () => {
  describe('when a line is an include directive', () => {
    it('then replaces it with the included content', () => {
      const context = createContext({ resolveInclude: path => (path === './a.md' ? 'Included A' : undefined) })

      expect(resolveIncludes('Before\n<!--@include: ./a.md-->\nAfter', context)).toBe('Before\nIncluded A\nAfter')
    })
  })

  describe('when includes are nested', () => {
    it('then resolves them recursively', () => {
      const files: Record<string, string> = {
        'a.md': 'A\n<!--@include: b.md-->',
        'b.md': 'B',
      }
      const context = createContext({ resolveInclude: path => files[path] })

      expect(resolveIncludes('<!-- @include: a.md -->', context)).toBe('A\nB')
    })
  })

  describe('when the include is missing', () => {
    it('then removes the directive', () => {
      expect(resolveIncludes('Start\n<!--@include: missing.md-->\nEnd', createContext())).toBe('Start\n\nEnd')
    })
  })

  describe('when an include includes itself', () => {
    it('then stops at the maximum depth', () => {
      const resolveInclude = vi.fn(() => 'Loop\n<!--@include: loop.md-->')
      const result = resolveIncludes('<!--@include: loop.md-->', createContext({ resolveInclude }))

      expect(resolveInclude).toHaveBeenCalledTimes(6)
      expect(result.split('Loop').length - 1).toBe(6)
    })
  })
})

describe('given cleanMarkdown', () => {
  describe('when the page uses frontmatter mustaches', () => {
    it('then replaces title and description and removes other expressions', () => {
      const result = cleanMarkdown('# {{ $frontmatter.title }}\n\n{{ $frontmatter.description }}\n\nSizes: {{ sizes.join(", ") }}', createContext())

      expect(result).toBe('# MazBtn\n\nA button component\n\nSizes:\n')
    })
  })

  describe('when the frontmatter has no title nor description', () => {
    it('then the mustaches become empty', () => {
      const result = cleanMarkdown('Title: {{ $frontmatter.title }} - {{ $frontmatter.description }}', createContext({ frontmatter: {} }))

      expect(result).toBe('Title:  -\n')
    })
  })

  describe('when a ComponentDemo contains a live demo and a code slot', () => {
    const source = [
      '## Basic usage',
      '',
      '<ComponentDemo expanded title="Demo title">',
      '  <MazBtn class="maz:flex">Button</MazBtn>',
      '',
      '  <template #code>',
      '',
      '  ```vue',
      '  <template>',
      '    <MazBtn class="maz:flex">Button</MazBtn>',
      '  </template>',
      '  ```',
      '',
      '  </template>',
      '</ComponentDemo>',
      '',
      'After the demo',
    ].join('\n')

    it('then keeps only the code fence, dedented and without the internal prefix', () => {
      const result = cleanMarkdown(source, createContext())

      expect(result).toBe([
        '## Basic usage',
        '',
        '**Demo title**',
        '',
        '```vue',
        '<template>',
        '  <MazBtn class="flex">Button</MazBtn>',
        '</template>',
        '```',
        '',
        'After the demo',
        '',
      ].join('\n'))
    })
  })

  describe('when a demo uses a multi-line self-closing tag', () => {
    it('then drops the whole tag', () => {
      const source = [
        'Intro',
        '',
        '<MazAvatar',
        '  src="https://example.com/a.png"',
        '  size="2rem"',
        '/>',
        '',
        'Outro',
      ].join('\n')

      expect(cleanMarkdown(source, createContext())).toBe('Intro\n\nOutro\n')
    })
  })

  describe('when attributes contain quotes and arrows', () => {
    it('then the html block ends at the real closing tag', () => {
      const source = [
        '<div class="demo">',
        '  <MazBtn @click="() => count > 1 ? reset() : increment()">Go</MazBtn>',
        '  <!-- a comment with <div> inside -->',
        '  <br>',
        '</div>',
        '',
        'Kept paragraph',
      ].join('\n')

      expect(cleanMarkdown(source, createContext())).toBe('Kept paragraph\n')
    })
  })

  describe('when an html block is never closed', () => {
    it('then drops the rest of the page', () => {
      expect(cleanMarkdown('Text\n\n<div>\n  unclosed', createContext())).toBe('Text\n')
    })
  })

  describe('when the page has script and style blocks', () => {
    it('then removes them', () => {
      const source = [
        '<script setup lang="ts">',
        'const sizes = [\'sm\', \'md\']',
        '</script>',
        '',
        'Content',
        '',
        '<style scoped>',
        '.demo { color: red; }',
        '</style>',
      ].join('\n')

      expect(cleanMarkdown(source, createContext())).toBe('Content\n')
    })
  })

  describe('when the page uses VitePress containers', () => {
    it('then turns them into labelled paragraphs', () => {
      const source = [
        '::: tip',
        'A tip',
        ':::',
        '',
        '::: info Good to know',
        'An info',
        ':::',
        '',
        '::: warning',
        'A warning',
        ':::',
        '',
        '::: details Show code',
        'Hidden',
        ':::',
        '',
        '::: danger',
        'Danger',
        ':::',
        '',
        '::: custom-box',
        'Custom',
        ':::',
      ].join('\n')

      expect(cleanMarkdown(source, createContext())).toBe([
        '**Tip:**',
        '',
        'A tip',
        '',
        '**Note: Good to know**',
        '',
        'An info',
        '',
        '**Warning:**',
        '',
        'A warning',
        '',
        '**Details: Show code**',
        '',
        'Hidden',
        '',
        '**Danger:**',
        '',
        'Danger',
        '',
        '**Custom-box:**',
        '',
        'Custom',
        '',
      ].join('\n'))
    })
  })

  describe('when the page uses a code group', () => {
    it('then keeps the fences without the container markers', () => {
      const source = ['::: code-group', '', '```bash [pnpm]', 'pnpm add maz-ui', '```', '', ':::'].join('\n')

      expect(cleanMarkdown(source, createContext())).toBe('```bash [pnpm]\npnpm add maz-ui\n```\n')
    })
  })

  describe('when the page contains links', () => {
    it('then rewrites resolved links and keeps the label of the others', () => {
      const context = createContext({ resolveLink: href => (href === './maz-icon.md' ? '../components/maz-icon.md' : undefined) })
      const result = cleanMarkdown('See [MazIcon](./maz-icon.md "title") and [Removed](./removed.md).', context)

      expect(result).toBe('See [MazIcon](../components/maz-icon.md) and Removed.\n')
    })
  })

  describe('when a link label contains inline code', () => {
    it('then rewrites the link and keeps the code label', () => {
      const context = createContext({ resolveLink: href => (href === '../ecosystem/icons/' ? '../ecosystem/icons/index.md' : undefined) })
      const result = cleanMarkdown('Use [`@maz-ui/icons`](../ecosystem/icons/) or [`gone`](./gone.md)', context)

      expect(result).toBe('Use [`@maz-ui/icons`](../ecosystem/icons/index.md) or `gone`\n')
    })
  })

  describe('when inline code shows link and image syntax', () => {
    it('then leaves the code untouched', () => {
      const resolveLink = vi.fn(() => 'rewritten')
      const result = cleanMarkdown('| `link` | `[text](url)` | `![alt](url)` |', createContext({ resolveLink }))

      expect(result).toBe('| `link` | `[text](url)` | `![alt](url)` |\n')
      expect(resolveLink).not.toHaveBeenCalled()
    })
  })

  describe('when the page contains images', () => {
    it('then removes them', () => {
      expect(cleanMarkdown('Look ![screenshot](/img/a.png) here', createContext())).toBe('Look  here\n')
    })
  })

  describe('when prose contains inline html and inline code', () => {
    it('then strips the html and keeps the inline code', () => {
      const result = cleanMarkdown('Use <strong>this</strong><br/>with `<MazBtn>` and <MazBadge>new</MazBadge>', createContext())

      expect(result).toBe('Use this with `<MazBtn>` and new\n')
    })
  })

  describe('when a dropped html block contains internal links', () => {
    it('then keeps them as a markdown list with the target titles', () => {
      const source = [
        'Choose your framework:',
        '',
        '<div class="cards">',
        '  <MazCard href="/guide/vue">Vue</MazCard>',
        '  <MazCard href="/ecosystem/nuxt">Nuxt</MazCard>',
        '  <MazBtn href="/guide/vue">Vue again</MazBtn>',
        '  <a href="https://github.com">GitHub</a>',
        '  <a href="/unknown">Unknown</a>',
        '</div>',
      ].join('\n')
      const titles: Record<string, string> = { '/guide/vue': 'Vue guide', '/ecosystem/nuxt': 'Nuxt module' }
      const context = createContext({
        resolveLink: href => (href === '/unknown' ? undefined : `.${href}.md`),
        linkTitle: href => titles[href],
      })

      expect(cleanMarkdown(source, context)).toBe([
        'Choose your framework:',
        '',
        '- [Vue guide](./guide/vue.md)',
        '- [Nuxt module](./ecosystem/nuxt.md)',
        '',
      ].join('\n'))
    })
  })

  describe('when a dropped html block has links but no title resolver', () => {
    it('then drops the links', () => {
      const context = createContext({ resolveLink: href => href })

      expect(cleanMarkdown('<div><a href="/guide/vue">Vue</a></div>\n\nText', context)).toBe('Text\n')
    })
  })

  describe('when a line is an autolink', () => {
    it('then keeps it as prose', () => {
      expect(cleanMarkdown('<https://maz-ui.com>', createContext())).toBe('<https://maz-ui.com>\n')
    })
  })

  describe('when a heading has a custom anchor', () => {
    it('then removes the anchor', () => {
      expect(cleanMarkdown('## Quick Start {#quick-start}', createContext())).toBe('## Quick Start\n')
    })
  })

  describe('when the page contains em and en dashes', () => {
    it('then replaces them with a hyphen', () => {
      expect(cleanMarkdown('A — B and 1–2', createContext())).toBe('A - B and 1-2\n')
    })
  })

  describe('when a code fence uses the internal prefix outside a demo', () => {
    it('then strips the prefix inside the fence only', () => {
      const source = 'Prose `maz:flex`\n\n~~~html\n<div class="maz:p-4"></div>\n~~~'

      expect(cleanMarkdown(source, createContext())).toBe('Prose `maz:flex`\n\n~~~html\n<div class="p-4"></div>\n~~~\n')
    })
  })

  describe('when a fence contains a shorter closing marker', () => {
    it('then keeps reading the fence until the matching marker', () => {
      const source = '````md\n```js\ncode\n```\n````\n\n<div>dropped</div>'

      expect(cleanMarkdown(source, createContext())).toBe('````md\n```js\ncode\n```\n````\n')
    })
  })

  describe('when a demo contains a fence with a nested closing tag', () => {
    it('then keeps the fence intact', () => {
      const source = [
        '<ComponentDemo>',
        '<template #code>',
        '',
        '```html',
        '</ComponentDemo>',
        '```',
        '',
        '</template>',
        '</ComponentDemo>',
      ].join('\n')

      expect(cleanMarkdown(source, createContext())).toBe('```html\n</ComponentDemo>\n```\n')
    })
  })
})

describe('given normalizeDashes', () => {
  describe('when the text has spaced and unspaced em dashes', () => {
    it('then replaces them with a spaced hyphen', () => {
      expect(normalizeDashes('a—b — c')).toBe('a - b - c')
    })
  })
})

describe('given normalizeBlankLines', () => {
  describe('when the markdown has trailing spaces and many blank lines', () => {
    it('then trims lines and collapses blank lines', () => {
      expect(normalizeBlankLines('\n\nA  \n\n\n\nB\t\n\n')).toBe('A\n\nB\n')
    })
  })
})

describe('given stripLeadingTitle', () => {
  describe('when the page starts with the title and the description', () => {
    it('then removes both', () => {
      expect(stripLeadingTitle('\n# MazBtn\n\nA button component\n\n## Usage', 'A button component')).toBe('## Usage\n')
    })
  })

  describe('when the first paragraph differs from the description', () => {
    it('then keeps the paragraph', () => {
      expect(stripLeadingTitle('# MazBtn\n\nAnother intro', 'A button component')).toBe('Another intro\n')
    })
  })

  describe('when there is no title nor description', () => {
    it('then returns the normalized markdown', () => {
      expect(stripLeadingTitle('Intro\n\n\n\nText')).toBe('Intro\n\nText\n')
    })
  })
})

describe('given extractHeadings', () => {
  describe('when the markdown has headings and fenced code', () => {
    it('then returns the headings outside the fences with their level', () => {
      const markdown = '# Title\n\n## **Usage**\n\n```md\n## Not a heading\n```\n\n### `props` ###'

      expect(extractHeadings(markdown)).toEqual([
        { level: 1, title: 'Title', line: 0 },
        { level: 2, title: 'Usage', line: 2 },
        { level: 3, title: 'props', line: 8 },
      ])
    })
  })
})

describe('given extractCodeBlocks', () => {
  describe('when the markdown has several fences', () => {
    it('then returns their content', () => {
      const markdown = 'Text\n\n```ts\nconst a = 1\n```\n\n````md\n```js\nb\n```\n````\n\n```\nunclosed'

      expect(extractCodeBlocks(markdown)).toEqual(['const a = 1', '```js\nb\n```'])
    })
  })
})
