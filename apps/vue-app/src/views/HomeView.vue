<script lang="ts" setup>
import { useFormField } from 'maz-ui/src/composables/useFormField.js'
import { useFormValidator } from 'maz-ui/src/composables/useFormValidator.js'
import { minLength, nonEmpty, pipe, string } from 'valibot'
import { useTheme } from './../../../../packages/themes/src/composables/useTheme'

const { colorMode, isDark } = useTheme()

const { model, errorMessages, handleSubmit } = useFormValidator({
  schema: {
    name: pipe(string(), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters long')),
    select: pipe(string(), nonEmpty('Select is required')),
  },
  options: {
    mode: 'eager',
  },
})

const select = useTemplateRef('select')
const input = useTemplateRef('input')

useFormField('name', {
  ref: input,
})
useFormField('select', {
  ref: select,
})

const submit = handleSubmit((data) => {
  console.log(data)
})
</script>

<template>
  <div id="home" class="maz-flex maz-flex-col maz-items-center maz-justify-center maz-gap-8">
    <p class="maz-text-center maz-text-muted">
      Do not commit changes
    </p>
    {{ errorMessages }}

    <form @submit.prevent="submit">
      <MazInput
        ref="input"
        v-model="model.name"
        label="Name"
      />

      <MazSelect
        ref="select"
        v-model="model.select"
        :options="['1', '2', '3']"
        placeholder="Select"
        search
      />

      <button type="submit">
        Submit
      </button>
    </form>

    <code>
      colorMode: {{ colorMode }}
      <br>
      isDark: {{ isDark }}
    </code>
  </div>
</template>
