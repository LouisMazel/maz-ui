(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MazSelectDoc"],{"700f":function(e,l,t){"use strict";t.r(l);var a=function(){var e=this,l=e.$createElement,t=e._self._c||l;return t("div",{staticClass:"maz-input-doc"},[t("h3",[e._v(" Informations ")]),t("p",[e._v(" This component uses "),t("router-link",{attrs:{to:{name:"MazInputDoc"}}},[e._v(" MazInput ")]),e._v(" and therefore inherits all these options ")],1),t("ComponentContainer",{attrs:{code:e.codeExample}},[t("MazSelect",{attrs:{placeholder:"Custom label & placeholder text",options:e.options},model:{value:e.selectValueExample,callback:function(l){e.selectValueExample=l},expression:"selectValueExample"}})],1),t("div",{staticClass:"maz-flex maz-flex-wrap"},[t("div",{staticClass:"maz-flex-1"},[t("ComponentContainer",[t("h4",{staticClass:"maz-mb-3"},[e._v(" Basic ")]),t("MazSelect",{attrs:{options:e.options},model:{value:e.selectValue,callback:function(l){e.selectValue=l},expression:"selectValue"}})],1),t("ComponentContainer",[t("h4",{staticClass:"maz-mb-3"},[e._v(" Error ")]),t("MazSelect",{attrs:{options:e.options,error:""},model:{value:e.selectValue,callback:function(l){e.selectValue=l},expression:"selectValue"}})],1),t("ComponentContainer",[t("h4",{staticClass:"maz-mb-3"},[e._v(" Valid ")]),t("MazSelect",{attrs:{options:e.options,valid:""},model:{value:e.selectValue,callback:function(l){e.selectValue=l},expression:"selectValue"}})],1)],1)])],1)},n=[],o={name:"MazInputDoc",data:function(){return{selectValue:"",selectValueExample:"",options:[{label:"None",value:null},{label:"First option",value:"first"},{label:"Second option",value:"second"},{label:"Third option",value:"third"}],codeExample:"<template>\n  <MazSelect\n    v-model=\"selectValueExample\"\n    placeholder=\"Custom label/placeholder text\"\n    :options=\"options\"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      selectValueExample: '',\n      options: [\n        { label: 'None', value: null },\n        { label: 'First option', value: 'first' },\n        { label: 'Second option', value: 'second' },\n        { label: 'Third option', value: 'third' }\n      ]\n    }\n  }\n}"}}},s=o,c=t("2877"),i=Object(c["a"])(s,a,n,!1,null,null,null);l["default"]=i.exports}}]);
//# sourceMappingURL=MazSelectDoc.ce5ac948.js.map