import { AdsInput } from '@core-design-system/components'
import { mount } from '@vue/test-utils'
import { string } from 'valibot'

import InputGenerator from '@/domains/views/summary/components/FormGenerator/InputGenerator.vue'
import { useFormValidator } from '~/src/composables/useFormValidator'

describe('given a InputGenerator component', () => {
  let wrapper: ReturnType<typeof mount<typeof InputGenerator>>

  beforeEach(async () => {
    useFormValidator({
      schema: { test: string() },
    })

    wrapper = mount(InputGenerator, {
      props: {
        field: {
          id: 'test',
          name: 'test',
          componentName: 'AdsInput',
          slots: [{ name: 'prepend-icon', value: 'test' }],
        },
      },
    })

    await vi.dynamicImportSettled()
  })

  describe('when field is a AdsInput with a value', () => {
    it('then status is success', async () => {
      // @ts-expect-error - Computed is not typed in the component
      expect(wrapper.vm.status).toEqual('success')
      const adsInputComponent = wrapper.findComponent(AdsInput)
      expect(adsInputComponent.exists()).toBeTruthy()
    })

    it('then AdsInput is render', async () => {
      const adsInputComponent = wrapper.findComponent(AdsInput)
      expect(adsInputComponent.exists()).toBeTruthy()
    })
  })
})
