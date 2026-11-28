<script lang="ts" setup>
import MazAvatarGroup from 'maz-ui/components/MazAvatarGroup'
import MazBeforeAfter from 'maz-ui/components/MazBeforeAfter'
import MazProgressiveBlur from 'maz-ui/components/MazProgressiveBlur'
import MazScrollArea from 'maz-ui/components/MazScrollArea'
import MazSplitter from 'maz-ui/components/MazSplitter'
import { ref } from 'vue'

const position = ref(50)
const sizes = ref<number[]>()
const maxAvatars = ref(4)
const showMore = ref(false)

const people = [
  { caption: 'Camille Durand', color: 'auto' as const },
  { caption: 'Louis Mazel', color: 'auto' as const },
  { caption: 'Inès Martin', color: 'auto' as const },
  { caption: 'Hugo Petit', color: 'auto' as const },
  { caption: 'Jade Moreau', color: 'auto' as const },
  { caption: 'Nina Roux', color: 'auto' as const },
  { caption: 'Lucas Blanc', color: 'auto' as const },
  { caption: 'Zoé Faure', color: 'auto' as const },
]

const lines = Array.from({ length: 24 }, (_, index) => `Ligne ${index + 1} : le contenu défile, la barre reste fine et les bords s'estompent.`)
const splitterPanels = [
  { id: 'list', size: 30, min: 15, max: 60, collapsible: true },
  { id: 'detail', min: 30 },
]
const threePanels = [
  { id: 'top', size: 25, min: 10 },
  { id: 'middle', size: 50, min: 20 },
  { id: 'bottom', size: 25, min: 10 },
]
</script>

<template>
  <ModernisationSection
    id="pr5-layout"
    title="PR 5. Mise en page"
    description="Comparer deux images, redimensionner des panneaux, faire défiler proprement, flouter progressivement et grouper des avatars. Tout se manie à la souris, au tactile et au clavier, suit le sens de lecture et se calme quand tu réduis les animations."
  >
    <ModernisationDemo title="MazBeforeAfter" hint="Glisse la poignée, clique n'importe où ou utilise les flèches, Début, Fin, Page précédente et Page suivante. La poignée oscille une fois à la première apparition.">
      <div class="grid gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <MazBeforeAfter
            v-model="position"
            before="https://picsum.photos/id/1018/1200/800?grayscale&blur=3"
            after="https://picsum.photos/id/1018/1200/800"
            after-alt="Montagnes au lever du jour"
            class="max-w-full"
          />
          <p class="text-body-sm text-muted">
            Position : {{ Math.round(position) }} %
          </p>
        </div>
        <MazBeforeAfter
          orientation="vertical"
          before="https://picsum.photos/id/1039/1200/800?grayscale&blur=3"
          after="https://picsum.photos/id/1039/1200/800"
          before-label="Brouillon"
          after-label="Final"
          aspect-ratio="3 / 2"
        />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSplitter" hint="Glisse la poignée, ou donne-lui le focus puis utilise les flèches (Maj pour aller plus vite), Début, Fin et Entrée pour replier le panneau. Double clic : retour aux tailles de départ. Les tailles de la première zone sont mémorisées.">
      <div class="flex flex-col gap-6">
        <div class="h-64 overflow-hidden rounded-lg border border-divider">
          <MazSplitter v-model:sizes="sizes" :panels="splitterPanels" storage-key="pr5-splitter-demo">
            <template #list>
              <ul class="p-3 text-body-sm">
                <li v-for="person in people" :key="person.caption" class="py-1">
                  {{ person.caption }}
                </li>
              </ul>
            </template>
            <template #detail>
              <div class="p-4">
                <p class="text-title-4">
                  Détail
                </p>
                <p class="mt-2 text-muted">
                  Tailles : {{ sizes?.map(size => `${Math.round(size)} %`).join(' / ') }}
                </p>
              </div>
            </template>
          </MazSplitter>
        </div>
        <div class="h-72 overflow-hidden rounded-lg border border-divider">
          <MazSplitter orientation="vertical" :panels="threePanels">
            <template #top>
              <p class="p-3 text-body-sm">
                En haut
              </p>
            </template>
            <template #middle>
              <p class="p-3 text-body-sm">
                Au milieu
              </p>
            </template>
            <template #bottom>
              <p class="p-3 text-body-sm">
                En bas
              </p>
            </template>
          </MazSplitter>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazScrollArea" hint="La barre est fine et identique partout, le défilement reste natif. Les bords s'estompent tant qu'il reste du contenu. Tab donne le focus à la zone qui défile.">
      <div class="grid gap-6 md:grid-cols-2">
        <MazScrollArea max-height="14rem" label="Liste qui défile" class="rounded-lg border border-divider p-3">
          <p v-for="line in lines" :key="line" class="py-1 text-body-sm">
            {{ line }}
          </p>
        </MazScrollArea>
        <MazScrollArea orientation="horizontal" label="Galerie" class="rounded-lg border border-divider p-3">
          <div class="flex gap-3 pb-3">
            <div
              v-for="index in 14"
              :key="index"
              class="flex h-24 w-32 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
            >
              {{ index }}
            </div>
          </div>
        </MazScrollArea>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazProgressiveBlur" hint="Le flou grandit vers le bord sans ligne dure. Ici, au bas d'une liste qui défile.">
      <div class="relative h-64 overflow-auto rounded-lg border border-divider">
        <div class="p-4">
          <p v-for="line in lines" :key="line" class="py-1.5 text-body-sm">
            {{ line }}
          </p>
        </div>
        <div class="sticky bottom-0 h-0">
          <MazProgressiveBlur position="bottom" height="5rem" :strength="14" />
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazAvatarGroup" hint="Survole le groupe : les avatars glissent pour se montrer en entier. Le compteur peut être un simple texte ou un bouton.">
      <div class="flex flex-col items-start gap-6">
        <div class="flex items-center gap-4">
          <MazAvatarGroup :avatars="people" :max="maxAvatars" />
          <MazBtn size="sm" @click="maxAvatars = maxAvatars === 4 ? 6 : 4">
            max : {{ maxAvatars }}
          </MazBtn>
        </div>
        <MazAvatarGroup :avatars="people" :max="3" size="sm" more-clickable @more-click="showMore = !showMore" />
        <p v-if="showMore" class="text-body-sm text-muted">
          Autres : {{ people.slice(3).map(person => person.caption).join(', ') }}
        </p>
        <MazAvatarGroup :avatars="people" :max="5" size="lg" :overlap="0.45" rounded-size="lg" />
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
