<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'

export type MazPageSectionTag = 'div' | 'section' | 'header' | 'main' | 'footer' | 'article' | 'aside' | 'nav' | (string & {})

export interface MazPageSectionProps {
  /**
   * HTML tag of the section
   * @default 'div'
   */
  as?: MazPageSectionTag
  /**
   * Side padding that grows with the screen; `false` removes it, the content keeps the width of the column
   * @default true
   */
  gutter?: boolean
  /**
   * Content edge to edge at every screen width: no side padding, no maximum width (`gutter` and `maxWidth` are ignored)
   * @default false
   */
  fullBleed?: boolean
  /**
   * Width of the column (a number is in pixels), `--maz-container-max-width` (`1440px`) by default
   * @default undefined
   */
  maxWidth?: string | number
  /**
   * Make the section a container (`@container`) for the `@tab-m:` classes of its content; its own padding does not change
   * @default false
   */
  container?: boolean
}

defineProps<MazPageSectionProps>()

const { as, gutter, fullBleed, maxWidth, container } = useGlobalConfig<{
  as: MazPageSectionTag
  gutter: boolean
  fullBleed: boolean
  maxWidth: string | number | undefined
  container: boolean
}>('MazPageSection', {
  as: 'div',
  gutter: true,
  fullBleed: false,
  maxWidth: undefined,
  container: false,
})

const layoutClass = computed(() => {
  if (fullBleed.value)
    return 'maz:w-full'

  return gutter.value ? 'maz:padded-container' : 'maz:padded-container-no-p'
})

const style = computed<StyleValue>(() => {
  if (fullBleed.value || maxWidth.value === undefined)
    return undefined

  return {
    '--maz-container-max-width': typeof maxWidth.value === 'number'
      ? `${maxWidth.value}px`
      : maxWidth.value,
  }
})
</script>

<template>
  <component
    :is="as"
    class="m-page-section maz:box-border"
    :class="[layoutClass, { 'maz:@container': container }]"
    :style
  >
    <!-- @slot Content of the section -->
    <slot />
  </component>
</template>
