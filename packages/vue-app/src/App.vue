<script setup lang="ts">
const { autoSetTheme, setDarkTheme, setLightTheme } = useThemeHandler()

autoSetTheme()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="maz-flex maz-items-center maz-p-4 maz-gap-4">
      <MazLink to="/">Home</MazLink>
      <MazLink to="/about">About</MazLink>
      <MazLink @click="setDarkTheme">Dark</MazLink>
      <MazLink @click="setLightTheme">Light</MazLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>
