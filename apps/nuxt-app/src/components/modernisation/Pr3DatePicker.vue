<script lang="ts" setup>
const single = ref<string>('2026-03-15')
const range = ref<{ start?: string, end?: string }>({ start: undefined, end: undefined })
const withTime = ref<string>('2026-03-15 10:30')
const withShortcuts = ref<{ start?: string, end?: string }>({ start: undefined, end: undefined })
const inline = ref<string>('2026-03-15')
const rtl = ref<string>('2026-03-15')
const rtlRange = ref<{ start?: string, end?: string }>({ start: undefined, end: undefined })

function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getShortcut(identifier: string, label: string, days: number) {
  const start = new Date()
  start.setDate(start.getDate() - (days - 1))

  return {
    identifier,
    label,
    value: {
      start: toDateString(start),
      end: toDateString(new Date()),
    },
  }
}

const shortcuts = [
  getShortcut('seven', '7 derniers jours', 7),
  getShortcut('thirty', '30 derniers jours', 30),
  getShortcut('ninety', '90 derniers jours', 90),
]
</script>

<template>
  <ModernisationSection
    id="pr3-datepicker"
    title="PR 3. MazDatePicker"
    description="Le calendrier ouvert depuis son champ glisse d'un mois à l'autre, le mois et l'année roulent, la pastille du jour choisi voyage. Au clavier, tout saute sans animation. Avec les animations réduites, tout est instantané."
  >
    <ModernisationDemo title="Date simple" hint="Clique sur un jour : la pastille glisse jusqu'à lui. Utilise les flèches puis Entrée : elle saute. Page précédente et Page suivante changent de mois, avec Maj de année. Les flèches du calendrier suivent le sens de lecture.">
      <MazDatePicker v-model="single" label="Date" locale="fr-FR" class="w-64" />
    </ModernisationDemo>

    <ModernisationDemo title="Plage avec bande" hint="Choisis un premier jour, puis survole les suivants : la bande suit le pointeur et une pastille compte les jours, le nombre roule.">
      <MazDatePicker v-model="range" label="Période" locale="fr-FR" range :shortcuts="false" class="w-72" />
    </ModernisationDemo>

    <ModernisationDemo title="Plage avec raccourcis, double calendrier" hint="Les raccourcis sont des pastilles. Le double calendrier glisse sur deux mois à la fois.">
      <MazDatePicker v-model="withShortcuts" label="Période" locale="fr-FR" range double :shortcuts class="w-80" />
    </ModernisationDemo>

    <ModernisationDemo title="Avec l'heure" hint="Le haut du calendrier affiche la date et l'heure : seuls les caractères qui changent roulent.">
      <MazDatePicker v-model="withTime" label="Date et heure" locale="fr-FR" format="YYYY-MM-DD HH:mm" time class="w-64" />
    </ModernisationDemo>

    <ModernisationDemo title="En ligne" hint="Le calendrier est affiché sans champ, avec la couleur du thème choisie.">
      <MazDatePicker v-model="inline" locale="fr-FR" inline color="success" />
    </ModernisationDemo>

    <ModernisationDemo title="De droite à gauche" hint="Le mois glisse dans l'autre sens, les flèches de navigation sont retournées et les flèches gauche et droite du clavier suivent la direction.">
      <div dir="rtl" class="flex flex-wrap gap-4">
        <MazDatePicker v-model="rtl" locale="ar" inline />
        <MazDatePicker v-model="rtlRange" locale="ar" inline range :shortcuts="false" />
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
