<script lang="ts" setup>
import type { ComponentPublicInstance, StyleValue } from 'vue'
import type { MazBadgeProps } from './MazBadge.vue'
import type { MazTabsProvide } from './MazTabs.vue'
import { sleep } from '@maz-ui/utils/helpers/sleep'
import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from 'vue'

import { useInjectStrict } from '../composables/useInjectStrict'

const {
  items,
  persistent = false,
  queryParam = 'tab',
  autoScroll = true,
  block = false,
  elevation = false,
  bordered = true,
} = defineProps<MazTabsBarProps>()

export interface MazTabsBarProps {
  /**
   * The items to display in the tabs bar
   * @type MazTabsBarItem[]
   */
  items: MazTabsBarItem[]
  /**
   * Will add a query param to the url to keep the selected tab on page refresh
   * @default false
   */
  persistent?: boolean
  /**
   * The name of the query param to add to the url
   * @default tab
   */
  queryParam?: string
  /**
   * Will make the tabs bar full width
   * @default false
   */
  block?: boolean
  /**
   * Will remove the elevation
   * @default false
   */
  elevation?: boolean
  /**
   * Will add a scroll on the tabs bar to show selected element
   * @default true
   */
  autoScroll?: boolean
  /**
   * Will add a border to the tabs bar
   * @default true
   */
  bordered?: boolean
}

export type MazTabsBarItem
  = | {
    /**
     * Label of the tab
     */
    label: string
    /**
     * Will disable the tab
     * @default false
     */
    disabled?: boolean
    /**
     * Badge to display in the tab
     * Inherit all props of MazBadge component
     */
    badge?: MazBadgeProps & {
      /**
       * Content of the badge
       */
      content: string | number | boolean
    }
  }
  | string

const MazBadge = defineAsyncComponent(() => import('./MazBadge.vue'))

const { currentTab, updateCurrentTab } = useInjectStrict<MazTabsProvide>('maz-tabs')

function selectTab(tabIndex: number) {
  updateCurrentTab(tabIndex + 1)
  if (persistent) {
    addOrUpdateQueryParamTab(tabIndex + 1)
  }
}

const tabsBarRef = ref<HTMLDivElement>()
const itemRefs = ref<HTMLButtonElement[]>([])

function isActiveTab(index: number) {
  return currentTab.value === index + 1
}

function addElementToItemRefs({
  mazBtn,
  index,
}: {
  mazBtn?: ComponentPublicInstance<any>
  index: number
}) {
  itemRefs.value[index] = mazBtn && '$el' in mazBtn ? mazBtn.$el : mazBtn
}

const normalizedItems = computed(() =>
  items.map(item => ({
    label: typeof item === 'string' ? item : item.label,
    disabled: typeof item === 'string' ? false : item.disabled ?? false,
    badge: typeof item === 'string' ? undefined : item.badge,
  })),
)

const tabsIndicatorState = ref<StyleValue>()
const tabsBarHasScrollAnimation = ref(false)

async function setIndicatorAndScroll() {
  if (!autoScroll) {
    return
  }

  await sleep(150)

  const tabsBar = tabsBarRef.value
  const activeTab = itemRefs.value[currentTab.value - 1]

  if (!tabsBar || !activeTab) {
    return
  }

  const scrollOffset = 50

  if (
    activeTab.offsetLeft - scrollOffset < tabsBar.scrollLeft
    || activeTab.offsetLeft + activeTab.offsetWidth > tabsBar.scrollLeft + tabsBar.clientWidth
  ) {
    const tabBarPaddingLeft = globalThis.getComputedStyle(tabsBar, 'padding-left').paddingLeft
    const tabsBarPaddingOffset = Number(tabBarPaddingLeft.slice(0, -2))

    tabsBar.scrollTo({
      left: activeTab.offsetLeft - tabsBarPaddingOffset - scrollOffset,
      behavior: tabsBarHasScrollAnimation.value ? 'smooth' : 'instant',
    })
  }

  if (typeof currentTab.value !== 'number') {
    return
  }

  const indicatorWidth = activeTab?.offsetWidth ?? 0
  const indicatorHeight = activeTab?.offsetHeight ?? 0
  const translateXValue = activeTab?.offsetLeft ?? 0

  tabsIndicatorState.value = {
    transform: `translateX(${translateXValue}px)`,
    width: `${indicatorWidth}px`,
    height: `${indicatorHeight}px`,
  }

  tabsBarHasScrollAnimation.value = true
}

function getTabStyle(index: number, disabled: boolean): StyleValue {
  if (disabled) {
    return {}
  }
  return currentTab.value === index + 1
    ? `color: hsl(var(--maz-foreground))`
    : 'color: hsl(var(--maz-muted))'
}

onBeforeMount(() => {
  if (currentTab.value < 1 || currentTab.value > normalizedItems.value.length) {
    console.error(
      `[maz-ui](MazTabsBar) The model-value should be between 1 and ${normalizedItems.value.length}`,
    )
  }
})

onMounted(() => {
  if (persistent || currentTab.value) {
    setIndicatorAndScroll()
  }
})

watch(
  () => [currentTab.value, normalizedItems.value],
  () => {
    setIndicatorAndScroll()
  },
)

function getQueryParamTab() {
  const urlActuelle = new URL(globalThis.location.href)
  return Number(urlActuelle.searchParams.get(queryParam))
}

function addOrUpdateQueryParamTab(tab: number) {
  const urlActuelle = new URL(globalThis.location.href)
  urlActuelle.searchParams.set(queryParam, String(tab))
  globalThis.history.replaceState({}, document.title, urlActuelle.toString())
}

onMounted(() => {
  if (persistent) {
    updateCurrentTab(getQueryParamTab() || currentTab.value || 1)
  }
})
</script>

<template>
  <div
    ref="tabsBarRef"
    class="m-tabs-bar m-reset-css"
    :class="{
      '--block': block,
      '--elevation': elevation,
      '--bordered': bordered,
    }"
  >
    <div
      class="m-tabs-bar__indicator"
      :class="{ '--animated': tabsBarHasScrollAnimation }"
      :style="[tabsIndicatorState]"
    />
    <template v-for="(item, index) in normalizedItems" :key="index">
      <button
        :ref="(mazBtn) => addElementToItemRefs({ mazBtn, index })"
        :class="{ '--active': isActiveTab(index), '--disabled': item.disabled }"
        class="m-tabs-bar__item"
        :disabled="item.disabled"
        :style="getTabStyle(index, item.disabled)"
        @click="item.disabled ? undefined : selectTab(index)"
      >
        <!--
          @slot item - Content of item to display in the tabs bar
            @binding {MazTabsBarItem[]} item - all data of the item
            @binding {boolean} active - `true` if the tab is active
            @binding {number} index - index of the item
        -->
        <slot name="item" :item="item" :active="isActiveTab(index)" :index="index">
          {{ item.label }}

          <MazBadge
            v-if="item.badge"
            v-bind="item.badge"
            :size="item.badge.size ?? '0.7rem'"
            class="m-tabs-bar__item__badge"
          >
            <!--
              @slot badge-content - Content in the badge
                @binding {string | number | boolean} content - content of the badge provided in item
            -->
            <slot name="badge-content" :content="item.badge.content">
              {{ item.badge.content }}
            </slot>
          </MazBadge>
        </slot>
      </button>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.m-tabs-bar {
  @apply maz-relative maz-inline-flex maz-max-w-full maz-gap-1 maz-overflow-x-auto maz-rounded maz-p-2 maz-align-top maz-bg-surface;

  &.--elevation {
    @apply maz-drop-shadow-md maz-shadow-elevation dark:maz-shadow-none;
  }

  &.--block {
    @apply maz-w-full;
  }

  &.--bordered {
    @apply maz-border maz-border-divider;
  }

  &__item {
    @apply maz-relative maz-flex maz-flex-none
        maz-items-center maz-gap-2 maz-rounded maz-px-3
        maz-py-2 maz-text-center maz-font-medium maz-no-underline maz-transition maz-duration-200 maz-ease-in-out;

    &:not(.--disabled) {
      @apply maz-cursor-pointer hover:!maz-text-foreground;
    }

    &.--disabled {
      @apply maz-cursor-not-allowed maz-bg-surface-300 maz-text-gray-400 dark:maz-text-gray-500;
    }
  }

  &__indicator {
    @apply maz-absolute maz-left-0 maz-rounded maz-bg-surface-400 maz-text-center;

    &.--animated {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;
    }
  }
}
</style>
