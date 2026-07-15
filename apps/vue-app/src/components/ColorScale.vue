<script lang="ts" setup>
const { color = 'surface' } = defineProps<{
  color?: string
}>()

function generateColorScale(color: string) {
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
    '950',
  ]

  const rootStyles = getComputedStyle(document.documentElement)

  return variants.map(variant => ({
    bgColor: `var(--maz-color-${color}-${variant})`,
    textColor: `var(--maz-${color}-foreground, #FF0000)`,
    color,
    key: variant,
    cssVarValue: rootStyles.getPropertyValue(`--maz-color-${color}-${variant}`),
  }))
}

const colorScale = computed(() => {
  return generateColorScale(color)
})
</script>

<!--
Tailwind keep — these utilities reference every scale step so Tailwind
keeps the corresponding --maz-color-*-N tokens alive in the bundle. The
ColorScale demo reads those tokens dynamically via getComputedStyle and
applies them as inline background-color, which Tailwind cannot detect.

maz:bg-primary-50 maz:bg-primary-100 maz:bg-primary-200 maz:bg-primary-300 maz:bg-primary-400 maz:bg-primary-500 maz:bg-primary-600 maz:bg-primary-700 maz:bg-primary-800 maz:bg-primary-900 maz:bg-primary-950
maz:bg-secondary-50 maz:bg-secondary-100 maz:bg-secondary-200 maz:bg-secondary-300 maz:bg-secondary-400 maz:bg-secondary-500 maz:bg-secondary-600 maz:bg-secondary-700 maz:bg-secondary-800 maz:bg-secondary-900 maz:bg-secondary-950
maz:bg-accent-50 maz:bg-accent-100 maz:bg-accent-200 maz:bg-accent-300 maz:bg-accent-400 maz:bg-accent-500 maz:bg-accent-600 maz:bg-accent-700 maz:bg-accent-800 maz:bg-accent-900 maz:bg-accent-950
maz:bg-destructive-50 maz:bg-destructive-100 maz:bg-destructive-200 maz:bg-destructive-300 maz:bg-destructive-400 maz:bg-destructive-500 maz:bg-destructive-600 maz:bg-destructive-700 maz:bg-destructive-800 maz:bg-destructive-900 maz:bg-destructive-950
maz:bg-success-50 maz:bg-success-100 maz:bg-success-200 maz:bg-success-300 maz:bg-success-400 maz:bg-success-500 maz:bg-success-600 maz:bg-success-700 maz:bg-success-800 maz:bg-success-900 maz:bg-success-950
maz:bg-warning-50 maz:bg-warning-100 maz:bg-warning-200 maz:bg-warning-300 maz:bg-warning-400 maz:bg-warning-500 maz:bg-warning-600 maz:bg-warning-700 maz:bg-warning-800 maz:bg-warning-900 maz:bg-warning-950
maz:bg-info-50 maz:bg-info-100 maz:bg-info-200 maz:bg-info-300 maz:bg-info-400 maz:bg-info-500 maz:bg-info-600 maz:bg-info-700 maz:bg-info-800 maz:bg-info-900 maz:bg-info-950
maz:bg-contrast-50 maz:bg-contrast-100 maz:bg-contrast-200 maz:bg-contrast-300 maz:bg-contrast-400 maz:bg-contrast-500 maz:bg-contrast-600 maz:bg-contrast-700 maz:bg-contrast-800 maz:bg-contrast-900 maz:bg-contrast-950
maz:bg-surface-50 maz:bg-surface-100 maz:bg-surface-200 maz:bg-surface-300 maz:bg-surface-400 maz:bg-surface-500 maz:bg-surface-600 maz:bg-surface-700 maz:bg-surface-800 maz:bg-surface-900 maz:bg-surface-950
maz:bg-foreground-50 maz:bg-foreground-100 maz:bg-foreground-200 maz:bg-foreground-300 maz:bg-foreground-400 maz:bg-foreground-500 maz:bg-foreground-600 maz:bg-foreground-700 maz:bg-foreground-800 maz:bg-foreground-900 maz:bg-foreground-950
maz:bg-divider-50 maz:bg-divider-100 maz:bg-divider-200 maz:bg-divider-300 maz:bg-divider-400 maz:bg-divider-500 maz:bg-divider-600 maz:bg-divider-700 maz:bg-divider-800 maz:bg-divider-900 maz:bg-divider-950
maz:bg-shadow-50 maz:bg-shadow-100 maz:bg-shadow-200 maz:bg-shadow-300 maz:bg-shadow-400 maz:bg-shadow-500 maz:bg-shadow-600 maz:bg-shadow-700 maz:bg-shadow-800 maz:bg-shadow-900 maz:bg-shadow-950
maz:bg-overlay-50 maz:bg-overlay-100 maz:bg-overlay-200 maz:bg-overlay-300 maz:bg-overlay-400 maz:bg-overlay-500 maz:bg-overlay-600 maz:bg-overlay-700 maz:bg-overlay-800 maz:bg-overlay-900 maz:bg-overlay-950
maz:bg-muted-50 maz:bg-muted-100 maz:bg-muted-200 maz:bg-muted-300 maz:bg-muted-400 maz:bg-muted-500 maz:bg-muted-600 maz:bg-muted-700 maz:bg-muted-800 maz:bg-muted-900 maz:bg-muted-950
-->
<template>
  <div class="maz:flex maz:w-full maz:flex-col maz:gap-2">
    <p class="maz:text-lg maz:font-semibold maz:cap-f">
      {{ color }}
    </p>

    <div class="maz:flex maz:w-full maz:gap-2">
      <div
        v-for="({ key, bgColor, textColor, cssVarValue }) in colorScale"
        :key="key" class="maz:flex maz:min-h-20 maz:flex-1 maz:flex-col maz:gap-2"
      >
        <div>
          <p>
            {{ key }}
          </p>

          <p class="maz:text-muted-foreground maz:text-sm">
            {{ cssVarValue }}
          </p>
        </div>

        <div :style="{ backgroundColor: bgColor, color: textColor }" class="maz:h-20 maz:w-full maz:rounded-md" />
      </div>
    </div>
  </div>
</template>
