import type { FormSchema } from '../../../src/utils/schema-helpers'
import { flushPromises, mount } from '@vue/test-utils'
import { minLength, pipe, string } from 'valibot'
import { nextTick, ref } from 'vue'
import MazFormBuilder from '../../../src/components/FormBuilder.vue'

interface TestFormModel {
  name: string
  email: string
}

function createTestSchema(): FormSchema<TestFormModel> {
  return {
    sections: [
      {
        id: 'main',
        fields: [
          {
            name: 'name',
            component: 'MazInput',
            props: { label: 'Name' },
            validation: {
              rule: pipe(string(), minLength(2, 'Name must be at least 2 characters')),
            },
          },
          {
            name: 'email',
            component: 'MazInput',
            props: { label: 'Email' },
            validation: {
              rule: pipe(string(), minLength(5, 'Email must be at least 5 characters')),
            },
          },
        ],
      },
    ],
  }
}

describe('FormBuilder', () => {
  describe('Given a FormBuilder component', () => {
    describe('When checking defineExpose properties', () => {
      it('exposes isValid computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()

        expect(wrapper.vm.isValid).toBeDefined()
        expect(typeof wrapper.vm.isValid).toBe('boolean')
      })

      it('exposes isSubmitting ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()

        expect(wrapper.vm.isSubmitting).toBeDefined()
        expect(typeof wrapper.vm.isSubmitting).toBe('boolean')
      })

      it('exposes isSubmitted ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()

        expect(wrapper.vm.isSubmitted).toBeDefined()
        expect(typeof wrapper.vm.isSubmitted).toBe('boolean')
      })

      it('exposes isDirty computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()

        expect(wrapper.vm.isDirty).toBeDefined()
        expect(typeof wrapper.vm.isDirty).toBe('boolean')
      })

      it('exposes errors computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()

        expect(wrapper.vm.errors).toBeDefined()
        expect(typeof wrapper.vm.errors).toBe('object')
      })

      it('exposes errorMessages computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()

        expect(wrapper.vm.errorMessages).toBeDefined()
        expect(typeof wrapper.vm.errorMessages).toBe('object')
      })

      it('exposes fieldsStates ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()

        expect(wrapper.vm.fieldsStates).toBeDefined()
        expect(typeof wrapper.vm.fieldsStates).toBe('object')
      })
    })

    describe('When form is submitted', () => {
      it('sets isSubmitting to true during submission', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        let isSubmittingDuringSubmit: boolean | undefined

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
            'onSubmit': () => {
              isSubmittingDuringSubmit = wrapper.vm.isSubmitting
            },
          },
        })

        await flushPromises()
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(isSubmittingDuringSubmit).toBe(true)
      })

      it('sets isSubmitted to true after submission', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()
        expect(wrapper.vm.isSubmitted).toBe(false)

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.vm.isSubmitted).toBe(true)
      })

      it('sets isSubmitting to false after submission completes', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.vm.isSubmitting).toBe(false)
      })
    })

    describe('When form has validation errors', () => {
      it('populates errors object with validation issues after form validation', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
          },
        })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const validationResult = await wrapper.vm.validateForm()
        await flushPromises()

        expect(validationResult).toBe(false)
        expect(wrapper.vm.isValid).toBe(false)

        const fieldsStates = wrapper.vm.fieldsStates as Record<string, { errors: unknown[] }>
        expect(fieldsStates.name?.errors?.length).toBeGreaterThan(0)
      })
    })

    describe('When form state changes', () => {
      it('updates isDirty when form validation processes after value change', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper = mount(MazFormBuilder, {
          props: {
            'modelValue': model.value,
            'onUpdate:modelValue': (v: TestFormModel) => { model.value = v },
            schema,
            'validationMode': 'aggressive',
          },
        })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const initialDirty = wrapper.vm.isDirty
        expect(initialDirty).toBe(false)

        await wrapper.setProps({ modelValue: { name: 'John', email: '' } })
        await flushPromises()
        await nextTick()
        await flushPromises()

        const fieldsStates = wrapper.vm.fieldsStates as Record<string, { dirty: boolean }>
        const nameDirty = fieldsStates.name?.dirty
        expect(nameDirty).toBe(true)
      })
    })
  })
})
