<script lang="ts" setup generic="Option extends { name: string, code: DisplayNameCode | string }">
import type { MazTranslationsNestedSchema } from '@maz-ui/translations/src/types.js'
import type { HTMLAttributes } from 'vue'

import type { CodesType, DisplayNameCode, DisplayNamesOptions } from '../composables/useDisplayNames'
import type { MazPopoverProps } from './MazPopover.vue'
import type { MazSelectProps } from './MazSelect.vue'
import type { MazColor, MazSize } from './types'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
import { getBrowserLocale } from '@maz-ui/utils/src/helpers/getBrowserLocale.js'
import { getCountryFlagUrl } from '@maz-ui/utils/src/helpers/getCountryFlagUrl.js'
import { computed, defineAsyncComponent } from 'vue'
import { useDisplayNames } from '../composables/useDisplayNames'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import MazSelect from './MazSelect.vue'

export interface MazSelectCountryProps<Option extends { name: string, code: DisplayNameCode | string } = { name: string, code: string }> extends Omit<MazSelectProps<Option['code'], Option, false>, 'options' | 'multiple'> {
  /**
   * Style attribut of the component root element
   * @type {HTMLAttributes['style']}
   */
  style?: HTMLAttributes['style']
  /**
   * Class attribut of the component root element
   * @type {HTMLAttributes['class']}
   */
  class?: HTMLAttributes['class']
  /**
   * Id of the component
   */
  id?: string
  /**
   * Color of the component
   * @type {MazColor}
   * @default primary
   */
  color?: MazColor
  /**
   * Size of the component
   * @type {MazSize}
   * @default md
   */
  size?: MazSize
  /**
   * Preferred countries to display
   * @type {Option['code'][]}
   */
  preferredCodes?: Option['code'][]
  /**
   * Ignored countries to display
   * @type {Option['code'][]}
   */
  ignoredCodes?: Option['code'][]
  /**
   * Only countries to display
   * @type {Option['code'][]}
   */
  onlyCodes?: Option['code'][]
  /**
   * Position of the list
   * @type {MazPopoverProps['position']}
   * @default 'auto'
   */
  listPosition?: MazPopoverProps['position']
  /**
   * Hide flags
   */
  hideFlags?: boolean
  /**
   * Display search input in options list
   * @type {boolean}
   * @default true
   */
  search?: boolean
  /**
   * Show code on list
   * @default false
   */
  showCodeInList?: boolean
  /**
   * Locale
   * @type {string}
   * @default locale defined within the maz-ui plugin or browser locale or en-US
   */
  locale?: string
  /**
   * Success state
   */
  success?: boolean
  /**
   * Error state
   */
  error?: boolean
  /**
   * Warning state
   */
  warning?: boolean
  /**
   *
   */
  displayCode?: boolean
  /**
   * Search threshold
   */
  searchThreshold?: number
  /**
   * Translations
   * @type {Partial<MazTranslationsNestedSchema['selectCountry']>}
   * @default MazTranslationsNestedSchema['selectCountry']
   */
  translations?: Partial<MazTranslationsNestedSchema['selectCountry']>
  /**
   * Hint message displayed
   */
  hint?: string

  /**
   * Options
   * @type {Option[]}
   */
  options?: Option[]

  /**
   * Display name type
   * @type {Intl.DisplayNamesOptions}
   * @default { type: 'region', languageDisplay: 'standard', fallback: 'code', style: 'long' }
   */
  displayNamesOptions?: DisplayNamesOptions

  /**
   * Codes type
   * @type {CodesType}
   * @default defined by displayNamesOptions.type (if 'region', 'country' is used, otherwise 'iso')
   * @values 'iso' | 'bcp' | 'country' | 'all'
   */
  codesType?: CodesType

  /**
   * Open the select
   * @type {boolean}
   * @default false
   */
  open?: boolean
}

const {
  id,
  listPosition,
  preferredCodes,
  ignoredCodes,
  onlyCodes,
  options,
  class: className,
  locale: componentLocale,
  size = 'md',
  color = 'primary',
  label,
  hint,
  translations,
  search = true,
  displayNamesOptions = { type: 'region', languageDisplay: 'standard', fallback: 'code', style: 'long' },
  block,
  autocomplete,
  disabled,
  displayCode,
  error,
  warning,
  success,
  searchThreshold,
  placeholder,
  hideFlags,
  itemHeight,
  maxListWidth = 250,
  minListWidth = 200,
  optionInputValueKey = 'name',
  optionLabelKey = 'name',
  optionValueKey = 'code',
  modelValue,
  maxListHeight,
  minListHeight,
  required,
  searchFunction,
  showCodeInList = false,
  style,
  codesType,
  formatInputValue,
} = defineProps<MazSelectCountryProps<Option>>()

defineEmits<{
  /**
   * Emitted when the model value changes
   * @property {Option['code'] | undefined} value - The new value
   */
  'update:model-value': [value?: Option['code']]
}>()

const instanceId = useInstanceUniqId({
  componentName: 'MazSelectCountry',
  providedId: id,
})

const { t, locale: mazLocale } = useTranslations()
const locale = computed(() => componentLocale ?? mazLocale.value ?? getBrowserLocale())

const MazLazyImg = defineAsyncComponent(() => import('./MazLazyImg.vue'))

const { getAllDisplayNames } = useDisplayNames(locale)

const _codesType = computed<CodesType>(() => {
  if (codesType) {
    return codesType
  }

  if (displayNamesOptions.type === 'region') {
    return 'country'
  }

  return 'iso'
})

const displayNames = getAllDisplayNames({
  type: () => displayNamesOptions.type,
  languageDisplay: () => displayNamesOptions.languageDisplay,
  fallback: () => displayNamesOptions.fallback,
  style: () => displayNamesOptions.style,
  onlyCodes: () => onlyCodes,
  excludedCodes: () => ignoredCodes,
  preferredCodes: () => preferredCodes,
  codesType: _codesType,
})

const countriesOptions = computed<Option[]>(() => {
  if (options) {
    return options
  }

  return (displayNames?.value ?? []) as Option[]
})

const messages = computed<MazTranslationsNestedSchema['selectCountry']>(() => ({
  searchPlaceholder: translations?.searchPlaceholder ?? t('selectCountry.searchPlaceholder'),
}))

function getFlagUrl(code: Option['code'], size: Parameters<typeof getCountryFlagUrl>[1] = 'h20') {
  return getCountryFlagUrl(code.slice(0, 2), size) || getCountryFlagUrl(code.slice(3, 5), size) || getCountryFlagUrl(code, size)
}

const flagUrl = computed(() => {
  if (!modelValue) {
    return undefined
  }

  return getFlagUrl(modelValue)
})
</script>

<template>
  <div class="m-select-country m-reset-css" :class="[className, { '--no-flags': hideFlags }]" :style="style">
    <MazSelect
      :id="instanceId"
      :model-value="modelValue"
      v-bind="$attrs"
      class="m-select-country__select"
      :option-value-key
      :option-label-key
      :option-input-value-key="displayCode ? 'code' : optionInputValueKey"
      :max-list-width
      :min-list-width
      :disabled
      :color
      :placeholder
      :label
      :size
      :multiple="false"
      :list-position
      :error
      :warning
      :success
      :search
      :block
      :autocomplete
      :item-height
      :max-list-height
      :min-list-height
      :required
      :search-function
      :format-input-value
      :translations="messages"
      :search-threshold
      :options="countriesOptions"
      :hint="hint"
      :open
      @update:model-value="$emit('update:model-value', $event)"
    >
      <template #left-icon>
        <!--
          @slot Country selector flag
            @binding {String} country-code - current selected country code - Ex: `"FR"`
        -->
        <slot name="selector-flag" :country-code="modelValue">
          <MazLazyImg
            v-if="flagUrl && !hideFlags"
            :src="flagUrl"
            :alt="modelValue"
            width="20"
            height="20"
            class="maz-size-5 maz-rounded"
            img-class="maz-size-5 maz-rounded"
          />
        </slot>
      </template>
      <template #no-results>
        <slot name="no-results" />
      </template>
      <template #default="{ option, isSelected }">
        <div
          class="m-select-country__select__item"
          :class="{
            'm-select-country__select__item--selected': isSelected,
          }"
        >
          <span v-if="!hideFlags && typeof option.code === 'string'" class="m-select-country__select__item__flag-container">
            <!--
              @slot Country list flag
                @binding {{ code: string; name: string; }} option - country data
                @binding {Boolean} is-selected - `true` if option is selected
            -->
            <slot
              name="country-list-flag"
              :option="option"
              :is-selected="isSelected"
            >
              <MazLazyImg
                v-if="option.code && getFlagUrl(option.code)"
                :src="getFlagUrl(option.code)"
                :alt="`${option.name} flag`"
                width="20"
                height="20"
                class="maz-size-5 maz-rounded"
                img-class="maz-rounded maz-h-5 maz-w-5"
              />
              <span v-else class="m-select-country__select__item__list-flag">
                {{ option.code }}
              </span>
            </slot>
          </span>
          <div class="maz-flex maz-flex-1 maz-gap-2 maz-truncate" :class="{ 'maz-font-semibold': isSelected }">
            <slot v-if="showCodeInList" name="country-list-code" :option="option" :is-selected="isSelected">
              <span class="maz-text-muted">
                {{ option.code }}
              </span>
            </slot>
            <slot name="country-list-name" :option="option" :is-selected="isSelected">
              <span>
                {{ option.name }}
              </span>
            </slot>
          </div>
        </div>
      </template>
    </MazSelect>
  </div>
</template>

<style lang="postcss" scoped>
.m-select-country {
  @apply maz-relative maz-inline-flex;

  &__country-flag {
    position: absolute;
    left: 0.813rem;
    z-index: 4;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    top: 1.25rem;
    cursor: pointer;

    @apply maz-flex maz-flex-center;

    &.--should-have-bottom-flag {
      bottom: 2px;
    }
  }

  &__select {
    &:deep(.m-input-label) {
      @apply !maz-p-0;
    }

    &__item {
      @apply maz-w-full maz-text-sm maz-flex maz-items-center maz-gap-2 maz-truncate;

      &__flag-container {
        @apply maz-flex maz-flex-center;
      }

      &__list-flag {
        @apply maz-text-primary-foreground/80 maz-text-xs maz-size-5 maz-flex maz-flex-center maz-rounded-full maz-bg-primary-500 maz-leading-none;
      }
    }
  }
}
</style>
