<script lang="ts">
import type { MazBadgeProps } from './MazBadge.vue'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazColor, MazRoundedSize, MazSize } from './types'

/**
 * Props of MazBtn that an item is not allowed to forward, because they are
 * either driven internally by the tabs bar or would break its layout.
 */
type ExcludedBtnProps = 'active' | 'block' | 'type' | 'loading' | 'fab'

export interface MazTabsBarProps<Item extends MazTabsBarItem = MazTabsBarItem> {
  /**
   * The items to display in the tabs bar
   * @type MazTabsBarItem[]
   */
  items: readonly Item[]
  /**
   * Selected tab (standalone usage, without MazTabs).
   * Holds the item `value` when provided, otherwise the 1-based index.
   * Pass items `as const` (or with literal `value`) to infer a union type.
   * @model
   */
  modelValue?: MazTabsBarItemValue<Item>
  /**
   * Size of the tabs (forwarded to each MazBtn)
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   * @default 'md'
   */
  size?: MazSize
  /**
   * Size of the rounded applied to the bar, the indicator and each tab
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * Color of the active tab indicator. When omitted, the default neutral
   * indicator is used.
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   */
  color?: MazColor
  /**
   * Force the standalone mode: the tabs bar ignores any surrounding `MazTabs`
   * (selection, size, rounded-size and color are no longer inherited) and is
   * driven only by its own `v-model`. Useful for a nested switcher inside a
   * page already wrapped by `MazTabs`.
   * @default false
   */
  standalone?: boolean
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

export type MazTabsBarObjectItem<Value extends string | number = string | number>
  = Omit<MazBtnProps, ExcludedBtnProps> & {
    /**
     * Label of the tab
     */
    label: string
    /**
     * Value emitted by the model when this tab is selected (standalone usage).
     * When omitted, the model emits the 1-based index of the tab.
     */
    value?: Value
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

export type MazTabsBarItem<Value extends string | number = string | number>
  = | MazTabsBarObjectItem<Value>
    | string

/**
 * Resolve the model value type from the items passed to the component.
 * If items expose a `value`, the model emits that value, otherwise the
 * 1-based index (number).
 */
export type MazTabsBarItemValue<Item>
  = Item extends { value: infer V extends string | number } ? V : number
</script>

<script lang="ts" setup generic="Item extends MazTabsBarItem">
import type { ComponentPublicInstance, StyleValue } from 'vue'
import type { MazTabsProvide } from './MazTabs.vue'
import { sleep } from '@maz-ui/utils/helpers/sleep'
import {
  computed,
  defineAsyncComponent,
  getCurrentInstance,
  inject,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '../composables/useGlobalConfig'
import MazBtn from './MazBtn.vue'

const {
  items,
  modelValue,
  color,
  standalone = false,
  persistent = false,
  queryParam = 'tab',
  autoScroll = true,
  block = false,
  elevation = false,
  bordered = true,
} = defineProps<MazTabsBarProps<Item>>()

const emits = defineEmits<{
  /**
   * Emitted when the selected tab changes (standalone usage).
   * @property {MazTabsBarItemValue} value item value when provided, otherwise the 1-based index
   */
  'update:model-value': [value: MazTabsBarItemValue<Item>]
}>()

const MazBadge = defineAsyncComponent(() => import('./MazBadge.vue'))

const injectedTabs = inject<MazTabsProvide | undefined>('maz-tabs', undefined)

const tabsContext = computed(() => (standalone ? undefined : injectedTabs))

const instance = getCurrentInstance()
const globalConfig = inject(GLOBAL_CONFIG_INJECTION_KEY, undefined)

function wasPropProvided(key: string): boolean {
  const raw = instance?.vnode.props
  if (!raw) {
    return false
  }
  return Object.hasOwn(raw, key) || Object.hasOwn(raw, key.replace(/\B([A-Z])/g, '-$1').toLowerCase())
}

const resolvedSize = computed<MazSize>(() => {
  if (wasPropProvided('size')) {
    return (instance!.props as { size?: MazSize }).size as MazSize
  }
  return tabsContext.value?.size?.value
    ?? globalConfig?.MazTabsBar?.size
    ?? globalConfig?.global?.size
    ?? 'md'
})

const resolvedRoundedSize = computed<MazRoundedSize>(() => {
  if (wasPropProvided('roundedSize')) {
    return (instance!.props as { roundedSize?: MazRoundedSize }).roundedSize as MazRoundedSize
  }
  return tabsContext.value?.roundedSize?.value
    ?? globalConfig?.MazTabsBar?.roundedSize
    ?? globalConfig?.global?.roundedSize
    ?? 'md'
})

const resolvedColor = computed<MazColor | undefined>(() => color ?? tabsContext.value?.color?.value)

const ROUNDED_CLASS: Record<MazRoundedSize, string> = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const

const normalizedItems = computed(() =>
  items.map((item) => {
    if (typeof item === 'string') {
      return {
        label: item,
        value: undefined as string | number | undefined,
        disabled: false,
        size: undefined as MazSize | undefined,
        roundedSize: undefined as MazRoundedSize | undefined,
        color: 'transparent' as NonNullable<MazBtnProps['color']>,
        badge: undefined as MazTabsBarObjectItem['badge'],
        btnProps: {} as Record<string, unknown>,
      }
    }

    const { label, value, disabled, badge, size, roundedSize, color: itemColor, ...btnProps } = item as MazTabsBarObjectItem

    return {
      label,
      value,
      disabled: disabled ?? false,
      size,
      roundedSize,
      color: (itemColor ?? 'transparent') as NonNullable<MazBtnProps['color']>,
      badge,
      btnProps,
    }
  }),
)

const currentTab = computed<number>(() => {
  if (tabsContext.value) {
    return tabsContext.value.currentTab.value
  }

  if (modelValue === undefined) {
    return 1
  }

  const indexByValue = normalizedItems.value.findIndex(
    item => item.value !== undefined && item.value === modelValue,
  )
  if (indexByValue !== -1) {
    return indexByValue + 1
  }

  return typeof modelValue === 'number' ? modelValue : 1
})

function setActiveTab(oneBasedIndex: number) {
  if (tabsContext.value) {
    tabsContext.value.updateCurrentTab(oneBasedIndex)
    return
  }

  const item = normalizedItems.value[oneBasedIndex - 1]
  emits('update:model-value', (item?.value ?? oneBasedIndex) as MazTabsBarItemValue<Item>)
}

function selectTab(tabIndex: number) {
  setActiveTab(tabIndex + 1)
  if (persistent) {
    addOrUpdateQueryParamTab(tabIndex + 1)
  }
}

const tabsBarRef = ref<HTMLDivElement>()
const itemRefs = ref<HTMLElement[]>([])

function isActiveTab(index: number) {
  return currentTab.value === index + 1
}

function addElementToItemRefs({
  mazBtn,
  index,
}: {
  mazBtn?: ComponentPublicInstance<any> | HTMLElement
  index: number
}) {
  itemRefs.value[index] = mazBtn && '$el' in mazBtn ? mazBtn.$el : mazBtn
}

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
    const tabBarPaddingLeft = globalThis.getComputedStyle(tabsBar).paddingLeft
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

  if (currentTab.value === index + 1) {
    return resolvedColor.value ? `color: var(--maz-${resolvedColor.value}-foreground)` : 'color: var(--maz-foreground)'
  }

  return 'color: var(--maz-muted)'
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
    setActiveTab(getQueryParamTab() || currentTab.value || 1)
  }
})
</script>

<template>
  <div
    ref="tabsBarRef"
    class="m-tabs-bar m-reset-css maz:relative maz:inline-flex maz:max-w-full maz:gap-1 maz:overflow-x-auto maz:bg-container maz:p-2 maz:align-top"
    :class="[
      ROUNDED_CLASS[resolvedRoundedSize],
      {
        '--block': block,
        '--elevation': elevation,
        '--bordered': bordered,
        'maz:w-full': block,
        'maz:shadow-elevation maz:drop-shadow-md maz:dark:shadow-none': elevation,
        'maz:border maz:border-divider': bordered,
      },
    ]"
  >
    <div
      class="m-tabs-bar__indicator maz:absolute maz:left-0 maz:text-center"
      :class="[
        ROUNDED_CLASS[resolvedRoundedSize],
        {
          'maz:transition-all maz:duration-300 maz:ease-in-out': tabsBarHasScrollAnimation,
          'maz:bg-surface-600 maz:dark:bg-surface-400': !resolvedColor,
        },
      ]"
      :style="[tabsIndicatorState, resolvedColor ? { backgroundColor: `var(--maz-${resolvedColor})` } : {}]"
    />
    <template v-for="(item, index) in normalizedItems" :key="index">
      <MazBtn
        :ref="(mazBtn) => addElementToItemRefs({ mazBtn: mazBtn as ComponentPublicInstance<any>, index })"
        v-bind="item.btnProps"
        :color="item.color"
        :size="item.size ?? resolvedSize"
        :rounded-size="item.roundedSize ?? resolvedRoundedSize"
        :disabled="item.disabled"
        :class="{
          '--is-active': isActiveTab(index),
          '--disabled': item.disabled,
        }"
        class="m-tabs-bar__item maz:relative maz:z-1 maz:flex-none maz:font-medium"
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
            :size="item.badge.size ?? item.size ?? resolvedSize ?? 'xs'"
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
      </MazBtn>
    </template>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

/* The tab buttons must never paint a background on hover/active: it would
 * hide the sliding indicator. Inactive tabs only brighten their text on
 * hover, the active tab has no hover feedback. */
.m-tabs-bar__item {
  &:not(:disabled):hover,
  &:not(:disabled):active {
    background-color: transparent !important;
  }

  &:not(.--is-active, :disabled):hover {
    color: var(--maz-foreground) !important;
  }
}
</style>
