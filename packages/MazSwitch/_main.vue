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
  import uniqueId from './../mixins/uniqueId'

  export default {
    name: 'MazSwitch',
    mixins: [uniqueId],
    props: {
      value: { type: Boolean, required: true },
      disabled: { type: Boolean, default: false },
      id: { type: String, default: 'maz-switch' },
      name: { type: String, default: 'maz-switch' }
    }
  }
</script>

<style lang="scss" scoped>
  $primary: var(--maz-primary-color);
  $primary-light: var(--maz-primary-color-transparency);
  $gray: #9A9999;

  .maz-switch {
    &__input {
      display: none;
    }

    &__toggle {
      position: relative;
      display: block;
      width: 40px;
      height: 20px;
      cursor: pointer;
      transform: translate3d(0, 0, 0);

      &::before {
        content: '';
        position: relative;
        top: 3px;
        left: 3px;
        width: 34px;
        height: 14px;
        display: block;
        background: $gray;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      span {
        position: absolute;
        top: -1px;
        left: 0;
        width: 20px;
        height: 20px;
        display: block;
        background: white;
        border-radius: 10px;
        box-shadow: 0 3px 8px rgba(black, 0.2);
        transition: all 0.2s ease;

        &::before {
          content: '';
          position: absolute;
          display: block;
          margin: -18px;
          width: 56px;
          height: 56px;
          background: rgba($primary, 0.5);
          border-radius: 50%;
          transform: scale(0);
          opacity: 1;
          pointer-events: none;
        }
      }
    }

    &__input:checked + &__toggle {
      &::before {
        background: $primary-light;
      }

      span {
        background: $primary;
        transform: translateX(20px);
        box-shadow: 0 3px 8px rgba($primary, 0.2);

        &::before {
          transform: scale(1);
          opacity: 0;
          transition: all 0.4s ease;
        }
      }
    }

    &__input:disabled + &__toggle {
      cursor: not-allowed;
    }
  }
</style>
