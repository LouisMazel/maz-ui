<script lang="ts" setup>
type Side = 'start' | 'end' | 'top' | 'bottom'

const sides: Side[] = ['start', 'end', 'top', 'bottom']

const simpleOpened = ref(false)
const snapOpened = ref(false)
const activeSnap = ref<number | string>(0.4)
const scrollOpened = ref(false)
const scaleOpened = ref(false)
const drawerSide = ref<Side>('end')
const drawerOpened = ref(false)

function openDrawer(side: Side) {
  drawerSide.value = side
  drawerOpened.value = true
}
</script>

<template>
  <ModernisationSection
    id="pr2-sheets"
    title="PR 2. Bottom sheet et tiroir (façon Vaul)"
    description="Un balayage qui suit la vitesse du geste, des points d'accroche, un contenu défilant qui ne lutte jamais contre le glissement, une page qui recule. Sur ordinateur, fais glisser la poignée ou l'en-tête à la souris, ou utilise l'émulation tactile des devtools."
  >
    <ModernisationDemo
      title="Bottom sheet"
      hint="Glisse lentement vers le bas : elle revient depuis l'endroit où tu lâches. Lance-la : elle se ferme. Glisse vers le haut : elle résiste."
    >
      <MazBtn @click="simpleOpened = true">
        Ouvrir la sheet
      </MazBtn>
      <MazBottomSheet v-model="simpleOpened" title="Balaie-moi">
        <p>Lance cette sheet vers le bas, ou fais-la glisser au-delà du seuil, pour la fermer.</p>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Points d'accroche"
      hint="40 %, 70 % et pleine hauteur. Lance vers le point suivant, glisse entre eux, ou utilise la poignée (clic, Entrée, flèches)."
    >
      <MazBtn @click="snapOpened = true">
        Ouvrir avec des points d'accroche
      </MazBtn>
      <p class="mt-3 text-body-sm text-muted">
        Point d'accroche actif : <strong>{{ activeSnap }}</strong>
      </p>
      <MazBottomSheet v-model="snapOpened" v-model:snap="activeSnap" :snap-points="[0.4, 0.7, 1]" title="Points d'accroche">
        <p class="mb-3 text-body-sm">
          Point d'accroche actif : <strong>{{ activeSnap }}</strong>
        </p>
        <p v-for="line in 20" :key="line" class="my-2">
          Ligne {{ line }} d'un long contenu. Pas complètement ouverte, le glissement agrandit la sheet. Complètement ouverte, le contenu défile.
        </p>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Contenu défilant"
      hint="Fais défiler la liste, puis tire vers le bas depuis le haut de la liste : la sheet prend le relais seulement quand la liste est tout en haut."
    >
      <MazBtn @click="scrollOpened = true">
        Ouvrir avec une longue liste
      </MazBtn>
      <MazBottomSheet v-model="scrollOpened" title="Longue liste">
        <div class="max-h-64 overflow-y-auto rounded-lg border border-divider p-3">
          <p v-for="line in 40" :key="line" class="my-2">
            Élément {{ line }}
          </p>
        </div>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Réduire l'arrière-plan"
      hint="La page recule avec des coins arrondis et suit la sheet pendant que tu la fais glisser. Animations réduites : rien ne change d'échelle."
    >
      <MazBtn @click="scaleOpened = true">
        Ouvrir avec la page réduite
      </MazBtn>
      <MazBottomSheet v-model="scaleOpened" scale-background title="La page recule">
        <p>La page derrière cette sheet est réduite. Fais glisser la sheet pour la voir suivre.</p>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Tiroirs sur les quatre côtés"
      hint="Balaie vers le côté pour fermer, lance pour fermer vite. Passe en RTL avec la barre d'outils : début et fin s'inversent, et le balayage aussi."
    >
      <div class="flex flex-wrap gap-2">
        <MazBtn v-for="side in sides" :key="side" @click="openDrawer(side)">
          Ouvrir {{ side }}
        </MazBtn>
      </div>
      <MazDrawer v-model="drawerOpened" :side="drawerSide" :title="`Tiroir ${drawerSide}`">
        <div class="p-4">
          <p>Balaie vers le côté {{ drawerSide }} pour le fermer. À la souris, fais glisser l'en-tête.</p>
          <p v-for="line in 20" :key="line" class="my-2 text-muted">
            Ligne {{ line }}
          </p>
        </div>
      </MazDrawer>
    </ModernisationDemo>
  </ModernisationSection>
</template>
