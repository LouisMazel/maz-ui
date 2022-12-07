---
title: MazDrawer
description: MazDrawer is a standalone component to add a collapsible sidebar or top, bottom bar
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../mixins/getting-started.md-->

::: tip
This component use `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component everywhere and it inherits all his props
:::

## Basic usage

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

<MazDrawer variant="bottom" v-model="isOpenedBottom">
  <template #title>
    Drawer bottom
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

<MazDrawer variant="left" v-model="isOpenedLeft">
  <template #title>
    Drawer left
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

  <MazBtn @click="isOpenedBottom = !isOpenedBottom">
    Open bottom drawer
  </MazBtn>

  <MazBtn @click="isOpenedRight = !isOpenedRight">
    Open right drawer
  </MazBtn>

  <MazBtn @click="isOpenedLeft = !isOpenedLeft">
    Open left drawer
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

  <MazDrawer variant="bottom" v-model="isOpenedBottom">
    <template #title>
      Drawer bottom
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

  <MazDrawer variant="left" v-model="isOpenedLeft">
    <template #title>
      Drawer left
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

    <MazBtn @click="isOpenedBottom = !isOpenedBottom">
      Open bottom drawer
    </MazBtn>

    <MazBtn @click="isOpenedRight = !isOpenedRight">
      Open right drawer
    </MazBtn>

    <MazBtn @click="isOpenedLeft = !isOpenedLeft">
      Open left drawer
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  import MazDrawer from 'maz-ui/components/MazDrawer'

  const isOpenedTop = ref(false)
  const isOpenedBottom = ref(false)
  const isOpenedRight = ref(false)
  const isOpenedLeft = ref(false)
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazDrawer" />

<script lang="ts" setup>
  import { ref } from 'vue'

  const isOpenedTop = ref(false)
  const isOpenedBottom = ref(false)
  const isOpenedRight = ref(false)
  const isOpenedLeft = ref(false)
</script>
