<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'

export type MazPageSectionTag = 'div' | 'section' | 'header' | 'main' | 'footer' | 'article' | 'aside' | 'nav' | (string & {})

export interface MazPageSectionProps {
  /**
   * HTML tag of the section
   * @default 'div'
   */
  as?: MazPageSectionTag
  /**
   * Center the content on the page column without the minimum side padding, for full-bleed children (carousel, image)
   * @default false
   */
  fullBleed?: boolean
  /**
   * Maximum width of the content column (a number is in pixels), instead of `--maz-container-max-width` (`1440px`)
   * @default undefined
   */
  maxWidth?: string | number
  /**
   * Make the section a container (`@container`): the `padded-container` and the container query variants (`@tab-m:`) of its children follow its width
   * @default false
   */
  container?: boolean
}

defineProps<MazPageSectionProps>()

const { as, fullBleed, maxWidth, container } = useGlobalConfig<{
  as: MazPageSectionTag
  fullBleed: boolean
  maxWidth: string | number | undefined
  container: boolean
}>('MazPageSection', {
  as: 'div',
  fullBleed: false,
  maxWidth: undefined,
  container: false,
})

const style = computed<StyleValue>(() => {
  if (maxWidth.value === undefined)
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
    :class="[fullBleed ? 'maz:padded-container-no-p' : 'maz:padded-container', { 'maz:@container': container }]"
    :style
  >
    <!-- @slot Content of the section -->
    <slot />
  </component>
</template>
