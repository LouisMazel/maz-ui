<template>
  <div
    class="maz-sidebar"
    :class="{
      'is-dark': dark
    }"
  >
    <div
      :id="uniqueId"
      ref="MazSidebar"
      class="maz-sidebar__wrapper flex flex-fixed m-h-100 mh-100"
      :style="
        'width:' + (isOpen ? (Number.isInteger(width) ? width + 'px;' : width) : '0px;') +
          'flex: 0 0 ' + (isOpen ? width + 'px;' : '0px;')
      "
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
          class="maz-sidebar__wrapper__content flex flex-1 w-100 direction-column"
        >
          <slot />
        </div>
      </transition>
      <div
        v-if="!noCloseBtn"
        class="maz-sidebar__wrapper__close-btn"
      >
        <button
          class="flex align-center justify-center"
          @click="isOpen = !isOpen"
        >
          <slot name="button-icon">
            <component
              :is="componentArrow"
              :dark="dark"
            />
          </slot>
        </button>
      </div>
      <div
        v-show="loader && isOpen"
        class="maz-sidebar__wrapper__load-layer flex align-center justify-center"
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
  import ArrowLeft from '../_subs/ArrowLeft'
  import ArrowRight from '../_subs/ArrowRight'

  /**
   * Generic component used to show a togglable sidebar (left or right) in the layout
   * @module component - MazSidebar
   * @param {boolean} loader - Show / hide the loader inside the sidebar component
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
      ArrowLeft,
      ArrowRight
    },
    mixins: [uniqueId],
    props: {
      value: { type: Boolean, required: true },
      id: { type: String, default: 'MazSidebar' },
      width: { type: Number, default: 350 },
      loader: { type: Boolean, default: false },
      noCloseBtn: { type: Boolean, default: false },
      noShadow: { type: Boolean, default: false },
      absolute: { type: Boolean, default: false },
      right: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
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
      componentArrow () {
        return this.isOpen
          ? this.right ? 'ArrowRight' : 'ArrowLeft'
          : this.right ? 'ArrowLeft' : 'ArrowRight'
      }
    }
  }
</script>
