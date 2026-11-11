<script lang="ts" setup>
import { MazEnvelope } from '@maz-ui/icons/raw/MazEnvelope'
import { MazGithub } from '@maz-ui/icons/raw/MazGithub'
import { MazLockClosed } from '@maz-ui/icons/raw/MazLockClosed'
import { MazSparkles } from '@maz-ui/icons/raw/MazSparkles'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const remember = ref(true)
const loading = ref(false)

function submit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1200)
}
</script>

<template>
  <div class="maz:grid maz:min-h-full maz:tab-l:grid-cols-2">
    <aside class="maz:relative maz:hidden maz:flex-col maz:justify-between maz:overflow-hidden maz:bg-contrast maz:p-10 maz:text-contrast-foreground maz:tab-l:flex">
      <span class="maz:absolute maz:-inset-e-24 maz:-top-24 maz:size-72 maz:rounded-full maz:bg-primary maz:opacity-40 maz:blur-3xl" aria-hidden="true" />
      <span class="maz:absolute maz:-inset-s-16 maz:-bottom-28 maz:size-72 maz:rounded-full maz:bg-accent maz:opacity-30 maz:blur-3xl" aria-hidden="true" />
      <p class="maz:relative maz:m-0 maz:flex maz:items-center maz:gap-2 maz:text-title-4">
        <MazIcon :icon="MazSparkles" size="1.5rem" />
        Acme
      </p>
      <figure class="maz:relative maz:m-0">
        <blockquote class="maz:m-0 maz:text-title-2">
          “We shipped our new brand in an afternoon: one preset, every screen followed.”
        </blockquote>
        <figcaption class="maz:mt-4 maz:text-body-sm maz:opacity-80">
          Grace Hopper, design lead
        </figcaption>
      </figure>
    </aside>

    <div class="maz:flex maz:flex-center maz:p-[clamp(1.5rem,5vw,3rem)]">
      <form class="maz:flex maz:w-full maz:max-w-sm maz:flex-col maz:gap-5" @submit.prevent="submit">
        <header>
          <h1 class="maz:m-0 maz:text-title-2">
            Welcome back
          </h1>
          <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
            Sign in to continue to your workspace.
          </p>
        </header>

        <MazBtn color="surface" outlined block :start-icon="MazGithub">
          Continue with GitHub
        </MazBtn>

        <div class="maz:flex maz:items-center maz:gap-3 maz:text-caption" aria-hidden="true">
          <span class="maz:h-px maz:flex-1 maz:bg-divider" />
          or with your email
          <span class="maz:h-px maz:flex-1 maz:bg-divider" />
        </div>

        <MazInput v-model="email" label="Email" type="email" autocomplete="email" :start-icon="MazEnvelope" block />
        <MazInput v-model="password" label="Password" type="password" autocomplete="current-password" :start-icon="MazLockClosed" block />

        <div class="maz:flex maz:items-center maz:justify-between maz:gap-3">
          <MazCheckbox v-model="remember" label="Remember me" size="sm" />
          <MazLink href="#" class="maz:text-body-sm" @click.prevent>
            Forgot password?
          </MazLink>
        </div>

        <MazBtn type="submit" block :loading>
          Sign in
        </MazBtn>

        <p class="maz:m-0 maz:text-center maz:text-body-sm maz:text-muted">
          No account yet? <MazLink href="#" @click.prevent>
            Create one
          </MazLink>
        </p>
      </form>
    </div>
  </div>
</template>
