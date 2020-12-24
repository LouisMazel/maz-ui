<template>
  <div
    class="maz-base-component maz-responsive-menu maz-flex maz-align-center"
  >
    <button
      ref="button-open"
      class="maz-btn maz-btn--outline"
      @click="open = !open"
    >
      <i class="material-icons">
        menu
      </i>
    </button>
    <transition name="maz-slide">
      <div
        v-if="open"
        v-closable="{
          exclude: ['button-open'],
          handler: 'close'
        }"
        class="maz-responsive-menu-collapse maz-flex maz-direction-column maz-border-radius"
      >
        <router-link
          v-for="({ name, label }, i) in routes"
          :key="`routes-${i}`"
          class="maz-responsive-menu-collapse__items maz-dots-text"
          :to="{ name }"
          @click.native="open = false"
        >
          {{ label }}
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import closable from './../../directives/v-closable'

export default {
  name: 'MazResponsiveMenu',
  directives: {
    closable
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
