import { useFormField, useFormValidator } from '@composables/index'
import { withSetup } from '@tests/helpers/withSetup'
import { flushPromises, mount } from '@vue/test-utils'

import { minLength, minValue, number, pipe, string } from 'valibot'
import { defineComponent, nextTick, ref } from 'vue'

const defaultOptions: {
  mode?: 'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'
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
        password: pipe(string(), minLength(8, 'Password must be at least 8 characters')),
      }

      const initialModel = ref({
        name: '',
        age: 0,

        password: '12345678',
      })

      const identifier = Symbol('test')

      const form = useFormValidator<typeof schema>({
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

      const nameField = useFormField<string>('name', { formIdentifier: identifier })
      const ageField = useFormField<number>('age', {
        defaultValue: 10,
        formIdentifier: identifier,
        mode: 'lazy',
      })
      const passwordField = useFormField<string>('password', { formIdentifier: identifier })

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
  let form: ReturnType<typeof useFormValidator<any>>

  beforeEach(() => {
    vi.useFakeTimers()

    const FormComponent = createFormComponent()
    wrapper = mount(FormComponent)
    // @ts-expect-error - form is private
    form = wrapper.vm.form
  })

  afterEach(() => {
    wrapper.unmount()
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
        password: expect.any(Array),
      })
    })
  })

  describe('when model is updated', () => {
    it('then isDirty is updated', async () => {
      form.model.value.name = 'John'

      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(form.isDirty.value).toBe(true)
    })
  })

  describe('when form is submitted', () => {
    it('then it validates form on submit', async () => {
      const mockSuccessCallback = vi.fn()
      const submitHandler = form.handleSubmit(mockSuccessCallback, undefined, { resetOnSuccess: false })

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
  let nameField: ReturnType<typeof useFormField<any>>
  let ageField: ReturnType<typeof useFormField<any>>

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

      vi.advanceTimersByTime(300)
      await flushPromises()

      expect(nameField.isDirty.value).toBe(true)
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')
      expect(nameField.hasError.value).toBe(true)

      nameField.value.value = 'John'

      vi.advanceTimersByTime(300)
      await flushPromises()

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
    })
  })
})

describe('given useFormField with eager mode', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<typeof useFormField<any>>
  let ageField: ReturnType<typeof useFormField<any>>
  let passwordField: ReturnType<typeof useFormField<any>>

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
  let nameField: ReturnType<typeof useFormField<any>>

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
  let nameField: ReturnType<typeof useFormField<any>>

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
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.errorMessage.value).toBeUndefined()

      nameField.validationEvents.value?.onBlur()
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')

      nameField.value.value = 'John'
      nameField.validationEvents.value?.onBlur()
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBeUndefined()
    })
  })
})

describe('given useFormField with progressive mode', () => {
  let wrapper: ReturnType<typeof mount>
  let nameField: ReturnType<typeof useFormField<any>>

  beforeEach(() => {
    vi.useFakeTimers()
    const FormComponent = createFormComponent({
      mode: 'progressive',
    })

    wrapper = mount(FormComponent)
    // @ts-expect-error - nameField is private
    nameField = wrapper.vm.nameField
  })

  afterEach(() => {
    vi.useRealTimers()
    wrapper.unmount()
  })

  describe('when field is blurred', () => {
    it('then it validates on every blur', async () => {
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.errorMessage.value).toBeUndefined()

      nameField.validationEvents.value?.onBlur()
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')

      nameField.value.value = 'John'
      nameField.validationEvents.value?.onBlur()
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBeUndefined()
    })

    it('then on input it displays success state only when it\'s valid', async () => {
      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.errorMessage.value).toBeUndefined()

      nameField.value.value = 'Jo'
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.errorMessage.value).toBeUndefined()

      nameField.value.value = 'John'
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(false)
      expect(nameField.errorMessage.value).toBeUndefined()
    })

    it('then it blurred and update state on input', async () => {
      nameField.validationEvents.value?.onBlur()
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')

      nameField.value.value = 'Jo'
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')

      nameField.value.value = 'John'
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBeUndefined()

      nameField.value.value = 'Jo'
      vi.advanceTimersByTime(200)
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.isBlurred.value).toBe(true)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')
    })
  })
})

describe('given the returned scrollToError', () => {
  describe('when called with an explicit selector', () => {
    it('then it scrolls to the matching element', () => {
      const el = document.createElement('div')
      el.classList.add('custom-error')
      el.scrollIntoView = vi.fn()
      document.body.appendChild(el)

      const [result] = withSetup(() => useFormValidator({
        schema: { name: pipe(string(), minLength(2)) },
        defaultValues: { name: '' },
      }))

      result.scrollToError('.custom-error')

      expect(el.scrollIntoView).toHaveBeenCalled()
      document.body.removeChild(el)
    })
  })

  describe('when called without selector and a string scrollToError is configured', () => {
    it('then it uses the configured selector', () => {
      const el = document.createElement('div')
      el.classList.add('configured-error')
      el.scrollIntoView = vi.fn()
      document.body.appendChild(el)

      const [result] = withSetup(() => useFormValidator({
        schema: { name: pipe(string(), minLength(2)) },
        defaultValues: { name: '' },
        options: { scrollToError: '.configured-error' },
      }))

      result.scrollToError()

      expect(el.scrollIntoView).toHaveBeenCalled()
      document.body.removeChild(el)
    })
  })

  describe('when called without selector and scrollToError is a boolean', () => {
    it('then it falls back to the default selector without throwing', () => {
      const [result] = withSetup(() => useFormValidator({
        schema: { name: pipe(string(), minLength(2)) },
        defaultValues: { name: '' },
        options: { scrollToError: true },
      }))

      expect(() => result.scrollToError()).not.toThrow()
    })
  })
})

function createEagerRevalidationComponent() {
  return defineComponent({
    setup() {
      const schema = {
        name: pipe(string(), minLength(3, 'Name must be at least 3 characters')),
      }
      const identifier = Symbol('eager-revalidation')
      const form = useFormValidator<typeof schema>({
        schema,
        defaultValues: { name: '' },
        options: { mode: 'eager', identifier },
      })
      const nameField = useFormField<string>('name', { formIdentifier: identifier })
      return { form, nameField }
    },
    template: '<div><input /></div>',
  })
}

describe('given an eager field that has been blurred and is valid', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  describe('when its value changes on input and becomes invalid', () => {
    it('then it revalidates and invalidates without requiring a new blur', async () => {
      const wrapper = mount(createEagerRevalidationComponent())
      // @ts-expect-error - nameField is exposed for testing
      const nameField = wrapper.vm.nameField as ReturnType<typeof useFormField<string>>

      nameField.value.value = 'John'
      nameField.validationEvents.value?.onBlur()
      await flushPromises()

      expect(nameField.isValid.value).toBe(true)
      expect(nameField.hasError.value).toBe(false)
      expect(nameField.isBlurred.value).toBe(true)

      nameField.value.value = 'Jo'
      await flushPromises()

      expect(nameField.isValid.value).toBe(false)
      expect(nameField.hasError.value).toBe(true)
      expect(nameField.errorMessage.value).toBe('Name must be at least 3 characters')

      wrapper.unmount()
    })
  })
})
