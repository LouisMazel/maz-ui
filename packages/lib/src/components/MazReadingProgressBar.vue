<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import {
  computed,

  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { throttle } from '../helpers/throttle'

export interface MazReadingProgressBarProps {
  /**
   * Height of the progress bar
   * @default 4px
   */
  height?: string
  /**
   * Color of the progress bar
   * @default primary
   */
  color?: MazColor
  /**
   * Selector of the element to teleport the progress bar
   * @default body
   */
  teleportSelector?: string
  /**
   * Selector of the element to get the height
   * @default body
   */
  contentSelector?: string
  /**
   * Offset of the progress bar
   * @default 0
   */
  offset?: number
  /**
   * Class of the progress bar
   * @default undefined
   */
  barClass?: HTMLAttributes['class']
  /**
   * Instead of using the height of the content with a selector, you can set a scroll distance
   * @default undefined
   */
  distance?: number
}

const props = withDefaults(defineProps<MazReadingProgressBarProps>(), {
  height: '4px',
  color: 'primary',
  teleportSelector: 'body',
  contentSelector: 'body',
  offset: 0,
  barClass: undefined,
  distance: undefined,
})

const emits = defineEmits<{
  (name: 'begin'): void
  (name: 'complete'): void
}>()

const barColor = computed<string>(() => {
  return `var(--maz-color-${props.color})`
})

const progressBarWidth = ref<string>()
const elementHeight = ref<number>(0)

watch(
  () => props.distance,
  (value) => {
    if (value)
      elementHeight.value = value
  },
  {
    immediate: true,
  },
)

const handleScroll = throttle(() => {
  const scrollPosition = window.scrollY

  if (scrollPosition >= 0 && scrollPosition <= elementHeight.value) {
    const progress = (scrollPosition / elementHeight.value) * 100
    progressBarWidth.value = `${progress}%`
  }
  else if (scrollPosition <= 0) {
    progressBarWidth.value = '0%'
    emits('begin')
  }
  else if (scrollPosition > elementHeight.value) {
    progressBarWidth.value = '100%'
    emits('complete')
  }
  else {
    progressBarWidth.value = '0%'
  }
}, 15)

async function setupScroll() {
  if (elementHeight.value === 0) {
    const element = document.querySelector<HTMLElement>(props.contentSelector)

    if (!element) {
      console.error(`HTML Element with selector "${props.contentSelector}" not found.`)
      return
    }

    await nextTick()

    elementHeight.value
        = element.offsetHeight + element.offsetTop + props.offset - window.innerHeight
  }

  window.addEventListener('scroll', handleScroll, {
    passive: true,
  })
}

onMounted(() => {
  setupScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Teleport :to="teleportSelector">
    <div class="m-reading-progress-bar m-reset-css" v-bind="$attrs">
      <div
        :class="barClass"
        :style="{
          width: progressBarWidth ?? '0px',
          height,
          backgroundColor: barColor,
        }"
      />
    </div>
  </Teleport>
</template>

<style lang="postcss" scoped>
.m-reading-progress-bar {
  @apply maz-fixed maz-top-0 maz-z-default-backdrop maz-w-full;
}
</style>
