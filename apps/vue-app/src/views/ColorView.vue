<script lang="ts" setup>
import { useTheme } from '@maz-ui/themes/composables/useTheme'

const { colorMode } = useTheme()
</script>

<template>
  <div class="maz-flex maz-flex-col maz-gap-4 maz-padded-container">
    <MazInput v-model="colorMode" />
    <MazBtn color="transparent">
      Coucou
    </MazBtn>

    <MazTable hoverable background-even>
      <MazTableRow hoverable>
          Coucou
      </MazTableRow>
      <MazTableRow hoverable>
          Coucou
      </MazTableRow>
      <MazTableRow hoverable>
          Coucou
      </MazTableRow>
      <MazTableRow hoverable>
          Coucou
      </MazTableRow>
      <MazTableRow hoverable>
          Coucou
      </MazTableRow>
    </MazTable>

    <ColorScale color="background" />
    <ColorScale color="primary" />
    <ColorScale color="secondary" />
    <ColorScale color="accent" />
    <ColorScale color="destructive" />
    <ColorScale color="warning" />
    <ColorScale color="info" />
    <ColorScale color="success" />
    <ColorScale color="contrast" />
    <ColorScale color="foreground" />
    <ColorScale color="muted" />
    <ColorScale color="border" />
    <ColorScale color="overlay" />
    <ColorScale color="shadow" />
  </div>
</template>
