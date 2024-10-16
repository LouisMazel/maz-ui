import MazPhoneNumberInput from '@components/MazPhoneNumberInput.vue'
import { mount, type VueWrapper } from '@vue/test-utils'

describe('components/MazPhoneNumberInput.vue', () => {
  expect(MazPhoneNumberInput).toBeTruthy()

  let wrapper: VueWrapper<InstanceType<typeof MazPhoneNumberInput>>

  beforeEach(() => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        modelValue: '+33658584729',
      },
    })
  })

  it('should have an uniq id', async () => {
    expect(wrapper.find('#MazPhoneNumberInput-v-0').exists()).toBe(true)
  })

  it('should have the provided ifd', async () => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        id: 'test',
      },
    })

    expect(wrapper.find('#test').exists()).toBe(true)
  })

  it('should have the good values with FR number', async () => {
    const inputElement = wrapper.find('#MazPhoneNumberInput-v-0').element as HTMLInputElement

    expect(inputElement.value).toBe('06 58 58 47 29')
    expect(wrapper.vm.modelValue).toBe('+33658584729')
    expect(wrapper.emitted('country-code')?.[0][0]).toBe('FR')
  })

  it('should have the good values with BE number', async () => {
    await wrapper.setProps({
      modelValue: '+326453',
    })

    const inputElement = wrapper.find('#MazPhoneNumberInput-v-0').element as HTMLInputElement

    expect(inputElement.value).toBe('+32 64 53')

    expect(wrapper.vm.modelValue).toBe('+326453')
    expect(wrapper.emitted('country-code')?.[1][0]).toBe('BE')
  })
})
