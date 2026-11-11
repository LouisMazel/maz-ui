<script setup lang="ts">
import type { ThemePreset } from '@maz-ui/themes'
import type { ResolvedColor } from '@maz-ui/themes/utils/resolve-preset'
import { COLOR_SCALE_STEPS, getContrastRatio, resolvePreset, SCALED_COLORS } from '@maz-ui/themes/utils/resolve-preset'
import { computed } from 'vue'

const props = defineProps<{
  preset: ThemePreset
}>()

const MODES = ['light', 'dark'] as const
const WITH_FOREGROUND = new Set<string>([
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'destructive',
  'contrast',
])

const resolved = computed(() => {
  try {
    return resolvePreset(props.preset)
  }
  catch {
    return undefined
  }
})

function contrast(first?: ResolvedColor, second?: ResolvedColor): string {
  return first && second
    ? getContrastRatio(first.hex, second.hex).toFixed(1)
    : '-'
}

function level(first?: ResolvedColor, second?: ResolvedColor): 'aa' | 'ui' | 'low' | undefined {
  if (!first || !second)
    return undefined
  const ratio = getContrastRatio(first.hex, second.hex)
  if (ratio >= 4.5)
    return 'aa'
  return ratio >= 3
    ? 'ui'
    : 'low'
}

const tokens = computed(() => {
  const value = resolved.value
  if (!value)
    return []
  return (Object.keys(value.light.colors) as Array<keyof typeof value.light.colors>)
    .filter(name => !name.endsWith('-foreground'))
    .map(name => ({
      name,
      modes: MODES.map((mode) => {
        const colors = value[mode].colors
        const color = colors[name]
        const foreground = WITH_FOREGROUND.has(name)
          ? colors[`${name}-foreground` as keyof typeof colors]
          : undefined
        return {
          mode,
          color,
          foreground,
          surface: colors.surface,
          onSurface: name === 'surface'
            ? undefined
            : contrast(color, colors.surface),
          onSurfaceLevel: name === 'surface'
            ? undefined
            : level(color, colors.surface),
          withForeground: foreground && contrast(color, foreground),
          withForegroundLevel: foreground && level(color, foreground),
        }
      }),
    }))
})
</script>

<template>
  <div v-if="resolved" class="effective-colors">
    <p class="maz:m-0 maz:text-sm maz:text-muted">
      Values computed by <code>resolvePreset()</code> from <code>@maz-ui/themes</code>, with the formulas of the stylesheet (<code>scales.color: '{{ resolved.colorScale }}'</code>). Contrast ratios are WCAG 2: <strong>4.5</strong> for text, <strong>3</strong> for large text and UI parts.
    </p>

    <div class="maz:overflow-x-auto">
      <table class="effective-colors-table">
        <thead>
          <tr>
            <th>Token</th>
            <th v-for="mode in MODES" :key="mode">
              {{ mode }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="token in tokens" :key="token.name">
            <td><code>{{ token.name }}</code></td>
            <td v-for="cell in token.modes" :key="cell.mode">
              <div class="maz:flex maz:items-center maz:gap-2">
                <span
                  class="swatch"
                  :style="{ backgroundColor: cell.color?.hex, color: cell.foreground?.hex }"
                >
                  <template v-if="cell.foreground">Aa</template>
                </span>
                <span class="maz:flex maz:flex-col maz:text-xs">
                  <code>{{ cell.color?.hex ?? '-' }}</code>
                  <span v-if="cell.onSurface" :class="`ratio ratio-${cell.onSurfaceLevel}`">{{ cell.onSurface }} on surface</span>
                  <span v-if="cell.withForeground" :class="`ratio ratio-${cell.withForegroundLevel}`">{{ cell.withForeground }} with foreground</span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-for="mode in MODES" :key="mode" class="maz:flex maz:flex-col maz:gap-2">
      <h4 class="maz:m-0 maz:text-sm maz:font-semibold maz:text-foreground">
        Scales - {{ mode }}
      </h4>
      <div class="scale-steps">
        <span />
        <span v-for="step in COLOR_SCALE_STEPS" :key="step">{{ step }}</span>
      </div>
      <div v-for="color in SCALED_COLORS" :key="color" class="scale-row">
        <code class="maz:text-xs">{{ color }}</code>
        <span
          v-for="step in COLOR_SCALE_STEPS"
          :key="step"
          class="scale-swatch"
          :title="`${color}-${step}: ${resolved[mode].scales[color]?.[step].hex} (${resolved[mode].scales[color]?.[step].oklch})`"
          :style="{ backgroundColor: resolved[mode].scales[color]?.[step].hex }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../.vitepress/theme/main.css";

.effective-colors {
  @apply maz:flex maz:flex-col maz:gap-6;
}

.effective-colors-table {
  @apply maz:w-full maz:border-collapse maz:text-sm;
}

.effective-colors-table th,
.effective-colors-table td {
  @apply maz:border-b maz:border-divider maz:p-2 maz:text-start;
}

.effective-colors-table th {
  @apply maz:capitalize;
}

.swatch {
  @apply maz:flex maz:size-9 maz:shrink-0 maz:flex-center maz:rounded-md maz:border maz:border-divider maz:text-xs maz:font-semibold;
}

.ratio-aa {
  @apply maz:text-success-700 maz:dark:text-success-400;
}

.ratio-ui {
  @apply maz:text-warning-700 maz:dark:text-warning-400;
}

.ratio-low {
  @apply maz:text-destructive;
}

.scale-steps,
.scale-row {
  @apply maz:grid maz:items-center maz:gap-1;
  grid-template-columns: 6rem repeat(11, minmax(0, 1fr));
}

.scale-steps {
  @apply maz:text-center maz:text-xs maz:text-muted;
}

.scale-swatch {
  @apply maz:h-7 maz:rounded-sm maz:border maz:border-divider;
}
</style>
