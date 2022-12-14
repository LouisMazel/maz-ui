<template>
  <main>
    <MazAvatar
      data-maz-aos="scale-out"
      data-maz-aos-delay="300"
      size="1.5rem"
      clickable
      src="https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg"
      @click="toggleTheme"
    >
      <template #icon>
        <MazIcon :name="hasDarkTheme ? 'sun' : 'moon'" class="maz-text-white" />
      </template>
    </MazAvatar>

    <br />

    <!-- Start Developing Area - Do not commit anything here -->

    <!-- End Developing Area -->
  </main>
  <TheLoader />
</template>

<script lang="ts" setup>
  import { MazIcon, MazAvatar } from '@package/components'
  import { useAos, useThemeHandler, useToast, useWait } from '@package/index'

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
