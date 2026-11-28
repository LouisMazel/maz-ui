<script lang="ts" setup>
import MazBreadcrumb from 'maz-ui/components/MazBreadcrumb'
import MazNavigationMenu from 'maz-ui/components/MazNavigationMenu'
import MazTour from 'maz-ui/components/MazTour'

const tourOpen = ref(false)
const tourStep = ref(0)
const tourLog = ref('Aucun événement pour l\'instant.')

const tourSteps = [
  { title: 'Bienvenue', description: 'Cette visite montre les éléments clés de l\'interface. Les flèches du clavier changent d\'étape, Échap la quitte.' },
  { target: '#pr5-tour-projects', title: 'Tes projets', description: 'Tous tes projets sont ici, classés par activité.', placement: 'bottom' as const },
  { target: '#pr5-tour-search', title: 'La recherche', description: 'Cherche un projet, une page ou une action.', placement: 'bottom' as const },
  { target: '#pr5-tour-avatar', title: 'Ton profil', description: 'Ton compte, tes réglages et la déconnexion.', placement: 'start' as const },
  { target: '#pr5-tour-footer', title: 'Une cible plus bas', description: 'Le trou glisse et la page défile jusqu\'à l\'élément si besoin.' },
]

const crumbs = [
  { label: 'Accueil', href: '#pr5-navigation', icon: 'home' },
  { label: 'Projets', href: '#pr5-navigation' },
  { label: 'Entreprise', href: '#pr5-navigation' },
  { label: 'Équipe design', href: '#pr5-navigation' },
  { label: 'Refonte du site', href: '#pr5-navigation' },
  { label: 'Maquettes', href: '#pr5-navigation' },
  { label: 'Version finale' },
]

const shortCrumbs = crumbs.slice(0, 3)

const menuItems = [
  {
    value: 'produits',
    label: 'Produits',
    items: [
      { label: 'Composants', description: 'Plus de 50 composants Vue prêts à l\'emploi.', href: '#pr5-navigation', icon: 'squares-2x2' },
      { label: 'Thèmes', description: 'Couleurs, rayons et mode sombre.', href: '#pr5-navigation', icon: 'swatch' },
      { label: 'Icônes', description: 'Des centaines d\'icônes, chargées à la demande.', href: '#pr5-navigation', icon: 'sparkles' },
    ],
  },
  { value: 'ressources', label: 'Ressources', panel: true },
  { label: 'Tarifs', href: '#pr5-navigation' },
  { label: 'Contact', href: '#pr5-navigation' },
]
</script>

<template>
  <ModernisationSection
    id="pr5-navigation"
    title="PR 5. Navigation avancée"
    description="Une visite guidée, un fil d'Ariane qui se replie et un menu de site avec un seul panneau qui glisse d'un menu à l'autre."
  >
    <ModernisationDemo title="MazTour" hint="Lance la visite : la page s'assombrit autour d'un trou de lumière qui glisse d'un élément à l'autre, la carte le suit. Flèches pour avancer et reculer, Échap pour quitter, Tab reste dans la carte. Avec « réduire les animations », le trou saute sans glisser.">
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3 rounded-xl border border-divider bg-surface p-3">
          <MazBtn id="pr5-tour-projects" size="sm" color="secondary">
            Projets
          </MazBtn>
          <MazInput id="pr5-tour-search" placeholder="Rechercher..." size="sm" class="min-w-48 flex-1" />
          <span id="pr5-tour-avatar" class="inline-flex rounded-full">
            <MazAvatar caption="LM" size="sm" />
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <MazBtn @click="tourStep = 0; tourOpen = true">
            Démarrer la visite
          </MazBtn>
          <span class="text-body-sm text-muted">Étape courante : {{ tourStep + 1 }} / {{ tourSteps.length }}</span>
        </div>
        <p class="text-body-sm text-muted">
          {{ tourLog }}
        </p>
        <div id="pr5-tour-footer" class="mt-24 rounded-xl border border-dashed border-divider p-4 text-center text-muted">
          Un élément plus bas dans la page
        </div>
        <MazTour
          v-model:open="tourOpen"
          v-model:step="tourStep"
          :steps="tourSteps"
          @finish="tourLog = 'Événement « finish » : visite terminée.'"
          @skip="tourLog = 'Événement « skip » : visite ignorée.'"
          @change="tourLog = `Événement « change » : étape ${$event + 1}.`"
        />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazBreadcrumb" hint="Redimensionne la zone (ou ouvre la page sur un écran étroit) : quand tout ne tient plus sur une ligne, le milieu se replie derrière « … ». Un clic le déplie, miette par miette, et le focus va sur la première page cachée. La dernière miette est la page courante.">
      <div class="flex flex-col gap-6">
        <div class="resize-x overflow-auto rounded-lg border border-divider p-3" style="width: 28rem; max-width: 100%;">
          <MazBreadcrumb :items="crumbs" />
        </div>
        <MazBreadcrumb :items="shortCrumbs" />
        <MazBreadcrumb :items="shortCrumbs">
          <template #separator>
            <span>/</span>
          </template>
        </MazBreadcrumb>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazNavigationMenu" hint="Survole ou clique « Produits » puis « Ressources » : un seul panneau change de taille et glisse de l'un à l'autre, sans se fermer. Une pill suit le pointeur. Au clavier : Tab, Entrée ou Espace pour ouvrir, flèche bas pour entrer dans le panneau, Échap pour fermer.">
      <div class="min-h-80">
        <MazNavigationMenu :items="menuItems" label="Navigation du site">
          <template #content-ressources>
            <div class="grid w-[30rem] gap-4 p-4 sm:grid-cols-2">
              <div class="rounded-lg bg-surface p-4">
                <p class="text-title-4">
                  Guide de démarrage
                </p>
                <p class="mt-1 text-body-sm text-muted">
                  Installe la bibliothèque et affiche ton premier composant en cinq minutes.
                </p>
                <MazBtn class="mt-3" size="sm" href="#pr5-navigation">
                  Commencer
                </MazBtn>
              </div>
              <ul class="m-0 flex list-none flex-col gap-2 p-0 pt-4 text-body-sm">
                <li><a class="block rounded-md px-2 py-1 hover:bg-foreground/5 focus-visible:bg-foreground/5" href="#pr5-navigation">Documentation</a></li>
                <li><a class="block rounded-md px-2 py-1 hover:bg-foreground/5 focus-visible:bg-foreground/5" href="#pr5-navigation">Exemples</a></li>
                <li><a class="block rounded-md px-2 py-1 hover:bg-foreground/5 focus-visible:bg-foreground/5" href="#pr5-navigation">Journal des changements</a></li>
              </ul>
            </div>
          </template>
        </MazNavigationMenu>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
