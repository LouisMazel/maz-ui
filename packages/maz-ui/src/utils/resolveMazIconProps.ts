import type { IconComponent } from '@maz-ui/icons'
import type { MazIconProps, MazIconValue } from '../components/MazIcon.vue'
import { markRaw } from 'vue'

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
   * gets `aria-hidden="true"`, unless it has a `title`. Set to `false` for icons that convey meaning
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
 * Normalize a flexible icon value into a fully-formed object that can be
 * `v-bind`-spread onto `<MazIcon>`, outside of a reactive context (a list of
 * options, each with its icon). Returns `undefined` when the input is empty
 * or invalid. `useMazIconProps` (composables) is its reactive form.
 *
 * @example
 * ```vue
 * <MazIcon v-for="item in items" v-bind="resolveMazIconProps(item.icon, { size: '1rem' })" />
 * ```
 */
export function resolveMazIconProps(
  value: MazIconLike,
  defaults?: Partial<MazIconProps>,
  options: UseMazIconPropsOptions = {},
): ResolvedMazIconProps | undefined {
  if (!value)
    return undefined

  let inner: MazIconValue
  let extra: Partial<MazIconProps> | undefined

  if (typeof value === 'string') {
    inner = value
  }
  else if (isComponent(value)) {
    inner = markRaw(value)
  }
  else if ('icon' in value && value.icon && (typeof value.icon === 'string' || isComponent(value.icon))) {
    inner = isComponent(value.icon)
      ? markRaw(value.icon)
      : value.icon
    extra = value
  }
  else {
    return undefined
  }

  const result = {
    ...defaults,
    ...extra,
    icon: inner,
  } as ResolvedMazIconProps
  if (options.decorative !== false && !result.title && result['aria-hidden'] === undefined)
    result['aria-hidden'] = true
  return result
}
