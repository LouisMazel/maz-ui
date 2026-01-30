<!-- eslint-disable -->

# Maz-UI - Idées de nouvelles fonctionnalités

> Document généré le 21 janvier 2026

## Table des matières

- [Packages Écosystème](#packages-écosystème)
- [Composants Prioritaires](#composants-prioritaires)

---

## Packages Écosystème

### @maz-ui/forms

**Objectif** : Générateur de formulaires dynamiques basé sur un schéma JSON/Valibot.

**Pourquoi** : PrimeVue et Vuetify n'ont pas ça nativement. Maz-UI a déjà Valibot intégré, c'est un avantage compétitif.

**Fonctionnalités envisagées** :

- Génération de formulaires à partir d'un schéma JSON ou Valibot
- Validation automatique basée sur le schéma
- Support de tous les composants de formulaire maz-ui
- Layouts configurables (vertical, horizontal, grid)
- Gestion des dépendances entre champs (afficher/masquer conditionnellement)
- Support des formulaires multi-étapes (wizard)

## Composants Prioritaires

### 2. MazColorPicker

**Objectif** : Permettre la sélection de couleurs avec différents formats (HEX, RGB, HSL).

#### Props

```typescript
interface MazColorPickerProps {
  /** Valeur de la couleur (v-model) */
  modelValue?: string
  /** Format de sortie */
  format?: 'hex' | 'rgb' | 'hsl' | 'hsv'
  /** Afficher le champ input */
  showInput?: boolean
  /** Afficher les presets de couleurs */
  showPresets?: boolean
  /** Couleurs preset personnalisées */
  presets?: string[]
  /** Afficher le canal alpha (transparence) */
  alpha?: boolean
  /** Désactivé */
  disabled?: boolean
  /** Taille du picker */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Label */
  label?: string
  /** Hint/description */
  hint?: string
  /** État d'erreur */
  error?: boolean
}
```

#### Utilisation

```vue
<!-- Simple -->
<MazColorPicker v-model="color" />

<!-- Avec alpha et presets -->
<MazColorPicker
  v-model="color"
  alpha
  show-presets
  :presets="['#FF5733', '#33FF57', '#3357FF', '#F333FF']"
/>

<!-- Dans un formulaire -->
<MazColorPicker
  v-model="themeColor"
  label="Couleur du thème"
  hint="Choisissez la couleur principale"
  format="hex"
/>
```

#### Sous-composants internes

- **ColorArea** : Zone de sélection saturation/luminosité
- **ColorHue** : Slider pour la teinte
- **ColorAlpha** : Slider pour la transparence
- **ColorPresets** : Grille de couleurs prédéfinies
- **ColorInput** : Champ texte pour saisie manuelle

#### Caractéristiques

- Eyedropper API (si supporté par le navigateur)
- Copy to clipboard
- Historique des couleurs récentes
- Validation du format
- Keyboard navigation

---

### 3. MazRating

**Objectif** : Permettre la notation par étoiles ou icônes personnalisées.

#### Props

```typescript
interface MazRatingProps {
  /** Valeur de la note (v-model) */
  modelValue?: number
  /** Nombre d'éléments (étoiles) */
  count?: number // default: 5
  /** Autoriser les demi-valeurs */
  half?: boolean
  /** Lecture seule */
  readonly?: boolean
  /** Désactivé */
  disabled?: boolean
  /** Taille */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Couleur quand actif */
  color?: MazColor
  /** Couleur quand inactif */
  inactiveColor?: string
  /** Icône personnalisée (nom de l'icône maz-ui) */
  icon?: string // default: 'star'
  /** Icône pour demi-valeur */
  halfIcon?: string // default: 'star-half'
  /** Icône quand vide */
  emptyIcon?: string // default: 'star-outline'
  /** Afficher la valeur numérique */
  showValue?: boolean
  /** Nombre de décimales affichées */
  valuePrecision?: number
  /** Label pour accessibilité */
  ariaLabel?: string
}
```

#### Événements

```typescript
interface MazRatingEmits {
  'update:modelValue': [value: number]
  'hover': [value: number | null]
}
```

#### Utilisation

```vue
<!-- Simple -->
<MazRating v-model="rating" />

<!-- Avec demi-étoiles -->
<MazRating v-model="rating" half />

<!-- Personnalisé -->
<MazRating
  v-model="rating"
  :count="10"
  icon="heart"
  color="danger"
  show-value
/>

<!-- Lecture seule (affichage) -->
<MazRating :model-value="4.5" half readonly show-value />
```

#### Caractéristiques

- Hover preview
- Keyboard navigation (flèches gauche/droite)
- Support tactile
- Animation au clic
- Customisation complète des icônes

---

### 4. MazAutoComplete

**Objectif** : Input avec suggestions de complétion automatique, différent de MazSelect car permet la saisie libre.

#### Props

```typescript
interface MazAutoCompleteProps<T = string> {
  /** Valeur saisie (v-model) */
  modelValue?: string
  /** Liste des suggestions */
  suggestions?: T[]
  /** Fonction de recherche async */
  search?: (query: string) => Promise<T[]> | T[]
  /** Délai debounce pour la recherche (ms) */
  debounce?: number // default: 300
  /** Nombre minimum de caractères avant recherche */
  minChars?: number // default: 1
  /** Propriété à afficher si T est un objet */
  itemLabel?: keyof T | ((item: T) => string)
  /** Propriété pour la valeur si T est un objet */
  itemValue?: keyof T | ((item: T) => unknown)
  /** Nombre max de suggestions affichées */
  maxSuggestions?: number // default: 10
  /** Autoriser les valeurs libres (non présentes dans suggestions) */
  freeInput?: boolean // default: true
  /** Afficher un loader pendant la recherche */
  loading?: boolean
  /** Message quand aucun résultat */
  noResultsText?: string
  /** Grouper les suggestions */
  groupBy?: keyof T | ((item: T) => string)

  // Props héritées de MazInput
  label?: string
  placeholder?: string
  hint?: string
  error?: boolean
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
```

#### Événements

```typescript
interface MazAutoCompleteEmits<T> {
  'update:modelValue': [value: string]
  'select': [item: T]
  'search': [query: string]
  'clear': []
}
```

#### Slots

```typescript
interface MazAutoCompleteSlots<T> {
  /** Personnaliser l'affichage d'une suggestion */
  'suggestion': { item: T, index: number, highlighted: boolean }
  /** Contenu quand aucun résultat */
  'no-results': { query: string }
  /** Header de groupe */
  'group-header': { group: string }
  /** Icône de gauche */
  'left-icon'?: IconComponent | string
  /** Icône de droite */
  'right-icon'?: IconComponent | string
}
```

#### Utilisation

```vue
<!-- Simple avec liste statique -->
<MazAutoComplete
  v-model="city"
  :suggestions="cities"
  label="Ville"
  placeholder="Rechercher une ville..."
/>

<!-- Avec recherche async -->
<MazAutoComplete
  v-model="user"
  :search="searchUsers"
  item-label="name"
  item-value="id"
  label="Utilisateur"
  :min-chars="2"
/>

<!-- Avec slot personnalisé -->
<MazAutoComplete
  v-model="product"
  :suggestions="products"
  item-label="name"
>
  <template #suggestion="{ item }">
    <div class="flex items-center gap-2">
      <img :src="item.image" class="w-8 h-8 rounded" />
      <div>
        <div class="font-medium">{{ item.name }}</div>
        <div class="text-sm text-gray-500">{{ item.price }} €</div>
      </div>
    </div>
  </template>
</MazAutoComplete>
```

#### Caractéristiques

- Debounce intégré pour les recherches
- Highlight du texte correspondant dans les suggestions
- Keyboard navigation (flèches haut/bas, Enter, Escape)
- Support async avec loading state
- Groupement des suggestions
- Cache des résultats de recherche
- Clear button
- Compatible avec MazFormValidator
