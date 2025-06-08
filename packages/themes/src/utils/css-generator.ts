import type { BaseThemePreset, ThemeAppearance, ThemeColors } from '../types'
import { generateColorScale } from './color-utils'

// =============================================================================
// TYPES & CONSTANTS
// =============================================================================

type ThemeMode = 'light' | 'dark' | 'both'
type DarkSelector = 'class' | 'media'

export interface CriticalCSSOptions {
  /** Variables de couleur critiques à inclure */
  criticalColors?: (keyof ThemeColors)[]
  /** Variables d'apparence critiques à inclure */
  criticalAppearance?: (keyof ThemeAppearance)[]
  /** Mode de thème à générer */
  mode?: ThemeMode
  /** Sélecteur pour le mode sombre: 'class' (.dark) | 'media' (@media) */
  darkSelector?: DarkSelector
  /** Préfixe des variables CSS */
  prefix?: string
}

export interface FullCSSOptions {
  /** Variables critiques à exclure (pour éviter la duplication) */
  excludeCritical?: (keyof ThemeColors)[]
  /** Mode de thème à générer */
  mode?: ThemeMode
  /** Sélecteur pour le mode sombre: 'class' (.dark) | 'media' (@media) */
  darkSelector?: DarkSelector
  /** Préfixe des variables CSS */
  prefix?: string
  /** Inclure les échelles de couleur (50-900) */
  includeColorScales?: boolean
}

// Variables critiques par défaut
const DEFAULT_CRITICAL_COLORS: (keyof ThemeColors)[] = [
  'background',
  'foreground',
  'primary',
  'secondary',
  'border',
]

const DEFAULT_CRITICAL_APPEARANCE: (keyof ThemeAppearance)[] = [
  'radius',
  'font-family',
]

// =============================================================================
// CSS CRITIQUE - Pour éviter le FOUC
// =============================================================================

/**
 * Génère le CSS critique pour éviter le FOUC
 * Contient uniquement les variables essentielles
 */
export function generateCriticalCSS(
  preset: BaseThemePreset,
  options: CriticalCSSOptions = {},
): string {
  const {
    criticalColors = DEFAULT_CRITICAL_COLORS,
    criticalAppearance = DEFAULT_CRITICAL_APPEARANCE,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
  } = options

  const lightCritical = extractCriticalVariables(preset.colors.light, criticalColors)
  const darkCritical = extractCriticalVariables(preset.colors.dark, criticalColors)
  const appearanceCritical = extractCriticalAppearance(preset.appearance, criticalAppearance)

  let css = '@layer maz-ui-theme {\n'

  // Thème light
  if (mode === 'light' || mode === 'both') {
    css += generateVariablesBlock({
      selector: ':root',
      colors: lightCritical,
      appearance: appearanceCritical,
      prefix,
    })
  }

  // Thème dark
  if (mode === 'dark' || mode === 'both') {
    css += generateVariablesBlock({
      selector: darkSelector === 'media' ? ':root' : '.dark',
      mediaQuery: darkSelector === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: darkCritical,
      appearance: mode === 'dark' ? appearanceCritical : undefined, // Apparence seulement si mode dark uniquement
      prefix,
    })
  }

  css += '}\n'
  return css
}

// =============================================================================
// CSS COMPLET - Toutes les variables sauf les critiques
// =============================================================================

/**
 * Génère le CSS complet sans les variables critiques
 * Évite la duplication avec le CSS critique
 */
export function generateFullCSS(
  preset: BaseThemePreset,
  options: FullCSSOptions = {},
): string {
  const {
    excludeCritical = DEFAULT_CRITICAL_COLORS,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    includeColorScales = true,
  } = options

  const lightColors = excludeVariables(preset.colors.light, excludeCritical)
  const darkColors = excludeVariables(preset.colors.dark, excludeCritical)
  const appearance = excludeAppearanceVariables(preset.appearance, DEFAULT_CRITICAL_APPEARANCE)

  let css = '@layer maz-ui-theme {\n'

  // Thème light - Variables restantes + échelles
  if (mode === 'light' || mode === 'both') {
    css += generateVariablesBlock({
      selector: ':root',
      colors: lightColors,
      appearance,
      prefix,
      includeScales: includeColorScales,
      preset,
    })
  }

  // Thème dark - Variables restantes + échelles
  if (mode === 'dark' || mode === 'both') {
    css += generateVariablesBlock({
      selector: darkSelector === 'media' ? ':root' : '.dark',
      mediaQuery: darkSelector === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: darkColors,
      appearance: mode === 'dark' ? appearance : undefined, // Apparence seulement si mode dark uniquement
      prefix,
      includeScales: includeColorScales,
      preset,
      isDark: true,
    })
  }

  css += '}\n'
  return css
}

// =============================================================================
// UTILITAIRES - Fonctions helpers
// =============================================================================

/**
 * Extrait les variables de couleur critiques
 */
function extractCriticalVariables(
  colors: ThemeColors,
  criticalKeys: (keyof ThemeColors)[],
): Partial<ThemeColors> {
  return Object.fromEntries(
    criticalKeys
      .filter(key => colors[key])
      .map(key => [key, colors[key]]),
  )
}

/**
 * Extrait les variables d'apparence critiques
 */
function extractCriticalAppearance(
  appearance: ThemeAppearance | undefined,
  criticalKeys: (keyof ThemeAppearance)[],
): Partial<ThemeAppearance> {
  if (!appearance)
    return {}

  return Object.fromEntries(
    criticalKeys
      .filter(key => appearance[key])
      .map(key => [key, appearance[key]]),
  )
}

/**
 * Exclut les variables critiques des couleurs
 */
function excludeVariables(
  colors: ThemeColors,
  excludeKeys: (keyof ThemeColors)[],
): Partial<ThemeColors> {
  return Object.fromEntries(
    Object.entries(colors).filter(([key]) => !excludeKeys.includes(key as keyof ThemeColors)),
  )
}

/**
 * Exclut les variables d'apparence critiques
 */
function excludeAppearanceVariables(
  appearance: ThemeAppearance | undefined,
  excludeKeys: (keyof ThemeAppearance)[],
): Partial<ThemeAppearance> {
  if (!appearance)
    return {}

  return Object.fromEntries(
    Object.entries(appearance).filter(([key]) => !excludeKeys.includes(key as keyof ThemeAppearance)),
  )
}

/**
 * Génère un bloc de variables CSS
 */
function generateVariablesBlock({
  selector,
  mediaQuery,
  colors,
  appearance,
  prefix,
  includeScales = false,
  preset,
  isDark = false,
}: {
  selector: string
  mediaQuery?: string
  colors?: Partial<ThemeColors>
  appearance?: Partial<ThemeAppearance>
  prefix: string
  includeScales?: boolean
  preset?: BaseThemePreset
  isDark?: boolean
}): string {
  const variables: string[] = []

  // Variables de couleur
  if (colors) {
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        variables.push(`  --${prefix}-${key}: ${value};`)
      }
    })
  }

  // Variables d'apparence
  if (appearance) {
    Object.entries(appearance).forEach(([key, value]) => {
      if (value) {
        variables.push(`  --${prefix}-${key}: ${value};`)
      }
    })
  }

  // Échelles de couleur (50-900)
  if (includeScales && preset) {
    const sourceColors = isDark ? preset.colors.dark : preset.colors.light
    const colorScales = generateAllColorScales(sourceColors, prefix)
    variables.push(...colorScales)
  }

  // Construction du bloc CSS
  const content = variables.join('\n')

  if (mediaQuery) {
    return `\n  ${mediaQuery} {\n    ${selector} {\n${content.replace(/^/gm, '  ')}\n    }\n  }\n`
  }

  return `\n  ${selector} {\n${content}\n  }\n`
}

/**
 * Génère toutes les échelles de couleur (50-900)
 */
function generateAllColorScales(colors: ThemeColors, prefix: string): string[] {
  const colorScales: string[] = []

  // Couleurs qui ont des échelles
  const scaleColors = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'contrast'] as const

  scaleColors.forEach((colorName) => {
    const baseColor = colors[colorName]
    if (baseColor) {
      const scale = generateColorScale(baseColor)
      Object.entries(scale).forEach(([scaleKey, scaleValue]) => {
        colorScales.push(`  --${prefix}-${colorName}-${scaleKey}: ${scaleValue};`)
      })
    }
  })

  return colorScales
}

// =============================================================================
// UTILITAIRES D'INJECTION - Pour l'utilisation runtime
// =============================================================================

/**
 * Injecte le CSS dans le DOM
 */
export function injectCSS(css: string, id: string = 'maz-theme-vars'): void {
  if (typeof document === 'undefined')
    return

  let styleElement = document.getElementById(id) as HTMLStyleElement | null

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = id
    document.head.appendChild(styleElement)
  }

  styleElement.textContent = css
}

/**
 * Supprime le CSS du DOM
 */
export function removeCSS(id: string = 'maz-theme-vars'): void {
  if (typeof document === 'undefined')
    return

  const styleElement = document.getElementById(id)
  if (styleElement) {
    styleElement.remove()
  }
}
