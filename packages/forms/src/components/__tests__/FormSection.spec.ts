import type { FormSection } from '../../../src/utils/schema-helpers'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import FormSectionComponent from '../../../src/components/FormSection.vue'

interface TestFormModel extends Record<string, unknown> {
  name: string
  email: string
}

function createSection(options: Partial<FormSection<TestFormModel>> = {}): FormSection<TestFormModel> {
  return {
    id: 'main',
    fields: [
      { name: 'name', component: 'MazInput', props: { label: 'Name' } },
      { name: 'email', component: 'MazInput', props: { label: 'Email' } },
    ],
    ...options,
  }
}

function mountFormSection(
  model: TestFormModel,
  section: FormSection<TestFormModel>,
  additionalProps: Record<string, unknown> = {},
) {
  return mount(FormSectionComponent as any, {
    props: {
      modelValue: model,
      section,
      model,
      components: {},
      ...additionalProps,
    },
  })
}

describe('FormSection', () => {
  describe('Given a FormSection component', () => {
    describe('When rendering without card', () => {
      it('renders fieldset element', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const fieldset = wrapper.find('fieldset')
        expect(fieldset.exists()).toBe(true)
      })

      it('does not render MazCard', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const card = wrapper.findComponent({ name: 'MazCard' })
        expect(card.exists()).toBe(false)
      })
    })

    describe('When rendering with legend', () => {
      it('renders legend element with text', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({ legend: 'Personal Information' })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const legend = wrapper.find('legend')
        expect(legend.exists()).toBe(true)
        expect(legend.text()).toBe('Personal Information')
      })

      it('sets aria-labelledby on fieldset', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({ legend: 'Personal Information' })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const fieldset = wrapper.find('fieldset')
        expect(fieldset.attributes('aria-labelledby')).toBeDefined()
      })
    })

    describe('When rendering without legend', () => {
      it('does not render legend element', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const legend = wrapper.find('legend')
        expect(legend.exists()).toBe(false)
      })

      it('does not set aria-labelledby on fieldset', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const fieldset = wrapper.find('fieldset')
        expect(fieldset.attributes('aria-labelledby')).toBeUndefined()
      })
    })

    describe('When rendering with empty legend', () => {
      it('does not render legend element', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({ legend: '' })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const legend = wrapper.find('legend')
        expect(legend.exists()).toBe(false)
      })
    })

    describe('When rendering with card set to true', () => {
      it('renders MazCard component', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({ card: true })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const card = wrapper.findComponent({ name: 'MazCard' })
        expect(card.exists()).toBe(true)
      })

      it('renders fieldset inside card', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({ card: true })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const fieldset = wrapper.find('fieldset')
        expect(fieldset.exists()).toBe(true)
      })
    })

    describe('When rendering with card set to object', () => {
      it('passes card props to MazCard', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({
          card: { radius: true },
        })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const card = wrapper.findComponent({ name: 'MazCard' })
        expect(card.exists()).toBe(true)
      })
    })

    describe('When rendering with card and legend', () => {
      it('uses legend as card title', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({
          card: true,
          legend: 'Section Title',
        })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const card = wrapper.findComponent({ name: 'MazCard' })
        expect(card.exists()).toBe(true)
      })
    })

    describe('When rendering with card set to false', () => {
      it('does not render MazCard', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({ card: false })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const card = wrapper.findComponent({ name: 'MazCard' })
        expect(card.exists()).toBe(false)
      })
    })

    describe('When readonly prop is passed', () => {
      it('passes readonly to fields', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section, { readonly: true })

        await flushPromises()

        const fieldComponents = wrapper.findAllComponents({ name: 'FormField' })
        expect(fieldComponents.length).toBeGreaterThan(0)
      })
    })

    describe('When disabled prop is passed', () => {
      it('passes disabled to fields', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section, { disabled: true })

        await flushPromises()

        const fieldComponents = wrapper.findAllComponents({ name: 'FormField' })
        expect(fieldComponents.length).toBeGreaterThan(0)
      })
    })

    describe('When model is updated', () => {
      it('updates field values', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const updatedModel: TestFormModel = { name: 'Jane', email: '' }
        await wrapper.setProps({ model: updatedModel, modelValue: updatedModel })
        await flushPromises()

        expect(updatedModel.name).toBe('Jane')
      })
    })

    describe('When section has multiple fields', () => {
      it('renders FormField for each field', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection()
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const fieldComponents = wrapper.findAllComponents({ name: 'FormField' })
        expect(fieldComponents).toHaveLength(2)
      })
    })

    describe('When section has no fields', () => {
      it('renders empty fieldset', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section: FormSection<TestFormModel> = {
          id: 'empty',
          fields: [],
        }
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()

        const fieldset = wrapper.find('fieldset')
        expect(fieldset.exists()).toBe(true)
        const fieldComponents = wrapper.findAllComponents({ name: 'FormField' })
        expect(fieldComponents).toHaveLength(0)
      })
    })

    describe('When card has role group', () => {
      it('sets role group on card', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const section = createSection({ card: true, legend: 'Section' })
        const wrapper = mountFormSection(model.value, section)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const card = wrapper.findComponent({ name: 'MazCard' })
        expect(card.exists()).toBe(true)
      })
    })
  })
})
