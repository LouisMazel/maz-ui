<script lang="ts" setup>
import { MazAcademicCap as MazAcademicCapLazy } from '@maz-ui/icons/lazy'
import { MazAcademicCap } from '@maz-ui/icons/raw/MazAcademicCap'
import { MazAcademicCap as MazAcademicCapStatic } from '@maz-ui/icons/static'
import MazAcademicCapRaw from '@maz-ui/icons/svg/academic-cap.svg?raw'
import MazAcademicCapUrl from '@maz-ui/icons/svg/academic-cap.svg?url'
import MazIcon from 'maz-ui/components/MazIcon'
import { h, ref } from 'vue'
import HeroRaw from '@/icons/hero.svg?svg'
import HeroUrl from '@/icons/hero.svg?uri'

const isDark = ref(false)
const themeIcon = computed(() => isDark.value ? 'moon' : 'sun')
const items = [
  { label: 'Home', icon: 'home' as const },
  { label: 'Settings', icon: 'cog-6-tooth' as const },
]

const RenderIcon = () => h(MazIcon, { icon: 'bell', size: 'lg' })
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-6 maz:p-8">
    <h1 class="maz:text-2xl maz:font-bold">
      Icons by name
    </h1>

    <section data-test="names" class="maz:flex maz:items-center maz:gap-4">
      <MazIcon icon="x-mark" size="lg" data-test="x-mark" />
      <MazIcon :icon="isDark ? 'moon' : 'sun'" size="lg" data-test="ternary" />
      <MazIcon :icon="themeIcon" size="lg" data-test="computed" />
      <RenderIcon data-test="render-function" />
      <MazIcon icon="app:brand-logo" size="lg" data-test="project-icon" />
      <!-- maz-ui-review-ignore unknown-icon -- renders the fallback -->
      <!-- <MazIcon icon="does-not-exist" size="lg" data-test="unknown" /> -->
      <MazIcon :icon="MazAcademicCap" size="lg" data-test="unknown" />
      <MazIcon :icon="MazAcademicCapLazy" size="lg" data-test="unknown" />
      <MazIcon :icon="MazAcademicCapStatic" size="lg" data-test="unknown" />
      <MazIcon :icon="MazAcademicCapUrl" size="lg" data-test="unknown" />
      <MazIcon :icon="MazAcademicCapRaw" size="lg" data-test="unknown" />
      <MazIcon :icon="HeroRaw" size="lg" data-test="unknown" />
      <MazIcon :icon="HeroUrl" size="lg" data-test="unknown" />
    </section>

    <section data-test="buttons" class="maz:flex maz:items-center maz:gap-4">
      <MazBtn start-icon="moon" data-test="btn" @click="isDark = !isDark">
        Toggle
      </MazBtn>
      <MazBtn end-icon="arrow-right" color="secondary">
        Next
      </MazBtn>
    </section>

    <section data-test="list" class="maz:flex maz:items-center maz:gap-4">
      <span v-for="item in items" :key="item.label" class="maz:flex maz:items-center maz:gap-2">
        <MazIcon :icon="item.icon" />
        {{ item.label }}
      </span>
    </section>

    <section data-test="svg" class="maz:flex maz:items-end maz:gap-4">
      <MazSvg icon="flag-fr" width="64" data-test="flag" />
      <MazSvg icon="logo-vue" height="48" data-test="logo" />
      <MazSvg icon="app:hero" data-test="hero" />
      <MazSvg icon="~academic-cap" />
    </section>

    <RouterLink to="/icons-lazy" data-test="lazy-link">
      Lazy page
    </RouterLink>
  </div>
</template>
