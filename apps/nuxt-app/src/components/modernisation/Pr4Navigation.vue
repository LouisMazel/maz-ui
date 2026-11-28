<script lang="ts" setup>
const tab = ref(1)
const stretchTab = ref(1)
const tabItems = ['Aperçu', 'Activité', 'Paramètres', 'Facturation']

const page = ref(1)
const fixedPage = ref(1)
const softPage = ref(3)

const step = ref(1)
const steps = [
  { title: 'Compte', subtitle: 'Tes identifiants', content: 'Crée ton compte avec une adresse e-mail.' },
  { title: 'Adresse', subtitle: 'Où livrer ?', content: 'Indique l\'adresse de livraison de ta commande.' },
  { title: 'Paiement', subtitle: 'Carte ou virement', content: 'Choisis ton moyen de paiement.' },
  { title: 'Confirmation', content: 'Relis ta commande avant de la valider.' },
]
const errorStep = ref(2)
const errorSteps = [
  { title: 'Compte', content: 'Compte créé.', success: true },
  { title: 'Adresse', content: 'Le code postal est invalide.', error: true },
  { title: 'Paiement', content: 'Pas encore.' },
]

const sidebarOpen = ref(true)
const sidebarActive = ref('accueil')
const sidebarEntries = [
  { value: 'accueil', label: 'Accueil', icon: 'home' },
  { value: 'projets', label: 'Projets', icon: 'git-branch' },
  { value: 'reglages', label: 'Réglages', icon: 'cog-6-tooth' },
]

const dropdownItems = [
  { label: 'Profil', onClick: () => {} },
  { label: 'Préférences', onClick: () => {} },
  { label: 'Facturation', onClick: () => {} },
  { label: 'Équipe', onClick: () => {} },
  { label: 'Déconnexion', onClick: () => {}, disabled: true },
]

const listActive = ref('b')
</script>

<template>
  <ModernisationSection
    id="pr4-navigation"
    title="PR 4. Navigation"
    description="Onglets, pagination, étapes, barre latérale, menu déroulant et listes : l'indicateur glisse jusqu'à l'élément actif, les chiffres roulent, les coches se dessinent, le surlignage suit le pointeur. Les flèches du clavier ne déclenchent aucune animation."
  >
    <ModernisationDemo title="MazTabs et MazTabsBar" hint="Clique un onglet : la pill glisse, et le contenu arrive du côté de l'onglet, avec un court décalage (200 ms au lieu de 500 ms). Les flèches, Début et Fin déplacent le focus et la sélection ; le deuxième exemple étire la pill en route.">
      <div class="flex flex-col gap-6">
        <MazTabs v-model="tab">
          <MazTabsBar :items="tabItems" />
          <MazTabsContent>
            <MazTabsContentItem v-for="(label, index) in tabItems" :key="label" :tab="index + 1" class="py-4">
              Contenu de l'onglet « {{ label }} »
            </MazTabsContentItem>
          </MazTabsContent>
        </MazTabs>
        <MazTabsBar v-model="stretchTab" :items="tabItems" stretch standalone />
        <MazTabs orientation="vertical" class="max-w-md">
          <MazTabsBar :items="tabItems.slice(0, 3)" />
          <MazTabsContent>
            <MazTabsContentItem v-for="(label, index) in tabItems.slice(0, 3)" :key="label" :tab="index + 1" class="px-2">
              Version verticale : {{ label }}
            </MazTabsContentItem>
          </MazTabsContent>
        </MazTabs>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazPagination" hint="Une pill glisse vers la page courante et les numéros qui changent roulent. La première pagination garde sa taille d'origine (le nombre de boutons varie). La deuxième, avec fixed-slots, a toujours le même nombre de cases : elle ne saute pas. Au clavier, un seul bouton est dans l'ordre de tabulation, les flèches, Début et Fin déplacent le focus.">
      <div class="flex flex-col gap-6">
        <MazPagination v-model="page" :total-pages="30" />
        <MazPagination v-model="fixedPage" :total-pages="30" fixed-slots />
        <MazPagination v-model="softPage" :total-pages="12" :button-props="{ variant: 'soft' }" active-color="primary" />
        <p class="text-body-sm text-muted">
          La troisième utilise des boutons « soft » : sans pill, le fond de la page courante reste celui du bouton.
        </p>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazStepper" hint="Passe d'une étape à l'autre : la ligne se remplit (ou se vide en revenant), la coche de l'étape validée se dessine, et le contenu arrive dans le sens de la navigation. Le deuxième stepper montre une étape en erreur.">
      <div class="grid gap-8 lg:grid-cols-2">
        <MazStepper v-model="step" :steps="steps" auto-validate-steps />
        <MazStepper v-model="errorStep" :steps="errorSteps" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSidebar" hint="Clique un élément : la pill glisse. Replie la barre (le bouton du haut) : les libellés glissent et s'estompent, et l'icône du bouton se transforme (menu vers croix). Au clavier, l'anneau de focus apparaît à l'intérieur de la ligne.">
      <div class="flex h-80 overflow-hidden rounded-lg border border-divider">
        <MazSidebar v-model:open="sidebarOpen" collapsible="icon" :persist="false" class="h-full">
          <MazSidebarHeader>
            <div class="p-2">
              <MazSidebarTrigger />
            </div>
          </MazSidebarHeader>
          <MazSidebarContent>
            <MazSidebarMenu>
              <MazSidebarMenuItem v-for="entry in sidebarEntries" :key="entry.value">
                <MazSidebarMenuButton
                  :label="entry.label"
                  :icon="entry.icon"
                  :tooltip="entry.label"
                  :active="sidebarActive === entry.value"
                  @click="sidebarActive = entry.value"
                />
              </MazSidebarMenuItem>
            </MazSidebarMenu>
          </MazSidebarContent>
        </MazSidebar>
        <main class="flex-1 p-4 text-muted">
          Section active : {{ sidebarActive }}
        </main>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazDropdown" hint="Ouvre le menu et promène le pointeur : un surlignage glisse d'une ligne à l'autre. Au clavier il n'y a aucune animation : les flèches, Début, Fin et les lettres (tape « é » ou « p ») déplacent le focus, qui boucle et saute la ligne désactivée.">
      <div class="flex flex-wrap items-start gap-6">
        <MazDropdown :items="dropdownItems" trigger="click" color="surface">
          Mon compte
        </MazDropdown>
        <MazDropdown :items="dropdownItems" trigger="click" color="surface" items-size="sm" :animated="false">
          Lignes compactes, sans glissement
        </MazDropdown>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazList et MazListItem" hint="La ligne de menu de référence : survol et focus par les mêmes jetons que le menu déroulant, durées du thème, chevron qui tourne à la vitesse du thème.">
      <MazList class="max-w-md" title="Projets">
        <MazListItem
          v-for="entry in [{ id: 'a', title: 'Refonte du site' }, { id: 'b', title: 'Application mobile' }, { id: 'c', title: 'Documentation' }]"
          :key="entry.id"
          :title="entry.title"
          clickable
          :active="listActive === entry.id"
          @click="listActive = entry.id"
        />
        <MazListItem title="Détails de la facturation" collapsible>
          Les factures sont envoyées chaque mois par e-mail.
        </MazListItem>
      </MazList>
    </ModernisationDemo>
  </ModernisationSection>
</template>
