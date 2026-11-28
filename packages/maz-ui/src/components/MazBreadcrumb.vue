<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { MazSize } from './types.ts'
import { MazChevronRight } from '@maz-ui/icons/raw/MazChevronRight'
import { MazEllipsisHorizontal } from '@maz-ui/icons/raw/MazEllipsisHorizontal'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useResizeObserver } from '../composables/useResizeObserver.ts'
import MazBtn from './MazBtn.vue'
import MazIcon from './MazIcon.vue'
import MazLink from './MazLink.vue'

export interface MazBreadcrumbItem {
  /**
   * Text of the crumb
   */
  label: string
  /**
   * Route of the crumb (vue-router or Nuxt)
   */
  to?: RouteLocationRaw
  /**
   * URL of the crumb, for a plain link
   */
  href?: string
  /**
   * Icon shown before the label
   */
  icon?: MazIconLike
}

export interface MazBreadcrumbProps {
  /**
   * The crumbs, from the root to the current page. The last one is the current page (`aria-current="page"`)
   */
  items: MazBreadcrumbItem[]
  /**
   * Size of the text
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default 'md'
   */
  size?: MazSize
  /**
   * Accessible name of the navigation landmark
   * @default 'Breadcrumb'
   */
  label?: string
}

const { items, size = 'md', label } = defineProps<MazBreadcrumbProps>()

defineSlots<{
  /**
   * Replaces the separator between two crumbs (a chevron by default)
   */
  separator?: () => any
  /**
   * Replaces the content of a crumb
   * @binding {MazBreadcrumbItem} item - The crumb
   * @binding {number} index - Index of the crumb
   * @binding {boolean} current - `true` for the last crumb
   */
  item?: (props: { item: MazBreadcrumbItem, index: number, current: boolean }) => any
}>()

const { t } = useTranslations()

const SIZE_CLASS: Record<MazSize, string> = {
  mini: 'maz:text-xs',
  xs: 'maz:text-xs',
  sm: 'maz:text-caption',
  md: 'maz:text-body-sm',
  lg: 'maz:text-body',
  xl: 'maz:text-body-lg',
}

const navRef = useTemplateRef<HTMLElement>('nav')
const itemRefs = ref<HTMLElement[]>([])
const ellipsis: { element?: HTMLElement } = {}

const hiddenCount = ref(0)
const isExpanded = ref(false)
const isUnfolding = ref(false)

const lastIndex = computed(() => items.length - 1)

function isHidden(index: number) {
  return !isExpanded.value && index >= 1 && index <= hiddenCount.value && index < lastIndex.value
}

function computeHiddenCount() {
  const nav = navRef.value
  const elements = itemRefs.value

  if (isExpanded.value)
    return

  if (!nav || elements.length !== items.length || items.length < 3) {
    hiddenCount.value = 0
    return
  }

  const widths = elements.map(element => element.offsetWidth)
  const ellipsisWidth = ellipsis.element?.offsetWidth ?? 0
  const available = nav.clientWidth
  const sum = (from: number) => widths.slice(from).reduce((total, width) => total + width, 0)

  if (sum(0) <= available) {
    hiddenCount.value = 0
    return
  }

  const maxHidden = items.length - 2
  let count = maxHidden

  for (let hidden = 1; hidden <= maxHidden; hidden++) {
    if (widths[0]! + ellipsisWidth + sum(hidden + 1) <= available) {
      count = hidden
      break
    }
  }

  hiddenCount.value = count
}

async function expand() {
  isUnfolding.value = true
  isExpanded.value = true

  await nextTick()
  itemRefs.value[1]?.querySelector<HTMLElement>('a, button')?.focus()
}

useResizeObserver(navRef, computeHiddenCount)

watch(() => items, async () => {
  isExpanded.value = false
  isUnfolding.value = false
  await nextTick()
  computeHiddenCount()
}, { deep: true })

onMounted(() => {
  computeHiddenCount()

  if ('fonts' in document)
    document.fonts.ready.then(computeHiddenCount)
})

function setItemRef(element: unknown, index: number) {
  if (element)
    itemRefs.value[index] = element as HTMLElement
}

function isLink(item: MazBreadcrumbItem, index: number) {
  return index !== lastIndex.value && !!(item.to || item.href)
}
</script>

<template>
  <nav
    ref="nav"
    class="m-breadcrumb m-reset-css maz:max-w-full"
    :class="[SIZE_CLASS[size], isExpanded ? 'maz:overflow-visible' : 'maz:overflow-hidden']"
    :aria-label="label ?? t('breadcrumb.label')"
  >
    <ol class="maz:m-0 maz:flex maz:list-none maz:items-center maz:p-0" :class="isExpanded ? 'maz:flex-wrap' : 'maz:flex-nowrap'">
      <template v-for="(item, index) in items" :key="index">
        <li
          v-if="index === 1 && items.length >= 3 && !isExpanded"
          :ref="(element) => (ellipsis.element = element as HTMLElement)"
          class="m-breadcrumb__item maz:flex maz:shrink-0 maz:items-center"
          :class="{ 'maz:invisible maz:absolute': hiddenCount === 0 }"
        >
          <MazBtn
            size="mini"
            variant="ghost"
            color="contrast"
            fab
            :aria-label="t('breadcrumb.showHidden')"
            @click="expand"
          >
            <MazIcon :icon="MazEllipsisHorizontal" class="maz:size-4" />
          </MazBtn>
          <span class="m-breadcrumb__separator maz:px-1.5 maz:text-muted maz:rtl:rotate-180" aria-hidden="true">
            <slot name="separator">
              <MazIcon :icon="MazChevronRight" class="maz:size-4" />
            </slot>
          </span>
        </li>
        <li
          :ref="element => setItemRef(element, index)"
          class="m-breadcrumb__item maz:flex maz:shrink-0 maz:items-center maz:whitespace-nowrap"
          :class="{
            'maz:invisible maz:absolute': isHidden(index),
            '--unfold': isUnfolding && index >= 1 && index <= hiddenCount,
          }"
          :style="{ '--m-breadcrumb-index': index }"
        >
          <!--
            @slot item - Replaces the content of a crumb
              @binding {MazBreadcrumbItem} item - The crumb
              @binding {number} index - Index of the crumb
              @binding {boolean} current - `true` for the last crumb
          -->
          <slot name="item" :item="item" :index="index" :current="index === lastIndex">
            <MazLink
              v-if="isLink(item, index)"
              :to="item.to"
              :href="item.href"
              :start-icon="item.icon"
              color="muted"
              underline-hover
              class="maz:rounded-sm maz:focus-ring"
            >
              {{ item.label }}
            </MazLink>
            <span
              v-else
              class="maz:inline-flex maz:items-center maz:gap-1"
              :class="index === lastIndex ? 'maz:font-medium maz:text-foreground' : 'maz:text-muted'"
              :aria-current="index === lastIndex ? 'page' : undefined"
            >
              <MazIcon v-if="item.icon" :icon="item.icon" class="maz:size-4" />
              {{ item.label }}
            </span>
          </slot>
          <span v-if="index < lastIndex" class="m-breadcrumb__separator maz:px-1.5 maz:text-muted maz:rtl:rotate-180" aria-hidden="true">
            <slot name="separator">
              <MazIcon :icon="MazChevronRight" class="maz:size-4" />
            </slot>
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-breadcrumb__item.--unfold {
  animation: m-breadcrumb-unfold calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out) both;
  animation-delay: calc(var(--m-breadcrumb-index) * 40ms * var(--maz-motion-scale, 1));
}

@keyframes m-breadcrumb-unfold {
  from {
    opacity: 0;
    transform: translateX(-0.5rem);
  }
}

[dir='rtl'] .m-breadcrumb__item.--unfold {
  animation-name: m-breadcrumb-unfold-rtl;
}

@keyframes m-breadcrumb-unfold-rtl {
  from {
    opacity: 0;
    transform: translateX(0.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .m-breadcrumb__item.--unfold {
    animation: none;
  }
}
</style>
