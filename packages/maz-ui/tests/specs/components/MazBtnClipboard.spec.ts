import type { MazBtnClipboardColor, MazBtnClipboardVariant } from '@components/MazBtnClipboard.vue'
import MazBtnClipboard from '@components/MazBtnClipboard.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { flushPromises, mount } from '@vue/test-utils'

describe('given MazBtnClipboard component', () => {
  const writeText = vi.fn()

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
  })

  describe('when rendered with a value', () => {
    it('then it displays the value with the default style', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'usr_123' } })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.attributes('type')).toBe('button')
      expect(wrapper.find('.m-btn-clipboard__text').text()).toBe('usr_123')
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['--soft', '--container', '--md', '--idle', 'maz:rounded-md', 'maz:font-mono']))
      expect(wrapper.attributes('title')).toBe('test')
      expect(wrapper.find('[role="status"]').text()).toBe('test')
    })
  })

  describe('when rendered with a label, a prompt and the slot', () => {
    it('then the label replaces the value and the prompt is hidden from assistive technologies', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'npm i maz-ui', label: 'install', prompt: '$' } })

      expect(wrapper.find('.m-btn-clipboard__prompt').text()).toBe('$')
      expect(wrapper.find('.m-btn-clipboard__prompt').attributes('aria-hidden')).toBe('true')
      expect(wrapper.find('.m-btn-clipboard__text').text()).toBe('install')
    })

    it('then the slot replaces the label', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc' }, slots: { default: '<strong>ID</strong>' } })

      expect(wrapper.find('.m-btn-clipboard__text strong').text()).toBe('ID')
    })
  })

  describe('when iconOnly is true', () => {
    it('then only the icon is displayed', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', prompt: '$', iconOnly: true } })

      expect(wrapper.classes()).toContain('--icon-only')
      expect(wrapper.find('.m-btn-clipboard__text').exists()).toBe(false)
      expect(wrapper.find('.m-btn-clipboard__prompt').exists()).toBe(false)
    })
  })

  describe('when rendered with each variant', () => {
    it.each(['soft', 'solid', 'outlined', 'ghost'] as MazBtnClipboardVariant[])('then it applies the %s class', (variant) => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', variant } })

      expect(wrapper.classes()).toContain(`--${variant}`)
    })
  })

  describe('when rendered with a theme color', () => {
    it('then the color variables are set', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', color: 'primary' as MazBtnClipboardColor } })

      expect(wrapper.classes()).toContain('--primary')
      expect(wrapper.attributes('style')).toContain('--m-btn-clipboard-color: var(--maz-primary)')
      expect(wrapper.attributes('style')).toContain('--m-btn-clipboard-color-fg: var(--maz-primary-foreground)')
    })
  })

  describe('when rendered with a neutral color', () => {
    it('then no color variable is set', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', color: 'surface' } })

      expect(wrapper.attributes('style')).toBeUndefined()
    })
  })

  describe('when rendered with a size, a radius, truncate, block and without mono', () => {
    it('then the classes follow', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', size: 'xl', roundedSize: 'full', truncate: true, block: true, mono: false } })

      expect(wrapper.classes()).toEqual(expect.arrayContaining(['--xl', 'maz:text-lg', 'maz:rounded-full', '--block', 'maz:w-full']))
      expect(wrapper.classes()).not.toContain('maz:font-mono')
      expect(wrapper.find('.m-btn-clipboard__text').classes()).toContain('maz:truncate')
    })
  })

  describe('when the global config sets the size and the radius', () => {
    it('then they are used', () => {
      const wrapper = mount(MazBtnClipboard, {
        props: { value: 'abc' },
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { MazBtnClipboard: { size: 'sm', roundedSize: 'lg' } } } },
      })

      expect(wrapper.classes()).toEqual(expect.arrayContaining(['--sm', 'maz:rounded-lg']))
    })
  })

  describe('when it is clicked', () => {
    it('then the value is copied, copy is emitted and the copied state is displayed', async () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'usr_123', label: 'User', copiedLabel: 'Done' } })

      await wrapper.trigger('click')
      await flushPromises()

      expect(writeText).toHaveBeenCalledWith('usr_123')
      expect(wrapper.emitted('copy')).toEqual([['usr_123']])
      expect(wrapper.classes()).toContain('--copied')
      expect(wrapper.attributes('title')).toBe('Done')
      expect(wrapper.find('[role="status"]').text()).toBe('Done')
    })

    describe('when the copied duration ends', () => {
      it('then it goes back to the idle state', async () => {
        vi.useFakeTimers()
        const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', copiedDuring: 500 } })

        await wrapper.trigger('click')
        await flushPromises()
        vi.advanceTimersByTime(500)
        await wrapper.vm.$nextTick()

        expect(wrapper.classes()).toContain('--idle')
        vi.useRealTimers()
      })
    })
  })

  describe('when the clipboard refuses the copy', () => {
    it('then error is emitted and the error state is displayed', async () => {
      const failure = new Error('denied')
      writeText.mockRejectedValue(failure)
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', copyLabel: 'Copy the ID' } })

      await wrapper.trigger('click')
      await flushPromises()

      expect(wrapper.emitted('error')).toEqual([[failure]])
      expect(wrapper.emitted('copy')).toBeUndefined()
      expect(wrapper.classes()).toContain('--error')
      expect(wrapper.attributes('title')).toBe('Copy the ID')
    })
  })

  describe('when it is disabled', () => {
    it('then the button is disabled', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', disabled: true } })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })
})
