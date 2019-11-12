<template>
  <div
    :id="uniqueId"
    ref="MazSelect"
    v-click-outside="closeList"
    :class="[{
      'is-focused': isFocus,
      'has-value': value,
      'has-hint': hint,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark,
      'is-valid': valid
    }, size]"
    class="maz-select"
    @click="focusInput"
  >
    <input
      :id="id"
      ref="SelectInputUiInput"
      v-bind="$attrs"
      :name="name"
      :value="valueShown"
      :placeholder="labelShown"
      :disabled="disabled"
      :required="required"
      class="maz-select__input"
      readonly
      @focus="openList"
      @keydown="keyboardNav"
      @click="$emit('click')"
    >
    <div
      class="maz-select__toggle"
      @click="focusInput"
    >
      <slot name="arrow">
        <div class="maz-select__toggle__arrow">
          ▼
        </div>
      </slot>
    </div>
    <label
      ref="label"
      :for="id"
      :class="error ? 'text-danger' : null"
      class="maz-select__label"
    >
      {{ hintValue || labelShown }}
    </label>
    <Transition name="slide">
      <div
        v-show="isFocus"
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
      error: { type: Boolean, default: Boolean },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      validColor: { type: String, default: 'yellowgreen' },
      color: { type: String, default: 'dodgerblue' },
      dark: { type: Boolean, default: false },
      darkColor: { type: String, default: '#424242' },
      id: { type: String, default: 'MazSelect' },
      name: { type: String, default: 'MazSelect' },
      options: { type: Array, default: Array, required: true }
    },
    data () {
      return {
        isFocus: false,
        selectedIndex: null,
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
      focusInput () {
        this.$refs.SelectInputUiInput.focus()
      },
      openList () {
        if (!this.disabled) {
          this.$emit('focus')
          this.isFocus = true
          if (this.value) {
            this.scrollToSelectedOnFocus(this.selectedValueIndex)
          }
        }
      },
      closeList () {
        this.$refs.SelectInputUiInput.blur()
        this.$emit('blur')
        this.isFocus = false
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
          // down arrow
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
  $primary-color: var(--maz-primary-color);
  $second-color: var(--maz-second-color);
  $second-color-dark: var(--maz-second-color-dark);
  $third-color: var(--maz-third-color);
  $third-color-dark: var(--maz-third-color-dark);
  $muted-color: var(--maz-muted-color);
  $muted-color-dark: var(--maz-muted-color-dark);
  $hover-color: var(--maz-hover-color);
  $hover-color-dark: var(--maz-hover-color-dark);
  $bg-color: var(--maz-bg-color);
  $bg-color-dark: var(--maz-bg-color-dark);
  $valid-color: var(--maz-valid-color);
  $error-color: var(--maz-error-color);
  $error-color-transparency: var(--maz-error-color-transparency);
  $primary-color-transparency: var(--maz-primary-color-transparency);
  $valid-color-transparency: var(--maz-valid-color-transparency);
  $border-radius: var(--maz-border-radius);
  $disabled-color: #747474;

  .text-muted {
    color: $muted-color;
  }

  .maz-select {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    position: relative;
    height: 42px;
    min-height: 42px;

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
      height: 42px;
      min-height: 42px;
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
      right: 10px;
      top: calc(50% - 10px);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      text-align: center;
      display: inline-block;
      cursor: pointer;

      &__arrow {
        color: $second-color;
        font-size: 15px;
        transform: scaleY(0.5);
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

      &__label {
        color: $second-color-dark;
      }

      &__input {
        background-color: $bg-color-dark;
        border-color: $third-color-dark;

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
          padding: 0 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 12px;
          cursor: pointer;

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

    &.is-focused {
      .maz-select__toggle {
        transform: rotate(180deg);
      }

      .maz-select__input {
        border-color: $primary-color;
        box-shadow: 0 0 0 0.2rem $primary-color-transparency;
      }

      .maz-select__label {
        color: $primary-color;
      }
    }

    &.has-error {
      .maz-select__input {
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
      .maz-select {
        &__input {
          border-color: $valid-color;
          box-shadow: 0 0 0 0.2rem $valid-color-transparency;
        }

        &__label {
          color: $valid-color;
        }
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
        font-size: 16px;
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
