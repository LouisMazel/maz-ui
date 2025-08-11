---
title: Theme Editor
description: Create your own theme for maz-ui and export it to use it in your project
layout: home
sidebar: false
---

<br />
<br />

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<br />

<ThemeEditorPage />

<script setup lang="ts">
  import ThemeEditorPage from './demo/ThemeEditorPage.vue'
</script>
