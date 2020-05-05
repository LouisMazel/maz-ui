<template>
  <div
    class="maz-responsive-menu flex align-center"
  >
    <button
      ref="button-open"
      class="btn btn--primary--outline btn--icon"
      @click="open = !open"
    >
      <i class="material-icons">
        menu
      </i>
    </button>
    <transition name="slide">
      <div
        v-if="open"
        v-closable="{
          exclude: ['button-open'],
          handler: 'close'
        }"
        class="maz-responsive-menu-collapse flex direction-column border-radius"
      >
        <RouterLink
          v-for="({ name, label }, i) in routes"
          :key="`routes-${i}`"
          class="maz-responsive-menu-collapse__items dots-text"
          :to="{ name }"
          @click.native="open = false"
        >
          {{ label }}
        </RouterLink>
      </div>
    </transition>
  </div>
</template>

<script>
import VClosable from './../../directives/VClosable'

export default {
  name: 'MazResponsiveMenu',
  directives: {
    closable: VClosable
  },
  props: {
    routes: { type: Array, required: true }
  },
  data () {
    return {
      open: false
    }
  },
  methods: {
    close () {
      if (this.open) {
        this.open = false
      }
    }
  }
}
</script>
