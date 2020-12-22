<template>
  <div>
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
        :class="[`maz-gallery__item--${i + 1}`]"
      >
        <img
          v-zoom-img="{ src: image.slug, alt: image.alt, disabled: !zoom }"
          :style="`background-image: url('${image.slug}');`"
          class="maz-gallery__item__image maz-flex-1"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          :alt="image.alt"
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
    <div
      v-for="(image, i) in imagesHidden"
      :key="i"
      v-zoom-img="{ src: image.slug, disabled: !zoom }"
      class="maz-gallery__hidden"
    />
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import imgDirective from 'vue-zoom-img'

export default {
  name: 'MazGallery',
  directives: {
    'zoom-img': imgDirective
  },
  props: {
    // Array of string or object: `['https://via.placeholder.com/500', 'https://via.placeholder.com/600']` or `[{ slug: 'https://via.placeholder.com/500', alt: 'image descripton' }, { slug: 'https://via.placeholder.com/600', alt: 'image descripton' }]`
    images: { type: Array, required: true },
    // Images count shown (max: 5)
    imagesShownCount: { type: Number, default: 5 },
    // Remove transparent layer with the remain count (ex: +2)
    noRemaining: { type: Boolean, default: false },
    // Height of gallery
    height: { type: [Number, String], default: 150 },
    // Remove default height
    noHeight: { type: Boolean, default: false },
    // Width of gallery
    width: { type: [Number, String], default: '100%' },
    // Remove default width
    noWidth: { type: Boolean, default: false },
    // Add the default border radius to gallery
    radius: { type: Boolean, default: true },
    // Add feature to show the carousel images on click
    zoom: { type: Boolean, default: true },
    // Layer with photography icon when no images is provided
    hasEmptyLayer: { type: Boolean, default: true }
  },
  setup (props) {
    const { images, imagesShownCount, height, width, noWidth, noHeight } = props
    if (imagesShownCount > 5) console.warn('[MazUI](maz-gallery) The maximum of "images-shown-count" is 5')

    const imagesCount = computed(() => imagesShownCount <= 5 ? imagesShownCount : 5)

    const numberImagesRemaining = computed(() => {
      return images.length - (images.length < imagesCount.value ? images.length : imagesCount.value)
    })

    const imagesNormalized = computed(() => images.map((i) => typeof i === 'object' ? i : { slug: i, alt: null }))

    const imagesShown = computed(() => imagesNormalized.value.slice(0, imagesCount.value))
    const imagesHidden = computed(() => imagesNormalized.value.slice(imagesCount.value, images.length))

    const sizeStyle = computed(() => ({
      ...(!noWidth ? { flex: `0 0 ${Number.isInteger(width) ? `${width}px` : width}` } : {}),
      ...(!noHeight
        ? {
          height: Number.isInteger(height) ? `${height}px` : `${height}`,
          minHeight: Number.isInteger(height) ? `${height}px` : `${height}`
        }
        : {})
    }))

    return {
      numberImagesRemaining,
      imagesShown,
      imagesHidden,
      sizeStyle
    }
  }
}
</script>

