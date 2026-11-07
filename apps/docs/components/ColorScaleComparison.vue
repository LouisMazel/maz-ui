<script setup lang="ts">
import { getPerceptualColorScale } from '@maz-ui/themes/utils/css-generator'

const STEPS = [
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
] as const

// Same offsets as the relative scale of maz-ui/tailwindcss/theme-colors.css
const RELATIVE_SCALE: Record<string, { lightness: number, chroma: number }> = {
  50: { lightness: 0.4, chroma: 0.1 },
  100: { lightness: 0.32, chroma: 0.35 },
  200: { lightness: 0.22, chroma: 0.7 },
  300: { lightness: 0.13, chroma: 1 },
  400: { lightness: 0.06, chroma: 1 },
  600: { lightness: -0.05, chroma: 1 },
  700: { lightness: -0.1, chroma: 1 },
  800: { lightness: -0.16, chroma: 0.9 },
  900: { lightness: -0.22, chroma: 0.7 },
  950: { lightness: -0.3, chroma: 0.5 },
}

const bases = [
  { name: 'Navy', value: '#0E1450' },
  { name: 'Gold', value: '#FFC93C' },
]

function relativeScale(base: string): string[] {
  return STEPS.map((step) => {
    if (step === '500')
      return base
    const { lightness, chroma } = RELATIVE_SCALE[step]
    return `oklch(from ${base} clamp(0, calc(l + ${lightness}), 1) calc(c * ${chroma}) h)`
  })
}

function perceptualScale(base: string): string[] {
  const scale = getPerceptualColorScale(base)
  return STEPS.map(step => step === '500'
    ? base
    : scale[step])
}

const rows = bases.flatMap(base => [
  {
    label: `${base.name} ${base.value} - relative`,
    colors: relativeScale(base.value),
  },
  {
    label: `${base.name} ${base.value} - perceptual`,
    colors: perceptualScale(base.value),
  },
])
</script>

<template>
  <div class="color-scale-comparison">
    <div class="scale-steps">
      <span v-for="step in STEPS" :key="step">{{ step }}</span>
    </div>
    <div v-for="row in rows" :key="row.label" class="scale-row">
      <p class="scale-label">
        {{ row.label }}
      </p>
      <div class="scale-swatches">
        <span v-for="(color, index) in row.colors" :key="STEPS[index]" :style="{ backgroundColor: color }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../.vitepress/theme/main.css";

.color-scale-comparison {
  @apply maz:flex maz:flex-col maz:gap-3;
}

.scale-steps,
.scale-swatches {
  @apply maz:grid maz:grid-cols-11 maz:gap-1;
}

.scale-steps {
  @apply maz:text-center maz:text-xs maz:text-muted;
}

.scale-label {
  @apply maz:m-0 maz:mb-1 maz:text-sm maz:font-medium maz:text-foreground;
}

.scale-swatches span {
  @apply maz:h-10 maz:rounded-md maz:border maz:border-solid maz:border-divider;
}
</style>
