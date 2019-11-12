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
    <h3>Yarn</h3>
    <CodeContainer>
      yarn add vue-mazel-ui
    </CodeContainer>
    <h3>CDN</h3>
  </div>
</template>

<script>
  export default {
    name: 'GetStarted'
  }
</script>
