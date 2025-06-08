import { definePreset, mazUi, ocean, useTheme } from '@maz-ui/themes'
import { MazUi } from 'maz-ui/plugins'
import { createApp } from 'vue'

// Exemple 1: Utilisation d'un preset existant
const app1 = createApp({})
app1.use(MazUi, {
  preset: mazUi,
  strategy: 'hybrid',
  darkMode: 'class',
})

// Exemple 2: Création d'un preset personnalisé
const customPreset = definePreset(mazUi, {
  name: 'custom',
  radius: '0.75rem',
  colors: {
    light: {
      primary: '220 100% 50%',
      secondary: '210 40% 96%',
      accent: '280 100% 70%',
    },
    dark: {
      primary: '220 100% 70%',
      secondary: '210 40% 15%',
      accent: '280 100% 80%',
    },
  },
})

const app2 = createApp({})
app2.use(MazUi, {
  preset: customPreset,
  strategy: 'runtime',
  darkMode: 'auto',
})

// Exemple 3: Override d'un preset existant
const app3 = createApp({})
app3.use(MazUi, {
  preset: ocean,
  overrides: {
    radius: '1rem',
    colors: {
      light: {
        primary: '200 100% 45%',
      },
    },
  },
  strategy: 'build',
  darkMode: 'media',
})

// Exemple d'utilisation dans un composable
export function useCustomTheme() {
  const { updateTheme, setColorMode, toggleDarkMode } = useTheme()

  const applyBrandTheme = () => {
    updateTheme({
      colors: {
        light: {
          primary: '350 100% 50%',
          secondary: '350 20% 95%',
        },
        dark: {
          primary: '350 100% 70%',
          secondary: '350 20% 15%',
        },
      },
    })
  }

  const enableAutoMode = () => {
    setColorMode('auto')
  }

  return {
    applyBrandTheme,
    enableAutoMode,
    toggleDarkMode,
  }
}
