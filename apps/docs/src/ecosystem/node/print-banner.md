---
title: printBanner
description: Print an ASCII-art banner via figlet with optional version, dividers and clearing — handy for CLI entry points.
---

# {{ $frontmatter.title }}

Print an ASCII-art banner (via [figlet](https://github.com/patorjk/figlet.js)) with optional version, dividers and clearing — handy for CLI entry points.

## Usage

```ts
import { printBanner } from '@maz-ui/node'

printBanner({
  name: 'maz-cli',
  version: 'v1.0.0',
})
```

Renders:

```text
███╗   ███╗ █████╗ ███████╗     ██████╗██╗     ██╗
████╗ ████║██╔══██╗╚══███╔╝    ██╔════╝██║     ██║
██╔████╔██║███████║  ███╔╝     ██║     ██║     ██║
██║╚██╔╝██║██╔══██║ ███╔╝      ██║     ██║     ██║
██║ ╚═╝ ██║██║  ██║███████╗    ╚██████╗███████╗██║
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝     ╚═════╝╚══════╝╚═╝

v1.0.0
```

## API

```ts
function printBanner(args: {
  name: string
  version?: string
  options?: FigletOptions & {
    clear?: boolean
    divider?: boolean
    breakBefore?: boolean
    breakAfter?: boolean
  }
}): void
```

| Parameter | Type      | Description                                  |
| --------- | --------- | -------------------------------------------- |
| `name`    | `string`  | Text rendered as ASCII art (required).       |
| `version` | `string`  | Optional version line printed under the banner. |
| `options` | `object`  | Figlet options + extras (see below).         |

### Options

| Option             | Type      | Default        | Description                                                              |
| ------------------ | --------- | -------------- | ------------------------------------------------------------------------ |
| `clear`            | `boolean` | `true`         | Clear the terminal screen before printing.                               |
| `divider`          | `boolean` | `false`        | Print a separator line after the banner.                                 |
| `breakBefore`      | `boolean` | `true`         | Print a blank line before the banner.                                    |
| `breakAfter`       | `boolean` | `true`         | Print a blank line after the banner.                                     |
| `font`             | `string`  | `'ANSI Shadow'` | Any [figlet font name](https://github.com/patorjk/figlet.js#fonts).      |
| `horizontalLayout` | `string`  | `'full'`       | Figlet horizontal layout: `'default'`, `'full'`, `'fitted'`, …            |

All standard [`figlet` options](https://github.com/patorjk/figlet.js#api) are forwarded.

## Examples

Minimal banner:

```ts
printBanner({ name: 'maz-cli' })
```

Banner with divider, no screen clearing:

```ts
printBanner({
  name: 'maz-cli',
  version: 'v1.0.0',
  options: { clear: false, divider: true },
})
```

Custom font:

```ts
printBanner({
  name: 'Hi!',
  options: { font: 'Standard', horizontalLayout: 'fitted' },
})
```
