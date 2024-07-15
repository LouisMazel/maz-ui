import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'

import FormSectionComponent from '@/domains/views/summary/components/FormGenerator/FormSection.vue'
import type { FormSection } from '@/domains/views/summary/components/FormGenerator/types'

describe('given a FormSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FormSectionComponent>>
  const section: FormSection = {
    id: 'section1',
    legend: 'Section 1',
    fields: [
      {
        id: 'field1',
        name: 'field1',
        componentName: 'AdsInput',
      },
    ],
  }

  describe('when wrapper property has a title', () => {
    it('then it renders the FormSectionContainer component', () => {
      wrapper = shallowMount(FormSectionComponent, {
        props: {
          section: {
            ...section,
            wrapper: {
              title: 'title',
            },
          },
        },
      })

      expect(wrapper.findComponent({ name: 'FormSectionContainer' }).exists()).toBeTruthy()
    })
  })

  describe('when wrapper property is not provided', () => {
    it('then it not renders FormSectionContainer component', () => {
      wrapper = shallowMount(FormSectionComponent, {
        props: {
          section,
        },
      })

      expect(wrapper.findComponent({ name: 'FormSectionContainer' }).exists()).toBeFalsy()
    })
  })
})
