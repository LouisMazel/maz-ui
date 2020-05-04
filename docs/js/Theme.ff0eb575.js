(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Theme"],{d4d0:function(e,o,l){"use strict";l.r(o);var n=function(){var e=this,o=e.$createElement,l=e._self._c||o;return l("div",{staticClass:"theme"},[l("h2",[e._v(" Theme ")]),l("h3",[e._v(" How to use your own colors and text styles ")]),l("p",[e._v(" To change globally the colors and text style you have to override Maz-UI CSS variables ")]),e._m(0),l("CodeContainer",{attrs:{code:"// main.scss\n\n$primary-color:     red;\n$default-color:     blue;\n$success-color:     yellow;\n$border-radius:     4px;\n$base-font-size:    16px;\n$base-font-family:  'Roboto';\n// All available variables are just below\n\n@import 'maz-ui/lib/scss/index.scss';\n\n/*\n* Optional: You can override the components CSS after the import\n*/\n\n// Your own CSS",language:"scss"}}),l("h3",[e._v(" All default variables ")]),l("CodeContainer",{attrs:{code:"/*\n* FONT BASIC\n*/\n\n$base-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !default;\n$base-font-size:   14px !default;\n$base-font-weight: 400 !default;\n$base-line-height: 1.5 !default;\n\n/*\n* COLORS BASIC\n*/\n\n// MAJORS COLORS\n\n$primary-color:           dodgerblue !default;\n$secondary-color:         #C41AF9 !default;\n$third-color:             #1CD1A1 !default;\n$danger-color:            orangered !default;\n$success-color:           yellowgreen !default;\n$info-color:              #17A2B8 !default;\n$warning-color:           #FFA300 !default;\n$light-color:             whitesmoke !default;\n$default-color:           #CCC !default;\n$text-color:              #212121 !default;\n$bg-color:                white !default;\n$dark-color:              #24292E !default;\n\n// OTHERS COLORS\n\n$black-color:             black !default;\n$white-color:             white !default;\n$grey-color:              #999 !default;\n$hover-bg-color:          #F2F2F2 !default;\n$hover-bg-color-l:        white !default;\n$muted-color:             #747474 !default;\n$border-color:            #EEE !default;\n$disabled-color:          #F2F2F2 !default;\n$placeholder-color:       #A7A7A7 !default;\n$input-icon-color:              #DEDEDE !default;\n$overlay-color:           rgba(#303144, .7);\n\n/*\n* DARK THEME SPECIFIC\n*/\n\n$text-color-dark:         #EEE !default;\n$bg-color-dark:           #21222E !default;\n$bg-color-dark-l:         #303144 !default;\n$hover-bg-color-dark:     #2E2F40 !default;\n$hover-bg-color-dark-l:   #2E2F40 !default;\n$muted-color-dark:        rgba(255, 255, 255, .3) !default;\n$disabled-color-dark:     #CCC !default;\n$border-color-dark:       #3B3C53 !default;\n$placeholder-color-dark:  rgba(255, 255, 255, .6) !default;\n$input-icon-color-dark:         #65678F !default;\n$overlay-color-dark:      rgba(86, 87, 117, .7);\n\n/*\n* BORDERS\n*/\n\n$border-radius: 8px !default;\n$border-width: 1.5px !default;\n\n/*\n* RESPONSIVE BREAKPOINTS\n*/\n\n$breakpoint-mobile-s: 320px !default;\n$breakpoint-mobile-m: 375px !default;\n$breakpoint-mobile-l: 425px !default;\n$breakpoint-tablet: 768px !default;\n$breakpoint-laptop-s: 1024px !default;\n$breakpoint-laptop-l: 1440px !default;\n$breakpoint-4k: 1920px !default;",language:"scss"}})],1)},a=[function(){var e=this,o=e.$createElement,l=e._self._c||o;return l("p",[e._v(" Instead of importing the basic CSS file ("),l("strong",[e._v("'maz-ui/lib/maz-ui.css'")]),e._v("). "),l("br"),e._v(" You must import the Maz-UI SCSS at the top of your main CSS file and place your own variables just before importing, follow this example: ")])}],t={name:"Theme"},r=t,d=l("2877"),u=Object(d["a"])(r,n,a,!1,null,null,null);o["default"]=u.exports}}]);
//# sourceMappingURL=Theme.ff0eb575.js.map