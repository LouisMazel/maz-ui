<template>
  <div
    :id="id"
    ref="MazSelect"
    v-click-outside="closeList"
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
    @click.stop="toggleList"
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
      @focus.prevent="isFocus = true"
      @blur.prevent="closeList"
    >
    <div class="maz-select__toggle">
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
      :for="uniqueId"
      :class="error ? 'text-danger' : null"
      class="maz-select__label"
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
        <div
          v-for="({ label: l, value: v }, i) in options"
          :key="i"
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
              'text-muted': !v
            }"
          >
            {{ l }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
  import { directive } from 'v-click-outside'
  import uniqueId from './../mixins/uniqueId'

  export default {
    name: 'MazSelect',
    directives: {
      clickOutside: directive
    },
    mixins: [uniqueId],
    props: {
      itemHeight: { type: Number, default: 35 },
      listHeight: { type: Number, default: 210 },
      borderRadius: { type: Number, default: 4 },
      value: { type: [String, Object], default: null },
      label: { type: String, default: 'Select option' },
      hint: { type: String, default: null },
      size: { type: String, default: null },
      error: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      id: { type: String, default: 'MazSelect' },
      name: { type: String, default: 'MazSelect' },
      options: { type: Array, required: true }
    },
    data () {
      return {
        isFocus: false,
        selectedIndex: null,
        hasListOpen: false,
        query: '',
        tmpValue: this.value
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
        return valueSelected ? valueSelected.label : null
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
      toggleList () {
        this.hasListOpen ? this.closeList() : this.openList()
      },
      openList () {
        if (!this.disabled) {
          this.$emit('focus')
          this.isFocus = true
          this.hasListOpen = true
          if (this.value && this.hasListOpen) this.scrollToSelectedOnFocus(this.selectedValueIndex)
        }
      },
      closeList () {
        this.isFocus = false
        this.hasListOpen = false
        this.$emit('blur')
      },
      updateValue (val) {
        this.tmpValue = val
        this.$emit('input', val || null)
        this.closeList()
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
          this.updateValue(this.tmpValue)
        } else if (code === 27) {
          // escape key
          this.closeList()
        } else {
          // typing an option's name
          clearTimeout(this.queryTimer)
          this.queryTimer = setTimeout(() => {
            this.query = ''
          }, 1000)
          const q = String.fromCharCode(code)
          if (code === 8 && this.query !== '') {
            this.query = this.query.substring(0, this.query.length - 1)
          } else if (/[a-zA-Z-e ]/.test(q)) {
            this.query += e.key
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
  }
</script>

<style lang="scss" scoped>
  @import '@/../packages/scss/vars';

  .text-muted {
    color: $muted-color;
  }

  .maz-select {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    position: relative;
    height: 40px;
    min-height: 40px;
    z-index: 0;
    user-select: none;

    &:hover {
      .maz-select__input {
        border-color: $primary-color;
      }
    }

    &__label {
      position: absolute;
      top: 3px;
      cursor: pointer;
      left: 11px;
      transform: translateY(25%);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: $second-color;
    }

    &__input {
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      background-color: $bg-color;
      position: relative;
      width: 100%;
      height: 40px;
      min-height: 40px;
      padding-right: 18px;
      padding-left: 10px;
      font-weight: 400;
      outline: none;
      border: 1px solid $third-color;
      border-radius: $border-radius;
      font-size: 13px;
      z-index: 0;

      &::-webkit-input-placeholder {
        color: $second-color;
      }

      &::-moz-placeholder {
        color: $second-color;
      }

      &:-ms-input-placeholder {
        color: $second-color;
      }

      &::-ms-input-placeholder {
        color: $second-color;
      }

      &:-moz-placeholder {
        color: $second-color;
      }

      &::placeholder {
        color: $second-color;
      }
    }

    &__toggle {
      position: absolute;
      right: 5px;
      top: calc(50% - 10px);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      text-align: center;
      display: inline-block;
      cursor: pointer;
      height: 24px;

      &__arrow {
        color: $second-color;

        path.arrow {
          fill: $second-color;
        }
      }
    }

    &__options-list {
      padding: 0;
      list-style: none;
      min-width: 230px;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 9;
      margin: 0;
      max-width: 100%;
      position: absolute;
      top: 100%;
      border-radius: $border-radius;
      width: 100%;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      background-color: $bg-color;

      &__item {
        padding: 0 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        cursor: pointer;

        &:hover,
        &.keyboard-selected {
          background-color: $hover-color;
        }

        &.selected {
          color: #FFF;
          background-color: $primary-color;
          font-weight: 600;
        }
      }
    }

    &.is-dark {
      .maz-select {
        &__label {
          color: $second-color-dark;
        }

        &__input {
          background-color: $bg-color-dark;
          border-color: $third-color-dark;
          color: $second-color-dark;

          &:hover {
            border-color: $primary-color;
          }

          &::-webkit-input-placeholder {
            color: $second-color-dark;
          }

          &::-moz-placeholder {
            color: $second-color-dark;
          }

          &:-ms-input-placeholder {
            color: $second-color-dark;
          }

          &::-ms-input-placeholder {
            color: $second-color-dark;
          }

          &:-moz-placeholder {
            color: $second-color-dark;
          }

          &::placeholder {
            color: $second-color-dark;
          }
        }

        &__toggle {
          &__arrow {
            color: $second-color-dark;
          }
        }

        &__options-list {
          background-color: $bg-color-dark;

          &__item {
            color: $second-color-dark;

            &:hover,
            &.keyboard-selected {
              background-color: $hover-color-dark;
            }

            &.selected {
              color: #FFF;
              background-color: $primary-color;
              font-weight: 600;
            }
          }
        }
      }
    }

    &.has-value,
    &.has-hint {
      .maz-select__label {
        opacity: 1;
        transform: translateY(0);
        font-size: 11px;
      }

      .maz-select__input {
        padding-top: 14px;
      }
    }

    &.has-list-open {
      .maz-select {
        &__toggle {
          transform: rotate(180deg);
        }
      }
    }

    &.is-focused {
      z-index: 1;

      .maz-select__input {
        border-color: $primary-color;
        box-shadow: 0 0 0 0.2rem $primary-color-transparency;
      }

      .maz-select__label {
        color: $primary-color;
      }
    }

    &.has-error {
      .maz-select__input,
      .maz-select__input:hover {
        border-color: $error-color;
      }

      &.is-focused {
        .maz-select__input {
          box-shadow: 0 0 0 0.2rem $error-color-transparency;
        }
      }

      .maz-select__label {
        color: $error-color;
      }
    }

    &.is-valid {
      .maz-select__input,
      .maz-select__input:hover {
        border-color: $valid-color;
      }

      &.is-focused {
        .maz-select__input {
          box-shadow: 0 0 0 0.2rem $valid-color-transparency;
        }
      }

      .maz-select__label {
        color: $valid-color;
      }
    }

    &.is-disabled {
      cursor: not-allowed;

      .maz-select__input {
        border-color: #CCC;
        background-color: #F2F2F2;
        color: $disabled-color;

        &::-webkit-input-placeholder {
          color: $disabled-color;
        }

        &::-moz-placeholder {
          color: $disabled-color;
        }

        &:-ms-input-placeholder {
          color: $disabled-color;
        }

        &::-ms-input-placeholder {
          color: $disabled-color;
        }

        &:-moz-placeholder {
          color: $disabled-color;
        }

        &::placeholder {
          color: $disabled-color;
        }
      }

      .maz-select__label,
      .maz-select__input,
      .maz-select__toggle__arrow {
        cursor: not-allowed;
        color: $disabled-color;
      }
    }

    &.lg {
      height: 48px;
      min-height: 48px;

      .maz-select__input {
        height: 48px;
        min-height: 48px;
        font-size: 14px;
      }

      .maz-select__label {
        font-size: 14px;
      }

      &.has-value {
        .maz-select__input {
          padding-top: 18px;
        }
      }
    }

    &.sm {
      height: 36px;
      min-height: 36px;

      .maz-select__input {
        height: 36px;
        min-height: 36px;
        font-size: 12px;
      }

      .maz-select__label {
        font-size: 10px;
      }

      &.has-value {
        .maz-select__input {
          padding-top: 12px;
        }
      }
    }

    .slide-enter-active,
    .slide-leave-active {
      opacity: 1;
      z-index: 998;
      transition: all 0.3s;
      transform: translateY(0);
    }

    .slide-enter,
    .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
      z-index: 998;
      transform: translateY(-20px);
    }
  }
</style>
