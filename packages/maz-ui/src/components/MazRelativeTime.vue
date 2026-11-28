<script lang="ts" setup>
import type { RelativeTimeInput, RelativeTimeNumeric, RelativeTimeStyle } from '@maz-ui/utils/helpers/formatRelativeTime'
import { computed } from 'vue'
import { useRelativeTime } from '../composables/useRelativeTime.ts'
import MazRollingText from './MazRollingText.vue'

export interface MazRelativeTimeProps {
  /**
   * The date to describe: a `Date`, a timestamp in milliseconds or a date string. A date in the past reads `3 minutes ago`, in the future `in 3 minutes`
   */
  date: RelativeTimeInput
  /**
   * Any BCP 47 locale (`fr`, `en-US`...). Falls back to the locale of `@maz-ui/translations` when its plugin is installed,
   * then to the locale of the browser
   */
  locale?: string
  /**
   * Length of the units
   * @values `'long' | 'short' | 'narrow'`
   * @default 'long'
   */
  style?: RelativeTimeStyle
  /**
   * `auto` uses words like `yesterday` when they exist, `always` always uses a number
   * @values `'auto' | 'always'`
   * @default 'auto'
   */
  numeric?: RelativeTimeNumeric
  /**
   * Roll the characters that change. When `false`, the text changes instantly
   * @default true
   */
  animated?: boolean
  /**
   * Show the exact date in a native tooltip on hover
   * @default true
   */
  title?: boolean
}

const {
  date,
  locale = undefined,
  style = 'long',
  numeric = 'auto',
  animated = true,
  title = true,
} = defineProps<MazRelativeTimeProps>()

const { text, title: fullDate } = useRelativeTime(
  () => date,
  () => ({ locale, style, numeric }),
)

const dateTime = computed(() => {
  const value = date instanceof Date ? date : new Date(date)

  return Number.isNaN(value.getTime())
    ? undefined
    : value.toISOString()
})
</script>

<template>
  <time
    class="m-relative-time m-reset-css"
    :datetime="dateTime"
    :title="title && fullDate ? fullDate : undefined"
    data-allow-mismatch
  >
    <MazRollingText :value="text" :animated="animated" />
  </time>
</template>
