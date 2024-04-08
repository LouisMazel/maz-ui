import { shallowMount, type VueWrapper } from '@vue/test-utils'
import MazPhoneNumberInput from '@components/MazPhoneNumberInput.vue'
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
    expect(wrapper.vm.selectedCountry).toBe('FR')
  })

  test('Should have the good values with BE number', async () => {
    await wrapper.setProps({
      modelValue: '+326453',
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.modelValue).toBe('+326453')
    expect(wrapper.vm.selectedCountry).toBe('BE')
  })
})
