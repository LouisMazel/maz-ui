# Nouveaux composants : catalogue à trier

Cocher ce qu'on garde, barrer ou supprimer le reste. Chaque entrée : ce que c'est, à quoi ça sert, le mouvement prévu, et sur quoi il s'appuie dans maz-ui. Plan général : [modernisation.md](./modernisation.md). Chaque composant retenu remplace du code existant quand c'est possible (plan, « Réutilisation entre composants »).

« ROADMAP » = déjà listé dans [ROADMAP.md](./ROADMAP.md).

## Navigation et interaction

- [ ] **MazCommandPalette** (ROADMAP) : la fenêtre ⌘K (comme Spotlight, Raycast ou Linear). Un champ de recherche dans un dialog, la liste des actions et des pages filtrée pendant la frappe, Enter exécute. Sert à naviguer et à lancer des actions au clavier dans une app riche. Mouvement : ouverture depuis l'origine, highlight qui glisse à la souris (pas au clavier), lettres trouvées soulignées. S'appuie sur `MazDialog`, `useFuzzySearch`, `useShortcut`.
- [ ] **MazContextMenu** (ROADMAP) : le menu du clic droit (ou appui long sur tactile, Shift + F10 au clavier) sur une zone donnée : « Renommer, Dupliquer, Supprimer ». Mouvement : grandit depuis le point exact du clic, reste dans l'écran. S'appuie sur `MazPopover` (référence virtuelle `{ x, y }`) et les items de `MazDropdown`.
- [ ] **MazTour** : visite guidée d'une interface. La page s'assombrit, un « trou » de lumière entoure un élément, une carte explique (« Ici, vos projets »), Suivant passe à l'élément suivant. Sert à l'onboarding. Mouvement : le trou glisse et change de forme d'un élément à l'autre, la carte suit. S'appuie sur `MazPopover`, `MazBackdrop`.
- [ ] **MazBreadcrumb** (ROADMAP) : fil d'Ariane (Accueil / Projets / Maz UI). Quand il ne tient pas sur une ligne, le milieu se replie derrière un bouton « … » qui le déplie crumb par crumb.
- [ ] **MazMenubar / MazNavigationMenu** (ROADMAP) : barre de menus d'app (Fichier, Édition...) et menu de site avec méga-menus. Mouvement : un seul panneau qui change de taille et glisse d'un menu à l'autre au lieu de se fermer et se rouvrir, une pill suit le pointeur.
- [ ] **MazTooltip** (ROADMAP) : la version composant de `vTooltip`, avec slots (contenu riche, raccourci clavier). Mode groupe : une seule bulle qui glisse de bouton en bouton.
- [ ] **MazThemeToggle** : bouton clair/sombre (soleil vers lune en morph), qui part du réglage système et garde le choix. S'appuie sur `useTheme` (`toggleDarkMode`, `setColorMode`). Mode à trois états en option (clair, sombre, système).

## Formulaires

- [ ] **MazRating** (ROADMAP) : note en étoiles (ou autre icône) sur de vrais radios. Les étoiles s'allument une à une sous le pointeur, un libellé optionnel roule (« Bof » vers « Parfait »). Mode lecture seule avec remplissage décimal (4,3 étoiles). Option `variant="scale"` : score de 0 à 10 ou de 1 à 5 en cases (type NPS), la case choisie se remplit depuis le bas (décidé : option, pas de composant à part).
- [ ] **MazTimePicker** : choix d'une heure seule (MazDatePicker sait déjà le faire avec la date). Deux modes : une roue qui « snap » façon iOS, ou la liste des créneaux libres d'une journée. À trancher : composant à part ou mode `time-only` de MazDatePicker.
- [ ] **Choix en cartes** (ex-MazChoiceCards) : choix en cartes (titre, une ligne, prix optionnel) sur de vrais radios ou checkboxes, comme le choix d'une offre ou d'une livraison. La bordure de la carte choisie se dessine. Proposition : variante `cards` de `MazRadioButtons` (un choix) et de `MazChecklist` (plusieurs), pas de composant à part.
- [ ] **Bascules multiples** (ex-MazToggleGroup) : plusieurs boutons on/off côte à côte (gras, italique, souligné ; jours de la semaine). Ça doublonnerait MazSegmented et MazBtnGroup. Proposition : `multiple` sur `MazSegmented` (v-model en tableau, `aria-pressed`), et MazBtnGroup reste le groupe de boutons d'action, en mieux (aspect collé, roving focus, état actif optionnel). Détail dans le plan, « Familles à clarifier ».
- [ ] **MazInlineEdit** : un texte qui devient un champ quand on clique dessus (titre d'un document, nom d'une ligne). Enter valide avec une coche, Échap remet l'ancien texte en le faisant rouler.
- [ ] **Force du mot de passe** : option `strength` de `MazInputSecret` (jauge qui se remplit, verdict qui roule, règles qui se cochent, règles et calcul personnalisables), pas de composant à part.

## Affichage de données

- [ ] **MazRollingText** (prévu dans le plan, phase 0) : un texte ou un nombre dont seuls les caractères qui changent roulent, comme un odomètre (prix mensuel vers annuel, compteur, « Copier » vers « Copié »). Public parce qu'utile partout.
- [ ] **MazKbd** : touches de clavier affichées avec un peu de relief (`⌘ K`, `Ctrl + Shift + P`), seules, en combinaison ou en liste de raccourcis. Option : les touches s'enfoncent quand l'utilisateur tape vraiment le raccourci (avec `useShortcut`).
- [ ] **MazEmptyState** : ce qu'affiche une liste ou une page vide : une illustration ou une icône, une phrase, l'action suivante (« Aucun projet. Créer un projet »). Variante « aucun résultat » pour une recherche. Mouvement : l'illustration réagit à l'approche du pointeur.
- [ ] **MazSparkline** : une petite courbe de tendance de la taille d'un mot, dans une phrase ou une cellule de tableau. Elle se dessine à l'entrée dans l'écran, le dernier point se pose. Sans Chart.js (SVG simple, léger).
- [ ] **MazStatCard** : carte d'indicateur clé (KPI) : le chiffre, sa variation (+12 %), la courbe en fond. Le chiffre roule, la courbe se dessine, un repère suit le pointeur avec la valeur du jour. S'appuie sur MazRollingText et MazSparkline.
- [ ] **MazTree** (ROADMAP « Tree / TreeView ») : arborescence dépliable (fichiers, catégories), dossiers qui s'ouvrent à leur hauteur réelle, icônes par type, marques ajouté, modifié et supprimé en option, sélection et clavier.
- [ ] **MazBeforeAfter** : deux images superposées et une poignée à faire glisser pour comparer avant et après (retouche, rénovation). Clavier aux flèches, petit mouvement d'invite au premier affichage.
- [ ] **MazRelativeTime** : affiche « il y a 3 minutes » sur une vraie balise `<time>`, mis à jour tout seul, dans la langue de la page ; seule la partie qui change roule, la date exacte apparaît au survol. S'appuie sur `useRelativeTime`.
- [ ] **MazMiddleTruncate** : coupe un texte trop long au milieu (`rapport-fin…-2026.pdf`) pour garder le début et la fin lisibles, le texte complet s'ouvre depuis le centre au survol ou au focus.
- [ ] **MazSplitter** (ROADMAP « Resizable / Splitter ») : panneaux redimensionnables par une poignée (éditeur et aperçu, liste et détail), au clavier aussi, tailles mémorisables.
- [ ] **MazScrollArea** (ROADMAP) : zone qui défile avec une barre de défilement fine et identique sur tous les navigateurs, fondus en haut et en bas quand il reste du contenu.

## Médias

- [ ] **MazLightbox** (refonte de `vFullscreenImg`) : visionneuse plein écran d'images. L'image grandit depuis sa vignette et y retourne, flèches et swipe entre les images d'un groupe, compteur et légende, zoom et pinch, vrai dialog accessible. Utilisée par la directive `vFullscreenImg` (mêmes options) et par MazGallery, utilisable seule. Détail dans le plan, « Refontes ».

## Icônes et effets

- [ ] **MazMorphIcon** : bouton icône dont les traits se transforment en une autre icône : lecture vers pause, menu vers croix, plus vers croix, son vers muet, liste vers grille. Suit `aria-pressed` ou `aria-expanded`. Sert aux boutons à deux états. Réutilisé dans la lib : MazInputSecret (œil vers œil barré), MazAccordion (plus vers moins), MazSidebarTrigger (menu vers croix), MazBtnClipboard (copier vers coche), MazThemeToggle (soleil vers lune), MazBtnScroll, et les chevrons si le morph apporte quelque chose (liste complète dans le plan, « Réutilisation »).
- [ ] **Icônes animées au survol** : un mode `animated` sur `MazIcon` pour quelques icônes qui miment leur sens (la cloche sonne, la corbeille soulève son couvercle, l'engrenage tourne, l'avion décolle). À tester sur un petit jeu d'icônes avant d'étendre.
- [ ] **Variantes de MazAnimatedText** (une prop `effect`, pas des composants séparés) :
  - `scramble` : le texte se décode lettre par lettre à l'entrée ou quand il change ;
  - `rotate` : un mot de la phrase change en boucle (« Créez des sites rapides, beaux, accessibles ») ;
  - `typewriter` : frappé avec un rythme humain et un curseur ;
  - `shimmer` : une bande de lumière traverse le texte (« Réflexion en cours... »), utile pour les états de chargement IA ;
  - `highlight` : un surlignage, un soulignement ou un cercle dessiné à la main sur des mots clés.
- [ ] **MazProgressiveBlur** : un flou qui s'intensifie vers un bord, sans ligne dure (sous une barre collante, au bas d'une liste qui défile, sous une légende de photo).
- [ ] **Bordure qui se dessine** : au survol, un trait dessine le contour depuis le point d'entrée du pointeur. Une primitive CSS partagée (`maz-border-draw`), exposée en option (`border-draw`) sur MazCard, MazContainer, MazCardSpotlight, la variante `cards` de MazRadioButtons et MazChecklist (carte choisie) et le focus de MazInput. Pas de composant à part.

## Directives

- [ ] **vPress** (ou intégré aux composants) : retour de pression sur n'importe quel élément cliquable (léger enfoncement, retour avec rebond).
- [ ] **vRipple** : remplissage qui part du point exact où le pointeur entre et se vide vers celui où il sort (ou onde au clic). Option de MazBtn plutôt que directive seule ?
- [ ] **vMagnetic** : l'élément se penche vers le pointeur quand il approche et revient en douceur (gros boutons d'appel à l'action). Désactivé sur tactile et en reduced motion.
- [ ] **vTilt** : légère inclinaison 3D qui suit le pointeur (cartes, visuels). Option `global` (suit le pointeur sur toute la page, comme la scène 3D de la homepage) et `float` (léger flottement en profondeur). Remplace l'effet fait main de `HeroFloating` sur la homepage.
- [ ] **vDraw** : un SVG en traits se dessine trait par trait à l'entrée dans l'écran, ou lié au scroll.
- [ ] **vReveal** (remplace l'AOS) : nouveau système sous un nouveau nom, l'AOS est déprécié mais marche jusqu'à la v6. Révélations horizontales et verticales par `clip-path` (rideau, iris), lignes de texte qui montent depuis un masque, mots en cascade, cascades automatiques des blocs qui arrivent ensemble, mode lié au scroll (entrée et sortie). CSS seulement, un observer partagé, rien de caché sans JS (LCP). Directive, composant `MazReveal`, `useReveal` et attribut `data-maz-reveal`. Détail dans le plan, « Refontes ».

## Écartés d'office (hors d'une lib de composants)

Sections de site marketing de Kodza (hero, header, footer, contact, pricing, e-commerce, transitions de page, fonds WebGL) : du ressort d'un site ou d'un template, pas de maz-ui.
