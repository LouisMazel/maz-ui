<script lang="ts" setup>
import type { MadeWithProject } from './projects'
import { MazArrowTopRightOnSquare } from '@maz-ui/icons/raw/MazArrowTopRightOnSquare'
import { MazCheckCircle } from '@maz-ui/icons/raw/MazCheckCircle'
import { MazGithub } from '@maz-ui/icons/raw/MazGithub'
import MadeWithSection from './MadeWithSection.vue'

const { project, number, reversed = false } = defineProps<{
  project: MadeWithProject
  number: string
  reversed?: boolean
}>()
</script>

<template>
  <MadeWithSection :id="project.id" :number :label="project.name">
    <div class="maz:grid maz:items-center maz:gap-[clamp(2.5rem,5vw,5rem)] maz:lap-s:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" :class="{ 'maz:lap-s:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]': reversed }">
      <div :class="{ 'maz:lap-s:order-2': reversed }">
        <p class="home-eyebrow maz:flex maz:flex-wrap maz:items-center maz:gap-x-3 maz:gap-y-2">
          <span>{{ project.kind }}</span>
          <span>{{ project.year }}</span>
          <MazBadge v-if="project.status" color="primary" size="sm" outlined rounded-size="full">
            {{ project.status }}
          </MazBadge>
        </p>
        <h2 :id="`${project.id}-title`" class="home-display maz:mt-3 maz:mb-4 maz:text-[clamp(2.5rem,5.5vw,4.25rem)] maz:font-bold">
          {{ project.name }}
        </h2>
        <p class="maz:m-0 maz:mb-4 maz:max-w-xl maz:font-display maz:text-[clamp(1.25rem,2vw,1.5rem)] maz:leading-snug maz:font-semibold maz:text-balance maz:text-primary">
          {{ project.tagline }}
        </p>
        <p class="home-lead maz:m-0">
          {{ project.description }}
        </p>

        <ul class="maz:mt-8 maz:mb-0 maz:flex maz:list-none maz:flex-col maz:gap-3 maz:p-0">
          <li v-for="highlight in project.highlights" :key="highlight" class="maz:flex maz:items-start maz:gap-3 maz:leading-relaxed">
            <MazIcon :icon="MazCheckCircle" size="1.25rem" class="maz:mt-0.5 maz:shrink-0 maz:text-primary" />
            <span>{{ highlight }}</span>
          </li>
        </ul>

        <ul class="maz:mt-8 maz:mb-0 maz:flex maz:list-none maz:flex-wrap maz:gap-2 maz:p-0" :aria-label="`Stack of ${project.name}`">
          <li v-for="tech in project.stack" :key="tech">
            <MazBadge :color="tech === 'Maz-UI' ? 'primary' : 'surface'" size="sm" rounded-size="full" :outlined="tech !== 'Maz-UI'">
              {{ tech }}
            </MazBadge>
          </li>
        </ul>

        <div class="maz:mt-10 maz:flex maz:flex-wrap maz:gap-3">
          <MazBtn :href="project.url" target="_blank" rel="noopener" size="lg" :end-icon="MazArrowTopRightOnSquare">
            Visit {{ project.name }}
          </MazBtn>
          <MazBtn v-if="project.github" :href="project.github" target="_blank" rel="noopener" size="lg" color="surface" outlined :start-icon="MazGithub">
            GitHub
          </MazBtn>
        </div>
      </div>

      <MazAnimatedElement :direction="reversed ? 'right' : 'left'" :duration="900" class="made-with-shot maz:min-w-0" :style="{ '--made-with-tilt': reversed ? '8deg' : '-8deg', '--made-with-origin': reversed ? 'left center' : 'right center' }">
        <a :href="project.url" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true" class="made-with-shot__link maz:block maz:rounded-xl maz:shadow-elevation">
          <MazWindowMockup :url="project.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')" hide-url-copy class="maz:rounded-xl">
            <img :src="project.image.light" :alt="`Home page of ${project.name}`" width="1600" height="1000" loading="lazy" decoding="async" class="made-with-shot-light maz:block maz:h-auto maz:w-full">
            <img :src="project.image.dark" :alt="`Home page of ${project.name}`" width="1600" height="1000" loading="lazy" decoding="async" class="made-with-shot-dark maz:h-auto maz:w-full">
          </MazWindowMockup>
        </a>
      </MazAnimatedElement>
    </div>
  </MadeWithSection>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) and (min-width: 1024px) {
  .made-with-shot {
    perspective: 2000px;
  }

  .made-with-shot__link {
    transform: rotateY(var(--made-with-tilt, -8deg)) rotateX(3deg);
    transform-origin: var(--made-with-origin, right center);
    transition: transform 700ms var(--home-ease);
  }

  .made-with-shot:hover .made-with-shot__link {
    transform: none;
  }
}
</style>
