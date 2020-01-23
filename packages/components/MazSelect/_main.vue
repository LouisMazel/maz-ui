<template>
  <div
    :id="id"
    ref="MazSelect"
    :class="[{
      'is-focused': isFocus,
      'has-list-open': hasListOpen,
      'has-value': value,
      'has-hint': hint,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark,
      'is-valid': valid
    }, size]"
    class="maz-select"
    @blur.capture="handleBlur"
  >
    <input
      :id="uniqueId"
      ref="SelectInputUiInput"
      v-bind="$attrs"
      :name="name"
      :value="valueShown"
      :placeholder="labelShown"
      :disabled="disabled"
      :required="required"
      class="maz-select__input"
      readonly
      @keydown="keyboardNav"
      @focus="isFocus = true"
      @click.stop="toggleList"
    >
    <div
      class="maz-select__toggle"
      @click.stop="toggleList"
    >
      <slot name="arrow">
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
    <label
      ref="label"
      :class="error ? 'text-danger' : null"
      class="maz-select__label"
      @click.stop="toggleList"
    >
      {{ hintValue || labelShown }}
    </label>
    <Transition name="slide">
      <div
        v-show="hasListOpen"
        ref="optionsList"
        class="maz-select__options-list"
        :style="[itemListHeight]"
      >
        <button
          v-for="({ label: l, value: v }, i) in options"
          :key="i"
          tabindex="-1"
          :class="[
            {'selected': value === v},
            {'keyboard-selected': tmpValue === v}
          ]"
          class="flex align-center maz-select__options-list__item"
          :style="[optionHeight]"
          @click.stop="updateValue(v)"
        >
          <div
            class="dots-text"
            :class="{
              'text-muted': !v && value !== v
            }"
          >
            {{ l }}
          </div>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
  import uniqueId from './../../mixins/uniqueId'

  export default {
    name: 'MazSelect',
    mixins: [uniqueId],
    props: {
      value: {
        required: true,
        validator: prop => ['number', 'string', 'boolean'].includes(typeof prop) || prop === null
      },
      options: { type: Array, required: true },
      id: { type: String, default: null },
      name: { type: String, default: 'MazSelect' },
      label: { type: String, default: 'Select option' },
      hint: { type: String, default: null },
      size: { type: String, default: null },
      error: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      itemHeight: { type: Number, default: 35 },
      listHeight: { type: Number, default: 210 },
      borderRadius: { type: Number, default: 4 }
    },
    data () {
      return {
        isFocus: false,
        selectedIndex: null,
        hasListOpen: false,
        query: '',
        tmpValue: this.value,
        indexItemToShow: 0
      }
    },
    computed: {
      uniqueId () {
        return `${this.id}-${this._uid}`
      },
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
      itemsRemain () {
        return this.options.length > 7 ? 7 : this.options.length
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
      labelShown () {
        let label = this.label
        if (this.required && label) label += ` *`
        return label
      },
      hintValue () {
        let hint = this.hint
        if (this.required && hint) hint += ` *`
        return hint
      }
    },
    watch: {
      value (val) {
        this.tmpValue = val
      }
    },
    methods: {
      handleBlur (e) {
        if (this.$el.contains(e.relatedTarget)) return
        this.isFocus = false
        this.closeList()
      },
      toggleList () {
        this.hasListOpen ? this.closeList() : this.openList()
      },
      openList () {
        if (!this.disabled) {
          this.$emit('open')
          this.isFocus = true
          this.hasListOpen = true
          this.selectFirstValue()
          if (this.value && this.hasListOpen) this.scrollToSelectedOnFocus(this.selectedValueIndex)
        }
      },
      closeList () {
        this.$emit('close')
        this.hasListOpen = false
      },
      async reset () {
        this.closeList()
        await this.$nextTick()
        this.$refs.SelectInputUiInput.focus()
      },
      selectFirstValue () {
        if (this.value) return
        this.$emit('input', this.options[0].value)
      },
      async updateValue (val) {
        this.tmpValue = val
        this.$emit('input', val || null)
        await this.$nextTick()
        this.reset()
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
          const resultIndex = this.options.findIndex(o => {
            this.tmpValue = o.value
            return o.label.toLowerCase().startsWith(this.query)
          })
          if (resultIndex !== -1) {
            this.scrollToSelectedOnFocus(resultIndex)
          }
        }
      }
    }
  }
</script>
