<template>
  <div class="get-started">
    <h2>
      Get Started
    </h2>
    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
    <div class="get-started__container maz-flex">
      <div class="get-started__item maz-flex-1 maz-p-4 maz-w-100">
        <h3 class="mt-3">
          On demand (recommanded)
        </h3>

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

        <h4>
          Vue.JS babel config
        </h4>

        <CodeContainer
          :code="configBabelPluginComponent"
          language="json"
        />

        <h4>
          Nuxt.JS babel config
        </h4>

        <CodeContainer
          :code="`// nuxt.config.js

module.exports = {
  plugins: [
    ...
    './plugins/maz-ui'
    ...
  ],
  build: {
    babel: {
      plugins: [
        ['component', { libraryName: 'maz-ui' }]
      ]
    }
  }
}`"
        />

        <h4>
          Now import component as you want
        </h4>

        <CodeContainer
          :code="codeCustom"
        />
      </div>

      <div class="get-started__item maz-flex-1 maz-p-4 maz-border-left">
        <h3>Fully install</h3>

        <h4>Vue.JS</h4>

        <CodeContainer
          :code="codeBase"
        />

        <h4 class="">
          Nuxt.JS
        </h4>

        <CodeContainer
          :code="`// nuxt.config.js

module.exports = {
  plugins: [
    ...
    './plugins/maz-ui'
    ...
  ]
}`"
        />

        <CodeContainer
          :code="`// plugin/maz-ui/index.js

import Vue from 'vue'
import MazUi from 'maz-ui'

Vue.use(MazUi)`"
        />
      </div>
    </div>
    <div class="get-started__item maz-px-4">
      <h3 class="maz-mb-0">
        All components you can import
      </h3>
      <CodeContainer
        :code="`import Vue from 'vue'
import {
  MazBtn,
  MazBtnGroup,
  MazCheckbox,
  MazCollapse,
  MazDialog,
  MazDraggableList,
  MazDropzone,
  MazFlex,
  MazInput,
  MazInputTags,
  MazList,
  MazListItem,
  MazLoader,
  MazPagination,
  MazPicker,
  MazPhoneNumberInput,
  MazReadMore,
  MazResponsiveMenu,
  MazSearch,
  MazSelect,
  MazSidebar,
  MazSpinner,
  MazSwitch,
  MazTabsBar,
  MazTabsContent,
  MazTabsContentItem,
  MazTransitionExpand
} from 'maz-ui'

Vue.use(MazBtn)
Vue.use(MazBtnGroup)
Vue.use(MazCheckbox)
Vue.use(MazCollapse)
Vue.use(MazDialog)
Vue.use(MazDraggableList)
Vue.use(MazDropzone)
Vue.use(MazFlex)
Vue.use(MazInput)
Vue.use(MazInputTags)
Vue.use(MazList)
Vue.use(MazListItem)
Vue.use(MazLoader)
Vue.use(MazPagination)
Vue.use(MazPicker)
Vue.use(MazPhoneNumberInput)
Vue.use(MazReadMore)
Vue.use(MazResponsiveMenu)
Vue.use(MazSearch)
Vue.use(MazSelect)
Vue.use(MazSidebar)
Vue.use(MazSpinner)
Vue.use(MazSwitch)
Vue.use(MazTabsBar)
Vue.use(MazTabsContent)
Vue.use(MazTabsContentItem)
Vue.use(MazTransitionExpand)`"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GetStarted',
  data () {
    return {
      codeBase: `// main.js

import Vue from 'vue'
import MazUi from 'maz-ui'

Vue.use(MazUi)`,
      codeBabelPLugin: `npm install babel-plugin-component -D

/*
 * or yarn add babel-plugin-component -D
 */`,
      codeCustom: `/*
* main.js
* ./plugin/maz-ui/index.js for Nuxt.JS
*/

import Vue from 'vue'
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
    ['component', { libraryName: 'maz-ui' }]
  ]
}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .get-started {
    h3:not(.maz-mb-0) {
      margin-bottom: 30px;
    }

    p {
      margin: 15px 0;
    }

    @media screen and (max-width: $breakpoint-laptop-s) {
      &__container {
        flex-direction: column;
      }

      &__item {
        padding: 0;
        border: none;
      }
    }
  }
</style>
