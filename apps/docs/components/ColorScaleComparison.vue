<script setup lang="ts">
import { getPerceptualColorScale, getRelativeColorScale } from '@maz-ui/themes/utils/css-generator'

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

const bases = [
  { name: 'Navy', value: '#0E1450' },
  { name: 'Gold', value: '#FFC93C' },
]

function relativeScale(base: string): string[] {
  const scale = getRelativeColorScale(base)
  return STEPS.map(step => step === '500'
    ? base
    : scale[step])
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
