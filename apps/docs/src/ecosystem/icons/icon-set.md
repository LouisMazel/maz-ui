---
title: Icon Set
description: Search the 860+ icons of @maz-ui/icons by name, country or brand, and copy the name or the import of each icon
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Click an icon to copy its name or one of its imports. The [imports](./index.md#imports) tell which one to pick.

<script setup>
import IconSet from '../../../.vitepress/theme/components/IconSet.vue'
</script>

<IconSet />

## Names

| | Name (icon props) | Component and raw string |
| --- | --- | --- |
| Icons ([Heroicons](https://heroicons.com/), outline) | `user-circle` | `MazUserCircle` |
| Logos | `logo-vue` | `MazLogoVue` |
| Flags (3:2) | `flag-fr` | `MazFlagFR` |
| Square flags (1:1) | `flag-square-fr` | `MazFlagSquareFR` |

The root of `@maz-ui/icons` exports the lazy components with a `Lazy` prefix (`LazyMazUserCircle`). Five components end with `Icon`, not to clash with a component of maz-ui or a global of JavaScript: `MazDocumentIcon`, `MazLinkIcon`, `MazMapIcon`, `MazRadioIcon` and `MazWindowIcon`.
