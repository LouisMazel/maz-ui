<template>
  <div
    class="maz-collapse pos-r"
    :class="{
      'is-dark': dark,
      'is-open': isOpen
    }"
  >
    <MazBtn
      class="maz-collapse__header-btn flex align-center justify-center br-0"
      :color="dark ? 'dark' : 'white'"
      size="md"
      @click="isOpen = !isOpen"
    >
      <slot name="header-text">
        Default Header
      </slot>
      <ArrowDown
        class="maz-collapse__header-btn__arrow ml-2"
        :dark="dark"
        :color="arrowColor"
      />
    </MazBtn>
    <MazTransitionExpand class="maz-collapse__content">
      <div v-if="isOpen">
        <slot>
          Default Content
        </slot>
      </div>
    </MazTransitionExpand>
  </div>
</template>

<script>
  import MazTransitionExpand from '../MazTransitionExpand'
  import ArrowDown from '../_subs/ArrowDown'

  export default {
    name: 'MazCollapse',
    components: {
      MazTransitionExpand,
      ArrowDown
    },
    props: {
      open: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      arrowColor: { type: String, default: null }
    },
    data () {
      return {
        isOpen: this.open
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-collapse {
    color: $text-color;
    border-radius: $border-radius;
    overflow: hidden;
    border: 1px solid $hover-color;

    &__header-btn {
      background-color: transparent;
      border: none;
      color: $text-color;
      width: 100%;
      outline: none;
      font-size: 14px;

      &__arrow {
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }

    &__content {
      border-top: 1px solid $text-color-dark;
    }

    &.is-open {
      .maz-collapse__header-btn__arrow {
        transform: rotate(180deg);
      }
    }

    &.is-dark {
      color: $text-color-dark;
      background-color: $bg-color-dark;
      border: 1px solid $third-color-dark;

      .maz-collapse {
        &__header-btn {
          color: $text-color-dark;

          &:hover,
          &:focus {
            background-color: $hover-color-dark;
          }
        }

        &__content {
          border-color: $third-color-dark;
        }
      }
    }
  }
</style>
