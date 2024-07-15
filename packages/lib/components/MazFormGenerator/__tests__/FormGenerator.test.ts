import { flushPromises, shallowMount } from '@vue/test-utils'

import FormGenerator from '@/domains/views/summary/components/FormGenerator/FormGenerator.vue'

describe('given a FormGenerator component', () => {
  let wrapper: ReturnType<typeof shallowMount<typeof FormGenerator>>

  beforeEach(() => {
    wrapper = shallowMount(FormGenerator, {
      props: {
        sections: [
          {
            id: 'section1',
            legend: 'Section 1',
            fields: [
              {
                id: 'field1',
                name: 'field1',
                componentName: 'AdsInput',
                defaultValue: 'accor',
              },
              {
                id: 'field2',
                name: 'field2',
                componentName: 'AdsInput',
                defaultValue: 'encore',
              },
            ],
          },
          {
            id: 'section2',
            legend: 'Section 2',
            fields: [
              {
                id: 'field3',
                name: 'field3',
                componentName: 'AdsInput',
              },
              {
                id: 'field4',
                name: 'field4',
                componentName: 'AdsInput',
              },
            ],
          },
        ],
      },
    })
  })

  describe('when it is mounted with defaults prop', () => {
    it('then it renders default submit button', () => {
      const button = wrapper.find('[data-testid="submitButton"]')

      expect(button.exists()).toBeTruthy()
      expect(button.html()).toContain('Submit')
    })

    it('then it renders content div and form section for each section', () => {
      const fieldset = wrapper.findAll('fieldset.content')
      const sections = wrapper.findAllComponents({ name: 'FormSection' })

      expect(fieldset.length).toBe(2)
      expect(sections.length).toBe(2)
    })

    it('then it renders fields for each section with default values', async () => {
      // @ts-expect-error - Method is not typed in the component
      expect(wrapper.vm.payload.field1).toBe('accor')
      // @ts-expect-error - Method is not typed in the component
      expect(wrapper.vm.payload.field2).toBe('encore')
      // @ts-expect-error - Method is not typed in the component
      expect(wrapper.vm.payload.field3).toBe()
      // @ts-expect-error - Method is not typed in the component
      expect(wrapper.vm.payload.field4).toBe()
    })
  })

  describe('when section dont have wrapper and have legend', () => {
    it('then it renders fieldset with legend', async () => {
      await wrapper.setProps({
        sections: [
          {
            id: 'section1',
            legend: 'Section 1',
            fields: [
              {
                id: 'field1',
                name: 'field1',
                componentName: 'AdsInput',
                defaultValue: 'accor',
              },
            ],
          },
        ],
      })

      expect(wrapper.find('fieldset legend').exists()).toBeTruthy()
    })
  })

  describe('when form is submitted', () => {
    it('then it emits submit event', async () => {
      wrapper.find('form').trigger('submit')

      await flushPromises()

      expect(wrapper.emitted('submit')).toBeDefined()
      expect(wrapper.emitted('submit')?.[0][0]).toStrictEqual({
        field1: 'accor',
        field2: 'encore',
      })
    })
  })
})
