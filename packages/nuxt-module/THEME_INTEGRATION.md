# Intégration du système de thèmes Maz-UI dans Nuxt

Le module Nuxt @maz-ui/nuxt intègre maintenant le système de thèmes @maz-ui/themes avec une API structurée et moderne.

## Configuration de base

Dans votre `nuxt.config.ts` :

```typescript
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    // Configuration générale
    general: {
      autoImportPrefix: '', // Préfixe pour les composables
      defaultMazIconPath: '/icons/path',
      devtools: true,
    },

    // Styles et CSS
    css: {
      injectMainCss: true, // Auto-import du CSS principal
    },

    // Système de thèmes
    theme: {
      preset: 'mazUi', // ou 'dark', 'ocean', ou preset personnalisé
      strategy: 'hybrid', // 'runtime', 'buildtime', ou 'hybrid'
      darkMode: 'class', // 'class', 'media', ou 'auto'
    },

    // Composants
    components: {
      autoImport: true, // Auto-import de tous les composants
    },

    // Composables
    composables: {
      theme: true,
      aos: true,
      toast: true,
      dialog: true,
      wait: true,
      timer: true,
      // ... autres composables
    },

    // Directives
    directives: {
      tooltip: true,
      lazyImg: true,
      clickOutside: true,
      fullscreenImg: true,
      zoomImg: true,
    },
  },
})
```

## Configuration par catégories

### General - Configuration générale

```typescript
general: {
  autoImportPrefix: 'Maz', // génère useMazTheme au lieu de useTheme
  defaultMazIconPath: '/icons', // chemin vers les icônes SVG
  devtools: true, // intégration Nuxt DevTools
}
```

### CSS - Gestion des styles

```typescript
css: {
  injectMainCss: true, // injection automatique du CSS principal
}
```

### Theme - Système de thèmes

```typescript
theme: {
  preset: 'mazUi', // preset prédéfini ou objet personnalisé
  overrides: { // surcharges du preset
    colors: {
      light: { primary: '220 100% 50%' },
      dark: { primary: '220 100% 70%' }
    }
  },
  strategy: 'hybrid', // stratégie de génération CSS
  darkMode: 'class', // gestion du mode sombre
  disabled: false, // désactiver complètement le système
}
```

### Components - Auto-import des composants

```typescript
components: {
  autoImport: true, // tous les composants Maz-UI disponibles globalement
}
```

### Composables - Gestion des composables

```typescript
composables: {
  theme: true, // useTheme
  aos: { // configuration avancée pour AOS
    enabled: true,
    injectCss: true,
    router: false,
  },
  toast: true, // useToast
  dialog: true, // useDialog
  wait: true, // useWait
  timer: true, // useTimer
  formValidator: true, // useFormValidator & useFormField
  // ... autres
}
```

### Directives - Directives Vue

```typescript
directives: {
  tooltip: true, // v-tooltip
  lazyImg: { // configuration avancée
    observerOptions: { threshold: 0.1 }
  },
  clickOutside: true, // v-click-outside
  fullscreenImg: true, // v-fullscreen-img
  zoomImg: true, // v-zoom-img
}
```

## Utilisation dans les composants

```vue
<template>
  <div class="maz-bg-background maz-text-foreground">
    <!-- Composant auto-importé -->
    <MazBtn @click="toggleDarkMode"> Toggle Dark Mode </MazBtn>

    <!-- Directive auto-installée -->
    <div v-tooltip="'Hello world'">Hover me</div>

    <p>Mode actuel : {{ colorMode }}</p>
    <p>Est sombre : {{ isDark }}</p>
  </div>
</template>

<script setup>
  // Composables auto-importés
  const { toggleDarkMode, colorMode, isDark, updateTheme } = useTheme()

  const toast = useToast()

  // Changer de thème dynamiquement
  function switchToCustomTheme() {
    updateTheme({
      colors: {
        light: {
          primary: '350 100% 50%',
          background: '0 0% 100%',
        },
      },
    })

    toast.success('Thème changé !')
  }
</script>
```

## Migration depuis l'ancienne API

### Avant (API plate)

```typescript
mazUi: {
  autoImportPrefix: 'Maz',
  injectCss: true,
  injectComponents: true,
  injectUseTheme: true,
  installVTooltip: true,
  theme: { preset: 'mazUi' }
}
```

### Après (API structurée)

```typescript
mazUi: {
  general: {
    autoImportPrefix: 'Maz',
  },
  css: {
    injectMainCss: true,
  },
  components: {
    autoImport: true,
  },
  composables: {
    theme: true,
  },
  directives: {
    tooltip: true,
  },
  theme: {
    preset: 'mazUi',
  }
}
```

## Configuration minimale

Pour une configuration simple, seules les valeurs que vous voulez changer sont nécessaires :

```typescript
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    theme: {
      preset: 'dark', // utiliser le thème sombre
    },
  },
})
```

Toutes les autres options gardent leurs valeurs par défaut.
