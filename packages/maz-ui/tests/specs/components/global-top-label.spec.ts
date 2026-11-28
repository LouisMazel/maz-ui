import MazDatePicker from '@components/MazDatePicker.vue'
import MazInputAutocomplete from '@components/MazInputAutocomplete.vue'
import MazInputKeyValue from '@components/MazInputKeyValue.vue'
import MazInputNumber from '@components/MazInputNumber.vue'
import MazInputPhoneNumber from '@components/MazInputPhoneNumber.vue'
import MazInputPrice from '@components/MazInputPrice.vue'
import MazInputSecret from '@components/MazInputSecret.vue'
import MazInputTags from '@components/MazInputTags.vue'
import MazSelect from '@components/MazSelect.vue'
import MazSelectCountry from '@components/MazSelectCountry.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { flushPromises, mount } from '@vue/test-utils'

const provideOn = { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { global: { topLabel: true } } }

describe('given the global topLabel default on a field built on MazInput', () => {
  const cases = [
    { name: 'MazSelect', component: MazSelect, props: { label: 'Field', options: [{ label: 'A', value: 'a' }] } },
    { name: 'MazSelectCountry', component: MazSelectCountry, props: { label: 'Field' } },
    { name: 'MazInputAutocomplete', component: MazInputAutocomplete, props: { label: 'Field', items: [] } },
    { name: 'MazInputPrice', component: MazInputPrice, props: { label: 'Field' } },
    { name: 'MazInputSecret', component: MazInputSecret, props: { label: 'Field' } },
    { name: 'MazDatePicker', component: MazDatePicker, props: { label: 'Field' } },
  ] as const

  describe.each(cases)('when $name has a label', ({ component, props }) => {
    it('then the label is above the field and not floating', async () => {
      const wrapper = mount(component as any, { props, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-top-label').text()).toBe('Field')
      expect(wrapper.find('.m-input-label').exists()).toBe(false)
    })

    it('then the label floats without the global', async () => {
      const wrapper = mount(component as any, { props })
      await flushPromises()

      expect(wrapper.find('.m-input-top-label').exists()).toBe(false)
      expect(wrapper.find('.m-input-label').text()).toBe('Field')
    })

    it('then a topLabel of the instance wins', async () => {
      const wrapper = mount(component as any, { props: { ...props, topLabel: 'Top' }, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-top-label').text()).toBe('Top')
    })
  })
})

describe('given the global topLabel default on MazInputNumber', () => {
  describe('when it has a label', () => {
    it('then the label is above the field once', async () => {
      const wrapper = mount(MazInputNumber, { props: { label: 'Count' }, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-number__top-label').text()).toBe('Count')
      expect(wrapper.find('.m-input-top-label').exists()).toBe(false)
      expect(wrapper.find('.m-input-label').exists()).toBe(false)
    })

    it('then the label comes from inputProps too', async () => {
      const wrapper = mount(MazInputNumber, { props: { inputProps: { label: 'Count' } }, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-number__top-label').text()).toBe('Count')
    })
  })

  describe('when the global is off', () => {
    it('then the label floats in the field', async () => {
      const wrapper = mount(MazInputNumber, { props: { label: 'Count' } })
      await flushPromises()

      expect(wrapper.find('.m-input-number__top-label').exists()).toBe(false)
      expect(wrapper.find('.m-input-label').text()).toBe('Count')
    })
  })

  describe('when a topLabel is set on the instance', () => {
    it('then it wins over the label', async () => {
      const wrapper = mount(MazInputNumber, { props: { label: 'Count', topLabel: 'Top' }, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-number__top-label').text()).toBe('Top')
    })
  })
})

describe('given the global topLabel default on MazInputPhoneNumber', () => {
  describe('when it has a label', () => {
    it('then the label is above the field and the inner fields keep their floating label', async () => {
      const wrapper = mount(MazInputPhoneNumber, { props: { label: 'Phone' }, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-phone-number__top-label').text()).toBe('Phone')
      expect(wrapper.find('.m-input-top-label').exists()).toBe(false)
      expect(wrapper.find('.m-input-label').exists()).toBe(true)
    })
  })

  describe('when the global is off', () => {
    it('then the label floats', async () => {
      const wrapper = mount(MazInputPhoneNumber, { props: { label: 'Phone' } })
      await flushPromises()

      expect(wrapper.find('.m-input-phone-number__top-label').exists()).toBe(false)
      expect(wrapper.text()).toContain('Phone')
    })
  })

  describe('when a topLabel is set on the instance', () => {
    it('then it wins over the label', async () => {
      const wrapper = mount(MazInputPhoneNumber, { props: { label: 'Phone', topLabel: 'Top' }, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-phone-number__top-label').text()).toBe('Top')
    })
  })
})

describe('given the global topLabel default on MazInputTags', () => {
  describe('when it has a label', () => {
    it('then the label is above the field and not the placeholder', () => {
      const wrapper = mount(MazInputTags, { props: { label: 'Tags' }, global: { provide: provideOn } })

      expect(wrapper.find('.m-input-tags__top-label').text()).toBe('Tags')
      expect(wrapper.find('input').attributes('placeholder')).toBeUndefined()
    })
  })

  describe('when the global is off', () => {
    it('then the label is the placeholder', () => {
      const wrapper = mount(MazInputTags, { props: { label: 'Tags' } })

      expect(wrapper.find('.m-input-tags__top-label').exists()).toBe(false)
      expect(wrapper.find('input').attributes('placeholder')).toBe('Tags')
    })
  })

  describe('when a topLabel is set on the instance', () => {
    it('then it wins over the label', () => {
      const wrapper = mount(MazInputTags, { props: { label: 'Tags', topLabel: 'Top' }, global: { provide: provideOn } })

      expect(wrapper.find('.m-input-tags__top-label').text()).toBe('Top')
    })
  })
})

describe('given the global topLabel default on MazInputKeyValue', () => {
  describe('when it has a label and key labels', () => {
    it('then the group label is above the fields and the rows keep their floating labels', () => {
      const wrapper = mount(MazInputKeyValue, {
        props: { modelValue: { a: '1' }, label: 'Headers', keyLabel: 'Name', valueLabel: 'Content' },
        global: { provide: provideOn },
      })

      expect(wrapper.find('.m-input-key-value__top-label').text()).toBe('Headers')
      expect(wrapper.find('.m-input-top-label').exists()).toBe(false)
      expect(wrapper.find('.m-input-label').text()).toBe('Name')
    })
  })

  describe('when the global is off', () => {
    it('then the group label is not displayed', () => {
      const wrapper = mount(MazInputKeyValue, { props: { modelValue: { a: '1' }, label: 'Headers' } })

      expect(wrapper.find('.m-input-key-value__top-label').exists()).toBe(false)
      expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Headers')
    })
  })
})

describe('given the global topLabel default on MazInputSecret', () => {
  describe('when it is saved and has a label', () => {
    it('then the actions are aligned with the field under the top label', async () => {
      const wrapper = mount(MazInputSecret, { props: { label: 'Token', saved: true }, global: { provide: provideOn } })
      await flushPromises()

      expect(wrapper.find('.m-input-secret__actions').classes()).toContain('maz:mt-6')
    })
  })

  describe('when the global is off', () => {
    it('then the actions have no top margin', async () => {
      const wrapper = mount(MazInputSecret, { props: { label: 'Token', saved: true } })
      await flushPromises()

      expect(wrapper.find('.m-input-secret__actions').classes()).not.toContain('maz:mt-6')
    })
  })
})
