<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { computed, ref } from 'vue'
import { FLAGSHIP_MODULES, KIND_COLORS, NEW_MODULES } from './content'
import { useThemeColors } from './hero/useThemeColors'
import HomeChapter from './HomeChapter.vue'

const { data } = defineProps<{ data: HomeData }>()

const swatch = computed(() => data.presets.find(preset => preset.name === 'maz-ui')!)

const total = computed(() => data.categories.reduce((sum, category) => sum + category.count, 0))

const chart = ref<HTMLElement>()
const { isDark } = useTheme()
const colors = useThemeColors(chart, isDark)

const CATEGORY_ROLES = ['secondary', 'accent', 'info'] as const

const chartData = computed(() => {
  const toolCount = CATEGORY_ROLES.length
  const componentGroups = data.categories.length - toolCount

  return {
    labels: data.categories.map(category => category.name),
    datasets: [
      {
        data: data.categories.map(category => category.count),
        backgroundColor: data.categories.map((_, index) => {
          const role = index < componentGroups
            ? 'primary'
            : CATEGORY_ROLES[index - componentGroups]
          return colors.value?.[role](0.85)
        }),
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: {
        color: colors.value?.divider(),
      },
      border: { display: false },
      ticks: {
        color: colors.value?.muted(),
      },
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: colors.value?.foreground(),
      },
    },
  },
}))
</script>

<template>
  <HomeChapter id="inventory" number="07" label="Inventory" :swatch>
    <header>
      <p class="home-eyebrow">
        Everything in the box
      </p>
      <h2 id="inventory-title" class="home-display maz:mt-3 maz:mb-[clamp(2.5rem,5vw,4rem)] maz:text-[clamp(2.5rem,6vw,4.75rem)] maz:font-bold">
        <MazAnimatedCounter :count="total" :duration="1600" /> building blocks, ready to use
      </h2>
      <p class="home-lead maz:mt-0 maz:mb-[clamp(2.5rem,5vw,4rem)]">
        Components for the interface, composables and directives for the behavior, plugins for app-wide features like toasts and dialogs. Each line opens its section of the docs.
      </p>
    </header>

    <div class="maz:grid maz:gap-12 maz:lap-m:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] maz:lap-m:items-center">
      <ol class="maz:m-0 maz:grid maz:list-none maz:gap-x-12 maz:border-t maz:border-divider maz:p-0 maz:tab-m:grid-cols-2" aria-label="Modules by category">
        <li v-for="category in data.categories" :key="category.name" class="maz:border-b maz:border-divider">
          <MazLink :href="category.link" color="contrast" :underline-hover="false" class="maz:group maz:flex maz:py-3.5">
            <span class="maz:font-semibold maz:group-hover:text-primary">{{ category.name }}</span>
            <span class="maz:mx-2 maz:flex-1 maz:border-b maz:border-dotted maz:border-divider" aria-hidden="true" />
            <MazBadge color="surface" size="sm" rounded-size="full" outlined>
              {{ category.count }}
            </MazBadge>
          </MazLink>
        </li>
      </ol>
      <figure ref="chart" class="maz:m-0">
        <div :style="{ height: `${data.categories.length * 1.75 + 2}rem` }">
          <MazChart v-if="colors" type="bar" :data="chartData" :options="chartOptions" aria-label="Number of modules in each category of the docs" />
        </div>
        <figcaption class="maz:mt-3 maz:text-[0.8125rem] maz:text-muted">
          Modules per category: components, then plugins, composables and directives. Drawn with MazChart.
        </figcaption>
      </figure>
    </div>

    <section class="maz:mt-[clamp(3rem,6vw,5rem)]" aria-labelledby="inventory-new">
      <MazCarousel>
        <template #title>
          <h3 id="inventory-new" class="maz:m-0 maz:font-mono maz:text-xs maz:font-medium maz:tracking-[0.08em] maz:text-muted maz:uppercase">
            New in v5
          </h3>
        </template>
        <MazCardSpotlight
          v-for="module in NEW_MODULES"
          :key="module.name"
          :color="KIND_COLORS[module.kind] === 'contrast' ? 'primary' : KIND_COLORS[module.kind]"
          class="maz:w-72 maz:shrink-0 maz:self-stretch"
          content-class="maz:flex maz:h-full maz:flex-col maz:items-start maz:gap-3"
        >
          <MazBadge :color="KIND_COLORS[module.kind]" size="xs" rounded-size="full">
            {{ module.kind }}
          </MazBadge>
          <MazLink :href="module.link" color="contrast" class="maz:font-mono maz:text-[0.9375rem] maz:font-semibold">
            {{ module.name }}
          </MazLink>
          <p class="maz:m-0 maz:leading-normal maz:text-muted">
            {{ module.description }}
          </p>
        </MazCardSpotlight>
      </MazCarousel>
    </section>

    <section class="maz:mt-[clamp(3rem,6vw,5rem)]" aria-labelledby="inventory-flagship">
      <h3 id="inventory-flagship" class="maz:mt-0 maz:mb-4 maz:font-mono maz:text-xs maz:font-medium maz:tracking-[0.08em] maz:text-muted maz:uppercase">
        Most used
      </h3>
      <ul class="maz:m-0 maz:grid maz:list-none maz:gap-x-12 maz:border-t maz:border-divider maz:p-0 maz:lap-s:grid-cols-2">
        <li v-for="module in FLAGSHIP_MODULES" :key="module.name" class="maz:border-b maz:border-divider">
          <MazLink :href="module.link" color="contrast" :underline-hover="false" class="maz:group maz:flex maz:flex-col maz:items-start maz:gap-1.5 maz:py-4">
            <span class="maz:flex maz:items-center maz:gap-3">
              <code class="maz:font-mono maz:text-[0.9375rem] maz:font-semibold maz:group-hover:text-primary">{{ module.name }}</code>
              <MazBadge :color="KIND_COLORS[module.kind]" size="xs" rounded-size="full">
                {{ module.kind }}
              </MazBadge>
            </span>
            <span class="maz:leading-normal maz:text-muted">{{ module.description }}</span>
          </MazLink>
        </li>
      </ul>
    </section>

    <footer class="maz:mt-[clamp(4rem,8vw,7rem)] maz:flex maz:flex-col maz:items-start maz:gap-8 maz:border-t maz:border-divider maz:pt-[clamp(3rem,6vw,5rem)]">
      <p class="home-display maz:m-0 maz:text-[clamp(2.25rem,5.5vw,4.25rem)] maz:font-bold">
        Install it, theme it, ship it.
      </p>
      <div class="maz:flex maz:flex-wrap maz:gap-3">
        <MazBtn href="/guide/getting-started" size="lg" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">
          Get started
        </MazBtn>
        <MazBtn href="/ecosystem/themes" size="lg" color="surface" outlined>
          Build your theme
        </MazBtn>
      </div>
    </footer>
  </HomeChapter>
</template>
