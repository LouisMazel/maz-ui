# Dark Theme

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

## How to manage theme ?

Use the `theme-handler` composable: [theme-handler](/maz-ui-3/helpers/theme-handler.html)
