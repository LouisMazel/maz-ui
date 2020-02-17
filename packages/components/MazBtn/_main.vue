<template>
  <component
    :is="componentType"
    :id="uniqueId"
    v-bind="$attrs"
    class="maz-btn btn"
    :class="[
      classes,
      { hidden: loading }
    ]"
    :type="isLink ? null : type"
    :disabled="isLink ? null : isDisabled"
    @click="isLink ? null : handleClick($event)"
  >
    <!-- Add your button text here -->
    <slot />
    <div
      v-if="loading"
      class="maz-btn__spinner flex align-center justify-center"
    >
      <MazSpinner
        :size="25"
        dark
      />
    </div>
  </component>
</template>

<script>
  import MazSpinner from '../MazSpinner'
  import uniqueId from './../../mixins/uniqueId'

  /**
   * > Simple button component
   */

  export default {
    name: 'MazBtn',
    components: {
      MazSpinner
    },
    mixins: [uniqueId],
    props: {
      // is the id of the button
      id: { type: String, default: null },
      // is color type (`'primary'` / `'secondary'` / `'third'` / `'success'` / `'danger'` / `'grey'` / `'info'` / `'warning'` / `'light'` / `'dark'` / `'default'` / `'white'` / `'black'`)
      color: {
        type: String,
        default: 'primary'
      },
      // is the button type (button, submit or something else)
      type: { type: String, default: 'button' },
      // button size (`'lg'` / `'md'` / `'mini'` / `'fab'`)
      size: { type: String, default: null },
      // is a `boolean` to show the loader & disable it
      loading: { type: Boolean, default: false },
      // is a `boolean` to disable the button
      disabled: { type: Boolean, default: false },
      // apply the outline style
      outline: { type: Boolean, default: false },
      // apply the rounded style
      rounded: { type: Boolean, default: false },
      // apply the fab style
      fab: { type: Boolean, default: false },
      // apply the focus style
      active: { type: Boolean, default: false },
      // take 100% of the width
      block: { type: Boolean, default: false }
    },
    computed: {
      componentType () {
        return this.$attrs.href ? 'a' : 'button'
      },
      isLink () {
        return this.componentType === 'a'
      },
      isDisabled () {
        const { disabled, loading } = this
        return loading || disabled
      },
      classes () {
        const { color, size, outline, rounded, isDisabled, fab, active, block } = this
        return [
          ...(color ? [`btn--${color}`] : [null]),
          ...(size ? [`btn--${size}`] : [null]),
          ...(outline ? [`btn--${color}--outline`] : [null]),
          ...(rounded ? [`btn--rounded`] : [null]),
          ...(block ? [`btn--block`] : [null]),
          ...(fab ? [`btn--fab`] : [null]),
          ...(isDisabled ? [`btn--disabled`] : [null]),
          ...(active ? [`active`] : [null])
        ]
      }
    },
    methods: {
      handleClick (e) {
        // return the default event
        this.$emit('click', e)
      }
    }
  }
</script>
