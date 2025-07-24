<script lang="ts" setup>
import { useTheme } from '@maz-ui/themes/src/index.js'

const { color = 'background' } = defineProps<{
  color?: string
}>()

const { colorMode, currentPreset } = useTheme()

// --maz-background-50: 0 5% 95%;
//     --maz-background-100: 0 5% 95%;
//     --maz-background-200: 0 5% 95%;
//     --maz-background-300: 0 5% 95%;
//     --maz-background-400: 0 5% 95%;
//     --maz-background-500: 0 0% 99%;
//     --maz-background-600: 0 5% 89%;
//     --maz-background-700: 0 5% 79%;
//     --maz-background-800: 0 5% 69%;
//     --maz-background-900: 0 5% 59%;

function generateColorScale(color: string, _colorMode: string, _currentPresetName: string) {
  const variants = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ]

  const rootStyles = getComputedStyle(document.documentElement)

  return variants.map(variant => ({
    bgColor: `hsl(var(--maz-${color}-${variant}))`,
    textColor: `hsl(var(--maz-${color}-foreground, #FF0000))`,
    color,
    key: variant,
    cssVarValue: rootStyles.getPropertyValue(`--maz-${color}-${variant}`),
  }))
}

const colorScale = computed(() => {
  return generateColorScale(color, colorMode.value, currentPreset.value.name)
})
</script>

<template>
  <div class="maz-flex maz-w-full maz-flex-col maz-gap-2">
    <p>
      {{ color }}
    </p>

    <div class="maz-flex maz-w-full maz-gap-2">
      <div
        v-for="({ key, bgColor, textColor, cssVarValue }) in colorScale"
        :key="key" class="maz-min-h-20 maz-flex-1 maz-p-4" :style="{
          backgroundColor: bgColor,
          color: textColor,
        }"
      >
        {{ key }}

        <p class="maz-text-sm maz-text-muted-foreground">
          {{ cssVarValue }}
        </p>
      </div>
    </div>
  </div>
</template>
