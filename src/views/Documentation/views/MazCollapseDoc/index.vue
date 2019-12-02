<template>
  <div class="maz-collapse-doc flex flex--wrap">
    <div class="flex-1 mr-4">
      <ComponentContainer
        :code="codeLight"
      >
        <MazCollapse>
          <div slot="header-text">
            Toggle collapse
          </div>
          <div class="p-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
        </MazCollapse>
      </ComponentContainer>
    </div>
    <div class="flex-1">
      <ComponentContainer
        dark
        :code="codeDark"
      >
        <MazCollapse
          dark
          open
        >
          <div slot="header-text">
            Toggle collapse
          </div>
          <div class="p-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
        </MazCollapse>
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazCollapseDoc',
    data () {
      return {
        codeLight: `<MazCollapse>
  <div slot="header-text">
    Toggle collapse
  </div>
  <div class="p-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
</MazCollapse>`,
        codeDark: `<MazCollapse
  dark
  open
>
  <div slot="header-text">
    Toggle collapse
  </div>
  <div class="p-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
</MazCollapse>`
      }
    }
  }
</script>
