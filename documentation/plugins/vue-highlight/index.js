import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import bash from 'highlight.js/lib/languages/bash'
import 'highlight.js/styles/default.css'
import './override-highlight.scss'

Vue.use(VueHighlightJS, {
  languages: {
    css,
    scss,
    javascript,
    bash
  }
})
