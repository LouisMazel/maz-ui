<template>
  <div class="maz-base-component maz-btn-group maz-flex">
    <MazBtn
      v-for="({ label, value: val, icon, rightIcon, leftIcon }, i) in items"
      :key="`maz-btn-group-item-${i}`"
      class="maz-btn-group__item"
      :active="val === value"
      :left-icon-name="leftIcon"
      :right-icon-name="rightIcon"
      :icon-name="icon"
      v-bind="$attrs"
      @click="$emit('input', val)"
    >
      <template v-if="label">
        {{ label }}
      </template>
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
    items: { type: Array, required: true }
  }
}
</script>
