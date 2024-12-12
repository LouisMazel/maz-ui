<script lang="ts" setup>
import type { MazBadgeColor, MazBadgeRoundedSize } from '@components/MazBadge.vue'
import type { MazTabsProvide } from '@components/MazTabs.vue'
import { injectStrict } from '@helpers/injectStrict'
import { sleep } from '@helpers/sleep'

import {
  type ComponentPublicInstance,
  computed,
  defineAsyncComponent,
  onBeforeMount,
  onMounted,
  ref,
  type StyleValue,
  watch,
} from 'vue'

const props = withDefaults(defineProps<MazTabsBarProps>(), {
  queryParam: 'tab',
  autoScroll: true,
})

export interface MazTabsBarProps {
  /** The items to display in the tabs bar */
  items: MazTabsBarItem[]
  /** Will add a query param to the url to keep the selected tab on page refresh */
  persistent?: boolean
  /**
   * The name of the query param to add to the url
   * @default tab
   */
  queryParam?: string
  /** Will make the tabs bar full width */
  block?: boolean
  /** Will remove the elevation */
  noElevation?: boolean
  /**
   * Will add a scroll on the tabs bar to show selected element
   * @default true
   */
  autoScroll?: boolean
}

export type MazTabsBarItem =
  | {
    label: string
    disabled?: boolean
    badge?: {
      content: string | number | boolean
      color?: MazBadgeColor
      pastel?: boolean
      outline?: boolean
      size?: string
      roundedSize?: MazBadgeRoundedSize
    }
  }
  | string

const MazBadge = defineAsyncComponent(() => import('@components/MazBadge.vue'))

const { currentTab, updateCurrentTab } = injectStrict<MazTabsProvide>('maz-tabs')

function selectTab(tabIndex: number) {
  updateCurrentTab(tabIndex + 1)
  if (props.persistent) {
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
  props.items.map(item => ({
    label: typeof item === 'string' ? item : item.label,
    disabled: typeof item === 'string' ? false : item.disabled ?? false,
    badge: typeof item === 'string' ? undefined : item.badge,
  })),
)

const tabsIndicatorState = ref<StyleValue>()
const tabsBarHasScrollAnimation = ref(false)

async function setIndicatorAndScroll() {
  if (!props.autoScroll) {
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
    const tabBarPaddingLeft = window.getComputedStyle(tabsBar, 'padding-left').paddingLeft
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
    ? `color: var(--maz-color-text)`
    : 'color: var(--maz-color-muted)'
}

onBeforeMount(() => {
  if (currentTab.value < 1 || currentTab.value > normalizedItems.value.length) {
    console.error(
      `[maz-ui](MazTabsBar) The model-value should be between 1 and ${normalizedItems.value.length}`,
    )
  }
})

onMounted(() => {
  if (props.persistent || currentTab.value) {
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
  const urlActuelle = new URL(window.location.href)
  return Number(urlActuelle.searchParams.get(props.queryParam))
}

function addOrUpdateQueryParamTab(tab: number) {
  const urlActuelle = new URL(window.location.href)
  urlActuelle.searchParams.set(props.queryParam, String(tab))
  window.history.replaceState({}, document.title, urlActuelle.toString())
}

onMounted(() => {
  if (props.persistent) {
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
      '--elevation': !noElevation,
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
            :color="item.badge.color"
            :pastel="item.badge.pastel"
            :outline="item.badge.outline"
            :rounded-size="item.badge.roundedSize"
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
  @apply maz-relative maz-inline-flex maz-max-w-full maz-gap-1 maz-overflow-x-auto maz-rounded maz-p-2 maz-align-top maz-bg-color dark:maz-border dark:maz-border-color-light;

  &.--elevation {
    @apply maz-elevation dark:maz-shadow-none;
  }

  &.--block {
    @apply maz-w-full;
  }

  &__item {
    @apply maz-relative maz-flex maz-flex-none
        maz-items-center maz-gap-2 maz-rounded maz-px-3
        maz-py-2 maz-text-center maz-font-medium maz-no-underline maz-transition maz-duration-200 maz-ease-in-out;

    &:not(.--disabled) {
      @apply maz-cursor-pointer hover:!maz-text-normal;
    }

    &.--disabled {
      @apply maz-cursor-not-allowed maz-bg-color-lighter maz-text-gray-400 dark:maz-text-gray-500;
    }
  }

  &__indicator {
    @apply maz-absolute maz-left-0 maz-rounded maz-bg-color-light maz-text-center;

    &.--animated {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;
    }
  }
}
</style>
