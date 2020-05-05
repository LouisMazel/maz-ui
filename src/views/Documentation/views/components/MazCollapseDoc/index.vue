<template>
  <div class="maz-collapse-doc flex flex--wrap">
    <div class="flex-1">
      <ComponentContainer :code="codeLight">
        <MazCollapse class="mb-5">
          <div slot="header-text">
            Standalone collapse
          </div>
          <div class="p-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
        </MazCollapse>

        <MazCollapse v-model="hasCollapseOpen">
          <div slot="header-text">
            Programmatically collapse 2
          </div>
          <div class="p-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
        </MazCollapse>

        <MazBtn
          class="mt-3"
          @click="hasCollapseOpen = !hasCollapseOpen">
          Toggle collapse 2
        </MazBtn>
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazCollapseDoc',
  data () {
    return {
      hasCollapseOpen: true,
      codeLight: `<MazCollapse class="mb-5">
  <div slot="header-text">
    Standalone collapse
  </div>
  <div class="p-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
</MazCollapse>

<MazCollapse v-model="hasCollapseOpen">
  <div slot="header-text">
    Programmatically collapse 2
  </div>
  <div class="p-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
</MazCollapse>

<MazBtn
  class="mt-3"
  @click="hasCollapseOpen = !hasCollapseOpen"
>
  Open Collapse 2
</MazBtn>

export default {
  data () {
    return {
      hasCollapseOpen: true
    }
  }
}`
    }
  }
}
</script>
