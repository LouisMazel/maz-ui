<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazListSize } from './MazList.vue'
import { MazChevronRight } from '@maz-ui/icons/lazy/MazChevronRight'
import { computed, defineAsyncComponent, inject, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { hasSlotContent } from '../utils/hasSlotContent'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'
import { mazListKey } from './MazList.vue'

export interface MazListItemProps {
  /**
   * Title of the row (use the `title` slot for rich content)
   */
  title?: string
  /**
   * Secondary line under the title (use the `subtitle` slot for rich content)
   */
  subtitle?: string
  /**
   * Render the row as a button and emit `click`
   * @default false
   */
  clickable?: boolean
  /**
   * Route of the row (router-link or nuxt-link): the row navigates
   */
  to?: string | Record<string, unknown>
  /**
   * URL of the row: the row is a link
   */
  href?: string
  /**
   * Target of the link (with `href`)
   */
  target?: string
  /**
   * The row can be expanded to show the default slot, with a disclosure chevron.
   * Bind `v-model:open` to control it
   * @default false
   */
  collapsible?: boolean
  /**
   * Whether the collapsible row is expanded
   * @default false
   */
  open?: boolean
  /**
   * Position of the disclosure chevron of a collapsible row
   * @values `'start' | 'end'`
   * @default 'start'
   */
  chevronPosition?: 'start' | 'end'
  /**
   * Highlight the row: selected item, or the item linked to what is hovered elsewhere
   * @default false
   */
  active?: boolean
  /**
   * Disable the row (clickable and collapsible rows only)
   * @default false
   */
  disabled?: boolean
  /**
   * Density of the row; inherited from the parent `MazList` when omitted
   * @values `'sm' | 'md' | 'lg'`
   */
  size?: MazListSize
  /**
   * Class of the expanded content of a collapsible row (padding, background...)
   */
  contentClass?: HTMLAttributes['class']
  /**
   * Render the expanded content at the first opening only, then keep it mounted
   * @default false
   */
  lazy?: boolean
  /**
   * Let the title and the subtitle wrap on several lines instead of truncating them (long descriptions, settings)
   * @default false
   */
  wrap?: boolean
}

const {
  title,
  subtitle,
  clickable = false,
  to,
  href,
  target,
  collapsible = false,
  chevronPosition = 'start',
  active = false,
  disabled = false,
  size,
  contentClass,
  lazy = false,
  wrap = false,
} = defineProps<MazListItemProps>()

const emits = defineEmits<{
  /**
   * Emitted when a clickable or collapsible row is clicked
   * @property {MouseEvent} event the click event
   */
  click: [event: MouseEvent]
}>()

defineSlots<{
  /** Leading content: an icon, an avatar, a badge */
  start: () => unknown
  /** Replace the title */
  title: () => unknown
  /** Replace the subtitle */
  subtitle: () => unknown
  /** Trailing content inside the row (counts, badges, a value): part of the clickable area, not interactive */
  end: () => unknown
  /** Interactive trailing content (buttons, switches, menus), outside of the clickable area */
  actions: () => unknown
  /** Expanded content of a collapsible row */
  default: (props: { open: boolean }) => unknown
}>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazExpandAnimation = defineAsyncComponent(() => import('./MazExpandAnimation.vue'))

const slots = useSlots()

const openModel = defineModel<boolean>('open', { default: false })

const list = inject(mazListKey, undefined)
const resolvedSize = computed<MazListSize>(() => size ?? list?.size.value ?? 'md')

const contentId = useInstanceUniqId({ componentName: 'MazListItem' })

const isLink = computed(() => !collapsible && (!!to || !!href))
const isInteractive = computed(() => clickable || collapsible || isLink.value)

const tag = computed(() => {
  if (isLink.value) {
    return to
      ? resolveLinkComponent()
      : 'a'
  }
  return isInteractive.value ? 'button' : 'div'
})

const linkAttrs = computed(() => {
  if (!isLink.value)
    return {}
  return to
    ? { to }
    : {
        href,
        target,
        rel: target === '_blank'
          ? 'noopener noreferrer'
          : undefined,
      }
})

function onClick(event: MouseEvent) {
  if (disabled) {
    event.preventDefault()
    return
  }
  if (collapsible)
    openModel.value = !openModel.value
  emits('click', event)
}

const SIZE_CLASS = {
  sm: 'maz:min-h-9 maz:gap-2.5 maz:px-3 maz:py-1.5',
  md: 'maz:min-h-11 maz:gap-3 maz:px-3 maz:py-2',
  lg: 'maz:min-h-14 maz:gap-3 maz:px-4 maz:py-2.5',
} as const satisfies Record<MazListSize, string>

const hasText = computed(() => !!title || !!subtitle || hasSlotContent(slots.title) || hasSlotContent(slots.subtitle))
</script>

<template>
  <div
    class="m-list-item m-reset-css maz:flex maz:flex-col"
    :class="{
      '--active': active,
      '--open': collapsible && openModel,
      '--disabled': disabled,
    }"
    role="listitem"
  >
    <div class="m-list-item__row maz:flex maz:items-center" :class="{ 'maz:bg-foreground/3': active || (collapsible && openModel) }">
      <component
        :is="tag"
        v-bind="linkAttrs"
        class="m-list-item__main maz:flex maz:min-w-0 maz:flex-1 maz:items-center maz:text-start maz:text-foreground"
        :class="[
          SIZE_CLASS[resolvedSize],
          isInteractive && 'maz:cursor-interactive maz:border-none maz:bg-transparent maz:no-underline maz:transition-colors maz:duration-150 maz:outline-none maz:hover:bg-foreground/3 maz:focus-visible:bg-foreground/5',
          disabled && 'maz:disabled-state',
          hasSlotContent($slots.actions) && 'maz:pe-2',
        ]"
        :type="tag === 'button' ? 'button' : undefined"
        :disabled="tag === 'button' && disabled ? true : undefined"
        :aria-disabled="isLink && disabled ? true : undefined"
        :aria-expanded="collapsible ? openModel : undefined"
        :aria-controls="collapsible ? contentId : undefined"
        @click="isInteractive && onClick($event)"
      >
        <MazIcon
          v-if="collapsible && chevronPosition === 'start'"
          :icon="MazChevronRight"
          class="m-list-item__chevron maz:size-3.5 maz:flex-none maz:text-muted maz:transition-transform maz:duration-200 maz:motion-reduce:transition-none"
          :class="{ 'maz:rotate-90': openModel }"
          aria-hidden="true"
        />

        <span v-if="hasSlotContent($slots.start)" class="m-list-item__start maz:flex maz:flex-none maz:items-center">
          <!-- @slot start - Leading content: an icon, an avatar, a badge -->
          <slot name="start" />
        </span>

        <span v-if="hasText" class="m-list-item__text maz:flex maz:min-w-0 maz:flex-1 maz:flex-col">
          <span class="m-list-item__title maz:type-label" :class="!wrap && 'maz:truncate'">
            <!-- @slot title - Replace the title -->
            <slot name="title">{{ title }}</slot>
          </span>
          <span v-if="subtitle || hasSlotContent($slots.subtitle)" class="m-list-item__subtitle maz:text-caption" :class="!wrap && 'maz:truncate'">
            <!-- @slot subtitle - Replace the subtitle -->
            <slot name="subtitle">{{ subtitle }}</slot>
          </span>
        </span>

        <span v-if="hasSlotContent($slots.end)" class="m-list-item__end maz:flex maz:flex-none maz:items-center maz:gap-1.5 maz:text-body-sm maz:text-muted" :class="{ 'maz:ms-auto': !hasText }">
          <!-- @slot end - Trailing content inside the row (counts, badges, a value): part of the clickable area, not interactive -->
          <slot name="end" />
        </span>

        <MazIcon
          v-if="collapsible && chevronPosition === 'end'"
          :icon="MazChevronRight"
          class="m-list-item__chevron maz:size-3.5 maz:flex-none maz:text-muted maz:transition-transform maz:duration-200 maz:motion-reduce:transition-none"
          :class="{ 'maz:rotate-90': openModel }"
          aria-hidden="true"
        />
      </component>

      <div v-if="hasSlotContent($slots.actions)" class="m-list-item__actions maz:flex maz:flex-none maz:items-center maz:gap-2 maz:pe-3">
        <!-- @slot actions - Interactive trailing content (buttons, switches, menus), outside of the clickable area -->
        <slot name="actions" />
      </div>
    </div>

    <MazExpandAnimation v-if="collapsible" :id="contentId" v-model="openModel" duration="200ms" :lazy>
      <div class="m-list-item__content maz:bg-foreground/3" :class="contentClass ?? 'maz:px-3 maz:pt-1 maz:pb-3'">
        <!-- @slot default - Expanded content of a collapsible row -->
        <slot :open="openModel" />
      </div>
    </MazExpandAnimation>
  </div>
</template>
