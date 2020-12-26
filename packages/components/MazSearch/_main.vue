<template>
  <div
    class="maz-base-component maz-search"
    :class="[{ 'maz-is-dark': dark }, `maz-search--${color}`, `maz-search--${size}`]"
    @blur.capture="closeList"
  >
    <MazInput
      ref="textField"
      v-model="query"
      v-bind="$attrs"
      :color="color"
      :loading="loading"
      :debounce="debounce"
      :size="size"
      @input="inputEvent"
      @keydown="keyboardNav"
      @focus="openList"
      @keyup="$emit('keyup', $event)"
      @change="$emit('change', $event)"
      @clear="$emit('clear', $event)"
      @blur="$emit('blur', $event)"
      @paste="$emit('paste', $event)"
      @click="$emit('click', $event)"
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
    <transition name="maz-slide">
      <div
        v-if="hasListOpen"
        ref="itemsList"
        class="maz-search__items maz-elevation"
      >
        <button
          v-for="(item, i) in items"
          :key="i"
          ref="item"
          type="button"
          tabindex="-1"
          :class="[
            {'selected': value === (itemValue ? getItemQuery(itemValue, item) : item)},
            {'keyboard-selected': tmpValue === item}
          ]"
          class="maz-search__items__item"
          @click.stop="updateValue(item)"
        >
          <!-- Item template -->
          <slot
            :item="item"
            tag="div"
          >
            <!-- `<p>{{ item value }}</p>` -->
            <p>{{ itemText ? getItemQuery(itemText, item) : item }}</p>
          </slot>
        </button>
        <!-- No data template -->
        <slot
          v-if="hasNoDataSlot"
          name="no-data"
          tag="div"
        >
          <!-- `<i class="material-icons maz-text-danger">search_off</i>` -->
          <div class="maz-search__no-data maz-p-2 maz-flex maz-flex-center">
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

const resolve = (path, obj, separator='.') => {
  var properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

/**
 * > UI search input component. The search component extends MazInput, so all props/options of [MazInput](/documentation/maz-input) are available here.
 */
export default {
  name: 'MazSearch',
  components: {
    MazInput
  },
  props: {
    // Is the value return when you select an item
    value: {
      validator: prop => ['string', 'number', 'boolean', 'object', 'array'].includes(typeof prop) || prop === null,
      required: true
    },
    // set the initial query input value (will emit "request" event on created)
    initialQuery: { type: String, default: null },
    // Array of your results request
    items: { type: Array, default: null },
    // It's a key name of your result object to be returned in the model
    itemValue: { type: String, default: null },
    // It's a key name of your result object to be shown in the list
    itemText: { type: String, default: null },
    // Enable or disable the `dark-mode`
    dark: { type: Boolean, default: false },
    // to show `no-data` slot (when you request has no results)
    noData: { type: Boolean, default: false },
    // Choose your color
    color: { type: String, default: 'primary' },
    // To open the list
    open: { type: Boolean, default: false },
    // Add loading effect to input
    loading: { type: Boolean, default: false },
    // Replace the query typed by the "item text" selected in list
    replaceOnSelect: { type: Boolean, default: false },
    // Clear query typed on select
    clearOnSelect: { type: Boolean, default: false },
    // remove debounce before send request
    debounce: { type: Boolean, default: true },
    // input size
    size: { type: String, default: 'md' }
  },
  data () {
    return {
      query: this.initialQuery,
      listOpen: false,
      tmpValue: null,
      inDebounce: false
    }
  },
  computed: {
    tmpValueIndex () {
      return this.items.findIndex(c => c === this.tmpValue)
    },
    selectedValueIndex () {
      const { itemValue, items, value, getItemQuery } = this
      return value && items && items.length
        ? items.findIndex(c => (itemValue ? getItemQuery(itemValue, c) : c) === this.value)
        : null
    },
    hasEmptyQuery () {
      return this.query === null || this.query === ''
    },
    hasNoDataSlot () {
      return (!this.items || !this.items.length) && !this.hasEmptyQuery && this.noData && !this.inDebounce && !this.loading
    },
    hasListOpen () {
      return this.open || this.listOpen
    }
  },
  watch: {
    query (oldValue, newValue) {
      if (oldValue !== newValue && !this.hasListOpen && !this.hasEmptyQuery) this.openList()
    }
  },
  created () {
    if (this.initialQuery) this.inputEvent(this.initialQuery)
  },
  methods: {
    getItemQuery (query, item) {
      return resolve(query, item)
    },
    openList (e) {
      this.$emit('focus', e)
      this.listOpen = true
      if (this.value) this.scrollToSelectedOnFocus(this.selectedValueIndex)
    },
    closeList () {
      setTimeout(() => { this.listOpen = false }, 300)
    },
    updateValue (item) {
      const { itemValue, itemText, replaceOnSelect, clearOnSelect, getItemQuery } = this
      const valueReturned = itemValue ? getItemQuery(itemValue, item) : item
      // event sent when user select an item in the items list
      // @arg The argument is a the item or an item[key] if you use `item-value`
      this.$emit('input', valueReturned)
      if (replaceOnSelect) {
        this.query = itemText ? getItemQuery(itemText, item) : JSON.stringify(item)
      } else if (clearOnSelect) {
        this.query = null
      }
      this.closeList()
    },
    inputEvent (q) {
      this.$emit('request', q)
    },
    scrollToSelectedOnFocus (arrayIndex) {
      this.$nextTick(() => {
        const itemHeight = this.$refs.item && this.$refs.item[0] && this.$refs.item[0].clientHeight
        if (this.$refs.itemsList) this.$refs.itemsList.scrollTop = arrayIndex * itemHeight - (itemHeight)
      })
    },
    keyboardNav (e) {
      this.$emit('keydown', e)
      if (!Array.isArray(this.items) || !this.items.length) return
      const code = e.keyCode
      if (code === 40 || code === 38) {
        if (!this.hasListOpen) this.openList()
        let index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1
        if (index === -1 || index >= this.items.length) {
          index = index === -1
            ? this.items.length - 1
            : 0
        }
        this.tmpValue = this.items[index]
        this.scrollToSelectedOnFocus(index)
      } else if (code === 13) {
        // enter key
        e.preventDefault()
        this.hasListOpen ? this.updateValue(this.tmpValue) : this.openList()
      } else if (code === 27) {
        // escape key
        this.closeList()
      }
    }
  }
}
</script>
