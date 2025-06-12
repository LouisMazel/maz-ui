<script lang="ts" setup>
import type { CountryCode } from 'libphonenumber-js'

import type { ComponentPublicInstance, HTMLAttributes } from 'vue'

import type { MazInputPhoneNumberInjectedData } from './../MazInputPhoneNumber.vue'
import type { MazColor, MazPosition, MazSize } from './../types'

import type { MazInputPhoneNumberTranslations } from './types'
import { computed, defineAsyncComponent, ref } from 'vue'

import { useInjectStrict } from '../../composables/useInjectStrict'
import { getCountryFlagUrl } from '../../utils/getCountryFlagUrl'
import { truthyFilter } from '../../utils/truthyFilter'
import MazSelect from '../MazSelect.vue'
import { useMazInputPhoneNumber } from './../MazInputPhoneNumber/useMazInputPhoneNumber'

const {
  listPosition,
  preferredCountries,
  ignoredCountries,
  onlyCountries,
  customCountriesList,
  excludedSelectors,
  class: className,
  countryLocale,
} = defineProps<{
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  modelValue: CountryCode | undefined | null
  id: string
  color: MazColor
  size: MazSize
  preferredCountries: CountryCode[] | undefined
  ignoredCountries: CountryCode[] | undefined
  onlyCountries: CountryCode[] | undefined
  customCountriesList: Record<CountryCode, string> | undefined
  locales: MazInputPhoneNumberTranslations
  listPosition: MazPosition | undefined
  hideFlags: boolean
  search: boolean
  disabled: boolean
  showCodeOnList: boolean
  countryLocale: string | undefined
  success: boolean
  error: boolean
  countrySelectorDisplayName: boolean
  searchThreshold: number | undefined
  width: string | undefined
  excludedSelectors: string[]
}>()

defineEmits<(event: 'update:model-value', countryCode?: CountryCode) => void>()

const MazLazyImg = defineAsyncComponent(() => import('../MazLazyImg.vue'))

const { phoneNumber } = useInjectStrict<MazInputPhoneNumberInjectedData>('data')

const CountrySelectorRef = ref<ComponentPublicInstance<typeof MazSelect> & { openList: () => void }>()

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

function focusCountrySelector() {
  CountrySelectorRef.value?.openList()
}
</script>

<template>
  <div class="m-country-selector" :class="[className, { '--no-flags': hideFlags }]" :style="style">
    <button
      v-if="modelValue && !hideFlags"
      :id="`country-selector-flag-button-${id}`"
      class="m-country-selector__country-flag"
      tabindex="-1"
      type="button"
      :class="{
        '--should-have-bottom-flag': locales.countrySelector.placeholder.length > 0,
      }"
      @click="focusCountrySelector"
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
          img-class="maz-w-5 maz-h-4 maz-rounded-sm"
        />
      </slot>
    </button>

    <MazSelect
      :id="`country-selector-${id}`"
      ref="CountrySelectorRef"
      :model-value="modelValue"
      v-bind="{ ...$attrs }"
      class="m-country-selector__select"
      option-value-key="iso2"
      option-label-key="name"
      :option-input-value-key="countrySelectorDisplayName ? 'name' : 'dialCode'"
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
      :search-placeholder="locales.countrySelector.searchPlaceholder"
      :search-threshold
      :options="countryOptions"
      :hint="!!phoneNumber && !modelValue ? locales.countrySelector.error : undefined"
      :label="locales.countrySelector.placeholder"
      :style="{
        width,
      }"
      :exclude-selectors="[`#country-selector-flag-button-${id}`, ...excludedSelectors]"
      @update:model-value="$emit('update:model-value', $event as CountryCode)"
    >
      <template #no-results>
        <slot name="no-results" />
      </template>
      <template #default="{ option, isSelected }">
        <div
          class="m-country-selector__select__item"
          :class="{
            'm-country-selector__select__item--selected': isSelected,
          }"
        >
          <span v-if="!hideFlags && typeof option.iso2 === 'string'" class="m-country-selector__select__item__flag-container">
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
                img-class="maz-rounded-full maz-w-5 maz-h-5"
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
  .m-country-selector {
  @apply maz-relative;

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
    .m-country-selector__select:deep(.m-select-input input) {
      @apply !maz-pl-10;
    }
  }
}

/* RESPONSIVE */
.m-phone-number-input {
  &.--responsive .m-country-selector {
    @apply maz-min-w-full mob-m:maz-min-w-[inherit];

    &__select {
      @apply maz-min-w-full mob-m:maz-min-w-[inherit];

      :deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-b-none mob-m:maz-rounded-b mob-m:maz-rounded-r-none;
      }
    }
  }

  &.--row .m-country-selector {
    &__select {
      :deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-r-none;
      }
    }
  }

  &.--col .m-country-selector {
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
