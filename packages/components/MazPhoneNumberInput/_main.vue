<template>
  <div
    :id="id"
    :class="[{ 'maz-is-dark': dark }, `maz-phone-number-input--${size}`]"
    class="maz-base-component maz-phone-number-input maz-flex"
  >
    <MazSelect
      v-if="!noCountrySelector"
      ref="CountrySelector"
      :value="countryCode"
      :options="countriesSorted"
      :placeholder="t.countrySelectorLabel"
      :search="!noSearch"
      :position="position"
      :search-placeholder="t.countrySelectorSearchPlaceholder"
      :items-height="countriesHeight"
      :error="shouldChooseCountry"
      :hint="shouldChooseCountry ? t.countrySelectorError : null"
      :size="size"
      :success="isValid && !noValidation"
      :disabled="disabled"
      :input-value="callingCode"
      :list-width="250"
      :config="{
        labelKey: 'dialCode',
        searchKey: 'name',
        valueKey: 'iso2'
      }"
      :color="color"
      class="country-selector"
      :class="{
        'no-padding-left': noFlags || !countryCode
      }"
      @input="setCountryCode($event, true)"
    >
      <template
        #default="{ option }"
      >
        <div
          class="maz-flex maz-align-center"
        >
          <div
            v-if="!noFlags"
            class="country-selector__flag-container maz-mr-2"
          >
            <div :class="`maz-flag maz-flag-${option.iso2.toLowerCase()}`" />
          </div>
          <span
            v-if="showCodeOnList"
            class="country-selector__calling-code maz-flex-fixed maz-text-muted"
            :class="{
              'maz-text-muted-dark': option.isSelected
            }"
          >
            +{{ option.dialCode }}
          </span>
          <div
            class="maz-dots-text maz-flex-1 maz-text-left maz-text-color"
            :class="{
              'maz-text-white': option.isSelected
            }"
          >
            {{ option.name }}
          </div>
        </div>
      </template>
    </MazSelect>

    <button
      v-if="countryCode && !noFlags && !noCountrySelector"
      class="
      maz-phone-number-input__country-flag"
      tabindex="-1"
      @click="focusCountrySelector"
    >
      <div :class="`maz-flag maz-flag-${countryCode.toLowerCase()}`" />
    </button>

    <MazInput
      :id="uniqueId ? `${uniqueId}_phone_number` : null"
      ref="PhoneNumberInput"
      :value="asYouTypeNumber"
      :placeholder="placeholder || t.phoneNumberLabel"
      :hint="hint || hintValue"
      :disabled="disabled"
      :size="size"
      :success="isValid && !noValidation"
      v-bind="$attrs"
      clearable
      :color="color"
      class="input-phone-number maz-flex-1"
      :class="{
        'has-border-radius': noCountrySelector
      }"
      @keydown="(e) => { lastKeyPressed = e.keyCode }"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
      @clear="$emit('clear', $event)"
      @input="buildResults"
    >
      <!-- Custom left icon -->
      <slot
        slot="icon-left"
        name="icon-left"
      />
      <!-- Custom right icon -->
      <slot
        slot="icon-right"
        name="icon-right"
      />
    </MazInput>
  </div>
</template>
<script>
import { fetchCountryCode, browserLocale, getResultsFromPhoneNumber, getAsYouTypeFormat, isCountryAvailable } from './utils'
import { countries } from './constantes/js/phoneCodeCountries.js'
import examples from 'libphonenumber-js/examples.mobile.json'
import { getExampleNumber, getCountryCallingCode } from 'libphonenumber-js'
import locales from './constantes/locales'
import MazInput from './../MazInput'
import MazSelect from './../MazSelect'

import uniqueId from './../../mixins/uniqueId'

export default {
  name: 'MazPhoneNumberInput',
  components: {
    MazInput,
    MazSelect
  },
  mixins: [uniqueId],
  props: {
    value: {
      validator: prop => ['string', 'number'].includes(typeof prop) || prop === null,
      default: null
    },
    id: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    // set default phone number (Ex: `default-phone-number="0658585858"`)
    defaultPhoneNumber: { type: String, default: null },
    // set default country code (Ex: `default-country-code="FR"`)
    defaultCountryCode: { type: String, default: null },
    // Same as MazInput (options: `sm|md|lg`)
    size: { type: String, default: null },
    // Countries selected will be at the top of the list - Ex : `preferred-countries="['FR', 'BE', 'DE']`
    preferredCountries: { type: Array, default: null },
    // Only countries selected are in list - Ex : `only-countries="['FR', 'BE', 'DE']`
    onlyCountries: { type: Array, default: null },
    // Countries seleted are remove from the list - Ex : `ignored-countries="['FR', 'BE', 'DE']`
    ignoredCountries: { type: Array, default: Array },
    // Translate text in component - By default `{ countrySelectorLabel: 'Country code', countrySelectorError: 'Choose country', phoneNumberLabel: 'Phone number', example: 'Example:' }`
    translations: { type: Object, default: null },
    // Remove the validation UI state (success border color)
    noValidation: { type: Boolean, default: false },
    // Remove flags in country selector
    noFlags: { type: Boolean, default: false },
    // Remove the number example from the label input
    noExample: { type: Boolean, default: false },
    // Remove the search countries functionality
    noSearch: { type: Boolean, default: false },
    // Change the height of country item in list
    countriesHeight: { type: Number, default: 30 },
    // Disable use of browser locale to init the country selector (usefull for Nuxt.JS)
    noUseBrowserLocale: { type: Boolean, default: false },
    // Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)
    fetchCountry: { type: Boolean, default: false },
    // The country selector is not shown, you can validate your phone number with the country code set
    noCountrySelector: { type: Boolean, default: false },
    // Show the country phone code in the list
    showCodeOnList: { type: Boolean, default: false },
    // Enable the dark mode
    dark: { type: Boolean, default: false },
    // Use color
    color: { type: String, default: 'primary' },
    // Set placholder of phone number input
    placeholder: { type: String, default: null },
    // hint message shown on phone number text field
    hint: { type: String, default: null },
    // set the position of countries list (ex: `top`, `top right`, `bottom right`)
    position: { type: String, default: 'left bottom' },
  },
  data () {
    return {
      results: {},
      countryCode: this.defaultCountryCode,
      lastKeyPressed: null,
      asYouTypeNumber: this.defaultPhoneNumber
    }
  },
  computed: {
    t () {
      return {
        ...locales,
        ...this.translations
      }
    },
    callingCode () {
      const { countryCode } = this
      const getDialCode = (code) => {
        const result = this.countriesSorted.find(m => m.iso2 === code)
        return result ? result.dialCode : null
      }
      return countryCode ? `+${getDialCode(countryCode) || getCountryCallingCode(countryCode)}` : null
    },
    // input states
    shouldChooseCountry () {
      return !this.countryCode && !!this.asYouTypeNumber
    },
    isValid () {
      return this.results.isValid
    },
    hasEmptyPhone () {
      const { asYouTypeNumber } = this
      return asYouTypeNumber === '' || !asYouTypeNumber
    },
    // hint values
    phoneNumberExample () {
      const { countryCode } = this
      const phoneNumber = countryCode ? getExampleNumber(countryCode, examples) : null
      return phoneNumber ? phoneNumber.formatNational() : null
    },
    hintValue () {
      const { noExample, phoneNumberExample, hasEmptyPhone, isValid, t } = this
      return  noExample || !phoneNumberExample
        ? null
        : hasEmptyPhone || isValid ? null : `${t.example} ${phoneNumberExample}`
    },
    // Countries list management
    countriesList () {
      return countries.filter(item => !this.ignoredCountries.includes(item.iso2))
    },
    countriesFiltered () {
      const countries = this.onlyCountries || this.preferredCountries
      return countries.map(country => this.countriesList.find(item => item.iso2.includes(country)))
    },
    otherCountries () {
      return this.countriesList.filter(item => !this.preferredCountries.includes(item.iso2))
    },
    countriesSorted () {
      return this.preferredCountries
        ? [
          ...this.countriesFiltered,
          ...this.otherCountries
        ]
        : this.onlyCountries
          ? this.countriesFiltered
          : this.countriesList
    }
  },
  watch: {
    defaultPhoneNumber: {
      handler (phoneNumber, oldPhoneNumber) {
        if (phoneNumber === oldPhoneNumber) return
        this.buildResults(phoneNumber)
      },
      immediate: true
    },
    defaultCountryCode: {
      handler (newValue, oldValue) {
        if (!newValue || (newValue === oldValue)) return
        this.setCountryCode(newValue)
      },
      immediate: true
    }
  },
  async mounted () {
    try {
      const {
        defaultCountryCode, fetchCountry, noUseBrowserLocale, setCountryCode
      } = this

      if (!this.defaultPhoneNumber && this.value) this.buildResults(this.value)

      if (defaultCountryCode && fetchCountry)
        throw new Error('MazPhoneNumberInput: Do not use \'fetch-country\' and \'default-country-code\' options in the same time')
      if (defaultCountryCode && noUseBrowserLocale)
        throw new Error('MazPhoneNumberInput: If you use a \'default-country-code\', do not use \'no-use-browser-locale\' options')
      if (defaultCountryCode) return

      const locale = fetchCountry
        ? await fetchCountryCode()
        : noUseBrowserLocale ? null : await browserLocale()

      if (locale) setCountryCode(locale)
    } catch (err) {
      throw new Error(err)
    }
  },
  methods: {
    async buildResults (phoneNumber, noAutoUpdateCountryCode) {
      const { asYouTypeNumber, lastKeyPressed, countryCode, value } = this
      const backSpacePressed = lastKeyPressed === 8

      await this.$nextTick()

      const lastCharacOfPhoneNumber = asYouTypeNumber ? asYouTypeNumber.slice(asYouTypeNumber.length - 1) : false
      if (backSpacePressed && lastCharacOfPhoneNumber && (lastCharacOfPhoneNumber === ')')) {
        this.asYouTypeNumber = asYouTypeNumber.slice(0, -1)
      }

      this.results = await getResultsFromPhoneNumber(phoneNumber, countryCode)

      this.asYouTypeNumber = await getAsYouTypeFormat(
        phoneNumber,
        countryCode
      )

      if (!noAutoUpdateCountryCode && this.results && this.results.countryCode && (countryCode !== this.results.countryCode)) {
        this.setCountryCode(this.results.countryCode)
      }

      // sent when the user tape
      // @arg Object with all parsed values
      this.$emit('update', this.results)

      const { isValid, e164 } = this.results

      const valueToEmit = isValid ? e164 : this.asYouTypeNumber
      if (!valueToEmit && valueToEmit === value) return

      // sent when the user tape
      // @arg Phone number value formatted in e164 format (international format)
      this.$emit('input', valueToEmit)
    },

    async setCountryCode (locale, focusPhoneNumberInput) {
      const { buildResults, asYouTypeNumber } = this
      const countryAvailable = isCountryAvailable(locale)
      if (focusPhoneNumberInput) {
        this.focusPhoneNumberInput()
        if (asYouTypeNumber && asYouTypeNumber.includes('+')) this.asYouTypeNumber = null
      }
      if (countryAvailable && locale) {
        this.countryCode = locale
        buildResults(this.asYouTypeNumber, true)
      }
    },

    async focusCountrySelector () {
      await this.$nextTick()
      this.$refs.CountrySelector.$el.querySelector('input').focus()
    },

    async focusPhoneNumberInput () {
      await this.$nextTick()
      this.$refs.PhoneNumberInput.$el.querySelector('input').focus()
    }
  }
}
</script>

