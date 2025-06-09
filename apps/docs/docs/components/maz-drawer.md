---
title: MazDrawer
description: MazDrawer is a standalone component to add a collapsible sidebar at the top and bottom bar
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: tip
This component uses `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Basic usage

<ComponentDemo expanded>
  <div class="maz-flex maz-flex-col maz-gap-2 maz-flex-center">
    <MazBtn @click="isOpenedTop = !isOpenedTop">
      Open top drawer
    </MazBtn>
    <div class="maz-flex maz-flex-wrap maz-gap-2">
      <MazBtn @click="isOpenedLeft = !isOpenedLeft">
        Open left drawer
      </MazBtn>
      <MazBtn @click="isOpenedRight = !isOpenedRight">
        Open right drawer
      </MazBtn>
    </div>
    <MazBtn @click="isOpenedBottom = !isOpenedBottom">
      Open bottom drawer
    </MazBtn>
  </div>

  <template #code>

  ```html
  <MazBtn @click="isOpenedTop = !isOpenedTop">
    Open top drawer
  </MazBtn>
  <MazBtn @click="isOpenedLeft = !isOpenedLeft">
    Open left drawer
  </MazBtn>
  <MazBtn @click="isOpenedRight = !isOpenedRight">
    Open right drawer
  </MazBtn>
  <MazBtn @click="isOpenedBottom = !isOpenedBottom">
    Open bottom drawer
  </MazBtn>

  <MazDrawer variant="top" v-model="isOpenedTop">
    <template #title>
      Drawer top
    </template>
    <template #default="{ close }">
      <div style="padding: 16px;">
        <p>
          Content
        </p>
        <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
          <MazBtn color="destructive" @click="close">
            Close
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
        <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
          <MazBtn color="destructive" @click="close">
            Close
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
        <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
          <MazBtn color="destructive" @click="close">
            Close
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
        <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
          <MazBtn color="destructive" @click="close">
            Close
          </MazBtn>
        </div>
      </div>
    </template>
  </MazDrawer>
  ```

  </template>
</ComponentDemo>

<MazDrawer variant="top" v-model="isOpenedTop">
  <template #title>
    Drawer top
  </template>
  <template #default="{ close }">
    <div style="padding: 16px;">
      <p>
        Content
      </p>
      <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
        <MazBtn color="destructive" @click="close">
          Close
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
      <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
        <MazBtn color="destructive" @click="close">
          Close
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
      <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
        <MazBtn color="destructive" @click="close">
          Close
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
      <div class="maz-flex maz-flex-wrap maz-gap-2 maz-mt-4">
        <MazBtn color="destructive" @click="close">
          Close
        </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>

<script lang="ts" setup>
  import { ref } from 'vue'

  const isOpenedTop = ref(false)
  const isOpenedBottom = ref(false)
  const isOpenedRight = ref(false)
  const isOpenedLeft = ref(false)
</script>

<!--@include: ./../.vitepress/generated-docs/maz-drawer.doc.md-->
