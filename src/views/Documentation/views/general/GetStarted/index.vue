<template>
  <div class="get-started">
    <h2>
      Get Started
    </h2>
    <h3>Vue.JS</h3>
    <CodeContainer
      :code="codeBase"
    />

    <h3 class="">
      Nuxt.JS
    </h3>

    <CodeContainer
      :code="`// nuxt.config.js

module.exports = {
  plugins: [
    ...
    '~/plugins/maz-ui'
    ...
  ]
}`"
    />

    <CodeContainer
      :code="`// plugin/maz-ui/index.js

import Vue from 'vue'
import 'maz-ui/lib/maz-ui.css'
import MazUi from 'maz-ui'

Vue.use(MazUi)`"
    />

    <h2 class="mt-3">
      On demand
    </h2>

    <h4>
      Imported only the components you need
    </h4>

    <p>
      With the help of babel-plugin-component, we can import components we
      actually need, making the project smaller than otherwise.
    </p>

    <p>First, install babel-plugin-component:</p>

    <CodeContainer
      :code="codeBabelPLugin"
    />

    <h3>
      Vue.JS babel config
    </h3>

    <CodeContainer
      :code="configBabelPluginComponent"
    />

    <h3>
      Nuxt.JS babel config
    </h3>

    <CodeContainer
      :code="`// nuxt.config.js

module.exports = {
  plugins: [
    ...
    '~/plugins/maz-ui'
    ...
  ],
  build: {
    babel: {
      plugins: [
        ['component', {
          libraryName: 'maz-ui',
          style: false
        }]
      ]
    }
  }
}`"
    />

    <h3>
      Now import component as you want
    </h3>

    <CodeContainer
      :code="codeCustom"
    />
  </div>
</template>

<script>
export default {
  name: 'GetStarted',
  data () {
    return {
      codeBase: `// main.js

import Vue from 'vue'
import 'maz-ui/lib/maz-ui.css'
import MazUi from 'maz-ui'

Vue.use(MazUi)`,
      codeBabelPLugin: `npm install babel-plugin-component -D

/*
 * or yarn add babel-plugin-component -D
 */`,
      codeCustom: `// main.js or

import Vue from 'vue'
import 'maz-ui/lib/maz-ui.css'
import { MazBtn, MazSelect } from 'maz-ui'

Vue.use(MazBtn)
Vue.use(MazSelect)

/* or
 * Vue.component(MazBtn.name, MazBtn)
 * Vue.component(MazSelect.name, MazSelect)
 */`,
      configBabelPluginComponent: `// .babelrc

{
  "plugins": [
    [
      "component",
      {
        "libraryName": "maz-ui",
        "style": false
      }
    ]
  ]
}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .get-started {
    h2 {
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 15px;
    }
  }
</style>
