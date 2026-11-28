<script lang="ts">
import type { MazBadgeProps } from './MazBadge.vue'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazIndicatorProps } from './MazIndicator.vue'
import type { MazTabsOrientation, MazTabsProvide } from './MazTabs.vue'
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'

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
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
   */
  color?: MazColor
  /**
   * Direction of the bar. `vertical` stacks the tabs in a column (arrows up and down move between tabs),
   * for a side navigation of sections. Inherited from MazTabs when not set
   * @values `'horizontal' | 'vertical'`
   * @default 'horizontal'
   */
  orientation?: MazTabsOrientation
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
  /**
   * The indicator slides to the selected tab
   * @default true
   */
  animated?: boolean
  /**
   * The indicator stretches toward the new tab on its way (a drop of ink)
   * @default false
   */
  stretch?: boolean
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
     * Badge to display in the tab, next to its label
     * Inherit all props of MazBadge component
     */
    badge?: MazBadgeProps & {
      /**
       * Content of the badge. `true` renders a dot without text, `false` hides the badge
       */
      content: string | number | boolean
    }
    /**
     * Indicator on the top end corner of the tab (unread, new content): `true` for a dot,
     * a number or a text for a counter (`99+` above `max`), or the props of MazIndicator
     */
    indicator?: boolean | number | string | MazIndicatorProps
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
import { GLOBAL_CONFIG_INJECTION_KEY } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useRovingFocus } from '../composables/useRovingFocus.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import MazBtn from './MazBtn.vue'

const {
  items,
  modelValue,
  color,
  orientation,
  standalone = false,
  persistent = false,
  queryParam = 'tab',
  autoScroll = true,
  block = false,
  elevation = false,
  bordered = true,
  animated = true,
  stretch = false,
} = defineProps<MazTabsBarProps<Item>>()

const emits = defineEmits<{
  /**
   * Emitted when the selected tab changes (standalone usage).
   * @property {MazTabsBarItemValue} value item value when provided, otherwise the 1-based index
   */
  'update:model-value': [value: MazTabsBarItemValue<Item>]
}>()

const MazBadge = defineAsyncComponent(() => import('./MazBadge.vue'))
const MazIndicator = defineAsyncComponent(() => import('./MazIndicator.vue'))

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

const resolvedOrientation = computed<MazTabsOrientation>(() => orientation ?? tabsContext.value?.orientation?.value ?? 'horizontal')
const isVertical = computed(() => resolvedOrientation.value === 'vertical')

const ROUNDED_CLASS: Record<MazRoundedSize, string> = ROUNDED_SIZE_CLASS

/** A badge with `content: true` is a dot: no text, so no padding nor line box */
const DOT_BADGE_STYLE = {
  padding: 0,
  width: '0.5em',
  height: '0.5em',
  borderRadius: '9999px',
} as const

/** Props of the MazIndicator of an item: `true` is a dot, a number or a text a counter */
function resolveIndicator(indicator: MazTabsBarObjectItem['indicator']): MazIndicatorProps | undefined {
  if (indicator === undefined || indicator === null || indicator === false)
    return undefined
  if (typeof indicator === 'object')
    return indicator
  return {
    content: indicator === true
      ? undefined
      : indicator,
  }
}

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
        indicator: undefined as MazIndicatorProps | undefined,
        overflowHidden: undefined as boolean | undefined,
        btnProps: {} as Record<string, unknown>,
      }
    }

    const { label, value, disabled, badge, indicator, size, roundedSize, color: itemColor, overflowHidden, ...btnProps } = item as MazTabsBarObjectItem
    const indicatorProps = resolveIndicator(indicator)

    return {
      label,
      value,
      disabled: disabled ?? false,
      size,
      roundedSize,
      color: (itemColor ?? 'transparent') as NonNullable<MazBtnProps['color']>,
      badge,
      indicator: indicatorProps,
      // The indicator sits on the corner of the tab: the button must not clip it
      overflowHidden: overflowHidden ?? (indicatorProps ? false : undefined),
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

  return typeof modelValue === 'number'
    ? modelValue
    : 1
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

const ownIdPrefix = useInstanceUniqId({ componentName: 'MazTabsBar' })
const idPrefix = computed(() => tabsContext.value?.idPrefix?.value ?? ownIdPrefix.value)

function getTabId(index: number) {
  return `${idPrefix.value}-tab-${index + 1}`
}

/**
 * The panels only exist inside MazTabs (MazTabsContentItem)
 */
function getPanelId(index: number) {
  return tabsContext.value?.idPrefix
    ? `${idPrefix.value}-panel-${index + 1}`
    : undefined
}

/**
 * Roving tabindex: only the active tab is in the tab sequence, the arrows move between tabs
 */
function getTabIndex(index: number) {
  const activeIndex = currentTab.value - 1
  const hasFocusableActiveTab = normalizedItems.value[activeIndex] && !normalizedItems.value[activeIndex].disabled

  if (hasFocusableActiveTab) {
    return index === activeIndex
      ? 0
      : -1
  }

  return index === normalizedItems.value.findIndex(item => !item.disabled)
    ? 0
    : -1
}

const { onKeydown: onRovingKeydown } = useRovingFocus({
  container: tabsBarRef,
  items: () => itemRefs.value.slice(0, normalizedItems.value.length),
  orientation: 'both',
  activateOnFocus: true,
  onActivate: index => selectTab(index),
  currentIndex: computed({
    get: () => currentTab.value - 1,
    set: () => {},
  }),
})

const CROSS_KEYS = {
  horizontal: ['ArrowUp', 'ArrowDown'],
  vertical: ['ArrowLeft', 'ArrowRight'],
} as const

function onTabKeydown(event: KeyboardEvent, index: number) {
  if ((CROSS_KEYS[resolvedOrientation.value] as readonly string[]).includes(event.key))
    return

  onRovingKeydown(event, index)
}

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
  itemRefs.value[index] = mazBtn && '$el' in mazBtn
    ? mazBtn.$el
    : mazBtn
}

const tabsBarHasScrollAnimation = ref(false)

function scrollToTab(tabsBar: HTMLElement, activeTab: HTMLElement) {
  const scrollOffset = 50
  const behavior = tabsBarHasScrollAnimation.value ? 'smooth' : 'instant'

  if (isVertical.value) {
    if (
      activeTab.offsetTop - scrollOffset < tabsBar.scrollTop
      || activeTab.offsetTop + activeTab.offsetHeight > tabsBar.scrollTop + tabsBar.clientHeight
    ) {
      tabsBar.scrollTo({ top: activeTab.offsetTop - scrollOffset, behavior })
    }
    return
  }

  if (
    activeTab.offsetLeft - scrollOffset < tabsBar.scrollLeft
    || activeTab.offsetLeft + activeTab.offsetWidth > tabsBar.scrollLeft + tabsBar.clientWidth
  ) {
    const tabsBarPaddingOffset = Number(globalThis.getComputedStyle(tabsBar).paddingLeft.slice(0, -2))

    tabsBar.scrollTo({ left: activeTab.offsetLeft - tabsBarPaddingOffset - scrollOffset, behavior })
  }
}

function useIndicator(orientation: 'horizontal' | 'vertical') {
  return useSlidingIndicator({
    container: tabsBarRef,
    active: () => {
      const tabs = normalizedItems.value

      return (orientation === 'vertical') === isVertical.value && tabs.length > 0
        ? itemRefs.value[currentTab.value - 1]
        : undefined
    },
    orientation,
    stretch: () => stretch,
    animated: () => animated,
  })
}

const horizontalIndicator = useIndicator('horizontal')
const verticalIndicator = useIndicator('vertical')

const indicatorStyle = computed(() => isVertical.value
  ? verticalIndicator.style.value
  : horizontalIndicator.style.value)

async function setIndicatorAndScroll() {
  await sleep(150)

  const tabsBar = tabsBarRef.value
  const activeTab = itemRefs.value[currentTab.value - 1]

  if (!tabsBar || !activeTab) {
    return
  }

  if (autoScroll)
    scrollToTab(tabsBar, activeTab)

  horizontalIndicator.update()
  verticalIndicator.update()

  tabsBarHasScrollAnimation.value = true
}

function getTabStyle(index: number, disabled: boolean): StyleValue {
  if (disabled) {
    return {}
  }

  if (currentTab.value === index + 1) {
    if (!resolvedColor.value)
      return 'color: var(--maz-foreground)'
    const token = resolvedColor.value === 'neutral' ? 'neutral' : `${resolvedColor.value}-foreground`
    return `color: var(--maz-${token})`
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
  () => [currentTab.value, normalizedItems.value, isVertical.value],
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
    role="tablist"
    :aria-orientation="resolvedOrientation"
    class="m-tabs-bar m-reset-css maz:relative maz:inline-flex maz:max-w-full maz:scrollbar-themed maz:gap-(--maz-menu-gap,0.25rem) maz:bg-container maz:p-(--maz-menu-padding,0.5rem) maz:align-top"
    :class="[
      ROUNDED_CLASS[resolvedRoundedSize],
      {
        '--vertical maz:flex-none maz:flex-col maz:overflow-y-auto': isVertical,
        'maz:overflow-x-auto': !isVertical,
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
      aria-hidden="true"
      class="m-tabs-bar__indicator maz:pointer-events-none maz:absolute maz:inset-s-0 maz:text-center"
      :class="[
        { 'maz:top-0': isVertical },
        ROUNDED_CLASS[resolvedRoundedSize],
        { 'maz:bg-surface-600 maz:dark:bg-surface-400': !resolvedColor },
      ]"
      :style="[indicatorStyle, resolvedColor ? { backgroundColor: `var(--maz-${resolvedColor === 'neutral' ? 'neutral-foreground' : resolvedColor})` } : {}]"
    />
    <template v-for="(item, index) in normalizedItems" :key="index">
      <MazBtn
        v-bind="item.btnProps"
        :id="getTabId(index)"
        :ref="(mazBtn) => addElementToItemRefs({ mazBtn: mazBtn as ComponentPublicInstance<any>, index })"
        :color="item.color"
        :size="item.size ?? resolvedSize"
        :rounded-size="item.roundedSize ?? resolvedRoundedSize"
        :disabled="item.disabled"
        :overflow-hidden="item.overflowHidden"
        :class="{
          '--is-active': isActiveTab(index),
          '--disabled': item.disabled,
          'maz:w-full maz:justify-start!': isVertical,
        }"
        class="m-tabs-bar__item maz:relative maz:z-1 maz:flex-none maz:type-label"
        :style="getTabStyle(index, item.disabled)"
        role="tab"
        :aria-selected="isActiveTab(index) ? 'true' : 'false'"
        :aria-controls="getPanelId(index)"
        :tabindex="getTabIndex(index)"
        @click="item.disabled ? undefined : selectTab(index)"
        @keydown="onTabKeydown($event, index)"
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
            v-if="item.badge && item.badge.content !== false"
            v-bind="item.badge"
            :size="item.badge.size ?? item.size ?? resolvedSize ?? 'xs'"
            class="m-tabs-bar__item__badge"
            :class="{ '--dot': item.badge.content === true, 'maz:ms-auto': isVertical }"
            :style="item.badge.content === true ? DOT_BADGE_STYLE : undefined"
          >
            <!--
              @slot badge-content - Content in the badge
                @binding {string | number | boolean} content - content of the badge provided in item
            -->
            <slot name="badge-content" :content="item.badge.content">
              <template v-if="typeof item.badge.content !== 'boolean'">
                {{ item.badge.content }}
              </template>
            </slot>
          </MazBadge>
        </slot>

        <MazIndicator v-if="item.indicator" v-bind="item.indicator" attached class="m-tabs-bar__item__indicator">
          <!--
            @slot indicator - Replace the text of a counter indicator
              @binding {string} text - text of the counter (`99+` above `max`)
              @binding {number} index - index of the item
          -->
          <template v-if="$slots.indicator" #content="{ text }">
            <slot name="indicator" :text="text" :index="index" />
          </template>
        </MazIndicator>
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
