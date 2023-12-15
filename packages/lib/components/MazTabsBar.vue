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
    <button
      v-for="({ label, disabled }, index) in normalizedItems"
      :key="index"
      :ref="(mazBtn) => addElementToItemRefs({ mazBtn, index })"
      :class="{ '--active': currentTab === index + 1, '--disabled': disabled }"
      class="m-tabs-bar__item"
      :disabled="disabled"
      :style="getTabStyle(index + 1, disabled)"
      @click="disabled ? undefined : selectTab(index + 1)"
    >
      {{ label }}
    </button>
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
    type StyleValue,
    type ComponentPublicInstance,
  } from 'vue'
  import type { Color } from './types'
  import type { MazTabsProvide } from './MazTabs.vue'

  import { injectStrict } from './../modules/helpers/inject-strict'
  import { sleep } from './../modules/helpers/sleep'

  export type MazTabsBarItem =
    | {
        label: string
        disabled?: boolean
      }
    | string

  const { currentTab, updateCurrentTab } = injectStrict<MazTabsProvide>('maz-tabs')

  function selectTab(tabIndex: number) {
    updateCurrentTab(tabIndex)
    if (props.persistent) {
      addOrUpdateQueryParamTab(tabIndex)
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
      /** The color of the tabs bar
       * @default primary
       */
      color?: Color
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
      color: 'primary',
      queryParam: 'tab',
      autoScroll: true,
    },
  )

  const tabsBarRef = ref<HTMLDivElement>()
  const itemRefs = ref<HTMLButtonElement[]>([])

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
      await sleep(200)
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
    return currentTab.value === index
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
      @apply maz-relative maz-flex-none maz-rounded
        maz-px-3 maz-py-2 maz-text-center
        maz-font-medium maz-no-underline maz-transition maz-duration-200 maz-ease-in-out;

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
