<script lang="ts" setup>
const { colorMode, updateTheme } = useTheme()
</script>

<template>
  <MazDropdown
    id="dropdown"
    color="transparent"
    prefer-position="bottom-end"
    trigger="hover"
  >
    <span class="maz-capitalize">
      {{ colorMode }}
    </span>

    <template #dropdown>
      <div class="maz-grid maz-grid-cols-2">
        <MazBtn
          color="transparent"
          class="maz-text-nowrap"
          @click="colorMode = 'auto'"
        >
          Auto
        </MazBtn>
        <MazBtn
          color="transparent"
          class="maz-text-nowrap"
          @click="colorMode = 'dark'"
        >
          Dark
        </MazBtn>
        <MazBtn
          color="transparent"
          class="maz-text-nowrap"
          @click="colorMode = 'light'"
        >
          Light
        </MazBtn>
        <MazBtn
          color="transparent"
          class="maz-text-nowrap"
          @click="updateTheme('maz-ui')"
        >
          Maz-UI
        </MazBtn>
        <MazBtn
          color="transparent"
          class="maz-text-nowrap"
          @click="updateTheme('ocean')"
        >
          Ocean
        </MazBtn>
        <MazBtn
          color="transparent"
          class="maz-text-nowrap"
          @click="updateTheme('obsidian')"
        >
          Obsidian
        </MazBtn>
        <MazBtn
          color="transparent"
          class="maz-text-nowrap"
          @click="updateTheme('pristine')"
        >
          Pristine
        </MazBtn>
      </div>
    </template>
  </MazDropdown>
</template>
