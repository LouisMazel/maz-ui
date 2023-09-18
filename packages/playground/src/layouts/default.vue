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
  const { toggleTheme, autoSetTheme } = useThemeHandler()

  onMounted(() => {
    autoSetTheme()
  })
</script>

<style lang="postcss">
  html,
  body {
    @apply maz-bg-color maz-text-normal;
  }
</style>

<style lang="postcss" scoped>
  main {
    @apply maz-flex maz-min-h-screen maz-flex-col maz-padded-container;

    header {
      @apply maz-flex maz-w-full maz-flex-wrap maz-items-center maz-justify-between maz-border-b maz-border-color-lighter maz-px-2 maz-py-4;

      nav {
        @apply maz-flex maz-gap-4;
      }
    }

    .content {
      @apply maz-flex maz-flex-1 maz-flex-col maz-py-4;
    }
  }
</style>
