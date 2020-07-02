<template>
  <div class="md-renderer">
    <component
      :is="component"
      v-for="(component, i) in dynamicComponents"
      :key="i"
      class="frontmatter-markdown"
    />
  </div>
</template>

<script>
export default {
  name: 'MdRenderer',
  props: {
    fileName: { type: String, required: true }
  },
  computed: {
    dynamicComponents () {
      let components
      if (this.fileName === 'MazList') {
        components = [
          require('@/../packages/components/MazList/README.md').vue.component,
          require('@/../packages/components/MazList/MazListItem/README.md').vue
            .component
        ]
      } else if (this.fileName === 'MazTabsLayout') {
        components = [
          require('@/../packages/components/MazTabsLayout/MazTabsBar/README.md')
            .vue.component,
          require('@/../packages/components/MazTabsLayout/MazTabsContent/README.md')
            .vue.component,
          require('@/../packages/components/MazTabsLayout/MazTabsContentItem/README.md')
            .vue.component
        ]
      } else {
        components = [
          require(`@/../packages/components/${this.fileName}/README.md`).vue
            .component
        ]
      }
      return components
    }
  }
}
</script>

<style lang="scss">
  .frontmatter-markdown {
    margin: auto;
    padding: 20px;
    background-color: $bg-color;
    font-size: 13px;

    h1 {
      color: #333;
      font-size: 2rem;
      margin-bottom: 20px;
    }

    h2 {
      border-bottom: 1px solid $hover-bg-color;
      font-family: GeomanistLight, sans-serif;
      color: #333;
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.3rem;
    }

    h4 {
      font-size: 1.2rem;
    }

    h5 {
      font-size: 1.1rem;
    }

    h6 {
      color: $muted-color;
      background-color: inherit;
      font-size: 1rem;
    }

    hr {
      height: .2rem;
      border: 0;
      color: $hover-bg-color;
      background-color: $hover-bg-color;
    }

    p,
    blockquote,
    ul,
    ol,
    dl,
    li,
    table,
    pre {
      margin: 15px 0;
    }

    img {
      max-width: 100%;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    table,
    th,
    td {
      border: 1px solid $hover-bg-color;
      border-radius: 3px;
      padding: 5px;
    }

    tr:nth-child(even) {
      background-color: $hover-bg-color;
    }

    a,
    a:visited {
      color: dodgerblue;
      background-color: inherit;
      text-decoration: none;
    }

    #message {
      border-radius: 6px;
      border: 1px solid $hover-bg-color;
      display: block;
      width: 100%;
      height: 60px;
      margin: 6px 0;
    }

    button,
    #ws {
      font-size: 10pt;
      padding: 4px 6px;
      border-radius: 5px;
      border: 1px solid $hover-bg-color;
      background-color: $hover-bg-color;
    }

    code,
    pre,
    #ws,
    #message {
      font-family: Monaco, monospace;
      font-size: 10pt;
      border-radius: 3px;
      background-color: #DEDEDE;
      color: inherit;
    }

    code {
      border: 1px solid $hover-bg-color;
      margin: 0 2px;
      padding: 0 5px;
    }

    pre {
      border: 1px solid $hover-bg-color;
      overflow: auto;
      padding: 4px 8px;
    }

    pre > code {
      border: 0;
      margin: 0;
      padding: 0;
    }

    #ws {
      background-color: $hover-bg-color;
    }

    .send {
      color: $success-color;
    }

    .server {
      color: #79B;
    }

    .error {
      color: $danger-color;
    }

    blockquote {
      background: $hover-bg-color;
      border-left: 4px solid $primary-color;
      // border-radius: $border-radius;
      padding: .5em 10px;
    }

    blockquote p {
      display: inline;
    }
  }

  .maz-is-dark .frontmatter-markdown {
    background-color: $bg-color-dark;
    color: $text-color-dark;

    h1 {
      color: $text-color-dark;
    }

    h2 {
      border-bottom: 1px solid $hover-bg-color-dark;
      color: $text-color-dark;
    }

    h6 {
      color: $muted-color-dark;
    }

    table,
    th,
    td {
      border: 1px solid $hover-bg-color-dark;
    }

    tr:nth-child(even) {
      background-color: $hover-bg-color-dark;
    }

    code,
    pre {
      background-color: $hover-bg-color-dark-l;
      border: 1px solid $hover-bg-color-dark-l;
    }

    blockquote {
      background: $hover-bg-color-dark;
    }
  }
</style>
