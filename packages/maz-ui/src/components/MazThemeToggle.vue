<script lang="ts" setup>
import type { MazBtnProps } from './MazBtn.vue'
import type { MazMorphIconProps } from './MazMorphIcon.vue'
import type { MazColor, MazNeutralColor, MazSize } from './types.ts'
import { MazComputerDesktop } from '@maz-ui/icons/raw/MazComputerDesktop'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onMounted, ref } from 'vue'
import MazBtn from './MazBtn.vue'
import MazIcon from './MazIcon.vue'
import MazMorphIcon from './MazMorphIcon.vue'

export type MazThemeToggleMode = 'light' | 'dark' | 'auto'

export interface MazThemeToggleProps {
  /**
   * Cycles light, dark and system (the setting of the operating system) instead of light and dark
   * @default false
   */
  triState?: boolean
  /**
   * Size of the button
   * @values mini, xs, sm, md, lg, xl
   * @default md
   */
  size?: MazSize
  /**
   * Color of the button
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, neutral, surface, container, transparent
   * @default transparent
   */
  color?: MazColor | MazNeutralColor
  /**
   * The icon morphs between the sun and the moon. `false` swaps them without motion
   * @default true
   */
  animated?: boolean
}

defineOptions({
  name: 'MazThemeToggle',
})

const {
  triState = false,
  size = 'md',
  color = 'transparent',
  animated = true,
} = defineProps<MazThemeToggleProps>()

const emits = defineEmits<{
  /**
   * Emitted after the color mode is changed by the button
   * @property {'light' | 'dark' | 'auto'} mode the new color mode
   */
  change: [mode: MazThemeToggleMode]
}>()

defineSlots<{
  /**
   * Replaces the icon
   * @binding {boolean} is-dark `true` when the dark mode is applied
   * @binding {'light' | 'dark' | 'auto'} mode the current color mode
   */
  icon?: (props: { isDark: boolean, mode: MazThemeToggleMode }) => unknown
}>()

const MORPH_SIZE: Record<MazSize, MazMorphIconProps['size']> = {
  mini: '1rem',
  xs: '1.125rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '1.75rem',
  xl: '2rem',
}

const NEXT_MODE: Record<MazThemeToggleMode, MazThemeToggleMode> = {
  light: 'dark',
  dark: 'auto',
  auto: 'light',
}

const { t } = useTranslations()
const { colorMode, isDark, setColorMode } = useTheme()

/**
 * The theme is read from the cookie or the storage in the browser only: the first render is the one of the
 * server (light), the real state comes after the mount, without motion
 */
const isMounted = ref(false)
const isSettled = ref(false)

onMounted(async () => {
  isMounted.value = true
  await nextTick()
  requestAnimationFrame(() => {
    isSettled.value = true
  })
})

const currentMode = computed<MazThemeToggleMode>(() => {
  if (!isMounted.value)
    return 'light'

  if (triState)
    return colorMode.value ?? 'light'

  return isDark.value ? 'dark' : 'light'
})

const isDisplayedDark = computed(() => isMounted.value && isDark.value)
const isSystem = computed(() => triState && currentMode.value === 'auto')
const nextMode = computed<MazThemeToggleMode>(() => {
  if (!triState)
    return currentMode.value === 'dark' ? 'light' : 'dark'

  return NEXT_MODE[currentMode.value]
})

const label = computed(() => {
  if (nextMode.value === 'dark')
    return t('themeToggle.toDark')
  if (nextMode.value === 'auto')
    return t('themeToggle.toSystem')

  return t('themeToggle.toLight')
})

const hasMotion = computed(() => animated && isSettled.value)

const btnProps = computed<MazBtnProps>(() => ({
  fab: true,
  color,
  size,
  type: 'button',
}))

function toggle() {
  const mode = nextMode.value

  void setColorMode(mode)
  emits('change', mode)
}
</script>

<template>
  <MazBtn
    v-bind="btnProps"
    class="m-theme-toggle"
    :class="{ '--no-motion': !hasMotion, '--system': isSystem }"
    :aria-label="label"
    :title="label"
    :data-mode="currentMode"
    @click="toggle"
  >
    <template #icon>
      <!--
        @slot Replaces the icon
        @binding {boolean} is-dark `true` when the dark mode is applied
        @binding {'light' | 'dark' | 'auto'} mode the current color mode
      -->
      <slot name="icon" :is-dark="isDisplayedDark" :mode="currentMode">
        <span class="m-theme-toggle__icons">
          <MazMorphIcon
            class="m-theme-toggle__morph"
            name="sun-moon"
            :active="isDisplayedDark"
            :size="MORPH_SIZE[size]"
          />
          <MazIcon
            v-if="triState"
            class="m-theme-toggle__system"
            :icon="MazComputerDesktop"
            :size="MORPH_SIZE[size]"
            aria-hidden="true"
          />
        </span>
      </slot>
    </template>
  </MazBtn>
</template>

<style scoped>
.m-theme-toggle__icons {
  display: inline-grid;
  place-items: center;
}

.m-theme-toggle__icons > * {
  grid-area: 1 / 1;
}

.m-theme-toggle__morph,
.m-theme-toggle__system {
  transition:
    opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-spring, ease-out);
}

.m-theme-toggle__system {
  opacity: 0;
  transform: scale(0.5) rotate(-45deg);
}

.m-theme-toggle.--system .m-theme-toggle__morph {
  opacity: 0;
  transform: scale(0.5) rotate(45deg);
}

.m-theme-toggle.--system .m-theme-toggle__system {
  opacity: 1;
  transform: none;
}

.m-theme-toggle.--no-motion .m-theme-toggle__morph,
.m-theme-toggle.--no-motion .m-theme-toggle__system,
.m-theme-toggle.--no-motion :deep(.m-morph-icon__part) {
  transition: none;
}
</style>
