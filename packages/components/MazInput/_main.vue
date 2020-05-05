<template>
	<div
		ref="parent"
		:class="[{
			'is-focused': isFocus || focus,
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
			class="maz-input__icon flex"
			:class="[
				position,
				textarea ? 'align-start pt-2' : 'align-center'
			]"
		>
			<!-- Icon slot (`input-icon-left` / `input-icon-right`) -->
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
			:placeholder="placeholderValue"
			:type="getType"
			class="maz-input__input border border-color border-solid"
			:aria-label="placeholder"
			:class="{
				'has-right-btn': hasClearBtn || hasPasswordBtn
			}"
			:disabled="disabled"
			:required="required"
			:readonly="readonly"
			@keydown="keyDown"
			@keyup="keyUp"
			@focus="onFocus"
			@blur="onBlur"
			@change="$emit('change', $event)"
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
			class="maz-input__input textarea border border-color border-solid"
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
			tabindex="-1"
			@click="focusInput"
		>
			{{ hintValue || placeholderValue }}
		</label>
		<transition-group
			name="scale"
		>
			<button
				v-if="hasClearBtn"
				key="clear-button"
				class="maz-input__toggle-btn --clear flex flex-center"
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
				class="maz-input__toggle-btn password flex flex-center"
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

/**
 * > Beautiful input UI with loading & error manager
 */

export default {
  name: 'MazInput',
  mixins: [uniqueId],
  props: {
    // value of the input
    value: {
      required: true,
      validator: prop => ['number', 'string'].includes(typeof prop) || prop === null
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
    // When is `true` the input has the error style (red)
    error: { type: Boolean, default: false },
    // When is `true` the input is disable
    disabled: { type: Boolean, default: false },
    // When is `true` the input has the dark theme
    dark: { type: Boolean, default: false },
    // When is `true` the input is on readonly mode
    readonly: { type: Boolean, default: false },
    // When is `true` the input has the valid style (green)
    valid: { type: Boolean, default: false },
    // When is `true` the input become required & has the `*` symbol
    required: { type: Boolean, default: false },
    // When is `true` the input is a textarea
    textarea: { type: Boolean, default: false },
    // When is `true` the input is a textarea
    loading: { type: Boolean, default: false },
    // When is `true` the input can be clear with a button on the right
    clearable: { type: Boolean, default: false },
    // When is `true` the input has not label (top placeholder when value is not empty)
    noLabel: { type: Boolean, default: false },
    // When is `true` and is `required`, the `*` symbol is not showing
    noRequiredSymbol: { type: Boolean, default: false },
    // force focus style input
    focus: { type: Boolean, default: false }
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
        // return the input value (in `@input` or `v-model`)
        // @arg input
        this.$emit(
          'input',
          this.hasNumberType
            ? !value ? 0 : parseInt(value)
            : value
        )
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
