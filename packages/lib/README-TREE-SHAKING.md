# 🌳 Guide d'optimisation Tree-Shaking - Maz UI

## Vue d'ensemble

Cette documentation explique comment utiliser Maz UI de manière optimale pour bénéficier du tree-shaking et réduire au maximum la taille de votre bundle.

## ✅ Imports optimisés recommandés

### Pour les composants Vue

```typescript
// ✅ OPTIMAL - Import spécifique
import MazBtn from 'maz-ui/components/MazBtn'
import type { MazBtnProps } from 'maz-ui/components/MazBtn'

// ✅ ACCEPTABLE - Import par catégorie
import { MazBtn, MazInput } from 'maz-ui/components'
```

### Pour les helpers (sans CSS)

```typescript
// ✅ OPTIMAL - Import spécifique
import { sleep } from 'maz-ui/helpers/sleep'
import { debounce } from 'maz-ui/helpers/debounce'

// ✅ ACCEPTABLE - Import par catégorie
import { sleep, debounce } from 'maz-ui/helpers'

// ❌ ÉVITER - Import global
import { sleep } from 'maz-ui'
```

### Pour les composables

```typescript
// ✅ OPTIMAL - Import spécifique
import { useThemeHandler } from 'maz-ui/composables/useThemeHandler'
import { useBreakpoints } from 'maz-ui/composables/useBreakpoints'

// ✅ ACCEPTABLE - Import par catégorie
import { useThemeHandler, useBreakpoints } from 'maz-ui/composables'
```

### Pour les plugins (avec side effects)

```typescript
// ✅ Import spécifique recommandé
import { installToaster, ToasterHandler } from 'maz-ui/plugins/toaster'
import { installDialog } from 'maz-ui/plugins/dialog'
```

## 🎯 Stratégies par type d'application

### Applications Vue/Nuxt frontend

```typescript
// Import les composants avec leur CSS intégré
import { MazBtn, MazInput } from 'maz-ui/components'

// Les styles sont automatiquement injectés via libInjectCss
```

### Applications Node.js/Backend

```typescript
// Utilisez UNIQUEMENT les helpers et composables
import { sleep, debounce } from 'maz-ui/helpers'
import { useFormValidator } from 'maz-ui/composables'

// ❌ ÉVITEZ les composants Vue qui contiennent du CSS
// import { MazBtn } from 'maz-ui/components' // ❌ Contient du CSS
```

### Applications SSR/Universal

```typescript
// Imports conditionnels côté client uniquement
import { computed } from 'vue'

const MazBtn = computed(() => {
  if (process.client) {
    return import('maz-ui/components/MazBtn')
  }
  return null
})
```

## 📦 Structure des exports

```txt
maz-ui/
├── components/          # Composants Vue avec CSS
├── composables/         # Composables Vue (sans CSS)
├── helpers/            # Utilitaires JS purs (sans CSS)
├── plugins/            # Plugins Vue (avec side effects)
├── directives/         # Directives Vue (avec side effects)
├── formatters/            # Formatteurs de données (sans CSS)
└── resolvers/          # Resolvers pour unplugin
```

## 🚨 Side effects et considérations

### Modules avec side effects

- **Composants Vue** : Contiennent du CSS injecté automatiquement
- **Plugins** : Peuvent modifier le state global de Vue
- **Directives** : Enregistrent des directives globales
- **Composables** : Logique Vue réutilisable

### Modules sans side effects

- **Helpers** : Fonctions pures JavaScript
- **Formatters (ex: Filters)** : Fonctions de transformation de données

## 🔧 Configuration bundler

### Vite

```javascript
export default {
  resolve: {
    alias: {
      '@maz-ui/components': 'maz-ui/components',
      '@maz-ui/helpers': 'maz-ui/helpers',
      '@maz-ui/composables': 'maz-ui/composables'
    }
  },
  optimizeDeps: {
    include: [
      'maz-ui/helpers',
      'maz-ui/composables'
    ]
  }
}
```

## 📊 Impact sur la taille du bundle

### Import global vs spécifique

```typescript
// ❌ Import global - ~500KB
import { MazBtn, sleep } from 'maz-ui'

// ✅ Import spécifique - ~15KB
import { MazBtn } from 'maz-ui/components/MazBtn'
import { sleep } from 'maz-ui/helpers/sleep'
```

### Exemples de tailles

- **Helper seul** : ~1-5KB
- **Composable seul** : ~2-10KB
- **Composant simple** : ~10-30KB (avec CSS)
- **Composant complexe** : ~30-100KB (avec CSS)
- **Plugin complet** : ~20-50KB

## 🛠️ Outils de debugging

### Analyse du bundle

```bash
# Avec webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Avec vite-bundle-analyzer
npm install --save-dev vite-bundle-analyzer
```

### Vérification des imports

```typescript
// Ajoutez ceci dans votre build pour voir ce qui est importé
console.log('Imported modules:', Object.keys(require.cache))
```

## 📚 Exemples pratiques

### Application minimale (Backend)

```typescript
import { sleep, debounce } from 'maz-ui/helpers'
import { useFormValidator } from 'maz-ui/composables'

// Seulement ~5KB dans le bundle final
```

### Application complète (Frontend)

```typescript
import { MazBtn, MazInput, MazDialog } from 'maz-ui/components'
import { useThemeHandler, useBreakpoints } from 'maz-ui/composables'
import { installToaster } from 'maz-ui/plugins'

// ~150KB dans le bundle final (au lieu de 500KB)
```

## ⚡ Meilleures pratiques

1. **Importez spécifiquement** ce dont vous avez besoin
2. **Évitez les imports globaux** sauf si vous utilisez vraiment tout
3. **Séparez les imports frontend/backend** selon vos besoins
4. **Utilisez les alias** pour simplifier vos imports
5. **Analysez régulièrement** votre bundle avec des outils dédiés
6. **Testez vos imports** dans des environnements différents (Node.js, navigateur)

## 🔍 Troubleshooting

### "Cannot resolve CSS imports in Node.js"

```typescript
// ❌ Problème
import { MazBtn } from 'maz-ui' // Importe du CSS

// ✅ Solution
import { sleep } from 'maz-ui/helpers/sleep' // Pas de CSS
```

### "Module not found"

Vérifiez que vous utilisez les bons chemins d'import selon la nouvelle structure.

### "Large bundle size"

Utilisez les imports spécifiques au lieu des imports globaux.