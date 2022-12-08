<template>
  <main>
    <MazBtn
      data-maz-aos="scale-out"
      data-maz-aos-delay="300"
      fab
      @click="toggleTheme"
    >
      <MazIcon :name="hasDarkTheme ? 'moon' : 'sun'" />
    </MazBtn>

    <br />

    <!-- Start Developing Area - Do not commit anything here -->

    <!-- End Developing Area -->
  </main>
  <TheLoader />
</template>

<script lang="ts" setup>
  import { MazBtn, MazIcon } from 'maz-ui/package/components'
  import {
    useAos,
    useThemeHandler,
    useToast,
    useWait,
  } from 'maz-ui/package/composables'
  import TheLoader from './components/TheLoader.vue'

  const { aos } = useAos()
  const { toast } = useToast()
  const { wait } = useWait()

  const { autoSetTheme, toggleTheme, hasDarkTheme } = useThemeHandler()

  autoSetTheme()
  toast.success('Toaster Works', { position: 'top-right' })
  aos.runAnimations()
  wait.start()
  setTimeout(() => wait.stop(), 500)
</script>

<style lang="postcss">
  body {
    margin: 0;
  }

  #app {
    height: 100vh;
  }
</style>

<style lang="postcss" scoped>
  main {
    @apply maz-flex maz-min-h-full maz-min-w-full maz-flex-col maz-items-center maz-p-5 maz-text-normal;
  }
</style>
