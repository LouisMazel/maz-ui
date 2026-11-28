<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { MazLinkProps } from './MazLink.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useMutationObserver } from '../composables/useMutationObserver.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { useResizeObserver } from '../composables/useResizeObserver.ts'
import { readMotionDuration } from '../utils/motionTokens.ts'
import MazLink from './MazLink.vue'

export interface MazReadMoreProps {
  /**
   * The text to be truncated.
   */
  text?: string
  /**
   * The maximum number of lines to be displayed.
   * @default 4
   */
  maxLines?: number
  /**
   * The maximum number of characters to be displayed.
   */
  maxChars?: number
  /**
   * The color of the link (MazLink).
   * @type {MazLinkProps['color']}
   * @default 'primary'
   */
  color?: MazLinkProps['color']
  /**
   * The text of the link when the content is collapsed.
   * @default 'readMore.collapse' (translations)
   */
  collapseText?: string
  /**
   * The text of the link when the content is expanded.
   * @default 'readMore.expand' (translations)
   */
  expandText?: string
  /**
   * Unique identifier for accessibility linking.
   */
  id?: string
  /**
   * Accessibility label for the content region.
   * @default 'readMore.ariaLabel' (translations)
   */
  ariaLabel?: string
  /**
   * The height of the content animates when it expands and collapses
   * @default true
   */
  animated?: boolean
  /**
   * Fade the bottom of the collapsed content
   * @default false
   */
  fade?: boolean
}

const {
  text,
  maxLines = undefined,
  maxChars = undefined,
  color = 'primary',
  collapseText,
  expandText,
  id,
  ariaLabel,
  animated = true,
  fade = false,
} = defineProps<MazReadMoreProps>()

const { t } = useTranslations()

const maxLinesValue = computed(() => maxChars
  ? undefined
  : maxLines || 4)

const instanceId = useInstanceUniqId({ componentName: 'MazReadMore', providedId: id })
const contentId = computed(() => `${instanceId.value}-content`)
const buttonId = computed(() => `${instanceId.value}-button`)

const collapseTextValue = computed(() => collapseText || t('readMore.collapse'))
const expandTextValue = computed(() => expandText || t('readMore.expand'))
const ariaLabelValue = computed(() => ariaLabel || t('readMore.ariaLabel'))

const slots = useSlots()
const contentRef = ref<HTMLElement>()
const hiddenSlotRef = ref<HTMLElement>()
const isExpanded = ref(false)
const isShown = ref(false)
const isAnimating = ref(false)
const isClosing = ref(false)

const { shouldReduceMotion } = useReducedMotion()
const slotTextContent = ref('')

const hasSlot = computed(() => !!slots.default)

const shouldShowButton = ref(false)

const truncateStyle = computed<StyleValue>(() => {
  if (isShown.value) {
    return {}
  }

  if (maxLinesValue.value) {
    return {
      'display': '-webkit-box',
      '-webkit-line-clamp': maxLinesValue.value.toString(),
      '-webkit-box-orient': 'vertical',
      'overflow': 'hidden',
    }
  }

  return {}
})

const displayedText = computed(() => {
  if (!maxChars || isShown.value) {
    return text
  }

  const content = hasSlot.value ? slotTextContent.value : text
  if (content && content.length > maxChars) {
    return `${content.slice(0, maxChars)}...`
  }
  return content
})

const showTruncatedText = computed(() => {
  return maxChars && hasSlot.value && !isShown.value && slotTextContent.value.length > maxChars
})

let cleanupAnimation: (() => void) | undefined
let animationId = 0

function finishAnimation() {
  cleanupAnimation?.()
  cleanupAnimation = undefined

  if (contentRef.value)
    contentRef.value.style.height = ''

  isAnimating.value = false
  isClosing.value = false
}

async function toggleExpanded() {
  const element = contentRef.value
  const target = !isExpanded.value
  const id = ++animationId

  isExpanded.value = target

  if (!animated || shouldReduceMotion.value || !element || typeof element.animate !== 'function') {
    isShown.value = target
    return
  }

  const from = element.getBoundingClientRect().height

  finishAnimation()
  isShown.value = target
  await nextTick()

  const to = element.getBoundingClientRect().height

  if (!target) {
    isShown.value = true
    await nextTick()
  }

  if (id !== animationId)
    return

  if (Math.abs(from - to) < 1) {
    isShown.value = target
    return
  }

  isClosing.value = !target
  isAnimating.value = true
  element.style.height = `${from}px`
  await nextTick()

  if (id !== animationId)
    return

  element.getBoundingClientRect()
  element.style.height = `${to}px`

  const done = () => {
    finishAnimation()
    isShown.value = target
  }
  const onEnd = (event: TransitionEvent) => {
    if (event.target === element && event.propertyName === 'height')
      done()
  }
  const timer = setTimeout(done, readMotionDuration('--maz-motion-slow', 300) + 100)

  element.addEventListener('transitionend', onEnd)
  cleanupAnimation = () => {
    clearTimeout(timer)
    element.removeEventListener('transitionend', onEnd)
  }
}

onBeforeUnmount(() => cleanupAnimation?.())

function checkIfTruncated() {
  if (maxChars && hiddenSlotRef.value) {
    slotTextContent.value = hiddenSlotRef.value.textContent || ''
    shouldShowButton.value = slotTextContent.value.length > maxChars
    return
  }

  if (!contentRef.value)
    return

  const element = contentRef.value

  if (maxLinesValue.value) {
    const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight)
    const maxHeight = lineHeight * maxLinesValue.value
    shouldShowButton.value = element.scrollHeight > maxHeight
    return
  }

  if (maxChars) {
    const textContent = text || ''
    shouldShowButton.value = textContent.length > maxChars
  }
}

const MUTATION_OPTIONS = { childList: true, subtree: true, characterData: true }

useResizeObserver(contentRef, checkIfTruncated)
useMutationObserver(contentRef, checkIfTruncated, MUTATION_OPTIONS)
useMutationObserver(hiddenSlotRef, checkIfTruncated, MUTATION_OPTIONS)

watch(() => [text, maxLines, maxChars], () => nextTick(checkIfTruncated))

onMounted(() => {
  nextTick(() => {
    checkIfTruncated()
  })
})
</script>

<template>
  <div
    :id="instanceId"
    class="m-read-more m-reset-css maz:flex maz:w-full maz:flex-col maz:gap-1"
  >
    <!-- Hidden element to measure slot content -->
    <div
      v-if="hasSlot && maxChars"
      ref="hiddenSlotRef"
      class="m-read-more__hidden maz:absolute maz:overflow-hidden"
      aria-hidden="true"
    >
      <slot />
    </div>

    <div
      :id="contentId"
      ref="contentRef"
      class="m-read-more__content"
      :class="{
        'm-read-more__content--truncated maz:relative': !isShown,
        '--animating': isAnimating,
        '--closing': isClosing,
        '--fadeable': fade && shouldShowButton,
        '--faded': !isExpanded,
      }"
      :style="truncateStyle"
      role="region"
      :aria-label="ariaLabelValue"
      :aria-expanded="shouldShowButton ? isExpanded : undefined"
    >
      <!-- @slot Content to truncate -->
      <template v-if="showTruncatedText">
        {{ displayedText }}
      </template>
      <template v-else-if="hasSlot">
        <slot />
      </template>
      <template v-else>
        {{ displayedText }}
      </template>
    </div>

    <MazLink
      v-if="shouldShowButton"
      :id="buttonId"
      size="sm"
      class="mt-2"
      :color
      underline
      role="button"
      :aria-expanded="isExpanded"
      :aria-controls="contentId"
      @click="toggleExpanded"
    >
      {{ isExpanded ? collapseTextValue : expandTextValue }}
    </MazLink>
  </div>
</template>

<style scoped>
@property --m-read-more-fade {
  syntax: '<length>';
  inherits: false;
  initial-value: 0;
}

.m-read-more__content.--animating {
  overflow: hidden;
  transition-timing-function: var(--maz-easing-in-out);
  transition-duration: calc(var(--maz-motion-slow) * var(--maz-motion-scale));
  /* stylelint-disable-next-line liberty/use-logical-spec */
  transition-property: height;

  &.--closing {
    transition-duration: calc(var(--maz-motion-slow) * var(--maz-motion-scale) * 0.7);
  }
}

.m-read-more__content.--fadeable {
  mask-image: linear-gradient(to bottom, #000 calc(100% - var(--m-read-more-fade)), transparent);
  transition-timing-function: var(--maz-easing-out);
  transition-duration: calc(var(--maz-motion-normal) * var(--maz-motion-scale));
  transition-property: --m-read-more-fade;

  &.--faded {
    --m-read-more-fade: 2.2em;
  }

  &.--animating {
    transition-timing-function: var(--maz-easing-in-out), var(--maz-easing-out);
    transition-duration:
      calc(var(--maz-motion-slow) * var(--maz-motion-scale)), calc(var(--maz-motion-normal) * var(--maz-motion-scale));
    /* stylelint-disable-next-line liberty/use-logical-spec */
    transition-property: height, --m-read-more-fade;

    &.--closing {
      transition-duration:
        calc(var(--maz-motion-slow) * var(--maz-motion-scale) * 0.7),
        calc(var(--maz-motion-normal) * var(--maz-motion-scale));
    }
  }
}

.m-read-more__hidden {
  inline-size: 1px;
  block-size: 1px;
  clip-path: inset(50%);
}
</style>
