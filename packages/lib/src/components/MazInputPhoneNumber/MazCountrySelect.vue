<script lang="ts" setup>
import type { CountryCode } from 'libphonenumber-js'

import type { HTMLAttributes } from 'vue'
import type { PopoverPosition } from '../MazPopover.vue'

import type { MazColor, MazSize } from '../types'

import type { MazInputPhoneNumberInjectedData } from './../MazInputPhoneNumber.vue'
import { getCountryFlagUrl } from '@maz-ui/utils/src/utils/getCountryFlagUrl.js'
import { truthyFilter } from '@maz-ui/utils/src/utils/truthyFilter.js'
import { computed, defineAsyncComponent, useTemplateRef } from 'vue'
import { useInjectStrict } from '../../composables/useInjectStrict'
import MazSelect from '../MazSelect.vue'
import { useMazInputPhoneNumber } from './useMazInputPhoneNumber'

export interface MazCountrySelectProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /**
   * Model value of the component
   * @type {CountryCode | undefined | null}
   * @default undefined
   */
  modelValue: CountryCode | undefined | null
  /**
   * Id of the component
   * @type {string}
   * @default "country-select"
   */
  id: string
  /**
   * Color of the component
   * @type {MazColor}
   * @default "primary"
   */
  color: MazColor
  /**
   * Size of the component
   * @type {MazSize}
   * @default "md"
   */
  size: MazSize
  /**
   * Preferred countries to display
   * @type {CountryCode[] | undefined}
   * @default undefined
   */
  preferredCountries: CountryCode[] | undefined
  /**
   * Ignored countries to display
   * @type {CountryCode[] | undefined}
   * @default undefined
   */
  ignoredCountries: CountryCode[] | undefined
  /**
   * Only countries to display
   * @type {CountryCode[] | undefined}
   * @default undefined
   */
  onlyCountries: CountryCode[] | undefined
  /**
   * Custom countries list
   * @type {Record<CountryCode, string> | undefined}
   * @default undefined
   */
  customCountriesList: Record<CountryCode, string> | undefined
  /**
   * Position of the list
   * @type {PopoverPosition | undefined}
   * @default "bottom-start"
   */
  listPosition: PopoverPosition | undefined
  /**
   * Hide flags
   * @type {boolean}
   * @default false
   */
  hideFlags: boolean
  /**
   * Search
   * @type {boolean}
   * @default true
   */
  search: boolean
  /**
   * Show code on list
   * @type {boolean}
   * @default false
   */
  showCodeOnList: boolean
  /**
   * Country locale
   * @type {string | undefined}
   * @default undefined
   */
  countryLocale: string | undefined
  /**
   * Success
   * @type {boolean}
   * @default false
   */
  success: boolean
  /**
   * Error
   * @type {boolean}
   * @default false
   */
  error: boolean
  /**
   * Country selector display name
   * @type {boolean}
   * @default false
   */
  displayCountryName: boolean
  /**
   * Search threshold
   * @type {number | undefined}
   * @default undefined
   */
  searchThreshold: number | undefined
  /**
   * Translations
   * @type {Record<string, string>}
   * @default MazTranslationsSchema['countrySelect']
   */
  translations: {
    error: string
    placeholder: string
    searchPlaceholder: string
  }
  /**
   * Disabled
   * @type {boolean}
   * @default false
   */
  disabled: boolean
}

const {
  listPosition,
  preferredCountries,
  ignoredCountries,
  onlyCountries,
  customCountriesList,
  class: className,
  countryLocale,
} = defineProps<MazCountrySelectProps>()

defineEmits<(event: 'update:model-value', countryCode?: CountryCode) => void>()

const MazLazyImg = defineAsyncComponent(() => import('../MazLazyImg.vue'))

const { phoneNumber } = useInjectStrict<MazInputPhoneNumberInjectedData>('data')

const selectRef = useTemplateRef('select')

const { getCountriesList } = useMazInputPhoneNumber()

const countries = computed(() => getCountriesList(countryLocale, customCountriesList))

const countriesList = computed(() =>
  countries.value?.filter(item => !ignoredCountries?.includes(item.iso2)),
)

const countriesFiltered = computed(() => {
  const countries = onlyCountries || preferredCountries
  return countries?.map(country =>
    countriesList.value?.find(item => item.iso2.includes(country)),
  )
})

const otherCountries = computed(() =>
  countriesList.value?.filter(item => !preferredCountries?.includes(item.iso2)),
)

const countriesSorted = computed(() => {
  if (preferredCountries) {
    return [...(countriesFiltered.value ?? []), ...(otherCountries.value ?? [])]
  }
  if (onlyCountries) {
    return countriesFiltered.value
  }
  return countriesList.value
})

const countryOptions = computed(() =>
  countriesSorted.value
    ?.map(country =>
      country
        ? {
            ...country,
            dialCode: `+${country.dialCode}`,
          }
        : undefined,
    )
    .filter(truthyFilter) ?? [],
)

function openCountryList() {
  selectRef.value?.open()
}
</script>

<template>
  <div class="m-country-select" :class="[className, { '--no-flags': hideFlags }]" :style="style">
    <button
      v-if="modelValue && !hideFlags"
      :id="`country-select-flag-button-${id}`"
      class="m-country-select__country-flag"
      tabindex="-1"
      type="button"
      :class="{
        '--should-have-bottom-flag': translations.placeholder.length > 0,
      }"
      @click="openCountryList"
    >
      <!--
        @slot Country selector flag
          @binding {String} country-code - current selected country code - Ex: `"FR"`
      -->
      <slot name="selector-flag" :country-code="modelValue">
        <MazLazyImg
          :src="getCountryFlagUrl(modelValue, 'h20')"
          :alt="modelValue"
          width="20"
          height="20"
          class="maz-size-4 maz-rounded"
          img-class="maz-size-4 maz-rounded"
        />
      </slot>
    </button>

    <MazSelect
      :id="`country-select-${id}`"
      ref="select"
      :model-value="modelValue"
      v-bind="$attrs"
      class="m-country-select__select"
      option-value-key="iso2"
      option-label-key="name"
      :option-input-value-key="displayCountryName ? 'name' : 'dialCode'"
      name="country"
      :max-list-width="250"
      :min-list-width="200"
      :disabled
      :color
      :size
      :error
      :list-position
      :item-height="38"
      :success
      :search
      :search-placeholder="translations.searchPlaceholder"
      :search-threshold
      :options="countryOptions"
      :hint="!!phoneNumber && !modelValue ? translations.error : undefined"
      :label="translations.placeholder"
      @update:model-value="$emit('update:model-value', $event as CountryCode)"
    >
      <template #no-results>
        <slot name="no-results" />
      </template>
      <template #default="{ option, isSelected }">
        <div
          class="m-country-select__select__item"
          :class="{
            'm-country-select__select__item--selected': isSelected,
          }"
        >
          <span v-if="!hideFlags && typeof option.iso2 === 'string'" class="m-country-select__select__item__flag-container">
            <!--
              @slot Country list flag
                @binding {String} country-code - country code of option - Ex: `"FR"`
                @binding {{ iso2: string; dialCode: string; name: string; }} option - country data
                @binding {Boolean} is-selected - `true` if option is selected
            -->
            <slot
              name="country-list-flag"
              :country-code="option.iso2"
              :option="option"
              :is-selected="isSelected"
            >
              <MazLazyImg
                :src="getCountryFlagUrl(option.iso2 as CountryCode, 'h20')"
                :alt="`${option.name} flag`"
                width="20"
                height="20"
                class="maz-size-5 maz-rounded"
                img-class="maz-rounded maz-h-5 maz-w-5"
              />
            </slot>
          </span>
          <span
            v-if="showCodeOnList"
            class="maz-w-9 maz-flex-none"
            :class="{ 'maz-text-muted': !isSelected }"
          >
            {{ option.dialCode }}
          </span>
          <span class="maz-flex-1 maz-truncate" :class="{ 'maz-font-semibold': isSelected }">
            {{ option.name }}
          </span>
        </div>
      </template>
    </MazSelect>
  </div>
</template>

<style lang="postcss" scoped>
.m-country-select {
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
    }
  }

  &:not(.--no-flags) {
    .m-country-select__select:deep(.m-select-input input) {
      @apply !maz-pl-10;
    }
  }
}

/* RESPONSIVE */
.m-input-phone-number {
  &.--responsive .m-country-select {
    @apply maz-min-w-full mob-m:maz-min-w-[inherit];

    &__select {
      @apply maz-min-w-full mob-m:maz-min-w-[inherit];

      &:deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-b-none mob-m:maz-rounded-b mob-m:maz-rounded-r-none;
      }
    }
  }

  &.--row .m-country-select {
    &__select {
      :deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-r-none;
      }
    }
  }

  &.--col .m-country-select {
    @apply maz-min-w-full;

    &__select {
      @apply maz-min-w-full;

      :deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-b-none maz-rounded-tr;
      }
    }
  }
}
</style>
