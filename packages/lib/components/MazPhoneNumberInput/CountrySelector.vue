<template>
  <div class="m-country-selector" :class="[props.class, { '--no-flags': noFlags }]" :style="style">
    <button
      v-if="modelValue && !noFlags"
      class="m-country-selector__country-flag maz-text-xl"
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
        {{ countryCodeToUnicodeFlag(modelValue) }}
      </slot>
    </button>

    <MazSelect
      :id="`country-selector-${id}`"
      ref="CountrySelectorRef"
      :model-value="modelValue"
      v-bind="$attrs"
      class="m-country-selector__select"
      option-value-key="iso2"
      option-label-key="name"
      :option-input-value-key="countrySelectorDisplayName ? 'name' : 'dialCode'"
      :max-list-width="250"
      :disabled
      :color
      :size
      :error
      :list-position
      :item-height="38"
      :success
      :search="!noSearch"
      :search-placeholder="locales.countrySelector.searchPlaceholder"
      :options="countryOptions"
      :hint="!!phoneNumber && !modelValue ? locales.countrySelector.error : undefined"
      :label="locales.countrySelector.placeholder"
      :style="{
        width,
      }"
      @update:model-value="$emit('update:model-value', $event as CountryCode)"
    >
      <template #default="{ option, isSelected }">
        <div
          class="m-country-selector__select__item maz-flex maz-items-center maz-gap-1 maz-truncate"
          :class="{
            'm-country-selector__select__item--selected': isSelected,
          }"
        >
          <span v-if="!noFlags && typeof option.iso2 === 'string'" class="maz-text-lg">
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
              {{ countryCodeToUnicodeFlag(option.iso2) }}
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

<script lang="ts" setup>
  import { ref, type ComponentPublicInstance, computed, type StyleValue } from 'vue'
  import type { Color, Size, Position, CountryCode, Translations } from '../MazPhoneNumberInput.vue'
  import MazSelect from '../MazSelect.vue'
  import { countryCodeToUnicodeFlag } from '../../modules/helpers/country-code-to-unicode-flag'
  import { truthyFilter } from '../../modules/helpers/truthy-filter'
  import { useLibphonenumber } from './use-libphonenumber'
  import { useMazPhoneNumberInput } from './use-maz-phone-number-input'

  const props = withDefaults(
    defineProps<{
      style?: StyleValue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      class?: any
      modelValue?: CountryCode
      id: string
      color: Color
      size: Size
      preferredCountries?: CountryCode[]
      ignoredCountries?: CountryCode[]
      onlyCountries?: CountryCode[]
      customCountriesList?: Record<CountryCode, string>
      locales: Translations
      listPosition?: Position
      noFlags?: boolean
      noSearch?: boolean
      disabled?: boolean
      showCodeOnList?: boolean
      countryLocale?: string
      success?: boolean
      error?: boolean
      countrySelectorDisplayName?: boolean
      width: string
    }>(),
    {
      class: undefined,
      style: undefined,
      modelValue: undefined,
      listPosition: 'bottom left',
      preferredCountries: undefined,
      ignoredCountries: undefined,
      onlyCountries: undefined,
      customCountriesList: undefined,
      countryLocale: undefined,
      width: '9rem',
    },
  )

  defineEmits<{
    (event: 'update:model-value', countryCode?: CountryCode): void
  }>()

  const CountrySelectorRef = ref<ComponentPublicInstance>()

  const { getCountriesList } = useLibphonenumber()
  const { phoneNumber } = useMazPhoneNumberInput()

  const countries = computed(() => getCountriesList(props.countryLocale, props.customCountriesList))

  const countriesList = computed(() => {
    return countries.value?.filter((item) => !props.ignoredCountries?.includes(item.iso2))
  })

  const countriesFiltered = computed(() => {
    const countries = props.onlyCountries || props.preferredCountries
    return countries?.map((country) =>
      countriesList.value?.find((item) => item.iso2.includes(country)),
    )
  })

  const otherCountries = computed(() => {
    return countriesList.value?.filter((item) => !props.preferredCountries?.includes(item.iso2))
  })

  const countriesSorted = computed(() => {
    return props.preferredCountries
      ? [...(countriesFiltered.value ?? []), ...(otherCountries.value ?? [])]
      : props.onlyCountries
        ? countriesFiltered.value
        : countriesList.value
  })

  const countryOptions = computed(() => {
    return countriesSorted.value
      ?.map((country) => {
        return country
          ? {
              ...country,
              dialCode: `+${country.dialCode}`,
            }
          : undefined
      })
      .filter(truthyFilter)
  })

  function focusCountrySelector() {
    CountrySelectorRef.value?.$el.querySelector('input')?.focus()
  }
</script>

<style lang="postcss" scoped>
  .m-country-selector {
    &__country-flag {
      position: absolute;
      left: 13px;
      z-index: 4;
      outline: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;

      &.--should-have-bottom-flag {
        bottom: 2px;
      }
    }

    &__select {
      width: 9rem;

      &:deep(.m-input-label) {
        @apply !maz-p-0;
      }

      &__item {
        @apply maz-w-full maz-text-sm;
      }

      &:deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-r-none !important;
      }
    }

    &:not(.--no-flags) {
      .m-country-selector__select:deep(.m-select-input input) {
        @apply maz-pl-10 !important;
      }
    }
  }
</style>
