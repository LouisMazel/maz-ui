import type { VueWrapper } from '@vue/test-utils'
import { mount, shallowMount } from '@vue/test-utils'
import { defineComponent, markRaw } from 'vue'

import FormSectionContent from '@/domains/views/summary/components/FormGenerator/FormSectionContent.vue'
import type { FormSection } from '@/domains/views/summary/components/FormGenerator/types'

const section: FormSection = {
  id: 'section1',
  legend: 'Section 1',
  fields: [
    {
      id: 'name',
      name: 'name',
      componentName: 'AdsInput',
    },
    {
      id: 'lastname',
      name: 'lastname',
      componentName: 'AdsInput',
    },
    {
      id: 'other',
      name: 'other',
      componentName: 'AdsInput',
    },
  ],
}

describe('given a FormSectionContent component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FormSectionContent>>

  beforeEach(() => {
    wrapper = shallowMount(FormSectionContent, {
      props: {
        section,
      },
    })
  })

  describe('when has a section as property', () => {
    it('then it renders the input generator component for each field', () => {
      expect(wrapper.findAllComponents({ name: 'InputGenerator' }).length).toBe(3)
    })
  })

  describe('when a custom component is provided in the schema', () => {
    it('then it renders the custom component', async () => {
      const InlineComponent = defineComponent({
        template: `<h1>Hello World!</h1>`,
      })

      const wrapper = mount(FormSectionContent, {
        props: {
          section: {
            id: 'section1',
            legend: 'Section 1',
            component: markRaw(InlineComponent),
          },
        },
      })

      expect(wrapper.findComponent(InlineComponent).exists()).toBe(true)
      expect(wrapper.html()).toContain('Hello World!')
    })
  })
})
