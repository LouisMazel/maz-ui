<script setup lang="ts">
import { mazUi, ocean, pristine, useTheme } from '@maz-ui/themes/src/index'

const { updateTheme, setColorMode, isDark } = useTheme()

updateTheme(ocean)
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="maz-flex maz-items-center maz-gap-4 maz-p-4">
      <MazLink to="/"> Home </MazLink>
      <MazLink to="/about"> About </MazLink>
      <MazLink @click="setColorMode('dark')"> Dark </MazLink>
      <MazLink @click="setColorMode('light')"> Light </MazLink>
      <MazLink @click="updateTheme(ocean)"> Ocean </MazLink>
      <MazLink @click="updateTheme(pristine)"> Pristine </MazLink>
      <MazLink @click="updateTheme(mazUi)"> MazUi </MazLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>
