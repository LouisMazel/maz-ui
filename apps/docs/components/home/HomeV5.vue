<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { computed } from 'vue'
import { V5_CHANGES } from './content'
import HomeChapter from './HomeChapter.vue'

const { data } = defineProps<{ data: HomeData }>()

const swatch = computed(() => data.presets.find(preset => preset.name === 'pristine')!)

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

const SCALES = [
  {
    role: 'primary',
    classes: [
      'maz:bg-primary-50',
      'maz:bg-primary-100',
      'maz:bg-primary-200',
      'maz:bg-primary-300',
      'maz:bg-primary-400',
      'maz:bg-primary-500',
      'maz:bg-primary-600',
      'maz:bg-primary-700',
      'maz:bg-primary-800',
      'maz:bg-primary-900',
      'maz:bg-primary-950',
    ],
  },
  {
    role: 'secondary',
    classes: [
      'maz:bg-secondary-50',
      'maz:bg-secondary-100',
      'maz:bg-secondary-200',
      'maz:bg-secondary-300',
      'maz:bg-secondary-400',
      'maz:bg-secondary-500',
      'maz:bg-secondary-600',
      'maz:bg-secondary-700',
      'maz:bg-secondary-800',
      'maz:bg-secondary-900',
      'maz:bg-secondary-950',
    ],
  },
  {
    role: 'accent',
    classes: [
      'maz:bg-accent-50',
      'maz:bg-accent-100',
      'maz:bg-accent-200',
      'maz:bg-accent-300',
      'maz:bg-accent-400',
      'maz:bg-accent-500',
      'maz:bg-accent-600',
      'maz:bg-accent-700',
      'maz:bg-accent-800',
      'maz:bg-accent-900',
      'maz:bg-accent-950',
    ],
  },
  {
    role: 'info',
    classes: [
      'maz:bg-info-50',
      'maz:bg-info-100',
      'maz:bg-info-200',
      'maz:bg-info-300',
      'maz:bg-info-400',
      'maz:bg-info-500',
      'maz:bg-info-600',
      'maz:bg-info-700',
      'maz:bg-info-800',
      'maz:bg-info-900',
      'maz:bg-info-950',
    ],
  },
  {
    role: 'destructive',
    classes: [
      'maz:bg-destructive-50',
      'maz:bg-destructive-100',
      'maz:bg-destructive-200',
      'maz:bg-destructive-300',
      'maz:bg-destructive-400',
      'maz:bg-destructive-500',
      'maz:bg-destructive-600',
      'maz:bg-destructive-700',
      'maz:bg-destructive-800',
      'maz:bg-destructive-900',
      'maz:bg-destructive-950',
    ],
  },
]
</script>

<template>
  <HomeChapter id="v5" number="02" label="Theming, perfected" :swatch>
    <div class="maz:grid maz:gap-[clamp(3rem,6vw,5rem)] maz:lap-s:grid-cols-2 maz:lap-s:items-center">
      <header>
        <p class="home-eyebrow">
          Maz-UI v5
        </p>
        <h2 id="v5-title" class="home-display maz:mt-3 maz:mb-6 maz:text-[clamp(2.5rem,6vw,4.75rem)] maz:font-bold">
          Theming, perfected
        </h2>
        <p class="home-lead maz:m-0">
          Pick a preset, change a single color, and every component follows, in light and dark mode.
          This chapter uses the Pristine preset: same components, a different look.
        </p>
        <div class="maz:mt-8 maz:flex maz:flex-wrap maz:gap-3">
          <MazBtn href="/guide/migration-v5" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">
            Migrate to v5
          </MazBtn>
          <MazBtn href="/blog/v5" color="surface" outlined>
            Read the announcement
          </MazBtn>
        </div>
      </header>

      <figure class="maz:m-0 maz:grid maz:gap-3">
        <div v-for="scale in SCALES" :key="scale.role" class="home-reveal maz:grid maz:grid-cols-[6.5rem_1fr] maz:items-center maz:gap-4">
          <span class="maz:font-mono maz:text-xs maz:text-muted">{{ scale.role }}</span>
          <span class="maz:grid maz:grid-cols-11 maz:gap-0.5" aria-hidden="true">
            <span
              v-for="(className, index) in scale.classes"
              :key="className"
              class="maz:h-[clamp(2rem,4vw,3rem)] maz:first:rounded-s-md maz:last:rounded-e-md"
              :class="className"
              :title="`${scale.role}-${STEPS[index]}`"
            />
          </span>
        </div>
        <figcaption class="maz:mt-2 maz:text-[0.8125rem] maz:leading-relaxed maz:text-muted">
          One color in, eleven shades out: every component gets its tints for free.
        </figcaption>
      </figure>

      <ol class="maz:m-0 maz:grid maz:list-none maz:gap-4 maz:p-0 maz:tab-m:grid-cols-2 maz:lap-s:col-span-full maz:lap-m:grid-cols-3">
        <li v-for="(change, index) in V5_CHANGES" :key="change.title" class="maz:min-w-0">
          <MazAnimatedElement :delay="index * 80" :duration="700" class="maz:h-full">
            <MazCardSpotlight class="maz:size-full" content-class="maz:flex maz:h-full maz:flex-col maz:gap-3">
              <span class="maz:font-mono maz:text-xs maz:text-primary">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="maz:m-0 maz:font-display maz:text-xl maz:font-semibold maz:tracking-tight">
                {{ change.title }}
              </h3>
              <p class="maz:m-0 maz:leading-relaxed maz:text-muted">
                {{ change.description }}
              </p>
              <div v-if="index === 1" class="maz:mt-auto maz:flex maz:flex-wrap maz:gap-3 maz:pt-2">
                <span dir="ltr"><MazBtn size="sm" color="surface" outlined :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">Next</MazBtn></span>
                <span dir="rtl" lang="ar"><MazBtn size="sm" color="surface" outlined :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">التالي</MazBtn></span>
              </div>
            </MazCardSpotlight>
          </MazAnimatedElement>
        </li>
        <li class="maz:min-w-0 maz:tab-m:col-span-2">
          <MazAnimatedElement :delay="V5_CHANGES.length * 80" :duration="700" class="maz:h-full">
            <MazCardSpotlight color="secondary" class="maz:size-full" content-class="maz:flex maz:h-full maz:flex-col maz:gap-3">
              <span class="maz:font-mono maz:text-xs maz:text-secondary">{{ String(V5_CHANGES.length + 1).padStart(2, '0') }}</span>
              <h3 class="maz:m-0 maz:font-display maz:text-xl maz:font-semibold maz:tracking-tight">
                A migration CLI
              </h3>
              <p class="maz:m-0 maz:leading-relaxed maz:text-muted">
                <code class="maz:font-mono maz:text-foreground">@maz-ui/upgrade</code> rewrites the imports, props, CSS, config and dependencies that v5 renamed. Preview the diff with a dry run first.
              </p>
              <MazWindowMockup variant="terminal" title="Upgrade to v5" :code="data.snippets.upgrade.code" :language="data.snippets.upgrade.lang" class="maz:mt-auto" />
            </MazCardSpotlight>
          </MazAnimatedElement>
        </li>
      </ol>
    </div>
  </HomeChapter>
</template>
