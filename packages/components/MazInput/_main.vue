<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus || focus,
      'is-valid': success,
      'has-value': value,
      'is-textarea': textarea,
      'has-error': error,
      'has-warning': warning,
      'is-disabled': disabled,
      'maz-is-dark': dark,
      'has-hint': hint,
      'has-no-label': !hasLabel && !hint,
      'has-left-icon': hasLeftIcon(),
    }, `maz-input--${size}`, `has-${leftNumberIcon}-right-icon`, `maz-input--${color}`]"
    class="maz-base-component maz-input maz-border maz-border-color maz-border-color-hover maz-border-solid maz-border-radius"
    @click="focusInput"
  >
    <div
      v-if="hasLeftIcon()"
      class="maz-input__icon maz-flex left"
      :class="[textarea ? 'maz-align-start maz-pt-2' : 'maz-align-center']"
    >
      <!-- Icon slot (`icon-left`) -->
      <slot :name="`icon-left`">
        <!-- none -->
        <i class="material-icons">{{ leftIconName }}</i>
      </slot>
    </div>

    <div
      v-if="hasRightIcon()"
      class="maz-input__icon maz-flex right"
      :class="[textarea ? 'maz-align-start maz-pt-2' : 'maz-align-center']"
    >
      <!-- Icon slot (`icon-right`) -->
      <slot :name="`icon-right`">
        <!-- none -->
        <i class="material-icons">{{ rightIconName }}</i>
      </slot>
    </div>

    <input
      v-if="!textarea"
      :id="uniqueId"
      ref="MazInput"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="placeholderValue"
      :type="getType"
      class="maz-input__input maz-border-radius"
      :aria-label="placeholder"
      :class="{
        'has-right-icon': hasClearBtn || hasPasswordBtn || hasRightIcon()
      }"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      @change="onChange"
      @click="$emit('click', $event)"
    >
    <textarea
      v-else
      :id="uniqueId"
      ref="MazInput"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="placeholderValue"
      :type="type"
      :required="required"
      :readonly="readonly"
      class="maz-input__input maz-textarea"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      @change="onChange"
      @click="$emit('click', $event)"
    />
    <label
      v-if="hasLabel || hint"
      ref="label"
      :for="uniqueId"
      :class="error ? 'maz-text-danger' : null"
      class="maz-input__label"
      tabindex="-1"
      @click="focusInput"
    >
      {{ hintValue || placeholderValue }}
    </label>
    <transition-group
      name="maz-scale"
    >
      <button
        v-if="hasClearBtn"
        key="clear-button"
        class="maz-input__toggle-btn --clear maz-flex maz-flex-center"
        title="clear"
        type="button"
        tabindex="-1"
        :class="{ 'has-right-icon': hasRightIcon() }"
        @click.stop="clear"
      >
        <i class="maz-input__toggle-btn__icon material-icons">
          close
        </i>
      </button>

      <button
        v-if="hasPasswordBtn"
        key="password-button"
        class="maz-input__toggle-btn password maz-flex maz-flex-center"
        :class="{
          'has-clear-btn': hasClearBtn,
          'has-right-icon': hasRightIcon()
        }"
        title="clear"
        type="button"
        tabindex="-1"
        @click="showPassword = !showPassword"
      >
        <i class="maz-input__toggle-btn__icon material-icons">
          {{ showPassword ? 'visibility_off' : 'visibility' }}
        </i>
      </button>
    </transition-group>

    <div
      v-if="loading"
      class="maz-input__loader"
      :class="{ textarea }"
    >
      <div
        class="maz-input__loader__progress-bar"
      />
    </div>
  </div>
</template>

<script>
import uniqueId from './../../mixins/uniqueId'
import { debounce } from '../../utils'

let DEBOUNCE = 500
/**
 * > Beautiful input UI with loading & error manager
 */

export default {
  name: 'MazInput',
  mixins: [uniqueId],
  props: {
    // value of the input
    value: {
      validator: prop => ['string', 'number'].includes(typeof prop) || prop === null,
      default: null
    },
    // input id
    id: { type: String, default: null },
    // value of the input
    placeholder: { type: String, default: 'Enter text' },
    // replace the label if is present
    hint: { type: String, default: null },
    // input size (`'lg'` / `'sm'`)
    size: { type: String, default: null },
    // is the input size (`text` or `number`)
    type: { type: String, default: 'text' },
    // should be a [material icon](https://material.io/resources/icons/) name
    leftIconName: { type: String, default: null },
    // should be a [material icon](https://material.io/resources/icons/) name
    rightIconName: { type: String, default: null },
    // When is `true` the input has the error style
    error: { type: Boolean, default: false },
    // When is `true` the input has the warning style
    warning: { type: Boolean, default: false },
    // When is `true` the input is disable
    disabled: { type: Boolean, default: false },
    // When is `true` the input has the dark theme
    dark: { type: Boolean, default: false },
    // When is `true` the input is on readonly mode
    readonly: { type: Boolean, default: false },
    // When is `true` the input has the valid style
    success: { type: Boolean, default: false },
    // When is `true` the input become required & has the `*` symbol
    required: { type: Boolean, default: false },
    // When is `true` the input is a textarea
    textarea: { type: Boolean, default: false },
    // When is `true` the input has a progress bar animated
    loading: { type: Boolean, default: false },
    // When is `true` the input can be clear with a button on the right
    clearable: { type: Boolean, default: false },
    // When is `true` the input has not label (top placeholder when value is not empty)
    noLabel: { type: Boolean, default: false },
    // When is `true` and is `required`, the `*` symbol is not showing
    noRequiredSymbol: { type: Boolean, default: false },
    // force focus style input
    focus: { type: Boolean, default: false },
    // color name in basic colors
    color: { type: String, default: 'primary' },
    // Add a debounce of 500ms to emit the value
    debounce: { type: Boolean, default: false }
  },
  data () {
    return {
      isFocus: false,
      showPassword: false
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        const valueToEmit = this.hasNumberType
          ? !value ? 0 : parseInt(value)
          : value
        this.emitValue(valueToEmit)
      }
    },
    placeholderValue () {
      let { placeholder } = this
      if (this.required && placeholder && !this.noRequiredSymbol) placeholder += ' *'
      return placeholder
    },
    hintValue () {
      let { hint } = this
      if (this.required && hint) hint += ' *'
      return hint
    },
    hasNumberType () {
      return this.type === 'number'
    },
    hasLabel () {
      return !this.noLabel
    },
    getType () {
      return this.showPassword ? 'text' : this.type
    },
    hasPasswordBtn () {
      return this.type === 'password' && this.inputValue
    },
    hasClearBtn () {
      return this.clearable && this.inputValue && !this.textarea
    },
    leftNumberIcon () {
      const array = [
        !!this.hasRightIcon(),
        !!this.hasClearBtn,
        !!this.hasPasswordBtn
      ]
      return array.filter(a => a).length
    }
  },
  methods: {
    debounceValue: debounce(function (value) {
      // return the input value (in `@input` or `v-model`)
      // @arg input
      this.$emit('input', value)
    }, DEBOUNCE),
    emitValue (value) {
      if (this.debounce) return this.debounceValue(value)

      this.$emit('input', value)
    },
    hasLeftIcon () {
      return this.leftIconName || this.$slots['icon-left']
    },
    hasRightIcon () {
      return this.rightIconName || this.$slots['icon-right']
    },
    focusInput () {
      this.$refs.MazInput.focus()
    },
    onFocus (e) {
      // sent the focus event
      // @arg event
      this.$emit('focus', e)
      this.isFocus = true
    },
    onBlur (e) {
      // sent the blur event
      // @arg event
      this.$emit('blur', e)
      this.isFocus = false
    },
    onPaste (e) {
      // sent when text is past in the textfield
      // @arg event
      this.$emit('paste', e)
    },
    onChange (e) {
      // sent on input change
      // @arg event
      this.$emit('change', e)
    },
    clear () {
      this.$emit(
        'input',
        this.hasNumberType ? 0 : ''
      )
      // sent when the input is clear
      this.$emit('clear')
    },
    keyUp (e) {
      // sent the keyup event
      // @arg event
      this.$emit('keyup', e)
    },
    keyDown (e) {
      // sent the keydown event
      // @arg event
      this.$emit('keydown', e)
    }
  }
}
</script>
