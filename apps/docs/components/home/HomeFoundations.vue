<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { computed } from 'vue'
import { FOUNDATIONS } from './content'
import HomeChapter from './HomeChapter.vue'

const { data } = defineProps<{ data: HomeData }>()

const swatch = computed(() => data.presets.find(preset => preset.name === 'obsidian')!)
</script>

<template>
  <HomeChapter id="foundations" number="04" label="Foundations" :swatch night>
    <header>
      <p class="home-eyebrow">
        Why it holds up in production
      </p>
      <h2 id="foundations-title" class="home-display maz:mt-3 maz:mb-[clamp(2.5rem,5vw,4rem)] maz:max-w-[18ch] maz:text-[clamp(2.5rem,6vw,4.75rem)] maz:font-bold">
        Six promises, each with its proof
      </h2>
    </header>

    <ol class="maz:m-0 maz:list-none maz:border-t maz:border-divider maz:p-0">
      <li v-for="(item, index) in FOUNDATIONS" :key="item.title" class="home-reveal maz:grid maz:gap-6 maz:border-b maz:border-divider maz:py-[clamp(1.75rem,3vw,2.5rem)] maz:tab-l:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] maz:tab-l:items-start maz:tab-l:gap-12">
        <div class="maz:grid maz:grid-cols-[2.5rem_1fr] maz:items-baseline maz:gap-x-4 maz:gap-y-2">
          <span class="maz:font-mono maz:text-xs maz:text-primary">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="maz:m-0 maz:font-display maz:text-[clamp(1.375rem,2.4vw,1.75rem)] maz:font-semibold maz:tracking-tight">
            {{ item.title }}
          </h3>
          <p class="maz:col-start-2 maz:m-0 maz:leading-relaxed maz:text-muted">
            {{ item.description }}
          </p>
          <MazLink :href="item.link" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }" class="maz:col-start-2 maz:justify-self-start maz:text-sm maz:font-semibold">
            Read the guide
            <span class="maz:sr-only">about {{ item.title }}</span>
          </MazLink>
        </div>
        <MazWindowMockup variant="editor" :filename="item.filename" class="maz:min-w-0">
          <MazCodeHighlight :code="data.snippets[item.snippet].code" :language="data.snippets[item.snippet].lang" theme="tokyo-night" :rounded="false" />
        </MazWindowMockup>
      </li>
    </ol>
  </HomeChapter>
</template>
