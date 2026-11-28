# Modernisation de maz-ui : mouvement, cohérence, design

Objectif : une lib vivante et cohérente. Un seul langage de mouvement, appliqué partout, sur des tokens du thème ; des API et un design harmonisés ; quelques composants qui manquent ; des composants anciens refaits (MazDatePicker, vFullscreenImg, AOS). Le tout en 5.x, sans breaking change.

Inspirations : Kodza (le langage de mouvement), Base UI / Reka / Radix (origine des overlays, `data-state`), Sonner (toasts), Vaul (drawer), NumberFlow (chiffres qui roulent), Emil Kowalski (règles de motion). Kodza interdit de porter son code (licence : « ported version (React, Vue, Svelte...) » interdite) : on reprend des idées, on écrit tout de zéro sans lire leurs fichiers.

Catalogue des nouveaux composants : [modernisation-composants.md](./modernisation-composants.md).

## Exigences (specs, valables pour chaque PR)

Une PR qui ne coche pas tout ceci n'est pas terminée.

### Pas de breaking change

- La v5 reste la cible : aucune prop, aucun événement, aucun slot, aucun export ni aucune classe publique retirés ou renommés. Une ancienne API reste un alias qui donne exactement le même résultat.
- Dépréciation dans TypeScript : `@deprecated` dans la JSDoc de la prop, de l'option ou de l'export, avec l'alternative et un exemple (`@deprecated Use \`variant="outline"\` instead`), plus `Removed in v6 (plans/ROADMAP.md)` dans le code pour la retrouver. L'éditeur la barre et affiche l'alternative ; pas d'avertissement à l'exécution.
- Les nouveautés visibles qui changent l'existant (nouvelle animation par défaut, nouveau style) ne cassent ni la mise en page ni le comportement : mêmes dimensions, même DOM accessible, mêmes événements, au même moment. Toute nouveauté qui changerait une dimension ou un comportement est opt-in (prop ou option globale).
- Un vrai blocage (impossible sans casser) remonte au mainteneur avant d'écrire le code. Les cas déjà connus sont dans « Points à trancher » en bas.

### Pas de régression

- Les tests existants restent verts sans être modifiés, sauf s'ils testaient un détail d'implémentation remplacé (à justifier dans la PR).
- Filet de sécurité avant les gros changements : tests de régression visuelle (captures Playwright des démos de la doc, clair et sombre, LTR et RTL), voir PR 1 du découpage.
- Chaque PR vérifie à l'écran les démos des composants touchés, et les composants qui les utilisent (un changement de MazPopover touche Select, Dropdown, DatePicker, Autocomplete, ColorPicker, vTooltip).

### Accessibilité

- Clavier complet (pattern ARIA APG du composant), focus visible partout (`maz-focus-ring`), focus restauré à la fermeture d'un overlay.
- Rôles et états ARIA justes ; les contenus animés restent lisibles par un lecteur d'écran (texte qui roule : la valeur finale seule est annoncée ; décor : `aria-hidden`).
- Reduced motion : le mouvement spatial devient un fondu court, les changements d'état restent. Option globale `motion` pour le forcer.
- Aucun contenu qui clignote plus de 3 fois par seconde ; une animation en boucle a un moyen de pause (WCAG 2.2.2).
- Tests axe (déjà en CI) et tests clavier pour chaque composant touché.

### Bundle size

- Pas de dépendance d'animation (pas de motion-v, GSAP...) : CSS d'abord, WAAPI ensuite, quelques lignes de JS au plus.
- Primitives en modules à part, tree-shakables ; un composant ne paie que les motifs qu'il utilise. Les fonctions lourdes et rares (lightbox, palette de commandes, tour) sont chargées en import dynamique.
- Les courbes `linear()` des ressorts sont générées au build, pas au runtime.
- Taille mesurée avant et après (chunks JS et CSS des composants touchés, `dist`), notée dans la PR. Un composant de base (MazBtn, MazInput) ne doit pas grossir de plus de quelques centaines d'octets gzip. À terme : garde-fou de taille en CI.

### Performance (Core Web Vitals)

- **LCP** : aucun contenu au-dessus de la ligne de flottaison n'est caché en attendant le JS. Une révélation à l'entrée dans l'écran ne masque rien sans JS ni avant l'hydratation (SSR Nuxt), et jamais l'élément du LCP.
- **CLS** : n'animer que `transform`, `opacity`, `clip-path`, `stroke-dashoffset`, jamais `width`, `height`, `top` ou `margin` ; place réservée pour les textes qui roulent, les skeletons et les images ; toasts et overlays hors du flux.
- **INP** : pas de travail lourd au clic ; une seule lecture de rect par interaction (pas d'alternance lecture/écriture qui force le layout), `requestAnimationFrame` pour le suivi du pointeur, des observers partagés (un `IntersectionObserver` pour toute la page, pas un par élément).
- Rien ne tourne hors de l'écran ni dans un onglet caché (boucles, canvas, compteurs en pause).
- `will-change` seulement pendant l'animation.
- Mesure Lighthouse (mobile) de la homepage de la doc avant et après les PRs qui la touchent.

### RTL / LTR

- Propriétés logiques partout (`inset-inline-start`, `margin-inline`, `padding-inline`), jamais `left/right` pour un placement.
- Les sens de mouvement s'expriment en `start/end` ; une variable `--maz-dir` (`1` ou `-1`) inverse les translations horizontales.
- Les flèches du clavier suivent la direction (en RTL, flèche gauche = suivant) : tabs, segmented, slider, carrousel, lightbox, date picker.
- Gestes (swipe) et origines (rect du déclencheur) indépendants de la direction.
- Chaque PR vérifie ses démos en RTL (captures).

### Flexibilité (sans excès)

- Le mouvement est actif par défaut quand il ne change rien d'autre que l'apparence, et chaque composant animé peut le couper : prop `animated` (même nom partout, booléen ; `MazTable` garde `animatedRows` en alias), plus l'option globale `motion` de `MazUi`.
- Réglages fins par variables CSS (`--maz-motion-*`, `--maz-easing-*` surchargeables sur n'importe quel élément) plutôt que par de nouvelles props.
- Une nouvelle prop seulement quand un usage courant la demande : pas de prop par durée ou par courbe.
- Slots pour le contenu, classes et attributs transmis à l'élément racine, `data-state` (`open`, `closed`, `checked`...) sur les éléments animés pour que l'utilisateur puisse styler ses propres transitions.
- Les primitives utiles hors de la lib sont publiques (composables, `MazRollingText`, `vReveal`) et documentées.

### Page vitrine temporaire

- Une page de `apps/nuxt-app` (`src/pages/modernisation.vue`, retirée quand tout est livré) montre **tout** ce qui change ou arrive, de façon exhaustive : chaque composant touché, chaque animation, chaque nouvelle prop ou option, chaque nouveau composant, avec avant et après quand l'existant change (rayons, ombres, focus, dialog mobile...).
- Bascules en haut de page : clair/sombre, LTR/RTL, reduced motion, preset, `density`.
- Nuxt pour voir le rendu serveur : aucune erreur SSR, aucun avertissement d'hydratation (mismatch) dans la console, rien qui saute au chargement (état initial des animations, `vReveal`, textes qui roulent, origine des overlays capturée seulement côté client). La page rend aussi en `nuxt generate`.
- Chaque PR y ajoute ses éléments : une PR n'est pas terminée tant que ses changements n'y sont pas visibles. C'est là que le mainteneur valide.

### Documentation du site

- Parfaite, simple et facile à lire : le cas courant d'abord, des phrases courtes, pas de gros paragraphes. Une démo vaut mieux qu'une explication.
- Complète : chaque nouvelle prop, option, slot, événement et composable documenté, tableau d'API à jour, section « Mouvement » (ce qui bouge, comment le couper), cas RTL et reduced motion montrés quand ils comptent.
- Une démo qu'on manipule pour chaque mouvement (le voir vaut mieux que le décrire).
- Dépréciations (AOS, `outlined`/`pastel`, `border`, `variant` de Drawer...) : retirées de la doc. On ne documente que ce qui est conseillé, sans exemple ni note « ceci est déprécié » (la JSDoc s'en charge dans l'éditeur, la review dans le code). Seule exception : le guide de migration de la v6.
- Les tableaux d'API sont générés depuis le code (`tools/agent-docs/src/sources/components.ts`, vue-component-meta) et ne filtrent pas aujourd'hui les props dépréciées : le générateur doit masquer toute prop, tout événement et tout slot marqués `@deprecated`, sur le site comme dans `get_component_api` (les exports dépréciés le sont déjà, `sources/symbols.ts:77`). La review, elle, les connaît pour proposer l'alternative.
- Guide « Mouvement » (phase 0) à jour à chaque nouvelle primitive.
- Exemples en classes Tailwind simples, jamais le préfixe `maz:`.

### MCP, agent docs et review

- **Agent docs** : chaque nouveauté est trouvable par `search_docs` avec ses mots courants (« animer un dialog depuis le bouton », « chiffres qui roulent », « lightbox », « révéler au scroll »), alias ajoutés si besoin ; `get_component_api` renvoie l'API complète ; `pnpm -F agent-docs generate --bundle /tmp/x --strict` propre.
- **Règles des agents** (`tools/agent-docs/content/rules.md`) : la liste « ecosystem by need » gagne les nouvelles briques (`useOriginTransition`, `MazRollingText`, `vReveal`, `MazLightbox`, `MazMorphIcon`...), pour qu'un agent les utilise au lieu de réécrire une animation à la main.
- **`review_code`** (`packages/mcp/src/review`), une règle avec ses tests pour chaque usage devenu fautif :
  - durées et courbes en dur dans un composant ou un style (proposer les tokens) ;
  - `transition: all` ou `transition-all` ;
  - animation de `width`, `height`, `top`, `left` (proposer `transform`) ;
  - AOS (`data-maz-aos`, `useAos`) : proposer `vReveal` avec l'équivalent ;
  - `outlined` / `pastel` : proposer `variant` ;
  - compteur, texte qui roule, coche, lightbox, révélation au scroll ou tilt écrits à la main : proposer la brique maz-ui ;
  - animation sans reduced motion dans du code utilisateur qui utilise les primitives à la main.
- **Autres outils** à revoir quand la PR les touche :
  - `get_theme_tokens` : il montre les nouveaux tokens de mouvement et leurs valeurs par preset ;
  - `get_project_info` : il signale l'option `motion` et l'usage de l'AOS déprécié ;
  - `find_icons` : il signale les icônes qui ont une version morph ou dessinée.

### Plugins

- `plugins/maz-ui` (Claude Code et Codex) : README, hooks (ils lancent la review), skills et agents, descriptions de `plugin.json` et de `.claude-plugin/marketplace.json` mis à jour quand le MCP, les règles ou la review changent ; `pnpm -F agent-docs generate:plugin` relancé si `tools/agent-docs/content` change.
- Plugin OpenCode (`packages/mcp/src/opencode.ts`) : même mise à jour (son build recopie les skills et agents de `plugins/maz-ui`).
- Les autres CLI branchées par `npx @maz-ui/mcp init` (`packages/node`, `setupAgents`) : vérifier qu'elles reçoivent les nouvelles règles.

### Le reste

- Tokens seulement, aucune durée ni courbe en dur ; sortie plus courte que l'entrée ; aucune `transition: all`.
- Interruptible : ouvrir et fermer vite ne fait ni saut ni état bloqué.
- Tests unitaires en Gherkin, seuils de couverture verts (`CI=1 pnpm vitest run --coverage` dans `packages/maz-ui`).
- Vérification visuelle (captures) par un subagent.

## Principes du mouvement

- **Un langage, peu de motifs** : apparition depuis l'origine, texte et chiffres qui roulent, indicateur qui glisse, coche qui se dessine, mouvements de layout (FLIP), retour de pression, réaction au pointeur, révélation à l'entrée dans l'écran. Chaque composant pioche dans ces motifs, aucun n'invente le sien.
- **Rapide** : 100 à 250 ms pour l'UI, sortie à environ 70 % de l'entrée, jamais d'entrée depuis `scale(0)` (partir de 0.95 à 0.97).
- **Interruptible** : `transition` CSS plutôt que `@keyframes` pour les états ouvert/fermé.
- **Pas d'animation sur les actions clavier répétées** (flèches dans une liste, palette de commandes) ; effets de survol seulement sous `@media (hover: hover)`.
- **Plateforme d'abord, repli JS** : `@starting-style` + `transition-behavior: allow-discrete` + `linear()` (sûrs) ; View Transitions et anchor positioning en bonus, avec repli (Floating UI reste le moteur).

## Constat (audit du code)

Mouvement :

- Les tokens `motion-fast/normal/slow` et `easing-*` existent (`themes/src/types.ts:74`, ponts Tailwind dans `tailwindcss/theme-typography.css:23`) mais **aucun composant ne les utilise**. On compte 24 `cubic-bezier` différents, une quinzaine de durées et une vingtaine de `transition: all`.
- **Reduced motion trop large** : `css/animation.css:151` met `* { animation: none !important; transition: none !important }`, ce qui coupe aussi les animations de l'app hôte. Ailleurs, la gestion est éparse : `useReducedMotion` n'est utilisé nulle part, et le WAAPI de `vFullscreenImg`, `MazCardSpotlight`, l'AOS et le toast ne sont pas couverts.
- **Overlays datés** : le dialog entre depuis `scale(0.5)` et le popover depuis `scale(0.2)`. Aucune origine depuis le déclencheur : l'origine du popover dépend du côté du placement (`MazPopover.vue:705`), et le dialog ne connaît pas son déclencheur.
- **Indicateurs** : `MazTabsBar` et `MazSegmented` ont chacun leur pill glissante (durées différentes, `sleep(150)`). `MazRadioButtons` et `MazPagination` n'en ont pas.
- **Coches** : elles apparaissent en `scale`, elles ne se dessinent pas (Checkbox, RadioButtons, Stepper, BtnClipboard).
- **FLIP** : seulement dans `MazTable` (opt-in) et `MazDropzone`. Pas dans `MazInputTags`, la pile de toasts ni les options.
- **Texte qui roule** : seul l'en-tête du date picker le fait. `MazAnimatedCounter` interpole la valeur, ses chiffres ne roulent pas.
- **Pression** : aucun retour au clic.
- **Toast** : pas de pile en profondeur, pas de swipe, les voisins sautent quand un toast part, pas d'easing.
- **Code mort** : des classes globales sont inutilisées (`maz-scale`, `maz-slide`, `maz-expand`...), les keyframes `slide-*-blur` sont en double (AnimatedText / AnimatedElement), et une keyframe porte le nom générique `animate`.

Design et API :

- **Focus** : seuls MazBtn et MazSwitch lisent les tokens `focusRing`. Ailleurs, chaque composant a son outline, son ring ou un simple changement de fond. Les champs texte n'ont aucun ring, et Accordion, Stepper, Link et Dropzone n'ont aucun style de focus.
- **Style de remplissage éclaté** : `outlined` + `pastel` (booléens) sur Btn et Badge, `variant: soft | solid` sur Alert, `variant: soft | solid | outlined | ghost` sur BtnClipboard. « pastel » et « soft » désignent la même chose. `variant` sert aussi à une position (Drawer), à un layout (Sidebar)...
- **Arrondis** : 5 échelles différentes, et la map `ROUNDED_CLASS` copiée dans environ 14 fichiers. `sm` donne `rounded-xs` dans 12 composants, `rounded-sm` dans 2.
- **Nommage** : `bordered` ou `border` ; `items` ou `options` ; `side`, `variant` ou `position` ; `elevation` est un booléen sans niveaux.
- **Élévation** : Dialog et Drawer n'ont pas d'ombre en clair. Ailleurs, on empile `shadow-elevation drop-shadow-md` (la drop-shadow échappe au thème). En sombre, les ombres par défaut sont invisibles (noir 5-10 %), compensées par des `dark:border` composant par composant.
- **Pas de hiérarchie de rayons** : overlays et contrôles sont tous en `rounded-md`.
- **Densité** : un contrôle `md` fait 3rem (42 px), et les lignes de menu de `MazDropdown` sont des MazBtn complets (42 px).
- **Survol, désactivé, sombre** :
  - deux systèmes de survol (`bg-surface-600` en dur, ou `bg-foreground/5`) ;
  - le token `disabled-opacity` est ignoré par Btn et les champs ;
  - de nombreux `dark:` codés en dur, alors que la variante `dark:` ne suit que la classe `.dark` (avec `darkModeStrategy: 'media'`, ces surcharges ne s'appliquent pas).
- **Doublons** :
  - deux moteurs d'overlay (Backdrop et Popover) sans code commun, avec chacun son Échap et son sélecteur de focusables ;
  - trois rendus de ligne de menu (MazBtn, SelectListbox, MazListItem) ;
  - le roving tabindex copié dans TabsBar et Segmented.
- **Spotlight par défaut** : `MazAccordion` et `MazChecklist` enveloppent `MazCardSpotlight`, un effet décoratif devenu le conteneur par défaut.

## Bugs relevés (PR à part, en premier)

- [ ] `MazBackdrop` : les règles `backdrop-anim` sont imbriquées dans `[dir='rtl']` (`MazBackdrop.vue:534`), le fond n'est animé qu'en RTL.
- [ ] `MazTabsBar` : `setIndicatorAndScroll` sort tôt quand `autoScroll` est à `false` (`:448`), l'indicateur n'est jamais placé.
- [ ] `MazBackdrop` / `MazPopover` : Échap sur `keyup` (Backdrop) et sur `keydown` (Popover). Un Échap dans un popover dans un dialog ferme probablement les deux (à confirmer).
- [ ] `MazBackdrop` : Échap n'est pas « stack-aware » (ferme tous les backdrops ouverts), le focus trap cible le premier `.m-backdrop-content` du DOM (dialogs imbriqués), le sélecteur de focusables rate `<input>` sans `type`, range, color et file (`:204-205`).
- [ ] `MazDropdown` : Enter active peut-être deux fois l'élément (`@keypress.enter` + handler document, à vérifier), tous les items en `tabindex=0`, pas de Home/End ni de typeahead.
- [ ] `MazInputCode` : ids non uniques (`m-input-code-${item}`), `autocomplete="off"` au lieu de `one-time-code`, pas de rôle de groupe, `:disabled` sur une div.
- [ ] `MazAlert` : `role="alert"` toujours, une alerte statique est annoncée comme urgente (`status` par défaut, `alert` en option : comportement de lecteur d'écran seulement, pas d'API cassée).
- [ ] `MazDrawer` : titre en `<h4>` codé en dur.
- [ ] `vFullscreenImg` : instance partagée entre tous les éléments (voir sa section, corrigé par la refonte).
- [ ] `MazSlider` : le remplissage ne s'inverse pas en RTL (il part toujours de la gauche), relevé par les tests visuels. À corriger en PR 3 (formulaires), puis mettre à jour les captures RTL.

## Phase 0 : fondations

### Filet de sécurité

- [ ] Tests de régression visuelle (ROADMAP « Tests de régression visuelle ») : captures Playwright des démos de la doc, clair/sombre, LTR/RTL, avec reduced motion forcé pour des captures stables. Ils protègent tout le reste du plan.

### Tokens (`@maz-ui/themes`)

On garde les noms actuels et on complète (ajouts seulement) :

| Token | Défaut | Usage |
|---|---|---|
| `motion-instant` | 80ms | pression, survol, toggle |
| `motion-fast` | 150ms | tooltip, menu, switch, coche |
| `motion-normal` | 220ms | popover, dialog, drawer, indicateur |
| `motion-slow` | 320ms | layout (FLIP), bottom sheet, toast |
| `motion-slower` | 450ms | transitions larges, révélations, rares |
| `easing-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | entrées |
| `easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | sorties |
| `easing-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | déplacements à l'écran |
| `easing-spring` | `linear(...)` sans dépassement | indicateurs, sheets |
| `easing-bounce` | `linear(...)` avec léger dépassement | coche, retour de pression, badge |
| `motion-scale` | `1` | multiplicateur global des durées (`0` = pas de mouvement) |

- Les durées des composants valent `calc(var(--maz-motion-normal) * var(--maz-motion-scale))`, et la sortie `0.7 *` l'entrée.
- Ponts Tailwind : `duration-instant/fast/normal/slow/slower`, `ease-out/in/in-out/spring/bounce`.
- Chaque preset reçoit sa personnalité (macOS plus de ressort, windows plus sec). Corriger `mazUi` : `easing-out` = `easing-in-out` aujourd'hui (`mazUi.ts:30`).
- Les presets gardent leurs valeurs actuelles pour les tokens qui existent déjà (pas de changement de rythme surprise) ; les nouveaux tokens ont leur défaut.

### Reduced motion

- [ ] Retirer le `* { ... !important }` global (décidé) : il ne vise plus que les éléments de la lib (`--maz-motion-scale` réduit, motifs spatiaux en fondu). Une lib n'a pas à couper les animations de l'app.
- [ ] Option globale en plus (opt-in) pour qui veut que maz-ui coupe aussi les animations de toute la page sous reduced motion : `motion: { scope: 'page' }` (défaut `'lib'`).
- [ ] Option globale `motion: 'auto' | 'reduced' | 'full'` dans `MazUi` (et `mazUi.motion` côté Nuxt, `MazUiProvider`).
- [ ] `useReducedMotion` lit cette option + le media query ; tout le mouvement JS (WAAPI, rAF, compteurs, spotlight, AOS, lightbox) l'utilise.

### Primitives (internes, réutilisées partout ; certaines publiques)

- [ ] **`useOriginTransition`** (composable public) : capture le rect du déclencheur (élément, événement pointeur ou `{ x, y }`) et anime un élément depuis ce rect (FLIP via WAAPI : translate + scale + rayon), retour vers lui à la fermeture s'il est encore visible, sinon fondu + `scale(0.97)`. Base du motif « apparition depuis l'origine » (dialog, lightbox, menu contextuel, cartes qui s'agrandissent).
- [ ] **`useSlidingIndicator`** (composable) : une pill ou une ligne qui suit l'élément actif (translate + largeur, étirement optionnel en route), `ResizeObserver`, pas d'animation au premier placement, RTL, reduced motion.
- [ ] **`useRovingFocus`** (composable) : flèches (selon la direction), Home/End, typeahead.
- [ ] **`MazRollingText`** (composant public) : un texte ou un nombre dont seuls les caractères qui changent roulent. `Intl.NumberFormat` pour les nombres, largeur réservée (pas de CLS), valeur finale seule annoncée.
- [ ] **Tracé dessiné** : un mode `draw` sur les icônes en traits (`stroke-dashoffset`), pour la coche, la croix, le tiret indéterminé.
- [ ] **`MazMorphIcon`** (voir catalogue) : deux icônes dont les traits passent de l'une à l'autre. Primitive interne d'abord (Accordion, InputSecret, SidebarTrigger...), publique ensuite.
- [ ] **Classes de liste FLIP** globales (`maz-list-enter/leave/move`) pour `TransitionGroup`.
- [ ] **Retour de pression** : utilitaire `maz-press` (`scale(0.97)` en `motion-instant`, retour en `easing-bounce`).
- [ ] **Bordure qui se dessine** : utilitaire `maz-border-draw` (un trait SVG ou un `conic-gradient` masqué qui suit le contour depuis le point d'entrée du pointeur), utilisé en option par MazCard, MazContainer, MazCardSpotlight, MazRadioButtons (carte choisie), MazInput (focus) et d'autres.
- [ ] **Entrées en `@starting-style`** pour les éléments qui apparaissent (toast, item ajouté, badge), sans hook JS.
- [ ] **`vReveal`** : le nouveau système de révélation qui remplace l'AOS (voir sa section).
- [ ] Nettoyer `css/animation.css` : dédoublonner les keyframes, renommer `animate` (en gardant l'ancien nom tant qu'il peut être utilisé), déprécier sans les retirer les classes globales inutilisées par la lib.

### Docs

- [ ] Page de guide « Mouvement » : les motifs, les tokens, l'option `motion`, reduced motion, comment animer un composant à soi avec les mêmes primitives.
- [ ] Section « Mouvement » dans la page de chaque composant animé (ce qui bouge, comment le couper).

## Réutilisation entre composants

Les nouveaux composants et primitives remplacent du code existant. Chaque PR qui en livre un fait aussi la bascule des composants listés ici (ou ouvre la PR qui la fait).

| Brique | Remplace ou sert dans |
|---|---|
| `MazRollingText` | en-tête de MazDatePicker (les `maz-slidev*` actuels), MazAnimatedCounter (mode `roll`), MazBtnClipboard (« Copié »), MazBtn (label de chargement), MazBadge (compteur), MazPagination, MazInputNumber, MazProgressBar (pourcentage), MazCarousel (compteur), MazRating (libellé), MazRelativeTime, MazStatCard |
| `MazMorphIcon` | MazInputSecret (œil vers œil barré), MazAccordion (plus vers moins), MazSidebarTrigger (menu vers croix), MazBtnClipboard (copier vers coche), MazThemeToggle (soleil vers lune), chevrons de Select, Dropdown, Card, ListItem (rotation devenue morph si utile), MazBtnScroll |
| Tracé dessiné (coche) | MazCheckbox, MazRadioButtons, MazStepper, MazBtn (succès), toasts, MazAlert (icône), MazProgressBar et MazCircularProgressBar (100 %), MazInput (valide), MazSpinner (`done`), MazInlineEdit |
| `useSlidingIndicator` | MazTabsBar, MazSegmented (leurs deux copies), MazRadioButtons, MazPagination, MazBtnGroup, MazSidebar (item actif), highlight de MazDropdown, MazSelect, MazCommandPalette, pastille du jour de MazDatePicker |
| `useRovingFocus` | MazTabsBar, MazSegmented (leurs deux copies), MazRadioButtons, MazDropdown, MazBtnGroup, MazPagination, MazRating, MazContextMenu, MazMenubar |
| `useOriginTransition` | MazDialog, MazDialogConfirm, `useDialog`, la lightbox (refonte de vFullscreenImg, à la place de son WAAPI fait main), MazContextMenu, MazCommandPalette, MazGallery |
| MazListItem (ligne de menu unique) | lignes de MazDropdown (aujourd'hui des MazBtn), options de MazSelect (SelectListbox), MazContextMenu, MazCommandPalette |
| MazKbd | raccourcis dans MazTooltip et vTooltip, items de MazDropdown et MazContextMenu, MazCommandPalette |
| MazEmptyState | MazTable (pas de données), MazSelect et MazInputAutocomplete (aucun résultat), MazCommandPalette, MazChecklist (recherche vide), MazList |
| MazScrollArea | liste de MazSelect, MazDialog `scrollable`, MazSidebar, MazDropdown long |
| MazProgressiveBlur | bords de MazDialog `scrollable`, MazBottomSheet, MazTable (en-tête collant) |
| `vReveal` | MazAnimatedElement et MazAnimatedText (leurs keyframes en double), MazTimeline (`animated`), MazCircularProgressBar (son IntersectionObserver), MazAnimatedCounter (démarrage à l'entrée) |
| Observer partagé (`useIntersectionObserver`) | un seul `IntersectionObserver` pour vReveal, MazLazyImg, MazCircularProgressBar, MazAnimatedCounter, MazCardSpotlight |
| MazTimePicker (si retenu) | partie heure de MazDatePicker |
| Lightbox (refonte vFullscreenImg) | MazGallery (ouverture plein écran), vZoomImg (à fusionner ou à garder ?) |

## Phase 1 : apparition depuis l'origine (overlays)

- [ ] **MazPopover** (donc Dropdown, BtnDropdown, Select, Autocomplete, DatePicker, ColorPicker, vTooltip) : l'origine du transform est calculée depuis le centre du déclencheur projeté sur le bord de l'overlay, et pas seulement depuis le côté. Entrée en fondu + `scale(0.96)` (`motion-fast`, `easing-out`), sortie en `0.7 *`. La variable `--maz-popover-transform-origin` est exposée (comme Radix). Les noms de transition actuels (`scale-pop`, `scale-fade`) restent acceptés.
- [ ] **MazDialog / MazDialogConfirm / `useDialog`** : il grandit depuis le bouton qui l'a ouvert et y retourne.
  - API (ajouts) : slot `#trigger` (le cas courant), prop `origin` (élément, sélecteur, événement ou `{ x, y }`), `useDialog().open({ origin: event })`.
  - Sans origine explicite : dernier `pointerdown` capturé par un listener partagé, sinon fondu + scale.
  - `animated: false` ou `motion: 'reduced'` : fondu simple.
- [ ] **MazDialog sur mobile** (décidé) : il ne s'affiche plus collé en bas de l'écran. Aujourd'hui `align="none"` (le défaut de MazBackdrop) donne `items-end` sous `tab-s`, avec une largeur pleine (`min-w-full`) : un faux bottom sheet, sans le glisser pour fermer. Nouveau défaut : centré, avec une marge sur les côtés et `max-h` sur la hauteur visible (`dvh`), arrondi complet. `align="end"` garde l'ancien rendu pour qui le veut ; le vrai bottom sheet, c'est MazBottomSheet (la doc le dit). Vérifier au passage `touch-none` sur `.m-dialog` (`MazDialog.vue:144`) : il risque de bloquer le défilement tactile du contenu.
- [ ] **MazDrawer / MazBottomSheet** (façon Vaul) : vitesse du geste au relâchement, points d'arrêt (moitié, plein), fermeture au lancer, drag ignoré dans un contenu qui défile, option `scale-background` (la page recule, coins arrondis).
- [ ] **Toast** (façon Sonner) :
  - pile en profondeur par défaut (décidé), dépliée au survol ou au focus ; option `stacked: false` pour garder la liste actuelle ;
  - swipe pour fermer (dans le sens de la position, RTL compris) ;
  - voisins en FLIP ;
  - toast « promise » (chargement, puis succès ou erreur avec une icône qui se dessine) ;
  - temps restant sur une ligne fine, pause quand l'onglet est caché ;
  - région `aria-live` correcte (polite, assertive pour les erreurs).
- [ ] **vTooltip** : délai groupé (pas de second délai d'un bouton à l'autre). Mode `group` en option : une seule bulle qui glisse d'un déclencheur à l'autre.
- [ ] **MazBackdrop** : fondu sur le token, `backdrop-filter` optionnel (verre du thème) ; un seul gestionnaire d'Échap partagé avec Popover, empilé (le dernier ouvert ferme seul).
- [ ] Plus tard : View Transitions en voie rapide là où elles existent, `popover` natif (top layer) quand le socle Reka de la ROADMAP sera tranché.

## Refontes

### vFullscreenImg : refonte en lightbox

Il est mal fait et ne marche pas correctement. Problèmes relevés :

- **Instance partagée** : `fullscreen-img.directive.ts:5` garde une seule variable `instance` pour tout le module. Chaque `mounted` l'écrase, donc `updated` et `unmounted` agissent sur le dernier élément monté : les options des autres images sont fausses et leurs listeners ne sont jamais retirés (fuite).
- **Pas un vrai dialog** : l'overlay est une `div role="button" tabindex="0"`, sans `role="dialog"` ni `aria-modal`, sans focus trap ni retour du focus ; `@keypress.esc` en plus d'un listener clavier.
- **Inaccessible au clavier** : l'image d'origine ne s'ouvre qu'au clic (pas focusable, pas d'Enter) ; les boutons précédent, suivant et fermer n'ont pas de nom accessible.
- **Galerie globale** : précédent et suivant parcourent toutes les images de la page (`querySelectorAll('.m-fullscreen-img-instance')`), sans notion de groupe.
- **Direction** : la flèche droite fait toujours « suivant », même en RTL ; le bouton précédent est en `left-0` (pas logique).
- **Style et mouvement** : curseur `move` au lieu de `zoom-in`, `transition: all` et styles en ligne posés sur l'image de l'utilisateur, WAAPI fait main sans reduced motion, survol à la souris seulement.
- **Manques** : pas de swipe sur tactile, pas de pinch ou de zoom progressif, pas de légende ni de compteur, pas de préchargement des voisines, `mouseenter` au lieu des événements pointeur.

Refonte (même directive, mêmes options, ajouts seulement) :

- [ ] Un composant `MazLightbox` (chargé en import dynamique au premier clic), utilisable seul (v-model, liste d'images) et par la directive et MazGallery.
- [ ] Base `MazBackdrop` (vrai dialog, focus trap, Échap empilé, focus restauré) et `useOriginTransition` (l'image grandit depuis sa vignette et y retourne, en suivant la vignette si la page a défilé).
- [ ] Une instance de handler par élément (`WeakMap`), listeners retirés proprement.
- [ ] Groupes : option `group` (nom), par défaut les images d'un même conteneur ; compteur « 3 / 12 », légende (`alt` ou option `caption`).
- [ ] Clavier : la vignette devient focusable et s'ouvre à Enter ou Espace ; flèches selon la direction, Home/End.
- [ ] Tactile : swipe entre images, glisser vers le bas pour fermer, pinch pour zoomer ; zoom au clic centré sur le point cliqué.
- [ ] Préchargement de l'image suivante et de la précédente ; `srcset` / image haute définition en option (`src` de la vignette, `fullSrc` pour le plein écran).
- [ ] Les options visuelles actuelles (`scaleOnHover`, `blurOnHover`) passent par des classes, plus par des styles en ligne.
- [ ] Décider du sort de `vZoomImg` (doublon partiel) : le garder tel quel, ou en faire un mode de la lightbox avec un alias.

### AOS : nouveau système `vReveal`

L'AOS (`plugins/aos.ts`, attributs `data-maz-aos`) est l'un des plus vieux morceaux de la lib : SCSS qui génère 30 animations et des délais par pas de 50 ms, un observer pour tout, pas de reduced motion, contenu caché tant que le JS n'a pas tourné (LCP), animations datées (`flip`, `zoom`).

Décision proposée : un nouveau système sous un nouveau nom, l'AOS est déprécié (doc, JSDoc, règle de review qui propose la migration) mais continue de marcher à l'identique jusqu'à la v6.

- [ ] **API** :
  - directive `v-reveal` (`v-reveal="'slide-up'"` ou un objet d'options) ;
  - composant `MazReveal` pour envelopper un bloc ;
  - `useReveal({ selector })` pour du HTML qu'on ne contrôle pas (markdown, CMS) ;
  - attribut `data-maz-reveal` pour le HTML statique.
- [ ] **Effets** (peu, mais beaux) :
  - `fade`, `slide-up/down/start/end` (logiques, donc RTL), `blur`, `scale` ;
  - révélations horizontales et verticales par `clip-path` : rideau depuis le haut, le bas, le début, la fin ; iris ;
  - `lines` (les lignes d'un texte montent depuis un masque) et `words` (mots en cascade, l'actuel MazAnimatedText) ;
  - image qui se pose (léger zoom arrière pendant le rideau).
- [ ] **Cascade automatique** : les éléments qui entrent ensemble se suivent (`--i` posé par le système, `sibling-index()` en bonus), plafonnée.
- [ ] **Mode lié au scroll** : `scroll` (progression avec `animation-timeline: view()`, repli sur une révélation simple).
- [ ] **Perf et accessibilité** :
  - CSS seulement, un seul `IntersectionObserver` partagé, aucune dépendance ;
  - rien n'est caché sans JS ni avant l'hydratation (état initial posé seulement quand le système est prêt : classe sur `<html>`), jamais d'effet sur l'élément du LCP ;
  - `once` par défaut, `repeat` en option ;
  - reduced motion : fondu court ou rien ;
  - re-scan après navigation (`router.afterEach`) comme l'AOS.
- [ ] **Bascule** : MazAnimatedElement, MazAnimatedText, MazTimeline et les compteurs utilisent `vReveal` (mêmes props).
- [ ] **Migration** : un tableau dans la doc (chaque `data-maz-aos` vers son équivalent) et la règle de review.

### MazDatePicker

Un des plus vieux composants, il doit profiter de tout le reste. Même API, ajouts seulement.

- [ ] **Mouvement** :
  - ouverture depuis l'origine (Popover) ;
  - mois qui glissent dans le sens de navigation (plus court qu'aujourd'hui, `motion-normal`) ;
  - nom du mois et année en `MazRollingText` (à la place des `maz-slidev*`) ;
  - la pastille du jour choisi voyage jusqu'au nouveau jour (`useSlidingIndicator`) ;
  - en plage, la bande suit le pointeur du début à la fin, avec le nombre de jours qui roule.
- [ ] **Clavier** : grille ARIA (pattern APG « date picker dialog ») avec `useRovingFocus` (flèches selon la direction, Page Up/Down pour les mois, Home/End pour la semaine).
- [ ] **Design** : alignement sur les nouveaux tokens (rayons, élévation, focus ring, densité des cellules), raccourcis de plage en chips, en-tête plus sobre.
- [ ] **Heure** : la partie heure passe par MazTimePicker s'il est retenu (roue ou créneaux).
- [ ] **Code** : relecture des sous-composants (CalendarDays, MonthSwitcher, YearSwitcher, Time...) pour réutiliser les primitives au lieu de leur code maison ; mesure de la taille avant et après (dayjs reste).

### Familles à clarifier

- **Choix et bascule** : MazBtnGroup (des boutons d'action collés, sans état), MazSegmented (un choix parmi N, `radiogroup`), MazRadioButtons (un choix parmi N en tuiles de formulaire), MazToggleGroup (0 à N bascules on/off). Proposition :
  - pas de nouveau composant MazToggleGroup : MazSegmented prend `multiple` (v-model en tableau, boutons `aria-pressed` dans un `role="group"`) ;
  - MazRadioButtons prend une variante `cards` (ce que serait MazChoiceCards) et MazChecklist aussi pour le choix multiple ;
  - MazBtnGroup est amélioré : vrai aspect collé (bordures partagées, un seul arrondi aux extrémités, séparateurs), mêmes tailles que MazBtn, `role="group"` ou `toolbar` avec `useRovingFocus`, état actif optionnel avec indicateur glissant, `variant` unifiée.
- **Menus** : une seule ligne de menu (MazListItem) pour Dropdown, Select, ContextMenu et CommandPalette (voir « Réutilisation »).

## Phase 2 : animer et polir les composants existants

Chaque ligne combine le mouvement et le design. Les motifs renvoient aux primitives de la phase 0. MazDatePicker, vFullscreenImg et l'AOS ont leur section dans « Refontes ».

| Composant | Mouvement | Design, cohérence |
|---|---|---|
| MazBtn | pression ; `loading` puis `success` : le label roule, le spinner se referme en coche dessinée, largeur stable ; prop `hold` (tenir pour confirmer, remplissage qui se vide si on lâche) | `variant` unifiée (alias), focus ring, `disabled-opacity` |
| MazBtnClipboard | l'icône passe à la coche (morph), le label roule vers « Copié » | `variant` alignée sur MazBtn |
| MazBtnGroup | indicateur glissant sur l'élément actif (option) | voir « Familles à clarifier » |
| MazBtnDropdown | via Popover ; le label roule quand on change l'action principale | |
| MazDialog / MazDialogConfirm | depuis l'origine ; confirmation renforcée en option (« tapez le nom pour supprimer ») | ombre par mode, rayon d'overlay plus grand |
| MazDrawer / MazBottomSheet | façon Vaul (phase 1) | ombre, titre sémantique |
| MazPopover / MazDropdown | depuis l'origine ; highlight glissant entre les items (pas d'animation au clavier) | lignes de menu compactes (MazListItem), roving focus |
| MazSelect / MazInputAutocomplete | liste qui se déroule depuis le champ, highlight glissant, la valeur affichée roule au choix, lettres trouvées soulignées | ligne d'option partagée, MazEmptyState pour « aucun résultat » |
| MazInput / MazTextarea | coche dessinée quand le champ est valide, bouton effacer qui apparaît, le message d'aide cède la place à l'erreur (roulement) ; Textarea : hauteur qui suit le texte (`field-sizing` + repli), anneau du compteur qui se remplit près de la limite | focus ring sur les champs, option globale pour le label du haut par défaut, états `error/success/warning` typés partout |
| MazInputSecret | œil vers œil barré (MazMorphIcon), option `strength` : jauge qui se remplit, verdict qui roule, règles qui se cochent | |
| MazInputNumber | les chiffres qui changent roulent, accélération quand on garde le bouton appuyé, bouton grisé à la limite | |
| MazInputCode | les chiffres montent en place, les cellules se remplissent à la fin, secousse en cas d'erreur | corrections a11y (bugs) |
| MazInputTags | ajout en `@starting-style`, suppression qui rétrécit et voisins en FLIP, un doublon fait secouer son jumeau | |
| MazCheckbox / MazChecklist | coche dessinée, encre qui grandit depuis le centre, tiret pour l'indéterminé, liste filtrée en FLIP | halo de survol distinct du focus ring ; variante `cards` pour MazChecklist |
| MazRadio / MazRadioButtons | le point voyage d'une option à l'autre dans un groupe, pill glissante pour RadioButtons | variante `cards` (bordure qui se dessine sur la carte choisie) |
| MazSwitch | le pouce s'étire à l'appui et rebondit en place | focus ring 2 px |
| MazSlider | bulle de valeur qui sort du pouce, graduations qui foncent au passage | |
| MazSegmented / MazTabsBar | `useSlidingIndicator` (étirement en route) | même durée, même pill ; `multiple` pour Segmented |
| MazTabsContentItem | contenu qui arrive du côté de l'onglet (passer de 500 ms et 100 % à `motion-normal` et un décalage court) | |
| MazPagination | pill glissante vers la page, les numéros qui changent roulent, nombre de cases fixe | |
| MazStepper | la ligne se remplit, coche dessinée par étape, contenu qui arrive dans le sens de navigation | focus |
| MazAccordion | plus vers moins (morph), réponse qui monte en s'ouvrant | MazCardSpotlight gardé (pas de régression) mais derrière une prop, focus |
| MazCard / MazContainer / MazCardSpotlight | survol : image qui se rapproche, flèche qui glisse ; option `border-draw` (bordure qui se dessine depuis le point d'entrée) | `elevation` en niveaux (le booléen reste), ombre par mode |
| MazAvatar | groupe qui s'écarte à l'approche, visage pointé qui avance | |
| MazBadge | compteur qui roule, suppression en FLIP | `variant` unifiée (alias) |
| MazAlert | icône qui se dessine, se replie à la fermeture | `role` correct, `variant` unifiée |
| MazSkeleton | un seul reflet sur tous les os, puis une bordure douce balaie et révèle le contenu | |
| MazLazyImg / MazGallery | fondu et passage du flou au net à la place du spinner ; MazGallery ouvre la lightbox | |
| MazProgressBar / MazCircularProgressBar | pourcentage qui roule, segment indéterminé, coche à 100 % | |
| MazSpinner | variantes (anneau qui respire, barres, points), état `done` : coche dessinée | |
| MazLoadingBar | avance par paliers qui ralentissent, va au bout puis sort par la fin | |
| MazTable | tri en FLIP (existe, opt-in), bande douce sur la colonne triée, en-tête collant ; MazEmptyState | survol et sombre par tokens |
| MazCarousel | compteur qui roule, barre de progression, drag souris | |
| MazSidebar | pill glissante sur l'item actif, label qui se replie en mode icône ; trigger en morph | |
| MazListItem | survol par tokens, chevron | devient la ligne de menu unique |
| MazTimeline | rail qui se remplit au scroll (`vReveal` mode `scroll`) | |
| MazAnimatedCounter / Text / Element | basés sur `MazRollingText` et `vReveal` | keyframes dédoublonnées |
| MazTicker | ralentit doucement jusqu'à l'arrêt au survol (au lieu d'un arrêt sec) | |
| MazCardSpotlight | tactile, reduced motion, listener local plutôt que sur `window`, observer partagé | |
| MazReadMore | hauteur animée (grid 0fr/1fr) avec fondu en bas | |
| MazDropzone | bordure qui défile quand un fichier survole, progression qui roule par fichier | |
| MazColorPicker | les poignées glissent vers un preset choisi | |
| MazFullscreenLoader | entrée et sortie en fondu | |
| MazBtnScroll | la flèche décolle au clic (morph ou tracé) | |

## Phase 3 : design et cohérence (sans casser)

- [ ] **Focus** : un utilitaire `maz-focus-ring` (tokens `focusRing`, 2 px, offset) appliqué à tous les éléments interactifs, champs texte compris. N'apparaît qu'au clavier (`:focus-visible`) : rien ne change pour la souris.
- [ ] **Style de remplissage** : `variant: 'solid' | 'soft' | 'outline' | 'ghost'` sur Btn, Badge, BtnGroup, BtnDropdown, Alert, BtnClipboard. `outlined` et `pastel` restent des alias, dépréciés dans la doc et la JSDoc (règle de review qui propose `variant`). C'est l'« API de variants déclarative » de la ROADMAP : la faire à ce moment-là.
- [ ] **Arrondis** : une seule échelle `rounded` (none..3xl, full) et un helper partagé à la place des 14 maps ; les anciennes valeurs donnent le même rendu.
- [ ] **Hiérarchie des rayons** : contrôles en `md`, cartes en `lg`, overlays en `xl` (dérivés du ratio du preset). Changement visuel sans effet sur la mise en page : à valider sur les captures.
- [ ] **Élévation** :
  - `elevation` en niveaux (`0..3`, le booléen reste et vaut le niveau actuel) ;
  - ombres par mode dans les presets (plus profondes en sombre, ou surface plus claire) ;
  - supprimer le doublé `drop-shadow-md` ;
  - une ombre pour Dialog et Drawer ;
  - moins de `dark:border` ajoutés à la main.
- [ ] **Survol, désactivé, sombre** :
  - un seul système de survol (calcul OKLCh comme MazBtn, ou `foreground/5`) ;
  - `disabled-opacity` partout ;
  - les couleurs sombres viennent des tokens (`light-dark()`), plus des `dark:` en dur (cela corrige aussi `darkModeStrategy: 'media'`).
- [ ] **Densité** (décidé) : tokens `--maz-control-height-*` et option `density: 'default' | 'compact'`, globale (`MazUi`, `mazUi.density` côté Nuxt) et par preset.
  - `compact` : `md` vers 36 px (et toute l'échelle `mini..xl` en proportion), paddings et lignes de menu plus serrés, pour Btn, Input et tous les champs, Select, Segmented, TabsBar, BtnGroup, Pagination, InputCode, Dropdown, ListItem...
  - `default` garde exactement les hauteurs actuelles.
  - Doc : section dédiée dans le guide des thèmes (ce qui change, avant/après, comment l'activer), mention sur chaque page de composant concerné, démo sur la page vitrine (nuxt-app).
  - Commentaire `Removed in v6 (plans/ROADMAP.md)` sur le défaut (`compact` devient le défaut en v6), et entrée dans la section v6 de la ROADMAP.
- [ ] **Labels** (décidé) : option globale (le défaut de `topLabel` pour toute l'app), le défaut actuel ne change pas. Le label flottant reste un vrai choix, il marche bien dans beaucoup de cas : on le soigne aussi (animation sur les tokens, position juste en `compact`, RTL).
- [ ] **Structure des champs** (sans breaking) : aujourd'hui chaque champ refait son label, son aide, ses états et ses bordures (Input, Textarea, InputTags qui a perdu le label flottant, InputCode qui ne réutilise pas MazInput, MarkdownEditor avec 8 blocs de couleur copiés). Une base commune interne (wrapper, label flottant ou du haut, aide et erreur qui roulent, états `error/success/warning`, focus ring, densité) utilisée par Input, Textarea, InputTags, InputCode, Select, Autocomplete, DatePicker, InputPhoneNumber, InputPrice, InputNumber, InputSecret, MarkdownEditor. Même DOM accessible, mêmes classes publiques, mêmes props.
- [ ] **Couleur neutre** : branche `feat/neutral-color` en cours. Vérifier qu'elle expose `bg-neutral` en couleur Tailwind et l'étend à tous les composants colorés.
- [ ] **Nommage** (ajouts et alias, rien de retiré) :
  - `bordered` partout (`border` reste) ;
  - `options` ou `items` (en choisir un, l'autre reste) ;
  - Drawer : `side` (`start | end | top | bottom`), comme MazSidebar ; `variant` reste en alias (aujourd'hui `variant` donne le côté, alors que partout ailleurs `variant` veut dire le style) ;
  - un seul jeu de valeurs pour `size`.
- [ ] **Overlays** : un seul module partagé entre Backdrop et Popover (Échap empilé, focusables, focus trap, retour du focus).
- [ ] **Coins** : `corner-shape: squircle` en bonus (presets macOS), ignoré sans casse ailleurs.

## Phase 4 : nouveaux composants

Après tri dans [modernisation-composants.md](./modernisation-composants.md), chacun dans sa PR, avec les primitives de la phase 0, et la bascule des composants qui peuvent l'utiliser (voir « Réutilisation »).

## Homepage de la doc

La homepage (`apps/docs/components/HomePage.vue` et `home/`) est la vitrine : elle montre les nouveautés les plus importantes, en démos réelles des composants, pas en vidéos.

- [ ] Section dédiée (dans `HomeAtelier` ou une nouvelle section « Mouvement ») avec des démos qu'on manipule :
  - un bouton qui ouvre un dialog depuis lui-même ;
  - une pile de toasts (promise, swipe) ;
  - un prix mensuel/annuel qui roule (Segmented + MazRollingText) ;
  - checkbox, switch et coche dessinée ; tabs et pagination avec la pill ;
  - une lightbox depuis une vignette ;
  - `vReveal` sur les sections de la page elle-même.
- [ ] Interrupteur « reduced motion » et LTR/RTL sur la démo, pour montrer que tout suit.
- [ ] Les animations faites à la main sur la homepage passent sur les nouvelles briques, qui y font leurs preuves :

  | Aujourd'hui (fait main) | Remplacé par |
  |---|---|
  | `hero/HeroFloating.vue` : scène inclinée en 3D qui suit la souris (`--hero-rx/ry` calculés dans une boucle rAF, `perspective`) | `vTilt` (option `global` pour suivre le pointeur sur toute la page, amortissement, reduced motion). La boucle actuelle tourne sans arrêt, même hors de l'écran : `vTilt` ne tourne que pendant le mouvement et à l'écran |
  | `hero-float` (flottement des cartes en `translateZ`) | effet `float` de `vTilt` ou utilitaire CSS sur les tokens |
  | `home-reveal` (`animation-timeline: view()`, sections qui montent à l'entrée) | `vReveal` mode `scroll` |
  | `home-recede` (le chapitre qui recule et s'efface quand on le quitte) | `vReveal` mode `scroll` avec un effet de sortie (`exit`), à prévoir dans son API |
  | `MazAnimatedElement`, `MazAnimatedText`, `MazAnimatedCounter` des sections | mêmes composants, basés sur `vReveal` et `MazRollingText` |
  | lien en focus avec son outline à la main (`.home a:focus-visible`) | `maz-focus-ring` |
  | `home-twinkle` et durées de `--home-ease` | tokens de mouvement |

  Les scènes canvas (`HeroConstellation`, `HeroMagnetic`, `useCanvasScene`) restent propres à la doc : ce sont des fonds de site, hors du périmètre de la lib. Elles gagnent la pause hors de l'écran et le reduced motion si ce n'est pas déjà le cas partout.
- [ ] Les sections existantes passent de `MazAnimatedElement` et de l'AOS à `vReveal`.
- [ ] Contraintes : la page garde son découpage actuel (`hydrateOnVisible`, imports dynamiques), le hero (`hero/`, canvas) ne bloque pas le LCP et se met en pause hors de l'écran, Lighthouse mobile mesuré avant et après (aucun recul de LCP, CLS, INP).
- [ ] Mise à jour au fil des PRs : chaque grosse nouveauté y gagne sa démo.

## Découpage en PRs

Cinq PRs, **l'une après l'autre** : chacune part de la précédente une fois mergée (pas en parallèle, elles touchent les mêmes composants). Chaque PR est organisée en commits par sujet, pour être lue par morceaux, et validée une fois sur la page vitrine.

Tout ce qui est transverse (tokens, primitives, focus ring, helper d'arrondis, élévation, `variant`, structure des overlays) est dans la PR 1 : les suivantes ne font que l'appliquer à leurs composants, sans revenir sur les mêmes fichiers.

1. **Fondations** : bugs relevés ; tests de régression visuelle ; page vitrine (nuxt-app) ; tokens de mouvement, reduced motion, option `motion` ; primitives (`useSlidingIndicator`, `useRovingFocus`, classes FLIP, `maz-press`, tracé dessiné, `maz-border-draw`, `maz-focus-ring`, `MazRollingText`, `MazMorphIcon`, `useOriginTransition`) ; helper d'arrondis, niveaux d'élévation et ombres par mode des presets ; `variant` et alias (avec `@deprecated`) ; module commun Backdrop/Popover (Échap empilé, focus trap) ; masquage des `@deprecated` dans les tableaux d'API.
2. **Overlays** : Popover et toute sa famille depuis l'origine, Dialog depuis l'origine et centré sur mobile, toasts empilés, Drawer/BottomSheet façon Vaul, tooltip groupé, lightbox (refonte de vFullscreenImg) et MazGallery.
3. **Formulaires** : structure commune des champs, option `density` (tokens, option, application aux contrôles : une option sans effet n'a pas de sens entre deux releases) et option du label, tous les champs animés (Checkbox, Radio, RadioButtons `cards`, Switch, Slider, InputTags, InputCode, InputNumber, InputSecret `strength`, Input/Textarea, Select, Autocomplete), MazDatePicker.
4. **Tout le reste** : navigation et choix (TabsBar, Segmented `multiple`, BtnGroup, Pagination, Stepper, Sidebar, Dropdown), feedback (Btn, BtnClipboard, Alert, Badge, Progress, Spinner, LoadingBar, Skeleton, LazyImg), affichage (Card, Container, CardSpotlight, Avatar, Accordion, Table, Carousel, Timeline, ReadMore, Dropzone, Ticker), `vReveal` et dépréciation de l'AOS (avec le nettoyage de `animation.css` : keyframes en double de MazAnimatedText et MazAnimatedElement, `animate` de MazCircularProgressBar, classes globales inutilisées), homepage de la doc.
5. **Nouveaux composants** retenus dans le catalogue (une PR, ou deux lots si elle devient trop grosse), avec la bascule des composants qui les utilisent.

Docs, agent docs, review, plugins et page vitrine sont dans chaque PR, jamais dans une PR à part.

## Décisions

- **Reduced motion global** : la règle qui coupait les animations de toute la page est retirée, la lib ne coupe plus que les siennes. Option opt-in `motion: { scope: 'page' }` pour l'ancien comportement.
- **Nouvelles animations** : toutes actives par défaut (dialog depuis l'origine, popover, toasts empilés...), désactivables par `animated` et l'option `motion`.
- **MazDialog sur mobile** : centré, plus collé en bas (voir phase 1).
- **Rayons, ombres et tout le reste** : validés par le mainteneur sur la page vitrine temporaire de nuxt-app (voir « Page vitrine temporaire »), pas sur captures.

## Points à trancher

- **Densité** (décidé) : opt-in `density: 'compact'` en 5.x, défaut en v6 (voir phase 3).
- **Label du haut** (décidé) : option globale en 5.x, le label flottant reste le défaut (voir phase 3).
- **Retrait des alias** (`outlined`/`pastel` de Btn, Badge, BtnGroup, BtnDropdown ; `border` de Input, Textarea, Autocomplete ; `variant` de Drawer) : les retirer casse le code qui les utilise (erreur TypeScript, et à l'exécution la prop devient un simple attribut HTML : le style disparaît sans erreur). On les garde toute la v5, la doc ne montre que la nouvelle API, la review propose la migration ; retrait en v6 avec un codemod dans `@maz-ui/upgrade`.
