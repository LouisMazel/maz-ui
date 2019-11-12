<template>
  <div
    class="lm-checkbox flex align-center"
  >
    <input
      :id="`checkbox-${id}`"
      :checked="value"
      type="checkbox"
      class="mr-2"
      @change="onChange($event.target.checked)"
    >
    <label
      :for="`checkbox-${id}`"
      class="m-0 flex align-center"
    >
      <slot />
    </label>
  </div>
</template>

<script>
  export default {
    name: 'LmCheckbox',
    props: {
      id: {
        type: String,
        required: true
      },
      value: {
        default: false,
        type: Boolean
      }
    },
    methods: {
      onChange (event) {
        this.$emit('input', event)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .lm-checkbox {
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
      top: 3px;
      width: 15px;
      height: 15px;
      border: 1px solid #FFF;
      background: transparent;
      border-radius: 4px;
      transition: all 0.2s;
    }

    [type='checkbox']:not(:checked) + label::before {
      border: 1px solid #CCC;
      transition: all 0.2s;
    }

    [type='checkbox']:not(:checked) + label::after,
    [type='checkbox']:checked + label::after {
      content: ' ';
      position: absolute;
      top: 6px;
      left: 3px;
      font-size: 14px;
      width: 9px;
      height: 9px;
      background-color: #FFF;
      transition: all 0.2s;
      border-radius: 2px;
    }

    [type='checkbox']:not(:checked) + label::after {
      opacity: 0;
      transform: scale(0);
      color: #FFF;
    }

    [type='checkbox']:checked + label::after {
      opacity: 1;
      transform: scale(1);
      color: #FFF;
    }
  }
</style>
