<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus,
      'is-valid': valid,
      'has-value': value,
      'has-error': error,
      'is-disabled': disabled,
      'is-dark': dark,
      'has-hint': hint,
      'has-no-label': !hasLabel && !hint,
      'has-left-icon': hasLeftIcon,
      'has-right-icon': hasRightIcon
    }, size]"
    class="maz-input"
    @click="focusInput"
  >
    <div
      v-for="({ name, position }, i) in inputIcons"
      :key="`input-icon-${i}`"
      class="maz-input__icon flex align-center justify-center"
      :class="[
        position,
        textarea ? 'align-start pt-2' : 'align-center'
      ]"
    >
      <slot :name="`input-icon-${position}`">
        <i class="material-icons">{{ name }}</i>
      </slot>
    </div>
    <input
      v-if="!textarea"
      :id="uniqueId"
      ref="MazInput"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="labelValue"
      :type="getType"
      class="maz-input__input"
      :class="{
        'has-right-btn': hasClearBtn || hasPasswordBtn
      }"
      :disabled="disabled"
      :required="required"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @click="$emit('click', $event)"
    >
    <textarea
      v-else
      :id="uniqueId"
      ref="MazInput"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="labelValue"
      :type="type"
      :required="required"
      class="maz-input__input textarea"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @click="$emit('click', $event)"
    />
    <label
      v-if="hasLabel || hint"
      ref="label"
      :for="uniqueId"
      :class="error ? 'text-danger' : null"
      class="maz-input__label"
      @click="focusInput"
    >
      {{ hintValue || labelValue }}
    </label>
    <transition-group
      name="scale"
    >
      <button
        v-if="hasClearBtn"
        key="clear-button"
        class="maz-input__toggle-btn --clear flex align-center justify-center"
        title="clear"
        type="button"
        tabindex="-1"
        :class="{ 'has-right-icon': hasRightIcon }"
        @click="clear"
      >
        <span class="maz-input__toggle-btn__effect" />
        <i class="maz-input__toggle-btn__icon material-icons">
          close
        </i>
      </button>

      <button
        v-if="hasPasswordBtn"
        key="password-button"
        class="maz-input__toggle-btn password flex align-center justify-center"
        :class="{
          'has-clear-btn': hasClearBtn,
          'has-right-icon': hasRightIcon
        }"
        title="clear"
        type="button"
        tabindex="-1"
        @click="showPassword = !showPassword"
      >
        <span class="maz-input__toggle-btn__effect" />
        <i class="maz-input__toggle-btn__icon material-icons">
          {{ showPassword ? 'visibility_off' : 'visibility' }}
        </i>
      </button>
    </transition-group>

    <div
      v-if="loader"
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

  export default {
    name: 'MazInput',
    mixins: [uniqueId],
    props: {
      value: {
        required: true,
        validator: prop => ['number', 'string'].includes(typeof prop) || prop === null
      },
      id: { type: String, default: 'MazInput' },
      label: { type: String, default: 'Enter text' },
      hint: { type: String, default: null },
      color: { type: String, default: 'dodgerblue' },
      size: { type: String, default: null },
      type: { type: String, default: 'text' },
      leftIconName: { type: String, default: null },
      rightIconName: { type: String, default: null },
      error: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      readonly: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      textarea: { type: Boolean, default: false },
      loader: { type: Boolean, default: false },
      clearable: { type: Boolean, default: false },
      noLabel: { type: Boolean, default: false }
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
          this.$emit(
            'input',
            this.hasNumberType
              ? !value ? 0 : parseInt(value)
              : value
          )
        }
      },
      labelValue () {
        let { label } = this
        if (this.required && label) label += ` *`
        return label
      },
      hintValue () {
        let { hint } = this
        if (this.required && hint) hint += ` *`
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
      hasLeftIcon () {
        return this.leftIconName || this.$slots['input-icon-left']
      },
      hasRightIcon () {
        return this.rightIconName || this.$slots['input-icon-right']
      },
      inputIcons () {
        return [
          ...(this.hasLeftIcon ? [{ position: 'left', name: this.leftIconName }] : []),
          ...(this.hasRightIcon ? [{ position: 'right', name: this.rightIconName }] : [])
        ]
      }
    },
    methods: {
      focusInput () {
        this.$refs.MazInput.focus()
      },
      onFocus: function () {
        this.$emit('focus')
        this.isFocus = true
      },
      onBlur: function () {
        this.$emit('blur')
        this.isFocus = false
      },
      clear () {
        this.$emit(
          'input',
          this.hasNumberType ? 0 : ''
        )
        this.$emit('clear')
      },
      keyUp (e) {
        this.$emit('keyup', e)
      },
      keyDown (e) {
        this.$emit('keydown', e)
      }
    }
  }
</script>
