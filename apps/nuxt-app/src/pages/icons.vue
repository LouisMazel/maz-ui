<script lang="ts" setup>
import MazIcon from 'maz-ui/components/MazIcon'

const isDark = ref(false)
const themeIcon = computed(() => isDark.value ? 'moon' : 'sun')
const items = [
  { label: 'Accueil', icon: 'home' },
  { label: 'Réglages', icon: 'cog-6-tooth' },
]

const RenderIcon = () => h(MazIcon, { icon: 'bell', size: 'lg' })
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-6 maz:p-8">
    <h1 class="maz:text-2xl maz:font-bold">
      Icônes par nom
    </h1>

    <section data-test="names" class="maz:flex maz:items-center maz:gap-4">
      <MazIcon icon="x-mark" size="lg" data-test="x-mark" />
      <MazIcon :icon="isDark ? 'moon' : 'sun'" size="lg" data-test="ternary" />
      <MazIcon :icon="themeIcon" size="lg" data-test="computed" />
      <RenderIcon data-test="render-function" />
      <MazIcon icon="app:brand-logo" size="lg" data-test="project-icon" />
      <!-- maz-ui-review-ignore unknown-icon -- renders the fallback -->
      <MazIcon icon="does-not-exist" size="lg" data-test="unknown" />
    </section>

    <section data-test="buttons" class="maz:flex maz:items-center maz:gap-4">
      <MazBtn start-icon="moon" data-test="btn" @click="isDark = !isDark">
        Basculer
      </MazBtn>
      <MazBtn end-icon="arrow-right" color="secondary">
        Suivant
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
    </section>

    <NuxtLink to="/icons-lazy" data-test="lazy-link">
      Page lazy
    </NuxtLink>
  </div>
</template>
