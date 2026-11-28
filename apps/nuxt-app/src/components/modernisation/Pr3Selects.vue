<script lang="ts" setup>
const framework = ref<string>('nuxt')
const frameworks = [
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
  { label: 'Vitest', value: 'vitest' },
  { label: 'Pinia', value: 'pinia' },
  { label: 'Vue Router', value: 'router' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'TypeScript', value: 'ts' },
]

const fruits = ref<string[]>([])
const fruitOptions = ['Abricot', 'Banane', 'Cerise', 'Datte', 'Figue', 'Fraise', 'Framboise', 'Kiwi', 'Mangue', 'Pêche']

const country = ref<string>()

const autocompleteQuery = ref('')
const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille', 'Rennes', 'Reims']

const emptyQuery = ref('zzz')
</script>

<template>
  <ModernisationSection
    id="pr3-selects"
    title="PR 3. Select et autocomplétion"
    description="La liste se déroule depuis le champ, ses options montent en fondu et une surbrillance glisse entre elles sous la souris. Au clavier, elle saute sans animation. Les lettres trouvées sont soulignées."
  >
    <ModernisationDemo title="MazSelect avec recherche" hint="Survole les options : la surbrillance glisse. Utilise les flèches : elle saute. Tape « fra » ou « pêch » : les lettres trouvées sont soulignées, sans tenir compte des accents ni de la casse.">
      <div class="flex flex-wrap items-end gap-4">
        <MazSelect v-model="framework" :options="frameworks" label="Framework" search class="w-64" />
        <MazSelect v-model="fruits" :options="fruitOptions" label="Fruits" multiple search class="w-64" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSelectCountry" hint="Le même comportement avec les drapeaux : surbrillance glissante et lettres trouvées soulignées dans la recherche.">
      <MazSelectCountry v-model="country" label="Pays" class="w-72" />
    </ModernisationDemo>

    <ModernisationDemo title="MazInputAutocomplete" hint="Tape « mar » ou « ren ». Les lettres trouvées sont soulignées et les suggestions partagent le même style de ligne que le select.">
      <MazInputAutocomplete v-model="autocompleteQuery" :items="cities" label="Ville" class="w-72" />
    </ModernisationDemo>

    <ModernisationDemo title="Aucun résultat" hint="Ouvre la liste puis cherche une valeur qui n'existe pas : un message discret remplace la liste.">
      <div class="flex flex-wrap items-end gap-4">
        <MazSelect :model-value="undefined" :options="frameworks" label="Select" search class="w-64" />
        <MazInputAutocomplete v-model="emptyQuery" :items="cities" label="Autocomplétion" open-on-focus class="w-64" />
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
