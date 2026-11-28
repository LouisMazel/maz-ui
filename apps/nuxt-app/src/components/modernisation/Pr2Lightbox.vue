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
  caption: index % 2 === 0 ? `Légende de la photo ${index + 1}` : undefined,
}))

const open = ref(false)
const index = ref(0)
</script>

<template>
  <ModernisationSection
    id="pr2-lightbox"
    title="PR 2. Lightbox"
    description="v-fullscreen-img, MazGallery et MazLightbox partagent un seul visualiseur : l'image grandit depuis sa miniature, avec balayage, zoom, clavier et légendes."
  >
    <ModernisationDemo title="v-fullscreen-img : deux groupes" hint="Chaque ligne est son propre groupe (même parent). Ouvre une image, utilise les flèches, Début et Fin, le balayage, clique pour zoomer sur un point, glisse vers le bas pour fermer. Les miniatures sont focalisables : Entrée ou Espace les ouvre.">
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
            v-fullscreen-img="{ src: full(id), alt: `Photo ${id}`, caption: `Second groupe, photo ${id}`, blurOnHover: true }"
            :src="thumb(id)"
            :alt="`Photo ${id}`"
            class="aspect-4/3 w-full rounded-lg object-cover"
          >
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Groupe nommé entre conteneurs" hint="Deux images éloignées avec group: 'trip' se parcourent ensemble (1 / 2).">
      <div class="flex items-center justify-between gap-4">
        <img
          v-fullscreen-img="{ src: full(1025), group: 'trip', alt: 'Voyage, première' }"
          :src="thumb(1025)"
          alt="Voyage, première"
          class="h-24 rounded-lg"
        >
        <span class="text-muted">...</span>
        <img
          v-fullscreen-img="{ src: full(1027), group: 'trip', alt: 'Voyage, seconde' }"
          :src="thumb(1027)"
          alt="Voyage, seconde"
          class="h-24 rounded-lg"
        >
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazGallery" hint="Les images de la galerie forment un seul groupe, y compris celles cachées derrière +2.">
      <MazGallery :images="galleryImages" :height="260" />
    </ModernisationDemo>

    <ModernisationDemo title="MazLightbox seule, avec légendes" hint="v-model et v-model:index. L'image grandit depuis le bouton.">
      <div class="flex items-center gap-4">
        <MazBtn @click="open = true">
          Ouvrir la lightbox
        </MazBtn>
        <span class="text-muted">Index : {{ index }}</span>
      </div>
      <MazLightbox v-model="open" v-model:index="index" :images="standaloneImages" />
    </ModernisationDemo>

    <ModernisationDemo title="De droite à gauche" hint="Passe la barre d'outils en RTL, puis ouvre une lightbox : ArrowLeft va à l'image suivante, les boutons et le balayage suivent la direction (le visualiseur lit la direction de la page).">
      <MazBtn color="secondary" @click="open = true">
        Ouvrir dans la direction actuelle
      </MazBtn>
    </ModernisationDemo>
  </ModernisationSection>
</template>
