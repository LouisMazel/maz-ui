<script lang="ts" setup>
import '~/css/modernisation.css'

definePageMeta({ layout: false })

const route = useRoute()
const dir = route.query.dir === 'rtl' ? 'rtl' : 'ltr'

useHead({
  title: 'Régression visuelle - Maz UI',
  htmlAttrs: { dir },
})

const avatar = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#6366f1" width="200" height="200"/></svg>')}`

const text = ref('Bonjour Maz UI')
const select = ref('vue')
const radio = ref('b')
const checkbox = ref(true)
const switchOn = ref(true)
const slider = ref(40)
const tags = ref(['Vue', 'Nuxt', 'Vite'])
const date = ref('2026-03-20')
const tab = ref(2)
const segmented = ref('b')
const page = ref(3)
const step = ref(2)
const accordion = ref(1)
const dialog = ref(false)
const drawer = ref(false)

const selectOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
]
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive'] as const
const headers = [
  { label: 'Nom', key: 'name' },
  { label: 'Rôle', key: 'role' },
  { label: 'Statut', key: 'status' },
]
const rows = [
  { name: 'Alice Martin', role: 'Admin', status: 'Actif' },
  { name: 'Bob Smith', role: 'Éditeur', status: 'Actif' },
  { name: 'Carol White', role: 'Lecteur', status: 'Inactif' },
]
const steps = [
  { title: 'Compte', subtitle: 'Crée ton compte' },
  { title: 'Profil', subtitle: 'Configure ton profil' },
  { title: 'Confirmation', subtitle: 'Vérifie et confirme' },
]
</script>

<template>
  <div class="grid w-[720px] gap-6 bg-surface p-6 text-foreground">
    <h1 class="text-title-2">
      Blocs de régression visuelle
    </h1>

    <div data-visual="btn" class="flex flex-wrap items-center gap-3 p-4">
      <MazBtn v-for="color in colors" :key="color" :color="color">
        {{ color }}
      </MazBtn>
      <MazBtn size="sm" disabled>
        Désactivé
      </MazBtn>
      <MazBtn loading>
        Chargement
      </MazBtn>
    </div>

    <div data-visual="input" class="grid gap-4 p-4">
      <MazInput v-model="text" label="Par défaut" />
      <MazInput v-model="text" label="Erreur" error hint="Quelque chose ne va pas" />
      <MazInput v-model="text" label="Désactivé" disabled />
    </div>

    <div data-visual="select" class="p-4">
      <MazSelect v-model="select" :options="selectOptions" label="Framework" />
    </div>

    <div data-visual="select-open" class="min-h-64 p-4">
      <MazSelect v-model="select" :options="selectOptions" label="Framework" data-testid="select" />
    </div>

    <div data-visual="checkbox" class="flex flex-wrap gap-4 p-4">
      <MazCheckbox v-model="checkbox">
        Coché
      </MazCheckbox>
      <MazCheckbox :model-value="false">
        Décoché
      </MazCheckbox>
      <MazCheckbox :model-value="true" disabled>
        Désactivé
      </MazCheckbox>
    </div>

    <div data-visual="radio" class="flex flex-wrap gap-4 p-4">
      <MazRadio v-model="radio" value="a" name="visual-radio">
        A
      </MazRadio>
      <MazRadio v-model="radio" value="b" name="visual-radio">
        B
      </MazRadio>
      <MazRadio v-model="radio" value="c" name="visual-radio" disabled>
        C
      </MazRadio>
    </div>

    <div data-visual="switch" class="flex flex-wrap gap-4 p-4">
      <MazSwitch v-model="switchOn" label="Activé" />
      <MazSwitch :model-value="false" label="Désactivé" />
      <MazSwitch :model-value="true" label="Désactivé" disabled />
    </div>

    <div data-visual="card" class="grid gap-4 p-4">
      <MazCard title="Carte" bordered>
        Contenu de la carte.
      </MazCard>
      <MazCard title="Carte surélevée" elevation>
        Contenu de la carte.
        <template #footer>
          Pied de carte
        </template>
      </MazCard>
    </div>

    <div data-visual="dialog" class="p-4">
      <MazBtn data-testid="open-dialog" @click="dialog = true">
        Ouvrir le dialogue
      </MazBtn>
      <MazDialog v-model="dialog" title="Titre du dialogue">
        Contenu du dialogue.
        <template #footer="{ close }">
          <MazBtn color="secondary" @click="close">
            Fermer
          </MazBtn>
        </template>
      </MazDialog>
    </div>

    <div data-visual="dropdown" class="min-h-64 p-4">
      <MazDropdown :items="[{ label: 'Modifier' }, { label: 'Supprimer' }, { label: 'Archiver' }]">
        Actions
      </MazDropdown>
    </div>

    <div data-visual="tabs" class="p-4">
      <MazTabs v-model="tab">
        <MazTabsBar v-model="tab" :items="[{ label: 'Aperçu' }, { label: 'Fonctionnalités', badge: { content: 3, color: 'primary' } }, { label: 'Tarifs' }]" />
        <MazTabsContent>
          <MazTabsContentItem :tab="1">
            Aperçu
          </MazTabsContentItem>
          <MazTabsContentItem :tab="2">
            Fonctionnalités
          </MazTabsContentItem>
          <MazTabsContentItem :tab="3">
            Tarifs
          </MazTabsContentItem>
        </MazTabsContent>
      </MazTabs>
    </div>

    <div data-visual="segmented" class="p-4">
      <MazSegmented
        v-model="segmented"
        :options="[{ label: 'Jour', value: 'a' }, { label: 'Semaine', value: 'b' }, { label: 'Mois', value: 'c' }]"
        aria-label="Période"
      />
    </div>

    <div data-visual="badge" class="flex flex-wrap items-center gap-3 p-4">
      <MazBadge v-for="color in colors" :key="color" :color="color">
        {{ color }}
      </MazBadge>
    </div>

    <div data-visual="alert" class="grid gap-3 p-4">
      <MazAlert color="info" title="Info" content="Un message informatif." />
      <MazAlert color="success" title="Succès" content="Ça a marché." />
      <MazAlert color="destructive" title="Erreur" content="Quelque chose a échoué." />
    </div>

    <div data-visual="avatar" class="flex flex-wrap items-center gap-4 p-4">
      <MazAvatar :src="avatar" size="2rem" />
      <MazAvatar :src="avatar" size="3rem" />
      <MazAvatar :src="avatar" size="4rem" bordered />
      <MazAvatar caption="Jean Dupont" />
    </div>

    <div data-visual="pagination" class="p-4">
      <MazPagination v-model="page" :total-pages="10" />
    </div>

    <div data-visual="stepper" class="p-4">
      <MazStepper v-model="step" :steps="steps">
        <template #content-1>
          Première étape
        </template>
        <template #content-2>
          Deuxième étape
        </template>
        <template #content-3>
          Troisième étape
        </template>
      </MazStepper>
    </div>

    <div data-visual="table" class="p-4">
      <MazTable :headers="headers" :rows="rows" title="Équipe" background-even />
    </div>

    <div data-visual="datepicker" class="p-4">
      <MazDatePicker v-model="date" label="Date" locale="fr-FR" inline />
    </div>

    <div data-visual="textarea" class="p-4">
      <MazTextarea v-model="text" label="Zone de texte" />
    </div>

    <div data-visual="input-tags" class="p-4">
      <MazInputTags v-model="tags" label="Tags" />
    </div>

    <div data-visual="slider" class="grid gap-4 p-4">
      <MazSlider v-model="slider" />
      <MazSlider v-model="slider" color="secondary" disabled />
    </div>

    <div data-visual="accordion" class="p-4">
      <MazAccordion v-model="accordion">
        <template #title-1>
          Qu'est-ce que Maz UI ?
        </template>
        <template #content-1>
          Une bibliothèque de composants pour Vue 3 et Nuxt.
        </template>
        <template #title-2>
          Comment l'installer ?
        </template>
        <template #content-2>
          Avec pnpm.
        </template>
      </MazAccordion>
    </div>

    <div data-visual="drawer" class="p-4">
      <MazBtn data-testid="open-drawer" @click="drawer = true">
        Ouvrir le tiroir
      </MazBtn>
      <MazDrawer v-model="drawer" title="Tiroir">
        <p class="px-6 py-4">
          Contenu du tiroir.
        </p>
      </MazDrawer>
    </div>

    <div data-visual="progress-bar" class="grid gap-4 p-4">
      <MazProgressBar :value="40" />
      <MazProgressBar :value="80" color="success" />
    </div>

    <div data-visual="skeleton" class="grid gap-3 p-4">
      <MazSkeleton />
      <MazSkeleton width="60%" />
      <MazSkeleton shape="circle" size="40px" />
    </div>
  </div>
</template>
