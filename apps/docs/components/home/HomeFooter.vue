<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { MazArrowUp } from '@maz-ui/icons/raw/MazArrowUp'
import { MazGithub } from '@maz-ui/icons/raw/MazGithub'
import { MazLogoNpm } from '@maz-ui/icons/raw/MazLogoNpm'
import { MazLogoTwitter } from '@maz-ui/icons/raw/MazLogoTwitter'
import { defineAsyncComponent } from 'vue'
import { PACKAGES } from './content'

const { data } = defineProps<{ data: HomeData }>()

const HeroConstellation = defineAsyncComponent(() => import('./hero/HeroConstellation.vue'))

const COMMUNITY_LINKS = [
  { label: 'GitHub', href: 'https://github.com/LouisMazel/maz-ui' },
  { label: 'Contributing guide', href: 'https://github.com/LouisMazel/maz-ui/blob/master/CONTRIBUTING.md' },
  { label: 'Report an issue', href: 'https://github.com/LouisMazel/maz-ui/issues' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Made with Maz-UI', href: '/made-with-maz-ui' },
]

const SOCIALS = [
  { label: 'Maz-UI on GitHub', href: 'https://github.com/LouisMazel/maz-ui', icon: MazGithub },
  { label: 'Maz-UI on Twitter', href: 'https://twitter.com/maz__ui', icon: MazLogoTwitter },
  { label: 'Maz-UI on npm', href: 'https://www.npmjs.com/package/maz-ui', icon: MazLogoNpm },
]

const COLUMN_TITLE = 'maz:mt-0 maz:mb-4 maz:font-mono maz:text-xs maz:font-medium maz:tracking-[0.08em] maz:text-muted maz:uppercase'

function scrollToTop() {
  globalThis.scrollTo({
    top: 0,
    behavior: globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  })
}
</script>

<template>
  <footer
    class="home-chapter home-chapter--night maz:relative maz:-mt-(--home-radius) maz:overflow-hidden maz:rounded-t-(--home-radius) maz:bg-surface maz:font-sans maz:text-foreground"
    data-preset="folio"
  >
    <ClientOnly>
      <HeroConstellation />
    </ClientOnly>

    <div class="maz:relative maz:mx-auto maz:max-w-7xl maz:px-[clamp(1.25rem,4vw,4rem)] maz:pt-[clamp(4rem,8vw,7rem)] maz:pb-10">
      <div class="maz:grid maz:gap-12 maz:lap-s:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div class="maz:flex maz:flex-col maz:items-start maz:gap-6">
          <img src="/img/logo.svg" alt="Maz-UI" width="56" height="56" loading="lazy" class="maz:size-14">
          <p class="home-display maz:m-0 maz:max-w-[14ch] maz:text-[clamp(1.75rem,3vw,2.5rem)] maz:font-bold">
            Build among the stars.
          </p>
          <p class="maz:m-0 maz:max-w-xs maz:leading-relaxed maz:text-muted">
            Vue and Nuxt components, themes, icons and tools, free and open source.
          </p>
          <div class="maz:flex maz:gap-2">
            <MazBtn
              v-for="social in SOCIALS"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener"
              color="surface"
              outlined
              fab
              size="sm"
              :icon="social.icon"
              :aria-label="social.label"
            />
          </div>
        </div>

        <nav aria-labelledby="footer-docs">
          <h2 id="footer-docs" :class="COLUMN_TITLE">
            Documentation
          </h2>
          <ul class="maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-3 maz:p-0">
            <li>
              <MazLink href="/guide/getting-started" color="contrast">
                Getting started
              </MazLink>
            </li>
            <li v-for="category in data.categories.slice(0, 5)" :key="category.name">
              <MazLink :href="category.link" color="contrast">
                {{ category.name }}
              </MazLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-ecosystem">
          <h2 id="footer-ecosystem" :class="COLUMN_TITLE">
            Ecosystem
          </h2>
          <ul class="maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-3 maz:p-0">
            <li v-for="pkg in PACKAGES" :key="pkg.name">
              <MazLink :href="pkg.link" color="contrast">
                {{ pkg.name }}
              </MazLink>
            </li>
            <li>
              <MazLink href="https://relizy.dev" target="_blank" rel="noopener" color="contrast">
                Relizy
              </MazLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-community">
          <h2 id="footer-community" :class="COLUMN_TITLE">
            Community
          </h2>
          <ul class="maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-3 maz:p-0">
            <li v-for="link in COMMUNITY_LINKS" :key="link.label">
              <MazLink :href="link.href" color="contrast" v-bind="link.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}">
                {{ link.label }}
              </MazLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="maz:mt-16 maz:flex maz:flex-wrap maz:items-center maz:justify-between maz:gap-4 maz:border-t maz:border-divider maz:pt-8 maz:text-sm maz:text-muted">
        <p class="maz:m-0">
          MIT License · © {{ data.year }} <MazLink href="https://github.com/LouisMazel" target="_blank" rel="noopener" color="contrast" :auto-external="false">
            LouisMazel
          </MazLink> · v{{ data.version }}
        </p>
        <MazBtn size="sm" color="transparent" :start-icon="MazArrowUp" @click="scrollToTop">
          Back to top
        </MazBtn>
      </div>
    </div>
  </footer>
</template>
