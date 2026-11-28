<script lang="ts" setup>
import type { MazSizeUnit } from './types.ts'
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'

import { computed, defineAsyncComponent, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazBackdrop from './MazBackdrop.vue'
import MazIcon from './MazIcon.vue'

const {
  title,
  side,
  variant,
  backdropClass,
  size = '30rem',
  hideCloseButton,
  beforeClose,
} = defineProps<MazDrawerProps>()

defineEmits<{
  /** emitted before drawer is close */
  (name: 'before-close'): void
  /** emitted when drawer is open */
  (name: 'open'): void
  /** emitted when drawer is close (after animation) */
  (name: 'close'): void
  /**
   * emitted when drawer is open or close
   * @param {boolean} value - The value of the model
   */
  (name: 'update:model-value', value: boolean): void
}>()

export type MazDrawerSide = 'start' | 'end' | 'top' | 'bottom'

export interface MazDrawerProps {
  /** The title of the drawer */
  title?: string
  /**
   * The edge from which the drawer slides in.
   * `start` (= left in LTR, right in RTL) and `end` (= right in LTR, left in RTL)
   * follow the document direction; `top` and `bottom` are physical.
   * @values 'start', 'end', 'top', 'bottom'
   * @default 'end'
   */
  side?: MazDrawerSide
  /**
   * The edge from which the drawer slides in
   * @deprecated Use `side` instead
   * @values 'start', 'end', 'top', 'bottom'
   */
  variant?: MazDrawerSide
  /** The size of the drawer */
  size?: MazSizeUnit
  /** The class of the backdrop */
  backdropClass?: string
  /** Disable the close button */
  hideCloseButton?: boolean
  /** Function called before the drawer closes, return `false` (or a promise of `false`) to keep it open */
  beforeClose?: () => Promise<boolean | void> | boolean | void
}

// Removed in v6 (plans/ROADMAP.md): `variant` is an alias of `side`
const drawerSide = computed(() => side ?? variant ?? 'end')

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const justify = computed(() => {
  if (drawerSide.value === 'start') {
    return 'start'
  }
  else if (drawerSide.value === 'end') {
    return 'end'
  }

  return 'none'
})

const align = computed(() => {
  if (drawerSide.value === 'top') {
    return 'start'
  }
  else if (drawerSide.value === 'bottom') {
    return 'end'
  }

  return 'none'
})

const slots = useSlots()

const hasTitle = computed(() => {
  return !!(title || slots.title)
})

const { t } = useTranslations()

const instanceId = useInstanceUniqId({ componentName: 'MazDrawer' })
const titleId = computed(() => `${instanceId.value}-title`)
</script>

<template>
  <MazBackdrop
    :backdrop-class="['m-drawer', backdropClass]"
    :justify
    :align
    variant="drawer"
    :before-close
    :aria-labelledby="hasTitle ? titleId : undefined"
    :transition-name="`drawer-anim-${drawerSide}`"
    @close="$emit('close')"
    @open="$emit('open')"
    @before-close="$emit('before-close')"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div
        class="m-drawer-content-wrap maz:pointer-events-auto maz:flex maz:max-h-full maz:flex-col maz:overflow-hidden maz:bg-container"
        :class="[
          `--${drawerSide}`,
          (drawerSide === 'start' || drawerSide === 'end') ? 'maz:size-full maz:tab-s:w-(--maz-drawer-size)' : 'maz:h-auto maz:w-full',
          {
            'maz:border-r maz:border-divider': drawerSide === 'start',
            'maz:border-l maz:border-divider': drawerSide === 'end',
            'maz:border-b maz:border-divider': drawerSide === 'top',
            'maz:border-t maz:border-divider': drawerSide === 'bottom',
          },
        ]"
        :style="{
          '--maz-drawer-size': size,
        }"
      >
        <header
          class="m-drawer-header maz:z-1 maz:flex maz:h-16 maz:shrink-0 maz:items-center maz:border-b maz:border-divider maz:bg-container maz:bg-clip-padding maz:py-3 maz:ps-4 maz:pe-2"
          :class="[
            hasTitle ? '--justify-between' : '--justify-end',
            hasTitle ? 'maz:justify-between' : 'maz:justify-end',
          ]"
        >
          <h2 :id="hasTitle ? titleId : undefined" class="m-drawer-header__title maz:m-0 maz:text-title-3">
            <slot name="title" :close="close">
              {{ title }}
            </slot>
          </h2>
          <div v-if="!hideCloseButton" class="m-drawer-header__close maz:flex maz:justify-end">
            <MazBtn size="sm" color="transparent" :aria-label="t('aria.close')" @click="close">
              <MazIcon :icon="MazXMark" class="icon maz:text-lg" aria-hidden="true" />
            </MazBtn>
          </div>
        </header>
        <div class="m-drawer-body maz:z-0 maz:min-h-0 maz:flex-1 maz:scrollbar-themed maz:overflow-auto maz:bg-clip-padding">
          <slot :close="close" />
        </div>
      </div>
    </template>
  </MazBackdrop>
</template>
