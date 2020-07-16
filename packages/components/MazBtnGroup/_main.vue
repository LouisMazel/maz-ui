<template>
  <div class="maz-base-component maz-btn-group maz-flex">
    <MazBtn
      v-for="({ label, value: val }, i) in items"
      :key="`maz-btn-group-item-${i}`"
      class="maz-btn-group__item"
      :class="{ 'rounded': rounded }"
      :active="val === value"
      :rounded="rounded"
      v-bind="$attrs"
      @click="$emit('input', val)"
    >
      {{ label }}
    </MazBtn>
  </div>
</template>

<script>
import MazBtn from '../MazBtn'

export default {
  name: 'MazBtnGroup',
  components: {
    MazBtn
  },
  props: {
    value: {
      required: true,
      validator: prop => ['string', 'number', 'boolean'].includes(typeof prop) || prop === null
    },
    items: { type: Array, required: true },
    rounded: { type: Boolean, default: false }
  }
}
</script>
