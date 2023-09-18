<template>
  <div
    ref="MazTabsBar"
    class="m-tabs-bar"
    :class="{
      '--align-left': alignLeft,
    }"
  >
    <MazBtn
      v-for="({ label, disabled }, index) in items"
      :key="index"
      color="transparent"
      :class="{ '--active': currentTab === index, '--disabled': disabled }"
      class="m-tabs-bar__item --no-styling"
      :disabled="disabled"
      :to="useAnchor && !disabled ? `#${toKebabCase(label)}` : undefined"
      @click="updateCurrentTab(index + 1)"
    >
      <span :style="[currentTab === index + 1 ? { color: `var(--maz-color-${color})` } : {}]">
        {{ label }}
      </span>
    </MazBtn>
    <div :style="tabsIndicatorState" class="m-tabs-bar__indicator">
      <div class="m-sub-bar" :style="{ backgroundColor: `var(--maz-color-${color})` }"></div>
    </div>
  </div>
</template>

<script lang="ts">
  export interface MazTabsBarItem {
    label: string
    disabled?: boolean
  }
</script>

<script lang="ts" setup>
  import { ref, type PropType, computed, onBeforeMount, onMounted } from 'vue'
  import type { Color } from './types'
  import type { MazTabsProvide } from './MazTabs.vue'

  import MazBtn from './MazBtn.vue'
  import { injectStrict } from './../modules'

  function toKebabCase(input: string): string {
    return input
      .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
      .replaceAll(/[\s_]+/g, '-')
      .toLowerCase()
  }

  const getIndexOfCurrentAnchor = (tabs: MazTabsBarItem[], value: number) => {
    if (typeof window === 'undefined') return value
    const anchor = window.location.hash.replace('#', '')
    const index = tabs.findIndex(({ label }) => toKebabCase(label) === anchor)
    return index === -1 ? 0 : index + 1
  }

  const { currentTab, updateCurrentTab } = injectStrict<MazTabsProvide>('maz-tabs')

  const props = defineProps({
    items: { type: Array as PropType<MazTabsBarItem[]>, required: true },
    alignLeft: { type: Boolean, default: false },
    useAnchor: { type: Boolean, default: false },
    color: { type: String as PropType<Color>, default: 'primary' },
  })

  const MazTabsBar = ref()
  const isMounted = ref(false)

  const tabsIndicatorState = computed(() => {
    if (typeof currentTab.value !== 'number' || !isMounted.value) {
      return
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

  onBeforeMount(() => {
    const { items } = props
    if (currentTab.value < 1 || currentTab.value > items.length)
      throw new Error(`[maz-ui](MazTabsBar) The init value should be between 1 and ${items.length}`)
  })

  onMounted(async () => {
    setTimeout(() => {
      if (props.useAnchor) {
        updateCurrentTab(getIndexOfCurrentAnchor(props.items, currentTab.value) ?? 1)
      }
      isMounted.value = true
    }, 300)
  })
</script>

<style lang="postcss" scoped>
  .m-tabs-bar {
    @apply maz-relative maz-flex maz-gap-2 maz-overflow-x-auto maz-rounded dark:maz-bg-color-light;

    &__item {
      @apply maz-flex-none;
    }

    &:not(.--align-left) {
      & .m-tabs-bar__item {
        @apply maz-flex-1;
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
