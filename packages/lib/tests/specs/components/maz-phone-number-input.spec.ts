import { mount, type VueWrapper } from '@vue/test-utils'
import MazPhoneNumberInput from '@components/MazPhoneNumberInput.vue'

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

  test('Should have an uniq id', async () => {
    expect(wrapper.find('#MazPhoneNumberInput-1').exists()).toBe(true)
  })

  test('Should have the provided ifd', async () => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        id: 'test',
      },
    })

    expect(wrapper.find('#test').exists()).toBe(true)
  })

  test('Should have the good values with FR number', async () => {
    const inputElement = wrapper.find('#MazPhoneNumberInput-28').element as HTMLInputElement

    expect(inputElement.value).toBe('06 58 58 47 29')
    expect(wrapper.vm.modelValue).toBe('+33658584729')
    expect(wrapper.emitted('country-code')?.[0][0]).toBe('FR')
  })

  test('Should have the good values with BE number', async () => {
    await wrapper.setProps({
      modelValue: '+326453',
    })

    const inputElement = wrapper.find('#MazPhoneNumberInput-37').element as HTMLInputElement

    expect(inputElement.value).toBe('+32 64 53')

    expect(wrapper.vm.modelValue).toBe('+326453')
    expect(wrapper.emitted('country-code')?.[1][0]).toBe('BE')
  })
})
