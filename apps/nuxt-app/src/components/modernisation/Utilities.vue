<script lang="ts" setup>
const drawFrom = [0, 90, 180, 270]
const checked = ref(false)

let nextId = 5
const items = ref([1, 2, 3, 4].map(id => ({ id, label: `Élément ${id}` })))

function add() {
  const index = Math.floor(items.value.length / 2)
  items.value.splice(index, 0, { id: nextId, label: `Élément ${nextId}` })
  nextId++
}

function remove(id: number) {
  items.value = items.value.filter(item => item.id !== id)
}

function shuffle() {
  items.value = [...items.value].reverse()
}
</script>

<template>
  <ModernisationSection
    id="utilities"
    title="3. Utilitaires"
    description="Utilitaires Tailwind et classes de transition fournis par maz-ui, utilisables dans n'importe quelle app."
  >
    <ModernisationDemo title="focus-ring and focus-within-ring" hint="Parcours les éléments avec Tab : l'anneau s'affiche seulement au focus clavier, avec la couleur, l'épaisseur et le décalage du thème.">
      <div class="flex flex-wrap items-center gap-4">
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="focus-ring rounded-lg border border-divider px-4 py-2">
          focus-ring
        </button>
        <a href="#utilities" class="focus-ring rounded-lg border border-divider px-4 py-2">
          Un lien
        </a>
        <div class="focus-within-ring flex items-center gap-2 rounded-lg border border-divider px-3 py-2">
          <span class="text-muted">focus-within-ring</span>
          <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
          <input class="bg-transparent outline-none" placeholder="Écris ici" aria-label="Champ avec un anneau sur son conteneur">
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="press" hint="L'élément s'enfonce quand on appuie et revient en place. Pas quand il est désactivé.">
      <div class="flex flex-wrap items-center gap-4">
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="press focus-ring rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          Appuie-moi
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="press focus-ring rounded-lg bg-secondary px-4 py-2 text-secondary-foreground">
          Appuie-moi aussi
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="press focus-ring rounded-lg border border-divider px-4 py-2">
          Contour
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" disabled class="press rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled-state">
          Désactivé
        </button>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="border-draw" hint="Une ligne fait le tour de la carte au survol et au focus, à partir de --maz-border-draw-from (0deg est le haut). La dernière carte est tracée quand elle est cochée (aria-checked).">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div
          v-for="angle in drawFrom"
          :key="angle"
          tabindex="0"
          class="border-draw focus-ring rounded-xl border border-divider bg-surface p-4"
          :style="{ '--maz-border-draw-from': `${angle}deg` }"
        >
          <p class="text-label">
            depuis {{ angle }}deg
          </p>
          <p class="text-caption">
            Survole-moi ou donne-moi le focus
          </p>
        </div>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button
          type="button"
          role="checkbox"
          :aria-checked="checked"
          class="border-draw focus-ring rounded-xl border border-divider bg-surface p-4 text-start"
          @click="checked = !checked"
        >
          <p class="text-label">
            État coché
          </p>
          <p class="text-caption">
            Clique pour {{ checked ? 'décocher' : 'cocher' }}
          </p>
        </button>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="TransitionGroup name=&quot;maz-list&quot;" hint="Un nouvel élément apparaît en fondu et monte, un élément retiré part, les autres glissent à leur place. Clique sur un élément pour le retirer.">
      <div class="mb-4 flex flex-wrap gap-2">
        <MazBtn size="sm" @click="add">
          Ajouter
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="shuffle">
          Mélanger (inverser)
        </MazBtn>
      </div>
      <TransitionGroup name="maz-list" tag="ul" class="relative flex max-w-sm flex-col gap-2">
        <li v-for="item in items" :key="item.id">
          <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
          <button
            type="button"
            class="focus-ring w-full rounded-lg border border-divider bg-surface px-4 py-2 text-start"
            @click="remove(item.id)"
          >
            {{ item.label }}
          </button>
        </li>
      </TransitionGroup>
    </ModernisationDemo>
  </ModernisationSection>
</template>
