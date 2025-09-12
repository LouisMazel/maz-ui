<script lang="ts" setup>
const { color = 'background' } = defineProps<{
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
    bgColor: `hsl(var(--maz-${color}-${variant}))`,
    textColor: `hsl(var(--maz-${color}-foreground, #FF0000))`,
    color,
    key: variant,
    cssVarValue: rootStyles.getPropertyValue(`--maz-${color}-${variant}`),
  }))
}

const colorScale = computed(() => {
  return generateColorScale(color)
})
</script>

<template>
  <div class="maz-flex maz-w-full maz-flex-col maz-gap-2">
    <p class="maz-text-lg maz-font-semibold maz-cap-f">
      {{ color }}
    </p>

    <div class="maz-flex maz-w-full maz-gap-2">
      <div
        v-for="({ key, bgColor, textColor, cssVarValue }) in colorScale"
        :key="key" class="maz-flex maz-min-h-20 maz-flex-1 maz-flex-col maz-gap-2"
      >
        <div>
          <p>
            {{ key }}
          </p>

          <p class="maz-text-muted-foreground maz-text-sm">
            {{ cssVarValue }}
          </p>
        </div>

        <div :style="{ backgroundColor: bgColor, color: textColor }" class="maz-h-20 maz-w-full maz-rounded" />
      </div>
    </div>
  </div>
</template>
