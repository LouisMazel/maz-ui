---
description: MazDrawer is a stand-alone component to add a collapsible sidebar
---

# MazDrawer

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

## Basic usage

This component use `<Teleport to="body">`, so you can implement this component everywhere

<MazDrawer variant="top" v-model="isOpenedTop">
  <template #title>
    Drawer top
  </template>
  <template #default="{ close }">
    <div style="padding: 16px;">
      <p>
        Content
      </p>
      <div class="flex flex-wrap gap-05">
        <MazBtn color="danger" @click="close">
          Close
        </MazBtn>
        <MazBtn color="success" @click="close">
          Confirm
        </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>

<MazDrawer variant="right" v-model="isOpenedRight">
  <template #title>
    Drawer right
  </template>
  <template #default="{ close }">
    <div style="padding: 16px;">
      <p>
        Content
      </p>
      <div class="flex flex-wrap gap-05">
        <MazBtn color="danger" @click="close">
          Close
        </MazBtn>
        <MazBtn color="success" @click="close">
          Confirm
        </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>

<div class="flex flex-wrap gap-05">
  <MazBtn @click="isOpenedTop = !isOpenedTop">
    Open top drawer
  </MazBtn>

  <MazBtn @click="isOpenedRight = !isOpenedRight">
    Open right drawer
  </MazBtn>
</div>

```vue
<template>
  <MazDrawer variant="top" v-model="isOpenedTop">
    <template #title>
      Drawer top
    </template>
    <template #default="{ close }">
      <div style="padding: 16px;">
        <p>
          Content
        </p>
        <div class="flex flex-wrap gap-05">
          <MazBtn color="danger" @click="close">
            Close
          </MazBtn>
          <MazBtn color="success" @click="close">
            Confirm
          </MazBtn>
        </div>
      </div>
    </template>
  </MazDrawer>

  <MazDrawer variant="right" v-model="isOpenedRight">
    <template #title>
      Drawer right
    </template>
    <template #default="{ close }">
      <div style="padding: 16px;">
        <p>
          Content
        </p>
        <div class="flex flex-wrap gap-05">
          <MazBtn color="danger" @click="close">
            Close
          </MazBtn>
          <MazBtn color="success" @click="close">
            Confirm
          </MazBtn>
        </div>
      </div>
    </template>
  </MazDrawer>

  <div class="flex flex-wrap gap-05">
    <MazBtn @click="isOpenedTop = !isOpenedTop">
      Open top drawer
    </MazBtn>

    <MazBtn @click="isOpenedRight = !isOpenedRight">
      Open right drawer
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import MazDrawer from 'maz-ui/components/MazDrawer'
  import { ref } from 'vue'
  const isOpenedTop = ref(false)
  const isOpenedRight = ref(false)
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazDrawer" />

<script lang="ts" setup>
  import { ref } from 'vue'
  const isOpenedTop = ref(false)
  const isOpenedRight = ref(false)
</script>