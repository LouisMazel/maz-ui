<script lang="ts" setup>
import { MazCog6Tooth } from '@maz-ui/icons/static/MazCog6Tooth'
import { MazDocumentDuplicate } from '@maz-ui/icons/static/MazDocumentDuplicate'
import { MazHome } from '@maz-ui/icons/static/MazHome'
import { MazPencil } from '@maz-ui/icons/static/MazPencil'
import { MazPlus } from '@maz-ui/icons/static/MazPlus'
import { MazStar } from '@maz-ui/icons/static/MazStar'
import { MazTrash } from '@maz-ui/icons/static/MazTrash'
import { MazUser } from '@maz-ui/icons/static/MazUser'
import MazCommandPalette from 'maz-ui/components/MazCommandPalette'
import MazContextMenu from 'maz-ui/components/MazContextMenu'
import MazThemeToggle from 'maz-ui/components/MazThemeToggle'
import MazTooltip from 'maz-ui/components/MazTooltip'

const paletteOpen = ref(false)
const lastCommand = ref('Aucune')
const lastMenuAction = ref('Aucune')

function run(name: string) {
  lastCommand.value = name
}

const groups = [
  {
    label: 'Navigation',
    items: [
      { id: 'home', label: 'Aller à l\'accueil', description: 'La page d\'accueil de l\'application', icon: MazHome, keywords: ['dashboard', 'index'], action: () => run('Accueil') },
      { id: 'profile', label: 'Ouvrir le profil', description: 'Tes informations personnelles', icon: MazUser, keywords: ['compte', 'account'], action: () => run('Profil') },
      { id: 'settings', label: 'Ouvrir les réglages', icon: MazCog6Tooth, shortcut: '⌘,', keywords: ['préférences', 'options'], action: () => run('Réglages') },
    ],
  },
  {
    label: 'Actions',
    items: [
      { id: 'new', label: 'Créer un projet', icon: MazPlus, shortcut: '⌘N', action: () => run('Nouveau projet') },
      { id: 'duplicate', label: 'Dupliquer le projet', icon: MazDocumentDuplicate, shortcut: '⌘D', action: () => run('Dupliquer') },
      { id: 'star', label: 'Ajouter aux favoris', icon: MazStar, keywords: ['étoile'], action: () => run('Favoris') },
      { id: 'archive', label: 'Archiver (indisponible)', icon: MazTrash, disabled: true },
    ],
  },
]

const menuItems = [
  { label: 'Renommer', icon: MazPencil, shortcut: 'F2', action: () => (lastMenuAction.value = 'Renommer') },
  { label: 'Dupliquer', icon: MazDocumentDuplicate, shortcut: '⌘D', action: () => (lastMenuAction.value = 'Dupliquer') },
  { label: 'Ajouter aux favoris', icon: MazStar, action: () => (lastMenuAction.value = 'Favoris') },
  { label: 'Partager (indisponible)', icon: MazUser, disabled: true },
  { separator: true },
  { label: 'Supprimer', icon: MazTrash, color: 'destructive' as const, action: () => (lastMenuAction.value = 'Supprimer') },
]

const toolbar = [
  { label: 'Accueil', icon: MazHome },
  { label: 'Profil', icon: MazUser },
  { label: 'Réglages', icon: MazCog6Tooth },
  { label: 'Favoris', icon: MazStar },
]
</script>

<template>
  <ModernisationSection
    id="pr5-commands"
    title="PR 5. Commandes"
    description="La palette de commandes, le menu contextuel, le tooltip composant et le bouton de thème : de nouveaux composants qui partent du point où tu agis et qui se pilotent au clavier."
  >
    <ModernisationDemo title="MazCommandPalette" hint="Ctrl K (⌘K sur Mac) ouvre la palette, ou clique sur le bouton : la fenêtre grandit depuis lui. Tape pour filtrer (les lettres trouvées sont soulignées, essaie « prf » ou « fav »). À la souris le surlignage glisse, au clavier il saute d'un coup. Entrée lance la commande, Échap ferme.">
      <MazCommandPalette v-model:open="paletteOpen" :groups="groups">
        <template #trigger="{ open }">
          <MazBtn @click="open">
            Ouvrir la palette
            <kbd class="ms-2 rounded bg-foreground/10 px-1.5 text-xs">Ctrl K</kbd>
          </MazBtn>
        </template>
      </MazCommandPalette>
      <p class="mt-3 text-muted">
        Dernière commande : <strong>{{ lastCommand }}</strong>
      </p>
    </ModernisationDemo>

    <ModernisationDemo title="MazContextMenu" hint="Clic droit dans la zone : le menu grandit depuis le point exact du clic et reste dans l'écran (clique près d'un bord). Au clavier : Maj F10 ou la touche Menu. Sur tactile : appui long. Flèches, Début, Fin et les lettres déplacent le focus, Échap ferme et rend le focus.">
      <MazContextMenu :items="menuItems">
        <div
          tabindex="0"
          class="flex h-40 items-center justify-center rounded-lg border border-dashed border-divider bg-surface p-4 text-center text-muted focus-visible:outline-2 focus-visible:outline-primary"
        >
          Clic droit, appui long, ou focus puis Maj F10
        </div>
      </MazContextMenu>
      <p class="mt-3 text-muted">
        Dernière action : <strong>{{ lastMenuAction }}</strong>
      </p>
    </ModernisationDemo>

    <ModernisationDemo title="MazTooltip" hint="Au survol et au focus clavier, avec Échap pour fermer. Le premier a un texte, le deuxième un contenu riche avec un raccourci, le troisième est désactivé.">
      <div class="flex flex-wrap items-center gap-3">
        <MazTooltip text="Un simple texte">
          <MazBtn>Texte</MazBtn>
        </MazTooltip>
        <MazTooltip text="Enregistrer" shortcut="Ctrl S" position="bottom">
          <MazBtn color="secondary">
            Avec raccourci
          </MazBtn>
        </MazTooltip>
        <MazTooltip position="right">
          <MazBtn color="info">
            Contenu riche
          </MazBtn>
          <template #content>
            <strong>Titre</strong><br>
            <span>Une phrase d'explication.</span>
          </template>
        </MazTooltip>
        <MazTooltip text="Tu ne me verras pas" disabled>
          <MazBtn color="destructive">
            Désactivé
          </MazBtn>
        </MazTooltip>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazTooltip en groupe" hint="Passe d'un bouton à l'autre : une seule bulle glisse d'un bouton au suivant, sans délai ni refermeture. Avec le mouvement réduit, elle apparaît directement.">
      <div class="flex gap-2">
        <MazTooltip v-for="item in toolbar" :key="item.label" :text="item.label" group="pr5-toolbar" :delay="150">
          <MazBtn :icon="item.icon" :aria-label="item.label" color="surface" />
        </MazTooltip>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazThemeToggle" hint="Le soleil devient lune par morph. Le nom accessible annonce le prochain état. À gauche clair et sombre, à droite le mode à trois états : clair, sombre, système. Aucune erreur d'hydratation au chargement.">
      <div class="flex flex-wrap items-center gap-6">
        <MazThemeToggle />
        <MazThemeToggle color="primary" size="lg" />
        <MazThemeToggle tri-state />
        <MazThemeToggle tri-state color="surface" size="sm" />
        <MazThemeToggle :animated="false" />
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
