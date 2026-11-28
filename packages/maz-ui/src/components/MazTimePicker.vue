<script lang="ts" setup>
import type { MazInputProps } from './MazInput.vue'
import type { MazPopoverProps } from './MazPopover.vue'
import type { MazColor } from './types.ts'
import { MazChevronDown } from '@maz-ui/icons/raw/MazChevronDown'
import { MazClock } from '@maz-ui/icons/static/MazClock'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, ref } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazIcon from './MazIcon.vue'
import MazInput from './MazInput.vue'
import MazPopover from './MazPopover.vue'
import MazTimePickerPanel from './MazTimePicker/MazTimePickerPanel.vue'
import { formatTime, normalizeTime, uses12Hours } from './MazTimePicker/utils.ts'

export interface MazTimePickerProps {
  /**
   * The time, as a `HH:mm` string (24 hours, `14:30`). `null` or empty when nothing is chosen
   * @model
   * @type {string | null}
   * @example "14:30"
   */
  modelValue?: string | null
  /**
   * `wheel`: wheels that snap like on iOS, `slots`: the list of the times of a day as a grid
   * @values wheel, slots
   * @default 'wheel'
   */
  variant?: 'wheel' | 'slots'
  /**
   * `12h` (with AM/PM) or `24h`. By default it follows the locale
   * @values 12h, 24h
   */
  format?: '12h' | '24h'
  /**
   * Minutes between two choices. Defaults to `1` for the wheels and `30` for the slots
   */
  step?: number
  /**
   * The exact list of the available times (`HH:mm`), for the `slots` variant. Replaces `min`, `max` and `step`
   * @example ['09:00', '09:45', '11:15']
   */
  slots?: string[]
  /**
   * Earliest time (`HH:mm`)
   * @default '00:00'
   */
  min?: string
  /**
   * Latest time (`HH:mm`)
   * @default '23:59'
   */
  max?: string
  /**
   * Times (`HH:mm`) that cannot be chosen
   */
  disabledTimes?: string[]
  /**
   * Shows the picker in the page, without field nor popover
   * @default false
   */
  inline?: boolean
  /**
   * Locale of the times and of the AM/PM. Defaults to the locale of `@maz-ui/translations`
   */
  locale?: string
  /**
   * Label of the field
   */
  label?: string
  /**
   * Placeholder of the field
   */
  placeholder?: string
  /**
   * Color of the picker
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, neutral
   * @default 'primary'
   */
  color?: MazColor
  /**
   * Disables the picker
   * @default false
   */
  disabled?: boolean
  /**
   * The field takes the whole width
   * @default false
   */
  block?: boolean
  /**
   * Name of the inputs, for a native form
   */
  name?: string
  /**
   * Props of the field (`MazInput`)
   */
  inputProps?: MazInputProps
  /**
   * Position of the popover
   * @default 'auto'
   */
  pickerPosition?: MazPopoverProps['position']
}

export interface MazTimePickerEmits {
  /**
   * Emitted when the time changes (`HH:mm`)
   */
  (event: 'update:model-value', value: string): void
  /**
   * Emitted when the user chooses a slot, or presses Enter in a wheel
   */
  (event: 'select', value: string): void
}

const {
  modelValue,
  variant = 'wheel',
  format,
  step,
  slots,
  min,
  max,
  disabledTimes,
  inline = false,
  locale: localeProp,
  label,
  placeholder,
  color = 'primary',
  disabled = false,
  block = false,
  name,
  inputProps,
  pickerPosition = 'auto',
} = defineProps<MazTimePickerProps>()

const emit = defineEmits<MazTimePickerEmits>()

const { t, locale: translationsLocale } = useTranslations()
const instanceId = useInstanceUniqId({ componentName: 'MazTimePicker' })
const open = ref(false)

const locale = computed(() => localeProp || translationsLocale.value || undefined)
const hour12 = computed(() => (format ? format === '12h' : uses12Hours(locale.value)))
const effectiveStep = computed(() => step ?? (variant === 'wheel' ? 1 : 30))
const normalized = computed(() => normalizeTime(modelValue))
const displayValue = computed(() => (normalized.value ? formatTime(normalized.value, locale.value, hour12.value) : ''))
const fieldLabel = computed(() => label || t('timePicker.label'))

function onUpdate(value: string) {
  emit('update:model-value', value)
}

function onSelect(value: string, close: () => void) {
  emit('select', value)
  if (variant === 'slots')
    close()
}
</script>

<template>
  <MazTimePickerPanel
    v-if="inline"
    class="m-time-picker m-reset-css"
    :model-value="normalized"
    :variant
    :hour12
    :locale
    :step="effectiveStep"
    :slots
    :min
    :max
    :disabled-times
    :color
    :disabled
    :name
    @update:model-value="onUpdate"
    @select="emit('select', $event)"
  />

  <MazPopover
    v-else
    :id="`${instanceId}-popover`"
    v-model="open"
    class="m-time-picker m-reset-css maz:relative maz:inline-block"
    :class="{ 'maz:w-full': block }"
    trigger="click"
    :offset="0"
    :disabled
    :block
    :position="pickerPosition"
    prefer-position="bottom-start"
    :position-reference="`#${instanceId}-popover .m-input-wrapper`"
  >
    <template #trigger>
      <MazInput
        :id="instanceId"
        :model-value="displayValue"
        readonly
        role="combobox"
        aria-haspopup="dialog"
        :aria-expanded="String(open)"
        :aria-controls="open ? `${instanceId}-popover-panel` : undefined"
        v-bind="inputProps"
        block
        autocomplete="off"
        class="m-time-picker__input maz:w-full"
        :label="fieldLabel"
        :placeholder
        :disabled
        :color
        :name
      >
        <template #start-icon>
          <MazIcon :icon="MazClock" class="maz:text-xl" aria-hidden="true" />
        </template>
        <template #end-icon>
          <MazIcon :icon="MazChevronDown" class="maz:text-lg" aria-hidden="true" />
        </template>
      </MazInput>
    </template>

    <template #default="{ close }">
      <MazTimePickerPanel
        :model-value="normalized"
        :variant
        :hour12
        :locale
        :step="effectiveStep"
        :slots
        :min
        :max
        :disabled-times
        :color
        :disabled
        :name
        @update:model-value="onUpdate"
        @select="onSelect($event, close)"
      />
    </template>
  </MazPopover>
</template>
