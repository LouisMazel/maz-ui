<template>
  <div
    class="maz-select"
    :class="[{
      'has-list-open': hasListOpen,
      'maz-is-dark': dark
    }]"
    @blur.capture="closeList($event)"
  >
    <MazInput
      ref="textField"
      :value="valueShown"
      v-bind="$attrs"
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      :focus="hasListOpen"
      @keydown="search ? null : keyboardNav($event)"
      @keyup="$emit('keyup', $event)"
      @focus="openList()"
      @change="$emit('change', $event)"
    >
      <div
        slot="icon-right"
        class="maz-select__toggle"
        tabindex="-1"
      >
        <!-- The arrow icon -->
        <slot name="arrow">
          <!-- the arrow svg -->
          <svg
            mlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class="maz-select__toggle__arrow"
          >
            <path
              class="arrow"
              d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
            />
            <path
              fill="none"
              d="M0 0h24v24H0V0z"
            />
          </svg>
        </slot>
      </div>
    </MazInput>
    <transition name="maz-slide">
      <div
        v-show="hasListOpen"
        ref="optionsList"
        class="maz-select__options-list"
        :style="[itemListHeight]"
      >
        <MazInput
          v-if="search"
          ref="SearchInput"
          :value="searchQuery"
          :placeholder="searchPlaceholder"
          size="sm"
          no-label
          name="search_in_options"
          autocomplete="new_search_in_options"
          class="maz-m-1"
          @input="searchInOptions"
          @keydown.enter="updateValue(tmpValue)"
          @keydown.esc="closeList"
        />
        <button
          v-for="(option, i) in optionsShown"
          :key="i"
          tabindex="-1"
          type="button"
          :class="[
            {'selected': value === option.value},
            {'keyboard-selected': tmpValue === option.value}
          ]"
          class="maz-select__options-list__item flex align-center maz-text-left"
          :style="[optionHeight]"
          @click.stop="updateValue(option.value)"
        >
          <!-- Item template -->
          <slot
            :option="{ ...option, isSelected: value === option.value }"
            tag="div"
          >
            <!-- `<span>{{ option.label }}</span>`-->
            <span
              class="maz-dots-text"
              :class="[
                { 'maz-text-muted' : !option.value && value !== option.value },
                value === option.value ? 'maz-text-white' : 'maz-text-color'
              ]"
            >
              {{ option.label }}
            </span>
          </slot>
        </button>
        <!-- No data template -->
        <slot
          v-if="!optionsShown.length"
          name="no-results"
          tag="div"
        >
          <!-- `<i class="material-icons maz-text-danger">search_off</i>` -->
          <div class="maz-select__options-list__no-results maz-p-1 maz-flex maz-flex-center">
            <i class="material-icons maz-text-danger">
              search_off
            </i>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
import MazInput from '../MazInput'
import uniqueId from './../../mixins/uniqueId'

/**
 * > Beautiful select input
 */

export default {
  name: 'MazSelect',
  components: { MazInput },
  mixins: [uniqueId],
  props: {
    // is the value of the input
    value: {
      required: true,
      validator: prop => ['number', 'string', 'boolean'].includes(typeof prop) || prop === null
    },
    // list of the options
    options: { type: Array, required: true },
    // When is `true` the select is disabled
    disabled: { type: Boolean, default: false },
    // When is `true` the select has the dark style
    dark: { type: Boolean, default: false },
    // Item in list height in pixel
    itemHeight: { type: Number, default: 35 },
    // List height in pixel
    listHeight: { type: Number, default: 210 },
    // The input label
    placeholder: { type: String, default: 'Select option' },
    // When is `true` the select has an input to search in options
    search: { type: Boolean, default: false },
    // the search input placeholder
    searchPlaceholder: { type: String, default: 'Search in options' }
  },
  data () {
    return {
      selectedIndex: null,
      hasListOpen: false,
      query: '',
      tmpValue: this.value,
      indexItemToShow: 0,
      searchQuery: null,
      filteredOptions: null
    }
  },
  computed: {
    optionHeight () {
      return {
        height: `${this.itemHeight}px`
      }
    },
    itemListHeight () {
      return {
        maxHeight: `${this.listHeight}px`
      }
    },
    tmpValueIndex () {
      return this.options.findIndex(c => c.value === this.tmpValue)
    },
    selectedValueIndex () {
      return this.value
        ? this.options.findIndex(c => c.value === this.value)
        : null
    },
    valueShown () {
      const valueSelected = this.options.filter(c => c.value === this.value)[0]
      return valueSelected && valueSelected.value ? valueSelected.label : null
    },
    optionsShown () {
      return this.filteredOptions || this.options
    }
  },
  watch: {
    value (val) {
      this.tmpValue = val
    }
  },
  methods: {
    closeList (e = {}) {
      if (this.$el.contains(e.relatedTarget)) return
      this.$emit('close')
      this.hasListOpen = false
      this.isFocus = false
    },
    openList () {
      if (!this.disabled) {
        if (this.disabled) return
        // sent when the list is open
        this.$emit('open')
        this.isFocus = true
        this.hasListOpen = true
        this.selectFirstValue()
        if (this.search) this.focusSearchInput()
        if (this.value && this.hasListOpen) this.scrollToSelectedOnFocus(this.selectedValueIndex)
      }
    },
    clearSearch () {
      this.searchQuery = null
      this.filteredOptions = null
    },
    async reset () {
      this.closeList()
      await this.$nextTick()
      this.clearSearch()
    },
    selectFirstValue () {
      if (this.value) return
      // return the select input
      // @arg the option value selected
      const value = this.options[0].value || null
      this.tmpValue = value
      this.$emit('input', value)
    },
    async updateValue (val) {
      this.tmpValue = val
      this.$emit('input', val || null)
      await this.$nextTick()
      this.reset()
    },
    async focusSearchInput () {
      await this.$nextTick()
      const { SearchInput } = this.$refs
      SearchInput.$el.querySelector('input').focus()
    },
    scrollToSelectedOnFocus (arrayIndex) {
      this.$nextTick(() => {
        this.$refs.optionsList.scrollTop = arrayIndex * this.itemHeight - (this.itemHeight * 3)
      })
    },
    keyboardNav (e) {
      const code = e.keyCode
      if (code === 40 || code === 38) {
        if (e.view && e.view.event) {
          // TODO : It's not compatible with FireFox
          e.view.event.preventDefault()
        }
        if (!this.hasListOpen) this.openList()
        let index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1
        if (index === -1 || index >= this.options.length) {
          index = index === -1
            ? this.options.length - 1
            : 0
        }
        this.tmpValue = this.options[index].value
        this.scrollToSelectedOnFocus(index)
      } else if (code === 13) {
        // enter key
        this.hasListOpen ? this.updateValue(this.tmpValue) : this.openList()
      } else if (code === 27) {
        // escape key
        this.closeList()
      } else {
        // typing an option's name
        this.searching(e)
      }
    },
    searching (e) {
      const code = e.keyCode
      clearTimeout(queryTimer)
      const queryTimer = setTimeout(() => {
        this.query = ''
      }, 2000)
      const q = String.fromCharCode(code)
      if (code === 8 && this.query !== '') {
        this.query = this.query.substring(0, this.query.length - 1)
      } else if (/[a-zA-Z-e ]/.test(q)) {
        if (!this.hasListOpen) this.openList()
        this.query += q.toLowerCase()
        const resultIndex = this.options.findIndex(o => {
          this.tmpValue = o.value
          return o.label.toLowerCase().includes(this.query)
        })
        if (resultIndex !== -1) {
          this.scrollToSelectedOnFocus(resultIndex)
        }
      }
    },
    searchInOptions (query) {
      this.searchQuery = query
      const searchQuery = query // .toLowerCase()
      const filteredOptions = this.options.filter(o => {
        return o.label.toLowerCase().includes(searchQuery)
      })
      this.tmpValue = filteredOptions.length ? filteredOptions[0].value : null
      this.filteredOptions = filteredOptions
    }
  }
}
</script>
