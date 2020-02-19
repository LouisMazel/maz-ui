<template>
  <div class="get-started">
    <h2>
      Get Started
    </h2>
    <h3>NPM</h3>
    <CodeContainer
      :code="codeBase"
      class="my-4"
    />

    <h2>
      On demande
    </h2>

    <p>
      With the help of babel-plugin-component, we can import components we actually need, making the project smaller than otherwise.
    </p>

    <p>First, install babel-plugin-component:</p>

    <CodeContainer
      :code="`npm install babel-plugin-component -D`"
      class="my-4"
    />

    <p>Then edit .babelrc:</p>

    <CodeContainer
      :code="configBabelPluginComponent"
      class="my-4"
    />

    <p>Now you can do that</p>

    <CodeContainer
      :code="codeCustom"
      class="my-4"
    />
  </div>
</template>

<script>
  export default {
    name: 'GetStarted',
    data () {
      return {
        codeBase: `import Vue from 'vue';
import 'maz-ui/lib/maz-ui.css';
import MazUi from 'maz-ui';
import App from './App.vue';

Vue.use(MazUi);

new Vue({
  el: '#app',
  render: h => h(App)
});`,
        codeCustom: `import Vue from 'vue';
import 'maz-ui/lib/maz-ui.css';
import { MazBtn, MazSelect } from 'maz-ui';
import App from './App.vue';

Vue.component(MazBtn.name, MazBtn);
Vue.component(MazSelect.name, MazSelect);
/* ou
 * Vue.use(MazBtn)
 * Vue.use(MazSelect)
 */

new Vue({
  el: '#app',
  render: h => h(App)
});`,
        configBabelPluginComponent: `{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "maz-ui"
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
