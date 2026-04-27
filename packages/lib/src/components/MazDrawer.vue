<script lang="ts" setup>
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { computed, defineAsyncComponent, useSlots } from 'vue'

import MazBackdrop from './MazBackdrop.vue'
import MazIcon from './MazIcon.vue'

const props = withDefaults(defineProps<MazDrawerProps>(), {
  title: undefined,
  variant: 'end',
  backdropClass: undefined,
  size: '30rem',
  noClose: false,
})

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

export interface MazDrawerProps {
  /** The title of the drawer */
  title?: string
  /**
   * The edge from which the drawer slides in.
   * `start` (= left in LTR, right in RTL) and `end` (= right in LTR, left in RTL)
   * follow the document direction; `top` and `bottom` are physical.
   * @values 'start', 'end', 'top', 'bottom'
   */
  variant?: 'start' | 'end' | 'top' | 'bottom'
  /** The size of the drawer */
  size?: string
  /** The class of the backdrop */
  backdropClass?: string
  /** Disable the close button */
  hideCloseButton?: boolean
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const justify = computed(() => {
  if (props.variant === 'start') {
    return 'start'
  }
  else if (props.variant === 'end') {
    return 'end'
  }

  return 'none'
})

const align = computed(() => {
  if (props.variant === 'top') {
    return 'start'
  }
  else if (props.variant === 'bottom') {
    return 'end'
  }

  return 'none'
})

const slots = useSlots()

const hasTitle = computed(() => {
  return !!(props.title || slots.title)
})
</script>

<template>
  <MazBackdrop
    :backdrop-class="['m-drawer', backdropClass]"
    :justify
    :align
    variant="drawer"
    :transition-name="`drawer-anim-${variant}`"
    @close="$emit('close')"
    @open="$emit('open')"
    @before-close="$emit('before-close')"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div
        class="m-drawer-content-wrap maz:overflow-y-auto maz:bg-surface maz:pointer-events-auto maz:flex maz:flex-col"
        :class="[
          `--${variant}`,
          (variant === 'start' || variant === 'end') ? 'maz:min-h-screen maz:w-full maz:tab-s:w-(--maz-drawer-size)' : 'maz:w-full maz:h-auto',
        ]"
        :style="{
          '--maz-drawer-size': size,
        }"
      >
        <header
          class="m-drawer-header maz:z-1 maz:flex maz:h-16 maz:shrink-0 maz:items-center maz:border-b maz:border-divider maz:bg-surface maz:bg-clip-padding maz:ps-4 maz:pe-2 maz:py-3"
          :class="[
            hasTitle ? '--justify-between' : '--justify-end',
            hasTitle ? 'maz:justify-between' : 'maz:justify-end',
          ]"
        >
          <h4 class="m-drawer-header__title maz:m-0 maz:text-xl maz:font-semibold">
            <slot name="title" :close="close">
              {{ title }}
            </slot>
          </h4>
          <div v-if="!hideCloseButton" class="m-drawer-header__close maz:flex maz:justify-end">
            <MazBtn size="sm" color="transparent" @click="close">
              <MazIcon :icon="MazXMark" class="icon maz:text-lg" />
            </MazBtn>
          </div>
        </header>
        <div class="m-drawer-body maz:z-0 maz:min-h-0 maz:flex-1 maz:overflow-x-auto maz:bg-clip-padding">
          <slot :close="close" />
        </div>
      </div>
    </template>
  </MazBackdrop>
</template>
