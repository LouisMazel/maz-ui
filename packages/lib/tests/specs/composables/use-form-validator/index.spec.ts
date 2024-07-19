import { flushPromises, mount } from '@vue/test-utils'
import { minLength, minValue, number, pipe, string } from 'valibot'
import { defineComponent, nextTick, ref } from 'vue'

import type { UseFormField, UseFormValidator } from '@modules/composables/use-form-validator'
import { useFormField, useFormValidator } from '@modules/composables/use-form-validator'

interface Model {
  name: string
  age: number
}

const defaultOptions: {
  mode?: 'lazy' | 'aggressive' | 'blur' | 'eager' | 'input'
  useEvents?: boolean
} = {
  mode: 'aggressive',
  useEvents: false,
}

function createFormComponent(options?: typeof defaultOptions) {
  const opts = { ...defaultOptions, ...options }
  return defineComponent({
    setup() {
      const schema = {
        name: pipe(string(), minLength(3, 'Name must be at least 3 characters')),
        age: pipe(number(), minValue(18, 'You must be at least 18 years old')),
      }

      const initialModel = ref({
        name: '',
        age: 0,
      })

      const identifier = Symbol('test')

      const form = useFormValidator<Model>({
        schema,
        model: initialModel,
        options: {
          mode: opts.mode,
          identifier,
          throttledFields: {
            name: 200,
          },
          debouncedFields: {
            age: 200,
          },
        },
      })

      const nameField = useFormField<string, Model>('name', { formIdentifier: identifier })
      const ageField = useFormField<number, Model>('age', {
        defaultValue: 10,
        formIdentifier: identifier,
        mode: 'lazy',
      })
      const passwordField = useFormField<string, Model>('age', { formIdentifier: identifier })

      return { form, nameField, ageField, passwordField }
    },
    template: `
      <div>
        <input class="has-field-error" />
      </div>
    `,
  })
}

describe('given useFormValidator', () => {
  let wrapper: ReturnType<typeof mount>
  let form: ReturnType<UseFormValidator<Model>>

  beforeEach(() => {
    const FormComponent = createFormComponent()
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

describe('given useFormField with aggressive mode', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<UseFormField<string>>
  let ageField: ReturnType<UseFormField<number>>

  beforeEach(() => {
    vi.useFakeTimers()
    const FormComponent = createFormComponent()
    wrapper = mount(FormComponent)
    // @ts-expect-error - nameField is private
    nameField = wrapper.vm.nameField
    // @ts-expect-error - ageField is private
    ageField = wrapper.vm.ageField
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when mounted', () => {
    it('then it initialized with correct values', async () => {
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.isDirty.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isValidated.value).toBe(true)
      expect(nameField.mode.value).toBe('aggressive')
      expect(nameField.isValidating.value).toBe(false)
      expect(nameField.errors.value[0].message).toContain('Name must be at least 3 characters')
      expect(nameField.value.value).toBe('')

      expect(ageField.isValid.value).toBe(false)
      expect(ageField.value.value).toBe(10)
    })
  })

  describe('when field value is updated', () => {
    it('then it update value and validate on input', async () => {
      nameField.value.value = 'Jo'

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isDirty.value).toBe(true)
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')
      expect(nameField.hasError.value).toBe(true)

      nameField.value.value = 'John'

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
    })
  })
})

describe('given useFormField with eager mode', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<UseFormField<string>>
  let ageField: ReturnType<UseFormField<number>>
  let passwordField: ReturnType<UseFormField<string>>

  beforeEach(() => {
    vi.useFakeTimers()
    const FormComponent = createFormComponent({
      mode: 'eager',
      useEvents: true,
    })

    wrapper = mount(FormComponent)
    // @ts-expect-error - nameField is private
    nameField = wrapper.vm.nameField
    // @ts-expect-error - ageField is private
    ageField = wrapper.vm.ageField
    // @ts-expect-error - passwordField is private
    passwordField = wrapper.vm.passwordField
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when mounted', () => {
    it('then it initialized with correct values', async () => {
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.isDirty.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isValidated.value).toBe(true)
      expect(nameField.mode.value).toBe('eager')
      expect(nameField.isValidating.value).toBe(false)
      expect(nameField.errors.value[0].message).toContain('Name must be at least 3 characters')
      expect(nameField.value.value).toBe('')
      expect(ageField.isValid.value).toBe(false)
      expect(ageField.value.value).toBe(10)
    })
  })

  describe('when field value is updated', () => {
    it('then it updates value and validates on blur', async () => {
      nameField.value.value = 'Jo'
      // @ts-expect-error - method is defined
      nameField.validationEvents.value.onBlur()

      passwordField.value.value = 'password'
      // @ts-expect-error - method is defined
      passwordField.validationEvents.value.onBlur()

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isDirty.value).toBe(true)
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')
      expect(nameField.isBlurred.value).toBe(true)

      nameField.value.value = 'John'
      nameField.validationEvents.value?.onBlur()

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
    })

    it('then it does not show errors before blur', async () => {
      nameField.value.value = 'Jo'

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
    })
  })
})

describe('given useFormField with lazy mode', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<UseFormField<string>>

  beforeEach(() => {
    vi.useFakeTimers()
    const FormComponent = createFormComponent({
      mode: 'lazy',
    })

    wrapper = mount(FormComponent)
    // @ts-expect-error - nameField is private
    nameField = wrapper.vm.nameField
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when field value is updated', () => {
    it('then it validates on value changed', async () => {
      nameField.value.value = 'Jo'

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isDirty.value).toBe(true)
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isBlurred.value).toBe(false)

      nameField.value.value = 'John'
      wrapper.find('input').setValue('John')
      wrapper.find('input').element.dispatchEvent(new Event('blur'))

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
    })
  })
})

describe('given useFormField with blur mode', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<UseFormField<string>>

  beforeEach(() => {
    vi.useFakeTimers()
    const FormComponent = createFormComponent({
      mode: 'blur',
      useEvents: true,
    })

    wrapper = mount(FormComponent)
    // @ts-expect-error - nameField is private
    nameField = wrapper.vm.nameField
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when field is blurred', () => {
    it('then it validates on every blur', async () => {
      // @ts-expect-error - method is defined
      nameField.validationEvents.value.onBlur()

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isBlurred.value).toBe(true)

      nameField.value.value = 'John'
      wrapper.find('input').element.value = 'John'
      // @ts-expect-error - method is defined
      nameField.validationEvents.value.onBlur()

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
    })
  })
})

describe('given useFormField with input mode', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<UseFormField<string>>

  beforeEach(() => {
    vi.useFakeTimers()
    const FormComponent = createFormComponent({
      mode: 'input',
      useEvents: true,
    })

    wrapper = mount(FormComponent)
    // @ts-expect-error - nameField is private
    nameField = wrapper.vm.nameField
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when field value is updated', () => {
    it('then it validates on every input', async () => {
      nameField.value.value = 'J'
      nameField.validationEvents.value?.['onUpdate:modelValue']()

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)

      nameField.value.value = 'John'
      nameField.validationEvents.value?.['onUpdate:modelValue']()

      await flushPromises()
      vi.advanceTimersByTime(300)

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
    })
  })
})
