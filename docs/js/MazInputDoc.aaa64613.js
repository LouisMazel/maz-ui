(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MazInputDoc"],{"5d1f":function(e,a,n){"use strict";var l=n("97f2"),t=n.n(l);t.a},"97f2":function(e,a,n){},e773:function(e,a,n){"use strict";n.r(a);var l=function(){var e=this,a=e.$createElement,n=e._self._c||a;return n("div",{staticClass:"maz-input-doc"},[n("ComponentContainer",{attrs:{code:e.codeExample}},[n("MazInput",{attrs:{clearable:"",placeholder:"Custom label & placeholder text"},model:{value:e.exampleValue,callback:function(a){e.exampleValue=a},expression:"exampleValue"}})],1),n("ComponentContainer",{attrs:{code:e.codePasswordExample}},[n("MazInput",{staticClass:"maz-mb-3",attrs:{placeholder:"Name",autocomplete:"new-name","left-icon-name":"person","right-icon-name":"favorite",clearable:""},model:{value:e.nameValue,callback:function(a){e.nameValue=a},expression:"nameValue"}}),n("MazInput",{staticClass:"maz-mb-3",attrs:{placeholder:"E-mail",autocomplete:"new-email",clearable:""},model:{value:e.emailValue,callback:function(a){e.emailValue=a},expression:"emailValue"}},[e.hasIcon?n("i",{staticClass:"material-icons",attrs:{slot:"input-icon-left"},slot:"input-icon-left"},[e._v(" email ")]):e._e(),e.hasIcon?n("i",{staticClass:"material-icons",attrs:{slot:"input-icon-right"},slot:"input-icon-right"},[e._v(" done ")]):e._e()]),n("MazInput",{staticClass:"maz-mb-3",attrs:{placeholder:"Password",type:"password",autocomplete:"new-password","left-icon-name":"lock",clearable:""},model:{value:e.passwordValue,callback:function(a){e.passwordValue=a},expression:"passwordValue"}}),n("MazInput",{attrs:{placeholder:"Comment",autocomplete:"new-comment","left-icon-name":"comment",textarea:""},model:{value:e.commentValue,callback:function(a){e.commentValue=a},expression:"commentValue"}})],1),e._l(e.inputTypes,(function(a){return n("div",{key:a,staticClass:"flex maz-mt-3 maz-flex-wrap"},[n("div",{staticClass:"flex-component maz-flex-1"},[n("h3",[e._v(e._s(e._f("capitalize")(a)))]),n("ComponentContainer",[n("MazInput",{attrs:{error:"error"===a,valid:"valid"===a,disabled:"disabled"===a,clearable:"clearable"===a,hint:"hint"===a?"Hint value":null,loading:"loading"===a,required:"required"===a,size:"sm"===a?"sm":"lg"===a?"lg":null},model:{value:e.inputValue,callback:function(a){e.inputValue=a},expression:"inputValue"}})],1),n("ComponentContainer",[n("MazInput",{attrs:{error:"error"===a,valid:"valid"===a,disabled:"disabled"===a,clearable:"clearable"===a,hint:"hint"===a?"Hint value":null,loading:"loading"===a,required:"required"===a,size:"sm"===a?"sm":"lg"===a?"lg":null},model:{value:e.withValue,callback:function(a){e.withValue=a},expression:"withValue"}})],1)],1)])}))],2)},t=[],o={name:"MazInputDoc",data:function(){return{inputValue:null,hasIcon:!0,withValue:"The value entered",disabledValue:"",inputTypes:["basic","error","valid","disabled","hint","clearable","sm","lg","required","loading"],exampleValue:null,nameValue:"your name",emailValue:"youremail@domain.com",passwordValue:"password",commentValue:"Your comment",codeExample:'<template>\n  <MazInput\n    v-model="exampleValue"\n    placeholder="Custom placeholder/placeholder text"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      exampleValue: \'\'\n    }\n  }\n}',codePasswordExample:'<template>\n  <MazInput\n    v-model="nameValue"\n    placeholder="Name"\n    autocomplete="new-name"\n    class="maz-mb-3"\n    left-icon-name="person"\n    right-icon-name="favorite"\n    clearable\n  />\n  <MazInput\n    v-model="emailValue"\n    placeholder="E-mail"\n    autocomplete="new-email"\n    class="maz-mb-3"\n    clearable\n  >\n    <MazInput\n      v-model="emailValue"\n      placeholder="E-mail"\n      autocomplete="new-email"\n      class="maz-mb-3"\n      clearable\n    >\n      <i\n        slot="input-icon-left"\n        class="material-icons"\n      >\n        lock\n      </i>\n      <i\n        slot="input-icon-right"\n        class="material-icons"\n      >\n        email\n      </i>\n    </MazInput>\n  </MazInput>\n  <MazInput\n    v-model="passwordValue"\n    placeholder="Password"\n    type="password"\n    autocomplete="new-password"\n    left-icon-name="lock"\n    clearable\n  />\n  <MazInput\n    v-model="commentValue"\n    placeholder="Comment"\n    autocomplete="new-comment"\n    left-icon-name="comment"\n    textarea\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      nameValue: \'your name\',\n      emailValue: \'youremail@domain.com\',\n      passwordValue: \'password\',\n      commentValue: \'Your comment\'\n    }\n  }\n}'}}},i=o,m=(n("5d1f"),n("2877")),s=Object(m["a"])(i,l,t,!1,null,"5b01caa6",null);a["default"]=s.exports}}]);
//# sourceMappingURL=MazInputDoc.aaa64613.js.map