<template>
  <div class="md-renderer">
    <component :is="dynamicComponent" />
  </div>
</template>

<script>
  export default {
    name: 'MdRenderer',
    props: {
      fileName: { type: String, required: true }
    },
    computed: {
      dynamicComponent () {
        const markdown = require(`@/../packages/components/${this.fileName}/README.md`)
        return markdown.vue.component
      }
    }
  }
</script>

<style lang="scss">
  .frontmatter-markdown {
    margin: auto;
    max-width: 42em;
    background-color: $bg-color;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: bold;
    }

    h1 {
      color: $text-color;
      font-size: 28pt;
    }

    h2 {
      border-bottom: 1px solid $hover-color;
      color: $text-color;
      font-size: 24px;
    }

    h3 {
      font-size: 18px;
    }

    h4 {
      font-size: 16px;
    }

    h5 {
      font-size: 14px;
    }

    h6 {
      color: $muted-color;
      background-color: inherit;
      font-size: 14px;
    }

    hr {
      height: .2em;
      border: 0;
      color: $hover-color;
      background-color: $hover-color;
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
      border: 1px solid $hover-color;
      border-radius: 3px;
      padding: 5px;
    }

    tr:nth-child(even) {
      background-color: $hover-color;
    }

    a,
    a:visited {
      color: #4183C4;
      background-color: inherit;
      text-decoration: none;
    }

    #message {
      border-radius: 6px;
      border: 1px solid $hover-color;
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
      border: 1px solid $hover-color;
      background-color: $hover-color;
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
      border: 1px solid $hover-color;
      margin: 0 2px;
      padding: 0 5px;
    }

    pre {
      border: 1px solid $hover-color;
      overflow: auto;
      padding: 4px 8px;
    }

    pre > code {
      border: 0;
      margin: 0;
      padding: 0;
    }

    #ws { background-color: $hover-color; }

    .send { color: $success-color; }
    .server { color: #79B; }
    .error { color: $danger-color; }

    blockquote {
      background: $hover-color;
      border-left: 5px solid #CCC;
      padding: .5em 10px;
    }

    blockquote p {
      display: inline;
    }
  }

  .is-dark .frontmatter-markdown {
    background-color: $bg-color-dark;
    color: $text-color-dark;

    h1 {
      color: $text-color-dark;
    }

    h2 {
      border-bottom: 1px solid $hover-color-dark;
      color: $text-color-dark;
    }

    h6 {
      color: $muted-color-dark;
    }

    table,
    th,
    td {
      border: 1px solid $hover-color-dark;
    }

    tr:nth-child(even) {
      background-color: $hover-color-dark;
    }

    code,
    pre {
      background-color: $hover-color-dark-l;
      border: 1px solid $hover-color-dark-l;
    }

    blockquote {
      background: $hover-color-dark;
      border-left: 5px solid $hover-color-dark-l;
    }
  }
</style>
