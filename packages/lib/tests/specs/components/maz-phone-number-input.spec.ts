import { shallowMount, type VueWrapper } from '@vue/test-utils'
import MazPhoneNumberInput from '@components/MazPhoneNumberInput.vue'
import { isCountryAvailable } from '@components/MazPhoneNumberInput/use-libphonenumber'
import type { ComponentPublicInstance } from 'vue'

describe('components/MazPhoneNumberInput.vue', () => {
  expect(MazPhoneNumberInput).toBeTruthy()

  let wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }>

  beforeEach(() => {
    wrapper = shallowMount(MazPhoneNumberInput, {
      props: {
        modelValue: '+33658584729',
      },
    })
  })

  test('Should have an uniq id', async () => {
    expect(wrapper.vm.instanceId).toBe('MazPhoneNumberInput-1')

    const wrapperTest = shallowMount(MazPhoneNumberInput, {
      props: {
        id: 'test',
      },
    })

    expect(wrapperTest.vm.instanceId).toBe('test')
  })

  test('Should have the good values with FR number', async () => {
    expect(wrapper.vm.modelValue).toBe('+33658584729')
    expect(wrapper.vm.countryCode).toBe('FR')
  })

  test('Should have the good values with BE number', async () => {
    await wrapper.setProps({
      modelValue: '+326453',
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.modelValue).toBe('+326453')
    expect(wrapper.vm.countryCode).toBe('BE')
  })

  test('Should validate country code', async () => {
    const french = isCountryAvailable('FR')
    const falsy = isCountryAvailable('FRFALS')

    expect(french).toBeTruthy()
    expect(falsy).toBeFalsy()
  })
})
