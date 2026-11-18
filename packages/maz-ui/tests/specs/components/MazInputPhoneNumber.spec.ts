import type { MazInputPhoneNumberData, MazInputPhoneNumberProps } from '@components/MazInputPhoneNumber.vue'
import type { CountryCode } from 'libphonenumber-js'
import MazInputPhoneNumber from '@components/MazInputPhoneNumber.vue'
import PhoneInput from '@components/MazInputPhoneNumber/PhoneInput.vue'
import MazSelectCountry from '@components/MazSelectCountry.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

async function getWrapper({ props, slots, attrs }: { props?: Partial<MazInputPhoneNumberProps>, slots?: Record<string, string>, attrs?: Record<string, unknown> }) {
  const wrapper = mount(MazInputPhoneNumber, {
    props,
    slots,
    attrs,
    global: {
      stubs: {
        MazSelectCountry,
        PhoneInput,
      },
    },
  })

  await vi.dynamicImportSettled()

  return wrapper
}

describe('components/MazInputPhoneNumber.vue', () => {
  expect(MazInputPhoneNumber).toBeTruthy()

  it('should have an uniq id', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33658585858',
      },
    })

    expect(wrapper.html()).toContain('MazInputPhoneNumber-v-0')
    expect(wrapper.html()).toContain('MazInputPhoneNumber-v-0-country')
    expect(wrapper.html()).toContain('MazInputPhoneNumber-v-0-phone')
  })

  it('should have the provided id', async () => {
    const wrapper = await getWrapper({
      props: {
        id: 'test',
      },
    })

    expect(wrapper.find('#test').exists()).toBe(true)
  })

  it('should have the good values with FR number', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33658585858',
      },
    })

    const inputElement = wrapper.findComponent(PhoneInput)

    expect(inputElement.props('modelValue')).toBe('0658585858')
    expect(wrapper.vm.modelValue).toBe('+33658585858')
    expect(wrapper.emitted('country-code')?.[0][0]).toBe('FR')
  })

  it('should have the good values with BE number', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+326453',
      },
    })

    await vi.dynamicImportSettled()

    const inputElement = wrapper.findComponent(PhoneInput)

    expect(inputElement.props('modelValue')).toBe('+326453')

    const htmlInput = wrapper.find('input[name="phone"]').element as HTMLInputElement

    expect(htmlInput.value).toBe('+32 64 53')

    expect(wrapper.vm.modelValue).toBe('+326453')
    expect(wrapper.emitted('country-code')?.[0][0]).toBe('BE')
  })

  it('should emit update event with results when phone number changes', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33612345678',
      },
    })

    await wrapper.find('input[name="phone"]').setValue('+33612345678')

    await nextTick()

    // @ts-expect-error - results is internal
    const updateEvent = wrapper.vm.results as Results
    expect(updateEvent.isValid).toBe(true)
    expect(updateEvent.parsedCountryCode).toBe('FR')
    expect(updateEvent.e164).toBe('+33612345678')
  })

  it('should format phone number as you type when autoFormat is typing', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '0612345678',
        countryCode: 'FR',
        autoFormat: 'typing',
      },
    })

    await vi.dynamicImportSettled()

    const input = wrapper.find<HTMLInputElement>('input[name="phone"]')

    expect(input.element.value).toBe('06 12 34 56 78')
  })

  it('should not format phone number when autoFormat is disabled', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '',
        countryCode: 'FR',
        autoFormat: 'disabled',
      },
    })

    await vi.dynamicImportSettled()

    const input = wrapper.find<HTMLInputElement>('input[name="phone"]')
    await input.setValue('0612345678')

    await wrapper.vm.$nextTick()

    expect(input.element.value).toBe('0612345678')
  })

  it('should show validation error when phone number is invalid', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33612345678',
      },
    })

    await wrapper.find('input[name="phone"]').setValue('+3361')
    await wrapper.setProps({
      validationError: true,
    })

    await nextTick()

    const phoneInput = wrapper.findComponent(PhoneInput)
    const countrySelect = wrapper.findComponent(MazSelectCountry) as any
    expect(countrySelect.props('error')).toBe(false)
    expect(phoneInput.props('error')).toBe(true)
  })

  it('should no show validation error when phone number is invalid', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33612345678',
      },
    })

    await wrapper.find('input[name="phone"]').setValue('+3361')
    await wrapper.setProps({
      validationError: false,
    })

    const phoneInput = wrapper.findComponent(PhoneInput)
    const countrySelect = wrapper.findComponent(MazSelectCountry) as any
    expect(countrySelect.props('error')).toBe(false)
    expect(phoneInput.props('error')).toBe(false)
  })

  it('should show validation success when phone number is valid', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33612345678',
      },
    })

    await wrapper.find('input[name="phone"]').setValue('+33612345678')

    // @ts-expect-error - results is internal
    const results = wrapper.vm.results as Results
    expect(results.isValid).toBe(true)

    const phoneInput = wrapper.findComponent(PhoneInput)
    expect(phoneInput.props('success')).toBe(true)
  })

  it('should no show validation success when phone number is valid', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33612345678',
      },
    })

    await wrapper.setProps({
      modelValue: '+33612345678',
      validationSuccess: false,
    })

    const phoneInput = wrapper.findComponent(PhoneInput)
    expect(phoneInput.props('success')).toBe(false)
  })

  it('should disable inputs when disabled prop is true', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33612345678',
      },
    })

    await wrapper.setProps({
      disabled: true,
    })

    const phoneInput = wrapper.findComponent(PhoneInput)
    const countrySelect = wrapper.findComponent(MazSelectCountry) as any

    expect(countrySelect.props('disabled')).toBeDefined()
    expect(phoneInput.props('disabled')).toBeDefined()
  })

  it('should hide country selector when hideCountrySelector is true', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: '+33612345678',
      },
    })

    await wrapper.setProps({
      hideCountrySelect: true,
    })

    const countrySelect = wrapper.findComponent(MazSelectCountry)
    expect(countrySelect.exists()).toBe(false)
  })

  it('should fetch country on mount when fetchCountry is true', async () => {
    const wrapper = await getWrapper({
      props: {
        fetchCountry: true,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('country-code')).toBeTruthy()
  })
})

describe('given a MazUi global default for size', () => {
  function mountWithConfig(config: unknown, props: Partial<MazInputPhoneNumberProps> = {}) {
    return mount(MazInputPhoneNumber, {
      props,
      global: {
        stubs: { MazSelectCountry, PhoneInput },
        provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config },
      },
    })
  }

  describe('when no size prop is passed', () => {
    it('then the country select receives the global size', () => {
      const wrapper = mountWithConfig({
        global: { size: 'xl' },
      })

      expect(wrapper.findComponent(MazSelectCountry).props('size')).toBe('xl')
    })

    it('then the phone input receives the global size', () => {
      const wrapper = mountWithConfig({
        global: { size: 'xl' },
      })

      expect(wrapper.findComponent(PhoneInput).props('size')).toBe('xl')
    })
  })

  describe('when a component-scoped default differs from the global default', () => {
    it('then the country select receives the component-scoped size', () => {
      const wrapper = mountWithConfig({
        global: { size: 'mini' },
        MazInputPhoneNumber: { size: 'lg' },
      })

      expect(wrapper.findComponent(MazSelectCountry).props('size')).toBe('lg')
    })
  })

  describe('when a size prop is passed', () => {
    it('then the instance prop wins over every configured default', () => {
      const wrapper = mountWithConfig({
        global: { size: 'mini' },
        MazInputPhoneNumber: { size: 'lg' },
      }, { size: 'sm' })

      expect(wrapper.findComponent(PhoneInput).props('size')).toBe('sm')
    })
  })
})

describe('given the flagSrc prop', () => {
  describe('when it is set', () => {
    it('then the country select receives it', async () => {
      const wrapper = await getWrapper({
        props: { flagSrc: '/flags/{code}.svg' },
      })

      expect(wrapper.findComponent(MazSelectCountry).props('flagSrc')).toBe('/flags/{code}.svg')
    })
  })

  describe('when it is not set', () => {
    it('then the country select keeps the CDN flags', async () => {
      const wrapper = await getWrapper({})

      expect(wrapper.findComponent(MazSelectCountry).props('flagSrc')).toBeUndefined()
    })
  })
})

describe('given a global flagSrc in the MazUi defaults', () => {
  function mountWithDefaults(defaults: unknown, props: Partial<MazInputPhoneNumberProps> = {}) {
    return mount(MazInputPhoneNumber, {
      props,
      global: {
        stubs: { MazSelectCountry, PhoneInput },
        provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: defaults },
      },
    })
  }

  describe('when no flagSrc prop is passed', () => {
    it('then the country select receives the global source', () => {
      const wrapper = mountWithDefaults({
        global: { flagSrc: '/global/{code}.svg' },
      })

      expect(wrapper.findComponent(MazSelectCountry).props('flagSrc')).toBe('/global/{code}.svg')
    })
  })

  describe('when a flagSrc prop is passed', () => {
    it('then the prop wins over the global source', () => {
      const wrapper = mountWithDefaults({
        global: { flagSrc: '/global/{code}.svg' },
      }, { flagSrc: '/prop/{code}.svg' })

      expect(wrapper.findComponent(MazSelectCountry).props('flagSrc')).toBe('/prop/{code}.svg')
    })
  })
})

describe('given a parent bound with v-model', () => {
  function mountWithParent({ phone, countryCode, fetchCountry }: { phone?: string, countryCode?: string, fetchCountry?: boolean }) {
    const phoneModel = ref(phone)
    const countryModel = ref(countryCode)
    const data = ref<MazInputPhoneNumberData>()

    const Parent = defineComponent({
      setup: () => () => h(MazInputPhoneNumber, {
        'modelValue': phoneModel.value,
        'onUpdate:modelValue': (value: string) => {
          phoneModel.value = value
        },
        'countryCode': countryModel.value,
        'onUpdate:countryCode': (value: CountryCode) => {
          countryModel.value = value
        },
        'onData': (value: MazInputPhoneNumberData) => {
          data.value = value
        },
        fetchCountry,
      }),
    })

    const wrapper = mount(Parent, {
      global: {
        stubs: { MazSelectCountry, PhoneInput },
      },
    })

    return {
      wrapper,
      phoneModel,
      countryModel,
      data,
    }
  }

  describe.each([
    { label: 'empty', phone: '' },
    { label: 'set', phone: '+33658585858' },
  ])('when the initial phone number is $label and the parent changes it right after mount', ({ phone }) => {
    it('then the component applies the new phone number', async () => {
      const { wrapper, phoneModel, data } = mountWithParent({ phone })

      phoneModel.value = '+12025550123'
      await nextTick()
      await vi.dynamicImportSettled()

      expect(wrapper.findComponent(PhoneInput).props('modelValue')).toBe('2025550123')
      expect(phoneModel.value).toBe('+12025550123')
      expect(data.value?.isValid).toBe(true)
      expect(data.value?.countryCode).toBe('US')
      expect(wrapper.findComponent(MazSelectCountry).props('modelValue')).toBe('US')
    })
  })

  describe('when the parent changes the country code right after mount', () => {
    it('then the component applies the new country code', async () => {
      const { wrapper, countryModel } = mountWithParent({ countryCode: 'FR' })

      countryModel.value = 'BE'
      await nextTick()
      await vi.dynamicImportSettled()

      expect(wrapper.findComponent(MazSelectCountry).props('modelValue')).toBe('BE')
      expect(countryModel.value).toBe('BE')
    })
  })
  describe('when the parent resets the country code', () => {
    it('then the component clears the selected country', async () => {
      const { wrapper, countryModel, data } = mountWithParent({ countryCode: 'FR' })

      countryModel.value = undefined
      await nextTick()

      expect(wrapper.findComponent(MazSelectCountry).props('modelValue')).toBeUndefined()
      expect(countryModel.value).toBeUndefined()
      expect(data.value?.countryCode).toBeUndefined()
    })
  })

  describe('when the parent sets a phone number while the country is fetched', () => {
    it('then the fetched country does not override the country of the phone number', async () => {
      let resolveFetch: (value: unknown) => void = () => {}
      vi.mocked(fetch).mockImplementationOnce(() => new Promise((resolve) => {
        resolveFetch = resolve
      }))

      const { wrapper, phoneModel, data } = mountWithParent({ fetchCountry: true })

      phoneModel.value = '+12025550123'
      await nextTick()
      resolveFetch({
        json: () => Promise.resolve({ country_code: 'FR' }),
      })
      await flushPromises()

      expect(wrapper.findComponent(MazSelectCountry).props('modelValue')).toBe('US')
      expect(data.value?.isValid).toBe(true)
    })
  })
  describe('when the country is fetched and nothing changes during the fetch', () => {
    it('then the fetched country replaces the country of the browser locale', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: () => Promise.resolve({ country_code: 'FR' }),
      } as Response)

      const { wrapper, countryModel } = mountWithParent({ fetchCountry: true })

      await flushPromises()

      expect(wrapper.findComponent(MazSelectCountry).props('modelValue')).toBe('FR')
      expect(countryModel.value).toBe('FR')
    })
  })
})

describe('given the preferredCountries prop', () => {
  describe('when it is set', () => {
    it('then the preferred countries come first, in the given order', async () => {
      const wrapper = await getWrapper({
        props: {
          preferredCountries: ['FR', 'BE', 'DE'],
        },
      })

      const options = wrapper.findComponent(MazSelectCountry).props('options') as { code: string }[]

      expect(options.slice(0, 3).map(option => option.code)).toEqual(['FR', 'BE', 'DE'])
    })
  })
})

describe('given a list of available countries', () => {
  describe.each([
    {
      label: 'onlyCountries excludes',
      props: {
        onlyCountries: ['FR', 'BE'] as CountryCode[],
      },
    },
    {
      label: 'ignoredCountries excludes',
      props: {
        ignoredCountries: ['US'] as CountryCode[],
      },
    },
  ])('when $label the country of the browser locale', ({ props }) => {
    it('then the component does not select it', async () => {
      const wrapper = await getWrapper({ props })

      expect(wrapper.findComponent(MazSelectCountry).props('modelValue')).toBeUndefined()
      expect(wrapper.emitted('update:country-code')).toBeUndefined()
    })
  })
})

describe('given a phone number not updated by the parent', () => {
  describe('when the user clears the input and selects a country', () => {
    it('then the results are computed from the empty input', async () => {
      const wrapper = await getWrapper({
        props: { modelValue: '+33658585858' },
      })

      wrapper.findComponent(PhoneInput).vm.$emit('update:modelValue', '')
      wrapper.findComponent(MazSelectCountry).vm.$emit('update:model-value', 'FR')
      await nextTick()

      const data = wrapper.emitted('data') as [MazInputPhoneNumberData][]

      expect(data.at(-1)?.[0].isValid).toBe(false)
      expect(data.at(-1)?.[0].e164).toBeUndefined()
    })
  })
})

describe('given an empty phone number set by the parent', () => {
  describe.each([null, ''])('when the component is mounted with %o', (phone) => {
    it('then the component does not emit a new phone number', async () => {
      const wrapper = await getWrapper({
        props: { modelValue: phone },
      })

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when the parent resets a phone number to null', () => {
    it('then the component clears the input and keeps the value of the parent', async () => {
      const wrapper = await getWrapper({
        props: { modelValue: '+33658585858' },
      })

      await wrapper.setProps({ modelValue: null })

      expect(wrapper.findComponent(PhoneInput).props('modelValue')).toBeNull()
      expect(wrapper.emitted('update:model-value')).toHaveLength(1)
    })
  })
})

describe('given an invalid countryLocale', () => {
  describe.each(['', 'fr_FR'])('when countryLocale is %o', (countryLocale) => {
    it('then the component renders the list of countries', async () => {
      const wrapper = await getWrapper({
        props: { countryLocale },
      })

      const options = wrapper.findComponent(MazSelectCountry).props('options') as { code: string, name: string }[]

      expect(options.length).toBeGreaterThan(200)
      expect(options.find(option => option.code === 'FR')?.name).toBeTruthy()
    })
  })
})

describe('given a partial phone number', () => {
  describe('when the user types it', () => {
    it('then the component emits the typed value instead of an invalid E.164', async () => {
      const wrapper = await getWrapper({
        props: { countryCode: 'FR' },
      })

      wrapper.findComponent(PhoneInput).vm.$emit('update:modelValue', '06585858')
      await nextTick()

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['06585858'])
    })
  })
})

describe('given a phone number with an extension', () => {
  describe('when the parent sets it', () => {
    it('then the component keeps the value of the parent and exposes the extension', async () => {
      const wrapper = await getWrapper({
        props: { modelValue: '+33658585858 ext. 123' },
      })

      const data = wrapper.emitted('data') as [MazInputPhoneNumberData][]

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      expect(data.at(-1)?.[0].isValid).toBe(true)
      expect(data.at(-1)?.[0].ext).toBe('123')
    })
  })
})

describe('given the exposed API', () => {
  describe('when focus is called', () => {
    it('then the phone number input is focused', () => {
      const wrapper = mount(MazInputPhoneNumber, { attachTo: document.body })

      wrapper.vm.focus()

      expect(document.activeElement).toBe(wrapper.find(`#${wrapper.attributes('id')}-phone`).element)
      wrapper.unmount()
    })
  })

  describe('when results is read', () => {
    it('then it returns the metadata of the phone number', async () => {
      const wrapper = await getWrapper({
        props: { modelValue: '+33658585858' },
      })

      expect(wrapper.vm.results.e164).toBe('+33658585858')
    })
  })
})

describe('given a country selected by the user', () => {
  describe('when the component is unmounted before the phone number input is focused', () => {
    it('then the focus is not moved', async () => {
      vi.useFakeTimers()
      const wrapper = await getWrapper({})
      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

      wrapper.findComponent(MazSelectCountry).vm.$emit('update:model-value', 'FR')
      await nextTick()
      wrapper.unmount()
      vi.runAllTimers()

      expect(focusSpy).not.toHaveBeenCalled()
      vi.useRealTimers()
      focusSpy.mockRestore()
    })
  })
})

describe('given the slots of the phone number input', () => {
  describe('when start-icon and end-icon are set', () => {
    it('then they are rendered in the phone number input', async () => {
      const wrapper = await getWrapper({
        slots: {
          'start-icon': '<span class="custom-start">start</span>',
          'end-icon': '<span class="custom-end">end</span>',
        },
      })

      expect(wrapper.findComponent(PhoneInput).find('.custom-start').exists()).toBe(true)
      expect(wrapper.findComponent(PhoneInput).find('.custom-end').exists()).toBe(true)
    })
  })
})

describe('given the accessibility attributes', () => {
  describe('when the phone number is invalid and an assistive text is set', () => {
    it('then the input is invalid and described by the assistive text', async () => {
      const wrapper = await getWrapper({
        props: {
          modelValue: '0612',
          countryCode: 'FR',
          assistiveText: 'Mobile number',
          id: 'phone',
        },
        attrs: { 'aria-describedby': 'external-hint' },
      })

      const input = wrapper.find('#phone-phone')

      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe('external-hint phone-assistive-text')
      expect(wrapper.find('#phone-assistive-text').text()).toBe('Mobile number')
    })
  })

  describe('when the phone number is valid', () => {
    it('then the input is not invalid', async () => {
      const wrapper = await getWrapper({
        props: { modelValue: '+33658585858', id: 'phone' },
      })

      expect(wrapper.find('#phone-phone').attributes('aria-invalid')).toBeUndefined()
      expect(wrapper.find('#phone-phone').attributes('aria-describedby')).toBeUndefined()
    })
  })
})

describe('given a server side rendering', () => {
  describe.each([
    { label: 'without countryLocale', countryLocale: undefined, hasCountryName: false },
    { label: 'with countryLocale', countryLocale: 'fr-FR', hasCountryName: true },
  ])('when the component is rendered $label', ({ countryLocale, hasCountryName }) => {
    it('then the country names depend only on the given locale', async () => {
      const app = createSSRApp({
        render: () => h(MazInputPhoneNumber, { countryCode: 'FR', displayCountryName: true, countryLocale }),
      })

      const html = await renderToString(app)

      expect(html.includes('France')).toBe(hasCountryName)
    })
  })
})
