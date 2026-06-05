import type { ComputedRef, InjectionKey } from 'vue'
import type { MazAlertProps } from '../components/MazAlert.vue'
import type { MazAvatarProps } from '../components/MazAvatar.vue'
import type { MazBadgeProps } from '../components/MazBadge.vue'
import type { MazBtnProps } from '../components/MazBtn.vue'
import type { MazButtonGroupProps } from '../components/MazBtnGroup.vue'
import type { MazCardProps } from '../components/MazCard.vue'
import type { MazCheckboxProps } from '../components/MazCheckbox.vue'
import type { MazContainerProps } from '../components/MazContainer.vue'
import type { MazDropdownProps } from '../components/MazDropdown.vue'
import type { MazInputProps } from '../components/MazInput.vue'
import type { MazInputNumberProps } from '../components/MazInputNumber.vue'
import type { MazInputPhoneNumberProps } from '../components/MazInputPhoneNumber.vue'
import type { MazInputTagsProps } from '../components/MazInputTags.vue'
import type { MazPaginationProps } from '../components/MazPagination.vue'
import type { MazRadioProps } from '../components/MazRadio.vue'
import type { MazRadioButtonsProps } from '../components/MazRadioButtons.vue'
import type { MazSelectProps } from '../components/MazSelect.vue'
import type { MazSelectCountryProps } from '../components/MazSelectCountry.vue'
import type { MazSkeletonProps } from '../components/MazSkeleton.vue'
import type { MazTableProps } from '../components/MazTable.vue'
import type { MazTextareaProps } from '../components/MazTextarea.vue'
import type { MazTimelineProps } from '../components/MazTimeline.vue'
import type { MazRoundedSize, MazSize } from '../components/types'
import { computed, getCurrentInstance, inject } from 'vue'

/**
 * Cross-cutting props that can be set once for every globalized component
 * through `defaults.global`. Limited to props whose type is a shared design
 * token (so the same value is valid on every component that exposes them).
 */
export interface GlobalizableProps {
  roundedSize?: MazRoundedSize
  size?: MazSize
}

/**
 * Strongly-typed registry of per-component default props.
 *
 * Add one entry (and its `import type`) per globalized component. Imports are
 * type-only, so there is no runtime cycle with the components that consume the
 * composable.
 */
export interface MazUiDefaultsOptions {
  /**
   * Cross-cutting defaults applied to every globalized component.
   * Lower priority than a per-component entry.
   */
  global?: GlobalizableProps
  MazAlert?: Partial<MazAlertProps>
  MazAvatar?: Partial<MazAvatarProps>
  MazBadge?: Partial<MazBadgeProps>
  MazBtn?: Partial<MazBtnProps>
  MazBtnGroup?: Partial<MazButtonGroupProps>
  MazCard?: Partial<MazCardProps>
  MazCheckbox?: Partial<MazCheckboxProps>
  MazContainer?: Partial<MazContainerProps>
  MazDropdown?: Partial<MazDropdownProps>
  MazInput?: Partial<MazInputProps>
  MazInputNumber?: Partial<MazInputNumberProps>
  MazInputPhoneNumber?: Partial<MazInputPhoneNumberProps>
  MazInputTags?: Partial<MazInputTagsProps>
  MazPagination?: Partial<MazPaginationProps>
  MazRadio?: Partial<MazRadioProps>
  MazRadioButtons?: Partial<MazRadioButtonsProps>
  MazSelect?: Partial<MazSelectProps<any, any, any>>
  MazSelectCountry?: Partial<MazSelectCountryProps>
  MazSkeleton?: Partial<MazSkeletonProps>
  MazTable?: Partial<MazTableProps<any>>
  MazTextarea?: Partial<MazTextareaProps<string>>
  MazTimeline?: Partial<MazTimelineProps>
}

export type MazComponentName = Exclude<keyof MazUiDefaultsOptions, 'global'>

export const GLOBAL_CONFIG_INJECTION_KEY: InjectionKey<MazUiDefaultsOptions> = Symbol('mazGlobalConfig')

/**
 * Whether the prop `key` (or its kebab-case form) was explicitly passed to the
 * instance, read from the raw vnode props rather than the resolved value:
 * Vue casts an absent boolean prop to `false`, so the value alone cannot tell
 * "not passed" from "passed false". Evaluated once at setup, not per render.
 */
function isPropProvided(raw: Record<string, unknown> | null | undefined, key: string): boolean {
  if (!raw)
    return false

  return Object.hasOwn(raw, key) || Object.hasOwn(raw, key.replace(/\B([A-Z])/g, '-$1').toLowerCase())
}

/**
 * Resolve globalizable props for a component instance.
 *
 * Resolution priority, per prop:
 * `instance prop (explicitly passed) > defaults[component] > defaults.global > library fallback`.
 *
 * The globalized props must be declared in the component's `defineProps` but
 * NOT destructured (the returned computed refs replace them). A global default
 * never wins over a prop set on the instance.
 *
 * Whether a prop was passed and which default applies are both invariant at
 * runtime, so they are resolved once at setup. The returned computed only stays
 * reactive to the instance prop value when that prop was actually passed.
 *
 * @param componentName the component key in `MazUiDefaultsOptions`
 * @param fallbacks the library hardcoded default for each globalizable prop
 * @returns one `ComputedRef` per prop. Templates auto-unwrap them; script reads need `.value`.
 */
export function useGlobalConfig<T extends Record<string, unknown>>(
  componentName: MazComponentName,
  fallbacks: T,
): { [K in keyof T]: ComputedRef<T[K]> } {
  const instance = getCurrentInstance()
  const props = instance?.props as Record<string, unknown> | undefined
  const vnodeProps = instance?.vnode.props

  const config = inject(GLOBAL_CONFIG_INJECTION_KEY, undefined)
  const componentConfig = config?.[componentName] as Record<string, unknown> | undefined
  const globalConfig = config?.global as Record<string, unknown> | undefined

  const result = {} as { [K in keyof T]: ComputedRef<T[K]> }

  for (const key of Object.keys(fallbacks) as (keyof T)[]) {
    const name = key as string

    if (isPropProvided(vnodeProps, name)) {
      result[key] = computed(() => props![name] as T[keyof T]) as { [K in keyof T]: ComputedRef<T[K]> }[typeof key]
      continue
    }

    const resolved = (componentConfig?.[name] ?? globalConfig?.[name] ?? fallbacks[key]) as T[keyof T]
    result[key] = computed(() => resolved) as { [K in keyof T]: ComputedRef<T[K]> }[typeof key]
  }

  return result
}
