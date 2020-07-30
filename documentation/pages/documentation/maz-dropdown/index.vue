<template>
  <div class="maz-dropzone-doc">
    <h4>
      Informations
    </h4>
    <p>
      This component uses
      <nuxt-link :to="{ name: 'documentation-maz-btn' }">
        MazBtn
      </nuxt-link>
      and therefore inherits all these options
    </p>
    <ComponentContainer
      code="<template>
  <h4 class=&quot;maz-my-3&quot;>
    On click
  </h4>
  <MazDropdown>
    Click me
    <template #dropdown>
      <MazBtn
        color=&quot;white&quot;
      >
        Item 1
      </MazBtn>
      <MazBtn color=&quot;white&quot;>
        Item 2
      </MazBtn>
      <MazBtn color=&quot;white&quot;>
        Item 3
      </MazBtn>
    </template>
  </MazDropdown>
  <h4 class=&quot;maz-my-3&quot;>
    On hover
  </h4>
  <MazDropdown hover>
    Hover me
    <template #dropdown>
      <MazBtn
        color=&quot;white&quot;
      >
        Item 1
      </MazBtn>
      <MazBtn color=&quot;white&quot;>
        Item 2
      </MazBtn>
      <MazBtn color=&quot;white&quot;>
        Item 3
      </MazBtn>
    </template>
  </MazDropdown>
  <h4 class=&quot;maz-my-3&quot;>
    Position: 'top left' (default: 'bottom right')
  </h4>
  <MazDropdown
    hover
    position=&quot;top left&quot;
    color=&quot;success&quot;
    outline
  >
    Hover me
    <template #dropdown>
      <MazBtn
        color=&quot;white&quot;
      >
        Item 1
      </MazBtn>
      <MazBtn color=&quot;white&quot;>
        Item 2
      </MazBtn>
      <MazBtn color=&quot;white&quot;>
        Item 3
      </MazBtn>
    </template>
  </MazDropdown>
</template>"
    >
      <h4 class="maz-my-3">
        On click
      </h4>
      <MazDropdown>
        Click me
        <template #dropdown>
          <MazBtn
            color="white"
          >
            Item 1
          </MazBtn>
          <MazBtn color="white">
            Item 2
          </MazBtn>
          <MazBtn color="white">
            Item 3
          </MazBtn>
        </template>
      </MazDropdown>
      <h4 class="maz-my-3">
        On hover
      </h4>
      <MazDropdown hover>
        Hover me
        <template #dropdown>
          <MazBtn
            color="white"
          >
            Item 1
          </MazBtn>
          <MazBtn color="white">
            Item 2
          </MazBtn>
          <MazBtn color="white">
            Item 3
          </MazBtn>
        </template>
      </MazDropdown>
      <h4 class="maz-my-3">
        Position: 'top left' (default: 'bottom right')
      </h4>
      <MazDropdown
        hover
        position="top left"
        color="success"
        outline
      >
        Hover me
        <template #dropdown>
          <MazBtn
            color="white"
          >
            Item 1
          </MazBtn>
          <MazBtn color="white">
            Item 2
          </MazBtn>
          <MazBtn color="white">
            Item 3
          </MazBtn>
        </template>
      </MazDropdown>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h4>
      How to use it ?
    </h4>

    <CodeContainer
      language="html"
      code="<template>
  <MazDropdown>
    Dropdown button label
    <template #dropdown>
      Dropdown Content
    </template>
  </MazDropdown>
</template>

<script>
  import { MazDropdown } from 'maz-ui'
  export default {
    components: { MazDropdown }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazDropdownDoc'
}
</script>
