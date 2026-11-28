<script lang="ts" setup generic="_T">
import type {
  ClassValue,
  ComponentPublicInstance,
  StyleValue,
} from 'vue'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { SheetSnapPoint } from '../utils/sheetSnap.ts'
import type { MazBackdropProps } from './MazBackdrop.vue'
import type { MazSizeUnit } from './types.ts'

import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useMazIconProps } from '../composables/useMazIconProps.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { useScaleBackground } from '../utils/scaleBackground.ts'
import { readTranslate, useSheetDrag } from '../utils/sheetDrag.ts'
import { CLOSE_DISTANCE, resolveSnapPoints, resolveSnapTarget, shouldDismiss } from '../utils/sheetSnap.ts'
import MazBackdrop from './MazBackdrop.vue'
import MazIcon from './MazIcon.vue'

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
  /**
   * Heights where the sheet rests, from the bottom of the screen: a number up to `1` is a fraction of the viewport
   * (`0.5` is half), a bigger number is in pixels, a string is a CSS length (`'50%'`, `'20rem'`, `'60vh'`).
   * The sheet is as tall as the biggest one. Drag it between them, a quick flick goes to the next one,
   * and the handle becomes a button that cycles them. The sheet opens at the first one of the list.
   * @example [0.5, 1]
   */
  snapPoints?: SheetSnapPoint[]
  /**
   * The active snap point, one of `snapPoints` (use it with `v-model:snap`)
   */
  snap?: SheetSnapPoint
  /**
   * Scale the page down slightly with rounded corners while the sheet is open (iOS-like).
   * Nothing happens under reduced motion.
   * @default false
   */
  scaleBackground?: boolean
  /**
   * CSS selector of the element to scale with `scaleBackground`.
   * Defaults to the root of the app (`#__nuxt`, `#app`), else the first element of the body that is not an overlay.
   * @example '#app'
   */
  scaleBackgroundTarget?: string
}

export interface MazBottomSheetProps extends BottomSheetProps, MazBackdropProps {}

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
  snapPoints,
  snap,
  scaleBackground = false,
  scaleBackgroundTarget,
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
  /** Emitted when the sheet rests at another snap point (`v-model:snap`) */
  'update:snap': [value: SheetSnapPoint]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

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

const { t } = useTranslations()

const instanceId = useInstanceUniqId({ componentName: 'MazBottomSheet' })
const titleId = computed(() => `${instanceId.value}-title`)
const descriptionId = computed(() => `${instanceId.value}-description`)
const hasIcon = computed(() => hasSlotContent(slots.icon) || !!iconProps.value)
const hasFooter = computed(() => hasSlotContent(slots.footer))

const closeSheet = () => backdrop.value?.close?.()

const sheetEl = ref<HTMLElement>()
const position = ref(0)
const viewportHeight = ref(0)
const rootFontSize = ref(16)
const measuredHeight = ref(0)

function updateViewport() {
  viewportHeight.value = window.innerHeight
  rootFontSize.value = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('resize', updateViewport))

const snaps = computed(() => resolveSnapPoints(snapPoints, viewportHeight.value, rootFontSize.value))
const sheetHeight = computed(() => snaps.value.at(-1)?.size ?? 0)
const hasSnapHandle = computed(() => (snapPoints?.length ?? 0) > 1)

const activeSnap = ref<SheetSnapPoint | undefined>(snap ?? snapPoints?.[0])

watch(() => snap, (value) => {
  if (value !== undefined)
    activeSnap.value = value
})

watch(() => modelValue, (value) => {
  if (value)
    activeSnap.value = snap ?? snapPoints?.[0]
})

const activeIndex = computed(() => Math.max(0, snaps.value.findIndex(item => item.value === activeSnap.value)))

const restPosition = computed(() => {
  const active = snaps.value[activeIndex.value]

  return active ? sheetHeight.value - active.size : 0
})

function setActiveSnap(index: number) {
  const target = snaps.value[Math.min(Math.max(index, 0), snaps.value.length - 1)]

  if (!target)
    return

  const previous = activeSnap.value

  activeSnap.value = target.value

  if (target.value !== previous)
    emits('update:snap', target.value)
}

function closeFromDrag() {
  void closeSheet()?.then(() => {
    if (backdrop.value?.present !== false)
      position.value = restPosition.value
  })

  return 'close' as const
}

function onRelease({ position: released, velocity }: { position: number, velocity: number }) {
  if (snaps.value.length === 0) {
    return !persistent && shouldDismiss({ position: released, velocity, distance: CLOSE_DISTANCE })
      ? closeFromDrag()
      : 0
  }

  const target = resolveSnapTarget({
    visible: sheetHeight.value - released,
    velocity,
    sizes: snaps.value.map(item => item.size),
    dismissible: !persistent,
  })

  if (target === 'close')
    return closeFromDrag()

  setActiveSnap(target)

  return sheetHeight.value - (snaps.value[target]?.size ?? sheetHeight.value)
}

const { isDragging, hasJustDragged } = useSheetDrag({
  element: sheetEl,
  position,
  edge: 'bottom',
  disabled: () => !swipeToClose,
  mouseSelector: '.m-bottom-sheet__handle-zone, .m-bottom-sheet__header',
  stretch: 48,
  lockScroll: () => snaps.value.length > 0 && activeIndex.value < snaps.value.length - 1,
  readPosition: element => readTranslate(element, 'transform')?.y,
  onStart: (element) => {
    measuredHeight.value = element.offsetHeight
  },
  onRelease,
})

watch(restPosition, (value) => {
  if (!isDragging.value)
    position.value = value
}, { immediate: true })

const sheetStyle = computed<StyleValue>(() => ({
  ...(snaps.value.length > 0 ? { height: `${sheetHeight.value}px` } : {}),
  ...(position.value === 0 ? {} : { transform: `translateY(${position.value}px)` }),
}))

const openHeight = computed(() => sheetHeight.value || measuredHeight.value)

useScaleBackground({
  active: () => scaleBackground && backdrop.value?.present === true,
  target: () => scaleBackgroundTarget,
  progress: () => openHeight.value > 0 ? 1 - Math.max(0, position.value) / openHeight.value : 1,
  dragging: isDragging,
})

function onHandleClick() {
  if (!hasJustDragged())
    setActiveSnap((activeIndex.value + 1) % snaps.value.length)
}

function onHandleKeydown(event: KeyboardEvent) {
  const moves: Record<string, number> = { ArrowUp: activeIndex.value + 1, ArrowDown: activeIndex.value - 1 }

  if (event.key in moves) {
    setActiveSnap(moves[event.key] as number)
  }
  else if (event.key === 'Enter' || event.key === ' ') {
    onHandleClick()
  }
  else {
    return
  }

  event.preventDefault()
}

function onClose(value: void) {
  position.value = restPosition.value
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
    @close="onClose"
    @open="emits('open', $event)"
    @update:model-value="emits('update:model-value', $event)"
  >
    <div
      class="m-bottom-sheet-wrapper maz:flex maz:w-full maz:flex-col"
      :style="[{ '--max-width': maxWidth }]"
    >
      <div
        ref="sheetEl"
        class="m-bottom-sheet maz:relative maz:flex maz:w-full maz:flex-col maz:rounded-t-md maz:border-x maz:border-t maz:border-divider maz:bg-container maz:text-foreground maz:shadow-elevation maz:drop-shadow-md"
        :class="{ '--dragging': isDragging }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="backdropProps.ariaLabelledby ?? (hasTitle ? titleId : undefined)"
        :aria-describedby="backdropProps.ariaDescribedby ?? descriptionId"
        :style="sheetStyle"
        v-bind="wrapperAttrs"
      >
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
        <div
          v-if="swipeToClose"
          class="m-bottom-sheet__handle-zone maz:flex maz:shrink-0 maz:cursor-grab maz:touch-none maz:justify-center maz:pt-2 maz:pb-1"
          :class="{ 'maz:focus-ring': hasSnapHandle }"
          :role="hasSnapHandle ? 'button' : undefined"
          :tabindex="hasSnapHandle ? 0 : undefined"
          :aria-label="hasSnapHandle ? t('aria.resizeSheet') : undefined"
          @click="hasSnapHandle && onHandleClick()"
          @keydown="hasSnapHandle && onHandleKeydown($event)"
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
            :class="[hasTitle || hasIcon ? 'maz:justify-between' : 'maz:justify-end', { 'maz:touch-none': swipeToClose }]"
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
                :id="titleId"
                class="m-bottom-sheet__title maz:my-0 maz:truncate maz:text-title-3"
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
                variant="outline"
                :icon="MazXMark"
                :aria-label="t('aria.close')"
                @click="close"
              />
            </div>
          </div>
        </slot>

        <div
          :id="descriptionId"
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
  transition: transform calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-spring, ease-out);

  /* Background of the sheet below its edge, visible when it stretches beyond the top while dragged */
  &::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    inset-block-start: 100%;
    block-size: 4rem;
    background: inherit;
  }
}

.m-bottom-sheet.--dragging {
  transition: none;
  user-select: none;
  will-change: transform;
}
</style>
