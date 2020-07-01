<template>
  <div class="maz-btn-doc">
    <p class="maz-mb-3">
      Supports <strong>link HTML element</strong>, <strong>router-link</strong> & <strong>nuxt-link</strong>
    </p>
    <ComponentContainer
      :code="codeExample"
      language="html"
      class="btn-container"
    >
      <h4 class="maz-mb-3">
        Basic
      </h4>
      <MazBtn rounded>
        Rounded
      </MazBtn>
      <MazBtn outline>
        Outline
      </MazBtn>
      <MazBtn fab>
        Fab
      </MazBtn>
      <MazBtn loading>
        Loading
      </MazBtn>
      <MazBtn disabled>
        Disabled
      </MazBtn>
      <MazBtn href="/documentation/maz-btn">
        It's a link
      </MazBtn>
      <MazBtn :to="{ name: 'documentation-maz-btn' }">
        It's a router link
      </MazBtn>
      <MazBtn block>
        Block
      </MazBtn>
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Colors & sizes
      </h4>
      <div
        v-for="type in btnTypes"
        :key="`normal-${type}`"
        class="btn-container"
      >
        <MazBtn
          v-for="size in btnSizes"
          :key="`normal-${type}-${size}`"
          :size="size"
          :color="type"
        >
          {{ type }} {{ size }}
        </MazBtn>
      </div>
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Outline
      </h4>
      <div
        v-for="type in btnTypes"
        :key="`ountline-${type}`"
        class="btn-container"
      >
        <MazBtn
          v-for="size in btnSizes"
          :key="`outline-${type}-${size}`"
          :size="size"
          :color="type"
          outline
        >
          {{ type }} {{ size }}
        </MazBtn>
      </div>
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Rounded
      </h4>
      <div
        v-for="type in btnTypes"
        :key="`rounded-${type}`"
        class="btn-container"
      >
        <MazBtn
          v-for="size in btnSizes"
          :key="`rounded-${type}-${size}`"
          :size="size"
          :color="type"
          rounded
        >
          {{ type }} {{ size }}
        </MazBtn>
      </div>
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Fab
      </h4>
      <div
        v-for="type in btnTypes"
        :key="`fab-${type}`"
        class="btn-container"
      >
        <MazBtn
          v-for="size in btnSizes"
          :key="`fab-${type}-${size}`"
          :size="size"
          :color="type"
          fab
        >
          {{ size }}
        </MazBtn>
      </div>
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Loading
      </h4>

      <div
        v-for="type in btnTypes"
        :key="`loading-${type}`"
        class="btn-container"
      >
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          :color="type"
          loading
        >
          loading {{ size }}
        </MazBtn>
      </div>
    </ComponentContainer>
    <ComponentContainer
      code="<template>
  <MazBtn
    left-icon-name=&quot;person&quot;
    right-icon-name=&quot;delete&quot;
  >
    Icon
  </MazBtn>
  <MazBtn>
    <i
      slot=&quot;icon-left&quot;
      class=&quot;material-icons&quot;
    >
      lock
    </i>
    Slot icon
    <i
      slot=&quot;icon-right&quot;
      class=&quot;material-icons&quot;
    >
      room
    </i>
  </MazBtn>
  <MazBtn
    left-icon-name=&quot;person&quot;
    right-icon-name=&quot;delete&quot;
    outline
    color=&quot;secondary&quot;
  >
    outline
  </MazBtn>
  <MazBtn
    left-icon-name=&quot;person&quot;
    fab
    color=&quot;third&quot;
  />
  <MazBtn
    left-icon-name=&quot;person&quot;
    right-icon-name=&quot;delete&quot;
    rounded
    color=&quot;danger&quot;
  >
    rounded
  </MazBtn>
  <MazBtn
    left-icon-name=&quot;person&quot;
    right-icon-name=&quot;delete&quot;
    disabled
  >
    Disabled
  </MazBtn>
  <MazBtn
    left-icon-name=&quot;person&quot;
    right-icon-name=&quot;delete&quot;
    loading
  >
    Loading
  </MazBtn>
</template>"
    >
      <h4
        id="icon"
        class="maz-mb-3"
      >
        Icon
      </h4>
      <div class="maz-mb-3">
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          class="maz-mr-2 maz-mb-2"
          left-icon-name="person"
          right-icon-name="delete"
        >
          Icon
        </MazBtn>
      </div>
      <div class="maz-mb-3">
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          class="maz-mr-2 maz-mb-2"
        >
          <i
            slot="icon-left"
            class="material-icons"
          >
            lock
          </i>
          Slot icon
          <i
            slot="icon-right"
            class="material-icons"
          >
            room
          </i>
        </MazBtn>
      </div>
      <div class="maz-mb-3">
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          class="maz-mr-2 maz-mb-2"
          left-icon-name="person"
          right-icon-name="delete"
          outline
          color="secondary"
        >
          outline
        </MazBtn>
      </div>
      <div class="maz-mb-3">
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          class="maz-mr-2 maz-mb-2"
          left-icon-name="person"
          fab
          color="third"
        />
      </div>
      <div class="maz-mb-3">
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          class="maz-mr-2 maz-mb-2"
          left-icon-name="person"
          right-icon-name="delete"
          rounded
          color="danger"
        >
          rounded
        </MazBtn>
      </div>
      <div class="maz-mb-3">
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          class="maz-mr-2 maz-mb-2"
          left-icon-name="person"
          right-icon-name="delete"
          disabled
        >
          Disabled
        </MazBtn>
      </div>
      <div>
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          class="maz-mr-2 maz-mb-2"
          left-icon-name="person"
          right-icon-name="delete"
          loading
        >
          Loading
        </MazBtn>
      </div>
    </ComponentContainer>
    <ComponentContainer>
      <h4 class="maz-mb-3">
        Disabled
      </h4>
      <div class="btn-container">
        <MazBtn
          v-for="size in btnSizes"
          :key="`loading-${size}`"
          :size="size"
          disabled
          outline
        >
          Disabled {{ size }}
        </MazBtn>
      </div>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >
    <h3>
      How to use it ?
    </h3>
    <CodeContainer
      language="html"
      class="maz-mb-0"
      code="<template>
  <MazBtn>
    Basic
  </MazBtn>
</template>

<script>
  import { MazBtn } from 'maz-ui'
  export default {
    components: { Mazbtn }
  }
</script>"
    />
  </div>
</template>

<script>
import { COLORS } from '@/constantes'

export default {
  name: 'MazBtnDoc',
  data () {
    return {
      btnTypes: COLORS,
      btnSizes: ['xl', 'lg', 'md', 'sm', 'mini'],
      codeExample: `<template>
  <MazBtn>
    Basic
  </MazBtn>
  <MazBtn rounded>
    Rounded
  </MazBtn>
  <MazBtn outline>
    Outline
  </MazBtn>
  <MazBtn fab>
    Fab
  </MazBtn>
  <MazBtn loading>
    Loading
  </MazBtn>
  <MazBtn disabled>
    Disabled
  </MazBtn>
  <MazBtn block>
    Block
  </MazBtn>
  <MazBtn href="/documentation/maz-btn">
    It's a link
  </MazBtn>
  <MazBtn :to="{ name: 'documentation-maz-btn' }">
    It's a router link
  </MazBtn>
</template>`
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-container {
    button,
    a {
      margin: 5px;
    }
  }
</style>
