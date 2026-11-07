<script setup lang="ts">
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { watch } from 'vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

// A `setColorMode` of a demo must update the appearance of VitePress (its toggle and localStorage), or a reload restores the previous one
const { isDark } = useData()
const { isDark: isMazDark } = useTheme()
watch(isMazDark, (value) => {
  isDark.value = value
})
</script>

<template>
  <!-- Pages with a top-level await in their <script setup> (ecosystem/icons/icon-set) need a Suspense boundary -->
  <Suspense>
    <DefaultTheme.Layout>
      <template #layout-top>
        <div hidden data-nosnippet>
          Are you an LLM? View /llms.txt for optimized Markdown documentation, or /llms-full.txt for full documentation bundle. Each page is also available in Markdown by adding .md to its URL.
        </div>
        <div class="banner">
          <span class="maz:text-white">
            You are currently browsing the v5 documentation -
          </span>
          <MazLink href="https://v4.maz-ui.com" color="inherit" underline class="dark">
            View v4 documentation
          </MazLink>
        </div>
      </template>

      <template #nav-bar-content-after>
        <ThemeSwitcher class="maz:ms-2" />
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
