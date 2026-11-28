<script lang="ts" setup>
const selectValue = ref<string>()
const selectOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
]
const date = ref<string>()
const color = ref<string>('#3b82f6')

const sides = ['top', 'right', 'bottom', 'left'] as const
const tooltipButtons = ['Modifier', 'Copier', 'Partager', 'Supprimer']
</script>

<template>
  <ModernisationSection
    id="pr2-popovers"
    title="PR 2. Popovers et tooltips"
    description="Les panneaux grandissent depuis leur déclencheur. Les tooltips partagent leur délai. Avec les animations réduites, le mouvement devient un changement instantané."
  >
    <ModernisationDemo title="MazPopover : 4 côtés" hint="Chaque panneau apparaît en fondu et grandit depuis le centre de son déclencheur, projeté sur son bord. Le déclencheur large montre l'origine placée sous son centre.">
      <div class="flex flex-wrap items-center justify-center gap-4 py-16">
        <MazPopover v-for="side in sides" :key="side" :position="side">
          <template #trigger>
            <MazBtn color="neutral">
              {{ side }}
            </MazBtn>
          </template>
          <div class="p-4">
            S'ouvre du côté {{ side }}
          </div>
        </MazPopover>
        <MazPopover position="bottom-start">
          <template #trigger>
            <MazBtn color="neutral" class="w-64">
              Déclencheur large, bottom-start
            </MazBtn>
          </template>
          <div class="p-4 w-32">
            Petit panneau
          </div>
        </MazPopover>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Dropdown, select, date picker, color picker" hint="Ils utilisent tous MazPopover : même croissance depuis le déclencheur.">
      <div class="flex flex-wrap items-end gap-4">
        <MazDropdown :items="[{ label: 'Profil' }, { label: 'Réglages' }, { label: 'Déconnexion' }]">
          Dropdown
        </MazDropdown>
        <MazSelect v-model="selectValue" :options="selectOptions" label="Select" class="w-48" />
        <MazDatePicker v-model="date" label="Date" class="w-48" />
        <MazColorPicker v-model="color" label="Couleur" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="vTooltip : délai groupé" hint="Chaque tooltip attend 800 ms. Après le premier, passer au bouton suivant affiche son tooltip tout de suite.">
      <div class="flex gap-2">
        <MazBtn
          v-for="name in tooltipButtons"
          :key="name"
          v-tooltip="{ text: name, delay: 800 }"
          color="neutral"
          size="sm"
        >
          {{ name }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Transition personnalisée avec --maz-popover-transform-origin" hint="Cette transition tourne et rebondit depuis l'origine exposée sur le panneau.">
      <MazPopover transition="pr2-custom-popover" position="bottom">
        <template #trigger>
          <MazBtn color="primary">
            Transition personnalisée
          </MazBtn>
        </template>
        <div class="p-4">
          Stylé avec la variable CSS
        </div>
      </MazPopover>
    </ModernisationDemo>
  </ModernisationSection>
</template>

<style>
.pr2-custom-popover-enter-active,
.pr2-custom-popover-leave-active {
  transform-origin: var(--maz-popover-transform-origin);
  transition:
    transform var(--maz-motion-normal) var(--maz-easing-spring),
    opacity var(--maz-motion-fast);
}

.pr2-custom-popover-enter-from,
.pr2-custom-popover-leave-to {
  opacity: 0;
  transform: scale(0.7) rotate(-6deg);
}
</style>
