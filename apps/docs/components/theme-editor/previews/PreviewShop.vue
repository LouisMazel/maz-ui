<script lang="ts" setup>
import { MazHeart } from '@maz-ui/icons/raw/MazHeart'
import { MazShoppingBag } from '@maz-ui/icons/raw/MazShoppingBag'
import { MazStarSolid } from '@maz-ui/icons/raw/MazStarSolid'
import { MazTruck } from '@maz-ui/icons/raw/MazTruck'
import { ref } from 'vue'

const FINISHES = [
  { label: 'Graphite', value: 'graphite', className: 'maz:bg-contrast' },
  { label: 'Ocean', value: 'ocean', className: 'maz:bg-primary' },
  { label: 'Coral', value: 'coral', className: 'maz:bg-accent' },
] as const

const finish = ref<(typeof FINISHES)[number]['value']>('ocean')
const quantity = ref(1)
const size = ref('m')

const REVIEWS = [
  { name: 'Grace Hopper', text: 'The sound is warm and wide, and they stay comfortable for a full day of calls.', rating: 5 },
  { name: 'Alan Turing', text: 'Great noise cancelling. The case could be smaller.', rating: 4 },
] as const
</script>

<template>
  <div class="maz:grid maz:gap-[clamp(1.5rem,4vw,3rem)] maz:p-[clamp(1rem,3vw,2rem)] maz:tab-l:grid-cols-2">
    <div class="maz:flex maz:flex-col maz:gap-3 maz:tab-l:sticky maz:tab-l:top-0 maz:tab-l:self-start">
      <div
        class="maz:relative maz:flex maz:aspect-4/3 maz:items-end maz:overflow-hidden maz:rounded-xl maz:p-4"
        :class="FINISHES.find(item => item.value === finish)?.className"
      >
        <span class="maz:absolute maz:inset-[18%] maz:rounded-full maz:border-[1.25rem] maz:border-surface/30" aria-hidden="true" />
        <MazBadge color="surface" size="sm">
          New
        </MazBadge>
      </div>
      <div class="maz:grid maz:grid-cols-3 maz:gap-3" aria-hidden="true">
        <span v-for="item in FINISHES" :key="item.value" class="maz:aspect-square maz:rounded-lg maz:opacity-80" :class="item.className" />
      </div>
    </div>

    <div class="maz:flex maz:flex-col maz:gap-5">
      <div>
        <p class="maz:m-0 maz:text-overline maz:text-primary maz:uppercase">
          Audio
        </p>
        <h1 class="maz:m-0 maz:mt-2 maz:text-title-1">
          Studio Wireless
        </h1>
        <div class="maz:mt-2 maz:flex maz:items-center maz:gap-2 maz:text-body-sm maz:text-muted">
          <span class="maz:flex maz:text-warning">
            <MazIcon v-for="index in 5" :key="index" :icon="MazStarSolid" size="1rem" />
          </span>
          4.8 · 1,204 reviews
        </div>
      </div>

      <p class="maz:m-0 maz:flex maz:items-baseline maz:gap-3">
        <span class="maz:text-title-2 maz:tabular-nums">$249</span>
        <span class="maz:text-body maz:text-muted maz:line-through">$299</span>
        <MazBadge color="success" size="sm" pastel>
          -17%
        </MazBadge>
      </p>

      <p class="maz:m-0 maz:text-body maz:text-muted">
        Active noise cancelling, 40 hours of battery and a sound tuned in the studio. Folds flat into its case.
      </p>

      <div class="maz:flex maz:flex-col maz:gap-2">
        <span class="maz:text-label">Finish: {{ FINISHES.find(item => item.value === finish)?.label }}</span>
        <MazRadioButtons v-model="finish" :options="FINISHES.map(({ label, value }) => ({ label, value }))" size="sm" />
      </div>

      <div class="maz:flex maz:flex-col maz:gap-2">
        <span class="maz:text-label">Size</span>
        <MazRadioButtons v-model="size" :options="[{ label: 'S', value: 's' }, { label: 'M', value: 'm' }, { label: 'L', value: 'l' }]" size="sm" />
      </div>

      <div class="maz:flex maz:flex-wrap maz:gap-2">
        <MazInputNumber v-model="quantity" :min="1" :max="9" size="md" class="maz:w-36" />
        <MazBtn :start-icon="MazShoppingBag" class="maz:flex-1">
          Add to cart
        </MazBtn>
        <MazBtn color="surface" outlined :icon="MazHeart" aria-label="Save for later" />
      </div>

      <MazAlert color="info" :icon="MazTruck" content="Free delivery tomorrow, free returns for 30 days." />

      <div class="maz:flex maz:flex-col maz:gap-3 maz:border-t maz:border-divider maz:pt-5">
        <h2 class="maz:m-0 maz:text-title-4">
          Reviews
        </h2>
        <div v-for="review in REVIEWS" :key="review.name" class="maz:flex maz:gap-3">
          <MazAvatar :caption="review.name" size="2.25rem" color="auto" />
          <div>
            <p class="maz:m-0 maz:text-label">
              {{ review.name }}
            </p>
            <p class="maz:m-0 maz:mt-0.5 maz:text-body-sm maz:text-muted">
              {{ review.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
