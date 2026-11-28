<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazAvatarProps } from './MazAvatar.vue'
import type { MazRoundedSize, MazSize, MazSizeUnit } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed } from 'vue'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import MazAvatar from './MazAvatar.vue'

export interface MazAvatarGroupProps {
  /** The class of the component */
  class?: HTMLAttributes['class']
  /** The avatars, with the props of `MazAvatar` (`src`, `caption`, `alt`...) */
  avatars: MazAvatarProps[]
  /**
   * Number of avatars displayed. The others are counted in a "+N" avatar. Without it, all are displayed
   */
  max?: number
  /**
   * Size of the avatars, applied to all of them
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` or a CSS unit like `'2rem'`
   * @default 'md'
   */
  size?: MazSize | MazSizeUnit
  /**
   * Share of an avatar hidden by the next one, from `0` (side by side) to `1`
   * @default 0.2
   */
  overlap?: number
  /**
   * Shape of the avatars
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'full'
   */
  roundedSize?: MazRoundedSize
  /**
   * Slide the avatars apart when the group is hovered or has the focus
   * @default true
   */
  spread?: boolean
  /**
   * Make the "+N" avatar a button (it emits `more-click`), to open a list for example
   * @default false
   */
  moreClickable?: boolean
}

const {
  class: className = undefined,
  avatars,
  max = undefined,
  size = 'md',
  overlap = 0.2,
  roundedSize = 'full',
  spread = true,
  moreClickable = false,
} = defineProps<MazAvatarGroupProps>()

defineEmits<{
  /** Emitted when the "+N" avatar is clicked (with `moreClickable`) */
  (name: 'more-click', event: MouseEvent): void
}>()

const { t } = useTranslations()

const SIZE_MAP: Record<MazSize, string> = {
  mini: '1.5rem',
  xs: '2rem',
  sm: '2.5rem',
  md: '3rem',
  lg: '3.5rem',
  xl: '4rem',
}

const resolvedSize = computed(() => (SIZE_MAP as Record<string, string>)[size] ?? size)

const visible = computed(() => max === undefined || max < 0 || avatars.length <= max ? avatars : avatars.slice(0, max))
const hidden = computed(() => avatars.slice(visible.value.length))
const count = computed(() => hidden.value.length)

const roundedClass = computed(() => ROUNDED_SIZE_CLASS[roundedSize === 'none' ? 'none' : roundedSize])

function getName(avatar: MazAvatarProps) {
  return avatar.caption || (avatar.alt && avatar.alt !== 'avatar image' ? avatar.alt : '')
}
</script>

<template>
  <ul
    class="m-avatar-group m-reset-css maz:m-0 maz:inline-flex maz:list-none maz:p-0"
    :class="[className, { 'm-avatar-group--spread': spread }]"
    :style="{ '--m-avatar-group-size': resolvedSize, '--m-avatar-group-overlap': overlap }"
  >
    <li
      v-for="(avatar, index) in visible"
      :key="avatar.caption || avatar.src || index"
      class="m-avatar-group__item maz:shrink-0"
      :class="roundedClass"
      :style="{ '--m-avatar-group-index': index }"
      :title="getName(avatar) || undefined"
    >
      <span class="maz:flex" aria-hidden="true">
        <MazAvatar
          v-bind="avatar"
          :size
          :rounded-size="roundedSize"
          :alt="avatar.alt ?? avatar.caption ?? undefined"
          :no-elevation="true"
        />
      </span>
      <span v-if="getName(avatar)" class="maz:sr-only">{{ getName(avatar) }}</span>
    </li>

    <li
      v-if="count > 0"
      class="m-avatar-group__item maz:shrink-0"
      :class="roundedClass"
      :style="{ '--m-avatar-group-index': visible.length }"
    >
      <!--
        @slot more - Replace the "+N" avatar, to wrap it in a popover for example
          @binding {number} count number of hidden avatars
          @binding {MazAvatarProps[]} hidden the hidden avatars
      -->
      <slot name="more" :count :hidden>
        <component
          :is="moreClickable ? 'button' : 'span'"
          class="m-avatar-group__more maz:flex maz:flex-center maz:font-semibold"
          :class="[roundedClass, { 'maz:cursor-interactive maz:border-0 maz:focus-ring': moreClickable }]"
          :type="moreClickable ? 'button' : undefined"
          @click="moreClickable ? $emit('more-click', $event) : undefined"
        >
          <span aria-hidden="true" dir="ltr">+{{ count }}</span>
          <span class="maz:sr-only">{{ t('aria.moreItems', { count }) }}</span>
        </component>
      </slot>
    </li>
  </ul>
</template>

<style scoped>
.m-avatar-group {
  --m-avatar-group-step: calc(var(--m-avatar-group-size) * var(--m-avatar-group-overlap));
  --m-avatar-group-direction: 1;
}

.m-avatar-group:dir(rtl) {
  --m-avatar-group-direction: -1;
}

.m-avatar-group__item {
  position: relative;
  box-shadow: 0 0 0 2px var(--maz-surface, white);
  transition: transform calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-spring, ease-out);
}

.m-avatar-group__item + .m-avatar-group__item {
  margin-inline-start: calc(var(--m-avatar-group-step) * -1);
}

.m-avatar-group__item:focus-within {
  z-index: 1;
}

.m-avatar-group--spread:hover .m-avatar-group__item,
.m-avatar-group--spread:focus-within .m-avatar-group__item {
  --m-avatar-group-shift: calc(var(--m-avatar-group-step) * var(--m-avatar-group-direction));

  transform: translateX(calc(var(--m-avatar-group-index) * var(--m-avatar-group-shift)));
}

.m-avatar-group__more {
  inline-size: var(--m-avatar-group-size);
  block-size: var(--m-avatar-group-size);
  background-color: var(--maz-neutral, #888);
  color: var(--maz-neutral-foreground, white);
  font-size: calc(var(--m-avatar-group-size) / 2.6);
}

@media (prefers-reduced-motion: reduce) {
  .m-avatar-group__item {
    transition: none;
  }
}
</style>
