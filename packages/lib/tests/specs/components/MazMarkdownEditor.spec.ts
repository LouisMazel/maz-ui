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

const toolbarTranslations = {
  toolbar: {
    bold: 'Bold',
    italic: 'Italic',
    list: 'List',
    link: 'Link',
    code: 'Code',
  },
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

  describe('when the toolbar is enabled', () => {
    it('then it renders the formatting buttons', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', toolbar: true, translations: toolbarTranslations },
      })

      expect(wrapper.findAll('.m-markdown-editor__toolbar button')).toHaveLength(5)
    })

    it('then clicking bold wraps the selection with asterisks', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'hello', toolbar: true, translations: toolbarTranslations },
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      textarea.setSelectionRange(0, 5)
      await wrapper.findAll('.m-markdown-editor__toolbar button')[0].trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['**hello**'])
    })

    it('then clicking the list button prefixes the line', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'item', toolbar: true, translations: toolbarTranslations },
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      textarea.setSelectionRange(0, 0)
      await wrapper.findAll('.m-markdown-editor__toolbar button')[2].trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['- item'])
    })

    it('then clicking italic wraps the selection with underscores', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'hello', toolbar: true, translations: toolbarTranslations },
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      textarea.setSelectionRange(0, 5)
      await wrapper.findAll('.m-markdown-editor__toolbar button')[1].trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['_hello_'])
    })

    it('then clicking code wraps the selection with backticks', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'hello', toolbar: true, translations: toolbarTranslations },
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      textarea.setSelectionRange(0, 5)
      await wrapper.findAll('.m-markdown-editor__toolbar button')[4].trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['`hello`'])
    })

    it('then clicking the link button inserts a markdown link', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'site', toolbar: true, translations: toolbarTranslations },
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      textarea.setSelectionRange(0, 4)
      await wrapper.findAll('.m-markdown-editor__toolbar button')[3].trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['[site](url)'])
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
    it('then the tab buttons are disabled', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', disabled: true },
      })

      const tabs = wrapper.findAll('.m-markdown-editor__tabs button')
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

  describe('when clicking the tabs', () => {
    it('then it switches the active mode', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: 'content' },
      })

      const tabs = wrapper.findAll('.m-markdown-editor__tabs button')
      await tabs[1].trigger('click')

      expect(wrapper.emitted('update:mode')?.at(-1)).toEqual(['preview'])

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

      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('when inserting a link without a selection', () => {
    it('then it uses the fallback link label', async () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', toolbar: true, translations: { toolbar: { link: 'URL' } } },
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      textarea.setSelectionRange(0, 0)
      await wrapper.findAll('.m-markdown-editor__toolbar button')[3].trigger('click')

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
    it('then it renders the label above the editor with the required asterisk', () => {
      const wrapper = mount(MazMarkdownEditor, {
        props: { modelValue: '', label: 'My label', required: true },
      })

      const topLabel = wrapper.find('.m-markdown-editor__top-label')
      expect(topLabel.text()).toContain('My label')
      expect(topLabel.find('sup').exists()).toBe(true)
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
