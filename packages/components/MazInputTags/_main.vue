<template>
  <div
    class="maz-input-tags maz-flex maz-flex--wrap maz-align-center"
    :class="[{
      'is-focused': isFocus,
      'is-valid': success,
      'has-value': value,
      'has-error': error,
      'is-disabled': disabled,
      'maz-is-dark': dark
    }, size]"
    @focus.capture="isFocus = true"
    @blur.capture="isFocus = false"
  >
    <transition-group
      tag="div"
      name="maz-tags"
      class="maz-flex maz-flex--wrap maz-align-center maz-flex-1"
    >
      <MazBtn
        v-for="(tag, i) in tags"
        :key="`tag-${tag}-${i}`"
        class="maz-input-tags__tag maz-flex maz-align-center"
        :disabled="disabled"
        :size="size"
        @click.stop="removeTag(i)"
      >
        <span class="maz-input-tags__tag__text">
          {{ tag }}
        </span>
        <i class="maz-input-tags__tag__clear material-icons">
          close
        </i>
      </MazBtn>
      <input
        key="input-tags"
        v-model="inputValue"
        v-bind="$attrs"
        type="text"
        :placeholder="placeholder"
        :aria-label="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="maz-input-tags__input maz-flex-1"
        @keydown.enter.prevent="addTags"
        @keydown.delete="removeLastTag"
      >
      <button
        v-if="hasClearBtn"
        key="clear-button"
        class="maz-input-tags__toggle-btn --clear maz-flex maz-flex-center"
        title="clear"
        type="button"
        tabindex="-1"
        :disabled="disabled"
        @click="cleanTags"
      >
        <span class="maz-input-tags__toggle-btn__effect" />
        <i class="maz-input-tags__toggle-btn__icon material-icons">
          close
        </i>
      </button>
    </transition-group>
    <div
      v-if="loading"
      class="maz-input-tags__loader"
    >
      <div
        class="maz-input__loader__progress-bar"
      />
    </div>
  </div>
</template>

<script>
import uniqueId from './../../mixins/uniqueId'
import MazBtn from '../MazBtn'

/**
 * > UI Input tags
 */
export default {
  name: 'MazInputTags',
  components: { MazBtn },
  mixins: [uniqueId],
  props: {
    // Input value, can be a `Array` of `String` or `null`
    value: {
      validator: prop => Array.isArray(prop) || prop === null,
      required: true
    },
    // input id
    id: { type: String, default: null },
    // input placeholder
    placeholder: { type: String, default: 'Add tags' },
    // When is `true` the input is disable
    disabled: { type: Boolean, default: false },
    // When is `true` the input has the dark theme
    dark: { type: Boolean, default: false },
    // When is `true` the input is on readonly mode
    readonly: { type: Boolean, default: false },
    // When is `true` the input has the error style (red)
    error: { type: Boolean, default: false },
    // When is `true` the input has the valid style (green)
    success: { type: Boolean, default: false },
    // When is `true` the input become required & has the `*` symbol
    required: { type: Boolean, default: false },
    // When is `true` the input is a textarea
    loading: { type: Boolean, default: false },
    // When is `true` the input can be clear with a button on the right
    clearable: { type: Boolean, default: false },
    // input size (`'lg'` / `'sm'`)
    size: { type: String, default: null }
  },
  data () {
    return {
      inputValue: null,
      isFocus: false
    }
  },
  computed: {
    tags: {
      get () {
        return this.value
      },
      set (value) {
        if (!value) return
        if (Array.isArray(this.tags)) {
          const tagsArray = JSON.parse(JSON.stringify(this.tags))
          tagsArray.push(value)
          // return the list of current tags
          // @arg `Array` or `null`
          this.$emit('input', tagsArray)
        } else {
          // return the list of tags (`Array` of `String`)
          this.$emit('input', Array(value))
        }
      }
    },
    hasClearBtn () {
      return this.clearable && this.tags && this.tags.length
    }
  },
  methods: {
    addTags () {
      this.tags = this.inputValue
      this.inputValue = null
    },
    removeLastTag () {
      if (this.inputValue === null || this.inputValue === '') {
        const tagsArray = JSON.parse(JSON.stringify(this.tags))
        tagsArray.pop()
        this.$emit('input', tagsArray)
      }
    },
    removeTag (i) {
      const tagsArray = JSON.parse(JSON.stringify(this.tags))
      tagsArray.splice(i, 1)
      this.$emit('input', tagsArray)
    },
    cleanTags () {
      this.$emit('input', null)
      this.inputValue = null
    }
  }
}
</script>
