<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'

const outerOpen = ref(false)
const innerOpen = ref(false)
const popoverDialogOpen = ref(false)
const selectValue = ref<string>()
const selectOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
]

const tab = ref('overview')
const tabItems = ['Aperçu', 'Activité', 'Réglages', 'Facturation', 'Équipe', 'Sécurité', 'Intégrations', 'Journal d\'audit', 'Support', 'Docs'].map(label => ({ label, value: label.toLowerCase() }))

const code = ref('')

const infoAlert = useTemplateRef<ComponentPublicInstance>('infoAlert')
const destructiveAlert = useTemplateRef<ComponentPublicInstance>('destructiveAlert')
const roles = ref({ info: '', destructive: '' })

onMounted(() => {
  roles.value = {
    info: infoAlert.value?.$el.getAttribute('role') ?? '',
    destructive: destructiveAlert.value?.$el.getAttribute('role') ?? '',
  }
})
</script>

<template>
  <ModernisationSection
    id="bug-fixes"
    title="6. Corrections de bugs de la PR"
    description="Chaque démo reproduit un bug corrigé dans cette PR."
  >
    <ModernisationDemo title="Dialogues imbriqués" hint="Échap ferme seulement le dialogue du dessus, et le focus reste à l'intérieur.">
      <MazBtn @click="outerOpen = true">
        Ouvrir le premier dialogue
      </MazBtn>
      <MazDialog v-model="outerOpen" title="Premier dialogue">
        <p class="mb-4">
          Ouvre le second, puis appuie sur Échap : seul le second se ferme.
        </p>
        <MazBtn @click="innerOpen = true">
          Ouvrir le second dialogue
        </MazBtn>
        <MazDialog v-model="innerOpen" title="Second dialogue">
          <p class="mb-4">
            Le focus est piégé ici.
          </p>
          <MazInput label="Le focus reste dans ce champ" />
        </MazDialog>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="MazPopover et MazSelect dans un MazDialog" hint="Ouvre le select ou le popover, puis appuie sur Échap : seul lui se ferme, le dialogue reste ouvert.">
      <MazBtn @click="popoverDialogOpen = true">
        Ouvrir le dialogue
      </MazBtn>
      <MazDialog v-model="popoverDialogOpen" title="Dialogue avec overlays">
        <div class="flex flex-col gap-4">
          <MazSelect v-model="selectValue" :options="selectOptions" label="Framework" />
          <MazPopover trigger="click">
            <template #trigger>
              <MazBtn color="secondary">
                Ouvrir un popover
              </MazBtn>
            </template>
            <div class="p-4">
              Échap ne ferme que moi.
            </div>
          </MazPopover>
        </div>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="MazTabsBar sans défilement automatique" hint="L'indicateur est placé sur l'onglet actif même quand la barre ne défile pas jusqu'à lui.">
      <div class="max-w-md">
        <MazTabsBar v-model="tab" :items="tabItems" :auto-scroll="false" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazDropdown ouvert, les flèches font toujours défiler la page" hint="Ouvre le dropdown, puis utilise les flèches ou la molette : la page défile au lieu d'être bloquée.">
      <MazDropdown>
        Ouvrir le dropdown
        <template #dropdown>
          <div class="w-56 p-4">
            Fais défiler la page avec les flèches pendant que je suis ouvert.
          </div>
        </template>
      </MazDropdown>
    </ModernisationDemo>

    <ModernisationDemo title="MazInputCode" hint="Colle un code ou laisse le navigateur le remplir (code à usage unique). En RTL, les flèches suivent la direction.">
      <div class="flex flex-col gap-4">
        <MazInputCode v-model="code" :code-length="6" />
        <p class="text-caption">
          Valeur : {{ code || 'vide' }}
        </p>
        <div dir="rtl">
          <p class="mb-2 text-caption">
            RTL forcé
          </p>
          <MazInputCode :code-length="6" />
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazAlert roles" hint="Une alerte neutre est un statut (poli), une alerte urgente est une alerte (assertif).">
      <div class="flex flex-col gap-3">
        <MazAlert ref="infoAlert" color="info" title="Info" content="Lu depuis le DOM : le rôle est annoncé poliment." />
        <p class="text-caption">
          info: role="{{ roles.info || '...' }}"
        </p>
        <MazAlert ref="destructiveAlert" color="destructive" title="Erreur" content="Lu depuis le DOM : le rôle est annoncé immédiatement." />
        <p class="text-caption">
          destructive: role="{{ roles.destructive || '...' }}"
        </p>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
