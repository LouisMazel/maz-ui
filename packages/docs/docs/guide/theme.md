---
title: Theme
description: Maz-ui is customizable using CSS variables. Apply your color & border preferences.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

You must override `--maz-***` [CSS variables](#list-of-css-variables)

## Generate your theme with the CLI included

<NpmBadge package="@mazui/cli"></NpmBadge>

### Add maz-ui config file

In the root folder of your project, add a file named `maz-ui.config.{ts, js, mjs, cjs}` as bellow ([typescript interface](#maz-ui-configuration-file-typescript-interface))

All input colors can be in HEX, RGB, RGBA, HSL, HSLA and named formats.

No theme variables are required, you can put only one if you wish

```ts
import { defineConfig } from '@mazui/cli'

export default defineConfig({
  outputCssFilePath: './css/maz-ui-variables.css',
  theme: {
    colors: {
      primary: 'hsl(210, 100%, 56%)',
      secondary: 'hsl(164, 76%, 46%)',
      info: 'hsl(188, 78%, 41%)',
      success: 'hsl(80, 61%, 50%)',
      warning: 'hsl(40, 97%, 59%)',
      danger: 'hsl(1, 100%, 71%)',
      bgOverlay: 'hsl(0, 0%, 0% / 30%)',
      lightTheme: {
        textColor: 'hsl(0, 0%, 85%)',
        colorMuted: 'hsla(0, 0%, 0%, 0.54)',
        bgColor: 'hsl(0, 0%, 100%)',
      },
      darkTheme: {
        textColor: 'hsl(210, 8%, 14%)',
        colorMuted: 'hsla(0, 0%, 100%, 0.54)',
        bgColor: 'hsl(235, 16%, 15%)',
      },
    },
    borderColor: 'hsl(220deg 13.04% 90.98%)',
    borderWidth: '0.125rem',
    borderRadius: '0.5rem',
    fontFamily: `system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen,
    ubuntu, cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  },
})
```

## Generate CSS file variables

Two ways to generate the CSS file:

### Run CLI command

In your terminal, on your root folder project, run this command:

```bash
npx maz-ui generate-css-vars
# or pnpx maz-ui generate-css-vars
```

### With package.json script

```json
{
  "scripts": {
    "generate-css-vars": "maz-ui generate-css-vars"
  }
}
```

```bash
npm run generate-css-vars
# or yanr generate-css-vars
# or pnpm generate-css-vars
```

Then, the file will be generated, and you must import it in your project.

**Be careful, depending on the chosen colors, some variants may need to be adjusted**

## List of CSS variables

::: details Show CSS variables

```css
:root {
  /* PRIMARY */
  --maz-color-primary-50: hsl(210deg 100% 95%);
  --maz-color-primary-100: hsl(210deg 100% 87%);
  --maz-color-primary-200: hsl(210deg 100% 79%);
  --maz-color-primary-300: hsl(210deg 100% 71%);
  --maz-color-primary-400: hsl(210deg 100% 64%);
  --maz-color-primary: hsl(210deg 100% 56%);
  --maz-color-primary-600: hsl(210deg 79% 46%);
  --maz-color-primary-700: hsl(210deg 78% 36%);
  --maz-color-primary-800: hsl(210deg 79% 26%);
  --maz-color-primary-900: hsl(210deg 79% 17%);
  --maz-color-primary-alpha: hsl(210deg 100% 56% / 60%);
  --maz-color-primary-alpha-20: hsl(210deg 100% 56% / 20%);
  --maz-color-primary-alpha-10: hsl(210deg 100% 56% / 10%);
  --maz-color-primary-alpha-05: hsl(210deg 100% 56% / 05%);
  --maz-color-primary-contrast: hsl(0deg 0% 100%);

  --maz-color-secondary-50: hsl(164deg 65% 93%);
  --maz-color-secondary-100: hsl(164deg 66% 84%);
  --maz-color-secondary-200: hsl(164deg 66% 75%);
  --maz-color-secondary-300: hsl(164deg 66% 65%);
  --maz-color-secondary-400: hsl(164deg 66% 56%);
  --maz-color-secondary: hsl(164deg 76% 46%);
  --maz-color-secondary-600: hsl(164deg 76% 38%);
  --maz-color-secondary-700: hsl(164deg 77% 30%);
  --maz-color-secondary-800: hsl(164deg 77% 22%);
  --maz-color-secondary-900: hsl(164deg 77% 14%);
  --maz-color-secondary-alpha: hsl(164deg 76% 46% / 60%);
  --maz-color-secondary-alpha-20: hsl(164deg 76% 46% / 20%);
  --maz-color-secondary-alpha-10: hsl(164deg 76% 46% / 10%);
  --maz-color-secondary-alpha-05: hsl(164deg 76% 46% / 05%);
  --maz-color-secondary-contrast: hsl(0deg 0% 100%);

  --maz-color-info-50: hsl(188deg 53% 93%);
  --maz-color-info-100: hsl(188deg 54% 82%);
  --maz-color-info-200: hsl(188deg 53% 72%);
  --maz-color-info-300: hsl(188deg 53% 61%);
  --maz-color-info-400: hsl(188deg 53% 51%);
  --maz-color-info: hsl(188deg 78% 41%);
  --maz-color-info-600: hsl(188deg 78% 34%);
  --maz-color-info-700: hsl(188deg 78% 26%);
  --maz-color-info-800: hsl(188deg 78% 19%);
  --maz-color-info-900: hsl(188deg 77% 12%);
  --maz-color-info-alpha: hsl(188deg 78% 41% / 60%);
  --maz-color-info-alpha-20: hsl(188deg 78% 41% / 20%);
  --maz-color-info-alpha-10: hsl(188deg 78% 41% / 10%);
  --maz-color-info-alpha-05: hsl(188deg 78% 41% / 05%);
  --maz-color-info-contrast: hsl(0deg 0% 100%);

  --maz-color-success-50: hsl(80deg 63% 94%);
  --maz-color-success-100: hsl(80deg 61% 85%);
  --maz-color-success-200: hsl(80deg 60% 76%);
  --maz-color-success-300: hsl(80deg 61% 68%);
  --maz-color-success-400: hsl(80deg 61% 59%);
  --maz-color-success: hsl(80deg 61% 50%);
  --maz-color-success-600: hsl(80deg 61% 41%);
  --maz-color-success-700: hsl(80deg 60% 33%);
  --maz-color-success-800: hsl(80deg 60% 24%);
  --maz-color-success-900: hsl(80deg 61% 15%);
  --maz-color-success-alpha: hsl(80deg 61% 50% / 60%);
  --maz-color-success-alpha-20: hsl(80deg 61% 50% / 20%);
  --maz-color-success-alpha-10: hsl(80deg 61% 50% / 10%);
  --maz-color-success-alpha-05: hsl(80deg 61% 50% / 05%);
  --maz-color-success-contrast: hsl(210deg 8% 14%);

  --maz-color-warning-50: hsl(40deg 100% 95%);
  --maz-color-warning-100: hsl(40deg 97% 88%);
  --maz-color-warning-200: hsl(40deg 98% 81%);
  --maz-color-warning-300: hsl(40deg 97% 73%);
  --maz-color-warning-400: hsl(40deg 98% 66%);
  --maz-color-warning: hsl(40deg 97% 59%);
  --maz-color-warning-600: hsl(40deg 68% 49%);
  --maz-color-warning-700: hsl(40deg 67% 38%);
  --maz-color-warning-800: hsl(40deg 68% 28%);
  --maz-color-warning-900: hsl(40deg 67% 18%);
  --maz-color-warning-alpha: hsl(40deg 97% 59% / 60%);
  --maz-color-warning-alpha-20: hsl(40deg 97% 59% / 20%);
  --maz-color-warning-alpha-10: hsl(40deg 97% 59% / 10%);
  --maz-color-warning-alpha-05: hsl(40deg 97% 59% / 05%);
  --maz-color-warning-contrast: hsl(217deg 19% 27%);

  --maz-color-danger-50: hsl(1deg 100% 96%);
  --maz-color-danger-100: hsl(1deg 100% 91%);
  --maz-color-danger-200: hsl(2deg 100% 86%);
  --maz-color-danger-300: hsl(1deg 100% 81%);
  --maz-color-danger-400: hsl(1deg 100% 76%);
  --maz-color-danger: hsl(1deg 100% 71%);
  --maz-color-danger-600: hsl(1deg 58% 58%);
  --maz-color-danger-700: hsl(1deg 41% 46%);
  --maz-color-danger-800: hsl(1deg 42% 34%);
  --maz-color-danger-900: hsl(1deg 41% 21%);
  --maz-color-danger-alpha: hsl(1deg 100% 71% / 60%);
  --maz-color-danger-alpha-20: hsl(1deg 100% 71% / 20%);
  --maz-color-danger-alpha-10: hsl(1deg 100% 71% / 10%);
  --maz-color-danger-alpha-05: hsl(1deg 100% 71% / 05%);
  --maz-color-danger-contrast: hsl(0deg 0% 100%);

  /* WHITE */
  --maz-color-white: hsl(0deg 0% 100%);
  --maz-color-white-contrast: hsl(0deg 0% 0%);

  /* BLACK */
  --maz-color-black: hsl(0deg 0% 0%);
  --maz-color-black-contrast: hsl(0deg 0% 100%);

  /** TEXT COLOR LIGHT **/
  --maz-color-text-light: hsl(210deg 8% 14%);
  --maz-color-muted-light: hsl(0deg 0% 0% / 54%);

  /** TEXT COLOR DARK **/
  --maz-color-text-dark: hsl(0deg 0% 85%);
  --maz-color-muted-dark: hsl(0deg 0% 89% / 54%);

  /** BG OVERLAY **/
  --maz-bg-overlay: hsl(0deg 0% 0% / 30%);

  /** BG LIGHT COLOR **/
  --maz-bg-color-light-lighter: hsl(0deg 0% 97%);
  --maz-bg-color-light-light: hsl(0deg 0% 94%);
  --maz-bg-color-light: hsl(0deg 0% 100%);
  --maz-bg-color-light-dark: hsl(0deg 0% 91%);
  --maz-bg-color-light-darker: hsl(0deg 0% 88%);

  /** BG DARK COLOR **/;
  --maz-bg-color-dark-lighter: hsl(238deg 16% 25%);
  --maz-bg-color-dark-light: hsl(237deg 16% 20%);
  --maz-bg-color-dark: hsl(235deg 16% 15%);
  --maz-bg-color-dark-dark: hsl(238deg 16% 12%);
  --maz-bg-color-dark-darker: hsl(238deg 16% 7%);

  /**
  * Border of components
  **/
  --maz-border-color: hsl(220deg 13.04% 90.98%);

  /**
  * DEFAULT BORDER WIDTH (0.063rem = 1px with a font-size base of 16px)
  **/
  --maz-border-width: 0.063rem;

  /**
  * DEFAULT BORDER RADIUS (0.7rem = 11.2px with a font-size base of 16px)
  **/
  --maz-border-radius: 0.7rem;

  /**
  * FONT FAMILY
  * Not used in the library --> Use this variable on your <html> element (optional)
  **/
  --maz-font-family: system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI',
    roboto, oxygen, ubuntu, cantarell, 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
}
```

:::

## Maz-UI configuration file Typescript interface

::: details Show Typescript interface

```ts
interface MazUiConfig {
  /**
   * Path and name of generate CSS file
   * @example './css/maz-ui-variables.css'
   */
  outputCssFilePath: string
  theme: {
    colors: {
      primary?: string
      secondary?: string
      info?: string
      danger?: string
      success?: string
      warning?: string
      bgOverlay?: string
      lightTheme?: {
        textColor?: string
        colorMuted?: string
        bgColor?: string
      }
      darkTheme?: {
        textColor?: string
        colorMuted?: string
        bgColor?: string
      }
    }
    /**
     * Border color applied to components like: inputs, card, etc
     */
    borderColor?: string
    /**
     * Border width applied to components like: inputs, card, etc
     */
    borderWidth?: string
    /**
     * Radius applied to rounded components like: buttons, inputs, card, etc.
     */
    borderRadius?: string
    fontFamily?: string
  }
}
```

:::
