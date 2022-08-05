<template>
  <div class="m-tabs-bar" :class="[`--direction-${direction}`]">
    <nav role="tablist">
      <MazBtn
        v-for="({ label, disabled }, index) in items"
        :key="index"
        :ref="(el) => Items.push((el as ComponentPublicInstance)?.$el)"
        color="transparent"
        role="tab"
        :aria-selected="internalValue === index || undefined"
        :size="size"
        :class="{
          '--disabled': disabled,
          '--active': internalValue === index,
        }"
        class="m-tabs-bar__item --no-styling"
        :href="useAnchor ? `#${labelNormalize(label)}` : '#'"
        @click="disabled ? undefined : (internalValue = index)"
      >
        {{ label }}
      </MazBtn>
    </nav>
    <span
      ref="Indicator"
      :style="indicatorTransformStyle"
      class="m-tabs-bar__indicator"
    >
      <span />
    </span>
  </div>
</template>

<script lang="ts">
  export interface MazTabsItem {
    label: string
    disabled?: boolean
  }

  export type { Size } from './types'
  export type JustifyContent =
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'flex-start'
    | 'start'
    | 'flex-end'
    | 'end'
</script>

<script lang="ts" setup>
  import {
    ref,
    type PropType,
    computed,
    onBeforeMount,
    onMounted,
    toRefs,
    watchEffect,
    type ComponentPublicInstance,
  } from 'vue'

  import MazBtn from './MazBtn.vue'
  import type { Size } from './types'

  // const toKebabCase = (string: string) => {
  //   return string
  //     .replace(/\W+/g, ' ')
  //     .split(/ |\B(?=[A-Z])/)
  //     .map((word) => word.toLowerCase())
  //     .join('-')
  // }

  const props = defineProps({
    modelValue: { type: Number, default: 1 },
    items: { type: Array as PropType<MazTabsItem[]>, required: true },
    justifyContent: {
      type: String as PropType<JustifyContent>,
      default: 'flex-start',
    },
    useAnchor: { type: Boolean, default: false },
    direction: { type: String as PropType<'row' | 'column'>, default: 'row' },
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
  })
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { modelValue, useAnchor, items, direction, justifyContent } =
    toRefs(props)
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const emits = defineEmits(['update:model-value'])

  const Indicator = ref<HTMLElement>()
  const Items = ref<HTMLElement[]>([])

  const indicatorTransformStyle = ref<string>()
  const isMounted = ref(false)
  const currentValue = ref(props.modelValue - 1)

  const internalValue = computed({
    get: () => currentValue.value,
    set: (value) => {
      currentValue.value = value
      emits('update:model-value', value + 1)
    },
  })

  onBeforeMount(() => {
    if (modelValue.value < 1 || modelValue.value > items.value.length) {
      throw new Error(
        `[Maz-ui](MazTabsBar) The init value should be between 1 and ${items.value.length}`,
      )
    }
  })

  onMounted(async () => {
    isMounted.value = true

    if (useAnchor.value) {
      const tabActive = getIndexOfCurrentAnchor(
        items.value,
        internalValue.value,
      )

      internalValue.value = tabActive
    }
  })

  watchEffect(() => {
    if (isMounted.value) {
      const tabItemActive = Items.value.find(
        (el) => el.getAttribute('aria-selected') === 'true',
      )

      if (tabItemActive) {
        indicatorTransformStyle.value =
          direction.value === 'row'
            ? getIndicatorTransformForRow(tabItemActive)
            : getIndicatorTransformForColumn(tabItemActive)
      } else {
        indicatorTransformStyle.value = undefined
      }
    }
  })

  const labelNormalize = (label: string) => {
    return label
  }

  function getIndexOfCurrentAnchor(tabs: MazTabsItem[], value: number) {
    if (typeof window === 'undefined') {
      return value
    }

    const anchor = window.location.hash.replace('#', '')
    const index = tabs.findIndex(({ label }) => label === decodeURI(anchor))
    return index === -1 ? value : index
  }

  function getIndicatorTransformForRow(element: HTMLElement) {
    const transform = {
      x: element.offsetLeft,
      width: element.offsetWidth,
    }

    return `transform: translateX(${transform.x}px); width: ${transform.width}px;`
  }

  function getIndicatorTransformForColumn(element: HTMLElement) {
    const transform = {
      y: element.offsetTop,
      width: element.offsetHeight,
    }

    return `transform: translateY(${transform.y}px); height: ${transform.width}px;`
  }
</script>

<style lang="postcss" scoped>
  .m-tabs-bar {
    @apply maz-relative maz-overflow-auto;

    & nav {
      @apply maz-relative maz-flex;

      & .m-tabs-bar__item {
        &[aria-selected='true'] {
          @apply maz-text-primary;
        }
      }
    }

    &__indicator {
      @apply maz-absolute
        maz-bottom-0 maz-left-0
        maz-flex
            maz-w-0
            maz-origin-top-left maz-bg-transparent
            maz-transition-all
            maz-duration-500 maz-ease-in-out
            maz-flex-center;

      height: 0.125rem;

      & span {
        @apply maz-w-2/3 maz-rounded-lg maz-bg-primary;

        height: 0.125rem;
      }
    }

    &.--direction-row nav {
      @apply maz-space-x-1;
      /* stylelint-disable function-no-unknown */
      justify-content: v-bind(justifycontent);
      /* stylelint-enable function-no-unknown */
    }

    &.--direction-column {
      & nav {
        @apply maz-flex-col maz-space-y-1;
      }

      & .m-tabs-bar__indicator {
        @apply maz-top-0 maz-right-auto
          maz-h-auto;

        width: 0.125rem;

        & span {
          @apply maz-h-2/3;

          width: 0.125rem;
        }
      }
    }
  }
</style>
