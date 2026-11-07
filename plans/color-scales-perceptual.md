# Échelles de couleurs `perceptual` (opt-in)

Issue : [#1682](https://github.com/LouisMazel/maz-ui/issues/1682). Sujet lié, non traité ici : [#1683](https://github.com/LouisMazel/maz-ui/issues/1683) (voir les valeurs résolues du thème).

## Problème

Les nuances `-50` à `-950` sont dérivées dans `packages/lib/src/tailwindcss/theme-colors.css` avec un décalage fixe de luminosité (`clamp(0, calc(l + 0.13), 1)`). Avec une base très sombre ou très claire, l'échelle s'effondre :

- base marine : `secondary-50` est un gris moyen, et la moitié sombre est entièrement noire ;
- base or : la moitié claire est entièrement blanche, et l'or vire au citron.

## Décision

- Pas de breaking change : le comportement actuel reste le défaut (`relative`), et le fix passe en opt-in (`perceptual`).
- On ne crée aucune nouvelle variable : le mode `perceptual` redéfinit les mêmes variables (`--maz-color-<role>-<step>`) avec d'autres formules CSS (relative color syntax). Les formules restent dynamiques, donc `updateTheme` continue de fonctionner.
- Seules les couleurs de marque sont concernées : `primary`, `secondary`, `accent`, `info`, `success`, `warning` et `destructive`. `surface`, `foreground`, `contrast` et `divider` gardent l'échelle relative, parce que les composants s'en servent comme « un cran plus sombre ou plus clair » (`bg-surface-600`, `dark:bg-surface-400`, plus de 60 usages).
- On écarte l'échelle à luminosité absolue proposée dans l'issue : avec `500` = base, elle s'inverse pour une base claire (300 plus sombre que 500).

## API utilisateur

```ts
export const brand = definePreset({
  base: mazUi,
  overrides: {
    scales: { color: 'perceptual' }, // défaut : 'relative'
  },
})
```

Les classes ne changent pas (`bg-accent-300`...).

## Formules

`500` = la base, inchangée. Chaque nuance parcourt un pourcentage du chemin entre la base et une borne claire (`0.97`) ou sombre, avec une chroma réduite aux extrémités pour limiter l'écrêtage hors gamut (et la dérive de teinte).

```css
/* tints (50 à 400) */
--maz-color-accent-300: oklch(from var(--maz-accent) calc(l + (0.97 - l) * 0.45) calc(c * 0.75) h);
/* shades (600 à 950) */
--maz-color-accent-700: oklch(from var(--maz-accent) calc(l - (l - <borne sombre>) * 0.5) calc(c * 0.9) h);
```

Les coefficients sont à calibrer sur les cas de l'issue (marine `#0E1450`, or `#FFC93C`) et sur les presets fournis. Pistes de départ :

- tints `t` : 50 = 0.9, 100 = 0.78, 200 = 0.6, 300 = 0.42, 400 = 0.2 ;
- shades : 600 = 0.18, 700 = 0.36, 800 = 0.54, 900 = 0.72, 950 = 0.85.

La borne sombre doit rester en dessous de la base, même pour une base très sombre. Par exemple `min(0.2, l * 0.5)`, à valider. Il faut garder l'ordre 50 > 100 > ... > 950 en luminosité, quelle que soit la base.

## Tâches

- [x] `@maz-ui/themes` : type `scales.color?: 'relative' | 'perceptual'` dans `ThemeScales`, accepté par `definePreset` et `updateTheme`.
- [x] `generateCSS` : en mode `perceptual`, émettre les redéfinitions des 7 rôles × 10 nuances, sous le même sélecteur que les variables du preset (light et dark). Rien n'est émis en mode `relative`.
- [x] Vérifier que ces redéclarations l'emportent sur le `@theme` de Tailwind (`:root`) dans tous les modes de rendu (runtime, buildtime, hybrid) et avec `darkSelectorStrategy`.
- [x] Tests :
  - snapshot de `generateCSS` dans les deux modes ;
  - ordre de luminosité monotone ;
  - aucune nuance collée à 0 ou 1 pour les bases de l'issue ;
  - teinte conservée (écart de hue borné) une fois convertie en sRGB.
- [x] Docs :
  - section dans `apps/docs/src/ecosystem/themes.md`, avec un avant/après en nuancier (base marine et base or) ;
  - mention dans `tools/agent-docs/content` si une règle des agents en dépend, puis `pnpm -F agent-docs generate:plugin`.
- [ ] Changelog : commit `feat(themes)` (opt-in, pas de breaking change).
- [ ] Plus tard (v6) : passer `perceptual` en défaut, avec une note de migration et des nuanciers avant/après.

## Limites connues

- Les navigateurs écrêtent les couleurs hors gamut au lieu de réduire la chroma : la baisse de chroma aux extrémités limite l'écart, sans l'annuler.
- Une même classe (`accent-300`) reste relative à la base de chaque mode : deux couleurs différentes en light et en dark si les bases diffèrent.
