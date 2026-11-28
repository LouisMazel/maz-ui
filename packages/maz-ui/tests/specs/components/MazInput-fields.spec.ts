import MazInput from '@components/MazInput.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { flushPromises, mount } from '@vue/test-utils'

describe('given a MazInput', () => {
  describe('when clearable and the field has a value', () => {
    it('then the clear button empties the value and emits clear', async () => {
      const wrapper = mount(MazInput, { props: { modelValue: 'abc', clearable: true } })

      await wrapper.find('.m-input-clear').trigger('click')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([''])
      expect(wrapper.emitted('clear')).toHaveLength(1)
    })

    it('then the clear button has an accessible name', () => {
      const wrapper = mount(MazInput, { props: { modelValue: 'abc', clearable: true, clearLabel: 'Erase' } })

      expect(wrapper.find('.m-input-clear').attributes('aria-label')).toBe('Erase')
    })
  })

  describe('when clearable and the field is empty, disabled or readonly', () => {
    it.each([
      { modelValue: '' },
      { modelValue: 'abc', disabled: true },
      { modelValue: 'abc', readonly: true },
    ])('then no clear button is rendered for %o', (props) => {
      const wrapper = mount(MazInput, { props: { clearable: true, ...props } })

      expect(wrapper.find('.m-input-clear').exists()).toBe(false)
    })
  })

  describe('when not clearable', () => {
    it('then no clear button is rendered', () => {
      const wrapper = mount(MazInput, { props: { modelValue: 'abc' } })

      expect(wrapper.find('.m-input-clear').exists()).toBe(false)
    })
  })

  describe('when success is set', () => {
    it('then a drawn check is rendered', () => {
      const wrapper = mount(MazInput, { props: { modelValue: 'abc', success: true } })

      expect(wrapper.find('.m-input-valid').exists()).toBe(true)
    })

    it('then no check is rendered when animated is false', () => {
      const wrapper = mount(MazInput, { props: { modelValue: 'abc', success: true, animated: false } })

      expect(wrapper.find('.m-input-valid').exists()).toBe(false)
    })

    it('then no check is rendered when error is also set', () => {
      const wrapper = mount(MazInput, { props: { modelValue: 'abc', success: true, error: true } })

      expect(wrapper.find('.m-input-valid').exists()).toBe(false)
    })
  })

  describe('when an assistive text and an error are set', () => {
    it('then the input is invalid and described by the message', () => {
      const wrapper = mount(MazInput, { props: { assistiveText: 'Required', error: true } })
      const input = wrapper.find('input')
      const message = wrapper.find('.m-input-bottom-text')

      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe(message.attributes('id'))
      expect(message.text()).toBe('Required')
      expect(message.classes()).toContain('maz:text-destructive-600')
    })

    it('then the message follows the next text', async () => {
      const wrapper = mount(MazInput, { props: { assistiveText: 'First', animated: false } })

      await wrapper.setProps({ assistiveText: 'Second', error: true })
      await flushPromises()

      expect(wrapper.find('.m-input-bottom-text').text()).toContain('Second')
    })
  })

  describe('when no assistive text is set', () => {
    it('then the input has no aria-describedby nor aria-invalid', () => {
      const wrapper = mount(MazInput)

      expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()
      expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
    })
  })

  describe('when the global topLabel default is set', () => {
    const provide = { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { global: { topLabel: true } } }

    it('then the label is rendered above the field and not floating', () => {
      const wrapper = mount(MazInput, { props: { label: 'Email' }, global: { provide } })

      expect(wrapper.find('.m-input-top-label').text()).toBe('Email')
      expect(wrapper.find('.m-input-label').exists()).toBe(false)
    })

    it('then a topLabel of the instance wins', () => {
      const wrapper = mount(MazInput, { props: { label: 'Email', topLabel: 'Top' }, global: { provide } })

      expect(wrapper.find('.m-input-top-label').text()).toBe('Top')
    })

    it('then the hint still floats', () => {
      const wrapper = mount(MazInput, { props: { label: 'Email', hint: 'Hint' }, global: { provide } })

      expect(wrapper.find('.m-input-label').text()).toBe('Hint')
    })
  })

  describe('when no global default is set', () => {
    it('then the label floats', () => {
      const wrapper = mount(MazInput, { props: { label: 'Email' } })

      expect(wrapper.find('.m-input-label').text()).toBe('Email')
      expect(wrapper.find('.m-input-top-label').exists()).toBe(false)
    })
  })
})
