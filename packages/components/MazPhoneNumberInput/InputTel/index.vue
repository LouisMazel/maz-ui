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
      'has-hint': hint
    }, size]"
    class="input-tel"
    @click="focusInput"
  >
    <input
      :id="id"
      ref="InputTel"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="labelValue"
      :type="type"
      class="input-tel__input"
      :disabled="disabled"
      :required="required"
      :class="{
        'no-country-selector': noCountrySelector
      }"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @change="$emit('change', $event)"
      @click="$emit('click', $event)"
    >
    <label
      ref="label"
      :for="id"
      :class="error ? 'text-danger' : null"
      class="input-tel__label"
      @click="focusInput"
    >
      {{ hintValue || labelValue }}
    </label>

    <transition
      name="scale"
    >
      <button
        v-if="clearable && inputValue"
        class="input-tel__toggle-btn flex align-center justify-center"
        title="clear"
        type="button"
        tabindex="-1"
        @click="clear"
      >
        <span class="input-tel__toggle-btn__effect" />
        <i class="maz-input__toggle-btn__icon material-icons">
          close
        </i>
      </button>
    </transition>

    <div
      v-if="loading"
      class="input-tel__loader"
    >
      <div
        class="input-tel__loader__progress-bar"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InputTel',
    props: {
      value: { type: [String, Number], default: null },
      label: { type: String, default: 'Enter text' },
      hint: { type: String, default: null },
      error: { type: Boolean, default: Boolean },
      disabled: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      id: { type: String, default: 'InputTel' },
      size: { type: String, default: null },
      type: { type: String, default: 'tel' },
      readonly: { type: Boolean, default: false },
      valid: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      loading: { type: Boolean, default: false },
      clearable: { type: Boolean, default: true },
      noCountrySelector: { type: Boolean, default: false }
    },
    data () {
      return {
        isFocus: false
      }
    },
    computed: {
      inputValue: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      labelValue () {
        const { label } = this
        return this.required && label ? `${label} *` : label
      },
      hintValue () {
        const { hint } = this
        return this.required && hint ? `${hint} *` : hint
      }
    },
    methods: {
      focusInput () {
        this.$refs.InputTel.focus()
      },
      onFocus (e) {
        this.$emit('focus', e)
        this.isFocus = true
      },
      onBlur (e) {
        this.$emit('blur', e)
        this.isFocus = false
      },
      clear () {
        this.$emit('input', null)
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
