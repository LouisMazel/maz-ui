<script lang="ts" setup>
const durations = ['instant', 'fast', 'normal', 'slow', 'slower'] as const
const easings = ['out', 'in', 'in-out', 'spring', 'bounce'] as const

const tokens = [
  ...durations.map(name => `--maz-motion-${name}`),
  '--maz-motion-scale',
  ...easings.map(name => `--maz-easing-${name}`),
]

const dir = useState<'ltr' | 'rtl'>('modernisation-dir')
const { presetName, colorMode } = useTheme()

const values = ref<Record<string, string>>({})
const playing = ref(false)
const scale = ref(1)
const scaleTouched = ref(false)

function readTokens() {
  const style = getComputedStyle(document.documentElement)
  values.value = Object.fromEntries(tokens.map(token => [token, style.getPropertyValue(token).trim() || 'not defined']))
}

onMounted(readTokens)
watch([presetName, colorMode], () => nextTick(readTokens))

watch(scale, () => {
  scaleTouched.value = true
})

const containerStyle = computed(() => (scaleTouched.value
  ? { '--maz-motion-scale': String(scale.value) }
  : undefined))

function boxStyle(duration: string, easing: string) {
  const sign = dir.value === 'rtl' ? -1 : 1

  return {
    transform: playing.value ? `translateX(calc(${sign} * (100cqw - 2.5rem)))` : 'translateX(0)',
    transitionProperty: 'transform',
    transitionDuration: `calc(var(--maz-motion-${duration}) * var(--maz-motion-scale))`,
    transitionTimingFunction: `var(--maz-easing-${easing})`,
  }
}
</script>

<template>
  <ModernisationSection
    id="motion-tokens"
    title="1. Motion tokens"
    description="Durations and easings come from the theme and can be overridden on any element with CSS variables."
  >
    <ModernisationDemo title="Computed values" hint="Read from the root element, they follow the preset and the reduced motion toggle.">
      <div class="overflow-x-auto">
        <!-- maz-ui-review-ignore prefer-maz-component -- compact table of tokens -->
        <table class="w-full text-left text-body-sm">
          <thead>
            <tr class="border-b border-divider text-muted">
              <th class="py-2 pe-4 font-medium">
                Token
              </th>
              <th class="py-2 font-medium">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="token in tokens" :key="token" class="border-b border-divider/50">
              <td class="py-2 pe-4 text-code whitespace-nowrap">
                {{ token }}
              </td>
              <td class="py-2 text-code break-all">
                {{ values[token] ?? '...' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ModernisationDemo>

    <ModernisationDemo
      title="Play the easings and the durations"
      hint="Each box moves with its own token. The slider sets a local --maz-motion-scale on this container (0 = no movement)."
    >
      <div class="flex flex-col gap-6" :style="containerStyle">
        <div class="flex flex-wrap items-center gap-6">
          <MazBtn size="sm" @click="playing = !playing">
            Play
          </MazBtn>
          <div class="flex w-72 max-w-full items-center gap-3">
            <span class="text-caption whitespace-nowrap">Local scale: {{ scale }}</span>
            <MazSlider v-model="scale" :min="0" :max="3" :step="0.1" />
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <div class="flex flex-col gap-3">
            <p class="text-label">
              Easings (duration: slower)
            </p>
            <div v-for="easing in easings" :key="easing" class="flex items-center gap-3">
              <span class="w-20 shrink-0 text-code text-muted">{{ easing }}</span>
              <div class="@container h-10 flex-1 rounded-lg bg-divider/50">
                <div class="size-10 rounded-lg bg-primary" :style="boxStyle('slower', easing)" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <p class="text-label">
              Durations (easing: out)
            </p>
            <div v-for="duration in durations" :key="duration" class="flex items-center gap-3">
              <span class="w-20 shrink-0 text-code text-muted">{{ duration }}</span>
              <div class="@container h-10 flex-1 rounded-lg bg-divider/50">
                <div class="size-10 rounded-lg bg-secondary" :style="boxStyle(duration, 'out')" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
