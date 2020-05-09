(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["home"],{"16c0":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home maz-flex-1 maz-flex maz-direction-column"},[a("div",{staticClass:"home__main maz-flex maz-flex-1 maz-container maz-flex-center"},[a("div",{staticClass:"home__content maz-flex maz-direction-column maz-justify-center maz-p-4"},[t._m(0),a("div",{staticClass:"maz-flex maz-flex-center maz-direction-column"},[a("CodeContainer",{staticClass:"mb-4",attrs:{language:"bash",code:"npm i maz-ui -S"}}),a("div",{staticClass:"maz-flex maz-align-start maz-flex-wrap maz-my-3 maz-align-center maz-justify-center"},[a("router-link",{staticClass:"maz-btn maz-btn--secondary maz-mr-2 maz-mb-2",attrs:{to:{name:"GetStarted"}}},[t._v(" Get started ")]),a("router-link",{staticClass:"maz-btn maz-btn--primary maz-mr-2",attrs:{to:{name:"MazInputDoc"}}},[t._v(" Components ")]),a("router-link",{staticClass:"maz-btn maz-btn--third maz-mr-2",attrs:{to:{name:"Theme"}}},[t._v(" Theme ")])],1)],1)]),a("div",{staticClass:"home__illu-container maz-flex maz-align-center maz-justify-center maz-p-4"},[a("img",{staticClass:"home__illu-container__illu",attrs:{src:t.illuPath,alt:"maz ui logo"}})])]),a("NavFooter")],1)},r=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("h2",{staticClass:"maz-mb-2 maz-text-center"},[t._v(" Components Library to build your interfaces with "),a("span",{staticClass:"maz-text-primary"},[t._v("Vue.JS & Nuxt.JS")])])}],o=a("2f62"),s=a("cef0");function i(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function c(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?i(Object(a),!0).forEach((function(e){m(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function m(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var l={name:"Home",components:{NavFooter:s["a"]},computed:c(c({},Object(o["c"])(["hasDarkTheme"])),{},{illuPath:function(){return this.hasDarkTheme?a("c4da"):a("ef52")}})},u=l,f=(a("8e1c"),a("2877")),z=Object(f["a"])(u,n,r,!1,null,"5e839072",null);e["default"]=z.exports},"5fe1":function(t,e,a){},"695a":function(t,e,a){"use strict";var n=a("5fe1"),r=a.n(n);r.a},"8e1c":function(t,e,a){"use strict";var n=a("c47a"),r=a.n(n);r.a},bf10:function(t,e,a){t.exports=a.p+"img/logo-maz-ui.c869f72a.png"},c47a:function(t,e,a){},c4da:function(t,e,a){t.exports=a.p+"img/maz-ui-illu-dark.2734ee6b.png"},cef0:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("footer",{staticClass:"nav-footer maz-flex-fixed maz-border-top-1 maz-border-top-solid maz-border-color",attrs:{role:"contentinfo"}},[a("nav",{staticClass:"nav-footer-content maz-container maz-px-4 maz-flex maz-align-center maz-space-between maz-py-4"},[a("div",{staticClass:"maz-flex maz-direction-column maz-hidden-tablet"},[a("RouterLink",{staticClass:"maz-mr-3",attrs:{to:{name:"Home"}}},[t._v(" Home ")]),a("RouterLink",{attrs:{to:{name:"Documentation"}}},[t._v(" Documentation ")]),a("RouterLink",{attrs:{to:{name:"MadeWithMazUi"}}},[t._v(" Made with Maz UI ")])],1),t._m(0),a("div",{staticClass:"maz-flex maz-align-center"},[a("SocialButtons",{staticClass:"mr-2"}),a("VersionNumber")],1)]),t._m(1)])},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"nav-footer-content__logo maz-flex maz-direction-column maz-hidden-tablet maz-align-center"},[n("img",{staticClass:"nav-footer-content__logo__img",attrs:{src:a("bf10"),alt:"logo-loic-mazuel"}})])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"nav-footer-subs maz-py-2"},[a("div",{staticClass:"maz-px-4 maz-flex maz-justify-end"},[a("a",{staticClass:"maz-flex",attrs:{href:"https://www.loicmazuel.com/",target:"_blank"}},[a("p",{staticClass:"maz-fs-14"},[t._v(" © Loïc Mazuel ")])])])])}],o=a("2eb3"),s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a",{staticClass:"version-number",attrs:{target:"_blank",href:"https://www.npmjs.com/package/maz-ui"}},[t._v(" "+t._s(t.versionNumber)+" ")])},i=[],c=a("34e9"),m={name:"VersionNumber",computed:{versionNumber:function(){return c["b"]}}},l=m,u=a("2877"),f=Object(u["a"])(l,s,i,!1,null,null,null),z=f.exports,p={name:"NavFooter",components:{SocialButtons:o["a"],VersionNumber:z}},b=p,v=(a("695a"),Object(u["a"])(b,n,r,!1,null,"b21b70cc",null));e["a"]=v.exports},ef52:function(t,e,a){t.exports=a.p+"img/maz-ui-illu.59d20184.png"}}]);
//# sourceMappingURL=home.b3572b71.js.map