<script lang="ts" setup>
import type { MazTimelineProps } from 'maz-ui/components'
import type { MazGalleryImage } from 'maz-ui/components/MazGallery'
import { MazCog } from '@maz-ui/icons/lazy/MazCog'
import { MazHome } from '@maz-ui/icons/lazy/MazHome'
import { MazUser } from '@maz-ui/icons/lazy/MazUser'
import { ref } from 'vue'

const colors = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'destructive',
  'contrast',
] as const
const btnColors = [...colors, 'surface', 'transparent'] as const
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const sizeUnits = [
  '10px',
  '20px',
  '30px',
  '2rem',
  '3em',
  '15vw',
] as const
const roundedSizes = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const

const switchValue = ref(true)
const switchOff = ref(false)
const checkboxValue = ref(true)
const checkboxOff = ref(false)
const radioValue = ref('option1')
const sliderValue = ref(50)
const inputValue = ref('Bonjour le monde')
const textareaValue = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
const numberValue = ref(42)
const priceValue = ref(99.99)
const tagsValue = ref(['Vue', 'TypeScript', 'Maz UI'])
const selectValue = ref('option1')
const codeValue = ref('1234')
const tabValue = ref(1)
const stepperValue = ref(2)
const paginationValue = ref(3)
const phoneValue = ref('+33612345678')
const accordionValue = ref(1)
const dateValue = ref('2026-03-20')
const expandOpen = ref(true)
const radioBtnValue = ref('b')
const segmentedValue = ref('b')
const colorPickerValue = ref('#3b82f6')
const listSwitch = ref(true)
const checklistValue = ref(['vue'])
const dialogOpen = ref(false)
const bottomSheetOpen = ref(false)
const drawerOpen = ref(false)

const selectOptions = [
  { label: 'Vue.js', value: 'option1' },
  { label: 'React', value: 'option2' },
  { label: 'Angular', value: 'option3' },
  { label: 'Svelte', value: 'option4' },
]

const radioOptions = [
  { label: 'Petit', value: 'a' },
  { label: 'Moyen', value: 'b' },
  { label: 'Grand', value: 'c' },
]

const btnGroupItems = [
  { text: 'Gauche', value: 'left' },
  { text: 'Centre', value: 'center', active: true },
  { text: 'Droite', value: 'right' },
]

const btnDropdownItems = [
  {
    label: 'Enregistrer comme brouillon',
    onClick: () => {},
  },
  {
    label: 'Enregistrer et publier',
    onClick: () => {},
  },
]

const tableHeaders = [
  { label: 'Nom', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Rôle', key: 'role' },
  { label: 'Statut', key: 'status' },
]
const tableRows = [
  {
    name: 'Alice Martin',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Actif',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Éditeur',
    status: 'Actif',
  },
  {
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Lecteur',
    status: 'Inactif',
  },
  {
    name: 'David Lee',
    email: 'david@example.com',
    role: 'Admin',
    status: 'Actif',
  },
]

const timelineSteps: MazTimelineProps['steps'] = [
  { title: 'Commande passée', subtitle: '15 mars 2026 à 10h30', state: 'completed' },
  { title: 'Paiement confirmé', subtitle: '15 mars 2026 à 10h32', state: 'completed' },
  { title: 'Expédiée', subtitle: '16 mars 2026 à 14h15', state: 'active' },
  { title: 'En cours de livraison', subtitle: 'Prévue le 18 mars', state: 'pending' },
  { title: 'Livrée', subtitle: 'En attente de livraison', state: 'pending' },
]

const timelineStepsStates: MazTimelineProps['steps'] = [
  { title: 'Terminé', subtitle: 'Tout est bon', state: 'completed' },
  { title: 'Actif', subtitle: 'En cours', state: 'active' },
  { title: 'Erreur', subtitle: 'Un problème est survenu', state: 'error' },
  { title: 'Avertissement', subtitle: 'À vérifier', state: 'warning' },
  { title: 'En attente', subtitle: 'Pas encore commencé', state: 'pending' },
]

const stepperSteps = [
  { title: 'Compte', subtitle: 'Crée ton compte', titleInfo: 'Étape 1 sur 3' },
  { title: 'Profil', subtitle: 'Configure ton profil', titleInfo: 'Étape 2 sur 3' },
  { title: 'Confirmation', subtitle: 'Vérifie et confirme', titleInfo: 'Étape 3 sur 3' },
]

function makePlaceholder(color: string, label: string): string {
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="${color}" width="800" height="600"/><text x="400" y="300" text-anchor="middle" dominant-baseline="central" font-family="system-ui" font-size="32" fill="white">${label}</text></svg>`)}`
}

const galleryImages = [
  {
    src: makePlaceholder('#6366f1', 'Image 1'),
    alt: 'Image factice 1',
  },
  {
    src: makePlaceholder('#8b5cf6', 'Image 2'),
    alt: 'Image factice 2',
  },
  {
    src: makePlaceholder('#0ea5e9', 'Image 3'),
    alt: 'Image factice 3',
  },
  {
    src: makePlaceholder('#10b981', 'Image 4'),
    alt: 'Image factice 4',
  },
  {
    src: makePlaceholder('#f59e0b', 'Image 5'),
    alt: 'Image factice 5',
  },
] satisfies MazGalleryImage[]

const avatarPlaceholder = makePlaceholder('#6366f1', 'JD')
const mazUiUrl = 'https://maz-ui.com'

const checklistItems = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'TailwindCSS', value: 'tw' },
  { label: 'Vite', value: 'vite' },
  { label: 'Vitest', value: 'vitest' },
]
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-16">
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBtn
      </h2>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="c in btnColors" :key="c" :color="c">
          {{ c }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Tailles
      </h3>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-2 maz:mb-4">
        <MazBtn v-for="s in sizes" :key="s" :size="s">
          {{ s }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Contour
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="c in btnColors" :key="c" :color="c" outlined>
          {{ c }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Pastel
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="c in btnColors" :key="c" :color="c" pastel>
          {{ c }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Fab
      </h3>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-2 maz:mb-4">
        <MazBtn v-for="s in sizes" :key="s" icon="plus" :size="s" fab />
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Arrondis
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="r in roundedSizes" :key="r" :rounded-size="r">
          {{ r }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        États
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn loading>
          Chargement
        </MazBtn>
        <MazBtn disabled>
          Désactivé
        </MazBtn>
        <MazBtn block>
          Bloc (pleine largeur)
        </MazBtn>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBtnGroup
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-3 maz:mb-4">
        <MazBtnGroup :items="btnGroupItems" />
        <MazBtnGroup :items="btnGroupItems" orientation="col" />
        <MazBtnGroup :items="btnGroupItems" outlined />
        <MazBtnGroup :items="btnGroupItems" pastel />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazBtnGroup v-for="c in colors" :key="c" :items="btnGroupItems" :color="c" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Tailles
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazBtnGroup v-for="s in sizes" :key="s" :items="btnGroupItems" :size="s" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBtnDropdown
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mb-4">
        <MazBtnDropdown :items="btnDropdownItems" menu-label="Autres options d'enregistrement">
          Enregistrer
        </MazBtnDropdown>
        <MazBtnDropdown :items="btnDropdownItems" menu-label="Autres options d'enregistrement" outlined>
          Enregistrer
        </MazBtnDropdown>
        <MazBtnDropdown :items="btnDropdownItems" menu-label="Autres options d'enregistrement" pastel color="secondary">
          Enregistrer
        </MazBtnDropdown>
        <MazBtnDropdown :items="btnDropdownItems" menu-label="Autres options d'enregistrement" trigger="hover">
          Survol
        </MazBtnDropdown>
        <MazBtnDropdown :items="btnDropdownItems" menu-label="Autres options d'enregistrement" action-disabled>
          Enregistrer
        </MazBtnDropdown>
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3 maz:mb-4">
        <MazBtnDropdown v-for="s in sizes" :key="s" :items="btnDropdownItems" menu-label="Autres options d'enregistrement" :size="s">
          Enregistrer
        </MazBtnDropdown>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInput
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-4">
        <MazInput v-model="inputValue" label="Champ par défaut" />
        <MazInput v-model="inputValue" label="Avec placeholder" placeholder="Saisis du texte..." />
        <MazInput v-model="inputValue" label="Par défaut" top-label="Libellé du haut" />
        <MazInput v-model="inputValue" label="Texte d'aide" assistive-text="Ceci est un message d'aide" />
        <MazInput v-model="inputValue" label="État d'erreur" error assistive-text="Ce champ est obligatoire" />
        <MazInput v-model="inputValue" label="État de succès" success />
        <MazInput v-model="inputValue" label="État d'avertissement" warning />
        <MazInput v-model="inputValue" label="Désactivé" disabled />
        <MazInput v-model="inputValue" label="Chargement" loading />
        <MazInput v-model="inputValue" label="Bloc (pleine largeur)" block />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs avec top-label
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-4">
        <MazInput v-for="c in colors" :key="c" v-model="inputValue" :top-label="c" :color="c" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Tailles
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-4">
        <MazInput v-for="s in sizes" :key="s" v-model="inputValue" :label="s" :size="s" />
      </div>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-4">
        <MazInput v-for="s in sizes" :key="s" v-model="inputValue" :placeholder="s" :size="s" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Arrondis
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-4">
        <MazInput v-for="r in roundedSizes" :key="r" v-model="inputValue" :label="r" :rounded-size="r" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTextarea
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazTextarea v-model="textareaValue" label="Zone de texte par défaut" />
        <MazTextarea v-model="textareaValue" label="Erreur" error />
        <MazTextarea v-model="textareaValue" label="Succès" success />
        <MazTextarea v-model="textareaValue" label="Désactivé" disabled />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputNumber
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazInputNumber v-model="numberValue" label="Par défaut" />
        <MazInputNumber v-model="numberValue" label="Min/Max" :min="0" :max="100" />
        <MazInputNumber v-model="numberValue" label="Pas de 5" :step="5" />
        <MazInputNumber v-model="numberValue" label="Désactivé" disabled />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputPrice
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazInputPrice v-model="priceValue" label="Prix (EUR)" currency="EUR" locale="fr-FR" />
        <MazInputPrice v-model="priceValue" label="Prix (USD)" currency="USD" locale="en-US" />
        <MazInputPrice v-model="priceValue" label="Prix (GBP)" currency="GBP" locale="en-GB" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputTags
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazInputTags v-model="tagsValue" label="Étiquettes" />
        <MazInputTags v-model="tagsValue" label="Erreur" error />
        <MazInputTags v-model="tagsValue" label="Succès" success />
        <MazInputTags v-model="tagsValue" label="Désactivé" disabled />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputCode
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazInputCode v-model="codeValue" :code-length="4" size="sm" />
        <MazInputCode v-model="codeValue" :code-length="6" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputPhoneNumber
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazInputPhoneNumber label="Numéro de téléphone" />
        <MazInputPhoneNumber label="Numéro de téléphone (responsive)" orientation="responsive" />
        <MazInputPhoneNumber label="Numéro de téléphone (ligne)" orientation="row" />
        <MazInputPhoneNumber label="Numéro de téléphone (colonne)" orientation="col" />
        <MazInputPhoneNumber v-model="phoneValue" label="Numéro de téléphone" />
        <MazInputPhoneNumber v-model="phoneValue" label="Erreur" error />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSelect
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-4">
        <MazSelect v-model="selectValue" :options="selectOptions" label="Par défaut" />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Recherche" search />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Erreur" error />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Succès" success />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Désactivé" disabled />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Bloc" block :open="true" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4">
        <MazSelect v-for="c in colors" :key="c" v-model="selectValue" :options="selectOptions" :label="c" :color="c" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSelectCountry
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazSelectCountry label="Sélectionne un pays" />
        <MazSelectCountry label="Avec recherche" search :open="true" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4 maz:mt-20">
        MazDatePicker
      </h2>
      <MazDatePicker v-model="dateValue" label="Sélecteur de date" picker-position="top" />

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2 maz:mt-4">
        En ligne
      </h3>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazDatePicker v-model="dateValue" label="En ligne" inline />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSwitch
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazSwitch v-model="switchValue">
          Actif
        </MazSwitch>
        <MazSwitch v-model="switchOff">
          Inactif
        </MazSwitch>
        <MazSwitch v-model="switchValue" disabled>
          Désactivé
        </MazSwitch>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazSwitch v-for="c in colors" :key="c" v-model="switchValue" :color="c">
          {{ c }}
        </MazSwitch>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCheckbox
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazCheckbox v-model="checkboxValue">
          Coché
        </MazCheckbox>
        <MazCheckbox v-model="checkboxOff">
          Non coché
        </MazCheckbox>
        <MazCheckbox v-model="checkboxValue" disabled>
          Désactivé
        </MazCheckbox>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazCheckbox v-for="c in colors" :key="c" v-model="checkboxValue" :color="c">
          {{ c }}
        </MazCheckbox>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Tailles
      </h3>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
        <MazCheckbox v-for="s in sizes" :key="s" v-model="checkboxValue" :size="s">
          {{ s }}
        </MazCheckbox>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazRadio
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazRadio v-model="radioValue" value="option1" name="radio-demo">
          Option 1
        </MazRadio>
        <MazRadio v-model="radioValue" value="option2" name="radio-demo">
          Option 2
        </MazRadio>
        <MazRadio v-model="radioValue" value="option3" name="radio-demo">
          Option 3
        </MazRadio>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-6">
        <MazRadio v-for="c in colors" :key="c" v-model="radioValue" :value="`option-${c}`" :name="`radio-${c}`" :color="c">
          {{ c }}
        </MazRadio>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazRadioButtons
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4 maz:mb-4">
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" orientation="col" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" selector />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" equal-size block />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" elevation />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Couleurs
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazRadioButtons v-for="c in colors" :key="c" v-model="radioBtnValue" :options="radioOptions" :color="c" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Tailles
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazRadioButtons v-for="s in sizes" :key="s" v-model="radioBtnValue" :options="radioOptions" :size="s" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        États
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2">
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" error hint="Indication d'erreur" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" success hint="Indication de succès" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" warning hint="Indication d'avertissement" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSlider
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazSlider v-model="sliderValue" />
        <MazSlider v-model="sliderValue" color="secondary" />
        <MazSlider v-model="sliderValue" color="success" />
        <MazSlider v-model="sliderValue" disabled />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDropzone
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazDropzone />
        <MazDropzone color="secondary" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazChecklist
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="Technologies" />
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="Avec recherche" search />
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="Élévation" elevation />
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="Secondaire" color="secondary" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCard
      </h2>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Variantes de base
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-6">
        <MazCard>
          <template #content-title>
            Carte simple
          </template>
          <template #content-body>
            <p>Une carte simple avec un contenu basique et le style par défaut.</p>
          </template>
        </MazCard>
        <MazCard elevation>
          <template #content-title>
            Carte surélevée
          </template>
          <template #content-body>
            <p>Carte avec une ombre portée pour donner de la profondeur.</p>
          </template>
        </MazCard>
        <MazCard bordered>
          <template #content-title>
            Carte avec bordure
          </template>
          <template #content-body>
            <p>Carte avec une bordure visible.</p>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Avec galerie, actions et pied de page
      </h3>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-6 maz:items-start">
        <MazCard :gallery="{ images: galleryImages, height: 200 }">
          <template #content-title>
            Carte avec galerie
          </template>
          <template #content-subtitle>
            Avec galerie d'images
          </template>
          <template #content-body>
            <p>Cette carte affiche une galerie de photos en en-tête avec plusieurs images.</p>
          </template>
          <template #actions>
            <MazBtn size="sm">
              Voir les détails
            </MazBtn>
            <MazBtn size="sm" color="info">
              Partager
            </MazBtn>
          </template>
          <template #footer>
            <span class="maz:text-sm maz:text-muted">Publié il y a 2 heures</span>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Orientations
      </h3>
      <div class="maz:flex maz:gap-4 maz:mb-6">
        <MazCard :gallery="{ images: galleryImages, height: 200, width: 250 }" orientation="row">
          <template #content-title>
            Orientation en ligne
          </template>
          <template #content-subtitle>
            Disposition horizontale
          </template>
          <template #content-body>
            <p>Une carte en orientation ligne place la galerie sur le côté.</p>
          </template>
          <template #actions>
            <MazBtn size="sm" color="secondary">
              Action
            </MazBtn>
          </template>
        </MazCard>

        <MazCard :gallery="{ images: galleryImages.slice(0, 2), height: 200, width: 250 }" orientation="row-reverse">
          <template #content-title>
            Ligne inversée
          </template>
          <template #content-body>
            <p>Galerie sur le côté droit avec l'orientation row-reverse.</p>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Repliable et avec lien
      </h3>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-6">
        <MazCard collapsible collapse-open>
          <template #content-title>
            Carte repliable
          </template>
          <template #content-body>
            <p>Cette carte se replie en cliquant sur l'en-tête. Essaie !</p>
          </template>
        </MazCard>
        <MazCard :href="mazUiUrl" collapsible href-target="_blank" title="Carte avec lien">
          <template #content-title>
            Carte avec lien
          </template>
          <template #content-body>
            <p>Clique sur cette carte pour aller sur le site de Maz UI.</p>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Alignement du pied de page
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4">
        <MazCard footer-align="start">
          <template #content-title>
            Pied de page à gauche
          </template>
          <template #footer>
            <MazBtn size="sm">
              Action
            </MazBtn>
          </template>
        </MazCard>
        <MazCard>
          <template #content-title>
            Pied de page par défaut
          </template>
          <template #footer>
            <MazBtn size="sm">
              Action
            </MazBtn>
          </template>
        </MazCard>
        <MazCard footer-align="end">
          <template #content-title>
            Pied de page à droite
          </template>
          <template #footer>
            <MazBtn size="sm">
              Action
            </MazBtn>
          </template>
        </MazCard>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCardSpotlight
      </h2>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4">
        <MazCardSpotlight v-for="c in colors.slice(0, 6)" :key="c" :color="c">
          <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
            {{ c }}
          </h3>
          <p class="maz:text-sm maz:text-muted">
            Carte spotlight avec un effet de halo au survol, en couleur {{ c }}.
          </p>
        </MazCardSpotlight>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAvatar
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4 maz:mb-4">
        <MazAvatar v-for="s in sizeUnits" :key="s" :src="avatarPlaceholder" :size="s" />
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4 maz:mb-4">
        <MazAvatar v-for="r in roundedSizes" :key="r" :src="avatarPlaceholder" :rounded-size="r" />
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
        <MazAvatar :src="avatarPlaceholder" bordered />
        <MazAvatar :src="avatarPlaceholder" no-elevation />
        <MazAvatar :src="avatarPlaceholder" clickable />
        <MazAvatar caption="John Doe" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBadge
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mb-4">
        <MazBadge v-for="c in colors" :key="c" :color="c">
          {{ c }}
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mb-4">
        <MazBadge v-for="c in colors" :key="c" :color="c" pastel>
          {{ c }} pastel
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mb-4">
        <MazBadge v-for="c in colors" :key="c" :color="c" outlined>
          {{ c }} contour
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
        <MazBadge v-for="s in sizes" :key="s" :size="s">
          {{ s }}
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mt-4">
        <MazBadge v-for="r in roundedSizes" :key="r" :rounded-size="r">
          {{ r }}
        </MazBadge>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAlert
      </h2>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Variante douce (par défaut)
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-3 maz:mb-4">
        <MazAlert v-for="c in colors" :key="c" :color="c" :title="`Alerte ${c}`">
          Ceci est une alerte {{ c }} en variante douce. Elle transmet une information importante.
        </MazAlert>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Variante pleine
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-3">
        <MazAlert v-for="c in colors" :key="c" :color="c" variant="solid" :title="`Alerte ${c} pleine`">
          Ceci est une alerte {{ c }} en variante pleine. Un style plus marqué.
        </MazAlert>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTabs
      </h2>
      <MazTabs v-model="tabValue">
        <MazTabsBar v-model="tabValue" :items="[{ label: 'Aperçu' }, { label: 'Fonctionnalités', badge: { content: 3, color: 'primary', pastel: true, roundedSize: 'full' } }, { label: 'Tarifs', indicator: { color: 'destructive', label: 'Nouveaux tarifs' } }]" />

        <MazTabsContent>
          <MazTabsContentItem :tab="1" class="maz-py-4">
            <h3 class="maz:text-lg maz:font-bold maz:mb-2">
              Aperçu
            </h3>
            <p>Bienvenue dans l'onglet aperçu. Cette section présente le produit et ses principaux avantages.</p>
          </MazTabsContentItem>
          <MazTabsContentItem :tab="2" class="maz-py-4">
            <h3 class="maz:text-lg maz:font-bold maz:mb-2">
              Fonctionnalités
            </h3>
            <p>Découvre nos fonctionnalités : collaboration en temps réel, analyses avancées et intégrations fluides.</p>
          </MazTabsContentItem>
          <MazTabsContentItem :tab="3" class="maz-py-4">
            <h3 class="maz:text-lg maz:font-bold maz:mb-2">
              Tarifs
            </h3>
            <p>Des offres flexibles à partir de 9 $/mois. Une offre gratuite est disponible pour les petites équipes.</p>
          </MazTabsContentItem>
        </MazTabsContent>
      </MazTabs>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAccordion
      </h2>
      <MazAccordion v-model="accordionValue">
        <template #title-1>
          Qu'est-ce que Maz UI ?
        </template>
        <template #content-1>
          <p>Maz UI est une bibliothèque de composants Vue 3 complète avec plus de 50 composants, composables, directives et utilitaires. Elle sert à construire des applications web modernes et accessibles.</p>
        </template>
        <template #title-2>
          Comment l'installer ?
        </template>
        <template #content-2>
          <p>Installe-la avec npm ou pnpm : <code>pnpm add maz-ui</code>. Maz UI fonctionne avec Vue 3 seul et avec Nuxt 3 grâce au module @maz-ui/nuxt.</p>
        </template>
        <template #title-3>
          Est-ce personnalisable ?
        </template>
        <template #content-3>
          <p>Oui ! Maz UI gère les thèmes via des propriétés CSS personnalisées, l'intégration de TailwindCSS et un outil CLI pour générer des thèmes sur mesure. Chaque composant est tree-shakeable.</p>
        </template>
      </MazAccordion>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazExpandAnimation
      </h2>
      <MazBtn class="maz:mb-4" @click="expandOpen = !expandOpen">
        Déplier / replier
      </MazBtn>
      <MazExpandAnimation v-model="expandOpen">
        <div class="maz:rounded-md maz:border maz:border-divider maz:p-4">
          <p>Ce contenu est animé à l'ouverture et à la fermeture. L'animation affiche et masque le contenu en douceur, avec une durée et un timing configurables.</p>
          <p class="maz:mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </MazExpandAnimation>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazStepper
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-8">
        <MazStepper v-model="stepperValue" :steps="stepperSteps" auto-validate-steps>
          <template #content-1="{ nextStep }">
            <div class="maz:flex maz:flex-col maz:gap-4">
              <MazInput label="Email" placeholder="you@example.com" />
              <MazInput label="Mot de passe" type="password" placeholder="••••••••" />
              <MazBtn @click="nextStep">
                Suivant
              </MazBtn>
            </div>
          </template>
          <template #content-2="{ nextStep, previousStep }">
            <div class="maz:flex maz:flex-col maz:gap-4">
              <MazInput label="Nom complet" placeholder="Jean Dupont" />
              <MazInput label="Entreprise" placeholder="Acme Inc." />
              <div class="maz:flex maz:gap-2">
                <MazBtn outlined @click="previousStep">
                  Retour
                </MazBtn>
                <MazBtn @click="nextStep">
                  Suivant
                </MazBtn>
              </div>
            </div>
          </template>
          <template #content-3="{ previousStep }">
            <div class="maz:flex maz:flex-col maz:gap-4">
              <p>Vérifie tes informations avant de confirmer ton compte.</p>
              <div class="maz:flex maz:gap-2">
                <MazBtn outlined @click="previousStep">
                  Retour
                </MazBtn>
                <MazBtn color="success">
                  Confirmer
                </MazBtn>
              </div>
            </div>
          </template>
        </MazStepper>

        <h3 class="maz:text-lg maz:font-semibold">
          Stepper avec états
        </h3>
        <MazStepper
          :model-value="2"
          :steps="[
            { title: 'Terminé', subtitle: 'Fait', success: true },
            { title: 'Actuel', subtitle: 'En cours' },
            { title: 'Avertissement', subtitle: 'À vérifier', warning: true },
            { title: 'Erreur', subtitle: 'Échec', error: true },
          ]"
        >
          <template #content-1>
            <p>Contenu de l'étape 1</p>
          </template>
          <template #content-2>
            <p>Contenu de l'étape 2</p>
          </template>
          <template #content-3>
            <p>Contenu de l'étape 3</p>
          </template>
          <template #content-4>
            <p>Contenu de l'étape 4</p>
          </template>
        </MazStepper>

        <h3 class="maz:text-lg maz:font-semibold">
          Couleurs
        </h3>
        <div class="maz:flex maz:flex-col maz:gap-4">
          <MazStepper v-for="c in colors.slice(0, 4)" :key="c" :model-value="2" :steps="stepperSteps" :color="c">
            <template #content-1>
              <p>Contenu pour {{ c }}</p>
            </template>
            <template #content-2>
              <p>Contenu pour {{ c }}</p>
            </template>
            <template #content-3>
              <p>Contenu pour {{ c }}</p>
            </template>
          </MazStepper>
        </div>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTimeline
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-8">
        <h3 class="maz:text-lg maz:font-semibold">
          Vertical (par défaut)
        </h3>
        <MazTimeline :steps="timelineSteps" />

        <h3 class="maz:text-lg maz:font-semibold">
          Tous les états
        </h3>
        <MazTimeline :steps="timelineStepsStates" />

        <h3 class="maz:text-lg maz:font-semibold">
          Horizontal
        </h3>
        <MazTimeline :steps="timelineSteps" direction="horizontal" />

        <h3 class="maz:text-lg maz:font-semibold">
          Couleurs
        </h3>
        <div class="maz:flex maz:flex-col maz:gap-4">
          <MazTimeline v-for="c in colors.slice(0, 4)" :key="c" :steps="timelineStepsStates.slice(0, 3)" :color="c" />
        </div>

        <h3 class="maz:text-lg maz:font-semibold">
          Tailles
        </h3>
        <div class="maz:flex maz:flex-col maz:gap-4">
          <MazTimeline v-for="s in (['sm', 'md', 'lg'] as const)" :key="s" :steps="timelineStepsStates.slice(0, 3)" :size="s" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDialog
      </h2>
      <MazBtn @click="dialogOpen = true">
        Ouvrir le dialogue
      </MazBtn>
      <MazDialog v-model="dialogOpen" title="Titre du dialogue">
        <p>Ceci est un dialogue avec du contenu. Les dialogues conviennent bien aux confirmations, aux formulaires et aux vues détaillées.</p>
        <template #footer>
          <MazBtn outlined @click="dialogOpen = false">
            Annuler
          </MazBtn>
          <MazBtn @click="dialogOpen = false">
            Confirmer
          </MazBtn>
        </template>
      </MazDialog>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBottomSheet
      </h2>
      <MazBtn @click="bottomSheetOpen = true">
        Ouvrir la bottom sheet
      </MazBtn>
      <MazBottomSheet v-model="bottomSheetOpen">
        <div class="maz:p-6">
          <h3 class="maz:text-xl maz:font-bold maz:mb-4">
            Contenu de la bottom sheet
          </h3>
          <p>Ce panneau remonte depuis le bas. Idéal pour les actions et les menus adaptés au mobile.</p>
        </div>
      </MazBottomSheet>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDrawer
      </h2>
      <MazBtn @click="drawerOpen = true">
        Ouvrir le drawer
      </MazBtn>
      <MazDrawer v-model="drawerOpen" title="Panneau latéral">
        <div class="maz:p-4">
          <p>Contenu du panneau latéral. Pratique pour la navigation, les filtres ou les vues détaillées.</p>
        </div>
      </MazDrawer>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazPopover
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazPopover trigger="click" position="top">
          <template #trigger>
            <MazBtn>Clic (haut)</MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Popover au clic
            </p>
            <p class="maz:text-sm maz:text-muted">
              Affiché au clic, positionné en haut.
            </p>
          </div>
        </MazPopover>
        <MazPopover trigger="hover" position="bottom">
          <template #trigger>
            <MazBtn outlined>
              Survol (bas)
            </MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Popover au survol
            </p>
            <p class="maz:text-sm maz:text-muted">
              Affiché au survol, positionné en bas.
            </p>
          </div>
        </MazPopover>
        <MazPopover trigger="click" position="left">
          <template #trigger>
            <MazBtn color="secondary">
              Clic (gauche)
            </MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Popover à gauche
            </p>
            <p class="maz:text-sm maz:text-muted">
              Contenu sur le côté gauche.
            </p>
          </div>
        </MazPopover>
        <MazPopover trigger="click" position="right" persistent>
          <template #trigger>
            <MazBtn color="accent">
              Persistant (droite)
            </MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Popover persistant
            </p>
            <p class="maz:text-sm maz:text-muted">
              Ne se ferme pas au clic à l'extérieur.
            </p>
          </div>
        </MazPopover>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDropdown
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazDropdown :items="[{ label: 'Modifier', action: () => {} }, { label: 'Supprimer', action: () => {} }, { label: 'Archiver', action: () => {} }]">
          Actions
        </MazDropdown>
        <MazDropdown :items="[{ label: 'Profil' }, { label: 'Réglages' }, { label: 'Déconnexion' }]" color="secondary">
          Compte
        </MazDropdown>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTable
      </h2>
      <MazTable sortable search background-even pagination :headers="tableHeaders" :rows="tableRows" title="Membres de l'équipe" />
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazPagination
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazPagination v-model="paginationValue" :total-pages="10" active-color="primary" />
        <MazPagination v-model="paginationValue" :total-pages="10" active-color="info" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazGallery
      </h2>
      <MazGallery :images="galleryImages" :height="250" />
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCarousel
      </h2>
      <MazCarousel>
        <template #title>
          Éléments à la une
        </template>
        <MazCard v-for="i in 5" :key="i" :gallery="{ images: [galleryImages.at(i - 1) as MazGalleryImage], height: 150 }" style="min-width: 280px;">
          <template #content-title>
            Carte {{ i }}
          </template>
          <template #content-body>
            <p>Description de l'élément {{ i }} du carrousel.</p>
          </template>
        </MazCard>
      </MazCarousel>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazLazyImg
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazLazyImg v-for="(img, i) in galleryImages.slice(0, 3)" :key="i" :src="typeof img === 'string' ? img : img.src" style="width: 200px; height: 150px;" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSpinner
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4 maz:mb-4">
        <MazSpinner v-for="s in sizes" :key="s" />
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
        <MazSpinner v-for="c in colors" :key="c" :color="c" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazFullscreenLoader
      </h2>
      <p class="maz:text-muted">
        (Activé par programmation - non affiché dans la page)
      </p>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazLoadingBar
      </h2>
      <MazLoadingBar />
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSkeleton
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-3">
        <MazSkeleton />
        <MazSkeleton width="75%" />
        <MazSkeleton width="50%" />
        <div class="maz:flex maz:gap-3 maz:mt-2">
          <MazSkeleton shape="circle" size="40px" />
          <div class="maz:flex maz:flex-col maz:gap-2 maz:flex-1">
            <MazSkeleton width="60%" />
            <MazSkeleton width="40%" />
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazIcon
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
        <MazIcon :icon="MazUser" />
        <MazIcon :icon="MazHome" size="2rem" />
        <MazIcon :icon="MazCog" size="3rem" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazLink
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazLink href="#">
          Lien par défaut
        </MazLink>
        <MazLink v-for="c in [...colors, 'inherit' as const]" :key="c" href="#" :color="c">
          Lien {{ c }}
        </MazLink>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazReadMore
      </h2>
      <MazReadMore>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
        </p>
      </MazReadMore>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCircularProgressBar
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
        <MazCircularProgressBar :percentage="25" />
        <MazCircularProgressBar :percentage="50" color="info" />
        <MazCircularProgressBar :percentage="75" color="warning" />
        <MazCircularProgressBar :percentage="100" color="success" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazReadingProgressBar
      </h2>
      <p class="maz:text-muted">
        (Suit la progression du défilement de la page - visible en haut de l'écran)
      </p>
      <MazReadingProgressBar />
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAnimatedCounter
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-8">
        <div class="maz:text-center">
          <MazAnimatedCounter :count="1234" suffix="+" class="maz:text-4xl" />
          <p class="maz:text-sm maz:text-muted">
            Utilisateurs
          </p>
        </div>
        <div class="maz:text-center">
          <MazAnimatedCounter :count="99" suffix="%" prefix="~" class="maz:text-4xl" />
          <p class="maz:text-sm maz:text-muted">
            Disponibilité
          </p>
        </div>
        <div class="maz:text-center">
          <MazAnimatedCounter :count="50" suffix="+" class="maz:text-4xl" />
          <p class="maz:text-sm maz:text-muted">
            Composants
          </p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAnimatedText
      </h2>
      <MazAnimatedText text="Crée de belles interfaces" last-word="avec Maz UI" class="maz:text-3xl maz:font-bold" />
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAnimatedElement
      </h2>
      <div class="maz:grid maz:grid-cols-4 maz:gap-4">
        <MazAnimatedElement direction="up" :once="false">
          <MazCard bordered>
            <template #content-title>
              Haut
            </template>
          </MazCard>
        </MazAnimatedElement>
        <MazAnimatedElement direction="down" :once="false">
          <MazCard bordered>
            <template #content-title>
              Bas
            </template>
          </MazCard>
        </MazAnimatedElement>
        <MazAnimatedElement direction="left" :once="false">
          <MazCard bordered>
            <template #content-title>
              Gauche
            </template>
          </MazCard>
        </MazAnimatedElement>
        <MazAnimatedElement direction="right" :once="false">
          <MazCard bordered>
            <template #content-title>
              Droite
            </template>
          </MazCard>
        </MazAnimatedElement>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazList
      </h2>
      <div class="maz:grid maz:gap-4 maz:md:grid-cols-2 maz:mb-4">
        <MazList title="Réglages" footer="Les modifications s'appliquent immédiatement.">
          <MazListItem title="Wi-Fi" subtitle="Réseau domestique" clickable>
            <template #end>
              Activé
            </template>
          </MazListItem>
          <MazListItem title="Notifications">
            <template #actions>
              <MazSwitch v-model="listSwitch" aria-label="Notifications" />
            </template>
          </MazListItem>
          <MazListItem title="Avancé" collapsible>
            Contenu repliable
          </MazListItem>
        </MazList>
        <MazList size="lg" :bordered="false">
          <MazListItem title="Boîte de réception" active />
          <MazListItem title="Brouillons" disabled clickable />
        </MazList>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazColorPicker
      </h2>
      <div class="maz:flex maz:flex-col maz:items-start maz:gap-4 maz:mb-4">
        <MazColorPicker v-model="colorPickerValue" label="Couleur" />
        <MazColorPicker v-model="colorPickerValue" format="rgb" :alpha="false" :swatches="['#3b82f6', '#10b981', '#ef4444']" label="RGB avec échantillons" />
        <MazColorPicker v-model="colorPickerValue" inline />
        <MazColorPicker v-model="colorPickerValue" disabled label="Désactivé" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSegmented
      </h2>
      <div class="maz:flex maz:flex-col maz:items-start maz:gap-4 maz:mb-4">
        <MazSegmented v-model="segmentedValue" :options="radioOptions" aria-label="Segmenté" />
        <MazSegmented v-model="segmentedValue" :options="radioOptions" color="primary" size="sm" aria-label="Segmenté principal" />
        <MazSegmented v-model="segmentedValue" :options="radioOptions" rounded-size="full" block aria-label="Segmenté bloc" />
        <MazSegmented v-model="segmentedValue" :options="radioOptions" disabled aria-label="Segmenté désactivé" />
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazIndicator
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6 maz:mb-4">
        <MazIndicator color="success" />
        <MazIndicator :content="3" color="destructive" />
        <MazIndicator :content="128" color="destructive" />
        <MazIndicator :content="3" color="destructive">
          <MazBtn>Boîte de réception</MazBtn>
        </MazIndicator>
        <MazIndicator color="success" position="bottom-end" overlap="circular" pulse>
          <MazAvatar caption="Louis Mazel" rounded-size="full" />
        </MazIndicator>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTicker
      </h2>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Horizontal
      </h3>
      <MazTicker class="maz:mb-4">
        <span class="maz:px-4">Élément 1</span>
        <span class="maz:px-4">Élément 2</span>
        <span class="maz:px-4">Élément 3</span>
        <span class="maz:px-4">Élément 4</span>
      </MazTicker>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Inversé
      </h3>
      <MazTicker reverse class="maz:mb-4">
        <span class="maz:px-4">Élément 1</span>
        <span class="maz:px-4">Élément 2</span>
        <span class="maz:px-4">Élément 3</span>
        <span class="maz:px-4">Élément 4</span>
      </MazTicker>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Vertical avec images
      </h3>
      <div class="maz:flex maz:gap-4 maz:overflow-hidden" style="height: 300px">
        <MazTicker orientation="vertical" :overlay="false" :duration="30" pause-on-hover>
          <img
            v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i}/400/225`"
            :alt="`Capture d'écran ${i}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
            style="width: 400px; height: 225px"
          >
        </MazTicker>
        <MazTicker orientation="vertical" :overlay="false" :duration="30" reverse pause-on-hover>
          <img
            v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i + 4}/400/225`"
            :alt="`Capture d'écran ${i + 4}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
            style="width: 400px; height: 225px"
          >
        </MazTicker>
        <MazTicker class="maz:hidden maz:md:flex" orientation="vertical" :overlay="false" :duration="30" pause-on-hover>
          <img
            v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i + 8}/400/225`"
            :alt="`Capture d'écran ${i + 8}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
            style="width: 400px; height: 225px"
          >
        </MazTicker>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Incliné avec images
      </h3>

      <div class="maz:overflow-hidden maz:rounded-lg maz:bg-gray-100 maz:dark:bg-gray-800" style="height: 400px; perspective: 1500px">
        <div class="maz:flex maz:gap-4" style="height: 1200px; margin-top: -520px; margin-left: -200px; transform: rotateX(55deg) rotateZ(30deg); transform-origin: center center">
          <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i}/460/258`"
              :alt="`Capture d'écran ${i}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 4}/460/258`"
              :alt="`Capture d'écran ${i + 4}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Capture d'écran ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Capture d'écran ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Capture d'écran ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Capture d'écran ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
        </div>
      </div>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazContainer
      </h2>
      <MazContainer>
        <p>Contenu dans un MazContainer avec une largeur maximale.</p>
      </MazContainer>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBackdrop
      </h2>
      <p class="maz:text-muted">
        (Utilisé en interne par Dialog, BottomSheet et Drawer)
      </p>
    </section>

    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazChart
      </h2>
      <div style="height: 300px;">
        <MazChart
          type="bar"
          :data="{
            labels: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin'],
            datasets: [{
              label: 'Chiffre d\'affaires',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
            }],
          }"
        />
      </div>
    </section>
  </div>
</template>
