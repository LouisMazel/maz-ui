<template>
  <section
    v-if="images.length || hasEmptyLayer"
    class="maz-base-component maz-gallery maz-flex"
    :style="[sizeStyle]"
    :class="{ 'maz-border-radius': radius }"
  >
    <figure
      v-for="(image, i) in imagesShown"
      :key="i"
      class="maz-gallery__item maz-flex maz-flex-center"
      :class="`maz-gallery__item--${i + 1}`"
    >
      <img
        v-zoom-img="hasZoom ? `/${image.slug}` : { disabled: true }"
        v-lazy:background-image="`/${image.slug}`"
        class="maz-gallery__item__image maz-flex-1"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        :alt="image.filename"
      />
      <div
        v-if="numberImagesRemaining && i + 1 === imagesShown.length && !noRemaining"
        class="maz-gallery__remaining-layer maz-flex maz-flex-center maz-bg-overlay"
      >
        <span>+{{ numberImagesRemaining }}</span>
      </div>
    </figure>
    <div
      v-if="hasEmptyLayer && !images.length"
      class="maz-bg-color-light maz-flex maz-flex-center maz-w-100"
      :class="{ 'maz-border-radius': radius }"
      :style="[sizeStyle]"
    >
      <i class="material-icons maz-text-muted">no_photography</i>
    </div>
  </section>
</template>

<script lang="ts">
import { computed } from '@vue/composition-api'
import imgDirective from 'vue-zoom-img'

export default {
  name: 'MazGallery',
  directives: {
    'zoom-img': imgDirective
  },
  props: {
    images: { type: Array, required: true },
    imagesShownNumber: { type: Number, default: 5 },
    noRemaining: { type: Boolean, default: false },
    height: { type: [Number, String], default: 150 },
    noHeight: { type: Boolean, default: false },
    width: { type: [Number, String], default: '100%' },
    noWidth: { type: Boolean, default: false },
    radius: { type: Boolean, default: false },
    hasZoom: { type: Boolean, default: false },
    hasEmptyLayer: { type: Boolean, default: false }
  },
  setup (props) {
    console.log('PROPS', props)
    const numberImagesRemaining = computed(() => {
      const { images, imagesShownNumber } = props
      return images.length - (images.length < imagesShownNumber ? images.length : imagesShownNumber)
    })
    const imagesShown = computed(() => props.images.slice(0, props.imagesShownNumber))

    const sizeStyle = computed(() => ({
      ...(!props.noWidth ? { flex: `0 0 ${Number.isInteger(props.width) ? `${props.width}px` : props.width}` } : {}),
      ...(!props.noHeight
        ? {
          height: Number.isInteger(props.height) ? `${props.height}px` : `${props.height}`,
          minHeight: Number.isInteger(props.height) ? `${props.height}px` : `${props.height}`
        }
        : {})
    }))

    return {
      numberImagesRemaining,
      imagesShown,
      sizeStyle
    }
  }
}
</script>

