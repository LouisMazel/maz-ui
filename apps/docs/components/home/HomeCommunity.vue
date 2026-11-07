<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { MazGithub } from '@maz-ui/icons/raw/MazGithub'
import { vTooltip } from 'maz-ui/directives/vTooltip'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import HomeChapter from './HomeChapter.vue'

const { data } = defineProps<{ data: HomeData }>()

const swatch = computed(() => data.presets.find(preset => preset.name === 'folio')!)

const MAX_STARS = 64
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const ASPECT = 2

const stars = computed(() => {
  const people = data.contributors.slice(0, MAX_STARS)
  const maxContributions = Math.max(1, ...people.map(person => person.contributions))

  return people.map((person, index) => {
    const radius = Math.sqrt((index + 0.6) / people.length)
    const angle = index * GOLDEN_ANGLE

    return {
      ...person,
      x: 50 + Math.cos(angle) * radius * 46,
      y: 50 + Math.sin(angle) * radius * 42,
      delay: (index % 9) * 0.4,
      tooltip: `${person.username}, ${person.contributions} contributions`,
      avatarProps: {
        src: person.avatar,
        alt: `Avatar of ${person.username}`,
        href: `https://github.com/${person.username}`,
        size: `${+(1.75 + (Math.log(person.contributions + 1) / Math.log(maxContributions + 1)) * 1.75).toFixed(2)}rem` as const,
      },
    }
  })
})

const links = computed(() => {
  const points = stars.value
  const lines: { x1: number, y1: number, x2: number, y2: number }[] = []

  points.forEach((point, index) => {
    points.slice(0, index)
      .map(other => ({
        other,
        distance: Math.hypot((point.x - other.x) * ASPECT, point.y - other.y),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .forEach(({ other }) => lines.push({
        x1: point.x * ASPECT,
        y1: point.y,
        x2: other.x * ASPECT,
        y2: other.y,
      }))
  })

  return lines
})

const RELIZY_STEPS = [
  { title: 'Commit', subtitle: 'feat(lib): add MazTimeline' },
  { title: 'Version', subtitle: 'Minor bump computed from the commits' },
  { title: 'Changelog', subtitle: 'Written for the users of the package' },
  { title: 'Publish', subtitle: 'Git tag and npm, every package at once' },
  { title: 'Release', subtitle: 'GitHub release and social posts' },
]

const relizyStep = ref(RELIZY_STEPS.length - 1)
let relizyTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  relizyStep.value = 0
  relizyTimer = setInterval(() => {
    relizyStep.value = (relizyStep.value + 1) % RELIZY_STEPS.length
  }, 1800)
})

onBeforeUnmount(() => clearInterval(relizyTimer))

const STATS = computed(() => [
  { label: 'contributors', count: data.contributors.length },
  {
    label: 'contributions',
    count: data.contributors.reduce((sum, person) => sum + person.contributions, 0),
  },
  { label: 'GitHub stars', count: data.stars ?? 0 },
  { label: 'forks', count: data.forks ?? 0 },
].filter(stat => stat.count > 0))
</script>

<template>
  <HomeChapter id="community" number="06" label="Community" :swatch night>
    <header>
      <p class="home-eyebrow">
        Our constellation
      </p>
      <h2 id="community-title" class="home-display maz:mt-3 maz:mb-6 maz:max-w-[20ch] maz:text-[clamp(2.5rem,6vw,4.75rem)] maz:font-bold">
        {{ data.contributors.length }} contributors light up Maz-UI
      </h2>
      <p class="home-lead maz:m-0">
        Every star is a person who fixed a bug, wrote a component or improved the docs. The brighter the star, the more they contributed.
      </p>
    </header>

    <div v-if="stars.length" class="maz:relative maz:mt-[clamp(2.5rem,5vw,4rem)] maz:h-[clamp(24rem,45vw,36rem)]">
      <svg class="maz:absolute maz:inset-0 maz:size-full maz:text-primary" :viewBox="`0 0 ${100 * ASPECT} 100`" preserveAspectRatio="none" aria-hidden="true">
        <line
          v-for="(line, index) in links"
          :key="index"
          v-bind="line"
          stroke="currentColor"
          stroke-opacity="0.35"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <ul class="maz:m-0 maz:list-none maz:p-0" aria-label="Contributors">
        <li
          v-for="star in stars"
          :key="star.id"
          v-tooltip="star.tooltip"
          class="maz:absolute maz:-translate-1/2 maz:rounded-full maz:shadow-[0_0_1.25rem_color-mix(in_oklch,var(--maz-primary)_55%,transparent)] maz:motion-safe:animate-[home-twinkle_3.6s_ease-in-out_infinite]"
          :style="{ left: `${star.x}%`, top: `${star.y}%`, animationDelay: `${star.delay}s` }"
        >
          <MazAvatar v-bind="star.avatarProps" target="_blank" rounded-size="full" no-elevation loading="lazy" />
        </li>
      </ul>
    </div>

    <dl class="maz:mt-10 maz:mb-0 maz:grid maz:grid-cols-2 maz:gap-6 maz:tab-m:grid-cols-4">
      <div v-for="(stat, index) in STATS" :key="stat.label" class="maz:flex maz:flex-col-reverse maz:gap-1">
        <dt class="maz:text-sm maz:text-muted">
          {{ stat.label }}
        </dt>
        <dd class="maz:m-0 maz:font-display maz:text-[clamp(1.75rem,3.5vw,2.5rem)] maz:font-bold maz:tabular-nums">
          <MazAnimatedCounter :count="stat.count" :delay="index * 120" :duration="1600" />
        </dd>
      </div>
    </dl>

    <div class="maz:mt-10 maz:flex maz:flex-wrap maz:gap-3">
      <MazBtn href="https://github.com/LouisMazel/maz-ui/blob/master/CONTRIBUTING.md" target="_blank" rel="noopener" size="lg" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">
        Join the constellation
      </MazBtn>
      <MazBtn href="https://github.com/LouisMazel/maz-ui/issues" target="_blank" rel="noopener" size="lg" color="surface" outlined :start-icon="MazGithub">
        Open issues
      </MazBtn>
    </div>

    <MazCardSpotlight color="secondary" elevation class="maz:mt-[clamp(4rem,8vw,7rem)] maz:block" content-class="maz:grid maz:gap-8 maz:p-[clamp(1.5rem,4vw,3rem)] maz:lap-s:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] maz:lap-s:items-center">
      <div>
        <p class="home-eyebrow">
          How Maz-UI ships
        </p>
        <h3 class="home-display maz:mt-3 maz:mb-4 maz:text-[clamp(2rem,4.5vw,3.25rem)] maz:font-bold">
          Every release is launched with Relizy
        </h3>
        <p class="home-lead maz:m-0">
          Relizy is the release tool behind Maz-UI, by the same author. It reads your Conventional Commits and does the rest, for a single package or a whole monorepo.
        </p>
        <div class="maz:mt-8 maz:flex maz:flex-wrap maz:gap-3">
          <MazBtn href="https://relizy.dev" target="_blank" rel="noopener" color="secondary" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">
            Discover Relizy
          </MazBtn>
          <MazBtn href="https://github.com/LouisMazel/relizy" target="_blank" rel="noopener" color="surface" outlined :start-icon="MazGithub">
            GitHub
          </MazBtn>
        </div>
      </div>
      <div class="maz:flex maz:flex-col maz:gap-5">
        <MazTimeline v-model="relizyStep" :steps="RELIZY_STEPS" direction="vertical" color="secondary" size="lg" />
        <MazCodeHighlight :code="data.snippets.relizy.code" :language="data.snippets.relizy.lang" theme="tokyo-night" />
      </div>
    </MazCardSpotlight>
  </HomeChapter>
</template>
