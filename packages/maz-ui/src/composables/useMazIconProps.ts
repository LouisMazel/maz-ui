import type { MaybeRefOrGetter } from 'vue'
import type { MazIconProps } from '../components/MazIcon.vue'
import type { MazIconLike, ResolvedMazIconProps, UseMazIconPropsOptions } from '../utils/resolveMazIconProps'
import { computed, toValue } from 'vue'
import { resolveMazIconProps } from '../utils/resolveMazIconProps'

export type { MazIconLike, ResolvedMazIconProps, UseMazIconPropsOptions } from '../utils/resolveMazIconProps'

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
  const iconProps = computed<ResolvedMazIconProps | undefined>(() => resolveMazIconProps(toValue(props), toValue(defaultProps), options))

  return { iconProps }
}
