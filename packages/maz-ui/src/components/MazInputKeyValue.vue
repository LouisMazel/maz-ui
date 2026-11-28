<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { MazPlus } from '@maz-ui/icons/raw/MazPlus'
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { provideInnerFieldsWithoutTopLabel, useFieldTopLabel } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazInput from './MazInput.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  style,
  id,
  modelValue,
  label,
  topLabel,
  assistiveText,
  keyLabel,
  valueLabel,
  addLabel,
  disabled = false,
  error = false,
  success = false,
  warning = false,
  size = 'md',
  roundedSize = 'md',
  color = 'primary',
  block,
  maxItems,
} = defineProps<MazInputKeyValueProps>()

const emits = defineEmits<{
  /**
   * A pair is added, edited or removed. Pairs without a key and pairs with an already used key are not in the object
   * @property {Record<string, string>} value - the new object
   */
  'update:model-value': [value: Record<string, string>]
}>()

export interface MazInputKeyValueProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the component, the ids of the fields derive from it */
  id?: string
  /** @model The object of strings edited by the component */
  modelValue?: Record<string, string>
  /** The accessible name of the group of fields */
  label?: string
  /** Static label displayed above the fields */
  topLabel?: string
  /** Text displayed below the fields (help, error message) */
  assistiveText?: string
  /**
   * The label of the key fields
   * @default 'inputKeyValue.key' (translations)
   */
  keyLabel?: string
  /**
   * The label of the value fields
   * @default 'inputKeyValue.value' (translations)
   */
  valueLabel?: string
  /**
   * The text of the button adding a pair
   * @default 'inputKeyValue.add' (translations)
   */
  addLabel?: string
  /** Disable the fields and the buttons */
  disabled?: boolean
  /** Display the fields with error style */
  error?: boolean
  /** Display the fields with success style */
  success?: boolean
  /** Display the fields with warning style */
  warning?: boolean
  /**
   * The size of the fields, the same heights as `MazInput`
   * @default 'md'
   */
  size?: MazSize
  /**
   * The rounded size of the fields
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * The color of the focused fields and of the buttons
   * @default 'primary'
   */
  color?: MazColor
  /** The component will be displayed in full width */
  block?: boolean
  /** The maximum number of pairs, the add button is hidden when it is reached */
  maxItems?: number
}

interface Row {
  id: number
  key: string
  value: string
  focus: boolean
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const { t } = useTranslations()

const instanceId = useInstanceUniqId({
  componentName: 'MazInputKeyValue',
  providedId: id,
})

let rowCounter = 0

function fromObject(object: Record<string, string> = {}): Row[] {
  return Object.entries(object).map(([key, value]) => ({ id: rowCounter++, key, value, focus: false }))
}

const rows = ref<Row[]>(fromObject(modelValue))

const keyLabelValue = computed(() => keyLabel || t('inputKeyValue.key'))
const valueLabelValue = computed(() => valueLabel || t('inputKeyValue.value'))
const addLabelValue = computed(() => addLabel || t('inputKeyValue.add'))

const duplicateIds = computed(() => {
  const seen = new Set<string>()
  const duplicates = new Set<number>()

  for (const row of rows.value) {
    const key = row.key.trim()

    if (!key)
      continue

    if (seen.has(key))
      duplicates.add(row.id)
    else
      seen.add(key)
  }

  return duplicates
})

function toObject(): Record<string, string> {
  const result: Record<string, string> = {}

  for (const row of rows.value) {
    const key = row.key.trim()

    if (key && !duplicateIds.value.has(row.id))
      Object.defineProperty(result, key, { value: row.value, enumerable: true, writable: true, configurable: true })
  }

  return result
}

function isSameObject(a: Record<string, string>, b: Record<string, string>) {
  const keys = Object.keys(a)
  return keys.length === Object.keys(b).length && keys.every(key => a[key] === b[key])
}

watch(() => modelValue, (value) => {
  if (!isSameObject(value ?? {}, toObject()))
    rows.value = fromObject(value)
}, { deep: true })

function emitValue() {
  emits('update:model-value', toObject())
}

function updateRow(row: Row, field: 'key' | 'value', value?: string | number | null) {
  row[field] = String(value ?? '')
  emitValue()
}

function addRow() {
  rows.value.push({ id: rowCounter++, key: '', value: '', focus: true })
}

function removeRow(row: Row) {
  rows.value = rows.value.filter(item => item.id !== row.id)
  emitValue()
}

const canAdd = computed(() => !disabled && (maxItems === undefined || rows.value.length < maxItems))

function rowId(row: Row, part: 'key' | 'value') {
  return `${instanceId.value}-${row.id}-${part}`
}

const { topLabelText } = useFieldTopLabel(() => ({ label, topLabel }))
provideInnerFieldsWithoutTopLabel()

const labelId = computed(() => `${instanceId.value}-label`)
const assistiveTextId = computed(() => `${instanceId.value}-assistive-text`)

const stateTextClass = computed(() => {
  if (error)
    return 'maz:text-destructive-600!'
  if (success)
    return 'maz:text-success-600!'
  if (warning)
    return 'maz:text-warning-600!'
  return undefined
})

defineExpose({
  /** Add an empty pair and focus its key field */
  addRow,
})
</script>

<template>
  <div
    v-bind="$attrs"
    :id="instanceId"
    class="m-input-key-value m-reset-css maz:inline-flex maz:flex-col maz:gap-2 maz:align-top maz:text-foreground"
    :class="[classProp, { '--block': block, 'maz:w-full': block, '--disabled': disabled }]"
    :style
    role="group"
    :aria-label="topLabelText ? undefined : label"
    :aria-labelledby="topLabelText ? labelId : undefined"
    :aria-describedby="assistiveText ? assistiveTextId : undefined"
  >
    <span
      v-if="topLabelText"
      :id="labelId"
      class="m-input-key-value__top-label"
      :class="stateTextClass"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
    >
      {{ topLabelText }}
    </span>

    <div
      v-for="row in rows"
      :key="row.id"
      class="m-input-key-value__row maz:flex maz:items-start maz:gap-2"
    >
      <MazInput
        :id="rowId(row, 'key')"
        class="m-input-key-value__key maz:min-w-0 maz:flex-1"
        :model-value="row.key"
        :label="keyLabelValue"
        :size
        :color
        :rounded-size
        :disabled
        :success
        :warning
        :error="error || duplicateIds.has(row.id)"
        :assistive-text="duplicateIds.has(row.id) ? t('inputKeyValue.duplicateKey') : undefined"
        :auto-focus="row.focus"
        block
        @update:model-value="updateRow(row, 'key', $event)"
      />
      <MazInput
        :id="rowId(row, 'value')"
        class="m-input-key-value__value maz:min-w-0 maz:flex-1"
        :model-value="row.value"
        :label="valueLabelValue"
        :size
        :color
        :rounded-size
        :disabled
        :success
        :warning
        :error
        block
        @update:model-value="updateRow(row, 'value', $event)"
      />
      <MazBtn
        class="m-input-key-value__remove maz:flex-none"
        color="transparent"
        :size
        :icon="MazXMark"
        :disabled
        :aria-label="`${t('aria.remove')} ${row.key}`.trim()"
        @click="removeRow(row)"
      />
    </div>

    <div v-if="canAdd">
      <MazBtn
        class="m-input-key-value__add"
        :color
        :size
        variant="outline"
        :start-icon="MazPlus"
        @click="addRow"
      >
        {{ addLabelValue }}
      </MazBtn>
    </div>

    <div
      v-if="assistiveText"
      :id="assistiveTextId"
      class="m-input-key-value__assistive-text maz:text-body-sm"
      :class="stateTextClass || 'maz:text-muted'"
    >
      {{ assistiveText }}
    </div>
  </div>
</template>
