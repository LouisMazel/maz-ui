import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
import 'highlight.js/styles/default.css'

Vue.use(VueHighlightJS, {
  languages: {
    javascript,
    bash
  }
})
