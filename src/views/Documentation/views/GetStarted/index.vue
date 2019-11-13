<template>
  <div class="get-started">
    <h2 class="mb-4">
      Get Started
    </h2>
    <h3>NPM</h3>
    <CodeContainer>
      import Vue from 'vue'; <br>
      import VueMazelUi from 'vue-mazel-ui'; <br>
      import App from './App.vue'; <br>
      <br>
      Vue.use(VueMazelUi);<br>
      <br>
      new Vue({<br>
      el: '#app',<br>
      render: h => h(App)<br>
      });
    </CodeContainer>
  </div>
</template>

<script>
  export default {
    name: 'GetStarted'
  }
</script>
