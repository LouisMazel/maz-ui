import MazMarkdownEditor from '@components/MazMarkdownEditor.vue'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('marked', () => ({
  marked: {
    parse: vi.fn((markdown: string) => Promise.resolve(`<p>${markdown}</p>`)),
  },
}))

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((html: string) => `${html}<!--sanitized-->`),
  },
}))

beforeEach(() => {
  document.execCommand = vi.fn(() => false)
})

function selectAll(wrapper: ReturnType<typeof mount>, from: number, to: number) {
  const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
  textarea.setSelectionRange(from, to)
  return textarea
}

describe('given MazMarkdownEditor component', () => {
  describe('when rendered with a modelValue', () => {
    it('then it renders the textarea with the value', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'hello world' },
      })

      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('hello world')
    })

    it('then it generates a unique id', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'hello' },
      })

      expect(wrapper.vm.instanceId).toBe('MazMarkdownEditor-v-0')
    })
  })

  describe('when the textarea value changes', () => {
    it('then it emits update:model-value and input', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '' },
      })

      await wrapper.find('textarea').setValue('new value')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['new value'])
      expect(wrapper.emitted('input')?.at(-1)).toEqual(['new value'])
    })
  })

  describe('when switching to preview mode', () => {
    it('then it parses and sanitizes the markdown', async () => {
      const { marked } = await import('marked')
      const { default: DOMPurify } = await import('dompurify')
      vi.mocked(marked.parse).mockClear()
      vi.mocked(DOMPurify.sanitize).mockClear()

      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '# Title', mode: 'preview' },
      })
      await flushPromises()

      expect(marked.parse).toHaveBeenCalledWith('# Title', expect.objectContaining({ gfm: true }))
      expect(DOMPurify.sanitize).toHaveBeenCalled()
      expect(wrapper.find('.m-markdown-editor__preview-content').html()).toContain('sanitized')
    })

    it('then it displays the empty preview text when there is nothing to render', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', mode: 'preview' },
      })
      await flushPromises()

      expect(wrapper.find('.m-markdown-editor__preview-empty').exists()).toBe(true)
    })
  })

  describe('when sanitize is disabled', () => {
    it('then it renders the raw markdown output without DOMPurify', async () => {
      const { default: DOMPurify } = await import('dompurify')
      vi.mocked(DOMPurify.sanitize).mockClear()

      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'plain', mode: 'preview', sanitize: false },
      })
      await flushPromises()

      expect(DOMPurify.sanitize).not.toHaveBeenCalled()
      expect(wrapper.find('.m-markdown-editor__preview-content').html()).toContain('<p>plain</p>')
    })
  })

  describe('when a custom renderFunction is provided', () => {
    it('then it uses the custom renderer instead of marked', async () => {
      const { marked } = await import('marked')
      vi.mocked(marked.parse).mockClear()
      const renderFunction = vi.fn(() => '<custom-render></custom-render>')

      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'x', mode: 'preview', sanitize: false, renderFunction },
      })
      await flushPromises()

      expect(renderFunction).toHaveBeenCalledWith('x')
      expect(marked.parse).not.toHaveBeenCalled()
      expect(wrapper.find('.m-markdown-editor__preview-content').html()).toContain('custom-render')
    })
  })

  describe('when the full toolbar is enabled', () => {
    it('then it renders every default action control', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', toolbar: true },
      })

      expect(wrapper.findAll('.m-markdown-editor__toolbar [data-action]')).toHaveLength(13)
      expect(wrapper.find('[data-action="heading"]').exists()).toBe(true)
      expect(wrapper.find('[data-action="table"]').exists()).toBe(true)
    })

    it('then clicking bold wraps the selection with asterisks', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello', toolbar: true } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('[data-action="bold"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['**hello**'])
    })

    it('then clicking italic wraps the selection with underscores', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello', toolbar: true } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('[data-action="italic"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['_hello_'])
    })

    it('then clicking strikethrough wraps the selection with tildes', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello', toolbar: true } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('[data-action="strikethrough"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['~~hello~~'])
    })

    it('then clicking inline code wraps the selection with backticks', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello', toolbar: true } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('[data-action="code"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['`hello`'])
    })

    it('then clicking code block wraps the selection in a fenced block', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'x', toolbar: true } })
      selectAll(wrapper, 0, 1)
      await wrapper.find('[data-action="codeBlock"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['```\nx\n```'])
    })

    it('then clicking quote prefixes the line', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'quote me', toolbar: true } })
      selectAll(wrapper, 0, 0)
      await wrapper.find('[data-action="quote"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['> quote me'])
    })

    it('then clicking the bulleted list prefixes the line', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'item', toolbar: true } })
      selectAll(wrapper, 0, 0)
      await wrapper.find('[data-action="bulletList"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['- item'])
    })

    it('then clicking the numbered list prefixes the line', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'item', toolbar: true } })
      selectAll(wrapper, 0, 0)
      await wrapper.find('[data-action="orderedList"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['1. item'])
    })

    it('then clicking the task list prefixes the line', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'todo', toolbar: true } })
      selectAll(wrapper, 0, 0)
      await wrapper.find('[data-action="checkList"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['- [ ] todo'])
    })

    it('then clicking the link button inserts a markdown link', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'site', toolbar: true } })
      selectAll(wrapper, 0, 4)
      await wrapper.find('[data-action="link"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['[site](url)'])
    })

    it('then clicking the image button inserts a markdown image', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'site', toolbar: true } })
      selectAll(wrapper, 0, 4)
      await wrapper.find('[data-action="image"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['![site](url)'])
    })

    it('then clicking the table button inserts a markdown table', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '', toolbar: true } })
      selectAll(wrapper, 0, 0)
      await wrapper.find('[data-action="table"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['| Header | Header |\n| --- | --- |\n| Cell | Cell |\n'])
    })
  })

  describe('when applyHeading is called', () => {
    it('then it prefixes the line with hashes', () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'item', toolbar: true } })
      selectAll(wrapper, 0, 0)

      wrapper.vm.applyHeading(2)

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['## item'])
    })
  })

  describe('when the heading dropdown items are activated', () => {
    it('then each item applies the matching heading level', () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'title', toolbar: true } })
      selectAll(wrapper, 0, 0)

      wrapper.vm.headingItems[0].onClick()
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['# title'])

      wrapper.vm.headingItems[1].onClick()
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['## title'])

      wrapper.vm.headingItems[2].onClick()
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['### title'])
    })
  })

  describe('when custom translations are provided for every key', () => {
    it('then it uses the overrides as toolbar labels', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: {
          modelValue: '',
          toolbar: true,
          translations: {
            write: 'W',
            preview: 'P',
            split: 'S',
            emptyPreview: 'E',
            toolbar: {
              heading: 'H',
              bold: 'B',
              italic: 'I',
              strikethrough: 'St',
              quote: 'Q',
              code: 'C',
              codeBlock: 'CB',
              link: 'L',
              image: 'Im',
              bulletList: 'BL',
              orderedList: 'OL',
              checkList: 'CL',
              table: 'T',
            },
            headings: { h1: 'H1', h2: 'H2', h3: 'H3' },
          },
        },
      })

      expect(wrapper.find('[data-action="bold"]').attributes('aria-label')).toBe('B')
      expect(wrapper.find('[data-action="table"]').attributes('aria-label')).toBe('T')
    })
  })

  describe('when the toolbar is configured with an array of actions', () => {
    it('then it renders only the requested actions in order', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', toolbar: ['bold', 'link'] },
      })

      const actions = wrapper.findAll('.m-markdown-editor__toolbar [data-action]')
      expect(actions.map(node => node.attributes('data-action'))).toEqual(['bold', 'link'])
      expect(wrapper.find('[data-action="heading"]').exists()).toBe(false)
    })
  })

  describe('when execCommand is supported', () => {
    it('then it relies on the native insertion without emitting from the helper', async () => {
      document.execCommand = vi.fn(() => true)
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello', toolbar: true } })
      selectAll(wrapper, 0, 5)

      await wrapper.find('[data-action="bold"]').trigger('click')

      expect(document.execCommand).toHaveBeenCalledWith('insertText', false, '**hello**')
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('when markedOptions are provided', () => {
    it('then it forwards them to marked', async () => {
      const { marked } = await import('marked')
      vi.mocked(marked.parse).mockClear()

      mount(MazMarkdownEditor, {
        props: { modelValue: 'x', mode: 'preview', markedOptions: { breaks: false } },
      })
      await flushPromises()

      expect(marked.parse).toHaveBeenCalledWith('x', expect.objectContaining({ breaks: false }))
    })
  })

  describe('when the toolbar is disabled', () => {
    it('then it does not render the toolbar', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('.m-markdown-editor__toolbar').exists()).toBe(false)
    })
  })

  describe('when split mode is active', () => {
    it('then it renders the editor and the preview at the same time', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'content', mode: 'split' },
      })
      await flushPromises()

      expect(wrapper.find('textarea').isVisible()).toBe(true)
      expect(wrapper.find('.m-markdown-editor__preview-content').exists()).toBe(true)
    })

    it('then it exposes three mode tabs', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '' },
      })
      await flushPromises()

      expect(wrapper.findAll('.m-markdown-editor__tabs button')).toHaveLength(3)
    })
  })

  describe('when line numbers are enabled', () => {
    it('then it renders one number per line', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'a\nb\nc', lineNumbers: true },
      })

      expect(wrapper.findAll('.m-markdown-editor__gutter span')).toHaveLength(3)
    })

    it('then it syncs the gutter scroll with the textarea', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'a\nb\nc', lineNumbers: true },
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      textarea.scrollTop = 42
      await wrapper.find('textarea').trigger('scroll')

      expect((wrapper.find('.m-markdown-editor__gutter').element as HTMLElement).scrollTop).toBe(42)
    })
  })

  describe('when a state prop is set', () => {
    it('then it applies the matching border color', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', error: true },
      })
      expect(wrapper.vm.borderStyle).toBe('maz:border-destructive')

      await wrapper.setProps({ error: false, warning: true })
      expect(wrapper.vm.borderStyle).toBe('maz:border-warning')

      await wrapper.setProps({ warning: false, success: true })
      expect(wrapper.vm.borderStyle).toBe('maz:border-success')
    })
  })

  describe('when the component is disabled', () => {
    it('then the tab buttons are disabled', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', disabled: true },
      })
      await flushPromises()

      const tabs = wrapper.findAll('.m-markdown-editor__tabs button')
      expect(tabs).toHaveLength(3)
      expect(tabs.every(tab => tab.attributes('disabled') !== undefined)).toBe(true)
    })
  })

  describe('when the textarea emits native events', () => {
    it('then it forwards focus, blur and change', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '' },
      })

      await wrapper.find('textarea').trigger('focus')
      await wrapper.find('textarea').trigger('blur')
      await wrapper.find('textarea').trigger('change')

      expect(wrapper.emitted('focus')).toBeTruthy()
      expect(wrapper.emitted('blur')).toBeTruthy()
      expect(wrapper.emitted('change')).toBeTruthy()
    })
  })

  describe('when keyboard shortcuts are used', () => {
    it('then Cmd/Ctrl+B applies bold', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello' } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'b', metaKey: true })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['**hello**'])
    })

    it('then Ctrl+I applies italic', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello' } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'i', ctrlKey: true })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['_hello_'])
    })

    it('then Cmd+Shift+X applies strikethrough', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello' } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'x', metaKey: true, shiftKey: true })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['~~hello~~'])
    })

    it('then Cmd+Shift+8 applies a bulleted list', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'item' } })
      selectAll(wrapper, 0, 0)
      await wrapper.find('textarea').trigger('keydown', { code: 'Digit8', key: '8', metaKey: true, shiftKey: true })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['- item'])
    })

    it('then Cmd+Alt+1/2/3 applies the matching heading level', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'title' } })
      selectAll(wrapper, 0, 0)

      await wrapper.find('textarea').trigger('keydown', { code: 'Digit1', key: '1', metaKey: true, altKey: true })
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['# title'])

      await wrapper.find('textarea').trigger('keydown', { code: 'Digit2', key: '2', metaKey: true, altKey: true })
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['## title'])

      await wrapper.find('textarea').trigger('keydown', { code: 'Digit3', key: '3', metaKey: true, altKey: true })
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['### title'])
    })

    it('then it ignores a key without a modifier', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello' } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'b' })

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('then it ignores an unmapped modifier combo', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello' } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'z', metaKey: true })

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('then it does nothing when shortcuts are disabled', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello', shortcuts: false } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'b', metaKey: true })

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('then it does nothing while readonly', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello', readonly: true } })
      selectAll(wrapper, 0, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'b', metaKey: true })

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('then the toolbar buttons expose the shortcut in their title', () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '', toolbar: true } })

      expect(wrapper.find('[data-action="bold"]').attributes('title')).toContain('B')
    })

    it('then the toolbar buttons omit the shortcut when shortcuts are disabled', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', toolbar: true, shortcuts: false, translations: { toolbar: { bold: 'Bold' } } },
      })

      expect(wrapper.find('[data-action="bold"]').attributes('title')).toBe('Bold')
    })
  })

  describe('when pressing Enter inside a list', () => {
    it('then it continues a bulleted list', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '- item' } })
      selectAll(wrapper, 6, 6)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['- item\n- '])
    })

    it('then it continues a numbered list with an incremented index', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '1. item' } })
      selectAll(wrapper, 7, 7)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['1. item\n2. '])
    })

    it('then it continues a task list with an unchecked box', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '- [x] done' } })
      selectAll(wrapper, 10, 10)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['- [x] done\n- [ ] '])
    })

    it('then it preserves indentation', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '  - item' } })
      selectAll(wrapper, 8, 8)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['  - item\n  - '])
    })

    it('then it removes the marker on an empty list item', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '- ' } })
      selectAll(wrapper, 2, 2)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([''])
    })

    it('then it leaves a non-list line untouched', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'hello' } })
      selectAll(wrapper, 5, 5)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('then it ignores Enter when a selection is active', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '- item' } })
      selectAll(wrapper, 0, 6)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('then it does nothing while readonly', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: '- item', readonly: true } })
      selectAll(wrapper, 6, 6)
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('when clicking the tabs', () => {
    it('then it switches the active mode', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'content' },
      })
      await flushPromises()

      const tabs = wrapper.findAll('.m-markdown-editor__tabs button')
      await tabs[1].trigger('click')
      expect(wrapper.emitted('update:mode')?.at(-1)).toEqual(['preview'])

      await tabs[2].trigger('click')
      expect(wrapper.emitted('update:mode')?.at(-1)).toEqual(['split'])

      await tabs[0].trigger('click')
      expect(wrapper.emitted('update:mode')?.at(-1)).toEqual(['write'])
    })
  })

  describe('when setMode is called while disabled', () => {
    it('then the mode does not change', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', disabled: true },
      })

      wrapper.vm.setMode('preview')

      expect(wrapper.vm.mode).toBe('write')
      expect(wrapper.emitted('update:mode')).toBeFalsy()
    })
  })

  describe('when a formatting action runs while readonly', () => {
    it('then it does not emit a value change', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'text', readonly: true },
      })

      wrapper.vm.wrapSelection('**')
      wrapper.vm.prefixLines('- ')
      wrapper.vm.insertLink()
      wrapper.vm.insertImage()
      wrapper.vm.insertCodeBlock()
      wrapper.vm.insertTable()

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('when inserting a link without a selection', () => {
    it('then it uses the fallback link label', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', toolbar: true, translations: { toolbar: { link: 'URL' } } },
      })

      selectAll(wrapper, 0, 0)
      await wrapper.find('[data-action="link"]').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['[url](url)'])
    })
  })

  describe('when the renderer throws', () => {
    it('then it falls back to an escaped preview', async () => {
      const renderFunction = vi.fn(() => {
        throw new Error('boom')
      })
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '<script>', mode: 'preview', renderFunction },
      })
      await flushPromises()

      const html = wrapper.find('.m-markdown-editor__preview-content').html()
      expect(html).toContain('&lt;script&gt;')
    })
  })

  describe('when only the label prop is set', () => {
    it('then it renders the label above the editor', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', label: 'My label' },
      })

      expect(wrapper.find('.m-markdown-editor__top-label').text()).toContain('My label')
    })
  })

  describe('when assistive text is set with an error state', () => {
    it('then it renders the assistive text with the error color', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', assistiveText: 'Required field', error: true },
      })

      const bottom = wrapper.find('.m-markdown-editor__bottom-text')
      expect(bottom.text()).toBe('Required field')
      expect(bottom.classes()).toContain('maz:text-destructive-600')
    })
  })

  describe('when sanitization fails', () => {
    it('then it falls back to an escaped preview', async () => {
      const { default: DOMPurify } = await import('dompurify')
      vi.mocked(DOMPurify.sanitize).mockImplementationOnce(() => {
        throw new Error('sanitize failure')
      })

      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '<b>bold', mode: 'preview' },
      })
      await flushPromises()

      expect(wrapper.find('.m-markdown-editor__preview-content').html()).toContain('&lt;b&gt;')
    })
  })

  describe('when a formatting action runs without a textarea', () => {
    it('then it is a no-op', () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'text' } })
      wrapper.unmount()

      expect(() => {
        wrapper.vm.wrapSelection('**')
        wrapper.vm.prefixLines('- ')
        wrapper.vm.insertLink()
        wrapper.vm.insertImage()
        wrapper.vm.insertCodeBlock()
        wrapper.vm.insertTable()
      }).not.toThrow()
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('when the textarea scrolls without line numbers', () => {
    it('then it does not throw', async () => {
      const wrapper = mount(MazMarkdownEditor, { props: { modelValue: 'a\nb' } })

      await expect(wrapper.find('textarea').trigger('scroll')).resolves.not.toThrow()
    })
  })

  describe('when the exposed focus method is called', () => {
    it('then it focuses the textarea', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '' },
        attachTo: document.body,
      })

      wrapper.vm.focus()

      expect(document.activeElement).toBe(wrapper.find('textarea').element)
      wrapper.unmount()
    })
  })
})
