<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
</script>

<template>
  <Suspense>
    <DefaultTheme.Layout>
      <template #layout-top>
        <div class="banner">
          <span class="maz-text-white">
            You are currently browsing the v4 documentation -
          </span>
          <MazLink href="https://v3.maz-ui.com" color="contrast" underline class="dark maz-w-full mob-l:maz-w-auto">
            View v3 documentation
          </MazLink>
        </div>
      </template>
    </DefaultTheme.Layout>
  </Suspense>
</template>

<style lang="postcss" scoped>
.banner {
  @apply maz-bg-primary-600/90 maz-fixed maz-inset-x-0 maz-top-0 maz-flex maz-flex-wrap maz-items-center maz-justify-center maz-gap-2 maz-p-2 maz-z-default-backdrop maz-text-white maz-text-center maz-h-12 maz-backdrop-blur-lg;
}
</style>
