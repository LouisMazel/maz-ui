<template>
  <component
    :is="tag"
    class="maz-base-component maz-list-item"
    :class="{
      'has-hover': hover,
      'cursor-pointer': tag === 'button'
    }"
  >
    <!-- Place your item text here -->
    <slot />
  </component>
</template>

<script>
export default {
  name: 'MazListItem',
  props: {
    // You can change the balise type - Ex: `button`
    tag: { type: String, default: 'div' },
    // to set the hover color effect
    hover: { type: Boolean, default: false }
  }
}
</script>
