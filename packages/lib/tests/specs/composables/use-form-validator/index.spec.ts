import { mount } from '@vue/test-utils'
import { minLength, minValue, number, object, pipe, string } from 'valibot'
import { defineComponent, nextTick, ref } from 'vue'

import type { UseFormField, UseFormValidator } from '@modules/composables/use-form-validator'
import { useFormField, useFormValidator } from '@modules/composables/use-form-validator'
import { sleep } from '@modules/helpers/sleep'

interface Model {
  [key: string]: unknown
  name: string
  age: number
}

function createFormComponent(_useFormValidator: UseFormValidator<Model>, _useFormField: typeof useFormField) {
  return defineComponent({
    setup() {
      const schema = ref(
        object({
          name: pipe(string(), minLength(3, 'Name must be at least 3 characters')),
          age: pipe(number(), minValue(18, 'You must be at least 18 years old')),
        }),
      )

      const initialModel = ref({
        name: '',
        age: 0,
      })

      const form = _useFormValidator({
        schema,
        model: initialModel,
        options: { mode: 'aggressive' },
      })

      const nameField = _useFormField<Model, 'name'>('name')
      const ageField = _useFormField<Model, 'age'>('age', { defaultValue: 10 })

      return { form, nameField, ageField }
    },
    template: `
      <div>
        <input class="has-input-error" />
      </div>
    `,
  })
}

describe('given useFormValidator', () => {
  let wrapper: ReturnType<typeof mount>
  let form: ReturnType<UseFormValidator<Model>>

  beforeEach(() => {
    const FormComponent = createFormComponent(useFormValidator, useFormField)
    wrapper = mount(FormComponent)
    // @ts-expect-error - form is private
    form = wrapper.vm.form
  })

  describe('when mounted', () => {
    it('then it initialized with correct values', () => {
      expect(form.isDirty.value).toBe(false)
      expect(form.isSubmitting.value).toBe(false)
      expect(form.isSubmitted.value).toBe(false)
      expect(form.isValid.value).toBe(false)
      expect(form.errors.value).toEqual({
        age: expect.any(Array),
        name: expect.any(Array),
      })
    })
  })

  describe('when model is updated', () => {
    it('then isDirty is updated', async () => {
      form.model.value.name = 'John'
      await nextTick()
      expect(form.isDirty.value).toBe(true)
    })
  })

  describe('when form is submitted', () => {
    it('then it validates form on submit', async () => {
      const mockSuccessCallback = vi.fn()
      const submitHandler = form.handleSubmit(mockSuccessCallback)

      await submitHandler(new Event('submit'))

      expect(form.isSubmitted.value).toBe(true)
      expect(form.isValid.value).toBe(false)
      expect(mockSuccessCallback).not.toHaveBeenCalled()

      form.model.value.name = 'John'
      form.model.value.age = 25
      await nextTick()

      await submitHandler(new Event('submit'))

      expect(form.isValid.value).toBe(true)
      expect(mockSuccessCallback).toHaveBeenCalledWith(form.model.value)
    })
  })
})

describe('given useFormField', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<UseFormField<Model>>
  let ageField: ReturnType<UseFormField<Model>>

  beforeEach(() => {
    const FormComponent = createFormComponent(useFormValidator, useFormField)
    wrapper = mount(FormComponent)
    // @ts-expect-error - nameField is private
    nameField = wrapper.vm.nameField
    // @ts-expect-error - ageField is private
    ageField = wrapper.vm.ageField
  })

  describe('when mounted', () => {
    it('then it initialized with correct values', async () => {
      await sleep(0)

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.isDirty.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isValidated.value).toBe(true)
      expect(nameField.isValidating.value).toBe(false)
      expect(nameField.value.value).toBe('')

      expect(ageField.isValid.value).toBe(false)
      expect(ageField.value.value).toBe(10)
    })
  })

  describe('when field value is updated', () => {
    it('then it update value and validate on input', async () => {
      nameField.value.value = 'Jo'

      await sleep(0)

      expect(nameField.isDirty.value).toBe(true)
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')
      expect(nameField.hasError.value).toBe(true)

      nameField.value.value = 'John'

      await sleep(0)

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
    })
  })
})
