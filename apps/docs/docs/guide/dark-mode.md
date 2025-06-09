---
title: Dark mode
description: Dark mode is fully supported - How it's works ?
---

# {{ $frontmatter.title }}

::: tip
To let users manage dark mode, use this composable: [useTheme](./../guide/theme.md)
:::

## How it's works ?

To enable dark mode, you just have to add the `dark` class to the `<html />` of your page

### Light

```html
<!-- Dark mode not enabled -->
<html>
  <body>
    <!-- Will be white -->
    <div id="app">
      <!-- ... -->
    </div>
  </body>
</html>
```

### Dark

```html
<!-- Dark mode enabled -->
<html class="dark">
  <body>
    <!-- Will be black -->
    <div id="app">
      <!-- ... -->
    </div>
  </body>
</html>
```
