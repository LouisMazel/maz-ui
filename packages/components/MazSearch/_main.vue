<template>
  <div
    class="maz-search"
    :class="{ 'maz-is-dark': dark }"
    @blur.capture="closeList"
  >
    <MazInput
      ref="textField"
      v-model="query"
      v-bind="$attrs"
      @input="debouncedSearch"
      @keydown="keyboardNav"
      @focus="openList"
      @keyup="$emit('keyup', $event)"
      @change="$emit('change', $event)"
    />
    <transition name="maz-slide">
      <div
        v-if="hasListOpen"
        ref="itemsList"
        class="maz-search__items"
      >
        <button
          v-for="(item, i) in items"
          :key="i"
          ref="item"
          type="button"
          tabindex="-1"
          :class="[
            {'selected': value === (itemValue ? item[itemValue] : item)},
            {'keyboard-selected': tmpValue === (itemValue ? item[itemValue] : item)}
          ]"
          class="maz-search__items__item"
          @click.stop="updateValue((itemValue ? item[itemValue] : item))"
        >
          <!-- Item template -->
          <slot
            :item="item"
            tag="div"
          >
            <!-- `<p>item value</p>` -->
            <p>{{ itemText ? item[itemText] : item }}</p>
          </slot>
        </button>
        <!-- No data template -->
        <slot
          v-if="hasNoDataSlot"
          name="no-data"
          tag="div"
        >
          <!-- `<p>No data</p>` -->
          <div class="maz-search__items__item">
            <p class="text-center">
              No data
            </p>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
import MazInput from '../MazInput'
import { debounce } from '../../utils'

/**
 * > UI search input component. The search component extends MazInput, so all props/options of [MazInput](/#/documentation/input) are available here.
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
    // Array of your results request
    items: {
      type: Array,
      default: null
    },
    // It's a key name of your result object to be returned in the model
    itemValue: { type: String, default: null },
    // It's a key name of your result object to be shown in the list
    itemText: { type: String, default: null },
    // Enable or disable the `dark-mode`
    dark: { type: Boolean, default: false },
    // to show `no-data` slot (when you request has no results)
    noData: { type: Boolean, default: false }
  },
  data () {
    return {
      query: null,
      hasListOpen: false,
      tmpValue: null
    }
  },
  computed: {
    tmpValueIndex () {
      return this.items.findIndex(c => (this.itemValue ? c[this.itemValue] : c) === this.tmpValue)
    },
    selectedValueIndex () {
      return this.value
        ? this.items.findIndex(c => (this.itemValue ? c[this.itemValue] : c) === this.value)
        : null
    },
    hasEmptyQuery () {
      return this.query === null || this.query === ''
    },
    hasNoDataSlot () {
      return (!this.items || !this.items.length) && !this.hasEmptyQuery && this.noData
    }
  },
  watch: {
    query (oldValue, newValue) {
      if (oldValue !== newValue && !this.hasListOpen && !this.hasEmptyQuery) this.openList()
    }
  },
  methods: {
    openList () {
      this.hasListOpen = true
      if (this.value) this.scrollToSelectedOnFocus(this.selectedValueIndex)
    },
    closeList () {
      this.hasListOpen = false
    },
    async reset () {
      this.closeList()
      // this.query = null
    },
    async updateValue (item) {
      // event sent when user select an item in the items list
      // @arg The argument is a the item or an item[key] if you use `item-value`
      this.$emit('input', item)
      await this.$nextTick()
      this.reset()
    },
    debouncedSearch: debounce(function (q) {
      // event sent after debounce --> you must start the request with this event
      // @arg The argument is a string value representing the query the user entered
      this.$emit('request', q)
    }, 500),
    scrollToSelectedOnFocus (arrayIndex) {
      this.$nextTick(() => {
        const itemHeight = this.$refs.item && this.$refs.item[0] && this.$refs.item[0].clientHeight
        if (this.$refs.itemsList) this.$refs.itemsList.scrollTop = arrayIndex * itemHeight - (itemHeight)
      })
    },
    keyboardNav (e) {
      if (!Array.isArray(this.items) || !this.items.length) return
      const code = e.keyCode
      if (code === 40 || code === 38) {
        if (e.view && e.view.event) {
          // TODO : It's not compatible with FireFox
          e.view.event.preventDefault()
        }
        if (!this.hasListOpen) this.openList()
        let index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1
        if (index === -1 || index >= this.items.length) {
          index = index === -1
            ? this.items.length - 1
            : 0
        }
        this.tmpValue = (this.itemValue ? this.items[index][this.itemValue] : this.items[index])
        this.scrollToSelectedOnFocus(index)
      } else if (code === 13) {
        // enter key
        this.hasListOpen ? this.updateValue(this.tmpValue) : this.openList()
      } else if (code === 27) {
        // escape key
        this.closeList()
      }
    }
  }
}
</script>
