<template>
  <div
    class="maz-base-component maz-radio maz-flex maz-align-center"
    :class="[`maz-radio--${color}`]"
  >
    <input
      :id="uniqueId"
      :checked="value === radioValue"
      :name="name"
      :value="radioValue"
      type="radio"
      class="maz-mr-2"
      @change="$emit('input', $event.target.value)"
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
  name: 'MazRadio',
  mixins: [uniqueId],
  props: {
    value: { type: String, required: true },
    id: { type: String, default: null },
    color: { type: String, default: 'primary' },
    name: { type: String, default: 'maz-radio'},
    radioValue: { type: String, required: true }
  }
}
</script>
