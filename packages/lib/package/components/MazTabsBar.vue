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
      :to="useAnchor ? `#${labelNormalize(label)}` : undefined"
      @click="setValue(index)"
    >
      {{ label }}
    </MazBtn>
    <div :style="tabsIndicatorState" class="m-tabs-bar__indicator">
      <div class="m-sub-bar" />
    </div>
  </div>
</template>

<script lang="ts">
  export interface MazTabsItem {
    label: string
    disabled?: boolean
  }
</script>

<script lang="ts" setup>
  import { ref, type PropType, computed, onBeforeMount, onMounted } from 'vue'
  import MazBtn from './MazBtn.vue'

  // const toKebabCase = (string: string) => {
  //   return string
  //     .replace(/\W+/g, ' ')
  //     .split(/ |\B(?=[A-Z])/)
  //     .map((word) => word.toLowerCase())
  //     .join('-')
  // }

  const getIndexOfCurrentAnchor = (tabs: MazTabsItem[], value: number) => {
    if (typeof window === 'undefined') return value
    const anchor = window.location.hash.replace('#', '')
    const index = tabs.findIndex(({ label }) => label === anchor)
    return index === -1 ? 0 : index
  }

  const props = defineProps({
    items: { type: Array as PropType<MazTabsItem[]>, required: true },
    modelValue: { type: Number, default: 1 },
    alignLeft: { type: Boolean, default: false },
    useAnchor: { type: Boolean, default: false },
  })

  const emits = defineEmits(['update:model-value'])

  const MazTabsBar = ref()
  const currentTab = ref()
  const isMounted = ref(false)

  const tabsIndicatorState = computed(() => {
    if (typeof currentTab.value !== 'number' || !isMounted.value) {
      return
    }

    const tabItems = document.querySelectorAll('.m-tabs-bar__item')
    const tabItemActive = tabItems?.[currentTab.value] as HTMLElement

    const indicatorWidth = tabItemActive ? tabItemActive.clientWidth : 0
    const translateXValue = tabItemActive ? tabItemActive.offsetLeft : 0
    return {
      transform: `translateX(${translateXValue}px)`,
      width: `${indicatorWidth}px`,
    }
  })

  onBeforeMount(() => {
    const { modelValue, useAnchor, items } = props
    if (modelValue < 1 || modelValue > items.length)
      throw new Error(
        `[Maz-ui](MazTabsBar) The init value should be between 1 and ${items.length}`,
      )

    if (!useAnchor) setValue(modelValue - 1)
  })

  onMounted(async () => {
    setTimeout(() => {
      const { useAnchor, items, modelValue } = props

      if (useAnchor) {
        const valueIndex = modelValue - 1
        const tabActive =
          useAnchor && !Number.isInteger(currentTab.value)
            ? getIndexOfCurrentAnchor(items, valueIndex)
            : valueIndex
        setValue(tabActive)
      }
      isMounted.value = true
    }, 300)
  })

  const setValue = (index: number) => {
    currentTab.value = index
    emits('update:model-value', index + 1)
  }

  const labelNormalize = (label: string) => {
    return label
  }
</script>

<style lang="postcss" scoped>
  .m-tabs-bar {
    @apply maz-relative maz-flex maz-space-x-1 maz-overflow-x-auto;

    &:not(.--align-left) {
      & .m-tabs-bar__item {
        @apply maz-flex-1;
      }
    }

    &__item {
      &.--active {
        @apply maz-text-primary;
      }
    }

    &__indicator {
      @apply maz-absolute maz-bottom-0 maz-left-0 maz-text-center maz-transition-all maz-duration-500 maz-ease-in-out;

      height: 2px;

      & .m-sub-bar {
        @apply maz-mx-auto maz-w-3/5 maz-bg-primary;

        height: 2px;
      }
    }
  }
</style>
