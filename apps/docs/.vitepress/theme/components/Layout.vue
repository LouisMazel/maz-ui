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
      </template>

      <template #nav-bar-content-after>
        <ThemeSwitcher class="maz:ms-2" />
      </template>
    </DefaultTheme.Layout>
  </Suspense>
</template>
