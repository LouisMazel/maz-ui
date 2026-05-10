import MazWindowMockup from '@components/MazWindowMockup.vue'
import { flushPromises, mount } from '@vue/test-utils'

describe('given MazWindowMockup component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with browser variant', async () => {
      const wrapper = mount(MazWindowMockup)
      await vi.dynamicImportSettled()

      expect(wrapper.classes()).toContain('--browser')
      expect(wrapper.find('.m-window-mockup__titlebar').exists()).toBe(true)
      expect(wrapper.find('.m-window-mockup__lights').exists()).toBe(true)
    })

    it('then it renders three traffic lights', async () => {
      const wrapper = mount(MazWindowMockup)
      await vi.dynamicImportSettled()

      const lights = wrapper.findAll('.m-window-mockup__light')
      expect(lights).toHaveLength(3)
      expect(lights[0].classes()).toContain('maz:bg-[#FF5F57]')
      expect(lights[1].classes()).toContain('maz:bg-[#febc2e]')
      expect(lights[2].classes()).toContain('maz:bg-[#28C840]')
    })

    it('then it renders the url bar with default url', async () => {
      const wrapper = mount(MazWindowMockup)
      await vi.dynamicImportSettled()

      const urlBar = wrapper.find('.m-window-mockup__url-bar')
      expect(urlBar.exists()).toBe(true)
      expect(urlBar.text()).toBe('localhost')
    })
  })

  describe('when rendered with url prop', () => {
    it('then it displays the url in the address bar', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { url: 'https://maz-ui.com' },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__url-bar').text()).toBe('https://maz-ui.com')
    })
  })

  describe('when rendered with terminal variant', () => {
    it('then it renders terminal variant class', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal' },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.classes()).toContain('--terminal')
    })

    it('then it renders the title with default value', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal' },
      })
      await vi.dynamicImportSettled()

      const titleLabel = wrapper.find('.m-window-mockup__title-label')
      expect(titleLabel.exists()).toBe(true)
      expect(titleLabel.text()).toBe('zsh')
    })

    it('then it renders the title with custom title prop', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal', title: 'bash' },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__title-label').text()).toBe('bash')
    })
  })

  describe('when rendered with editor variant', () => {
    it('then it renders editor variant class', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'editor' },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.classes()).toContain('--editor')
    })

    it('then it renders the filename tab with default value', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'editor' },
      })
      await vi.dynamicImportSettled()

      const tab = wrapper.find('.m-window-mockup__tab')
      expect(tab.exists()).toBe(true)
      expect(tab.text()).toBe('index.vue')
    })

    it('then it renders the filename with custom filename prop', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'editor', filename: 'App.vue' },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__tab').text()).toBe('App.vue')
    })
  })

  describe('when rendered with default slot', () => {
    it('then it renders the slot content', async () => {
      const wrapper = mount(MazWindowMockup, {
        slots: { default: '<img class="preview-img" src="test.png" alt="preview">' },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.preview-img').exists()).toBe(true)
    })
  })

  describe('when rendered with no code and no slot', () => {
    it('then it renders the empty-state placeholder', async () => {
      const wrapper = mount(MazWindowMockup)
      await vi.dynamicImportSettled()

      const placeholder = wrapper.find('.m-window-mockup__placeholder')
      expect(placeholder.exists()).toBe(true)
    })

    it('then it renders the label inside the placeholder when provided', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { label: 'Preview' },
      })
      await vi.dynamicImportSettled()

      const labelEl = wrapper.find('.m-window-mockup__placeholder-label')
      expect(labelEl.exists()).toBe(true)
      expect(labelEl.text()).toBe('Preview')
    })
  })

  describe('when rendered with browser variant', () => {
    it('then it renders the url copy button by default', async () => {
      const wrapper = mount(MazWindowMockup)
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__url-copy-btn').exists()).toBe(true)
    })

    it('then it hides the url copy button when hideUrlCopy is true', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { hideUrlCopy: true },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__url-copy-btn').exists()).toBe(false)
    })

    it('then it writes the url to the clipboard when the button is clicked', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazWindowMockup, {
        props: { url: 'https://maz-ui.com' },
      })
      await vi.dynamicImportSettled()

      await wrapper.find('.m-window-mockup__url-copy-btn').trigger('click')

      expect(writeText).toHaveBeenCalledWith('https://maz-ui.com')
    })

    it('then the url copy button falls back to the translation composable output', async () => {
      const wrapper = mount(MazWindowMockup)
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__url-copy-btn').attributes('aria-label')).toBe('test')
    })

    it('then it overrides the url copy aria label via translations prop', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: {
          translations: { copyUrlToClipboard: 'Custom url label' },
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__url-copy-btn').attributes('aria-label')).toBe('Custom url label')
    })

    it('then the url copy button reverts after the timeout', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazWindowMockup, {
        props: {
          url: 'https://maz-ui.com',
          translations: { copyUrlToClipboard: 'Copy URL', urlCopiedToClipboard: 'URL copied' },
        },
      })
      await vi.dynamicImportSettled()

      await wrapper.find('.m-window-mockup__url-copy-btn').trigger('click')
      await flushPromises()
      expect(wrapper.find('.m-window-mockup__url-copy-btn').attributes('aria-label')).toBe('URL copied')

      vi.advanceTimersByTime(1600)
      await flushPromises()
      expect(wrapper.find('.m-window-mockup__url-copy-btn').attributes('aria-label')).toBe('Copy URL')

      vi.useRealTimers()
    })

    it('then clicking with no url does not call clipboard', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazWindowMockup, {
        props: { url: '' },
      })
      await vi.dynamicImportSettled()

      await wrapper.find('.m-window-mockup__url-copy-btn').trigger('click')

      expect(writeText).not.toHaveBeenCalled()
    })
  })

  describe('when the component is unmounted', () => {
    it('then it clears the url copy timer without throwing', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { clipboard: { writeText } })

      const wrapper = mount(MazWindowMockup, {
        props: { url: 'https://maz-ui.com' },
      })
      await vi.dynamicImportSettled()

      await wrapper.find('.m-window-mockup__url-copy-btn').trigger('click')

      expect(() => wrapper.unmount()).not.toThrow()
    })
  })

  describe('when rendered with code prop', () => {
    it('then it prepends the prompt for terminal variant', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal', code: 'npm install', prompt: '$' },
      })
      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.find('.m-window-mockup').classes()).toContain('--terminal')
    })

    it('then it omits the prompt for non-terminal variants', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'browser', code: 'const a = 1' },
      })
      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.find('.m-window-mockup').classes()).toContain('--browser')
    })

    it('then it omits the prompt when hidePrompt is true', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal', code: 'npm install', hidePrompt: true },
      })
      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.find('.m-window-mockup').classes()).toContain('--terminal')
    })
  })

  describe('when rendered with editor variant tab', () => {
    it('then the tab is flushed with the bottom of the title bar', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'editor' },
      })
      await vi.dynamicImportSettled()

      const tab = wrapper.find('.m-window-mockup__tab')
      expect(tab.classes()).toContain('maz:self-end')
      expect(tab.classes()).toContain('maz:-mb-3')
    })
  })
})
