<script lang="ts" setup>
import { minLength, pipe, string } from 'valibot'

const toast = useToast()

toast.message('Votre mot de passe a été mis à jour', {
  position: 'bottom-left',
  timeout: 10000,
  button: {
    onClick: () => toast.success('CLICKED'),
    text: 'Button',
  },
})
toast.success('Votre mot de passe a été mis à jour', {
  position: 'bottom-right',
})
toast.warning('Votre mot de passe a été mis à jour', {
  position: 'bottom-right',
})
toast.error('Votre mot de passe a été mis à jour', {
  position: 'bottom-right',
})

const { model, handleSubmit, errorMessages, hasError, isValid } = useFormValidator({
  schema: {
    username: pipe(string(), minLength(3)),
    password: pipe(string(), minLength(3)),
    select: pipe(string(), minLength(1)),
  },
  options: {
    mode: 'progressive',
  },
})

const username = useTemplateRef('username')
const password = useTemplateRef('password')
const select = useTemplateRef('select')

useFormField('username', {
  ref: username,
})
useFormField('password', {
  ref: password,
})
useFormField('select', {
  ref: select,
})

const onSubmit = handleSubmit((value) => {
  // eslint-disable-next-line no-console
  console.log('submit', value)
})
</script>

<template>
  <div class="home maz:h-screen">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <form class="maz:flex maz:flex-col maz:gap-2" @submit.prevent="onSubmit">
        {{ { isValid, hasError } }}
        <MazAlert v-if="hasError" variant="soft" color="destructive">
          {{ errorMessages }}
        </MazAlert>
        <MazInput
          ref="username"
          v-model="model.username"
          placeholder="Name"
          autocomplete="username"
          :error="!!errorMessages.username"
          :assistive-text="errorMessages.username"
          name="username"
        />

        <MazInput
          ref="password"
          v-model="model.password"
          placeholder="Password"
          autocomplete="current-password"
          :error="!!errorMessages.password"
          :assistive-text="errorMessages.password"
          name="password"
          type="password"
        />

        <MazSelect
          ref="select"
          v-model="model.select"
          :options="['1', '2', '3']"
          placeholder="Select"
          :error="!!errorMessages.select"
          :assistive-text="errorMessages.select"
          color="secondary"
          search
        />

        <MazBtn type="submit">
          Submit
        </MazBtn>
      </form>
      <!-- End Developping Area -->
    </div>
  </div>
</template>
