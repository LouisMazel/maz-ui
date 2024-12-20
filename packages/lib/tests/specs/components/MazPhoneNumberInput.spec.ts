import type { Results } from '@components/MazPhoneNumberInput.vue'
import MazPhoneNumberInput from '@components/MazPhoneNumberInput.vue'
import CountrySelector from '@components/MazPhoneNumberInput/CountrySelector.vue'
import PhoneInput from '@components/MazPhoneNumberInput/PhoneInput.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('components/MazPhoneNumberInput.vue', () => {
  expect(MazPhoneNumberInput).toBeTruthy()

  let wrapper: VueWrapper<InstanceType<typeof MazPhoneNumberInput>>

  beforeEach(() => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        modelValue: '+33658585858',
      },
    })
  })

  it('should have an uniq id', () => {
    expect(wrapper.find('#MazPhoneNumberInput-v-0').exists()).toBe(true)
  })

  it('should have the provided id', () => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        id: 'test',
      },
    })

    expect(wrapper.find('#test').exists()).toBe(true)
  })

  it('should have the good values with FR number', () => {
    const inputElement = wrapper.findComponent(PhoneInput)

    expect(inputElement.props('modelValue')).toBe('0658585858')
    expect(wrapper.vm.modelValue).toBe('+33658585858')
    expect(wrapper.emitted('country-code')?.[0][0]).toBe('FR')
  })

  it('should have the good values with BE number', () => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        modelValue: '+326453',
      },
    })

    const inputElement = wrapper.findComponent(PhoneInput)

    expect(inputElement.props('modelValue')).toBe('+326453')

    const htmlInput = wrapper.find('input[name="phone"]').element as HTMLInputElement

    expect(htmlInput.value).toBe('+32 64 53')

    expect(wrapper.vm.modelValue).toBe('+326453')
    expect(wrapper.emitted('country-code')?.[0][0]).toBe('BE')
  })

  it('should emit update event with results when phone number changes', async () => {
    await wrapper.find('input[name="phone"]').setValue('+33612345678')

    await nextTick()

    // @ts-expect-error - results is internal
    const updateEvent = wrapper.vm.results as Results
    expect(updateEvent.isValid).toBe(true)
    expect(updateEvent.parsedCountryCode).toBe('FR')
    expect(updateEvent.e164).toBe('+33612345678')
  })

  it('should format phone number as you type when autoFormat is true', async () => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        modelValue: '',
        countryCode: 'FR',
        autoFormat: true,
      },
    })

    const input = wrapper.find<HTMLInputElement>('input[name="phone"]')
    await input.setValue('0612345678')

    expect(input.element.value).toBe('06 12 34 56 78')
  })

  it('should not format phone number when autoFormat is false', async () => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        modelValue: '',
        countryCode: 'FR',
        autoFormat: false,
      },
    })

    const input = wrapper.find<HTMLInputElement>('input[name="phone"]')
    await input.setValue('0612345678')

    await wrapper.vm.$nextTick()

    expect(input.element.value).toBe('0612345678')
  })

  it('should show validation error when phone number is invalid', async () => {
    await wrapper.find('input[name="phone"]').setValue('+3361')
    await wrapper.setProps({
      noValidationError: false,
    })

    await nextTick()

    const phoneInput = wrapper.findComponent(PhoneInput)
    const countrySelect = wrapper.findComponent(CountrySelector)
    expect(countrySelect.props('error')).toBe(false)
    expect(phoneInput.props('error')).toBe(true)
  })

  it('should no show validation error when phone number is invalid', async () => {
    await wrapper.find('input[name="phone"]').setValue('+3361')
    await wrapper.setProps({
      noValidationError: true,
    })

    const phoneInput = wrapper.findComponent(PhoneInput)
    const countrySelect = wrapper.findComponent(CountrySelector)
    expect(countrySelect.props('error')).toBe(false)
    expect(phoneInput.props('error')).toBe(false)
  })

  it('should show validation success when phone number is valid', async () => {
    await wrapper.find('input[name="phone"]').setValue('+33612345678')

    // @ts-expect-error - results is internal
    const results = wrapper.vm.results as Results
    expect(results.isValid).toBe(true)

    const phoneInput = wrapper.findComponent(PhoneInput)
    expect(phoneInput.props('success')).toBe(true)
  })

  it('should no show validation success when phone number is valid', async () => {
    await wrapper.setProps({
      modelValue: '+33612345678',
      noValidationSuccess: true,
    })

    const phoneInput = wrapper.findComponent(PhoneInput)
    expect(phoneInput.props('success')).toBe(false)
  })

  it('should disable inputs when disabled prop is true', async () => {
    await wrapper.setProps({
      disabled: true,
    })

    const phoneInput = wrapper.findComponent(PhoneInput)
    const countrySelect = wrapper.findComponent(CountrySelector)

    expect(countrySelect.props('disabled')).toBeDefined()
    expect(phoneInput.props('disabled')).toBeDefined()
  })

  it('should hide country selector when noCountrySelector is true', async () => {
    await wrapper.setProps({
      noCountrySelector: true,
    })

    const countrySelect = wrapper.findComponent(CountrySelector)
    expect(countrySelect.exists()).toBe(false)
  })

  it('should fetch country on mount when fetchCountry is true', async () => {
    wrapper = mount(MazPhoneNumberInput, {
      props: {
        fetchCountry: true,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('country-code')).toBeTruthy()
  })
})
