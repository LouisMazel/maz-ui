<template>
  <div
    :style="[calendarMinWidth]"
    class="calendar flex w-full flex-col rounded border border-gray-stroke bg-white"
  >
    <CalendarDays
      v-if="!noShowDay || !noShowDate"
      :days="days"
      :no-week-switch="noWeekSwitch"
      :day-format="titleDayFormat"
      :date-format="titleDateFormat"
      :no-show-day="noShowDay"
      :no-show-date="noShowDate"
      :can-forward-week="canForwardWeek"
      :can-back-week="canBackWeek"
      @previous-week="setPreviousWeek"
      @next-week="setNextWeek"
    />

    <CalendarBanner v-if="bannerMessage || $slots['banner-message']">
      <slot v-if="$slots['banner-message']" name="banner-message"></slot>
      <template v-else>
        {{ bannerMessage }}
      </template>
    </CalendarBanner>

    <CalendarSlotsButton
      v-if="!noSlotSwitch"
      :disabled="loading || isMinPage || loading"
      :no-x-offset="noWeekSwitch"
      variant="previous"
      class="mt-2"
      @click="setPreviousPage"
    >
      <span>
        <slot name="previous-slots-text"> Previous slots </slot>
      </span>
    </CalendarSlotsButton>

    <div
      class="calendar__main flex flex-col"
      :style="[calendarMainMinHeight]"
      :class="{ 'px-2': noWeekSwitch }"
    >
      <CalendarLoader v-if="loading" />
      <CalendarEmptySlots v-else-if="!hasSlotsAvailable || !hasSlotsPageAvailable">
        <span>
          <slot v-if="!hasSlotsAvailable" name="empty-slots-text">
            No slots available this week
          </slot>
          <slot v-else-if="!hasSlotsPageAvailable" name="empty-slots-hours-text">
            No slots available for these hours
          </slot>
        </span>
      </CalendarEmptySlots>

      <CalendarSlots
        v-else-if="selectedSlots"
        :no-x-offset="noWeekSwitch"
        :loading="loading"
        :days="daysWithSlotsFilteredPerPage"
        :show-end-date-slot="showEndDateSlot"
        :selected-slots="selectedSlots"
        :max-slots-reached="maxSlotsReached"
        :slot-format="slotFormat"
        @select-slot="selectSlot"
      />
    </div>
    <CalendarSlotsButton
      v-if="!noSlotSwitch"
      :disabled="loading || isMaxPage || loading"
      :no-x-offset="noWeekSwitch"
      variant="next"
      class="mb-2"
      @click="setNextPage"
    >
      <span>
        <slot name="next-slots-text"> Next slots </slot>
      </span>
    </CalendarSlotsButton>

    <CalendarFooter v-if="$slots['footer'] || $slots['footer-text']" :no-x-offset="noWeekSwitch">
      <template v-if="$slots['footer']" #default>
        <slot name="footer"></slot>
      </template>
      <template v-if="$slots['footer-text']" #text>
        <slot name="footer-text"></slot>
      </template>
    </CalendarFooter>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

  import CalendarDays from './CalendarDays.vue'
  import CalendarSlots from './CalendarSlots.vue'
  import CalendarLoader from './CalendarLoader.vue'
  import CalendarBanner from './CalendarBanner.vue'
  import CalendarFooter from './CalendarFooter.vue'
  import CalendarEmptySlots from './CalendarEmptySlots.vue'
  import CalendarSlotsButton from './CalendarSlotsButton.vue'

  import type { DaySlot, Day } from './types'

  const CALENDAR_SLOT_HEIGHT_REM = 5
  const CALENDAR_SLOT_WIDTH_REM = 6.8
  const CALENDAR_SLOT_END_DATE_WIDTH_REM = 9.5
  const CALENDAR_SPACE_BETWEEN_SLOTS_REM = 0.5
  const CALENDAR_SLOTS_PADDING_Y = 4
  const CALENDAR_GAP_BETWEEN_COLUMN = 2
  const CALENDAR_WEEK_BUTTON_WIDTH = 7

  function validateInputValue(value?: Partial<DaySlot> | null) {
    try {
      if (Array.isArray(value)) {
        const isValidPayload = value.length > 0 && value.every((slot) => !!slot.start && !!slot.end)

        if (!isValidPayload) {
          throw String(
            "Should be an array of days slots - Ex: \"[{ start: '2021-12-13 08:00', end: '2021-12-13 10:00' }]\"",
          )
        }

        return true
      }

      const isValidNoValue = value === undefined || value === null

      if (!isValidNoValue) {
        throw String(
          `The type "${typeof value}" is not correct - Can be one of ['undefined', 'null', 'Array<DaySlot>']`,
        )
      }

      return true
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(new Error(`[Calendar] Invalid prop "value" - ${error}`))
      return false
    }
  }

  @Component({
    components: {
      CalendarDays,
      CalendarSlots,
      CalendarLoader,
      CalendarBanner,
      CalendarFooter,
      CalendarEmptySlots,
      CalendarSlotsButton,
    },
  })
  export default class Calendar extends Vue {
    @Prop({ required: true, validator: (value) => validateInputValue(value) })
    value?: DaySlot[]

    @Prop({ required: true, type: Array })
    days!: Day[]

    @Prop({ type: Boolean, default: false })
    noWeekSwitch!: boolean

    @Prop({ type: Boolean, default: false })
    noSlotSwitch!: boolean

    @Prop({ type: Boolean, default: false })
    canBackWeek!: boolean

    @Prop({ default: false, type: Boolean })
    canForwardWeek!: boolean

    @Prop({ default: false, type: Boolean })
    loading!: boolean

    @Prop({ default: undefined, type: String })
    outputFormat?: string

    @Prop({ default: 'dddd', type: String })
    titleDayFormat!: string

    @Prop({ default: 'D MMM', type: String })
    titleDateFormat!: string

    @Prop({ default: 'HH[h]mm', type: String })
    slotFormat!: string

    @Prop({ default: undefined, type: String })
    bannerMessage!: string

    @Prop({ default: 0, type: Number })
    page!: number

    @Prop({ default: 0, type: Number })
    week!: number

    @Prop({ default: 5, type: Number })
    slotsCountPerPage!: number

    @Prop({ default: 0, type: Number })
    minPage!: number

    @Prop({ default: 40, type: Number })
    maxPage!: number

    @Prop({ default: undefined, type: Number })
    maxSlotsAllowed?: number

    @Prop({ type: Number, default: 1 })
    minSlotsAllowed!: number

    @Prop({ default: false, type: Boolean })
    noShowDay!: boolean

    @Prop({ default: false, type: Boolean })
    noShowDate!: boolean

    @Prop({ type: Boolean, default: false })
    showEndDateSlot?: boolean

    currentPage = 0
    currentWeek = 0
    tmpSelectedSlots: DaySlot[] = []

    get calendarMinWidth() {
      const daysCount = this.days.length
      const weekSwitchColumnsWidth = this.noWeekSwitch ? 0 : CALENDAR_WEEK_BUTTON_WIDTH * 2
      const slotMinWidth = this.showEndDateSlot
        ? CALENDAR_SLOT_END_DATE_WIDTH_REM
        : CALENDAR_SLOT_WIDTH_REM
      const calendarSlotsHorizontalPadding = this.noWeekSwitch ? 4 : 0

      return {
        minWidth: `${
          daysCount * slotMinWidth +
          daysCount * CALENDAR_GAP_BETWEEN_COLUMN +
          weekSwitchColumnsWidth +
          calendarSlotsHorizontalPadding
        }rem`,
      }
    }

    get calendarMainMinHeight() {
      return {
        minHeight: this.noSlotSwitch
          ? undefined
          : `${
              this.slotsCountPerPage * CALENDAR_SLOT_HEIGHT_REM +
              this.slotsCountPerPage * CALENDAR_SPACE_BETWEEN_SLOTS_REM +
              CALENDAR_SLOTS_PADDING_Y
            }rem`,
      }
    }

    get selectedSlots() {
      return this.tmpSelectedSlots
    }

    set selectedSlots(slots: DaySlot[] | undefined | null) {
      this.$emit('change')
      this.$emit('input', this.getSlotsFormatted(slots))
    }

    get daysWithSlotsFilteredPerPage() {
      return this.days.map((day) => ({
        ...day,
        slots: this.noSlotSwitch
          ? day.slots
          : day.slots?.slice(this.currentPage, this.currentPage + this.slotsCountPerPage),
      }))
    }

    get hasSlotsPageAvailable() {
      return this.daysWithSlotsFilteredPerPage.some(({ slots }) => slots?.length)
    }

    get hasSlotsAvailable() {
      return this.days.some(({ slots }) => slots?.length)
    }

    get isMinPage() {
      return this.currentPage <= this.minPage
    }

    get isMaxPage() {
      return this.currentPage >= this.maxPage
    }

    get maxSlotsReached() {
      return this.maxSlotsAllowed ? this.tmpSelectedSlots.length >= this.maxSlotsAllowed : false
    }

    get minSlotsReached() {
      return this.tmpSelectedSlots.length >= this.minSlotsAllowed
    }

    @Watch('days', { immediate: true, deep: true })
    @Watch('value', { immediate: true, deep: true })
    onValueOrDaysChanged() {
      if (this.value && this.value?.length > 1) {
        const selectedDaysSlots = [...this.tmpSelectedSlots, ...this.getSelectedSlotsInDays()]

        this.tmpSelectedSlots = this.removeDuplicate(selectedDaysSlots)
      }
    }

    removeDuplicate(daySlots: DaySlot[]) {
      return daySlots.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => this.isSameDate(t.start, value.start) && this.isSameDate(t.end, value.end),
          ),
      )
    }

    @Watch('page', { immediate: true })
    onPaginationChanged(page: number) {
      this.currentPage = page
    }

    @Watch('week', { immediate: true })
    onWeekChanged(week: number) {
      this.currentWeek = week
    }

    getSlotsFormatted(slots?: DaySlot[] | null): DaySlot[] | undefined {
      return slots?.map((slot) => ({
        ...slot,
        start: this.$dayjs(slot.start).format(this.outputFormat),
        end: this.$dayjs(slot.end).format(this.outputFormat),
      }))
    }

    getSlotInDaySlots(daySlots: DaySlot[], selectedValue: DaySlot) {
      return daySlots.find(
        (slot) =>
          this.isSameDate(slot.start, selectedValue.start) &&
          this.isSameDate(slot.end, selectedValue.end),
      )
    }

    getSelectedSlotsInDays() {
      if (!this.value?.length) {
        return []
      }

      const selectedSlots: DaySlot[] = []

      for (const day of this.days) {
        for (const selected of this.value) {
          if (day.slots) {
            const value = this.getSlotInDaySlots(day.slots, selected)

            if (value) {
              selectedSlots.push(value)
            }
          }
        }
      }

      return selectedSlots
    }

    setCurrentPage(page: number) {
      const newPage =
        page >= this.maxPage ? this.maxPage : page < this.minPage ? this.minPage : page
      this.currentPage = newPage
      this.$emit('page', newPage)
    }

    setPreviousPage() {
      this.setCurrentPage(this.currentPage - this.slotsCountPerPage)
      this.$emit('previous-page', this.currentPage)
    }

    setNextPage() {
      this.setCurrentPage(this.currentPage + 5)
      this.$emit('next-page', this.currentPage)
    }

    setCurrentWeek(week: number) {
      this.currentWeek = week
      this.$emit('week', this.currentWeek)
    }

    setNextWeek() {
      this.setCurrentPage(0)
      this.setCurrentWeek(this.currentWeek + 1)
      this.$emit('next-week', this.currentWeek)
    }

    setPreviousWeek() {
      this.setCurrentPage(0)
      this.setCurrentWeek(this.currentWeek - 1)
      this.$emit('previous-week', this.currentWeek)
    }

    isSameDate(dateOne: string, dateTwo: string) {
      return this.$dayjs(dateOne).isSame(dateTwo)
    }

    removeItem(selectedSlots: DaySlot[], slot: DaySlot): DaySlot[] {
      const index = selectedSlots.findIndex(
        ({ start, end }) => this.isSameDate(slot.start, start) && this.isSameDate(slot.end, end),
      )

      if (index > -1) {
        selectedSlots.splice(index, 1)
      }

      return selectedSlots
    }

    selectSlot(slot: DaySlot) {
      const alreadySelected = this.tmpSelectedSlots.some(
        ({ start, end }) => this.isSameDate(slot.start, start) && this.isSameDate(slot.end, end),
      )
      // already selected --> remove
      if (alreadySelected) {
        this.tmpSelectedSlots = this.removeItem(this.tmpSelectedSlots, slot)
        this.selectedSlots =
          this.minSlotsReached && this.tmpSelectedSlots.length > 0
            ? this.tmpSelectedSlots
            : undefined
        return
      }

      if (this.maxSlotsReached) {
        this.$emit('max-slots-reached')
        return
      }

      this.tmpSelectedSlots = [...this.tmpSelectedSlots, slot]

      if (this.minSlotsReached) {
        this.selectedSlots = this.tmpSelectedSlots
      }
    }
  }
</script>
