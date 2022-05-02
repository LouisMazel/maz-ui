<template>
  <div
    class="maz-button-radio maz-flex-start maz-flex maz-flex-wrap"
    :class="{
      'maz-direction-column': column,
    }"
  >
    <MazBtn
      v-for="({ label, value: v, icon }, i) in options"
      :key="i"
      outline
      class="maz-button-radio__item"
      :class="{
        'has-icon': !!icon,
        'maz-w-100 maz-mb-2': column,
      }"
      :size="size"
      :color="color"
      v-bind="$attrs"
      :active="v === value"
      :style="[
        {
          fontSize: fontSize,
        },
      ]"
      @click="emitValue(v)"
    >
      <div class="maz-direction-column maz-flex maz-p-2 maz-flex-center">
        <i v-if="icon" :class="`icon icon-${icon}`" />
        {{ label }}
      </div>
    </MazBtn>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import type { PropType } from 'vue'

  export default defineComponent({
    name: 'MazButtonRadio',
    props: {
      value: {
        required: true,
        validator: (prop: number | string) =>
          ['number', 'string'].includes(typeof prop) || prop === null,
      },
      options: {
        type: Array as PropType<
          { value: unknown; label: string; icon: string }[]
        >,
        required: true,
      },
      column: { type: Boolean, default: false },
      fontSize: { type: String, default: null },
      color: { type: String, default: 'secondary' },
      size: { type: String, default: 'md' },
      allowUnselect: { type: Boolean, default: false },
    },
    setup(props, { emit }) {
      const emitValue = (v: unknown) => {
        emit('input', v === props.value && props.allowUnselect ? null : v)
      }

      return { emitValue }
    },
  })
</script>

<style lang="scss" scoped>
  .maz-button-radio {
    &__item {
      padding: 5px;

      .icon {
        font-size: 30px;
        margin-bottom: 4px;
      }

      // &:not(.has-icon) {
      //   font-size: 1.25rem;
      // }

      &.maz-active {
        background-color: var(--maz-secondary-darken) !important;

        &::after {
          border-color: var(--maz-secondary-darken);
        }
      }
    }

    &:not(.maz-direction-column) {
      .maz-button-radio__item:not(:last-child) {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
</style>
