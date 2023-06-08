<template>
  <main>
    <header>
      <NuxtLink :to="{ name: 'index' }"> MazUi </NuxtLink>

      <nav>
        <MazBtn :to="{ name: 'index' }"> Home </MazBtn>
        <MazBtn :to="{ name: 'test-page' }"> Test page </MazBtn>
        <MazBtn @click="toggleTheme"> Switch dark mode </MazBtn>
      </nav>
    </header>

    <div class="content">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
  import { useThemeHandler } from 'maz-ui'

  const { toggleTheme, autoSetTheme } = useThemeHandler()

  onMounted(() => {
    autoSetTheme()
  })
</script>

<style lang="postcss">
  html,
  body {
    @apply dark:maz-bg-black dark:maz-text-white;
  }
</style>

<style lang="postcss" scoped>
  main {
    @apply maz-mx-auto maz-flex maz-min-h-screen maz-w-full maz-max-w-7xl maz-flex-col;

    header {
      @apply maz-flex maz-w-full maz-flex-wrap maz-items-center maz-justify-between maz-border-b maz-border-gray-300 maz-px-2 maz-py-4;

      nav {
        @apply maz-flex maz-gap-4;
      }
    }

    .content {
      @apply maz-flex maz-flex-1 maz-flex-col maz-py-4;
    }
  }
</style>
