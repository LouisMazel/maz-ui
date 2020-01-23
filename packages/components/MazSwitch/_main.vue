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
    >
      <span />
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
      name: { type: String, default: null }
    }
  }
</script>
