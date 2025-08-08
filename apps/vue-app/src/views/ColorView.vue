<script lang="ts" setup>
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import MazCheckbox from 'maz-ui/src/components/MazCheckbox.vue';

const { colorMode } = useTheme()
</script>

<template>
  <div class="maz-flex maz-flex-col maz-gap-4 maz-padded-container">
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
