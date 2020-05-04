(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MazInputDoc"],{6274:function(e,a,l){"use strict";var n=l("982f"),t=l.n(n);t.a},"982f":function(e,a,l){},e773:function(e,a,l){"use strict";l.r(a);var n=function(){var e=this,a=e.$createElement,l=e._self._c||a;return l("div",{staticClass:"maz-input-doc"},[l("ComponentContainer",{attrs:{code:e.codeExample}},[l("MazInput",{attrs:{clearable:"",label:"Custom label/placeholder text"},model:{value:e.exampleValue,callback:function(a){e.exampleValue=a},expression:"exampleValue"}})],1),l("ComponentContainer",{attrs:{code:e.codePasswordExample}},[l("MazInput",{staticClass:"mb-3",attrs:{label:"Name",autocomplete:"new-name","left-icon-name":"person","right-icon-name":"favorite",clearable:""},model:{value:e.nameValue,callback:function(a){e.nameValue=a},expression:"nameValue"}}),l("MazInput",{staticClass:"mb-3",attrs:{label:"E-mail",autocomplete:"new-email",clearable:""},model:{value:e.emailValue,callback:function(a){e.emailValue=a},expression:"emailValue"}},[l("i",{staticClass:"material-icons",attrs:{slot:"input-icon-left"},slot:"input-icon-left"},[e._v(" email ")])]),l("MazInput",{staticClass:"mb-3",attrs:{label:"Password",type:"password",autocomplete:"new-password","left-icon-name":"lock",clearable:""},model:{value:e.passwordValue,callback:function(a){e.passwordValue=a},expression:"passwordValue"}}),l("MazInput",{attrs:{label:"Comment",autocomplete:"new-comment","left-icon-name":"comment",textarea:""},model:{value:e.commentValue,callback:function(a){e.commentValue=a},expression:"commentValue"}})],1),e._l(e.inputTypes,(function(a){return l("div",{key:a,staticClass:"flex mt-3 flex--wrap"},[l("div",{staticClass:"flex-component flex-1"},[l("h3",[e._v(e._s(e._f("capitalize")(a)))]),l("ComponentContainer",[l("MazInput",{attrs:{error:"error"===a,valid:"valid"===a,disabled:"disabled"===a,clearable:"clearable"===a,hint:"hint"===a?"Hint value":null,loading:"loading"===a,required:"required"===a,size:"sm"===a?"sm":"lg"===a?"lg":null},model:{value:e.inputValue,callback:function(a){e.inputValue=a},expression:"inputValue"}})],1),l("ComponentContainer",[l("MazInput",{attrs:{error:"error"===a,valid:"valid"===a,disabled:"disabled"===a,clearable:"clearable"===a,hint:"hint"===a?"Hint value":null,loading:"loading"===a,required:"required"===a,size:"sm"===a?"sm":"lg"===a?"lg":null},model:{value:e.withValue,callback:function(a){e.withValue=a},expression:"withValue"}})],1)],1)])}))],2)},t=[],o={name:"MazInputDoc",data:function(){return{inputValue:null,withValue:"The value entered",disabledValue:"",inputTypes:["basic","error","valid","disabled","hint","clearable","sm","lg","required","loading"],exampleValue:null,nameValue:"your name",emailValue:"youremail@domain.com",passwordValue:"password",commentValue:"Your comment",codeExample:'<template>\n  <MazInput\n    v-model="exampleValue"\n    label="Custom label/placeholder text"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      exampleValue: \'\'\n    }\n  }\n}',codePasswordExample:'<template>\n  <MazInput\n    v-model="nameValue"\n    label="Name"\n    autocomplete="new-name"\n    class="mb-3"\n    left-icon-name="person"\n    right-icon-name="favorite"\n    clearable\n  />\n  <MazInput\n    v-model="emailValue"\n    label="E-mail"\n    autocomplete="new-email"\n    class="mb-3"\n    clearable\n  >\n    <i\n      slot="input-icon-left"\n      class="material-icons"\n    >\n      email\n    </i>\n  </MazInput>\n  <MazInput\n    v-model="passwordValue"\n    label="Password"\n    type="password"\n    autocomplete="new-password"\n    left-icon-name="lock"\n    clearable\n  />\n  <MazInput\n    v-model="commentValue"\n    label="Comment"\n    autocomplete="new-comment"\n    left-icon-name="comment"\n    textarea\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      nameValue: \'your name\',\n      emailValue: \'youremail@domain.com\',\n      passwordValue: \'password\',\n      commentValue: \'Your comment\'\n    }\n  }\n}'}}},u=o,i=(l("6274"),l("2877")),m=Object(i["a"])(u,n,t,!1,null,"0e937434",null);a["default"]=m.exports}}]);
//# sourceMappingURL=MazInputDoc.75278c6d.js.map