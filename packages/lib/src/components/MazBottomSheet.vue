<script lang="ts" setup>
import type {
  ClassValue,
  ComponentPublicInstance,
  StyleValue,
} from 'vue'
import type { MazIconLike } from '../composables/useMazIconProps'
import type { MazBackdropProps } from './MazBackdrop.vue'
import type { MazSizeUnit } from './types'

import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import {
  computed,
  defineAsyncComponent,
  ref,
  useAttrs,
  useSlots,
} from 'vue'
import { useDrag } from '../composables/useDrag'
import { useMazIconProps } from '../composables/useMazIconProps'
import { hasSlotContent } from '../utils/hasSlotContent'
import MazBackdrop from './MazBackdrop.vue'
import MazIcon from './MazIcon.vue'

defineOptions({
  name: 'MazBottomSheet',
  inheritAttrs: false,
})

const {
  modelValue,
  title,
  icon,
  maxWidth = '40rem',
  hideCloseButton = false,
  hideHeader = false,
  padding = true,
  persistent,
  swipeToClose = true,
  closeOnEscape = true,
  ...backdropProps
} = defineProps<BottomSheetProps & MazBackdropProps>()

const emits = defineEmits<{
  /** Emitted when the model value is updated */
  'update:model-value': [value: boolean]
  /** Emitted when the component is opened */
  'open': [value: void]
  /** Emitted when the component is closed */
  'close': [value: void]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

export interface BottomSheetProps {
  /** @model Modal's model value */
  modelValue?: boolean
  /** Title of the bottom sheet in the header */
  title?: string
  /** Icon displayed on the left of the header. Accepts an icon value or a full `MazIconProps` object. */
  icon?: MazIconLike
  /**
   * Bottom sheet's max-width, applied from the tablet breakpoint and up (full-width below).
   * @default '40rem'
   */
  maxWidth?: MazSizeUnit
  /** Remove the close button in the header */
  hideCloseButton?: boolean
  /** Remove the whole header */
  hideHeader?: boolean
  /** Add the padding on the content area */
  padding?: boolean
  /** Persistent bottom sheet (not closable by clicking outside and remove close button) */
  persistent?: boolean
  /**
   * Show the drag handle at the top and allow closing the sheet by swiping it down (iOS-like).
   * The swipe never closes a `persistent` sheet (it snaps back instead).
   * @default true
   */
  swipeToClose?: boolean
}

export interface MazBottomSheetProps extends BottomSheetProps, MazBackdropProps {}

const attrs = useAttrs()
const slots = useSlots()

const backdrop = ref<ComponentPublicInstance<typeof MazBackdrop>>()

defineExpose({
  /**
   * Close the bottom sheet
   * @description This is used to close the bottom sheet
   */
  close: () => backdrop.value?.close?.(),
})

const { iconProps } = useMazIconProps(() => icon, () => ({ size: '1.5rem' }))

const wrapperAttrs = computed<{
  class?: ClassValue
  style: StyleValue
}>(() => ({
  class: attrs.class as ClassValue,
  style: attrs.style as StyleValue,
}))

const hasTitle = computed(() => hasSlotContent(slots.title) || !!title)
const hasIcon = computed(() => hasSlotContent(slots.icon) || !!iconProps.value)
const hasFooter = computed(() => hasSlotContent(slots.footer))

const CLOSE_THRESHOLD = 120

const closeSheet = () => backdrop.value?.close?.()

const handleEl = ref<HTMLElement>()
const dragOffset = ref(0)

const sheetStyle = computed<StyleValue>(() =>
  dragOffset.value > 0 ? { transform: `translateY(${dragOffset.value}px)` } : {},
)

const { isDragging } = useDrag(handleEl, {
  axis: 'y',
  onMove: ({ offsetY }) => {
    dragOffset.value = Math.max(0, offsetY)
  },
  onEnd: ({ offsetY }) => {
    if (!persistent && offsetY >= CLOSE_THRESHOLD)
      closeSheet()
    else
      dragOffset.value = 0
  },
})

function onClose(value: void) {
  dragOffset.value = 0
  emits('close', value)
}
</script>

<template>
  <MazBackdrop
    v-bind="backdropProps"
    ref="backdrop"
    v-slot="{ close }"
    :model-value="modelValue"
    transition-name="bottom-sheet-anim"
    backdrop-class="--bottom-sheet"
    :content-padding="false"
    :close-on-escape="closeOnEscape"
    :persistent="persistent"
    align="end"
    justify="center"
    variant="bottom-sheet"
    aria-labelledby="bottomSheetTitle"
    aria-describedby="bottomSheetDesc"
    @close="onClose"
    @open="emits('open', $event)"
    @update:model-value="emits('update:model-value', $event)"
  >
    <div
      class="m-bottom-sheet-wrapper maz:flex maz:w-full maz:flex-col"
      :style="[{ '--max-width': maxWidth }]"
    >
      <div
        class="m-bottom-sheet maz:relative maz:flex maz:w-full maz:flex-col maz:rounded-t-md maz:border-x maz:border-t maz:border-divider maz:bg-container maz:text-foreground maz:shadow-elevation maz:drop-shadow-md"
        :class="{ '--dragging': isDragging }"
        role="dialog"
        aria-modal="true"
        :style="sheetStyle"
        v-bind="wrapperAttrs"
      >
        <div
          v-if="swipeToClose"
          ref="handleEl"
          class="m-bottom-sheet__handle-zone maz:flex maz:shrink-0 maz:cursor-grab maz:touch-none maz:justify-center maz:pt-2 maz:pb-1"
        >
          <!--
            @slot Drag handle (grab bar) displayed at the top when `swipeToClose` is enabled
          -->
          <slot name="handle">
            <span class="m-bottom-sheet__handle maz:h-1 maz:w-9 maz:rounded-full maz:bg-foreground/20" />
          </slot>
        </div>

        <!--
          @slot Header slot
            @binding {Function} close close function
        -->
        <slot name="header" :close="close">
          <div
            v-if="!hideHeader"
            class="m-bottom-sheet__header maz:flex maz:items-center maz:gap-3 maz:border-b maz:border-divider maz:px-3 maz:py-2"
            :class="[hasTitle || hasIcon ? 'maz:justify-between' : 'maz:justify-end']"
          >
            <div v-if="hasTitle || hasIcon" class="m-bottom-sheet__header-content maz:flex maz:min-w-0 maz:items-center maz:gap-3">
              <span v-if="hasIcon" class="m-bottom-sheet__icon maz:flex maz:shrink-0 maz:items-center">
                <!--
                  @slot Icon slot in the header
                -->
                <slot name="icon">
                  <MazIcon v-if="iconProps" v-bind="iconProps" />
                </slot>
              </span>
              <h2
                v-if="hasTitle"
                id="bottomSheetTitle"
                class="m-bottom-sheet__title maz:my-0 maz:truncate maz:font-display maz:text-lg maz:font-semibold"
              >
                <!--
                  @slot Title slot in the header
                -->
                <slot name="title">
                  {{ title }}
                </slot>
              </h2>
            </div>

            <div v-if="!hideCloseButton && !persistent" class="m-bottom-sheet__close maz:flex maz:shrink-0 maz:justify-end">
              <MazBtn
                color="transparent"
                size="sm"
                outlined
                :icon="MazXMark"
                @click="close"
              />
            </div>
          </div>
        </slot>

        <div
          id="bottomSheetDesc"
          class="m-bottom-sheet__content maz:flex-1"
          :class="{
            'maz:p-4': padding,
          }"
        >
          <!--
            @slot Default content
              @binding {Function} close close function
          -->
          <slot :close="close" />
        </div>

        <div
          v-if="hasFooter"
          class="m-bottom-sheet__footer maz:flex maz:items-center maz:justify-end maz:gap-2 maz:border-t maz:border-divider maz:p-4"
        >
          <!--
            @slot Footer slot
              @binding {Function} close close function
          -->
          <slot name="footer" :close="close" />
        </div>
      </div>
    </div>
  </MazBackdrop>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-bottom-sheet-wrapper {
  @variant tab-s {
    max-inline-size: var(--max-width);
  }
}

.m-bottom-sheet {
  transition: transform 0.25s ease;
  will-change: transform;
}

.m-bottom-sheet.--dragging {
  transition: none;
}
</style>
