import MazWindowMockup from '@components/MazWindowMockup.vue'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

vi.mock('@components/MazCodeHighlight.vue', () => ({
  default: defineComponent({
    name: 'MazCodeHighlightStub',
    props: ['code', 'language'],
    template: '<div class="maz-code-highlight-stub" />',
  }),
}))

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
      expect(lights[0].classes()).toContain('--red')
      expect(lights[1].classes()).toContain('--orange')
      expect(lights[2].classes()).toContain('--green')
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

    it('then it renders the prompt by default', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal' },
      })
      await vi.dynamicImportSettled()

      const prompt = wrapper.find('.m-window-mockup__prompt')
      expect(prompt.exists()).toBe(true)
      expect(prompt.text()).toBe('$')
    })

    it('then it hides the prompt when showPrompt is false', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal', showPrompt: false },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__prompt').exists()).toBe(false)
    })

    it('then it replaces the prompt via the prompt slot', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'terminal' },
        slots: { prompt: '<span class="custom-prompt">❯</span>' },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.custom-prompt').exists()).toBe(true)
      expect(wrapper.find('.custom-prompt').text()).toBe('❯')
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

  describe('when rendered with prompt but browser variant', () => {
    it('then it does not render the prompt', async () => {
      const wrapper = mount(MazWindowMockup, {
        props: { variant: 'browser', showPrompt: true },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-window-mockup__prompt').exists()).toBe(false)
    })
  })
})
