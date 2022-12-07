---
description: Dark mode is fully supported - How it's works ?
---

# Dark mode

::: tip
To manage the dark mode, use this composable: [useThemeHandler](./../composables/use-theme-handler.md)
:::

## How it's works ?

To enable the dark you have just to add `dark` class to the `<html />` of your page

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
