<script lang="ts" setup>
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { MazGithub } from '@maz-ui/icons/raw/MazGithub'
import { MazPlusCircle } from '@maz-ui/icons/raw/MazPlusCircle'
import { computed, defineAsyncComponent, hydrateOnVisible } from 'vue'
import { data } from '../.vitepress/data/home.data'
import MadeWithProject from './made-with/MadeWithProject.vue'
import MadeWithSection from './made-with/MadeWithSection.vue'
import { PROJECTS } from './made-with/projects'
import './home/home.css'

const HomeFooter = defineAsyncComponent({
  loader: () => import('./home/HomeFooter.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '300px' }),
})

const ISSUE_URL = 'https://github.com/LouisMazel/maz-ui/issues/new?assignees=LouisMazel&labels=enhancement&template=feature_request.md&title=%5BMade%20with%20Maz-UI%5D'
const EDIT_URL = 'https://github.com/LouisMazel/maz-ui/edit/master/apps/docs/components/made-with/projects.ts'

const projects = PROJECTS.map((project, index) => ({
  project,
  number: String(index + 2).padStart(2, '0'),
}))

const SHOT_COLUMNS = [0, 1, 2].map(column => PROJECTS.filter((_, index) => index % 3 === column || (index + 1) % 3 === column))

const STATS = computed(() => [
  { label: 'products on this page', count: PROJECTS.length },
  { label: 'components to build yours', count: data.componentCount },
].filter(stat => stat.count > 0))
</script>

<template>
  <div class="home made-with vp-raw">
    <MadeWithSection id="cover" number="01" label="Made with Maz-UI">
      <div class="maz:grid maz:items-center maz:gap-12 maz:lap-s:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p class="home-eyebrow">
            Showcase
          </p>
          <h1 id="cover-title" class="home-display maz:mt-3 maz:mb-0 maz:max-w-[14ch] maz:text-[clamp(2.75rem,6.4vw,5.5rem)] maz:font-extrabold">
            <MazAnimatedText
              text="Real products, made with"
              last-word="Maz-UI"
              :duration="1200"
              :word-delay="60"
            />
          </h1>
          <p class="home-lead maz:mt-6 maz:mb-0">
            Release tools, AI assistants, computer vision and football with friends: they all run on Maz-UI.
          </p>
          <div class="maz:mt-10 maz:flex maz:flex-wrap maz:gap-3">
            <MazBtn :href="`#${PROJECTS[0].id}`" size="lg" :end-icon="{ icon: MazArrowRight, flipIconForRtl: true }">
              See the products
            </MazBtn>
            <MazBtn :href="ISSUE_URL" target="_blank" rel="noopener" size="lg" color="surface" variant="outline" :start-icon="MazPlusCircle">
              Add your project
            </MazBtn>
          </div>

          <dl class="maz:mt-[clamp(3rem,6vw,5rem)] maz:mb-0 maz:grid maz:grid-cols-2 maz:gap-6 maz:border-t maz:border-divider maz:pt-8">
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

        <div class="made-with-wall maz:relative maz:hidden maz:h-[36rem] maz:overflow-hidden maz:rounded-(--home-radius) maz:lap-s:block" aria-hidden="true">
          <div class="made-with-wall__plane maz:absolute maz:inset-x-[-20%] maz:top-[-30%] maz:flex maz:h-[160%] maz:justify-center maz:gap-5">
            <MazTicker
              v-for="(column, index) in SHOT_COLUMNS"
              :key="index"
              orientation="vertical"
              :reverse="index % 2 === 1"
              :overlay="false"
              :duration="36 + index * 6"
              gap="1.25rem"
              class="maz:w-72 maz:shrink-0"
            >
              <div v-for="project in column" :key="project.id" class="maz:w-72 maz:overflow-hidden maz:rounded-lg maz:border maz:border-divider maz:shadow-elevation">
                <img :src="project.image.light" alt="" width="1600" height="1000" loading="lazy" decoding="async" class="made-with-shot-light maz:block maz:h-auto maz:w-full">
                <img :src="project.image.dark" alt="" width="1600" height="1000" loading="lazy" decoding="async" class="made-with-shot-dark maz:h-auto maz:w-full">
              </div>
            </MazTicker>
          </div>
        </div>
      </div>
    </MadeWithSection>

    <MadeWithProject
      v-for="(item, index) in projects"
      :key="item.project.id"
      :project="item.project"
      :number="item.number"
      :reversed="index % 2 === 1"
    />

    <MadeWithSection id="your-project" :number="String(projects.length + 2).padStart(2, '0')" label="Your project">
      <MazCardSpotlight color="primary" elevation class="maz:block" content-class="maz:grid maz:gap-10 maz:p-[clamp(1.5rem,4vw,3rem)] maz:lap-s:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] maz:lap-s:items-center">
        <div>
          <p class="home-eyebrow">
            The next chapter
          </p>
          <h2 id="your-project-title" class="home-display maz:mt-3 maz:mb-4 maz:text-[clamp(2rem,4.5vw,3.25rem)] maz:font-bold">
            Built something with Maz-UI?
          </h2>
          <p class="home-lead maz:m-0">
            Add it to this page. Open an issue with the link of your website, or add it yourself to the list of projects in a pull request.
          </p>
          <div class="maz:mt-8 maz:flex maz:flex-wrap maz:gap-3">
            <MazBtn :href="ISSUE_URL" target="_blank" rel="noopener" :start-icon="MazPlusCircle">
              Propose my project
            </MazBtn>
            <MazBtn :href="EDIT_URL" target="_blank" rel="noopener" color="surface" variant="outline" :start-icon="MazGithub">
              Open a pull request
            </MazBtn>
          </div>
        </div>
        <MazWindowMockup url="your-project.com" label="Your product here" min-height="16rem" hide-url-copy class="maz:shadow-elevation" />
      </MazCardSpotlight>
    </MadeWithSection>

    <HomeFooter :data />
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .made-with-wall {
    perspective: 1500px;
    mask-image:
      linear-gradient(to bottom, transparent, black 25%, black 75%, transparent),
      linear-gradient(to right, transparent, black 25%, black 75%, transparent);
    mask-composite: intersect;
  }

  .made-with-wall__plane {
    transform: rotateX(40deg) rotateZ(-18deg);
    transform-origin: center;
  }
}
</style>

<style>
.made-with-shot-dark,
.dark .made-with-shot-light {
  display: none;
}

.dark .made-with-shot-dark {
  display: block;
}

.VPHome:has(.made-with) {
  margin-block-end: 0 !important;
  padding-block-end: 0 !important;
}
</style>
