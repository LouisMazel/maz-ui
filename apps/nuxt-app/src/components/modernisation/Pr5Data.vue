<script lang="ts" setup>
import type { MazTreeItem } from 'maz-ui/components/MazTree'
import { sleep } from '@maz-ui/utils/helpers/sleep'
import MazEmptyState from 'maz-ui/components/MazEmptyState'
import MazMiddleTruncate from 'maz-ui/components/MazMiddleTruncate'
import MazRelativeTime from 'maz-ui/components/MazRelativeTime'
import MazSparkline from 'maz-ui/components/MazSparkline'
import MazStatCard from 'maz-ui/components/MazStatCard'
import MazTree from 'maz-ui/components/MazTree'

const revenue = ref(48_250)
const revenueTrend = ref([32, 35, 33, 38, 41, 39, 44, 47, 45, 52, 49, 56])
const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
const churn = [4.2, 4.0, 4.3, 3.8, 3.6, 3.7, 3.2, 3.0, 3.1, 2.8, 2.7, 2.5]

let refreshCount = 0

function refreshRevenue() {
  refreshCount++
  revenue.value += refreshCount % 2 === 0 ? -1800 : 2600
  revenueTrend.value = [...revenueTrend.value.slice(1), 40 + ((refreshCount * 7) % 25)]
}

const search = ref('')
const hasProjects = ref(false)

const files = ref<MazTreeItem[]>([
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'btn', label: 'MazBtn.vue', status: 'modified' },
          { id: 'card', label: 'MazCard.vue' },
          { id: 'tree', label: 'MazTree.vue', status: 'added' },
          { id: 'old', label: 'MazLegacy.vue', status: 'deleted' },
        ],
      },
      { id: 'composables', label: 'composables', children: [{ id: 'dialog', label: 'useDialog.ts' }, { id: 'toast', label: 'useToast.ts', disabled: true }] },
      { id: 'main', label: 'main.ts' },
    ],
  },
  { id: 'remote', label: 'Dossier distant', lazy: true },
  { id: 'readme', label: 'README.md' },
  { id: 'license', label: 'LICENSE' },
])

const expanded = ref<string[]>(['src', 'components'])
const selected = ref<string>()
const checked = ref<string[]>(['card'])

async function loadChildren(item: MazTreeItem): Promise<MazTreeItem[]> {
  await sleep(900)

  return [
    { id: `${item.id}-1`, label: 'chargé-1.txt' },
    { id: `${item.id}-2`, label: 'chargé-2.txt' },
    { id: `${item.id}-3`, label: 'archives', children: [{ id: `${item.id}-3-1`, label: 'ancien.zip' }] },
  ]
}

const now = Date.now()
const dates = [now - 4000, now - 3 * 60_000, now - 2 * 3_600_000, now - 26 * 3_600_000, now + 5 * 60_000, now - 40 * 86_400_000]
const fileName = 'rapport-financier-annuel-consolide-2026.pdf'
const width = ref(220)
</script>

<template>
  <ModernisationSection
    id="pr5-data"
    title="PR 5. Données"
    description="Un état vide qui suit le pointeur, une courbe de la taille d'un mot, une carte d'indicateur, une arborescence, un temps relatif qui se met à jour seul et un texte coupé au milieu. Tout respecte le mouvement réduit, le clavier et le RTL."
  >
    <ModernisationDemo title="MazEmptyState" hint="L'illustration se rapproche doucement du pointeur (souris uniquement). Dans la variante recherche, la requête est citée et le message est annoncé aux lecteurs d'écran.">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-divider">
          <MazEmptyState
            v-if="!hasProjects"
            title="Aucun projet pour l'instant"
            description="Crée ton premier projet pour le retrouver ici."
          >
            <template #actions>
              <MazBtn @click="hasProjects = true">
                Créer un projet
              </MazBtn>
            </template>
          </MazEmptyState>
          <p v-else class="p-6 text-center">
            Projet créé !
            <MazBtn size="sm" color="transparent" @click="hasProjects = false">
              Réinitialiser
            </MazBtn>
          </p>
        </div>
        <div class="rounded-lg border border-divider">
          <MazEmptyState variant="search" :query="search || 'licorne'" description="Essaie avec un autre mot ou retire un filtre.">
            <template #actions>
              <MazBtn color="transparent" @click="search = ''">
                Effacer la recherche
              </MazBtn>
            </template>
          </MazEmptyState>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSparkline" hint="Descends la page : la courbe se dessine à l'entrée dans l'écran et le dernier point se pose. Un résumé est lu par les lecteurs d'écran.">
      <p class="text-lg">
        Les ventes <MazSparkline :data="revenueTrend" /> montent, les erreurs <MazSparkline :data="churn" color="destructive" fill /> baissent, la charge <MazSparkline :data="[3, 3, 3, 3]" color="currentColor" :smooth="false" /> est stable.
      </p>
    </ModernisationDemo>

    <ModernisationDemo title="MazStatCard" hint="Le chiffre roule, la courbe se dessine, un repère suit le pointeur avec la valeur du point. Au clavier : focus sur la courbe puis flèches, Début et Fin.">
      <div class="flex flex-wrap items-start gap-4">
        <MazStatCard
          class="w-72"
          label="Chiffre d'affaires"
          :value="revenue"
          locale="fr-FR"
          :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
          :delta="12"
          delta-label="vs mois dernier"
          :data="revenueTrend"
          :labels="days"
        />
        <MazStatCard
          class="w-72"
          label="Taux de désabonnement"
          :value="0.025"
          locale="fr-FR"
          :format="{ style: 'percent', minimumFractionDigits: 1 }"
          :delta="-18.4"
          inverse
          color="success"
          :data="churn"
        />
        <MazBtn @click="refreshRevenue">
          Actualiser
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazTree" hint="Flèches, Début, Fin, lettres pour sauter, * pour tout ouvrir au même niveau. Les dossiers s'ouvrent à leur vraie hauteur. Le dossier distant charge ses enfants avec un spinner.">
      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <MazTree v-model="selected" v-model:expanded="expanded" :items="files" :load="loadChildren" label="Fichiers du projet" class="w-full max-w-sm" />
          <p class="mt-2 text-sm text-muted">
            Sélection : {{ selected ?? 'aucune' }}
          </p>
        </div>
        <div>
          <MazTree v-model="checked" :items="files" multiple label="Fichiers à exporter" class="w-full max-w-sm" />
          <p class="mt-2 text-sm text-muted">
            Cochés : {{ checked.join(', ') || 'aucun' }}
          </p>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRelativeTime" hint="Seuls les caractères qui changent roulent. Survole pour voir la date exacte. La langue suit la prop locale.">
      <ul class="flex flex-col gap-1">
        <li v-for="date in dates" :key="date">
          <MazRelativeTime :date="date" locale="fr" />
        </li>
        <li><MazRelativeTime :date="dates[1]!" locale="en" /> (en anglais)</li>
      </ul>
    </ModernisationDemo>

    <ModernisationDemo title="MazMiddleTruncate" hint="Redimensionne la largeur : le début et la fin restent lisibles, l'extension est gardée. Survole ou donne le focus : le nom complet s'ouvre depuis le centre.">
      <div class="flex flex-col gap-3">
        <MazSlider v-model="width" :min="80" :max="480" :labels="['Largeur']" class="max-w-xs" />
        <div :style="{ width: `${width}px` }">
          <MazMiddleTruncate :text="fileName" />
        </div>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
