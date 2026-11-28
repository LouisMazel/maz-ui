<script lang="ts" setup>
import type { ToastOptions, ToastPosition } from 'maz-ui/plugins/toast'

const toast = useToast()

const positions: ToastPosition[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']
const position = ref<ToastPosition>('bottom-right')
const stacked = ref(true)

const options = computed<ToastOptions>(() => ({ position: position.value, stacked: stacked.value }))

const types = [
  { label: 'Message', color: 'contrast', show: () => toast.message('Un message', options.value) },
  { label: 'Info', color: 'info', show: () => toast.info('Une information', options.value) },
  { label: 'Succès', color: 'success', show: () => toast.success('Enregistré avec succès', options.value) },
  { label: 'Avertissement', color: 'warning', show: () => toast.warning('Fais attention', options.value) },
  { label: 'Erreur', color: 'destructive', show: () => toast.error('Une erreur est survenue', options.value) },
  { label: 'Accent', color: 'accent', show: () => toast.accent('Un toast accent', options.value) },
  { label: 'Neutre', color: 'neutral', show: () => toast.neutral('Un toast neutre', options.value) },
] as const

function burst(count = 5) {
  for (let index = 1; index <= count; index++) {
    setTimeout(() => toast.message(`Toast ${index} sur ${count}${index % 2 === 0 ? ', un message plus long pour voir les hauteurs différer dans la pile' : ''}`, options.value), index * 150)
  }
}

function runPromise(shouldResolve: boolean) {
  const task = new Promise<string>((resolve, reject) => {
    setTimeout(() => (shouldResolve ? resolve('Louis') : reject(new Error('Réseau indisponible'))), 2000)
  })

  toast.promise(task, {
    ...options.value,
    loading: 'Enregistrement du profil...',
    success: name => `Profil de ${name} enregistré`,
    error: error => `Échec : ${(error as Error).message}`,
  })

  task.catch(() => {})
}
</script>

<template>
  <ModernisationSection
    id="pr2-toasts"
    title="Toasts"
    description="Une pile par défaut, étalée au survol ou au focus. Les autres glissent quand un toast arrive ou part, un balayage le ferme, le toast de promesse trace son résultat, la ligne montre le temps restant."
  >
    <ModernisationDemo title="Réglages" hint="Appliqués aux boutons ci-dessous.">
      <div class="flex flex-wrap items-center gap-4">
        <MazSelect
          v-model="position"
          label="Position"
          :options="positions.map(value => ({ label: value, value }))"
          class="w-48"
        />
        <MazSwitch v-model="stacked">
          Empilés
        </MazSwitch>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Types" hint="Un toast de chaque type, à la position choisie.">
      <div class="flex flex-wrap gap-2">
        <MazBtn v-for="item in types" :key="item.label" :color="item.color" size="sm" @click="item.show()">
          {{ item.label }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Pile" hint="Une rafale de toasts : survole ou donne le focus à la pile pour l'étaler, masque l'onglet pour mettre les minuteurs en pause. Sans empilement, ils restent en liste.">
      <div class="flex flex-wrap gap-2">
        <MazBtn size="sm" @click="burst(5)">
          Rafale de 5
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="burst(12)">
          Rafale de 12
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="toast.message('Reste jusqu\'à la fermeture', { ...options, timeout: false })">
          Sans délai
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Promesse" hint="Chargement, puis une coche ou une croix qui se trace, et le texte s'estompe.">
      <div class="flex flex-wrap gap-2">
        <MazBtn size="sm" color="success" @click="runPromise(true)">
          Résoudre
        </MazBtn>
        <MazBtn size="sm" color="destructive" @click="runPromise(false)">
          Rejeter
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Balayage" hint="Fais glisser un toast vers le bord (vers le haut ou le bas sur les positions centrées) ou lance-le. Un glissement court revient en place. Change la direction dans la barre d'outils pour tester le RTL.">
      <MazBtn size="sm" @click="toast.info('Balaie-moi', { ...options, timeout: false })">
        Afficher un toast à balayer
      </MazBtn>
    </ModernisationDemo>
  </ModernisationSection>
</template>
