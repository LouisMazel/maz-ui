<script lang="ts" setup>
const selected = ref('b')
const tab = ref('one')
const page = ref(3)
const name = ref('')
const city = ref<string>()
const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice']
const segments = [
  { label: 'Jour', value: 'a' },
  { label: 'Semaine', value: 'b' },
  { label: 'Mois', value: 'c' },
]
const tabs = [
  { label: 'Aperçu', value: 'one' },
  { label: 'Détails', value: 'two' },
  { label: 'Historique', value: 'three' },
]
const menuItems = [
  { label: 'Modifier', onClick: () => {} },
  { label: 'Dupliquer', onClick: () => {} },
  { label: 'Archiver', onClick: () => {} },
]
const variants = [
  { id: 'default', title: 'Défaut', className: 'm-density-default' },
  { id: 'compact', title: 'Compact', className: 'm-density-compact' },
] as const
</script>

<template>
  <ModernisationSection
    id="pr3-density"
    title="PR 3. Densité"
    description="La densité compacte raccourcit les contrôles d'environ 14 % (un md passe de 42 px à 36 px) et resserre les paddings et les lignes de menu. Elle s'active avec l'option density de MazUi, ou avec la classe m-density-compact sur html ou sur n'importe quel bloc."
  >
    <ModernisationDemo title="Défaut et compact, côte à côte" hint="Chaque colonne porte sa classe (m-density-default ou m-density-compact) : le reste de la page garde la densité de la barre d'outils.">
      <div class="grid gap-6 tab:grid-cols-2">
        <div
          v-for="variant in variants"
          :key="variant.id"
          :class="variant.className"
          class="flex flex-col gap-4 rounded-lg border border-divider p-4"
        >
          <span class="text-title-5">{{ variant.title }}</span>

          <div class="flex flex-wrap items-center gap-2">
            <MazBtn size="mini">
              Mini
            </MazBtn>
            <MazBtn size="xs">
              XS
            </MazBtn>
            <MazBtn size="sm">
              SM
            </MazBtn>
            <MazBtn>MD</MazBtn>
            <MazBtn size="lg">
              LG
            </MazBtn>
            <MazBtn size="xl">
              XL
            </MazBtn>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <MazBtn color="secondary" variant="outline">
              Annuler
            </MazBtn>
            <MazBtn start-icon="check">
              Enregistrer
            </MazBtn>
            <MazBtn fab icon="plus" aria-label="Ajouter" />
          </div>

          <MazInput v-model="name" label="Nom" />
          <MazInput v-model="name" label="Nom, taille sm" size="sm" />
          <MazSelect v-model="city" label="Ville" :options="cities" />
          <MazTextarea label="Message" :min-rows="2" />

          <MazSegmented v-model="selected" :options="segments" />
          <MazTabsBar v-model="tab" :items="tabs" />
          <MazPagination v-model="page" :total-pages="9" />

          <MazDropdown :items="menuItems" trigger="click">
            Menu
          </MazDropdown>
        </div>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
