<template>
  <div
    class="maz-base-component maz-sidebar"
    :class="{
      'maz-is-dark': dark
    }"
  >
    <div
      :id="uniqueId"
      ref="MazSidebar"
      class="maz-sidebar__wrapper maz-flex maz-flex-fixed maz-m-h-100 maz-mh-100"
      :style="[wrapperStyle]"
      :class="{
        'is-close': !isOpen,
        'is-absolute': absolute,
        'has-shadow': !noShadow,
        'is-right': right
      }"
    >
      <transition
        name="fade"
        mode="in-out"
      >
        <div
          v-show="isOpen"
          class="maz-sidebar__wrapper__content maz-flex maz-flex-1 maz-w-100 maz-direction-column"
        >
          <slot />
        </div>
      </transition>
      <div
        v-if="!noCloseBtn"
        class="maz-sidebar__wrapper__close-btn"
      >
        <button
          class="maz-flex maz-flex-center"
          @click="isOpen = !isOpen"
        >
          <slot name="button-icon">
            <ArrowIcon :orientation="isOpen ? 'left' : 'right'" />
          </slot>
        </button>
      </div>
      <div
        v-show="loading && isOpen"
        class="maz-sidebar__wrapper__load-layer maz-flex maz-flex-center"
      >
        <slot name="content-loader">
          <MazLoader />
        </slot>
      </div>
    </div>
    <div
      v-if="layer && isOpen"
      class="maz-sidebar__wrapper__opacity-layer"
      @click="isOpen = false"
    />
  </div>
</template>

<script>
import MazLoader from '../MazLoader'
import uniqueId from './../../mixins/uniqueId'
import ArrowIcon from '../_subs/ArrowIcon'

/**
 * Generic component used to show a togglable sidebar (left or right) in the layout
 * @module component - MazSidebar
 * @param {boolean} loading - Show / hide the loader inside the sidebar component
 * @param {number} width - The sidebar width
 * @param {boolean} [noCloseBtn=false] - Specify if the sidebar should have or not the toggle button
 * @param {boolean} [noShadow=false] - Specify if the sidebar should have the drop shadow
 * @param {boolean} [absolute=false] - Specify if the sidebar should be positionned in an absolute way.
 * @param {boolean} [isOpen=false] - Is the sidebar open or not
 * @param {boolean} [right=false] - Specify the sidebar direction, by default the sidebar is positionned in the left side.
 * @param {boolean} [dark=false] - Specify the dark mode
 * @param {boolean} [layer=false] - Specify
 * @emits toggle-menu
 */
export default {
  name: 'MazSidebar',
  components: {
    MazLoader,
    ArrowIcon
  },
  mixins: [uniqueId],
  props: {
    // Boolean to open or not the sidebar
    value: { type: Boolean, required: true },
    id: { type: String, default: null },
    // Size bar width
    width: { type: Number, default: 300 },
    // Show loading layer
    loading: { type: Boolean, default: false },
    // So that the user cannot close the sidebar
    noCloseBtn: { type: Boolean, default: false },
    // Remove shadow UI
    noShadow: { type: Boolean, default: false },
    // the sidebar goes over the content
    absolute: { type: Boolean, default: false },
    // Must be activated if you want to integrate it on the right side
    right: { type: Boolean, default: false },
    // Dark mode
    dark: { type: Boolean, default: false },
    // Gray layer above the content, if you click on it, the side bar closes
    layer: { type: Boolean, default: false }
  },
  computed: {
    isOpen: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    wrapperStyle () {
      return {
        width: `${this.isOpen ? this.width : 0}px`,
        flex: `0 0 ${this.isOpen ? this.width : 0}px`,
        zIndex: this.isOpen && this.layer ? 10 : 9
      }
    }
  }
}
</script>
