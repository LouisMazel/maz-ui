<script lang="ts" setup>
const toolbar = useTemplateRef<HTMLElement>('toolbar')
const toolbarItems = ['Gras', 'Italique', 'Souligné', 'Barré', 'Code', 'Lien']
const { onKeydown, currentIndex } = useRovingFocus({ container: toolbar, selector: 'button', typeahead: true })

const panelOpen = ref(false)
const trigger = ref<HTMLElement>()
const panelTransition = useOriginTransition({ origin: () => trigger.value })

function togglePanel(event: MouseEvent) {
  trigger.value = event.currentTarget as HTMLElement
  panelOpen.value = !panelOpen.value
}

const zone = useTemplateRef<HTMLElement>('zone')
const point = ref<{ x: number, y: number }>()
const pointPosition = ref({ left: 0, top: 0 })
const pointOpen = ref(false)
const pointTransition = useOriginTransition({ origin: () => point.value })

function onZoneClick(event: MouseEvent) {
  const rect = zone.value?.getBoundingClientRect()
  if (!rect)
    return

  point.value = { x: event.clientX, y: event.clientY }
  pointPosition.value = {
    left: Math.min(Math.max(event.clientX - rect.left, 8), Math.max(rect.width - 200, 8)),
    top: Math.min(Math.max(event.clientY - rect.top, 8), Math.max(rect.height - 100, 8)),
  }
  pointOpen.value = true
}

const cards = [
  { id: 1, title: 'Aurore', text: 'Aurore boréale sur un lac gelé.' },
  { id: 2, title: 'Canyon', text: 'Parois de roche rouge, une rivière étroite au fond.' },
  { id: 3, title: 'Port', text: 'Des bateaux de pêche qui attendent la marée.' },
]
const selectedCard = ref<number>()
const cardOpen = ref(false)
const cardElement = ref<HTMLElement>()
const cardTransition = useOriginTransition({ origin: () => cardElement.value })
const currentCard = computed(() => cards.find(card => card.id === selectedCard.value))

function openCard(id: number, event: MouseEvent) {
  selectedCard.value = id
  cardElement.value = event.currentTarget as HTMLElement
  cardOpen.value = true
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape')
    cardOpen.value = false
}

onMounted(() => document.addEventListener('keydown', onEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', onEscape))
</script>

<template>
  <ModernisationSection
    id="new-composables"
    title="5. Nouveaux composables"
    description="useSlidingIndicator, useRovingFocus et useOriginTransition, les briques derrière les nouvelles animations."
  >
    <ModernisationDemo title="useSlidingIndicator" hint="La pastille suit l'onglet actif. Avec stretch, elle s'étire vers la cible puis se rétracte. Pas d'animation au premier placement.">
      <div class="flex flex-col items-start gap-4">
        <div>
          <p class="mb-2 text-caption">
            stretch désactivé
          </p>
          <ModernisationSlidingTabs />
        </div>
        <div>
          <p class="mb-2 text-caption">
            stretch activé
          </p>
          <ModernisationSlidingTabs stretch />
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="useRovingFocus" hint="Tab entre une seule fois dans la barre d'outils. Les flèches suivent la direction (passe en RTL), Début et Fin sautent aux extrémités, taper une lettre saute à l'élément correspondant.">
      <div ref="toolbar" role="toolbar" aria-label="Mise en forme" class="inline-flex flex-wrap gap-2" @keydown="onKeydown">
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of useRovingFocus on native buttons -->
        <button
          v-for="(item, index) in toolbarItems"
          :key="item"
          type="button"
          :tabindex="index === currentIndex ? 0 : -1"
          class="focus-ring press rounded-lg border border-divider px-3 py-1.5"
          @click="currentIndex = index"
        >
          {{ item }}
        </button>
      </div>
      <p class="mt-3 text-caption">
        Élément courant : {{ toolbarItems[currentIndex] }}
      </p>
    </ModernisationDemo>

    <ModernisationDemo title="useOriginTransition : depuis un bouton" hint="Le panneau sort du bouton et y retourne. Avec les animations réduites, un court fondu.">
      <div class="flex min-h-48 flex-col items-start gap-4">
        <MazBtn @click="togglePanel">
          {{ panelOpen ? 'Fermer' : 'Ouvrir le panneau' }}
        </MazBtn>
        <Transition :css="false" @enter="panelTransition.enter" @leave="panelTransition.leave">
          <div v-if="panelOpen" class="w-72 max-w-full rounded-xl border border-divider bg-surface p-4 shadow-lg">
            <p class="text-label">
              Un panneau
            </p>
            <p class="text-body-sm text-muted">
              Il est sorti du bouton.
            </p>
          </div>
        </Transition>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="useOriginTransition : depuis un point" hint="Clique n'importe où dans la zone : le panneau grandit depuis le pointeur. Clique sur le panneau pour le fermer.">
      <div
        ref="zone"
        class="relative h-64 cursor-pointer overflow-hidden rounded-xl border border-dashed border-divider"
        @click.self="onZoneClick"
      >
        <p class="pointer-events-none p-4 text-muted">
          Clique n'importe où
        </p>
        <Transition :css="false" @enter="pointTransition.enter" @leave="pointTransition.leave">
          <button
            v-if="pointOpen"
            type="button"
            class="absolute w-48 rounded-xl border border-divider bg-surface p-3 text-start shadow-lg"
            :style="{ left: `${pointPosition.left}px`, top: `${pointPosition.top}px` }"
            @click="pointOpen = false"
          >
            <span class="block text-label">Ici</span>
            <span class="text-caption">Clique pour fermer</span>
          </button>
        </Transition>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="useOriginTransition : une carte s'agrandit depuis elle-même" hint="Ouvre une carte : elle grandit depuis sa position et y retourne. Échap ou le bouton la ferme.">
      <div class="grid gap-4 sm:grid-cols-3">
        <button
          v-for="card in cards"
          :key="card.id"
          type="button"
          class="focus-ring press rounded-xl border border-divider bg-surface p-4 text-start"
          @click="openCard(card.id, $event)"
        >
          <span class="block text-label">{{ card.title }}</span>
          <span class="text-caption">{{ card.text }}</span>
        </button>
      </div>

      <Transition enter-active-class="transition-opacity duration-normal" leave-active-class="transition-opacity duration-normal" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="cardOpen" class="fixed inset-0 z-40 bg-foreground/40" aria-hidden="true" @click="cardOpen = false" />
      </Transition>
      <div class="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
        <Transition :css="false" @enter="cardTransition.enter" @leave="cardTransition.leave">
          <div v-if="cardOpen && currentCard" role="dialog" aria-modal="true" :aria-label="currentCard.title" class="pointer-events-auto w-96 max-w-full rounded-2xl border border-divider bg-surface p-6 shadow-xl">
            <h4 class="text-title-3">
              {{ currentCard.title }}
            </h4>
            <p class="my-4 text-muted">
              {{ currentCard.text }}
            </p>
            <MazBtn size="sm" @click="cardOpen = false">
              Fermer
            </MazBtn>
          </div>
        </Transition>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
