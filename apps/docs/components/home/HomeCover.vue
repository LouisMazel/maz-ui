<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { MazGithub } from '@maz-ui/icons/raw/MazGithub'
import { computed, defineAsyncComponent, ref } from 'vue'
import { INSTALL_COMMANDS } from './content'
import HomeChapter from './HomeChapter.vue'

const { data } = defineProps<{ data: HomeData }>()

const HeroConstellation = defineAsyncComponent(() => import('./hero/HeroConstellation.vue'))

const PACKAGE_MANAGERS = INSTALL_COMMANDS.map(({ label, value }) => ({ label, value }))

const packageManager = ref<(typeof INSTALL_COMMANDS)[number]['value']>('pnpm')
const command = computed(() => INSTALL_COMMANDS.find(item => item.value === packageManager.value)!.command)

const STATS = computed(() => [
  { label: 'components', count: data.componentCount },
  {
    label: 'modules in total',
    count: data.categories.reduce((sum, category) => sum + category.count, 0),
  },
  { label: 'icons', count: data.iconCount },
  { label: 'contributors', count: data.contributors.length },
].filter(stat => stat.count > 0))

const swatch = computed(() => data.presets.find(preset => preset.name === 'folio')!)
</script>

<template>
  <HomeChapter id="cover" number="01" label="Maz-UI" :swatch>
    <template #backdrop>
      <ClientOnly>
        <HeroConstellation />
      </ClientOnly>
    </template>

    <div>
      <div class="maz:relative">
        <MazLink href="/blog/v5" color="inherit" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }" class="maz:text-sm maz:font-medium">
          <MazBadge color="primary" size="sm" rounded-size="full">
            v{{ data.version.split('-')[0] }}
          </MazBadge>
          Maz-UI v5 is out
        </MazLink>

        <h1 id="cover-title" class="home-display maz:mt-6 maz:mb-0 maz:max-w-[16ch] maz:text-[clamp(2.75rem,6.4vw,5.5rem)] maz:font-extrabold">
          <MazAnimatedText
            text="Beautiful Vue and Nuxt apps,"
            last-word="in your brand"
            :duration="1200"
            :word-delay="60"
          />
        </h1>

        <p class="home-lead maz:mt-6 maz:mb-0">
          {{ data.componentCount }} ready-made components, plus forms, dialogs, toasts and icons.
          Pick only what you need, give it your colors in minutes.
        </p>

        <div class="maz:mt-10 maz:flex maz:flex-wrap maz:gap-3">
          <MazBtn href="/guide/getting-started" size="lg" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">
            Get started
          </MazBtn>
          <MazBtn href="https://github.com/LouisMazel/maz-ui" target="_blank" rel="noopener" size="lg" color="surface" outlined :start-icon="MazGithub">
            GitHub
            <template v-if="data.stars" #end-icon>
              <span class="maz:border-s maz:border-divider maz:ps-2 maz:text-sm maz:text-muted">
                <MazAnimatedCounter :count="data.stars" :delay="0" :duration="900" suffix=" stars" />
              </span>
            </template>
          </MazBtn>
        </div>

        <div class="maz:mt-8 maz:flex maz:w-full maz:max-w-md maz:flex-col maz:gap-2">
          <MazTabsBar
            v-model="packageManager"
            :items="PACKAGE_MANAGERS"
            size="xs"
            standalone
            :elevation="false"
            aria-label="Package manager"
          />
          <MazWindowMockup variant="terminal" title="Install Maz-UI" :code="command" language="bash" />
        </div>

        <dl class="maz:mt-[clamp(3rem,6vw,5rem)] maz:mb-0 maz:grid maz:max-w-3xl maz:grid-cols-2 maz:gap-6 maz:border-t maz:border-divider maz:pt-8 maz:tab-m:grid-cols-4">
          <div v-for="(stat, index) in STATS" :key="stat.label" class="maz:flex maz:flex-col-reverse maz:gap-1">
            <dt class="maz:text-sm maz:text-muted">
              {{ stat.label }}
            </dt>
            <dd class="maz:m-0 maz:font-display maz:text-[clamp(1.75rem,3.5vw,2.5rem)] maz:font-bold maz:tabular-nums">
              <MazAnimatedCounter :count="stat.count" :delay="200 + index * 120" :duration="1400" />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </HomeChapter>
</template>
