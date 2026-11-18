import type { RelativeTimeInput, RelativeTimeOptions, RelativeTimeResult, RelativeTimeUnit } from '@maz-ui/utils/helpers/formatRelativeTime'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import { getRelativeTime } from '@maz-ui/utils/helpers/formatRelativeTime'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { UserVisibility } from '@maz-ui/utils/helpers/userVisibility'
import { computed, getCurrentScope, onScopeDispose, ref, toValue, watch } from 'vue'

const MAX_TIMEOUT = 2_147_483_647

const DEFAULT_TITLE_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: 'long',
  timeStyle: 'short',
}

export interface UseRelativeTimeOptions extends Omit<RelativeTimeOptions, 'locale' | 'now'> {
  /**
   * Any BCP 47 locale. Falls back to the locale of `@maz-ui/translations` when its plugin is installed,
   * then to the locale of the browser
   * @default undefined
   */
  locale?: MaybeRefOrGetter<string | undefined>
  /**
   * Reference date. When set, the value never updates by itself (no timer)
   * @default Date.now()
   */
  now?: MaybeRefOrGetter<Date | number | undefined>
  /**
   * Refresh the text when it changes (one timer, scheduled at the next change)
   * @default true
   */
  autoUpdate?: MaybeRefOrGetter<boolean>
  /**
   * Stop the timer while the page is hidden and refresh when it is visible again
   * @default true
   */
  pauseWhenHidden?: boolean
  /**
   * Options of `Intl.DateTimeFormat` used for the `title` (full date)
   * @default { dateStyle: 'long', timeStyle: 'short' }
   */
  titleOptions?: Intl.DateTimeFormatOptions
}

export interface UseRelativeTimeReturn {
  /** Formatted text (`3 minutes ago`), empty when the date is missing or invalid */
  text: ComputedRef<string>
  /** Full localized date, useful for a `title` attribute, empty when the date is missing or invalid */
  title: ComputedRef<string>
  /** The chosen unit, `null` when the text is `now`, an absolute date, or empty */
  unit: ComputedRef<RelativeTimeUnit | null>
  /** Detailed result of `getRelativeTime`, `undefined` when the date is missing or invalid */
  result: ComputedRef<RelativeTimeResult | undefined>
  /** Recompute the text now and reschedule the timer */
  refresh: () => void
}

function getTranslationsLocale() {
  try {
    return useTranslations().locale
  }
  catch {
    return undefined
  }
}

export function useRelativeTime(
  date: MaybeRefOrGetter<RelativeTimeInput | null | undefined>,
  options?: MaybeRefOrGetter<UseRelativeTimeOptions | undefined>,
): UseRelativeTimeReturn {
  const translationsLocale = getTranslationsLocale()

  const tick = ref(0)
  const isVisible = ref(true)

  let timer: ReturnType<typeof setTimeout> | undefined
  let visibility: UserVisibility | undefined

  const resolvedOptions = computed(() => toValue(options) ?? {})
  const locale = computed(() => toValue(resolvedOptions.value.locale) || translationsLocale?.value || undefined)
  const customNow = computed(() => toValue(resolvedOptions.value.now))
  const isAutoUpdate = computed(() => (toValue(resolvedOptions.value.autoUpdate) ?? true) && customNow.value === undefined)

  const result = computed(() => {
    // eslint-disable-next-line ts/no-unused-expressions
    tick.value

    const value = toValue(date)

    if (value === null || value === undefined || value === '') {
      return undefined
    }

    const { format, style, numeric, thresholds, absoluteAfter, absoluteOptions } = resolvedOptions.value

    try {
      return getRelativeTime(value, {
        format,
        style,
        numeric,
        thresholds,
        absoluteAfter,
        absoluteOptions,
        locale: locale.value,
        now: customNow.value,
      })
    }
    catch (error) {
      console.warn('[maz-ui](useRelativeTime)', error)
      return undefined
    }
  })

  const text = computed(() => result.value?.text ?? '')

  const unit = computed(() => result.value?.unit ?? null)

  const title = computed(() => {
    if (!result.value) {
      return ''
    }

    return formatDate(result.value.date, result.value.locale, resolvedOptions.value.titleOptions ?? DEFAULT_TITLE_OPTIONS)
  })

  function clearTimer() {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function schedule() {
    clearTimer()

    if (!isClient() || !isAutoUpdate.value || !isVisible.value) {
      return
    }

    const delay = result.value?.nextUpdateIn

    if (delay === null || delay === undefined) {
      return
    }

    timer = setTimeout(refresh, Math.min(delay, MAX_TIMEOUT))
  }

  function refresh() {
    tick.value++
  }

  watch([result, isAutoUpdate, isVisible], schedule, { immediate: true })

  if ((toValue(options)?.pauseWhenHidden ?? true) && isClient()) {
    visibility = new UserVisibility(({ isVisible: visible }) => {
      const wasHidden = !isVisible.value
      isVisible.value = visible

      if (visible && wasHidden) {
        refresh()
      }
    })
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      clearTimer()
      visibility?.destroy()
    })
  }

  return { text, title, unit, result, refresh }
}
