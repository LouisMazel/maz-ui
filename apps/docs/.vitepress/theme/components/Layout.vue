<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
</script>

<template>
  <Suspense>
    <DefaultTheme.Layout>
      <template #layout-top>
        <div class="banner">
          <span class="maz:text-white">
            You are currently browsing the v5 documentation -
          </span>
          <MazLink href="https://v4.maz-ui.com" color="inherit" underline class="dark">
            View v4 documentation
          </MazLink>
        </div>
      </template>
    </DefaultTheme.Layout>
  </Suspense>
</template>

<style scoped>
@reference "../main.css";

.banner {
  @apply maz:bg-secondary-600/90 maz:fixed maz:inset-x-0 maz:top-0 maz:flex maz:flex-wrap maz:flex-center maz:justify-center maz:gap-2 maz:p-2 maz:z-1000 maz:text-white maz:text-center maz:backdrop-blur-lg maz:text-sm;
}
</style>
