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
        :white="dark"
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
