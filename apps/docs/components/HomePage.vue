<script lang="ts" setup>
import { defineAsyncComponent, h, hydrateOnVisible } from 'vue'
import { data } from '../.vitepress/data/home.data'
import HomeCover from './home/HomeCover.vue'
import HomeV5 from './home/HomeV5.vue'
import './home/home.css'

function ScopedPresets() {
  return h('style', { innerHTML: data.scopedCss })
}

const HomeAtelier = defineAsyncComponent({
  loader: () => import('./home/HomeAtelier.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '300px' }),
})

const HomeFoundations = defineAsyncComponent({
  loader: () => import('./home/HomeFoundations.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '300px' }),
})

const HomeEcosystem = defineAsyncComponent({
  loader: () => import('./home/HomeEcosystem.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '300px' }),
})

const HomeCommunity = defineAsyncComponent({
  loader: () => import('./home/HomeCommunity.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '300px' }),
})

const HomeFooter = defineAsyncComponent({
  loader: () => import('./home/HomeFooter.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '300px' }),
})

const HomeInventory = defineAsyncComponent({
  loader: () => import('./home/HomeInventory.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '300px' }),
})
</script>

<template>
  <div class="home">
    <ScopedPresets />
    <HomeCover :data />
    <HomeV5 :data />
    <HomeAtelier :data />
    <HomeFoundations :data />
    <HomeEcosystem :data />
    <HomeCommunity :data />
    <HomeInventory :data />
    <HomeFooter :data />
  </div>
</template>

<style>
.VPHome:has(.home) {
  margin-block-end: 0 !important;
  padding-block-end: 0 !important;
}
</style>
