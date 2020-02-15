<template>
  <div
    class="maz-search"
    :class="{ 'is-dark': dark }"
    @click="openList"
    @blur.capture="handleBlur"
  >
    tmp : {{ tmpValue }}
    <MazInput
      ref="textField"
      v-model="query"
      v-bind="$attrs"
      @input="debouncedSearch"
      @keydown="keyboardNav"
      @keyup="$emit('keyup', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
      @click="$emit('click', $event)"
    />
    <transition name="slide">
      <div
        v-if="items.length && hasListOpen"
        ref="itemsList"
        class="maz-search__items"
      >
        <button
          v-for="(result, i) in items"
          :key="i"
          ref="item"
          type="button"
          tabindex="-1"
          :class="[
            {'selected': value === itemValue ? result[itemValue] : result},
            {'keyboard-selected': tmpValue === itemValue ? result[itemValue] : result}
          ]"
          class="maz-search__items__item"
          @click.prevent="updateValue(result)"
        >
          {{ itemValue ? result[itemValue] : result }}
          <slot
            :item="result"
            tag="div"
          >
            {{ itemText ? result[itemText] : result }}
          </slot>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
  // TODO: Deep Value (itemValue) work with keyboard

  import MazInput from '../MazInput'
  import { debounce } from '@/../packages/utils'

  export default {
    name: 'MazSearch',
    components: {
      MazInput
    },
    props: {
      items: { type: Array, default: null },
      itemValue: { type: String, default: null },
      itemText: { type: String, default: null },
      dark: { type: Boolean, default: false },
      value: {
        validator: prop => ['string', 'number', 'boolean', 'object', 'array'].includes(typeof prop) || prop === null,
        required: true
      }
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
        return this.items.findIndex(c => c === this.tmpValue)
      }
    },
    methods: {
      openList () {
        this.hasListOpen = true
      },
      closeList () {
        this.$emit('close')
        this.hasListOpen = false
      },
      async reset () {
        this.closeList()
        await this.$nextTick()
        this.$refs.textField.$refs.MazInput.focus()
      },
      handleBlur (e) {
        if (this.$el.contains(e.relatedTarget)) return
        this.isFocus = false
        this.closeList()
      },
      async updateValue (result) {
        const sendedValue = this.itemValue ? result[this.itemValue] : result
        this.$emit('input', sendedValue)
        await this.$nextTick()
        this.reset()
      },
      debouncedSearch: debounce(function (q) {
        this.$emit('request', q)
      }, 500),
      scrollToSelectedOnFocus (arrayIndex) {
        this.$nextTick(() => {
          const itemHeight = this.$refs.item[0].clientHeight
          console.log('itemHeight', itemHeight)
          this.$refs.itemsList.scrollTop = arrayIndex * itemHeight - (itemHeight * 3)
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
          this.tmpValue = this.itemValue ? this.items[index][this.itemValue] : this.items[index]
          this.scrollToSelectedOnFocus(index)
        } else if (code === 13) {
          // enter key
          this.hasListOpen ? this.updateValue(this.tmpValue) : this.openList()
        } else if (code === 27) {
          // escape key
          this.closeList()
        }
        this.$emit('keydown', e)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-search {
    position: relative;

    &__items {
      z-index: 9;
      padding: 0;
      list-style: none;
      overflow-y: auto;
      overflow-x: hidden;
      margin: 0;
      max-width: 100%;
      position: absolute;
      top: 100%;
      border-radius: $border-radius;
      width: 100%;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
      background-color: $bg-color;
      max-height: 250px;

      &__item {
        padding: 7px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 1em;
        cursor: pointer;
        background-color: transparent;
        border: none;
        color: $text-color;
        width: 100%;
        outline: none;
        text-align: left;

        &:hover,
        &.keyboard-selected {
          background-color: $hover-color;
        }

        &.selected {
          color: white;
          background-color: $primary-color;
          font-weight: 600;
        }
      }
    }
  }

  .is-dark .maz-search,
  .maz-search.is-dark {
    .maz-search {
      &__items {
        background-color: $bg-color-dark;

        &__item {
          color: $secondary-color-dark;

          &:hover,
          &.keyboard-selected {
            background-color: $hover-color-dark;
          }

          &.selected {
            color: white;
            background-color: $primary-color;
            font-weight: 600;
          }
        }
      }
    }
  }
</style>
