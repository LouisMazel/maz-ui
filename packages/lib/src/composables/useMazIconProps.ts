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

function isComponentIcon(value: unknown): value is IconComponent {
  return typeof value === 'object' && value !== null
    && ('render' in value || 'setup' in value || 'template' in value)
}

function isPlainIcon(value: unknown): value is MazIconValue {
  return typeof value === 'string' || isComponentIcon(value)
}

function isPropsObject(value: unknown): value is MazIconProps {
  return typeof value === 'object' && value !== null && 'icon' in value
}

function isValidIconLike(value: MazIconLike): boolean {
  if (!value)
    return false
  if (isPlainIcon(value))
    return true
  if (isPropsObject(value))
    return Boolean(value.icon) && (typeof value.icon === 'string' || isComponentIcon(value.icon))
  return false
}

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
  const { decorative = true } = options

  const iconProps = computed<ResolvedMazIconProps | undefined>(() => {
    const icon = toValue(props)
    const defaults = toValue(defaultProps) ?? {}

    if (!isValidIconLike(icon))
      return undefined

    const a11y = decorative ? { 'aria-hidden': true as const } : {}

    if (isPlainIcon(icon)) {
      const value = isComponentIcon(icon) ? markRaw(icon) : icon
      return {
        ...a11y,
        ...defaults,
        icon: value,
      }
    }

    if (isPropsObject(icon)) {
      const merged: ResolvedMazIconProps = {
        ...a11y,
        ...defaults,
        ...icon,
      }
      if (merged.icon && isComponentIcon(merged.icon))
        merged.icon = markRaw(merged.icon)
      return merged
    }

    return undefined
  })

  return { iconProps }
}
