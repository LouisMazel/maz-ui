<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue'

export type MazListSize = 'sm' | 'md' | 'lg'

export interface MazListContext {
  size: ComputedRef<MazListSize>
}

export const mazListKey: InjectionKey<MazListContext> = Symbol('MazList')

export interface MazListProps {
  /**
   * Title displayed above the block (use the `header` slot for rich content)
   */
  title?: string
  /**
   * Text displayed under the block: a hint, a summary (use the `footer` slot for rich content)
   */
  footer?: string
  /**
   * Draw a hairline separator between the items
   * @default true
   */
  divider?: boolean
  /**
   * Draw the rounded block (background, hairline edge). Set it to `false` to
   * render the items inline, in a container that already has a background
   * @default true
   */
  bordered?: boolean
  /**
   * Density of the items: height and padding of their row
   * @values `'sm' | 'md' | 'lg'`
   * @default 'md'
   */
  size?: MazListSize
  /**
   * Size of the rounded of the block
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default 'lg'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Scroll the items inside the block, the header and the footer staying in
   * place. The list needs a bounded height: a `max-h-*` class, or a flex
   * parent where it can shrink (`min-h-0`)
   * @default false
   */
  scrollable?: boolean
  /**
   * Accessible name of the list when it has no title
   */
  ariaLabel?: string
}
</script>

<script lang="ts" setup>
import { computed, provide, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { hasSlotContent } from '../utils/hasSlotContent'

const {
  title,
  footer,
  divider = true,
  bordered = true,
  size = 'md',
  roundedSize = 'lg',
  scrollable = false,
  ariaLabel,
} = defineProps<MazListProps>()

defineSlots<{
  /** The items of the list (`MazListItem`) */
  'default': () => unknown
  /** Replace the title above the block */
  'header': () => unknown
  /** Content at the end of the title row: a link, a count, an action */
  'header-end': () => unknown
  /** Replace the text under the block */
  'footer': () => unknown
}>()

const slots = useSlots()

const titleId = useInstanceUniqId({ componentName: 'MazList' })

const hasHeader = computed(() => !!title || hasSlotContent(slots.header) || hasSlotContent(slots['header-end']))
const hasFooter = computed(() => !!footer || hasSlotContent(slots.footer))

provide(mazListKey, {
  size: computed(() => size),
})

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-sm',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
} as const
</script>

<template>
  <div class="m-list m-reset-css maz:flex maz:flex-col maz:gap-1.5" :class="{ 'maz:min-h-0': scrollable }">
    <div
      v-if="hasHeader"
      class="m-list__header maz:flex maz:min-h-6 maz:items-end maz:justify-between maz:gap-3 maz:px-1"
    >
      <div :id="titleId" class="m-list__title maz:min-w-0 maz:truncate maz:text-label maz:text-foreground">
        <!-- @slot header - Replace the title above the block -->
        <slot name="header">
          {{ title }}
        </slot>
      </div>
      <div v-if="hasSlotContent($slots['header-end'])" class="m-list__header-end maz:flex maz:flex-none maz:items-center maz:gap-2 maz:text-caption">
        <!-- @slot header-end - Content at the end of the title row: a link, a count, an action -->
        <slot name="header-end" />
      </div>
    </div>

    <div
      class="m-list__items maz:flex maz:flex-col"
      :class="[
        bordered && ['--bordered maz:bg-container', ROUNDED_CLASS[roundedSize]],
        scrollable
          ? 'maz:min-h-0 maz:scrollbar-themed maz:overflow-x-hidden maz:overflow-y-auto maz:overscroll-contain'
          : bordered && 'maz:overflow-hidden',
        { '--divider': divider },
      ]"
      role="list"
      :aria-labelledby="hasHeader ? titleId : undefined"
      :aria-label="hasHeader ? undefined : ariaLabel"
    >
      <!-- @slot default - The items of the list (`MazListItem`) -->
      <slot />
    </div>

    <div v-if="hasFooter" class="m-list__footer maz:px-1 maz:text-caption">
      <!-- @slot footer - Replace the text under the block -->
      <slot name="footer">
        {{ footer }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
.m-list__items {
  /* One device pixel on high density screens, like the native separators. */
  --m-list-hairline: 1px;

  @media (resolution >= 2dppx) {
    --m-list-hairline: 0.5px;
  }

  &.--bordered {
    box-shadow: inset 0 0 0 var(--m-list-hairline) var(--maz-divider);
  }

  &.--divider > :deep(.m-list-item + .m-list-item) {
    border-block-start: var(--m-list-hairline) solid var(--maz-divider);
  }
}
</style>
