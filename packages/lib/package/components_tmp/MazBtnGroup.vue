<template>
  <div class="maz-btn-group maz-flex">
    <MazBtn
      v-for="({ label, value: val, icon, rightIcon, leftIcon }, i) in items"
      :key="`maz-btn-group-item-${i}`"
      class="maz-btn-group__item"
      :active="val === modelValue"
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

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import MazBtn from '@components/MazBtn.vue'

  interface Item {
    label: string
    value: string | number | boolean
    icon: string
    rightIcon: string
    leftIcon: string
  }

  export default defineComponent({
    name: 'MazBtnGroup',
    components: {
      MazBtn,
    },
    props: {
      modelValue: {
        type: [String, Number, Boolean],
        default: null,
      },
      items: { type: Array as PropType<Item[]>, required: true },
    },
    emits: ['input'],
  })
</script>
