<template>
  <div
    class="maz-list"
    :class="{
      'no-shadow': noShadow,
      'is-dark': dark
    }"
  >
    <transition-group
      :name="transition ? `flip-list` : null"
      tag="div"
    >
      <!-- Place `<MazListItem>` -->
      <slot />
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'MazList',
  props: {
    // active the transition animation
    transition: { type: Boolean, default: false },
    // remove the shadow effect behind the list
    noShadow: { type: Boolean, default: false },
    dark: { type: Boolean, default: false }
  }
}
</script>
