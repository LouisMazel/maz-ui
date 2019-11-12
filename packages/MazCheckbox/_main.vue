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
  import uniqueId from './../mixins/uniqueId'

  export default {
    name: 'MazCheckbox',
    mixins: [uniqueId],
    props: {
      id: { type: String, default: 'MazCheckbox' },
      value: { default: false, type: Boolean }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-checkbox {
    padding: 2px 8px;
    transition: all 0.2s;
    cursor: pointer;

    [type='checkbox']:not(:checked),
    [type='checkbox']:checked {
      position: absolute;
      left: -9999px;
    }

    [type='checkbox']:not(:checked) + label,
    [type='checkbox']:checked + label {
      position: relative;
      padding-left: 25px;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }

    [type='checkbox']:not(:checked) + label::before,
    [type='checkbox']:checked + label::before {
      content: '';
      position: absolute;
      left: 0;
      top: 4px;
      width: 15px;
      height: 15px;
      border: 1px solid var(--maz-primary-color);
      background: transparent;
      border-radius: 4px;
      transition: all 0.2s;
    }

    [type='checkbox']:not(:checked) + label::before {
      border: 1px solid var(--maz-primary-color);
      transition: all 0.2s;
    }

    [type='checkbox']:not(:checked) + label::after,
    [type='checkbox']:checked + label::after {
      content: ' ';
      position: absolute;
      top: 7px;
      left: 3px;
      font-size: 14px;
      width: 9px;
      height: 9px;
      background-color: var(--maz-primary-color);
      transition: all 0.2s;
      border-radius: 2px;
    }

    [type='checkbox']:not(:checked) + label::after {
      opacity: 0;
      transform: scale(0);
      color: var(--maz-primary-color);
    }

    [type='checkbox']:checked + label::after {
      opacity: 1;
      transform: scale(1);
      color: var(--maz-primary-color);
    }
  }
</style>
