<script lang="ts" setup>
import type { FuzzySearchResult } from '@maz-ui/utils/helpers/fuzzySearch'
import type { CSSProperties } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import { MazMagnifyingGlass } from '@maz-ui/icons/raw/MazMagnifyingGlass'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { highlightMatches } from '@maz-ui/utils/helpers/fuzzySearch'
import { computed, getCurrentInstance, nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useFuzzySearch } from '../composables/useFuzzySearch.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useShortcut } from '../composables/useShortcut.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import { resolveMazIconProps } from '../utils/resolveMazIconProps.ts'
import MazDialog from './MazDialog.vue'
import MazIcon from './MazIcon.vue'

export interface MazCommandPaletteItem {
  /** The id of the item, to find it in the `select` event */
  id?: string
  /** The name of the command, the text that is searched */
  label: string
  /** A line under the label, searched with a lower weight */
  description?: string
  /** Icon at the start of the item: a name, a component or a `MazIconProps` object */
  icon?: MazIconLike
  /** Other words that find the item (`['dark', 'theme']` for "Change the theme") */
  keywords?: string[]
  /** A keyboard shortcut shown at the end of the item, as it is displayed (`⌘D`) */
  shortcut?: string
  /** Called when the item is chosen */
  action?: () => unknown
  /** Route to go to, with the router of the app */
  to?: RouteLocationRaw
  /** URL to go to */
  href?: string
  /** Target of the link (`_blank` opens a new tab) */
  target?: string
  /** The item can not be chosen */
  disabled?: boolean
}

export interface MazCommandPaletteGroup {
  /** The title of the group */
  label?: string
  items: MazCommandPaletteItem[]
}

export interface MazCommandPaletteProps {
  /**
   * The groups of commands
   * @default []
   */
  groups?: MazCommandPaletteGroup[]
  /**
   * Global keyboard shortcut that opens and closes the palette (`mod` is Cmd on macOS and Ctrl elsewhere), `false` for none
   * @default 'mod+k'
   */
  shortcut?: string | false
  /**
   * Placeholder of the search field
   * @default 'Search a command'
   */
  placeholder?: string
  /**
   * Closes the palette when a command is chosen
   * @default true
   */
  closeOnSelect?: boolean
  /**
   * Maximum width of the window
   * @default 40rem
   */
  maxWidth?: string
  /**
   * A highlight slides between the items under the pointer (never with the keyboard)
   * @default true
   */
  animated?: boolean
  /**
   * Id of the palette
   */
  id?: string
}

defineOptions({
  name: 'MazCommandPalette',
})

const {
  groups = [],
  shortcut = 'mod+k',
  placeholder,
  closeOnSelect = true,
  maxWidth = '40rem',
  animated = true,
  id,
} = defineProps<MazCommandPaletteProps>()

const emits = defineEmits<{
  /**
   * Emitted when a command is chosen
   * @property {MazCommandPaletteItem} item the chosen command
   */
  select: [item: MazCommandPaletteItem]
}>()

defineSlots<{
  /**
   * An element that opens the palette: the window grows out of it
   * @binding {() => void} open opens the palette
   */
  trigger?: (props: { open: () => void, close: () => void, isOpen: boolean }) => unknown
  /**
   * Replaces the content of a command
   * @binding {MazCommandPaletteItem} item the command
   * @binding {boolean} is-active `true` when the command is highlighted
   */
  item?: (props: { item: MazCommandPaletteItem, isActive: boolean }) => unknown
  /**
   * Shown when no command matches
   * @binding {string} query the text typed
   */
  empty?: (props: { query: string }) => unknown
}>()

/**
 * Open state of the palette
 * @model open
 */
const isOpen = defineModel<boolean>('open', { default: false })

/**
 * The text typed in the search field
 * @model search
 */
const query = defineModel<string>('search', { default: '' })

const { t } = useTranslations()
const instance = getCurrentInstance()
const instanceId = useInstanceUniqId({ componentName: 'MazCommandPalette', providedId: id })

const inputRef = useTemplateRef<HTMLInputElement>('input')
const listRef = useTemplateRef<HTMLElement>('list')

const activeIndex = ref(0)
const isPointerMode = ref(false)
const activeElement = shallowRef<HTMLElement>()

const listboxId = computed(() => `${instanceId.value}-listbox`)
const titleId = computed(() => `${instanceId.value}-title`)
const optionId = (index: number) => `${instanceId.value}-option-${index}`

const searchLabel = computed(() => t('commandPalette.label'))
const searchPlaceholder = computed(() => placeholder ?? t('commandPalette.placeholder'))
const emptyText = computed(() => t('commandPalette.noResults'))

const entries = computed(() => groups.flatMap(group => group.items))

const { results } = useFuzzySearch(entries, query, {
  keys: [
    'label',
    { key: (item: MazCommandPaletteItem) => item.keywords?.join(' '), name: 'keywords', weight: 0.6 },
    { key: 'description', weight: 0.4 },
  ],
})

const resultByItem = computed(() => new Map<MazCommandPaletteItem, FuzzySearchResult<MazCommandPaletteItem>>(
  results.value.map(result => [result.item, result]),
))

interface VisibleGroup {
  label?: string
  items: { item: MazCommandPaletteItem, index: number }[]
}

const visibleGroups = computed<VisibleGroup[]>(() => {
  const ranking = new Map(results.value.map((result, rank) => [result.item, rank]))
  const hasQuery = !!query.value.trim()
  let index = 0

  return groups
    .map((group) => {
      const items = group.items.filter(item => ranking.has(item))

      if (hasQuery)
        items.sort((first, second) => ranking.get(first)! - ranking.get(second)!)

      return { label: group.label, items }
    })
    .filter(group => group.items.length > 0)
    .map(group => ({
      label: group.label,
      items: group.items.map(item => ({ item, index: index++ })),
    }))
})

const flatItems = computed(() => visibleGroups.value.flatMap(group => group.items.map(entry => entry.item)))

const resultsText = computed(() => {
  const count = flatItems.value.length

  return t('commandPalette.results', { count })
})

function getSegments(item: MazCommandPaletteItem) {
  const match = resultByItem.value.get(item)?.matches.find(candidate => candidate.key === 'label' && candidate.indexes.length > 0)

  return match
    ? highlightMatches(item.label, match.indexes)
    : [{ text: item.label, match: false }]
}

function isEnabled(item: MazCommandPaletteItem | undefined) {
  return !!item && !item.disabled
}

function move(step: 1 | -1) {
  const items = flatItems.value
  const count = items.length

  for (let offset = 1; offset <= count; offset++) {
    const index = (activeIndex.value + step * offset + count) % count

    if (isEnabled(items[index])) {
      activeIndex.value = index
      return
    }
  }
}

function goToEdge(first: boolean) {
  const items = flatItems.value
  const index = first ? items.findIndex(isEnabled) : items.findLastIndex(isEnabled)

  if (index !== -1)
    activeIndex.value = index
}

function close() {
  isOpen.value = false
}

function open() {
  isOpen.value = true
}

function followLink(item: MazCommandPaletteItem) {
  if (item.to !== undefined) {
    const router = instance?.appContext.config.globalProperties.$router as { push: (to: RouteLocationRaw) => unknown } | undefined

    if (router)
      void router.push(item.to)
    else if (typeof item.to === 'string')
      globalThis.location.assign(item.to)
  }
  else if (item.href) {
    if (item.target && item.target !== '_self')
      globalThis.open(item.href, item.target, 'noopener,noreferrer')
    else
      globalThis.location.assign(item.href)
  }
}

async function choose(item: MazCommandPaletteItem | undefined) {
  if (!item || !isEnabled(item))
    return

  emits('select', item)

  if (closeOnSelect) {
    close()
    await nextTick()
  }

  await item.action?.()
  followLink(item)
}

function onKeydown(event: KeyboardEvent) {
  isPointerMode.value = false

  switch (event.key) {
    case 'ArrowDown': {
      event.preventDefault()
      move(1)
      break
    }
    case 'ArrowUp': {
      event.preventDefault()
      move(-1)
      break
    }
    case 'PageDown':
    case 'End': {
      if (event.key === 'PageDown' || event.ctrlKey) {
        event.preventDefault()
        goToEdge(false)
      }
      break
    }
    case 'PageUp':
    case 'Home': {
      if (event.key === 'PageUp' || event.ctrlKey) {
        event.preventDefault()
        goToEdge(true)
      }
      break
    }
    case 'Enter': {
      if (event.isComposing)
        break

      event.preventDefault()
      void choose(flatItems.value[activeIndex.value])
      break
    }
  }
}

function onPointermove(event: PointerEvent, index: number, item: MazCommandPaletteItem) {
  if (event.pointerType === 'touch' || !isEnabled(item))
    return

  isPointerMode.value = true
  activeIndex.value = index
}

useShortcut(() => shortcut || 'mod+k', () => {
  isOpen.value = !isOpen.value
}, { enabled: () => !!shortcut })

watch(query, () => {
  activeIndex.value = Math.max(0, flatItems.value.findIndex(isEnabled))
  listRef.value?.scrollTo?.({ top: 0 })
})

watch(isOpen, (value) => {
  if (!value)
    return

  query.value = ''
  isPointerMode.value = false
  activeIndex.value = Math.max(0, flatItems.value.findIndex(isEnabled))
})

watch([activeIndex, flatItems, isOpen, listRef], async () => {
  await nextTick()
  activeElement.value = listRef.value?.querySelector<HTMLElement>(`[id="${optionId(activeIndex.value)}"]`) ?? undefined

  if (!isPointerMode.value)
    activeElement.value?.scrollIntoView?.({ block: 'nearest' })
}, { flush: 'post' })

const { style: slidingStyle } = useSlidingIndicator({
  container: listRef,
  active: activeElement,
  orientation: 'vertical',
  animated,
})

const highlightStyle = computed<CSSProperties>(() => isPointerMode.value
  ? slidingStyle.value
  : { ...slidingStyle.value, transitionProperty: 'none' })

const activeOptionId = computed(() => flatItems.value.length > 0 ? optionId(activeIndex.value) : undefined)

defineExpose({
  /** Opens the palette */
  open,
  /** Closes the palette */
  close,
  /** Focuses the search field */
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <MazDialog
    v-model="isOpen"
    class="m-command-palette"
    style="margin-block-start: min(12dvh, 6rem)"
    align="start"
    :max-width="`min(${maxWidth}, calc(100dvw - 1rem))`"
    :min-width="`min(${maxWidth}, calc(100dvw - 1rem))`"
    :content-padding="false"
    hide-close-button
    :aria-labelledby="titleId"
  >
    <template v-if="$slots.trigger" #trigger="triggerProps">
      <!-- @slot An element that opens the palette: the window grows out of it -->
      <slot name="trigger" v-bind="triggerProps" />
    </template>

    <template #header>
      <div class="m-command-palette__header maz:flex maz:items-center maz:gap-3 maz:border-b maz:border-divider maz:px-4 maz:focus-within-ring">
        <span :id="titleId" class="maz:sr-only">{{ searchLabel }}</span>
        <MazIcon :icon="MazMagnifyingGlass" class="maz:shrink-0 maz:text-xl maz:text-muted" aria-hidden="true" />
        <input
          ref="input"
          v-model="query"
          type="text"
          role="combobox"
          class="m-command-palette__input maz:min-w-0 maz:flex-1 maz:bg-transparent maz:py-4 maz:text-base maz:text-foreground maz:outline-hidden maz:placeholder:text-muted"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          aria-autocomplete="list"
          aria-expanded="true"
          :aria-controls="flatItems.length > 0 ? listboxId : undefined"
          :aria-activedescendant="activeOptionId"
          :aria-label="searchLabel"
          :placeholder="searchPlaceholder"
          @keydown="onKeydown"
        >
      </div>
    </template>

    <div class="m-command-palette__body">
      <div
        v-if="flatItems.length > 0"
        :id="listboxId"
        ref="list"
        role="listbox"
        :aria-label="searchLabel"
        class="m-command-palette__list maz:relative maz:max-h-[min(24rem,50dvh)] maz:scrollbar-themed maz:overflow-auto maz:p-2"
        @pointerleave="isPointerMode = false"
      >
        <span
          v-if="activeElement"
          aria-hidden="true"
          class="m-command-palette__highlight maz:pointer-events-none maz:absolute maz:inset-s-0 maz:top-0 maz:rounded-md maz:bg-foreground/6"
          :style="highlightStyle"
        />
        <div
          v-for="(group, groupIndex) in visibleGroups"
          :key="groupIndex"
          role="group"
          :aria-labelledby="group.label ? `${instanceId}-group-${groupIndex}` : undefined"
        >
          <div
            v-if="group.label"
            :id="`${instanceId}-group-${groupIndex}`"
            class="m-command-palette__group-label maz:px-3 maz:pt-2 maz:pb-1 maz:text-xs maz:font-medium maz:text-muted"
          >
            {{ group.label }}
          </div>
          <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/click-events-have-key-events -->
          <div
            v-for="{ item, index } in group.items"
            :id="optionId(index)"
            :key="item.id ?? index"
            role="option"
            tabindex="-1"
            :aria-selected="activeIndex === index"
            :aria-disabled="item.disabled || undefined"
            class="m-command-palette__item maz:relative maz:flex maz:cursor-interactive maz:items-center maz:gap-3 maz:rounded-md maz:px-3 maz:py-2"
            :class="{ '--active': activeIndex === index, '--disabled': item.disabled }"
            @mousedown.prevent
            @pointermove="onPointermove($event, index, item)"
            @click="choose(item)"
          >
            <!-- eslint-enable vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/click-events-have-key-events -->
            <!--
              @slot Replaces the content of a command
              @binding {MazCommandPaletteItem} item the command
              @binding {boolean} is-active `true` when the command is highlighted
            -->
            <slot name="item" :item :is-active="activeIndex === index">
              <MazIcon
                v-if="resolveMazIconProps(item.icon, { size: '1.25rem' })"
                v-bind="resolveMazIconProps(item.icon, { size: '1.25rem' })"
                class="maz:shrink-0 maz:text-muted"
              />
              <span class="maz:flex maz:min-w-0 maz:flex-1 maz:flex-col">
                <span class="maz:truncate">
                  <template v-for="(segment, segmentIndex) in getSegments(item)" :key="segmentIndex">
                    <mark v-if="segment.match" class="m-command-palette__mark">{{ segment.text }}</mark>
                    <template v-else>{{ segment.text }}</template>
                  </template>
                </span>
                <span v-if="item.description" class="maz:truncate maz:text-sm maz:text-muted">{{ item.description }}</span>
              </span>
              <kbd v-if="item.shortcut" dir="ltr" class="m-command-palette__kbd">{{ item.shortcut }}</kbd>
            </slot>
          </div>
        </div>
      </div>

      <!-- @slot Shown when no command matches -->
      <slot v-else name="empty" :query>
        <p class="m-command-palette__empty maz:m-0 maz:px-4 maz:py-8 maz:text-center maz:text-muted">
          {{ emptyText }}
        </p>
      </slot>

      <span class="maz:sr-only" role="status" aria-live="polite">{{ resultsText }}</span>
    </div>
  </MazDialog>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-command-palette__header {
  border-start-start-radius: inherit;
  border-start-end-radius: inherit;
  outline-offset: -2px;
  transition: outline-color calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);
}

.m-command-palette__item {
  &.--disabled {
    @apply maz:cursor-not-allowed maz:opacity-50;
  }
}

.m-command-palette__highlight {
  will-change: transform;
}

.m-command-palette__mark {
  @apply maz:bg-transparent maz:font-semibold maz:text-inherit;

  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.m-command-palette__kbd {
  padding-inline: 0.375rem;
  border-radius: 0.25rem;
  background-color: color-mix(in oklab, var(--maz-foreground) 8%, transparent);
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: nowrap;
  opacity: 0.8;
}
</style>
