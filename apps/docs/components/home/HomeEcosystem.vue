<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { MazBell } from '@maz-ui/icons/raw/MazBell'
import { MazBolt } from '@maz-ui/icons/raw/MazBolt'
import { MazCalendar } from '@maz-ui/icons/raw/MazCalendar'
import { MazChartBar } from '@maz-ui/icons/raw/MazChartBar'
import { MazCheckCircle } from '@maz-ui/icons/raw/MazCheckCircle'
import { MazCog6Tooth } from '@maz-ui/icons/raw/MazCog6Tooth'
import { MazCommandLine } from '@maz-ui/icons/raw/MazCommandLine'
import { MazCpuChip } from '@maz-ui/icons/raw/MazCpuChip'
import { MazCube } from '@maz-ui/icons/raw/MazCube'
import { MazGlobeAlt } from '@maz-ui/icons/raw/MazGlobeAlt'
import { MazHeart } from '@maz-ui/icons/raw/MazHeart'
import { MazLanguage } from '@maz-ui/icons/raw/MazLanguage'
import { MazLockClosed } from '@maz-ui/icons/raw/MazLockClosed'
import { MazLogoTypescript } from '@maz-ui/icons/raw/MazLogoTypescript'
import { MazLogoVue } from '@maz-ui/icons/raw/MazLogoVue'
import { MazMoon } from '@maz-ui/icons/raw/MazMoon'
import { MazPaintBrush } from '@maz-ui/icons/raw/MazPaintBrush'
import { MazRocketLaunch } from '@maz-ui/icons/raw/MazRocketLaunch'
import { MazSparkles } from '@maz-ui/icons/raw/MazSparkles'
import { MazSun } from '@maz-ui/icons/raw/MazSun'
import { computed, defineAsyncComponent } from 'vue'
import { PACKAGES } from './content'
import HomeChapter from './HomeChapter.vue'

const { data } = defineProps<{ data: HomeData }>()

const HeroMagnetic = defineAsyncComponent(() => import('./hero/HeroMagnetic.vue'))

const swatch = computed(() => data.presets.find(preset => preset.name === 'ocean')!)

const ICONS = [
  MazSparkles,
  MazCpuChip,
  MazCommandLine,
  MazRocketLaunch,
  MazPaintBrush,
  MazLogoVue,
  MazLogoTypescript,
  MazGlobeAlt,
  MazLanguage,
  MazMoon,
  MazSun,
  MazBolt,
  MazCube,
  MazChartBar,
  MazCalendar,
  MazLockClosed,
  MazCheckCircle,
  MazBell,
  MazHeart,
  MazCog6Tooth,
]
</script>

<template>
  <HomeChapter id="ecosystem" number="05" label="Ecosystem" :swatch>
    <template #backdrop>
      <ClientOnly>
        <HeroMagnetic />
      </ClientOnly>
    </template>

    <header>
      <p class="home-eyebrow">
        The Maz-UI ecosystem
      </p>
      <h2 id="ecosystem-title" class="home-display maz:mt-3 maz:mb-6 maz:max-w-[20ch] maz:text-[clamp(2.5rem,6vw,4.75rem)] maz:font-bold">
        One library, a whole ecosystem around it
      </h2>
      <p class="home-lead maz:m-0">
        Maz-UI is not only components. Nuxt integration, themes, icons, translations, AI tooling and upgrade codemods: six packages built for it, all released together on v{{ data.version.split('-')[0] }}. Upgrade them at once, they always match.
      </p>
    </header>

    <div class="maz:my-[clamp(2.5rem,5vw,4rem)] maz:text-muted" aria-hidden="true">
      <MazTicker :duration="40" gap="2.5rem">
        <span class="maz:inline-flex maz:gap-10">
          <MazIcon v-for="(icon, index) in ICONS" :key="index" :icon size="1.75rem" />
        </span>
      </MazTicker>
    </div>

    <ul class="maz:m-0 maz:grid maz:list-none maz:gap-4 maz:p-0 maz:tab-m:grid-cols-2 maz:lap-m:grid-cols-3">
      <li v-for="(pkg, index) in PACKAGES" :key="pkg.name" class="maz:min-w-0">
        <MazAnimatedElement :delay="index * 80" :duration="700" class="maz:h-full">
          <MazCardSpotlight :color="index % 2 ? 'accent' : 'primary'" class="maz:size-full" content-class="maz:flex maz:h-full maz:flex-col maz:gap-3">
            <MazLink :href="pkg.link" color="inherit" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }" class="maz:self-start maz:font-mono maz:text-[1.0625rem] maz:font-semibold">
              {{ pkg.name }}
            </MazLink>
            <p class="maz:m-0 maz:leading-relaxed maz:text-muted">
              {{ pkg.description }}
              <strong v-if="pkg.name === '@maz-ui/icons'" class="maz:text-foreground"><MazAnimatedCounter :count="data.iconCount" :duration="1600" suffix=" icons." /></strong>
            </p>
            <MazWindowMockup v-if="pkg.snippet" variant="terminal" :title="pkg.name" :code="data.snippets[pkg.snippet].code" :language="data.snippets[pkg.snippet].lang" class="maz:mt-auto" />
          </MazCardSpotlight>
        </MazAnimatedElement>
      </li>
    </ul>
  </HomeChapter>
</template>
