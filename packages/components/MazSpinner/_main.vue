<template>
  <svg
    :class="[{
      'spinner-anim__white': dark
    }, fillColorClass]"
    :width="`${size}px`"
    :height="`${size}px`"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 50 50"
    style="enable-background: new 0 0 50 50;"
    xml:space="preserve"
    class="maz-spinner maz-spinner-anim"
  >
    <path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" />
  </svg>
</template>

<script>
export default {
  name: 'MazSpinner',
  props: {
    size: { type: Number, default: 40 },
    dark: { type: Boolean, default: false },
    color: { type: String, default: 'primary' }
  },
  computed: {
    fillColorClass () {
      return `maz-fill-${this.color}`
    }
  }
}
</script>
