<script lang="ts" setup>
import type { ThemePresetName } from '@maz-ui/themes'
import type { HomeData } from '../../.vitepress/data/home.data'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { useToast } from 'maz-ui/composables/useToast'
import { computed, onMounted, ref, watch } from 'vue'
import HeroFloating from './hero/HeroFloating.vue'
import HomeChapter from './HomeChapter.vue'

const { data } = defineProps<{ data: HomeData }>()

const toast = useToast()
const theme = useTheme()

const PRESET_OPTIONS = data.presets.map(preset => ({ label: preset.label, value: preset.name }))

const presetName = ref('nova')
const isDark = ref<boolean | null>(null)
const hue = ref(0)
const radius = ref(1)

const swatch = computed(() => data.presets.find(preset => preset.name === presetName.value)!)

function parseOklch(color: string): [number, number, number] {
  const [lightness = 0, chroma = 0, hueValue = 0] = color.replace(/oklch\(|\)/g, '').split(/\s+/).map(Number.parseFloat)

  return [lightness, chroma, hueValue]
}

const RADIUS_STEP = 0.125

function toRem(value: string) {
  const rem = Number.parseFloat(value) / (value.endsWith('px')
    ? 16
    : 1)

  return Math.round(rem / RADIUS_STEP) * RADIUS_STEP
}

function resetControls() {
  hue.value = Math.round(parseOklch(swatch.value.light.primary)[2])
  radius.value = toRem(swatch.value.radius)
}

const primary = computed(() => {
  const [lightL, lightC] = parseOklch(swatch.value.light.primary)
  const [darkL, darkC] = parseOklch(swatch.value.dark.primary)

  return {
    light: `oklch(${lightL} ${lightC} ${hue.value})`,
    dark: `oklch(${darkL} ${darkC} ${hue.value})`,
  }
})

const themeKey = computed(() => `${presetName.value}-${hue.value}-${isDark.value}`)

const roundedMd = computed(() => `${radius.value}rem` as const)

const chapterStyle = computed(() => ({
  '--maz-primary': `light-dark(${primary.value.light}, ${primary.value.dark})`,
  '--maz-rounded-md': roundedMd.value,
}))

const overridesCode = computed(() => `await definePreset({
  base: '${presetName.value}',
  overrides: {
    colors: {
      light: { primary: '${primary.value.light}' },
      dark: { primary: '${primary.value.dark}' },
    },
    scales: { rounded: { md: '${roundedMd.value}' } },
  },
})`)

watch(presetName, resetControls, { immediate: true })

onMounted(() => {
  isDark.value = theme.isDark.value
})

async function applyToDocs() {
  await theme.updateTheme(presetName.value as ThemePresetName)
  await theme.updateTheme({
    colors: {
      light: { primary: primary.value.light },
      dark: { primary: primary.value.dark },
    },
    scales: {
      rounded: { md: roundedMd.value },
    },
  })
  toast.success(`The whole documentation now uses ${swatch.value.label} with your primary color and radius`, { timeout: 4000 })
}
</script>

<template>
  <HomeChapter id="atelier" number="03" label="Live theming" :swatch :scheme="isDark === null ? undefined : isDark ? 'dark' : 'light'" :style="chapterStyle">
    <header class="maz:mb-[clamp(2.5rem,5vw,4rem)]">
      <p class="home-eyebrow">
        Theme it live
      </p>
      <h2 id="atelier-title" class="home-display maz:mt-3 maz:mb-6 maz:text-[clamp(2.5rem,6vw,4.75rem)] maz:font-bold">
        Same components, any identity
      </h2>
      <p class="home-lead maz:m-0">
        Every card on the right is a real Maz-UI component: type in it, toggle it, slide it. Then pick a preset, a color and a radius, and watch them follow.
      </p>
    </header>

    <div class="maz:grid maz:gap-8 maz:lap-s:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] maz:lap-s:items-start">
      <MazCard bordered radius block class="maz:lap-s:sticky maz:lap-s:top-[calc(var(--vp-nav-height,4rem)+1.5rem)]">
        <form class="maz:flex maz:flex-col maz:gap-6" aria-label="Theme of this chapter" @submit.prevent>
          <fieldset class="maz:m-0 maz:flex maz:flex-col maz:gap-3 maz:border-0 maz:p-0">
            <legend class="home-eyebrow maz:mb-2! maz:p-0">
              Preset
            </legend>
            <MazRadioButtons v-model="presetName" :options="PRESET_OPTIONS" size="sm" />
          </fieldset>

          <MazSwitch :model-value="isDark ?? false" label="Dark mode" @update:model-value="isDark = $event" />

          <fieldset class="maz:m-0 maz:flex maz:flex-col maz:gap-3 maz:border-0 maz:p-0">
            <legend class="home-eyebrow maz:p-0">
              Primary hue <span class="maz:ms-2 maz:text-foreground">{{ hue }}°</span>
            </legend>
            <MazSlider v-model="hue" :min="0" :max="360" :divider="false" aria-label="Hue of the primary color" />
          </fieldset>

          <fieldset class="maz:m-0 maz:flex maz:flex-col maz:gap-3 maz:border-0 maz:p-0">
            <legend class="home-eyebrow maz:p-0">
              Radius <span class="maz:ms-2 maz:text-foreground">{{ roundedMd }}</span>
            </legend>
            <MazSlider v-model="radius" :min="0" :max="1.75" :step="RADIUS_STEP" :divider="false" aria-label="Medium radius in rem" />
          </fieldset>

          <div class="maz:flex maz:flex-wrap maz:gap-2">
            <MazBtn size="sm" @click="applyToDocs">
              Apply to the docs
            </MazBtn>
            <MazBtn size="sm" color="surface" outlined @click="presetName = 'nova'; resetControls()">
              Reset
            </MazBtn>
          </div>
        </form>
      </MazCard>

      <div class="maz:flex maz:min-w-0 maz:flex-col maz:gap-6">
        <HeroFloating :theme-key="themeKey" />
        <MazWindowMockup variant="editor" filename="theme.ts" :code="overridesCode" language="ts" aria-label="Preset matching these controls" />
      </div>
    </div>
  </HomeChapter>
</template>
