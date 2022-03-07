# Dark Mode

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

## Tips

```vue
<template>
  <MazBtn @click="toggleDarkMode">
    Dark Mode Switch
  </MazBtn>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'

  onMounted(() => {
    autoSetDarkMode()
  })

  const autoSetDarkMode = () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  const toggleDarkMode = () => {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    }
  }
</script>
```
