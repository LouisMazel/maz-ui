<template>
  <div
    ref="MazTabsBar"
    class="m-tabs-bar"
    :class="{
      '--align-left': alignLeft,
      '--no-rounded': noRounded,
    }"
  >
    <MazBtn
      v-for="({ label, disabled }, index) in normalizedItems"
      :key="index"
      color="transparent"
      :class="{ '--active': currentTab === index, '--disabled': disabled }"
      class="m-tabs-bar__item --no-styling"
      :disabled="disabled"
      :to="useAnchor && !disabled ? `#${toKebabCase(label)}` : undefined"
      :style="getTabStyle(index + 1)"
      no-rounded
      @click="updateCurrentTab(index + 1)"
    >
      {{ label }}
    </MazBtn>

    <div :style="tabsIndicatorState" class="m-tabs-bar__indicator">
      <div class="m-sub-bar" :style="{ backgroundColor: `var(--maz-color-${color})` }"></div>
    </div>
  </div>
</template>

<script lang="ts">
  export type MazTabsBarItem =
    | {
        label: string
        disabled?: boolean
      }
    | string
</script>

<script lang="ts" setup>
  import {
    ref,
    type PropType,
    computed,
    onBeforeMount,
    onMounted,
    defineAsyncComponent,
    type StyleValue,
  } from 'vue'
  import type { Color } from './types'
  import type { MazTabsProvide } from './MazTabs.vue'

  import { injectStrict } from './../modules/helpers/inject-strict'

  const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

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
    alignLeft: { type: Boolean, default: false },
    useAnchor: { type: Boolean, default: false },
    color: { type: String as PropType<Color>, default: 'primary' },
    noRounded: { type: Boolean, default: false },
  })

  const MazTabsBar = ref()
  const isMounted = ref(false)

  const normalizedItems = computed(() =>
    props.items.map((item) => ({
      label: typeof item === 'string' ? item : item.label,
      disabled: typeof item === 'string' ? false : item.disabled ?? false,
    })),
  )

  const tabsIndicatorState = computed<StyleValue>(() => {
    if (typeof currentTab.value !== 'number' || !isMounted.value) {
      return {}
    }

    const tabItems = document.querySelectorAll('.m-tabs-bar__item')
    const tabItemActive = tabItems?.[currentTab.value - 1] as HTMLElement

    const indicatorWidth = tabItemActive ? tabItemActive.clientWidth : 0
    const translateXValue = tabItemActive ? tabItemActive.offsetLeft : 0

    return {
      transform: `translateX(${translateXValue}px)`,
      width: `${indicatorWidth}px`,
    }
  })

  function getTabStyle(index: number): StyleValue {
    return currentTab.value === index ? `color: var(--maz-color-${props.color})` : ''
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

    isMounted.value = true
  })
</script>

<style lang="postcss" scoped>
  .m-tabs-bar {
    @apply maz-relative maz-inline-flex maz-overflow-x-auto;

    &:not(.--no-rounded) {
      @apply maz-rounded;
    }

    &__item {
      @apply maz-flex-none;
    }

    &:not(.--align-left) {
      & .m-tabs-bar__item {
        @apply maz-flex-none;
      }
    }

    &__indicator {
      @apply maz-absolute maz-bottom-0 maz-left-0 maz-text-center maz-transition-all maz-duration-500 maz-ease-in-out;

      height: 2px;

      & .m-sub-bar {
        @apply maz-mx-auto maz-w-3/5;

        height: 2px;
      }
    }
  }
</style>
