<script lang="ts" setup>
import { MazChevronLeft } from '@maz-ui/icons/raw/MazChevronLeft'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { capitalize } from '@maz-ui/utils/helpers/capitalize'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import dayjs from 'dayjs/esm/index.js'

import { computed, ref, watch } from 'vue'
import MazBtn from '../MazBtn.vue'
import MazIcon from '../MazIcon.vue'
import MazRollingText from '../MazRollingText.vue'

const props = defineProps({
  calendarDate: { type: String, default: undefined },
  locale: { type: String, required: true },
  double: { type: Boolean, required: true },
})

const emits = defineEmits([
  'previous',
  'next',
  'open-month-switcher',
  'open-year-switcher',
  'update:calendar-date',
])

const { t } = useTranslations()

const rollDirection = ref<'up' | 'down'>('up')

watch(
  () => props.calendarDate,
  (calendarDate, oldCalendarDate) => {
    rollDirection.value = dayjs(calendarDate).isBefore(oldCalendarDate, 'date')
      ? 'down'
      : 'up'
  },
)

const calendarDate2 = computed(() => dayjs(props.calendarDate))

const monthLabel = computed(() => {
  return props.double
    ? `${capitalize(
      formatDate(calendarDate2.value.format(), props.locale, { month: 'short' }) ?? calendarDate2.value.format(),
    )} - ${capitalize(
      formatDate(calendarDate2.value.add(1, 'month').format(), props.locale, {
        month: 'short',
      }) ?? calendarDate2.value.add(1, 'month').format(),
    )}`
    : capitalize(formatDate(calendarDate2.value.format(), props.locale, { month: 'short' }) ?? calendarDate2.value.format())
})

const yearLabel = computed(() =>
  formatDate(calendarDate2.value.format(), props.locale, { year: 'numeric' }),
)

function previousMonth() {
  emits('update:calendar-date', dayjs(props.calendarDate).subtract(1, 'month').format())
}

function nextMonth() {
  emits('update:calendar-date', dayjs(props.calendarDate).add(1, 'month').format())
}
</script>

<template>
  <div class="m-date-picker-calendar-switcher maz:flex maz:space-x-2 maz:border-b maz:border-divider maz:px-2 maz:py-1">
    <MazBtn size="xs" color="transparent" type="button" :aria-label="t('aria.previousMonth')" @click="previousMonth">
      <MazIcon :icon="MazChevronLeft" class="maz:text-lg maz:rtl:rotate-180" aria-hidden="true" />
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      type="button"
      class="m-date-picker-calendar-switcher__date maz:flex-1 maz:truncate maz:text-center"
      @click="$emit('open-month-switcher', $event)"
    >
      <MazRollingText :value="monthLabel" :direction="rollDirection" />
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      type="button"
      class="m-date-picker-calendar-switcher__date maz:flex-1 maz:truncate maz:text-center"
      @click="$emit('open-year-switcher', $event)"
    >
      <MazRollingText :value="yearLabel ?? ''" :direction="rollDirection" />
    </MazBtn>
    <MazBtn size="xs" color="transparent" type="button" :aria-label="t('aria.nextMonth')" @click="nextMonth">
      <MazIcon :icon="MazChevronLeft" class="maz:rotate-180 maz:text-lg maz:rtl:rotate-0" aria-hidden="true" />
    </MazBtn>
  </div>
</template>
