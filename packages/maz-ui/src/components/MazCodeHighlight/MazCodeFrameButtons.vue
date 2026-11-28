<script lang="ts" setup>
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { MazClipboard } from '@maz-ui/icons/lazy/MazClipboard'
import { defineAsyncComponent } from 'vue'
import { vTooltip } from '../../directives/vTooltip.ts'

export interface MazCodeFrameButtonsProps {
  /** Shows the copy button */
  copyable: boolean
  copied: boolean
  copyLabel: string
  copiedLabel: string
  scrollToBottomLabel: string
  /** Scrollable element of the block, target of the scroll-to-bottom button (shown once it exists) */
  target?: HTMLElement
  /** The last line is out of view: the scroll-to-bottom button shows */
  awayFromBottom: boolean
  /** BEM block of the frame: the buttons are `<prefix>__copy-btn` and `<prefix>__bottom-btn` */
  prefix: string
}

defineProps<MazCodeFrameButtonsProps>()

const emit = defineEmits<{
  'copy': []
  'scroll-to-bottom': []
}>()

const MazBtn = defineAsyncComponent(() => import('../MazBtn.vue'))
const MazBtnScroll = defineAsyncComponent(() => import('../MazBtnScroll.vue'))

function onScrollToBottomClick(event: MouseEvent) {
  event.preventDefault()
  emit('scroll-to-bottom')
}
</script>

<template>
  <MazBtn
    v-if="copyable"
    v-tooltip="{
      text: copied ? copiedLabel : copyLabel,
      color: 'surface',
      position: 'left',
    }"
    size="xs"
    color="surface"
    :class="`${prefix}__copy-btn`"
    class="maz:absolute maz:top-2 maz:right-3 maz:border! maz:border-divider! maz:opacity-0 maz:shadow-elevation maz:transition-opacity maz:group-hover:opacity-100 maz:focus-visible:opacity-100"
    :aria-label="copied ? copiedLabel : copyLabel"
    :icon="copied ? MazCheck : MazClipboard"
    @click="emit('copy')"
  />
  <MazBtnScroll
    v-if="target"
    v-tooltip="{
      text: scrollToBottomLabel,
      color: 'surface',
      position: 'left',
    }"
    to="bottom"
    :target="target"
    :visible="awayFromBottom"
    size="xs"
    color="surface"
    :progress="false"
    bordered
    offset="0.75rem"
    :label="scrollToBottomLabel"
    :class="`${prefix}__bottom-btn`"
    @click="onScrollToBottomClick"
  />
</template>
