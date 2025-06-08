import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  buildThemeCSS,
  dark,
  definePreset,
  generateThemeBundle,
  mazUi,
  ocean,
} from '@maz-ui/themes'

// Votre preset personnalisé
const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    appearance: {
      'font-family': 'inter, sans-serif',
      radius: '0.5rem',
      'border-width': '1px',
    },
    colors: {
      light: {
        background: '0 0% 100%',
        foreground: '222.2 84% 4.9%',
        primary: '221.2 83.2% 53.3%',
        'primary-foreground': '210 40% 98%',
        secondary: '210 40% 96%',
        'secondary-foreground': '222.2 84% 4.9%',
      },
      dark: {
        background: '222.2 84% 4.9%',
        foreground: '210 40% 98%',
        primary: '217.2 91.2% 59.8%',
        'primary-foreground': '222.2 84% 4.9%',
        secondary: '217.2 32.6% 17.5%',
        'secondary-foreground': '210 40% 98%',
      },
    },
  },
})

// Créer le dossier themes s'il n'existe pas
mkdirSync(join(process.cwd(), 'public/themes'), { recursive: true })

// Générer CSS pour le thème personnalisé
const customCSS = buildThemeCSS({
  preset: customPreset,
  darkMode: 'class',
  critical: false,
})

// Générer bundle pour plusieurs thèmes
const themeBundle = generateThemeBundle([customPreset, mazUi, dark, ocean], {
  darkMode: 'class',
})

// Écrire les fichiers CSS
writeFileSync(join(process.cwd(), 'public/themes/custom.css'), customCSS)

Object.entries(themeBundle).forEach(([name, css]) => {
  writeFileSync(join(process.cwd(), `public/themes/${name}.css`), css)
})

console.log('✅ Thèmes générés dans public/themes/')
