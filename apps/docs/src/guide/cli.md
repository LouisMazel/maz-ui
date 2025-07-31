---
title: '@maz-ui/cli - theme generator'
description: CLI of maz-ui to generate CSS variables file to theming maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning

This module is only for v3.x users, if you are using v4.x, please use the [@maz-ui/themes](./themes.md) package instead.

:::

## Config file

Then, in your root folder of your project, add a file named `maz-ui.config.{ts,js,mjs,cjs}` as bellow ([model](#maz-ui-configuration-file-typescript-interface))

All colors can be in HEX, RGB, RGBA, HSL, HSLA and named formats.

No theme variables are required, you can put only one if you wish

```ts
import { defineConfig } from '@maz-ui/cli'

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

```bash
npx maz-ui generate-css-vars
# or pnpx maz-ui generate-css-vars
```

### With package.json script

1. First, install the CLI package:

```bash
npm install @maz-ui/cli
# or pnpm add @maz-ui/cli
```

2. Then, add the script in your `package.json`:

```json
{
  "scripts": {
    "generate-css-vars": "maz-ui generate-css-vars"
  }
}
```

3. Finally, run the script:

```bash
npm run generate-css-vars
# or yanr generate-css-vars
# or pnpm generate-css-vars
```

Then, the file will be generated, and you must import it in your project.

**Be careful, depending on the chosen colors, some variants may need to be adjusted**

## Maz-UI configuration file Typescript interface

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
