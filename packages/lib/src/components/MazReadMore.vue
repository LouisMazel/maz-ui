<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { MazColor } from './types'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onMounted, ref, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
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
   * @default 'primary'
   */
  color?: MazColor
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
} = defineProps<MazReadMoreProps>()

const { t } = useTranslations()

const maxLinesValue = computed(() => maxChars ? undefined : maxLines || 4)

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
const slotTextContent = ref('')

const hasSlot = computed(() => !!slots.default)

const shouldShowButton = ref(false)

const truncateStyle = computed<StyleValue>(() => {
  if (isExpanded.value) {
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
  if (!maxChars || isExpanded.value) {
    return text
  }

  const content = hasSlot.value ? slotTextContent.value : text
  if (content && content.length > maxChars) {
    return `${content.slice(0, maxChars)}...`
  }
  return content
})

const showTruncatedText = computed(() => {
  return maxChars && hasSlot.value && !isExpanded.value && slotTextContent.value.length > maxChars
})

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

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

onMounted(() => {
  nextTick(() => {
    checkIfTruncated()
  })
})
</script>

<template>
  <div
    :id="instanceId"
    class="m-read-more m-reset-css"
  >
    <!-- Hidden element to measure slot content -->
    <div
      v-if="hasSlot && maxChars"
      ref="hiddenSlotRef"
      class="m-read-more__hidden"
      aria-hidden="true"
    >
      <slot />
    </div>

    <div
      :id="contentId"
      ref="contentRef"
      class="m-read-more__content"
      :class="{
        'm-read-more__content--truncated': !isExpanded,
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
.m-read-more {
  @apply maz-w-full maz-flex maz-flex-col maz-gap-1;

  &__hidden {
    @apply maz-absolute maz-overflow-hidden;

    width: 1px;
    height: 1px;
    clip-path: inset(50%);
  }

  &__content--truncated {
    @apply maz-relative;
  }
}
</style>
