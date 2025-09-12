<script lang="ts" setup>
import { useTheme } from './../../../../packages/themes/src/composables/useTheme'

const { colorMode, isDark } = useTheme()
</script>

<template>
  <div id="home" class="maz-flex maz-flex-col maz-items-center maz-justify-center maz-gap-8">
    <p class="maz-text-center maz-text-muted">
      Do not commit changes
    </p>

    <code>
      colorMode: {{ colorMode }}
      <br>
      isDark: {{ isDark }}
    </code>
  </div>
</template>
