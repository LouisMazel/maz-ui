---
description: Dark mode is fully supported - How it's works ?
---

# Dark mode

## How it's works ?

To enable the dark you have just to add `dark` class to the `<html />` of your page

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

## How to manage mode ?

Use the `theme-handler` composable: [theme-handler](./../composables/theme-handler.md)
