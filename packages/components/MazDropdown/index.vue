<template>
  <div
    ref="LangSwitcher"
    class="maz-dropdown maz-base-component"
    :class="{'maz-is-dark': dark }"
    @mouseenter="hover ? openMenu() : null"
    @mouseleave="hover ? closeMenu() : null"
  >
    <MazBtn
      color="transparent"
      no-shadow
      class="maz-dropdown__btn"
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
      name="maz-slide"
      class="maz-bg-color"
    >
      <div
        v-show="dropdownOpen"
        class="maz-dropdown__dropdown maz-flex maz-direction-column maz-border-radius maz-bg-color maz-border maz-border-solid maz-border-color"
      >
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MazDropdown',
  props: {
    // dropdown is open on hover
    hover: { type: Boolean, default: false },
    // set dropdown open
    open: { type: Boolean, default: false },
    // set dark mode
    dark: { type: Boolean, default: false }
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    dropdownOpen () {
      return this.open || this.isOpen
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

<style lang="scss" scoped>
  .maz-dropdown {
    position: relative;

    &__btn {
      padding-right: .625rem;
      padding-left: .625rem;

      &__icon {
        transition: all 300ms ease-in-out;

        &.rotate {
          transform: rotate(-180deg);
        }
      }
    }

    &__dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      overflow: hidden;
      z-index: 1040;
    }
  }
</style>
