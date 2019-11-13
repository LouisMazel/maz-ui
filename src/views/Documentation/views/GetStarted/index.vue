<template>
  <div class="get-started">
    <h2 class="mb-4">
      Get Started
    </h2>
    <h3>NPM</h3>
    <CodeContainer :code="codeBase" />

    Or use some components

    <CodeContainer :code="codeCustom" />
  </div>
</template>

<script>
  export default {
    name: 'GetStarted',
    data () {
      return {
        codeBase: `import Vue from 'vue';
import VueMazelUi from 'vue-mazel-ui';
import App from './App.vue';

Vue.use(VueMazelUi);

new Vue({
  el: '#app',
  render: h => h(App)
});`,
        codeCustom: `import Vue from 'vue';
import { MazBtn, MazSelect } from 'element-ui';
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
});`
      }
    }
  }
</script>
