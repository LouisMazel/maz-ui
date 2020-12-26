<template>
  <div
    ref="LangSwitcher"
    class="maz-dropdown maz-base-component"
    :class="{'maz-is-dark': dark }"
    @mouseenter="hover ? openMenu() : null"
    @mouseleave="hover ? closeMenu() : null"
  >
    <MazBtn
      no-shadow
      class="maz-dropdown__btn"
      :color="color"
      v-bind="$attrs"
      @focus.native="openMenu()"
      @blur.native="closeMenu()"
    >
      <slot />
      <i
        class="maz-dropdown__btn__icon material-icons maz-ml-2"
        :class="{ 'rotate': dropdownOpen }"
      >
        keyboard_arrow_down
      </i>
    </MazBtn>
    <transition
      tag="div"
      name="maz-fade"
      class="maz-bg-color"
    >
      <div
        v-show="dropdownOpen"
        class="maz-dropdown__dropdown maz-flex maz-direction-column maz-border-radius maz-bg-color maz-border maz-border-solid maz-border-color"
        :class="[{
          'maz-dropdown__dropdown--top': hasPositionTop
        }, hasPositionLeft ? 'maz-dropdown__dropdown--left': 'maz-dropdown__dropdown--right']"
      >
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MazDropdown',
  inheritAttrs: false,
  props: {
    // dropdown is open on hover
    hover: { type: Boolean, default: false },
    // set dropdown open
    open: { type: Boolean, default: false },
    // set dark mode
    dark: { type: Boolean, default: false },
    // set dropdown position
    position: { type: String, default: 'right bottom' },
    // set color of button
    color: { type: String, default: 'transparent' },
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    dropdownOpen () {
      return this.open || this.isOpen
    },
    hasPositionTop () {
      return this.position.includes('top')
    },
    hasPositionLeft () {
      return this.position.includes('left')
    }
  },
  methods: {
    openMenu () {
      this.isOpen = true
    },
    closeMenu () {
      this.isOpen = false
    }
  }
}
</script>
