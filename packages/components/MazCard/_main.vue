<template>
  <div
    class="maz-card maz-base-component maz-flex maz-direction-column"
    :class="{
      'maz-card--linked': href,
      'maz-elevation': elevation,
      'maz-border-radius': radius,
      'maz-border maz-border-solid maz-border-color': bordered
    }"
    :style="[cardStyle]"
  >
    <component
      :is="href ? 'a' : 'div'"
      class="maz-card__wrapper maz-flex maz-flex-1"
      :class="[`maz-direction-${variant}`, { 'maz-card__link': href }]"
      :href="href"
      :target="href ? hrefTarget : null"
    >
      <div class="maz-card__gallery__wrapper maz-flex">
        <MazGallery
          v-if="images"
          :radius="radius"
          :width="_galleryWidth"
          :height="galleryHeight"
          :images="images"
          :zoom="zoom"
          :no-width="isColumnVariant"
          :no-height="!isColumnVariant && haveSomeContent"
          class="maz-card__gallery maz-flex-fixed maz-flex-1"
        />
        <div
          v-if="$slots['actions']"
          class="maz-card__gallery__actions maz-p-2 maz-text-left"
        >
          <!-- Can't be used when the card is linked -->
          <slot name="actions" />
        </div>
      </div>
      <!-- {{ $slots['title'] }} -->
      <div
        v-if="haveSomeContent"
        class="maz-flex-1"
      >
        <div class="maz-card__content__wrapper maz-p-3">
          <slot>
            <div
              v-if="$slots['title']"
              class="maz-card__title"
            >
              <slot name="title" />
            </div>
            <div
              v-if="$slots['subtitle']"
              class="maz-card__subtitle maz-text-muted"
            >
              <slot name="subtitle" />
            </div>
            <div
              v-if="$slots['content']"
              class="maz-card__content maz-pt-2"
            >
              <slot name="content" />
            </div>
          </slot>
        </div>
      </div>
    </component>
    <div
      v-if="$slots['footer']"
      class="maz-card__footer maz-p-3"
      :class="[{ 'maz-border-top maz-border-color maz-border-top-solid': isColumnVariant && haveSomeContent }, `maz-text-${footerAlign}`]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>



<script>
export default {
  name: 'MazCard',
  props: {
    // Images displayed
    images: { type: Array, default: null },
    // Card variant: Must be `column | row | row-reverse | column-reverse`
    variant: { type: String, default: 'column' },
    // Make card a link (footer area excluded)
    href: { type: String, default: null },
    // Target option of link: Muse be one of `_blank | _self | _parent | _top | framename`
    hrefTarget: { type: String, default: '_self' },
    // Card width
    width: { type: [String, Number], default: null },
    // Card max-width
    maxWidth: { type: [String, Number], default: 400 },
    // Footer text alignment: `right | left`
    footerAlign: { type: String, default: 'right' },
    // Gallery image width
    galleryWidth: { type: [String, Number], default: 200 },
    // Gallery image height
    galleryHeight: { type: [String, Number], default: 150 },
    // Enable "zoom" image on click (can't be used when the card has a link)
    zoom: { type: Boolean, default: false },
    // Set elevation to card (box-shadow)
    elevation: { type: Boolean, default: true },
    // Set radius to card (box-shadow)
    radius: { type: Boolean, default: true },
    // Set border to card
    bordered: { type: Boolean, default: false }
  },
  computed: {
    isColumnVariant () {
      const { variant } = this
      return ['column', 'column-reverse'].includes(variant)
    },
    cardStyle () {
      const { width, maxWidth } = this
      return {
        width: !width ? null : Number.isInteger(width) ? `${width}px` : width,
        minWidth: !width ? null : Number.isInteger(width) ? `${width}px` : width,
        maxWidth: width ? null : Number.isInteger(maxWidth) ? `${maxWidth}px` : maxWidth
      }
    },
    haveSomeContent () {
      const { $slots } = this
      const slots = ['default', 'title', 'subtitle', 'content']
      const response = Object.keys($slots).some((val) => slots.includes(val))
      return response
    },
    _galleryWidth () {
      const { galleryWidth, haveSomeContent } = this
      return haveSomeContent ? galleryWidth : '100%'
    }
  }
}
</script>

