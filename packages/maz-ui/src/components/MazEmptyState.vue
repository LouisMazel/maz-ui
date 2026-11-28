<script lang="ts" setup generic="_T">
import type { MazIconValue } from './MazIcon.vue'
import type { MazColor, MazColorOrFree, MazSize } from './types.ts'
import { MazInbox } from '@maz-ui/icons/lazy/MazInbox'
import { MazMagnifyingGlass } from '@maz-ui/icons/lazy/MazMagnifyingGlass'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, ref, useSlots } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { resolveColor } from '../utils/freeColor.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import MazIcon from './MazIcon.vue'

export interface MazEmptyStateProps {
  /**
   * `default`: nothing to show yet (an empty list, a new project). `search`: a search without result, with the query shown
   * @values `'default' | 'search'`
   * @default 'default'
   */
  variant?: 'default' | 'search'
  /**
   * The headline. In the `search` variant, it falls back to "No results"
   */
  title?: string
  /**
   * The sentence under the title, the next step to take
   */
  description?: string
  /**
   * The search that found nothing, quoted in the `search` variant
   */
  query?: string
  /**
   * The icon of the illustration (name, component or URL, see `MazIcon`). Falls back to an inbox, or a magnifier in the `search` variant
   */
  icon?: MazIconValue
  /**
   * Size of the texts and of the illustration
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default 'md'
   */
  size?: MazSize
  /**
   * Color of the illustration: a theme color or a free CSS color
   * @default 'primary'
   */
  color?: MazColorOrFree<Exclude<MazColor, 'transparent'>>
  /**
   * The illustration moves a little toward the pointer. Only with a mouse (not on touch screens), and off with the reduced motion
   * @default true
   */
  animated?: boolean
}

const {
  variant = 'default',
  title = undefined,
  description = undefined,
  query = undefined,
  icon = undefined,
  size = 'md',
  color = 'primary',
  animated = true,
} = defineProps<MazEmptyStateProps>()

defineSlots<{
  /**
   * Replaces the illustration (an SVG, an image, a MazIcon...)
   */
  illustration?: () => unknown
  /**
   * Replaces the title
   */
  title?: () => unknown
  /**
   * Replaces the description
   */
  description?: () => unknown
  /**
   * The actions, the primary one first (buttons)
   */
  actions?: () => unknown
  /**
   * Extra content under the description
   */
  default?: () => unknown
}>()

const { t } = useTranslations()

const MAX_SHIFT = 8

const slots = useSlots()
const { shouldReduceMotion } = useReducedMotion()
const { matches: hasHover } = useMediaQuery('(hover: hover) and (pointer: fine)')

const illustrationRef = ref<HTMLElement>()
const shift = ref({ x: 0, y: 0 })

const isSearch = computed(() => variant === 'search')
const canFollow = computed(() => animated && hasHover.value && !shouldReduceMotion.value)

const resolvedTitle = computed(() => title ?? (isSearch.value ? t('emptyState.noResults') : undefined))
const resolvedIcon = computed<MazIconValue>(() => icon ?? (isSearch.value ? MazMagnifyingGlass : MazInbox))
const hasTitle = computed(() => !!resolvedTitle.value || hasSlotContent(slots.title))
const hasDescription = computed(() => !!description || hasSlotContent(slots.description))
const hasActions = computed(() => hasSlotContent(slots.actions))

const queryText = computed(() => query
  ? t('emptyState.noResultsFor', { query })
  : undefined)

const accent = computed(() => resolveColor(color === 'neutral' ? 'neutral-foreground' : color))

const illustrationStyle = computed(() => ({
  '--m-empty-state-x': `${shift.value.x}px`,
  '--m-empty-state-y': `${shift.value.y}px`,
}))

function onPointerMove(event: PointerEvent) {
  if (!canFollow.value || !illustrationRef.value || event.pointerType === 'touch')
    return

  const rect = illustrationRef.value.getBoundingClientRect()
  const dx = event.clientX - (rect.left + rect.width / 2)
  const dy = event.clientY - (rect.top + rect.height / 2)
  const distance = Math.hypot(dx, dy) || 1
  const strength = Math.min(distance / 160, 1) * MAX_SHIFT

  shift.value = { x: Math.round((dx / distance) * strength * 10) / 10, y: Math.round((dy / distance) * strength * 10) / 10 }
}

function onPointerLeave() {
  shift.value = { x: 0, y: 0 }
}
</script>

<template>
  <div
    class="m-empty-state m-reset-css maz:flex maz:flex-col maz:items-center maz:text-center"
    :class="[`m-empty-state--${size}`, `m-empty-state--${variant}`]"
    :role="isSearch ? 'status' : undefined"
    :style="{ '--m-empty-state-color': accent }"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <div
      ref="illustrationRef"
      class="m-empty-state__illustration"
      :class="{ 'm-empty-state__illustration--follow': canFollow }"
      :style="illustrationStyle"
    >
      <!-- @slot illustration - Replaces the illustration -->
      <slot name="illustration">
        <span class="m-empty-state__badge maz:flex-center" aria-hidden="true">
          <MazIcon :icon="resolvedIcon" class="m-empty-state__icon" />
        </span>
      </slot>
    </div>

    <h3 v-if="hasTitle" class="m-empty-state__title maz:font-semibold maz:text-foreground">
      <!-- @slot title - Replaces the title -->
      <slot name="title">
        {{ resolvedTitle }}
      </slot>
    </h3>

    <p v-if="isSearch && queryText" dir="auto" class="m-empty-state__query maz:wrap-break-word maz:text-muted">
      {{ queryText }}
    </p>

    <p v-if="hasDescription" class="m-empty-state__description maz:text-muted">
      <!-- @slot description - Replaces the description -->
      <slot name="description">
        {{ description }}
      </slot>
    </p>

    <!-- @slot default - Extra content under the description -->
    <slot />

    <div v-if="hasActions" class="m-empty-state__actions maz:flex maz:flex-wrap maz:flex-center maz:gap-2">
      <!-- @slot actions - The actions, the primary one first -->
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.m-empty-state {
  --m-empty-state-badge: 4rem;
  --m-empty-state-gap: 0.5rem;

  gap: var(--m-empty-state-gap);
  padding-block: 1.5rem;
  padding-inline: 1rem;
}

.m-empty-state--mini,
.m-empty-state--xs {
  --m-empty-state-badge: 2.5rem;

  font-size: 0.75rem;
}

.m-empty-state--sm {
  --m-empty-state-badge: 3rem;

  font-size: 0.875rem;
}

.m-empty-state--md {
  font-size: 1rem;
}

.m-empty-state--lg {
  --m-empty-state-badge: 5rem;

  font-size: 1.125rem;
}

.m-empty-state--xl {
  --m-empty-state-badge: 6rem;

  font-size: 1.25rem;
}

.m-empty-state__illustration {
  margin-block-end: 0.5rem;
}

.m-empty-state__illustration--follow {
  translate: var(--m-empty-state-x, 0) var(--m-empty-state-y, 0);
  transition: translate calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);
}

.m-empty-state__badge {
  inline-size: var(--m-empty-state-badge);
  block-size: var(--m-empty-state-badge);
  border-radius: 9999px;
  color: var(--m-empty-state-color);
  background: color-mix(in srgb, var(--m-empty-state-color) 12%, transparent);
  box-shadow: 0 0 0 calc(var(--m-empty-state-badge) * 0.14)
    color-mix(in srgb, var(--m-empty-state-color) 6%, transparent);
}

.m-empty-state__icon {
  font-size: calc(var(--m-empty-state-badge) * 0.5);
}

.m-empty-state__title {
  font-size: 1.125em;
  line-height: 1.3;
}

.m-empty-state__description,
.m-empty-state__query {
  max-inline-size: 28em;
}

.m-empty-state__actions {
  margin-block-start: 0.75rem;
}
</style>
