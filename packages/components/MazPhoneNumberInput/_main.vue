<template>
  <div
    :id="id"
    :class="[{ 'maz-is-dark': dark }, size]"
    class="maz-phone-number-input maz-flex"
  >
    <div
      v-if="!noCountrySelector"
      class="select-country-container"
    >
      <CountrySelector
        :id="`${uniqueId}_country_selector`"
        ref="CountrySelector"
        v-model="countryCode"
        :items="codesCountries"
        :countries-height="countriesHeight"
        :error="shouldChooseCountry"
        :hint="shouldChooseCountry ? t.countrySelectorError : null"
        :disabled="disabled"
        :success="isValid && !noValidation"
        :preferred-countries="preferredCountries"
        :only-countries="onlyCountries"
        :ignored-countries="ignoredCountries"
        :color="color"
        :placeholder="t.countrySelectorLabel"
        :no-flags="noFlags"
        :show-code-on-list="showCodeOnList"
        :size="size"
        class="input-country-selector"
      >
        <!-- slot arrow: change the arrow icon -->
        <slot
          slot="arrow"
          name="arrow"
        >
          <!-- `<ArrowIcon />` -->
        </slot>
      </CountrySelector>
    </div>
    <div class="maz-flex-1">
      <MazInput
        :id="`${uniqueId}_phone_number`"
        ref="PhoneNumberInput"
        v-model="inputValue"
        :placeholder="t.phoneNumberLabel"
        :hint="hintValue"
        :disabled="disabled"
        :size="size"
        :success="isValid && !noValidation"
        v-bind="$attrs"
        clearable
        :color="color"
        class="input-phone-number"
        :class="{
          'has-border-radius': noCountrySelector
        }"
        @keydown="(e) => { lastKeyPressed = e.keyCode }"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @change="$emit('change', $event)"
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
  </div>
</template>
<script>
import { countries, countriesIso } from './assets/js/phoneCodeCountries.js'
import examples from 'libphonenumber-js/examples.mobile.json'
import { parsePhoneNumberFromString, AsYouType, getExampleNumber } from 'libphonenumber-js'
import CountrySelector from './CountrySelector'
import locales from './assets/locales'
import MazInput from './../MazInput'

import uniqueId from './../../mixins/uniqueId'

const browserLocale = () => {
  if (typeof window === 'undefined') return null
  const browserLocale = window.navigator.userLanguage || window.navigator.language
  let locale = browserLocale ? browserLocale.substr(3, 4).toUpperCase() : null
  if (locale === '') locale = browserLocale.substr(0, 2).toUpperCase()
  return locale
}

const isCountryAvailable = (locale) => {
  return countriesIso.includes(locale)
}

export default {
  name: 'MazPhoneNumberInput',
  components: {
    CountrySelector,
    MazInput
  },
  mixins: [uniqueId],
  props: {
    value: {
      validator: prop => ['string', 'number'].includes(typeof prop) || prop === null,
      default: null
    },
    id: { type: String, default: null },
    disabled: { type: Boolean, default: false },
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
    color: { type: String, default: 'primary' }
  },
  data () {
    return {
      results: {},
      inputFocused: false,
      userLocale: this.defaultCountryCode,
      lastKeyPressed: null,
      inputValueFormatted: null
    }
  },
  computed: {
    t () {
      return {
        ...locales,
        ...this.translations
      }
    },
    codesCountries () {
      return countries
    },
    inputValue: {
      get () {
        return this.inputValueFormatted || this.value
      },
      set (phoneNumber) {
        const { countryCode, getAsYouTypeFormat, emitValues } = this
        this.inputValueFormatted = getAsYouTypeFormat({
          phoneNumber,
          countryCode
        })
        emitValues({ countryCode, phoneNumber })
      }
    },
    countryCode: {
      get () {
        return this.results.countryCode || this.userLocale
      },
      set (newCountry) {
        this.emitValues({countryCode: newCountry, phoneNumber: this.inputValue})
        if (this.inputFocused) {
          this.$refs.PhoneNumberInput.$el.querySelector('input').focus()
        }
        this.inputFocused = true
      }
    },
    shouldChooseCountry () {
      return !this.countryCode && !!this.inputValue
    },
    isValid () {
      return this.results.isValid
    },
    phoneNumberExample () {
      const phoneNumber = this.countryCode ? getExampleNumber(this.countryCode, examples) : null
      return phoneNumber ? phoneNumber.formatNational() : null
    },
    hasEmptyPhone () {
      return this.inputValue === '' || this.inputValue === null
    },
    hintValue () {
      return  this.noExample || !this.phoneNumberExample
        ? null
        : this.hasEmptyPhone || this.isValid ? null : `${this.t.example} ${this.phoneNumberExample}`
    },
  },
  watch: {
    defaultCountryCode (newValue, oldValue) {
      if (newValue === oldValue) return
      this.setLocale(newValue)
    },
    value (value) {
      this.inputValue = value
    }
  },
  async mounted () {
    try {
      if (this.inputValue && this.defaultCountryCode) this.emitValues({countryCode: this.defaultCountryCode, phoneNumber: this.inputValue})

      if (this.defaultCountryCode && this.fetchCountry)
        throw new Error('MazPhoneNumberInput: Do not use \'fetch-country\' and \'default-country-code\' options in the same time')
      if (this.defaultCountryCode && this.noUseBrowserLocale)
        throw new Error('MazPhoneNumberInput: If you use a \'default-country-code\', do not use \'no-use-browser-locale\' options')
      if (this.defaultCountryCode) return

      this.fetchCountry
        ? this.fetchCountryCode()
        : !this.noUseBrowserLocale
          ? this.setLocale(browserLocale())
          : null
    } catch (err) {
      throw new Error(err)
    }
  },
  methods: {
    getAsYouTypeFormat (payload) {
      const { countryCode, phoneNumber } = payload
      const asYouType = new AsYouType(countryCode)
      // console.log('asYouType.input(phoneNumber)', asYouType.input(phoneNumber))
      return phoneNumber ? asYouType.input(phoneNumber) : null
    },
    getParsePhoneNumberFromString ({ phoneNumber, countryCode }) {
      const parsing = phoneNumber && countryCode ? parsePhoneNumberFromString(phoneNumber, countryCode) : null
      return {
        countryCode: countryCode,
        isValid: false,
        ...(phoneNumber && (phoneNumber !== '')
          ? { phoneNumber : phoneNumber }
          : null
        ),
        ...(parsing
          ? {
            countryCallingCode: parsing.countryCallingCode,
            formattedNumber: parsing.number,
            nationalNumber: parsing.nationalNumber,
            isValid: parsing.isValid(),
            type: parsing.getType(),
            formatInternational: parsing.formatInternational(),
            formatNational: parsing.formatNational(),
            uri: parsing.getURI(),
            e164: parsing.format('E.164')
          }
          : null
        )
      }
    },
    emitValues (payload) {
      const backSpacePressed = this.lastKeyPressed === 8

      this.$nextTick(() => {
        const lastCharacOfPhoneNumber = this.inputValue ? this.inputValue.trim().slice(-1) : false
        if (backSpacePressed && lastCharacOfPhoneNumber && (lastCharacOfPhoneNumber.slice(-1) === ')')) {
          payload.phoneNumber = this.inputValue.slice(0, -2)
        }

        this.results = this.getParsePhoneNumberFromString(payload)
        // sent when the user tape
        // @arg Object with all paser values
        this.$emit('update', this.results)
        // sent when the user tape
        // @arg Phone number value formatted in e164 format (international format)
        this.$emit('input', this.results.e164)
      })
    },
    setLocale (locale) {
      const countryAvailable = isCountryAvailable(locale)
      if (countryAvailable && locale) {
        this.userLocale = countryAvailable ? locale : null
        if (this.inputValue) this.emitValues({countryCode: this.userLocale, phoneNumber: this.inputValue})
      } else if (!countryAvailable && locale) {
        // If default country code is not available
        console.warn(`The locale ${locale} is not available`)
      }
    },
    async fetchCountryCode () {
      try {
        const response  = await fetch('https://ip2c.org/s')
        const responseText = await response.text()
        const result = (responseText || '').toString()
        if (result && result[0] === '1') this.setLocale(result.substr(2, 2))
      } catch (err) {
        throw new Error('[MazPhoneNumberInput] Error while fetching country code')
      }
    }
  }
}
</script>

