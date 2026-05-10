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
    it('then it renders an empty content div', async () => {
      const wrapper = mount(MazCodeHighlight)
      await flushPromises()

      const div = wrapper.find('.m-code-highlight')
      expect(div.exists()).toBe(true)
      expect(div.text()).toBe('')
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
  })
})
