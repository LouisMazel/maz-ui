<template>
  <div
    class="maz-checkbox flex align-center"
  >
    <input
      :id="uniqueId"
      :checked="value"
      type="checkbox"
      class="mr-2"
      @change="$emit('input', $event.target.checked)"
    >
    <label
      :for="uniqueId"
      class="m-0 flex align-center"
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
