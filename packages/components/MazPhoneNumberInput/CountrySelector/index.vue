<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus,
      'has-value': value,
      'has-hint': hint,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark,
      'no-flags': noFlags,
      'has-list-open': hasListOpen,
      'is-valid': valid
    }, size]"
    class="country-selector"
    @blur.capture="handleBlur"
  >
    <div
      v-if="value && !noFlags"
      class="country-selector__country-flag"
    >
      <div :class="`iti-flag-small iti-flag ${value.toLowerCase()}`" />
    </div>
    <input
      :id="id"
      ref="CountrySelector"
      :value="callingCode"
      :placeholder="label"
      :disabled="disabled"
      class="country-selector__input"
      readonly
      @focus="isFocus = true"
      @keydown="keyboardNav"
      @click.stop="toggleList"
    >
    <div
      class="country-selector__toggle"
      @click.stop="toggleList"
    >
      <slot name="arrow">
        <ArrowIcon />
      </slot>
    </div>
    <label
      ref="label"
      :class="error ? 'text-danger' : null"
      class="country-selector__label"
      @click.stop="toggleList"
    >
      {{ hint || label }}
    </label>
    <Transition name="slide">
      <div
        v-show="hasListOpen"
        ref="countriesList"
        class="country-selector__list"
        :class="{ 'has-calling-code': showCodeOnList }"
        :style="[listHeight]"
      >
        <RecycleScroller
          v-slot="{ item }"
          :items="countriesSorted"
          :item-size="1"
          key-field="iso2"
        >
          <button
            :key="`item-${item.code}`"
            :class="[
              {'selected': value === item.iso2},
              {'keyboard-selected': value !== item.iso2 && tmpValue === item.iso2}
            ]"
            class="flex align-center country-selector__list__item"
            :style="[itemHeight]"
            tabindex="-1"
            type="button"
            @click.stop="updateValue(item.iso2)"
          >
            <div
              v-if="!noFlags"
              class="country-selector__list__item__flag-container"
            >
              <div :class="`iti-flag-small iti-flag ${item.iso2.toLowerCase()}`" />
            </div>
            <span
              v-if="showCodeOnList"
              class="country-selector__list__item__calling-code flex-fixed"
            >+{{ item.dialCode }}</span>
            <div class="dots-text flex-1 text-left">
              {{ item.name }}
            </div>
          </button>
        </RecycleScroller>
      </div>
    </Transition>
  </div>
</template>

<script>
  import { getCountryCallingCode } from 'libphonenumber-js'
  import { RecycleScroller } from 'vue-virtual-scroller'
  import ArrowIcon from './../../_subs/ArrowIcon'

  export default {
    name: 'CountrySelector',
    components: {
      RecycleScroller, ArrowIcon
    },
    props: {
      countriesHeight: { type: Number, default: 35 },
      id: { type: String, default: null },
      value: { type: [String, Object], default: null },
      label: { type: String, default: 'Choose country' },
      hint: { type: String, default: String },
      size: { type: String, default: String },
      error: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      items: { type: Array, default: Array, required: true },
      preferredCountries: { type: Array, default: null },
      onlyCountries: { type: Array, default: null },
      ignoredCountries: { type: Array, default: null },
      noFlags: { type: Boolean, default: false },
      showCodeOnList: { type: Boolean, default: false }
    },
    data () {
      return {
        isFocus: false,
        hasListOpen: false,
        selectedIndex: null,
        tmpValue: this.value,
        query: '',
        indexItemToShow: 0
      }
    },
    computed: {
      listHeight () {
        return {
          height: `${(this.countriesHeight + 1) * 7}px`,
          maxHeight: `${(this.countriesHeight + 1) * 7}px`
        }
      },
      itemHeight () {
        return {
          height: `${this.countriesHeight}px`
        }
      },
      countriesList () {
        return this.items.filter(item => !this.ignoredCountries.includes(item.iso2))
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
          ? [ ...this.countriesFiltered,
              ...this.otherCountries ]
          : this.onlyCountries
            ? this.countriesFiltered
            : this.countriesList
      },
      selectedValueIndex () {
        return this.value
          ? this.countriesSorted.findIndex(c => c.iso2 === this.value)
          : null
      },
      tmpValueIndex () {
        return this.countriesSorted.findIndex(c => c.iso2 === this.tmpValue)
      },
      callingCode () {
        return this.value ? `+${getCountryCallingCode(this.value)}` : null
      }
    },
    // mounted () {
    //   this.$parent.$on('phone-number-focused', this.closeList)
    // },
    methods: {
      handleBlur (e) {
        if (this.$el.contains(e.relatedTarget)) return
        this.isFocus = false
        this.closeList()
      },
      toggleList () {
        this.$refs.countriesList.offsetParent ? this.closeList() : this.openList()
      },
      openList () {
        if (!this.disabled) {
          this.$refs.CountrySelector.focus()
          this.$emit('open')
          this.isFocus = true
          this.hasListOpen = true
          this.selectFirstValue()
          if (this.value) this.scrollToSelectedOnFocus(this.selectedValueIndex)
        }
      },
      closeList () {
        this.$emit('close')
        this.isFocus = false
        this.hasListOpen = false
      },
      async updateValue (val) {
        this.tmpValue = val
        this.$emit('input', val || null)
        await this.$nextTick()
        this.closeList()
      },
      scrollToSelectedOnFocus (arrayIndex) {
        this.$nextTick(() => {
          this.$refs.countriesList.scrollTop = arrayIndex * (this.countriesHeight + 1) - ((this.countriesHeight + 1) * 3)
        })
      },
      selectFirstValue () {
        if (this.value) return
        this.$emit('input', this.countriesSorted[0].iso2)
      },
      keyboardNav (e) {
        const code = e.keyCode
        if (code === 40 || code === 38) {
          // arrow up down
          if (e.view && e.view.event) {
            // TODO : It's not compatible with FireFox
            e.view.event.preventDefault()
          }
          if (!this.hasListOpen) this.openList()
          let index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1
          if (index === -1 || index >= this.countriesSorted.length) {
            index = index === -1
              ? this.countriesSorted.length - 1
              : 0
          }
          this.tmpValue = this.countriesSorted[index].iso2
          this.scrollToSelectedOnFocus(index)
        } else if (code === 13) {
          // enter
          this.hasListOpen ? this.updateValue(this.tmpValue) : this.openList()
        } else if (code === 27) {
          // escape
          this.closeList()
        } else {
          // typing a country's name
          this.searching(e)
        }
      },
      searching (e) {
        const code = e.keyCode
        clearTimeout(this.queryTimer)
        this.queryTimer = setTimeout(() => {
          this.query = ''
        }, 2000)
        const q = String.fromCharCode(code)
        if (code === 8 && this.query !== '') {
          this.query = this.query.substring(0, this.query.length - 1)
        } else if (/[a-zA-Z-e ]/.test(q)) {
          if (!this.hasListOpen) this.openList()
          this.query += q.toLowerCase()
          const countries = this.preferredCountries
            ? this.countriesSorted.slice(this.preferredCountries.length)
            : this.countriesSorted
          const resultIndex = countries.findIndex(c => {
            this.tmpValue = c.iso2
            return c.name.toLowerCase().startsWith(this.query)
          })
          if (resultIndex !== -1) {
            this.scrollToSelectedOnFocus(resultIndex + (this.preferredCountries ? this.preferredCountries.length : 0))
          }
        }
      }
    }
  }
</script>
