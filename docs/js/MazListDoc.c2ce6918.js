(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MazListDoc"],{c0eb:function(t,s,i){"use strict";i.r(s);var e=function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"maz-list-doc"},[i("ComponentContainer",{attrs:{code:t.codeExample}},[i("div",{staticClass:"lists-container"},[i("div",{staticClass:"list-1"},[i("h2",{staticClass:"mb-2"},[t._v(" Basic list ")]),i("p",{staticClass:"text-muted mb-3"},[t._v(" Any options ")]),i("MazList",t._l(t.items,(function(s){return i("MazListItem",{key:"list-1-"+s.id},[i("p",[t._v(t._s(s.title))]),i("p",{staticClass:"text-muted"},[t._v(" "+t._s(s.id)+" ")])])})),1)],1),i("div",{staticClass:"list-2"},[i("h2",{staticClass:"mb-2"},[t._v(" Hover & animate list ")]),i("MazBtn",{staticClass:"mb-2",attrs:{size:"sm"},on:{click:t.reorderItems}},[t._v(" Shuffle items ")]),i("MazList",{attrs:{transition:""}},t._l(t.items,(function(s){return i("MazListItem",{key:"list-2-"+s.id,attrs:{hover:"",tag:"button"}},[i("p",[t._v(t._s(s.title))]),i("p",{staticClass:"text-muted"},[t._v(" "+t._s(s.id)+" ")])])})),1)],1),i("div",{staticClass:"list-3"},[i("h2",{staticClass:"mb-2"},[t._v(" Scrollable list & no-shadow ")]),i("p",{staticClass:"text-muted mb-3"},[t._v(" Just set `max-height` CSS property to the list ")]),i("MazList",{staticClass:"scrollable-list",attrs:{"no-shadow":""}},t._l(t.items,(function(s){return i("MazListItem",{key:"list-3-"+s.id,attrs:{tag:"button"}},[i("p",[t._v(t._s(s.title))]),i("p",{staticClass:"text-muted"},[t._v(" "+t._s(s.id)+" ")])])})),1)],1)])])],1)},n=[],a={name:"MazListDoc",data:function(){return{items:[{id:0,title:"Item 1"},{id:1,title:"Item 2"},{id:2,title:"Item 3"},{id:3,title:"Item 4"},{id:4,title:"Item 5"},{id:5,title:"Item 6"},{id:6,title:"Item 7"},{id:7,title:"Item 8"},{id:8,title:"Item 1"}],codeExample:'<template>\n  <div class="lists-container">\n    <div class="list-1">\n      <h2 class="mb-2">\n        Basic list\n      </h2>\n      <p class="text-muted mb-3">\n        Any options\n      </p>\n      <MazList>\n        <MazListItem\n          v-for="(item) in items"\n          :key="list-1-{YOUR-ITEM-ID}"\n        >\n          <p>{{ item.title }}</p>\n          <p class="text-muted">\n            {{ item.id }}\n          </p>\n        </MazListItem>\n      </MazList>\n    </div>\n    <div class="list-2">\n      <h2 class="mb-2">\n        Hover & animate list\n      </h2>\n      <MazBtn\n        size="sm"\n        class="mb-2"\n        @click="reorderItems"\n      >\n        Shuffle items\n      </MazBtn>\n\n      <MazList\n        transition\n      >\n        <MazListItem\n          v-for="(item) in items"\n          :key="list-2-{YOUR-ITEM-ID}"\n          hover\n          tag="button"\n        >\n          <p>{{ item.title }}</p>\n          <p class="text-muted">\n            {{ item.id }}\n          </p>\n        </MazListItem>\n      </MazList>\n    </div>\n    <div class="list-3">\n      <h2 class="mb-2">\n        Scrollable list & no-shadow\n      </h2>\n      <p class="text-muted mb-3">\n        Just set \'max-height\' CSS property to the list\n      </p>\n      <MazList\n        no-shadow\n        class="scrollable-list"\n      >\n        <MazListItem\n          v-for="(item) in items"\n          :key="list-3-{YOUR-ITEM-ID}"\n          tag="button"\n        >\n          <p>{{ item.title }}</p>\n          <p class="text-muted">\n            {{ item.id }}\n          </p>\n        </MazListItem>\n      </MazList>\n    </div>\n  </div>\n</template>\n\nexport default {\n  data () {\n    return {\n      items: [\n        { label: \'first\', value: 0 },\n        { label: \'second\', value: 1 },\n        { label: \'third\', value: 2 },\n        { label: \'fourth\', value: 3 },\n        { label: \'fifth\', value: 4 },\n        { label: \'sixth\', value: 5 }\n      ]\n    }\n  },\n  methods: {\n    reorderItems () {\n      this.items.sort(() => Math.random() - 0.5)\n    }\n  }\n}'}},methods:{reorderItems:function(){this.items.sort((function(){return Math.random()-.5}))}}},l=a,m=(i("f014"),i("2877")),o=Object(m["a"])(l,e,n,!1,null,"17dff98f",null);s["default"]=o.exports},f014:function(t,s,i){"use strict";var e=i("fe9b"),n=i.n(e);n.a},fe9b:function(t,s,i){}}]);
//# sourceMappingURL=MazListDoc.c2ce6918.js.map