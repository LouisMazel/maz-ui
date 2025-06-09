<script setup lang="ts">
import { useTheme } from '@maz-ui/themes'

const { colorMode, setColorMode } = useTheme()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="maz-flex maz-items-center maz-gap-4 maz-p-4">
      <MazLink to="/"> Home </MazLink>
      <MazLink to="/about"> About </MazLink>
      <MazLink @click="setColorMode('dark')"> Dark </MazLink>
      <MazLink @click="setColorMode('light')"> Light </MazLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>
