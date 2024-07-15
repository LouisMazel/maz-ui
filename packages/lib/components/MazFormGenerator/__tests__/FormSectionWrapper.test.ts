import { shallowMount } from '@vue/test-utils'

import FormSectionContainer from '@/domains/views/summary/components/FormGenerator/FormSectionContainer.vue'

describe('given a FormSectionContainer component', () => {
  describe('when has a title has property', () => {
    const title = 'Section Title'

    const wrapper = shallowMount(FormSectionContainer, {
      props: {
        title,
      },
    })

    it('then it renders title', () => {
      expect(wrapper.text()).toContain(title)
    })
  })

  describe('when has footer as slot', () => {
    it('then it renders the footer', () => {
      const wrapper = shallowMount(FormSectionContainer, {
        slots: {
          footer: '<div id="forSlotFooter"></div>',
        },
      })

      expect(wrapper.find('div#forSlotFooter').exists()).toBeTruthy()
    })
  })
})
