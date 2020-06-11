<template>
  <div
    class="maz-select"
    :class="[{
      'has-list-open': hasOpenList,
      'maz-is-dark': dark
    }, `maz-select--${color}`]"
    @blur.capture="closeList($event)"
  >
    <div
      v-if="multiple"
      ref="SelectedTags"
      class="maz-select__tags maz-flex maz-align-center"
      :class="{
        'maz-left-offset': hasLeftIcon
      }"
    >
      <transition-group
        tag="div"
        name="maz-tags"
        class="maz-flex maz-align-center maz-flex-1"
      >
        <MazBtn
          v-for="({ value: v, label }, i) in selectedOptions"
          :key="i"
          class="maz-select__tag maz-flex maz-align-center"
          :disabled="disabled"
          :color="color"
          :size="size"
          @click.prevent.stop="removeOption(v)"
        >
          <span class="maz-select__tag__text">
            {{ label }}
          </span>
          <i class="maz-select__tag__clear material-icons">
            close
          </i>
        </MazBtn>
      </transition-group>
    </div>
    <MazInput
      ref="textField"
      :value="valueShown"
      v-bind="$attrs"
      readonly
      :no-label="hasNoLabel"
      :color="color"
      :size="size"
      :placeholder="placeholderShown"
      :disabled="disabled"
      :focus="hasOpenList"
      @clear="emitValues(null)"
      @keydown.prevent="search ? null : keyboardNav($event)"
      @keyup="$emit('keyup', $event)"
      @focus="openList"
      @change="$emit('change', $event)"
    >
      <!-- custom left icon -->
      <slot
        slot="icon-left"
        name="icon-left"
      />
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
    <transition :name="listTransition">
      <div
        v-show="hasOpenList"
        class="maz-select__options-list maz-flex"
        :class="[
          hasPositionTop ? 'maz-select__options-list--top maz-direction-column-reverse' : 'maz-direction-column',
          { 'maz-select__options-list--right': hasPositionRight }
        ]"
        :style="[itemListSize]"
      >
        <MazInput
          v-if="search"
          ref="SearchInput"
          :color="color"
          :value="searchQuery"
          :placeholder="searchPlaceholder"
          size="sm"
          no-label
          name="new_search_in_options"
          autocomplete="off"
          class="maz-m-1"
          @input="searchInOptions"
          @keydown="keyboardNav"
          @keydown.esc="closeList"
        />
        <div
          ref="optionsList"
          class="maz-select__options-list__items-container maz-flex maz-direction-column"
        >
          <button
            v-for="(option, i) in optionsShown"
            :key="i"
            tabindex="-1"
            type="button"
            :class="[
              {'selected': values.length && values.includes(option.value) },
              {'keyboard-selected': tmpValue === option.value}
            ]"
            class="maz-select__options-list__item flex align-center maz-text-left"
            :style="[optionHeight]"
            @click.prevent.stop="updateValue(option.value)"
          >
            <!-- Item template -->
            <slot
              :option="{ ...option, isSelected: values.includes(option.value) }"
              tag="div"
            >
              <!-- `<span>{{ option.label }}</span>`-->
              <span
                class="maz-dots-text"
                :class="[
                  { 'maz-text-muted' : !option.value },
                  values.includes(option.value) ? 'maz-text-white' : 'maz-text-color'
                ]"
              >
                {{ option.label }}
              </span>
            </slot>
          </button>
          <!-- No results template -->
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
      </div>
    </transition>
  </div>
</template>

<script>
import MazInput from '../MazInput'
import MazBtn from '../MazBtn'
import uniqueId from './../../mixins/uniqueId'

/**
 * > Beautiful select input
 */

export default {
  name: 'MazSelect',
  components: { MazInput, MazBtn },
  mixins: [uniqueId],
  props: {
    // is the value of the input
    value: {
      required: true,
      validator: prop => ['number', 'string', 'boolean'].includes(typeof prop) || Array.isArray(prop) || prop === null
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
    listHeight: { type: Number, default: 260 },
    // List width in pixel
    listWidth: { type: Number, default: null },
    // The select has no label in the input
    placeholder: { type: String, default: 'Select option' },
    // When is `true` the select you select multiple values
    noLabel: { type: Boolean, default: false },
    // When is `true` the select you select multiple values
    multiple: { type: Boolean, default: false },
    // When is `true` the select has an input to search in options
    search: { type: Boolean, default: false },
    // the search input placeholder
    searchPlaceholder: { type: String, default: 'Search in options' },
    // the search input placeholder
    color: { type: String, default: 'primary' },
    // input size
    size: { type: String, default: 'md' },
    // When is `true` the option list is open
    open: { type: Boolean, default: false },
    // set the position of option list (`top`, `top right`, `bottom right`)
    position: { type: String, default: 'left bottom' }
  },
  data () {
    return {
      listIsOpen: false,
      query: '',
      tmpValue: null,
      searchQuery: null,
      filteredOptions: null
    }
  },
  computed: {
    hasPositionTop () {
      return this.position.includes('top')
    },
    hasPositionRight () {
      return this.position.includes('right')
    },
    listTransition () {
      return this.position.includes('bottom') ? 'maz-slide' : 'maz-slideinvert'
    },
    hasOpenList () {
      return this.open || this.listIsOpen
    },
    values () {
      const { multiple, value } = this
      if (multiple && !Array.isArray(value) && value !== null) throw new Error('[MazSelect] value should be an array or null')
      if (!multiple && Array.isArray(value)) throw new Error('[MazSelect] value should be a string, a number or null')
      return value
        ? multiple ? [...value]: [value]
        : []
    },
    hasLeftIcon () {
      return this.$attrs.leftIconName || this.$slots['icon-left']
    },
    placeholderShown () {
      const { placeholder, multiple, values } = this
      return multiple && values.length ? null : placeholder
    },
    hasNoLabel () {
      return this.multiple || this.noLabel
    },
    optionHeight () {
      return {
        height: `${this.itemHeight}px`,
        flex: `0 0 ${this.itemHeight}px`
      }
    },
    itemListSize () {
      return {
        maxHeight: `${this.listHeight}px`,
        width: `${this.listWidth}px`,
        maxWidth: `${this.listWidth}px`
      }
    },
    tmpValueIndex () {
      return this.optionsShown.findIndex(c => c.value === this.tmpValue)
    },
    selectedValueIndex () {
      const { values, options } = this
      return values.length
        ? options.findIndex(c => c.value === values[values.length - 1])
        : null
    },
    valueShown () {
      const { multiple, options, values, value } = this
      const valueSelected = options.filter(({ value: v }) => v === value)[0]
      return valueSelected && valueSelected.value && !multiple
        ? valueSelected.label
        : values[0] ? ' ' : null
    },
    optionsShown () {
      return this.filteredOptions || this.options
    },
    selectedOptions () {
      const { values, options } = this
      const optionsSelected = []
      values.forEach(v => optionsSelected.push(options.find(({ value }) => v === value)))
      return optionsSelected
    }
  },
  watch: {
    value: {
      handler () {
        const { multiple } = this
        if (multiple) this.scrollTags()
      },
      immediate: true
    }
  },
  methods: {
    async scrollTags () {
      await this.$nextTick()
      const { SelectedTags } = this.$refs
      SelectedTags.scrollLeft = SelectedTags.clientWidth
    },
    removeOption (value) {
      const { values, multiple } = this
      const leftValues = values.filter(v => v !== value)
      const valueToReturn = leftValues.length
        ? multiple ? leftValues : leftValues[0]
        : null
      this.emitValues(valueToReturn)
    },
    closeList (e = {}) {
      if (this.$el.contains(e.relatedTarget)) return
      this.$emit('close')
      this.listIsOpen = false
      this.isFocus = false
    },
    openList () {
      const { disabled, search, values } = this
      if (!disabled) {
        if (disabled) return
        // sent when the list is open
        this.$emit('open')
        this.isFocus = true
        this.listIsOpen = true
        this.selectFirstValue()
        if (search) this.focusSearchInput()
        if (values.length) this.scrollToSelectedOnFocus(this.selectedValueIndex)
      }
    },
    clearSearch () {
      this.searchQuery = null
      this.filteredOptions = null
    },
    async reset () {
      this.clearSearch()
      if (this.multiple) return
      this.closeList()
      await this.$nextTick()
    },
    selectFirstValue () {
      const { multiple, value, options } = this
      if (value || multiple) return
      const valueToReturn = options[0].value || null
      this.tmpValue = valueToReturn
      this.emitValues(valueToReturn, true)
    },
    updateValue (value) {
      const { multiple, values, removeOption } = this
      if (values.includes(value)) return removeOption(value)
      this.tmpValue = value
      if (value) values.push(value)
      const valueToReturn = multiple && value ? values : value
      this.emitValues(valueToReturn)
    },
    async focusSearchInput () {
      await this.$nextTick()
      const { SearchInput } = this.$refs
      SearchInput.$el.querySelector('input').focus()
    },
    async emitValues (values, noReset) {
      // return the select input
      // @arg the option value selected
      this.$emit('input', values)
      if (noReset) return
      await this.$nextTick()
      this.reset()
    },
    async scrollToSelectedOnFocus (arrayIndex) {
      await this.$nextTick()
      this.$refs.optionsList.scrollTop = arrayIndex * this.itemHeight - (this.itemHeight * 3)
    },
    keyboardNav (e) {
      const code = e.keyCode
      const { hasOpenList, tmpValueIndex, optionsShown, openList, tmpValue, search } = this
      if (code === 40 || code === 38) {
        if (!hasOpenList) openList()
        let index = code === 40 ? tmpValueIndex + 1 : tmpValueIndex - 1
        if (index === -1 || index >= optionsShown.length) {
          index = index === -1
            ? optionsShown.length - 1
            : 0
        }
        this.tmpValue = optionsShown[index].value
        this.scrollToSelectedOnFocus(index)
      } else if (code === 13) {
        // enter key
        e.preventDefault()
        hasOpenList ? this.updateValue(tmpValue) : this.openList()
      } else if (code === 27) {
        // escape key
        this.closeList()
      } else if (!search) {
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
        if (!this.hasOpenList) this.openList()
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
      this.searchQuery = query === '' ? null : query
      if (!this.searchQuery) return this.filteredOptions = this.options
      const searchQuery = query.toLowerCase()
      const filteredOptions = this.options.filter(o => o.value && o.label.toLowerCase().includes(searchQuery))
      this.tmpValue = filteredOptions.length ? filteredOptions[0].value : null
      this.filteredOptions = filteredOptions
    }
  }
}
</script>