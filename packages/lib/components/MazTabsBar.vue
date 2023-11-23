<template>
  <div
    ref="MazTabsBar"
    class="m-tabs-bar"
    :class="{
      '--block': block,
    }"
  >
    <div class="m-tabs-bar__indicator" :style="[tabsIndicatorState]"></div>
    <a
      v-for="({ label, disabled }, index) in normalizedItems"
      :key="index"
      :ref="(mazBtn) => addElementToItemRefs({ mazBtn, index })"
      :class="{ '--active': currentTab === index, '--disabled': disabled }"
      class="m-tabs-bar__item"
      :disabled="disabled"
      :href="useAnchor && !disabled ? `#${toKebabCase(label)}` : undefined"
      :style="getTabStyle(index + 1, disabled)"
      @click="disabled ? undefined : updateCurrentTab(index + 1)"
    >
      {{ label }}
    </a>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    type PropType,
    computed,
    onBeforeMount,
    onMounted,
    type StyleValue,
    type ComponentPublicInstance,
  } from 'vue'
  import type { Color } from './types'
  import type { MazTabsProvide } from './MazTabs.vue'

  import { injectStrict } from './../modules/helpers/inject-strict'

  export type MazTabsBarItem =
    | {
        label: string
        disabled?: boolean
      }
    | string

  function toKebabCase(input: string): string {
    return input
      .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
      .replaceAll(/[\s_]+/g, '-')
      .toLowerCase()
  }

  const getIndexOfCurrentAnchor = (tabs: (typeof normalizedItems)['value'], value: number) => {
    if (typeof window === 'undefined') return value
    const anchor = window.location.hash.replace('#', '')
    const index = tabs.findIndex(({ label }) => toKebabCase(label) === anchor)
    return index === -1 ? 1 : index + 1
  }

  const { currentTab, updateCurrentTab } = injectStrict<MazTabsProvide>('maz-tabs')

  const props = defineProps({
    items: { type: Array as PropType<MazTabsBarItem[]>, required: true },
    useAnchor: { type: Boolean, default: false },
    color: { type: String as PropType<Color>, default: 'primary' },
    block: { type: Boolean, default: false },
  })

  const MazTabsBar = ref()
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

  const tabsIndicatorState = computed<StyleValue>(() => {
    if (typeof currentTab.value !== 'number') {
      return {}
    }

    const tabItemActive: HTMLButtonElement | undefined = itemRefs.value[currentTab.value - 1]

    const indicatorWidth = tabItemActive?.offsetWidth ?? 0
    const indicatorHeight = tabItemActive?.offsetHeight ?? 0
    const translateXValue = tabItemActive?.offsetLeft ?? 0

    return {
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

  onMounted(async () => {
    if (props.useAnchor) {
      updateCurrentTab(getIndexOfCurrentAnchor(normalizedItems.value, currentTab.value) ?? 1)
    }
  })
</script>

<style lang="postcss" scoped>
  .m-tabs-bar {
    @apply maz-relative maz-inline-flex maz-gap-1 maz-overflow-x-auto maz-rounded maz-p-2 maz-elevation  dark:maz-border dark:maz-border-color-lighter dark:maz-shadow-none;

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
