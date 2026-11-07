import type { MaybeRefOrGetter, Ref } from 'vue'
import { nextTick, onMounted, ref, toValue, watch } from 'vue'

export const CHART_ROLES = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'destructive',
  'foreground',
  'muted',
  'divider',
  'surface',
] as const

export type ChartRole = (typeof CHART_ROLES)[number]

export type ThemeColors = Record<ChartRole, (alpha?: number) => string>

function toRgb(context: CanvasRenderingContext2D, color: string) {
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data

  return (alpha = 1) => `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function useThemeColors(element: Ref<HTMLElement | undefined>, key?: MaybeRefOrGetter<unknown>) {
  const colors = ref<ThemeColors | null>(null)

  function read() {
    const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    if (!element.value || !context)
      return

    const probe = document.createElement('span')
    element.value.append(probe)
    colors.value = Object.fromEntries(CHART_ROLES.map((role) => {
      probe.style.color = `var(--maz-${role})`
      return [
        role,
        toRgb(context, getComputedStyle(probe).color),
      ]
    })) as ThemeColors
    probe.remove()
  }

  onMounted(read)
  watch(() => toValue(key), () => nextTick(read))

  return colors
}
