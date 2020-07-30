<template>
  <figure
    ref="MazImg"
    v-preview="{ src, alt, disabled: noZoom }"
    class="maz-base-component maz-img maz-flex maz-flex-center maz-direction-column maz-bg-color-light maz-space-between"
    :style="[containerSize]"
    :class="{
      'maz-img--no-zoom': noZoom,
      'maz-img--no-shadow': noShadow,
      'maz-border-radius': !noBorderRadius,
      'maz-img--fullwidth': fullwidth,
      'maz-img--loading': loading
    }"
  >
    <div
      v-if="!loading"
      :aria-label="alt"
      :style="bgImg"
      class="maz-img__bg-img"
      :class="{
        'maz-img__bg-img--contain maz-bg-color-light': contain
      }"
    />
    <MazSpinner v-else />
    <MazBtn
      fab
      left-icon-name="visibility"
      class="maz-img__show-btn"
    />
    <figcaption
      v-if="legend"
      class="maz-img__legend maz-p-2"
    >
      {{ legend }}
    </figcaption>
  </figure>
</template>

<script>
import preview from './../../directives/img-preview'

import MazBtn from './../MazBtn'
import MazSpinner from './../MazSpinner'

export default {
  name: 'MazImg',
  components: { MazSpinner, MazBtn },
  directives: {
    preview
  },
  props: {
    // path or url of image
    src: {
      validator: prop => ['string'].includes(typeof prop) && prop !== '',
      required: true
    },
    // alt attribute of image
    alt: { type: String, default: 'Image description' },
    // legend of image
    legend: { type: String, default: null },
    // show all image in the container
    contain: { type: Boolean, default: false },
    // remove shadow of container
    noShadow: { type: Boolean, default: false },
    // disable the zoom on click
    noZoom: { type: Boolean, default: false },
    // disable the zoom on click
    noBorderRadius: { type: Boolean, default: false },
    // display `width: 100%`
    fullwidth: { type: Boolean, default: false }
  },
  data () {
    return {
      width: null,
      height: null,
      loading: true,
      heightImage: null
    }
  },
  computed: {
    containerSize () {
      const { height, width } = this
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    bgImg () {
      const { src } = this
      return {
        backgroundImage: `url(${src})`
      }
    }
  },
  watch: {
    src () {
      this.setSizeImage()
    }
  },
  mounted () {
    this.setSizeImage()
    this.setObserver()
  },
  methods: {
    setSizeImage () {
      try {
        const img = new Image()
        img.src = this.src
        img.onload = () => {
          this.loading = false
          this.width = img.width
          this.heightImage = img.height
          this.height = this.getHeightRatio(img.height)
        }
      } catch (e) {
        throw new Error(`[MazImg] Error while getting image dimensions: ${e}`)
      }
    },
    getHeightRatio (height) {
      try {
        const { width } = this
        const { MazImg } = this.$refs
        if (!MazImg) return
        const componentWidth = this.$refs.MazImg.clientWidth
        const ratio = 1 - ((width - componentWidth) / width)
        return height * ratio
      } catch (e) {
        throw new Error (`[MazImg] Error while calculte height size, ${e}`)
      }
    },
    setObserver () {
      const elem = this.$refs.MazImg
      const resizeObserver = new ResizeObserver(() => {
        this.height = this.getHeightRatio(this.heightImage)
      })
      resizeObserver.observe(elem)
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-img {
    position: relative;
    overflow: hidden;
    max-height: 100%;
    max-width: 100%;
    transition: all 300ms ease-in-out, width 0ms, height 0ms;

    &--loading {
      width: 200px;
      height: 200px;
    }

    &--fullwidth {
      width: 100% !important;
    }

    &:not(.maz-img--no-shadow) {
      box-shadow: 0 0 1rem 0 rgba(2, 32, 43, .1);
    }

    &__show-btn {
      position: absolute;
      transition: all 300ms ease-in-out;
      transform: scale(0);
      opacity: 0;
    }

    $this: &;

    &__bg-img {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      height: 100%;
      width: 100%;
      transition: all 300ms ease-in-out;

      &--contain,
      &--fullsize {
        background-size: contain;
      }
    }

    &:hover:not(.maz-img--no-zoom) {
      cursor: pointer;
      transform: translateY(-3px);
      box-shadow: 0 0 1.4rem 0 rgba(2, 32, 43, .2);

      #{$this}__bg-img {
        filter: blur(4px);
      }

      #{$this}__show-btn {
        transform: scale(1);
        opacity: 1;
      }
    }

    figcaption {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgba($bg-color-light, .8);
    }
  }

  .maz-is-dark.maz-img figcaption,
  .maz-is-dark .maz-img figcaption {
    background-color: rgba($bg-color-dark-light, .8);
  }
</style>
