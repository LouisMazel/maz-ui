<script lang="ts" setup>
/* eslint-disable vue/no-unused-refs */
import { useFormField, useFormValidator, useToast } from 'maz-ui/src/composables/index.js'
import { email, nonEmpty, pipe, string } from 'valibot'
import { ref } from 'vue'

const toast = useToast()

// Form data
const twoFactorCode = ref('')
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const showSuccessDialog = ref(false)
const step = ref(1)

const { model, errorMessages, handleSubmit } = useFormValidator({
  schema: {
    email: pipe(string('Email is required'), nonEmpty('Email is required'), email('Email is invalid')),
    password: pipe(string('Password is required'), nonEmpty('Password is required')),
  },
  options: { mode: 'progressive' },
})

useFormField('email', { ref: 'emailRef' })
useFormField('password', { ref: 'passwordRef' })

// Methods
function forgotPassword() {
  toast.info('Reset password link sent to your email')
}

function goToRegister() {
  toast.info('Registration feature coming soon!')
}

async function resendCode() {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
  toast.success('New code sent to your email')
}

async function verifyCode() {
  if (twoFactorCode.value.length !== 4) {
    hasError.value = true
    errorMessage.value = 'Please enter a valid code'
    return
  }

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
  showSuccessDialog.value = true
}

const onSubmit = handleSubmit(() => {
  step.value = 2
})
</script>

<template>
  <div class="vp-raw maz-flex">
    <div class="maz-hidden maz-flex-1 maz-flex-col maz-justify-center maz-gap-2 maz-bg-theme maz-p-6 tab-m:maz-flex">
      <MazIcon src="/img/logo.svg" size="3rem" style="height: 1em !important; width: auto;" />

      <p class="maz-text-center maz-text-sm maz-text-white dark:maz-text-black">
        Standalone components and tools library for Vue & Nuxt
      </p>
    </div>
    <div class="maz-flex maz-flex-1 maz-items-center maz-py-6 maz-pr-6">
      <MazStepper v-model="step" auto-validate-steps>
        <template #title-1>
          Sign In
        </template>
        <template #subtitle-1>
          Welcome back!
        </template>
        <template #content-1>
          <form novalidate class="maz-space-y-4" @submit.prevent="onSubmit">
            <MazInput
              ref="emailRef"
              v-model="model.email"
              top-label="Email"
              type="email"
              required
              autocomplete="email"
              :error="!!errorMessages.email"
              :hint="errorMessages.email"
              placeholder="john.doe@example.com"
              left-icon="envelope"
              block
            />

            <MazInput
              ref="passwordRef"
              v-model="model.password"
              top-label="Password"
              type="password"
              placeholder="********"
              required
              autocomplete="off"
              :error="!!errorMessages.password"
              :hint="errorMessages.password"
              left-icon="lock-closed"
              block
            />

            <div class="maz-flex maz-items-center maz-justify-between">
              <MazCheckbox v-model="model.rememberMe" color="theme">
                Remember me
              </MazCheckbox>

              <MazLink color="theme" href="#" @click.prevent="forgotPassword">
                Forgot password?
              </MazLink>
            </div>

            <MazBtn type="submit" color="theme" block :loading="isLoading">
              Sign In
            </MazBtn>

            <div class="maz-text-center maz-text-muted">
              Don't have an account?
              <MazLink color="theme" href="#" @click.prevent="goToRegister">
                Register
              </MazLink>
            </div>
          </form>
        </template>

        <template #title-2>
          Two Factor Auth
        </template>
        <template #subtitle-2>
          Enter the code sent to your email
        </template>
        <template #content-2="{ previousStep }">
          <div class="maz-space-y-4">
            <MazInputCode
              v-model="twoFactorCode"
              length="6"
              :error="hasError"
              :hint="errorMessage"
            />

            <div class="maz-flex maz-gap-4">
              <MazBtn color="secondary" block @click="previousStep">
                Back
              </MazBtn>
              <MazBtn color="theme" block :loading="isLoading" @click="verifyCode">
                Verify
              </MazBtn>
            </div>

            <MazBtn color="theme" outline block @click="resendCode">
              Resend code
            </MazBtn>
          </div>
        </template>
      </MazStepper>
    </div>

    <MazDialog v-model="showSuccessDialog" title="Welcome back!">
      <p>You have successfully signed in.</p>
      <template #footer="{ close }">
        <MazBtn color="theme" @click="close">
          Continue
        </MazBtn>
      </template>
    </MazDialog>
  </div>
</template>
