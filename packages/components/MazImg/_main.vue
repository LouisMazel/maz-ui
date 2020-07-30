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
        img.onload = () => {
          this.loading = false
          this.width = img.width
          this.heightImage = img.height
          this.height = this.getHeightRatio(img.height)
        }
        img.src = this.src
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
