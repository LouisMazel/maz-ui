<template>
  <div
    class="maz-base-component maz-checkbox"
    :class="[`maz-checkbox--${color}`]"
  >
    <input
      :id="uniqueId"
      :checked="value"
      v-bind="$attrs"
      :name="name"
      type="checkbox"
      class="maz-mr-2"
      @change="$emit('input', $event.target.checked)"
    >
    <label
      :for="uniqueId"
      class="maz-m-0 maz-flex maz-align-center"
    >
      <slot />
    </label>
  </div>
</template>

<script>
import uniqueId from './../../mixins/uniqueId'

export default {
  name: 'MazCheckbox',
  mixins: [uniqueId],
  props: {
    value: { type: Boolean, required: true },
    id: { type: String, default: null },
    color: { type: String, default: 'primary' },
    name: { type: String, default: 'maz-checkbox'}
  }
}
</script>
