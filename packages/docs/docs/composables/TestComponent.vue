<template>
  <ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmit">
    <MazInput
      v-model="model.name"
      label="Enter your name"
      :hint="errorMessages.name"
      :error="!!errorMessages.name"
      :success="fieldsStates.name.valid"
      :class="{ 'has-error': !!errorMessages.name }"
    />
    <MazInput
      v-model="model.age"
      type="number"
      label="Enter your age"
      :hint="errorMessages.age"
      :error="!!errorMessages.age"
      :success="fieldsStates.age.valid"
      :class="{ 'has-error': !!errorMessages.age }"
    />
    <MazSelect
      v-model="model.country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="errorMessages.country"
      :error="!!errorMessages.country"
      :success="fieldsStates.country.valid"
      :class="{ 'has-error': !!errorMessages.country }"
    />
    <MazCheckbox v-model="model.agree" :success="fieldsStates.agree.valid" :class="{ 'has-error': !!errorMessages.agree }">
      <div>
        <p>I agree to the terms and conditions</p>
        <p v-if="errorMessages.agree" class="maz-text-danger-600 maz-text-sm">
          {{ errorMessages.agree }}
        </p>
      </div>
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
  <template #code>

  ```vue
  <template>
    <form @submit="onSubmit">
      <MazInput
        v-model="model.name"
        label="Enter your name"
        :hint="errorMessages.name"
        :error="!!errorMessages.name"
        :class="{ 'has-error': !!errorMessages.name }"
      />
      <MazInput
        v-model="model.age"
        type="number"
        label="Enter your age"
        :hint="errorMessages.age"
        :error="!!errorMessages.age"
        :class="{ 'has-error': !!errorMessages.age }"
      />
      <MazSelect
        v-model="model.country"
        :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
        label="Select your nationality"
        :hint="errorMessages.age"
        :error="!!errorMessages.age"
        :class="{ 'has-error': !!errorMessages.age }"
      />
      <MazCheckbox ref="agreeInputRef" v-model="model.agree" :class="{ 'has-error': !!errorMessages.agree }">
        <div>
          <p>I agree to the terms and conditions</p>
          <p v-if="errorMessages.agree" class="maz-text-danger-600 maz-text-sm">
            {{ errorMessages.agree }}
          </p>
        </div>
      </MazCheckbox>
      <MazBtn type="submit" :loading="isSubmitting">
        Submit
      </MazBtn>
    </form>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'
    import { useFormValidator, sleep, useToast } from 'maz-ui'
    import type { InferFormValidatorSchema } from 'maz-ui'
    import { string, object, nonEmpty, pipe, number, minValue, maxValue, boolean, literal } from 'valibot'

    const toast = useToast()

    const schema = ref({
      name: pipe(string('Name is required'), nonEmpty('Name is required')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
    })

    type Model = InferFormValidatorSchema<typeof schema>

    const { model, isValid, isSubmitting, handleSubmit, errorMessages, fieldsStates } = useFormValidator<Model>({
      schema,
      defaultValues: { name: 'John Doe' },
      options: { mode: 'lazy', scrollToError: '.has-error' },
    })

    const onSubmit = handleSubmit(async (formData) => {
      // Form submission logic
      console.log(formData)
      await sleep(2000)
      toast.success('Form submitted', { position: 'top' })
    })
  </script>
  ```

  </template>
</ComponentDemo>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useFormValidator, sleep, useToast } from 'maz-ui'
  import type { InferFormValidatorSchema } from 'maz-ui'
  import { string, nonEmpty, pipe, number, minValue, maxValue, boolean, literal } from 'valibot'

  const toast = useToast()

  const schema = ref({
    name: pipe(string('Name is required'), nonEmpty('Name is required')),
    age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
    agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
    country: pipe(string('Country is required'), nonEmpty('Country is required')),
  })

  type Model = InferFormValidatorSchema<typeof schema>

  const { model, isSubmitting, handleSubmit, errorMessages, fieldsStates } = useFormValidator<Model>({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
    },
    defaultValues: { name: 'John Doe' },
    options: { mode: 'lazy', scrollToError: '.has-error' },
  })

  const onSubmit = handleSubmit(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })
</script>