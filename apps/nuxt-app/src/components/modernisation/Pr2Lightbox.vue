<script lang="ts" setup>
import { vFullscreenImg } from 'maz-ui/directives/vFullscreenImg'

const photoIds = [1015, 1016, 1018, 1019, 1020, 1021, 1022, 1024]

function thumb(id: number) {
  return `https://picsum.photos/id/${id}/400/300`
}

function full(id: number) {
  return `https://picsum.photos/id/${id}/1600/1000`
}

const galleryImages = photoIds.slice(0, 7).map(id => ({ src: full(id), thumbnail: thumb(id), alt: `Photo ${id}` }))

const standaloneImages = photoIds.slice(0, 5).map((id, index) => ({
  src: full(id),
  alt: `Photo ${id}`,
  caption: index % 2 === 0 ? `Caption of the photo ${index + 1}` : undefined,
}))

const open = ref(false)
const index = ref(0)
</script>

<template>
  <ModernisationSection
    id="pr2-lightbox"
    title="PR 2. Lightbox"
    description="v-fullscreen-img, MazGallery and MazLightbox share one viewer: the image grows from its thumbnail, with swipe, zoom, keyboard and captions."
  >
    <ModernisationDemo title="v-fullscreen-img: two groups" hint="Each row is its own group (same parent). Open one, use the arrows, Home and End, swipe, click to zoom on a point, drag down to close. The thumbnails are focusable: Enter or Space opens them.">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-4 gap-2">
          <img
            v-for="id in photoIds.slice(0, 4)"
            :key="id"
            v-fullscreen-img="{ src: full(id), alt: `Photo ${id}`, scaleOnHover: true }"
            :src="thumb(id)"
            :alt="`Photo ${id}`"
            class="aspect-4/3 w-full rounded-lg object-cover"
          >
        </div>
        <div class="grid grid-cols-4 gap-2">
          <img
            v-for="id in photoIds.slice(4)"
            :key="id"
            v-fullscreen-img="{ src: full(id), alt: `Photo ${id}`, caption: `Second group, photo ${id}`, blurOnHover: true }"
            :src="thumb(id)"
            :alt="`Photo ${id}`"
            class="aspect-4/3 w-full rounded-lg object-cover"
          >
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Named group across containers" hint="Two images far from each other with group: 'trip' are browsed together (1 / 2).">
      <div class="flex items-center justify-between gap-4">
        <img
          v-fullscreen-img="{ src: full(1025), group: 'trip', alt: 'Trip, first' }"
          :src="thumb(1025)"
          alt="Trip, first"
          class="h-24 rounded-lg"
        >
        <span class="text-muted">...</span>
        <img
          v-fullscreen-img="{ src: full(1027), group: 'trip', alt: 'Trip, second' }"
          :src="thumb(1027)"
          alt="Trip, second"
          class="h-24 rounded-lg"
        >
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazGallery" hint="The gallery images are one group, including the hidden ones behind +2.">
      <MazGallery :images="galleryImages" :height="260" />
    </ModernisationDemo>

    <ModernisationDemo title="MazLightbox alone, with captions" hint="v-model and v-model:index. The image grows from the button.">
      <div class="flex items-center gap-4">
        <MazBtn @click="open = true">
          Open the lightbox
        </MazBtn>
        <span class="text-muted">Index: {{ index }}</span>
      </div>
      <MazLightbox v-model="open" v-model:index="index" :images="standaloneImages" />
    </ModernisationDemo>

    <ModernisationDemo title="Right to left" hint="Switch the toolbar to RTL, then open a lightbox: ArrowLeft goes to the next image, the buttons and the swipe follow the direction (the viewer reads the direction of the page).">
      <MazBtn color="secondary" @click="open = true">
        Open in the current direction
      </MazBtn>
    </ModernisationDemo>
  </ModernisationSection>
</template>
