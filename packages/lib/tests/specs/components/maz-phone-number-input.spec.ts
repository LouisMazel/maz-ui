import { mount } from '@vue/test-utils'
import MazPhoneNumberInput from '@components/MazPhoneNumberInput.vue'

describe('components/MazPhoneNumberInput.vue', () => {
  expect(MazPhoneNumberInput).toBeTruthy()

  const wrapper = mount(MazPhoneNumberInput, {
    props: {
      modelValue: '+33658584729',
    },
  })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have an uniq id', async () => {
    expect(wrapper.vm.instanceId).toBe('MazPhoneNumberInput-1')

    const wrapperTest = mount(MazPhoneNumberInput, {
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

    expect(wrapper.vm.modelValue).toBe('+326453')
    expect(wrapper.vm.countryCode).toBe('BE')
  })
})
