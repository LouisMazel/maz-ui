<template>
  <div class="maz-bg-background maz-text-foreground p-8">
    <h1 class="text-2xl font-bold mb-4">Maz-UI Theme Test</h1>

    <div class="space-y-4">
      <MazIcon name="okok" />

      <button
        class="maz-bg-primary maz-text-primary-foreground px-4 py-2 rounded-[var(--maz-radius)]"
        @click="toggleDarkMode"
      >
        Toggle Dark Mode (Current: {{ colorMode }})
      </button>

      <div class="grid grid-cols-3 gap-4">
        <button
          class="maz-bg-secondary maz-text-secondary-foreground p-4 rounded-[var(--maz-radius)]"
          @click="switchToTheme('mazUi')"
        >
          Maz-UI Theme
        </button>
        <button
          class="maz-bg-secondary maz-text-secondary-foreground p-4 rounded-[var(--maz-radius)]"
          @click="switchToTheme('dark')"
        >
          Dark Theme
        </button>
        <button
          class="maz-bg-secondary maz-text-secondary-foreground p-4 rounded-[var(--maz-radius)]"
          @click="switchToTheme('ocean')"
        >
          Ocean Theme
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { toggleDarkMode, colorMode, updateTheme } = useTheme()

  async function switchToTheme(themeName: 'mazUi' | 'dark' | 'ocean') {
    const { mazUi, dark, ocean } = await import('@maz-ui/themes')

    const themes = { mazUi, dark, ocean }
    updateTheme(themes[themeName])
  }
</script>
