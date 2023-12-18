<template>
  <div
    ref="tabsBarRef"
    class="m-tabs-bar"
    :class="{
      '--block': block,
      '--elevation': !noElevation,
    }"
  >
    <div class="m-tabs-bar__indicator" :style="[tabsIndicatorState]"></div>
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
            :size="item.badge.size"
            nowrap
          >
            {{ item.badge.value }}
          </MazBadge>
        </slot>
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed,
    watchEffect,
    onBeforeMount,
    nextTick,
    onMounted,
    defineAsyncComponent,
    type StyleValue,
    type ComponentPublicInstance,
  } from 'vue'
  import type { MazTabsProvide } from './MazTabs.vue'

  import { injectStrict } from './../modules/helpers/inject-strict'
  import { sleep } from './../modules/helpers/sleep'
  import { type BadgeRoundedSize, type BadgeColor } from './MazBadge.vue'

  const MazBadge = defineAsyncComponent(() => import('./MazBadge.vue'))

  export type MazTabsBarItem =
    | {
        label: string
        disabled?: boolean
        badge?: {
          value: string | number
          color?: BadgeColor
          pastel?: boolean
          outline?: boolean
          size?: string
          roundedSize?: BadgeRoundedSize
        }
      }
    | string

  const { currentTab, updateCurrentTab } = injectStrict<MazTabsProvide>('maz-tabs')

  function selectTab(tabIndex: number) {
    updateCurrentTab(tabIndex + 1)
    if (props.persistent) {
      addOrUpdateQueryParamTab(tabIndex + 1)
    }
  }

  const props = withDefaults(
    defineProps<{
      /** The items to display in the tabs bar */
      items: MazTabsBarItem[]
      /** Will add a query param to the url to keep the selected tab on page refresh */
      persistent?: boolean
      /** The name of the query param to add to the url
       * @default tab
       */
      queryParam?: string
      /** Will make the tabs bar full width */
      block?: boolean
      /** Will remove the elevation */
      noElevation?: boolean
      /** Will add a scroll on the tabs bar to show selected element
       * @default true
       */
      autoScroll?: boolean
    }>(),
    {
      queryParam: 'tab',
      autoScroll: true,
    },
  )

  const tabsBarRef = ref<HTMLDivElement>()
  const itemRefs = ref<HTMLButtonElement[]>([])

  function isActiveTab(index: number) {
    return currentTab.value === index + 1
  }

  function addElementToItemRefs({
    mazBtn,
    index,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mazBtn?: ComponentPublicInstance<any>
    index: number
  }) {
    itemRefs.value[index] = mazBtn && '$el' in mazBtn ? mazBtn.$el : mazBtn
  }

  const normalizedItems = computed(() =>
    props.items.map((item) => ({
      label: typeof item === 'string' ? item : item.label,
      disabled: typeof item === 'string' ? false : item.disabled ?? false,
      badge: typeof item === 'string' ? undefined : item.badge,
    })),
  )

  const tabsIndicatorState = ref<StyleValue>()

  watchEffect(async () => {
    if (!props.autoScroll) {
      return
    }

    const tabsBar = tabsBarRef.value

    const activeTab = itemRefs.value[currentTab.value - 1]

    if (!tabsBar || !activeTab) {
      return
    }

    await nextTick()
    await sleep(150)

    if (
      activeTab.offsetLeft < tabsBar.scrollLeft ||
      activeTab.offsetLeft + activeTab.offsetWidth > tabsBar.scrollLeft + tabsBar.clientWidth
    ) {
      const tabBarPaddingLeft = window.getComputedStyle(tabsBar, 'padding-left').paddingLeft
      const tabsBarPaddingOffset = Number(tabBarPaddingLeft.slice(0, -2))
      tabsBar.scrollTo({
        left: activeTab.offsetLeft - tabsBarPaddingOffset,
        behavior: 'smooth', // Ajoutez le défilement fluide
      })

      await sleep(150)
    }

    if (typeof currentTab.value !== 'number') {
      return {}
    }

    const tabItemActive: HTMLButtonElement | undefined = itemRefs.value[currentTab.value - 1]

    const indicatorWidth = tabItemActive?.offsetWidth ?? 0
    const indicatorHeight = tabItemActive?.offsetHeight ?? 0
    const translateXValue = tabItemActive?.offsetLeft ?? 0

    tabsIndicatorState.value = {
      transform: `translateX(${translateXValue}px)`,
      width: `${indicatorWidth}px`,
      height: `${indicatorHeight}px`,
    }
  })

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

  function getQueryParamTab() {
    const urlActuelle = new URL(window.location.href)
    return Number(urlActuelle.searchParams.get(props.queryParam))
  }

  function addOrUpdateQueryParamTab(tab: number) {
    const urlActuelle = new URL(window.location.href)
    urlActuelle.searchParams.set(props.queryParam, String(tab))
    window.history.replaceState({}, document.title, urlActuelle.toString())
  }

  onMounted(async () => {
    if (props.persistent) {
      updateCurrentTab(getQueryParamTab() || currentTab.value || 1)
    }
  })
</script>

<style lang="postcss" scoped>
  .m-tabs-bar {
    @apply maz-relative maz-inline-flex maz-max-w-full maz-gap-1 maz-overflow-x-auto maz-rounded maz-p-2 dark:maz-border dark:maz-border-color-lighter;

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
      @apply maz-absolute maz-left-0 maz-rounded maz-bg-color-light maz-text-center maz-transition-all maz-duration-500 maz-ease-in-out;
    }
  }
</style>
