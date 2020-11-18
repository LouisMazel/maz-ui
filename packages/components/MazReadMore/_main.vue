<template>
  <div class="maz-base-component maz-read-more maz-flex maz-direction-column">
    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
    <p :class="[textClass]">{{ textToShow }}</p>
    <a
      v-if="isTextLong"
      href="#"
      aria-role="button"
      @click.prevent="textVisible = !textVisible"
    >
      {{ textVisible
        ? t.readLess
        : t.readMore }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'MazReadMore',
  props: {
    text: { type: String, default: null },
    textClass: { type: String, default: null },
    truncateLength: { type: Number, default: 200 },
    translations: { type: Object, default: Object }
  },
  data () {
    return {
      textVisible: false
    }
  },
  computed: {
    t () {
      return {
        readMore: this.translations.readMore || 'Read more',
        readLess: this.translations.readLess || 'Read less'
      }
    },
    isTextLong () {
      return this.text && this.text.length > this.truncateLength
    },
    textToShow () {
      return this.isTextLong && !this.textVisible
        ? `${this.text.slice(0, this.truncateLength)}...`
        : this.text
    }
  }
}
</script>
