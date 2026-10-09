import type { IconComponent } from '@maz-ui/icons'
import type { MaybeRefOrGetter } from 'vue'
import type { MazIconProps, MazIconValue } from '../components/MazIcon.vue'
import { computed, markRaw, toValue } from 'vue'

/**
 * The shape consumers can pass to icon-aware props (`startIcon`, `endIcon`,
 * `icon`, `dropdownIcon`, …).
 *
 * Either a bare icon value (string URL / raw SVG / Vue component) for the
 * common case, or a full `MazIconProps` object when you need to tweak the
 * size, title, svg attributes, fallback, RTL flip, etc.
 *
 * Omit the prop (or pass `undefined`) to opt out of rendering the icon.
 */
export type MazIconLike = MazIconValue | MazIconProps | undefined

export interface UseMazIconPropsOptions {
  /**
   * When `true` (default), the resolved icon is treated as decorative and
   * gets `aria-hidden="true"`. Set to `false` for icons that convey meaning
   * without a visible label (e.g. solo navigation arrows).
   * @default true
   */
  decorative?: boolean
}

export type ResolvedMazIconProps = MazIconProps & {
  'aria-hidden'?: boolean | 'true' | 'false'
}

function isComponent(v: unknown): v is IconComponent {
  return typeof v === 'object' && v !== null
    && ('render' in v || 'setup' in v || 'template' in v)
}

/**
 * Normalize a flexible icon prop into a fully-formed object that can be
 * `v-bind`-spread onto `<MazIcon>`. Returns `undefined` when the input is
 * empty or invalid, so consumers can guard the render with a single
 * `v-if="iconProps"` check.
 *
 * @example
 * ```ts
 * const { iconProps: startIconProps } = useMazIconProps(
 *   () => startIcon,
 *   () => ({ size: iconSize.value }),
 * )
 * ```
 *
 * @example
 * ```vue
 * <MazIcon v-if="startIconProps" v-bind="startIconProps" />
 * ```
 */
export function useMazIconProps(
  props: MaybeRefOrGetter<MazIconLike>,
  defaultProps?: MaybeRefOrGetter<Partial<MazIconProps>>,
  options: UseMazIconPropsOptions = {},
) {
  const decorative = options.decorative !== false

  const iconProps = computed<ResolvedMazIconProps | undefined>(() => {
    const v = toValue(props)
    if (!v)
      return undefined

    let inner: MazIconValue
    let extra: Partial<MazIconProps> | undefined

    if (typeof v === 'string') {
      inner = v
    }
    else if (isComponent(v)) {
      inner = markRaw(v)
    }
    else if ('icon' in v && v.icon && (typeof v.icon === 'string' || isComponent(v.icon))) {
      inner = isComponent(v.icon) ? markRaw(v.icon) : v.icon
      extra = v
    }
    else {
      return undefined
    }

    const defaults = toValue(defaultProps)
    const result = { ...defaults, ...extra, icon: inner } as ResolvedMazIconProps
    if (decorative && result['aria-hidden'] === undefined)
      result['aria-hidden'] = true
    return result
  })

  return { iconProps }
}
