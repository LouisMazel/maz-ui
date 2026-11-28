<script lang="ts" setup>
import { MazHeart } from '@maz-ui/icons/static/MazHeart'
import MazDatePicker from 'maz-ui/components/MazDatePicker'
import MazInlineEdit from 'maz-ui/components/MazInlineEdit'
import MazKbd from 'maz-ui/components/MazKbd'
import MazRating from 'maz-ui/components/MazRating'
import MazTimePicker from 'maz-ui/components/MazTimePicker'

const rating = ref<number | null>(3)
const heart = ref<number | null>(2)
const clearable = ref<number | null>(4)
const nps = ref<number | null>(null)
const csat = ref<number | null>(4)

const wheelTime = ref<string | null>('09:30')
const wheel24 = ref<string | null>('18:45')
const slotTime = ref<string | null>(null)
const inlineWheel = ref<string | null>('14:15')
const inlineSlots = ref<string | null>('10:00')

const dateTime24 = ref<string | undefined>('2026-03-12 14:30')
const dateTime12 = ref<string | undefined>('2026-03-12 02:30 pm')
const onlyTimeValue = ref<string | undefined>('09:15')

const title = ref('Rapport trimestriel')
const name = ref('Alice Martin')
const lastSubmit = ref('')

function validateTitle(value: string) {
  return value.trim().length >= 3 || 'Au moins 3 caractères'
}

const labels = ['Bof', 'Moyen', 'Correct', 'Bien', 'Parfait']
</script>

<template>
  <ModernisationSection
    id="pr5-forms"
    title="PR 5. Formulaires"
    description="Une note sur de vrais boutons radio, un sélecteur d'heure, un texte modifiable sur place et des touches de clavier avec du relief."
  >
    <ModernisationDemo title="MazRating : note en étoiles" hint="Survole les étoiles : elles s'allument une à une et le libellé roule. Les flèches du clavier changent la note, un clic sur la note actuelle l'efface (clearable). En lecture seule, le remplissage peut être décimal.">
      <div class="flex flex-wrap items-center gap-x-10 gap-y-6">
        <MazRating v-model="rating" :labels="labels" />
        <MazRating v-model="heart" :icon="MazHeart" color="destructive" size="lg" />
        <MazRating v-model="clearable" clearable color="primary" />
        <div class="flex items-center gap-2">
          <MazRating :model-value="4.3" readonly size="sm" />
          <span class="text-sm text-muted">4,3 sur 5</span>
        </div>
        <MazRating :model-value="2" disabled />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRating : variante scale" hint="Des cases de 0 à 10 (type NPS) ou de 1 à 5. La case choisie se remplit depuis le bas.">
      <div class="flex flex-col gap-6">
        <MazRating
          v-model="nps"
          variant="scale"
          :min="0"
          :max="10"
          clearable
          color="primary"
          label="Recommanderiez-vous ce produit ?"
          min-label="Pas du tout"
          max-label="Absolument"
        />
        <MazRating v-model="csat" variant="scale" :max="5" color="success" size="lg" />
        <p class="text-sm text-muted">
          Note : {{ nps ?? 'aucune' }} / satisfaction : {{ csat ?? 'aucune' }}
        </p>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazTimePicker : roues et créneaux" hint="Dans un champ qui ouvre un popover. Les roues s'alignent comme sur iOS (défilement, flèches, Page précédente et suivante). Les créneaux sont une grille de vrais boutons radio : un clic choisit et ferme.">
      <div class="flex flex-wrap items-start gap-6">
        <MazTimePicker v-model="wheelTime" label="Heure (roues, 12 h)" format="12h" />
        <MazTimePicker v-model="wheel24" label="Heure (roues, 24 h)" format="24h" :step="5" />
        <MazTimePicker
          v-model="slotTime"
          label="Créneau"
          variant="slots"
          min="09:00"
          max="17:30"
          :step="30"
          :disabled-times="['10:30', '12:00', '12:30']"
          format="24h"
        />
        <p class="text-sm text-muted">
          {{ wheelTime }} / {{ wheel24 }} / {{ slotTime ?? 'aucun' }}
        </p>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazTimePicker : en ligne" hint="Avec inline, le sélecteur est posé dans la page, sans champ.">
      <div class="flex flex-wrap items-start gap-10">
        <MazTimePicker v-model="inlineWheel" inline format="24h" />
        <MazTimePicker v-model="inlineSlots" inline variant="slots" min="08:00" max="12:00" :step="30" format="24h" class="max-w-md" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazDatePicker avec l'heure" hint="Le calendrier et les roues de MazTimePicker dans le même sélecteur. Mêmes props qu'avant : time, only-time, minute-interval, disabled-hours, min-date et max-date.">
      <div class="flex flex-wrap items-start gap-6">
        <MazDatePicker v-model="dateTime24" label="Date et heure (24 h)" time format="YYYY-MM-DD HH:mm" locale="fr" :minute-interval="15" />
        <MazDatePicker v-model="dateTime12" label="Date et heure (12 h)" time format="YYYY-MM-DD hh:mm a" locale="fr" />
        <MazDatePicker v-model="onlyTimeValue" label="Heure seule" only-time format="HH:mm" locale="fr" :disabled-hours="[0, 1, 2, 3, 4, 5, 22, 23]" />
        <p class="text-sm text-muted">
          {{ dateTime24 ?? 'aucune' }} / {{ dateTime12 ?? 'aucune' }} / {{ onlyTimeValue ?? 'aucune' }}
        </p>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazInlineEdit : texte modifiable sur place" hint="Clique sur le texte (ou Entrée / F2 quand il a le focus) : le champ prend exactement sa place. Entrée valide et dessine une coche, Échap remet l'ancien texte en le faisant rouler, quitter le champ valide. Le titre exige 3 caractères.">
      <div class="flex flex-col items-start gap-6">
        <MazInlineEdit
          v-model="title"
          tag="h3"
          class="text-2xl font-bold"
          placeholder="Titre sans nom"
          :validate="validateTitle"
          @submit="lastSubmit = $event"
        />
        <p>
          Responsable : <MazInlineEdit v-model="name" placeholder="Nom" class="font-semibold" />
        </p>
        <p class="text-sm text-muted">
          Dernière validation : {{ lastSubmit || 'aucune' }}
        </p>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazKbd : touches de clavier" hint="⌘ sur Mac, Ctrl ailleurs. Avec live, les touches s'enfoncent quand tu tapes vraiment le raccourci : essaie Ctrl ou ⌘ + K, puis Maj + P.">
      <div class="flex flex-wrap items-center gap-x-8 gap-y-4">
        <MazKbd keys="mod+k" live />
        <MazKbd keys="Ctrl + Shift + P" platform="other" />
        <MazKbd keys="mod+shift+p" live />
        <MazKbd keys="mod+s" size="lg" live />
        <MazKbd keys="mod+enter" size="sm" />
        <span class="inline-flex items-center gap-2">Fermer avec <MazKbd>Esc</MazKbd></span>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
