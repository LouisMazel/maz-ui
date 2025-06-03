# 🚀 Migration Guide - Tree-Shaking Optimizations

## Breaking Changes

À partir de la version 4.0.0, l'import principal de Maz UI a été optimisé pour le tree-shaking. **Certains imports existants ne fonctionneront plus.**

## ⚠️ Changements d'imports requis

### 🧩 Composants Vue (BREAKING CHANGE)

Rien ne change mais vous pouvez importer les composants directement depuis `maz-ui/components`

```typescript
// ✅ APRÈS - Imports requis
import { MazBtn, MazInput } from 'maz-ui/components'
// ou
import { MazBtn } from 'maz-ui/components/MazBtn'
import { MazInput } from 'maz-ui/components/MazInput'
```

### 🔌 Plugins (BREAKING CHANGE)

```typescript
// ❌ AVANT - Ne fonctionne plus
import { installToaster, ToasterHandler } from 'maz-ui'

// ✅ APRÈS - Imports requis
import { installToaster, ToasterHandler } from 'maz-ui/plugins'
// ou mieux
import { installToaster, ToasterHandler } from 'maz-ui/plugins/toaster'
```

### 📐 Directives (BREAKING CHANGE)

```typescript
// ❌ AVANT - Ne fonctionne plus
import { vClickOutside, vTooltip } from 'maz-ui'

// ✅ APRÈS - Imports requis
import { vClickOutside, vTooltip } from 'maz-ui/directives'
// ou mieux
import { vClickOutside } from 'maz-ui/directives/vClickOutside'
```

### Composables

```typescript
// ❌ AVANT - Ne fonctionne plus
import { useWait, useToast } from 'maz-ui'

// ✅ APRÈS - Imports requis
import { useWait, useToast } from 'maz-ui/composables'
// ou mieux
import { useWait } from 'maz-ui/composables/useWait'
```

## ✅ Imports qui continuent de fonctionner

### 🔧 Helpers, Formatters (ex: Filters)

```typescript
// ✅ Toujours valide - Aucun changement requis
import { sleep, debounce } from 'maz-ui'
import { capitalize, currency } from 'maz-ui'
```

## 📚 Exemples de migration complets

### Avant

```typescript
// Fichier : components/MyComponent.vue
import {
  installToaster,
  vTooltip,
  sleep,
  useThemeHandler
} from 'maz-ui'

export default {
  directives: { vTooltip },
  // ...
}
```

### Après

```typescript
// Fichier : components/MyComponent.vue
import { MazBtn, MazInput, MazDialog } from 'maz-ui/components'
import { installToaster } from 'maz-ui/plugins'
import { vTooltip } from 'maz-ui/directives'
import { useThemeHandler } from 'maz-ui/composables'
import { sleep } from 'maz-ui' // ✅ Pas de changement

export default {
  directives: { vTooltip },
  // ...
}
```

## 🚀 Applications par type

### Frontend Vue/Nuxt

```typescript
// Configuration recommandée
import { MazBtn, MazInput } from 'maz-ui/components'     // Avec CSS
import { useThemeHandler } from 'maz-ui'                 // Sans CSS
import { installToaster } from 'maz-ui/plugins'         // Side effects
```

### Backend Node.js

```typescript
// Configuration recommandée - Éviter les composants
import { sleep, debounce, normalizeString } from 'maz-ui'  // ✅ Safe
import { useFormValidator } from 'maz-ui'                   // ✅ Safe
// import { MazBtn } from 'maz-ui/components'               // ❌ CSS import errors
```

### SSR/Universal

```typescript
// Import conditionnel
import { sleep } from 'maz-ui'  // ✅ Safe partout

// Côté client uniquement
if (process.client) {
  const { MazBtn } = await import('maz-ui/components')
}
```

## 📋 Checklist de migration

- [ ] **Composants** : Changer tous les imports vers `maz-ui/components`
- [ ] **Plugins** : Changer tous les imports vers `maz-ui/plugins`
- [ ] **Directives** : Changer tous les imports vers `maz-ui/directives`
- [ ] **Helpers/Composables** : Aucun changement nécessaire
- [ ] **Tests** : Vérifier que tous les tests passent
- [ ] **Build** : Vérifier la réduction de taille du bundle
- [ ] **SSR** : Tester la compatibilité serveur/client

## 🆘 Support

Si vous rencontrez des problèmes lors de la migration :

1. **Erreurs de build** : Vérifiez les nouveaux chemins d'import
2. **Erreurs CSS en Node.js** : Utilisez uniquement `maz-ui` (sans `/components`)
3. **Bundle trop gros** : Analysez avec `npm run build:analyze`

## 📊 Bénéfices attendus

- **Réduction bundle** : 60-90% selon usage
- **Tree-shaking** : Efficace sur tous les bundlers
- **Compatibilité** : Meilleure séparation frontend/backend
- **Performance** : Chargement plus rapide des pages

---

💡 **Astuce** : Utilisez `import MazBtn from 'maz-ui/components/MazBtn'` pour un tree-shaking encore plus précis !
