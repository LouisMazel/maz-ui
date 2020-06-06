<template>
  <div
    class="maz-checkbox maz-flex maz-align-center"
  >
    <input
      :id="uniqueId"
      :checked="value"
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
    id: { type: String, default: null },
    value: { default: false, type: Boolean }
  }
}
</script>
