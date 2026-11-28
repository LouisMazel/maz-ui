import MazTextarea from '@components/MazTextarea.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { mount } from '@vue/test-utils'

describe('given a MazTextarea', () => {
  describe('when counter is set with a maxlength', () => {
    it('then the count and the limit are displayed', () => {
      const wrapper = mount(MazTextarea, { props: { modelValue: 'hello', counter: true }, attrs: { maxlength: 20 } })

      expect(wrapper.find('.m-textarea__counter-text').text()).toBe('5/20')
      expect(wrapper.find('.m-textarea__counter-ring').exists()).toBe(true)
      expect(wrapper.find('.m-textarea__counter').classes()).toContain('--normal')
    })

    it.each([
      { value: 'a'.repeat(18), state: '--near' },
      { value: 'a'.repeat(20), state: '--full' },
    ])('then the counter turns $state near the limit', ({ value, state }) => {
      const wrapper = mount(MazTextarea, { props: { modelValue: value, counter: true }, attrs: { maxlength: 20 } })

      expect(wrapper.find('.m-textarea__counter').classes()).toContain(state)
    })

    it('then the ring progress follows the count', () => {
      const wrapper = mount(MazTextarea, { props: { modelValue: 'aaaaa', counter: true }, attrs: { maxlength: 20 } })

      expect(wrapper.find('.m-textarea__counter-progress').attributes('stroke-dashoffset')).toBe('0.75')
    })
  })

  describe('when counter is set without maxlength', () => {
    it('then only the count is displayed', () => {
      const wrapper = mount(MazTextarea, { props: { modelValue: 'hello', counter: true } })

      expect(wrapper.find('.m-textarea__counter-text').text()).toBe('5')
      expect(wrapper.find('.m-textarea__counter-ring').exists()).toBe(false)
    })
  })

  describe('when counter and assistive text are set', () => {
    it('then both are rendered in the footer', () => {
      const wrapper = mount(MazTextarea, { props: { modelValue: '', counter: true, assistiveText: 'Help' }, attrs: { maxlength: 5 } })

      expect(wrapper.find('.m-textarea__footer .m-textarea__bottom-text').text()).toBe('Help')
      expect(wrapper.find('.m-textarea__counter-text').text()).toBe('0/5')
    })
  })

  describe('when counter is not set', () => {
    it('then no counter is rendered', () => {
      const wrapper = mount(MazTextarea, { props: { modelValue: 'hello' } })

      expect(wrapper.find('.m-textarea__counter').exists()).toBe(false)
    })
  })

  describe('when an assistive text and an error are set', () => {
    it('then the textarea is invalid and described by the message', () => {
      const wrapper = mount(MazTextarea, { props: { assistiveText: 'Required', error: true } })
      const message = wrapper.find('.m-textarea__bottom-text')

      expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
      expect(wrapper.find('textarea').attributes('aria-describedby')).toBe(message.attributes('id'))
      expect(message.classes()).toContain('maz:text-destructive-600')
    })
  })

  describe('when success is set', () => {
    it('then a drawn check is rendered unless animated is false', async () => {
      const wrapper = mount(MazTextarea, { props: { success: true } })

      expect(wrapper.find('.m-textarea__valid').exists()).toBe(true)

      await wrapper.setProps({ animated: false })

      expect(wrapper.find('.m-textarea__valid').exists()).toBe(false)
    })
  })

  describe('when the global topLabel default is set', () => {
    const provide = { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { global: { topLabel: true } } }

    it('then the label is rendered above the field and not floating', () => {
      const wrapper = mount(MazTextarea, { props: { label: 'Message' }, global: { provide } })

      expect(wrapper.find('.m-textarea__top-label').text()).toBe('Message')
      expect(wrapper.find('.m-textarea__label').exists()).toBe(false)
    })
  })

  describe('when the textarea autogrows without field-sizing support', () => {
    it('then the height follows the scroll height', async () => {
      const supports = vi.spyOn(CSS, 'supports').mockReturnValue(false)
      const scrollHeight = vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(120)
      const wrapper = mount(MazTextarea, { props: { modelValue: 'a' }, attachTo: document.body })

      await wrapper.setProps({ modelValue: 'a\nb\nc' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('textarea').element.style.blockSize).toBe('120px')

      supports.mockRestore()
      scrollHeight.mockRestore()
      wrapper.unmount()
    })
  })
})
