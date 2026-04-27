import MazInput from '@components/MazInput.vue'
import { mount, shallowMount } from '@vue/test-utils'

const AUTOFILL_ANIMATION = 'maz-autofill-start'

describe('components/MazInput.vue', () => {
  expect(MazInput).toBeTruthy()

  const wrapper = shallowMount(MazInput, {
    props: {
      modelValue: 'test value',
    },
  })

  it('should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe('test value')
  })

  it('should have an uniq id', () => {
    // @ts-expect-error - test case
    expect(wrapper.vm.instanceId).toBe('MazInput-v-0')
  })

  it('should emit an input event with the new value when the input value changes', () => {
    const input = wrapper.find('input')
    input.setValue('new value')
    expect(wrapper.emitted()['update:model-value'][0]).toEqual(['new value'])
  })

  it('should apply the --has-label class when the label prop is passed', async () => {
    await wrapper.setProps({ label: 'Some label' })
    expect(wrapper.classes()).toContain('--has-label')
  })

  it('should set a whitespace placeholder fallback when no placeholder prop is provided', () => {
    expect(wrapper.find('input').attributes('placeholder')).toBe(' ')
  })

  it('should apply the --is-readonly class when the readonly prop is passed', async () => {
    await wrapper.setProps({ readonly: true })
    expect(wrapper.classes()).toContain('--is-readonly')
  })

  it('should apply the --has-state class and the appropriate color class when the error, warning or success prop is passed', async () => {
    await wrapper.setProps({ error: true })
    expect(wrapper.classes()).toContain('--has-state')

    await wrapper.setProps({ error: false, warning: true })
    expect(wrapper.classes()).toContain('--has-state')

    await wrapper.setProps({ warning: false, success: true })
    expect(wrapper.classes()).toContain('--has-state')
  })

  describe('Given an icon component is passed as leftIcon and rightIcon props', () => {
    describe('When the component renders', () => {
      it('Then it routes both icons through MazIcon', async () => {
        const IconStub = { name: 'IconStub', template: '<svg class="icon-stub" />' }

        const iconWrapper = mount(MazInput, {
          props: { leftIcon: IconStub, rightIcon: IconStub },
        })

        // MazIcon is loaded as defineAsyncComponent — wait for it to resolve.
        await vi.dynamicImportSettled()

        // Both icons go through the MazIcon wrapper now (no more dichotomy).
        expect(iconWrapper.findAll('.icon-stub').length).toBe(2)
      })
    })
  })

  describe('Given the autoFocus prop is enabled', () => {
    describe('When the component mounts', () => {
      it('Then it focuses the input element', () => {
        const wrapper = mount(MazInput, {
          attachTo: document.body,
          props: { autoFocus: true },
        })

        expect(document.activeElement).toBe(wrapper.find('input').element)
        wrapper.unmount()
      })
    })
  })

  describe('Given a browser autofill occurs on the input', () => {
    describe('When the autofill value differs from the current modelValue', () => {
      it('Then it emits update:model-value with the autofilled value', async () => {
        const wrapper = mount(MazInput, {
          props: { modelValue: '' },
        })

        const input = wrapper.find('input').element
        input.value = 'autofilled@example.com'
        input.dispatchEvent(
          Object.assign(new Event('animationstart'), { animationName: AUTOFILL_ANIMATION }),
        )
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['autofilled@example.com'])
      })
    })

    describe('When the autofill value matches the current modelValue', () => {
      it('Then it does not emit update:model-value', async () => {
        const wrapper = mount(MazInput, {
          props: { modelValue: 'same' },
        })

        const input = wrapper.find('input').element
        input.value = 'same'
        input.dispatchEvent(
          Object.assign(new Event('animationstart'), { animationName: AUTOFILL_ANIMATION }),
        )
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('update:model-value')).toBeUndefined()
      })
    })
  })

  describe('Given the component has a registered autofill listener', () => {
    describe('When the component is unmounted', () => {
      it('Then subsequent autofill animations do not emit update:model-value', () => {
        const wrapper = mount(MazInput, {
          props: { modelValue: '' },
        })
        const input = wrapper.find('input').element
        wrapper.unmount()

        input.value = 'late-autofill'
        input.dispatchEvent(
          Object.assign(new Event('animationstart'), { animationName: AUTOFILL_ANIMATION }),
        )

        expect(wrapper.emitted('update:model-value')).toBeUndefined()
      })
    })
  })
})
