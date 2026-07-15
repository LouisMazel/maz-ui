import MazCodeHighlight from '@components/MazCodeHighlight.vue'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre class="shiki github-light"><code>highlighted code</code></pre>'),
}))

describe('given MazCodeHighlight component', () => {
  describe('when rendered with code prop', () => {
    it('then it renders the highlighted html', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.html()).toContain('highlighted code')
    })

    it('then it calls shiki codeToHtml with the code', async () => {
      const { codeToHtml } = await import('shiki')
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1', language: 'typescript' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('const x = 1', expect.objectContaining({
        lang: 'typescript',
      }))
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when rendered with default slot', () => {
    it('then it uses slot text as code when code prop is not set', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        slots: { default: 'const y = 2' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('const y = 2', expect.any(Object))
    })

    it('then it extracts nested text from slot children arrays', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        slots: { default: '<span>hello<span> world</span></span>' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith(expect.stringContaining('hello'), expect.any(Object))
    })

    it('then it handles a slot with no children gracefully', async () => {
      const wrapper = mount(MazCodeHighlight, {
        slots: { default: () => [] },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight').exists()).toBe(true)
    })

    it('then code prop takes priority over slot content', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        props: { code: 'prop code' },
        slots: { default: 'slot code' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('prop code', expect.any(Object))
    })
  })

  describe('when rendered with language prop', () => {
    it('then it passes language to shiki', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        props: { code: 'echo hello', language: 'bash' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('echo hello', expect.objectContaining({
        lang: 'bash',
      }))
    })
  })

  describe('when rendered with theme prop', () => {
    it('then it uses the provided theme', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        props: { code: 'const x = 1', theme: 'dracula' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('const x = 1', expect.objectContaining({
        theme: 'dracula',
      }))
    })
  })

  describe('when code prop is empty', () => {
    it('then it renders the root div without highlighted html', async () => {
      const wrapper = mount(MazCodeHighlight)
      await flushPromises()

      const root = wrapper.find('.m-code-highlight')
      expect(root.exists()).toBe(true)
      expect(root.find('.m-code-highlight__content').html()).toContain('class="m-code-highlight__content"></div>')
    })
  })

  describe('when the document dark class changes', () => {
    it('then the MutationObserver callback runs without error', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      document.documentElement.classList.add('dark')
      await flushPromises()
      document.documentElement.classList.remove('dark')
      await flushPromises()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when shiki fails to load', () => {
    it('then it falls back to plain pre/code', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockRejectedValueOnce(new Error('shiki error'))

      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'fallback code' },
      })
      await flushPromises()

      expect(wrapper.html()).toContain('<pre><code>fallback code</code></pre>')
    })

    it('then it escapes html entities in the fallback to prevent xss', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockRejectedValueOnce(new Error('shiki error'))

      const wrapper = mount(MazCodeHighlight, {
        props: { code: '</code></pre><img src=x onerror="alert(1)">' },
      })
      await flushPromises()

      const html = wrapper.html()
      expect(wrapper.find('img').exists()).toBe(false)
      expect(html).not.toContain('</code></pre><img')
      expect(html).toContain('&lt;img src=x')
      expect(html).toContain('&lt;/code&gt;&lt;/pre&gt;')
    })
  })

  describe('when rendered with rounded prop set to false', () => {
    it('then it adds the --no-rounded modifier class', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1', rounded: false },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight').classes()).toContain('--no-rounded')
    })

    it('then it omits the --no-rounded modifier class by default', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight').classes()).not.toContain('--no-rounded')
    })
  })

  describe('when rendered with copyable prop', () => {
    it('then it renders the copy button by default', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').exists()).toBe(true)
    })

    it('then it hides the copy button when copyable is false', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1', copyable: false },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').exists()).toBe(false)
    })

    it('then it hides the copy button when there is no code', async () => {
      const wrapper = mount(MazCodeHighlight)
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').exists()).toBe(false)
    })
  })

  describe('when the copy button is clicked', () => {
    it('then it writes the resolved code to the clipboard', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'npm install' },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')

      expect(writeText).toHaveBeenCalledWith('npm install')
    })

    it('then it writes copyValue to the clipboard when provided', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazCodeHighlight, {
        props: { code: '$ npm install', copyValue: 'npm install' },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')

      expect(writeText).toHaveBeenCalledWith('npm install')
    })
  })

  describe('when rendered without translations override', () => {
    it('then the copy button falls back to the translation composable output', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('test')
    })
  })

  describe('when rendered with custom translations prop', () => {
    it('then it overrides the copy aria label', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: {
          code: 'const x = 1',
          translations: { copyToClipboard: 'Custom copy label' },
        },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Custom copy label')
    })

    it('then it overrides the copied aria label after a successful copy', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazCodeHighlight, {
        props: {
          code: 'const x = 1',
          translations: { copiedToClipboard: 'Custom copied label' },
        },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Custom copied label')
    })
  })

  describe('when the copied state expires', () => {
    it('then it reverts to the default copy label after the timeout', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazCodeHighlight, {
        props: {
          code: 'const x = 1',
          translations: { copyToClipboard: 'Copy', copiedToClipboard: 'Copied' },
        },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')
      await flushPromises()
      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Copied')

      vi.advanceTimersByTime(1600)
      await flushPromises()
      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Copy')

      vi.useRealTimers()
    })
  })

  describe('when the component is unmounted', () => {
    it('then it disconnects the observer and clears the copy timer', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')
      await flushPromises()

      expect(() => wrapper.unmount()).not.toThrow()
    })
  })
})
