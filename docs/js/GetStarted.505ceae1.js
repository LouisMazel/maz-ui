(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["GetStarted"],{"2a2b":function(n,e,a){"use strict";a.r(e);var t=function(){var n=this,e=n.$createElement,a=n._self._c||e;return a("div",{staticClass:"get-started"},[a("div",{staticClass:"get-started__header maz-flex maz-space-between maz-align-center"},[a("h2",[n._v(" Get Started ")]),a("MazBtn",{attrs:{href:"#allComponents"}},[n._v(" List of all components ")])],1),a("hr",{staticClass:"maz-border-top maz-border-solid maz-border-color maz-my-5"}),a("div",{staticClass:"get-started__container maz-flex"},[a("div",{staticClass:"get-started__item maz-flex-1 maz-p-4 maz-w-100"},[a("h3",{staticClass:"mt-3"},[n._v(" On demand (recommanded) ")]),a("h4",[n._v(" Imported only the components you need ")]),a("p",[n._v(" With the help of babel-plugin-component, we can import components we actually need, making the project smaller than otherwise. ")]),a("p",[n._v("First, install babel-plugin-component:")]),a("CodeContainer",{attrs:{code:n.codeBabelPLugin}}),a("h4",[n._v(" Vue.JS babel config ")]),a("CodeContainer",{attrs:{code:n.configBabelPluginComponent}}),a("h4",[n._v(" Nuxt.JS babel config ")]),a("CodeContainer",{attrs:{code:"// nuxt.config.js\n\nmodule.exports = {\n  plugins: [\n    ...\n    './plugins/maz-ui'\n    ...\n  ],\n  build: {\n    babel: {\n      plugins: [\n        [\n          'component', {\n            libraryName: 'maz-ui',\n            styleLibraryName: 'css'\n          }\n        ]\n      ]\n    }\n  }\n}"}}),a("h4",[n._v(" Now import component as you want ")]),a("CodeContainer",{attrs:{code:n.codeCustom}})],1),a("div",{staticClass:"get-started__item maz-flex-1 maz-p-4 maz-border-left"},[a("h3",[n._v("Fully install")]),a("h4",[n._v("Vue.JS")]),a("CodeContainer",{attrs:{code:n.codeBase}}),a("h4",{},[n._v(" Nuxt.JS ")]),a("CodeContainer",{attrs:{code:"// nuxt.config.js\n\nmodule.exports = {\n  plugins: [\n    ...\n    './plugins/maz-ui'\n    ...\n  ]\n}"}}),a("CodeContainer",{attrs:{code:"// plugin/maz-ui/index.js\n\nimport Vue from 'vue'\nimport 'maz-ui/lib/css/index.css'\nimport MazUi from 'maz-ui'\n\nVue.use(MazUi)"}})],1)]),a("hr",{staticClass:"maz-border-top maz-border-solid maz-border-color maz-my-5",attrs:{id:"allComponents"}}),a("div",{staticClass:"get-started__item maz-px-4"},[a("h3",{staticClass:"maz-mb-0"},[n._v(" All components you can import ")]),a("CodeContainer",{attrs:{code:"import Vue from 'vue'\nimport {\n  MazBtn,\n  MazBtnGroup,\n  MazCheckbox,\n  MazCollapse,\n  MazDialog,\n  MazDraggableList,\n  MazDropzone,\n  MazFlex,\n  MazInput,\n  MazInputTags,\n  MazList,\n  MazListItem,\n  MazLoader,\n  MazPagination,\n  MazPicker,\n  MazPhoneNumberInput,\n  MazReadMore,\n  MazResponsiveMenu,\n  MazSearch,\n  MazSelect,\n  MazSidebar,\n  MazSpinner,\n  MazSwitch,\n  MazTabsBar,\n  MazTabsContent,\n  MazTabsContentItem,\n  MazTransitionExpand\n} from 'maz-ui'\n\nVue.use(MazBtn)\nVue.use(MazBtnGroup)\nVue.use(MazCheckbox)\nVue.use(MazCollapse)\nVue.use(MazDialog)\nVue.use(MazDraggableList)\nVue.use(MazDropzone)\nVue.use(MazFlex)\nVue.use(MazInput)\nVue.use(MazInputTags)\nVue.use(MazList)\nVue.use(MazListItem)\nVue.use(MazLoader)\nVue.use(MazPagination)\nVue.use(MazPicker)\nVue.use(MazPhoneNumberInput)\nVue.use(MazReadMore)\nVue.use(MazResponsiveMenu)\nVue.use(MazSearch)\nVue.use(MazSelect)\nVue.use(MazSidebar)\nVue.use(MazSpinner)\nVue.use(MazSwitch)\nVue.use(MazTabsBar)\nVue.use(MazTabsContent)\nVue.use(MazTabsContentItem)\nVue.use(MazTransitionExpand)"}})],1)])},o=[],s={name:"GetStarted",data:function(){return{codeBase:"// main.js\n\nimport Vue from 'vue'\nimport 'maz-ui/lib/css/index.css'\nimport MazUi from 'maz-ui'\n\nVue.use(MazUi)",codeBabelPLugin:"npm install babel-plugin-component -D\n\n/*\n * or yarn add babel-plugin-component -D\n */",codeCustom:"/*\n* main.js\n* ./plugin/maz-ui/index.js for Nuxt.JS\n*/\n\nimport Vue from 'vue'\nimport { MazBtn, MazSelect } from 'maz-ui'\n\nVue.use(MazBtn)\nVue.use(MazSelect)\n\n/* or\n * Vue.component(MazBtn.name, MazBtn)\n * Vue.component(MazSelect.name, MazSelect)\n */",configBabelPluginComponent:"// .babelrc\n\n{\n  \"plugins\": [\n    [\n      'component', {\n        libraryName: 'maz-ui',\n        styleLibraryName: 'css'\n      }\n    ]\n  ]\n}"}}},u=s,i=(a("5227"),a("2877")),r=Object(i["a"])(u,t,o,!1,null,"4da18c7f",null);e["default"]=r.exports},5227:function(n,e,a){"use strict";var t=a("d499"),o=a.n(t);o.a},d499:function(n,e,a){}}]);
//# sourceMappingURL=GetStarted.505ceae1.js.map