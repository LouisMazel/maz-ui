<script setup lang="ts">
import type { DefaultTheme } from 'vitepress'
import { MazCardSpotlight } from 'maz-ui/components'
import { computed } from 'vue'
import { utils } from '../../configs/utils.mjs'

interface UtilLink {
  text: string
  link: string
}

interface UtilCategory {
  text: string
  items: UtilLink[]
}

const categories = computed<UtilCategory[]>(() => {
  const items = (utils.items ?? []) as DefaultTheme.SidebarItem[]
  return items
    .filter((item): item is DefaultTheme.SidebarItem & { items: UtilLink[] } =>
      Array.isArray(item.items) && item.items.length > 0,
    )
    .map(item => ({
      text: item.text ?? '',
      items: item.items as UtilLink[],
    }))
})
</script>

<template>
  <div class="utils-catalogue vp-raw maz:grid maz:gap-4">
    <MazCardSpotlight v-for="category in categories" :key="category.text" class="utils-category">
      <h3 class="maz:font-semibold">
        {{ category.text }}
      </h3>
      <ul>
        <li v-for="item in category.items" :key="item.link">
          <MazLink :href="item.link" class="maz:text-sm">
            <code>{{ item.text }}</code>
          </MazLink>
        </li>
      </ul>
    </MazCardSpotlight>
  </div>
</template>

<style scoped>
.utils-catalogue {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.utils-category code {
  background: transparent;
  padding: 0;
  font-size: inherit;
  color: inherit;
}
</style>
