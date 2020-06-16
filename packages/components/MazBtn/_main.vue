<template>
  <component
    :is="componentType"
    :id="uniqueId"
    v-bind="$attrs"
    class="maz-btn"
    :class="[
      classes,
      {
        hidden: loading,
        'maz-flex-inline maz-flex maz-flex-center': hasIcon()
      }
    ]"
    :type="isLink ? null : type"
    :disabled="isLink ? null : isDisabled"
    @click="isLink ? null : handleClick($event)"
    @mouseenter="emitMouseEnter($event)"
    @mouseleave="emitMouseLeave($event)"
  >
    <div
      v-if="hasLeftIcon()"
      class="maz-flex maz-flex-center"
      :class="{
        'maz-mr-2': !fab && hasSlotDefault()
      }"
    >
      <!-- Icon slot (`icon-left`) -->
      <slot :name="`icon-left`">
        <!-- none -->
        <i class="material-icons">{{ leftIconName }}</i>
      </slot>
    </div>

    <slot />

    <div
      v-if="hasRightIcon()"
      class="maz-flex maz-flex-center"
      :class="{
        'maz-ml-2': !fab && hasSlotDefault()
      }"
    >
      <!-- Icon slot (`icon-right`) -->
      <slot :name="`icon-right`">
        <!-- none -->
        <i class="material-icons">{{ rightIconName }}</i>
      </slot>
    </div>
    <!-- Add your button text here -->
    <div
      v-if="loading"
      class="maz-btn__spinner maz-flex maz-flex-center"
    >
      <MazSpinner
        :size="25"
        :color="color"
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
    block: { type: Boolean, default: false },
    // remove shadow/elevation
    noShadow: { type: Boolean, default: false },
    // should be a [material icon](https://material.io/resources/icons/) name
    leftIconName: { type: String, default: null },
    // should be a [material icon](https://material.io/resources/icons/) name
    rightIconName: { type: String, default: null }
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
      const { color, size, outline, rounded, isDisabled, fab, active, block, noShadow, hasIcon } = this
      return [
        ...(color ? [`maz-btn--${color}`] : [null]),
        ...(size ? [`maz-btn--${size}`] : [null]),
        ...(outline ? [`maz-btn--${color}--outline`] : [null]),
        ...(rounded ? ['maz-btn--rounded'] : [null]),
        ...(block ? ['maz-btn--block'] : [null]),
        ...(fab ? ['maz-btn--fab maz-dots-text'] : [null]),
        ...(isDisabled ? ['maz-btn--disabled'] : [null]),
        ...(active ? ['maz-active'] : [null]),
        ...(noShadow ? ['maz-no-shadow'] : [null]),
        ...(hasIcon() ? ['maz-btn--icon'] : [null])
      ]
    }
  },
  methods: {
    hasSlotDefault () {
      return this.$slots['default']
    },
    hasIcon () {
      return this.hasLeftIcon() || this.hasRightIcon()
    },
    hasLeftIcon () {
      return this.leftIconName || this.$slots['icon-left']
    },
    hasRightIcon () {
      return this.rightIconName || this.$slots['icon-right']
    },
    handleClick (e) {
      // return click event
      this.$emit('click', e)
    },
    emitMouseEnter (e) {
      // return mouseenter event
      this.$emit('mouseenter', e)
    },
    emitMouseLeave (e) {
      // return mouseleave event
      this.$emit('mouseleave', e)
    }
  }
}
</script>
