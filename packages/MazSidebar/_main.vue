<template>
  <div
    :id="uniqueId"
    ref="MazSidebar"
    class="maz-sidebar flex flex-fixed m-h-100 mh-100"
    :style="
      'width:' + (isOpen ? (Number.isInteger(width) ? width + 'px;' : width) : '0px;') +
        'flex: 0 0 ' + (isOpen ? width + 'px;' : '0px;')
    "
    :class="{
      'is-close': !isOpen,
      'is-absolute': absolute,
      'has-shadow': !noShadow,
      'is-right': right,
      'is-dark': dark
    }"
  >
    <transition
      name="fade"
      mode="in-out"
    >
      <div
        v-show="isOpen"
        class="maz-sidebar__content flex flex-1 w-100 direction-column"
      >
        <slot />
      </div>
    </transition>
    <div
      v-if="!noCloseBtn"
      class="maz-sidebar__close-btn"
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
      class="maz-sidebar__load-layer flex align-center justify-center"
    >
      <slot name="content-loader">
        <MazLoader />
      </slot>
    </div>
  </div>
</template>

<script>
  import MazLoader from '../MazLoader'
  import uniqueId from './../mixins/uniqueId'
  import ArrowLeft from './_subs/ArrowLeft'
  import ArrowRight from './_subs/ArrowRight'

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
      loader: { type: Boolean, default: false },
      width: { type: Number, default: 350 },
      noCloseBtn: { type: Boolean, default: false },
      noShadow: { type: Boolean, default: false },
      absolute: { type: Boolean, default: false },
      right: { type: Boolean, default: false },
      dark: { type: Boolean, default: false }
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

<style lang="scss" scoped>
  .maz-sidebar {
    background-color: white;
    position: relative;
    transition-duration: 0.2s;
    transform: translateX(0);
    z-index: 9;

    &__content {
      overflow: hidden;
    }

    &__close-btn {
      position: absolute;
      top: 8px;
      left: 100%;

      button {
        background-color: rgba(darken(#FFF, 10%), 0.9);
        border-radius: 0 8px 8px 0;
        width: 23px;
        height: 48px;
        outline: 0;
        cursor: pointer;
        border: none;
        padding: 0;
      }
    }

    &__load-layer {
      background-color: rgba(0, 0, 0, 0.15);
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 10;
    }

    &.is-dark {
      background-color: var(--maz-bg-color-dark);
      border-right: 1px solid var(--maz-hover-color-dark);

      .maz-sidebar {
        &__load-layer {
          background-color: var(--maz-muted-color-dark);
        }

        &__close-btn {
          button {
            background-color: var(--maz-hover-color-dark);
            color: white;

            svg path {
              fill: white;
            }
          }
        }
      }
    }

    &.has-shadow {
      box-shadow: 2px 1px 8px rgba(0, 0, 0, 0.1);

      .maz-sidebar__close-btn button {
        box-shadow: 2px 1px 3px rgba(0, 0, 0, 0.1);
      }

      &.is-right {
        box-shadow: -2px -1px 8px rgba(0, 0, 0, 0.1);

        .maz-sidebar__close-btn button {
          box-shadow: -2px -1px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }

    &.is-close {
      box-shadow: none !important;
      transform: translateX(-100%);

      &.is-right {
        transform: translateX(100%);
      }
    }

    &.is-right {
      .maz-sidebar__close-btn {
        right: 100%;
        left: inherit;

        button {
          border-radius: 4px 0 0 4px;
        }
      }
    }

    &.is-absolute {
      left: 0;
      position: absolute;
      max-width: 90%;
    }

    &.is-absolute.is-right {
      right: 0;
      left: inherit;
    }
  }
</style>
