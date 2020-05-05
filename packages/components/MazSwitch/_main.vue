<template>
  <div class="maz-switch">
    <input
      :id="uniqueId"
      v-bind="$attrs"
      type="checkbox"
      :name="name"
      :checked="value"
      :disabled="disabled"
      class="maz-switch__input"
      @change="$emit('input', $event.target.checked)"
    >
    <label
      :for="uniqueId"
      class="maz-switch__toggle"
      :class="[bgColorClassTransparency]"
    >
      <span :class="[bgColorClass]" />
    </label>
  </div>
</template>

<script>
import uniqueId from './../../mixins/uniqueId'

export default {
  name: 'MazSwitch',
  mixins: [uniqueId],
  props: {
    value: { type: Boolean, required: true },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: null },
    name: { type: String, default: null },
    color: { type: String, default: 'primary' }
  },
  computed: {
    bgColorClassTransparency () {
      return this.value ? `maz-bg-${this.color}-before-transparency` : 'maz-bg-grey-before-transparency'
    },
    bgColorClass () {
      return this.value ? `maz-bg-${this.color}` : 'maz-bg-white'
    }
  }
}
</script>
