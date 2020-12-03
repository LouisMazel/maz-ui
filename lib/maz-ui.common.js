module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("plotly.js-dist");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("libphonenumber-js");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("v-click-outside");

/***/ }),
/* 5 */
/***/ (function(module) {

module.exports = JSON.parse("{\"a\":\"2.0.0-beta.7\"}");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("vuedraggable");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("vue2-dropzone");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("moment-range");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("libphonenumber-js/examples.mobile.json");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13);


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "version", function() { return /* reexport */ package_0["a" /* version */]; });
__webpack_require__.d(__webpack_exports__, "install", function() { return /* binding */ install; });

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazAvatar/_main.vue?vue&type=template&id=56fa0993&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "maz-base-component maz-avatar maz-flex maz-flex-center maz-flex-fixed",
      class: {
        "has-link": !!_vm.url,
        "maz-elevation": !_vm.noElevation,
        bordered: _vm.bordered,
        editable: _vm.editable,
        square: _vm.square
      },
      style: [_vm.pictureSize]
    },
    [
      _vm.url
        ? _c(
            "a",
            {
              staticClass: "maz-avatar__avatar-link maz-flex maz-flex-center",
              attrs: { href: _vm.url, target: _vm.target }
            },
            [
              _c("img", {
                staticClass: "maz-avatar__picture",
                attrs: { src: _vm.picturePath, alt: _vm.alt }
              })
            ]
          )
        : _c("img", {
            staticClass: "maz-avatar__picture",
            attrs: { src: _vm.picturePath, alt: _vm.alt },
            on: {
              click: function($event) {
                _vm.editable ? _vm.$emit("edit", $event) : null
              }
            }
          }),
      _vm.editable
        ? _c(
            "button",
            {
              staticClass:
                "maz-avatar__editable-layer maz-flex maz-flex-center",
              attrs: { type: "button" },
              on: {
                click: function($event) {
                  return _vm.$emit("edit", $event)
                }
              }
            },
            [
              _c(
                "i",
                {
                  staticClass: "material-icons",
                  attrs: { "aria-hidden": "true" }
                },
                [_vm._v("\n      edit\n    ")]
              )
            ]
          )
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazAvatar/_main.vue?vue&type=template&id=56fa0993&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazAvatar/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazAvatar',
  props: {
    // url or path of the image
    src: {
      type: String,
      required: true
    },
    // url or path to link another page
    url: {
      type: String,
      default: null
    },
    // alt text of image
    alt: {
      type: String,
      default: 'avatar image'
    },
    // target attribute of link (if url is provide)
    target: {
      type: String,
      default: '_self'
    },
    // size of avatar
    size: {
      type: Number,
      default: 80
    },
    // add border around the avatar
    bordered: {
      type: Boolean,
      default: false
    },
    // add an edit layer & emit `edit` event on click
    editable: {
      type: Boolean,
      default: false
    },
    // Make the avatar square
    square: {
      type: Boolean,
      default: false
    },
    // Remove the shadow behind the avatar
    noElevation: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    picturePath: function picturePath() {
      return this.src;
    },
    pictureSize: function pictureSize() {
      var size = this.size;
      return {
        width: "".concat(size, "px"),
        height: "".concat(size, "px")
      };
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazAvatar/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var MazAvatar_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./packages/components/MazAvatar/_main.vue





/* normalize component */

var component = normalizeComponent(
  MazAvatar_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazAvatar/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazAvatar/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazAvatar = (_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazBottomSheet/_main.vue?vue&type=template&id=733e9cdc&
var _mainvue_type_template_id_733e9cdc_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "transition",
    {
      staticClass: "maz-base-component maz-bottom-sheet",
      attrs: { name: "maz-bottom-sheet" }
    },
    [
      _vm.value
        ? _c(
            "div",
            {
              staticClass: "maz-bottom-sheet__mask",
              class: {
                "is-open": _vm.value,
                "no-overlay": _vm.noOverlay,
                "maz-is-dark": _vm.dark
              }
            },
            [
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "click-outside",
                      rawName: "v-click-outside",
                      value: _vm.vcoConfig,
                      expression: "vcoConfig"
                    }
                  ],
                  staticClass: "maz-bottom-sheet__wrapper"
                },
                [
                  _c(
                    "div",
                    {
                      staticClass:
                        "maz-bottom-sheet__container maz-bottom-sheet-animation maz-bg-color maz-position-relative",
                      class: {
                        "maz-py-6": !_vm.noPadding
                      }
                    },
                    [
                      _vm._t("default", [
                        _c(
                          "div",
                          {
                            staticClass:
                              "maz-flex maz-direction-column maz-flex-center"
                          },
                          [_c("h1", [_vm._v("Default content")])]
                        )
                      ]),
                      !_vm.noClose
                        ? _c(
                            "MazBtn",
                            {
                              staticClass: "maz-bottom-sheet__close",
                              attrs: {
                                size: "mini",
                                fab: "",
                                "no-shadow": "",
                                color: "transparent"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.$emit("input", false)
                                }
                              }
                            },
                            [
                              _c(
                                "i",
                                {
                                  staticClass: "material-icons maz-text-color"
                                },
                                [_vm._v("close")]
                              )
                            ]
                          )
                        : _vm._e()
                    ],
                    2
                  )
                ]
              )
            ]
          )
        : _vm._e()
    ]
  )
}
var _mainvue_type_template_id_733e9cdc_staticRenderFns = []
_mainvue_type_template_id_733e9cdc_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazBottomSheet/_main.vue?vue&type=template&id=733e9cdc&

// EXTERNAL MODULE: external "v-click-outside"
var external_v_click_outside_ = __webpack_require__(4);
var external_v_click_outside_default = /*#__PURE__*/__webpack_require__.n(external_v_click_outside_);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazBtn/_main.vue?vue&type=template&id=247f3a44&
var _mainvue_type_template_id_247f3a44_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    _vm.componentType,
    _vm._b(
      {
        tag: "component",
        staticClass: "maz-base-component maz-btn maz-inline-flex",
        class: [
          _vm.classes,
          {
            "maz-text-hidden": _vm.loading
          }
        ],
        attrs: {
          id: _vm.uniqueId,
          type: _vm.isLink ? null : _vm.type,
          disabled: _vm.isLink ? null : _vm.isDisabled
        },
        on: {
          click: function($event) {
            return _vm.handleClick($event)
          },
          mouseenter: function($event) {
            return _vm.emitMouseEnter($event)
          },
          mouseleave: function($event) {
            return _vm.emitMouseLeave($event)
          },
          focus: function($event) {
            return _vm.emitFocus($event)
          },
          blur: function($event) {
            return _vm.emitBlur($event)
          }
        }
      },
      "component",
      _vm.$attrs,
      false
    ),
    [
      _vm.hasLeftIcon() || _vm.hasMainIcon()
        ? _c(
            "div",
            {
              staticClass: "maz-flex maz-flex-center maz-btn__icon-left",
              class: {
                "maz-mr-2": !_vm.fab && _vm.hasSlotDefault()
              }
            },
            [
              _vm._t("icon-left" || false, [
                _c("i", { staticClass: "material-icons" }, [
                  _vm._v(_vm._s(_vm.leftIconName || _vm.iconName))
                ])
              ])
            ],
            2
          )
        : _vm._e(),
      _c(
        "span",
        {
          staticClass:
            "maz-flex maz-align-center maz-h-100 maz-overflow-hidden",
          class: [_vm.textClasses, { "maz-flex-1": _vm.hasSlotDefault() }]
        },
        [_vm._t("default")],
        2
      ),
      _vm.hasRightIcon()
        ? _c(
            "div",
            {
              staticClass: "maz-flex maz-flex-center maz-btn__icon-right",
              class: {
                "maz-ml-2": !_vm.fab && _vm.hasSlotDefault()
              }
            },
            [
              _vm._t("icon-right", [
                _c("i", { staticClass: "material-icons" }, [
                  _vm._v(_vm._s(_vm.rightIconName))
                ])
              ])
            ],
            2
          )
        : _vm._e(),
      _vm.loading
        ? _c(
            "div",
            { staticClass: "maz-btn__spinner maz-flex maz-flex-center" },
            [_c("MazSpinner", { attrs: { size: 25, color: _vm.color } })],
            1
          )
        : _vm._e()
    ]
  )
}
var _mainvue_type_template_id_247f3a44_staticRenderFns = []
_mainvue_type_template_id_247f3a44_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazBtn/_main.vue?vue&type=template&id=247f3a44&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSpinner/_main.vue?vue&type=template&id=67a8ca41&
var _mainvue_type_template_id_67a8ca41_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "maz-base-component maz-spinner maz-spinner-anim",
      class: [
        {
          "spinner-anim__white": _vm.dark
        },
        _vm.fillColorClass
      ],
      staticStyle: { "enable-background": "new 0 0 50 50" },
      attrs: {
        width: _vm.size + "px",
        height: _vm.size + "px",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        x: "0px",
        y: "0px",
        viewBox: "0 0 50 50",
        "xml:space": "preserve"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
        }
      })
    ]
  )
}
var _mainvue_type_template_id_67a8ca41_staticRenderFns = []
_mainvue_type_template_id_67a8ca41_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSpinner/_main.vue?vue&type=template&id=67a8ca41&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSpinner/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazSpinner_mainvue_type_script_lang_js_ = ({
  name: 'MazSpinner',
  props: {
    size: {
      type: Number,
      default: 40
    },
    dark: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    fillColorClass: function fillColorClass() {
      return "maz-fill-".concat(this.color);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazSpinner/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazSpinner_mainvue_type_script_lang_js_ = (MazSpinner_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazSpinner/_main.vue





/* normalize component */

var _main_component = normalizeComponent(
  components_MazSpinner_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_67a8ca41_render,
  _mainvue_type_template_id_67a8ca41_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var _main_api; }
_main_component.options.__file = "packages/components/MazSpinner/_main.vue"
/* harmony default export */ var MazSpinner_main = (_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazSpinner/index.js


MazSpinner_main.install = function (Vue) {
  Vue.component(MazSpinner_main.name, MazSpinner_main);
};

/* harmony default export */ var MazSpinner = (MazSpinner_main);
// CONCATENATED MODULE: ./packages/mixins/uniqueId.js
/* harmony default export */ var uniqueId = ({
  data: function data() {
    return {
      uniqueId: null
    };
  },
  mounted: function mounted() {
    var id = this.id || this.$attrs.id;
    this.uniqueId = id ? "".concat(id) : "".concat(this.$options.name, "-").concat(this._uid);
  }
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazBtn/_main.vue?vue&type=script&lang=js&
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/**
 * > Simple button component
 */

/* harmony default export */ var MazBtn_mainvue_type_script_lang_js_ = ({
  name: 'MazBtn',
  components: {
    MazSpinner: MazSpinner
  },
  mixins: [uniqueId],
  inheritAttrs: false,
  props: {
    // is the id of the button
    id: {
      type: String,
      default: null
    },
    // is color type (`primary` / `secondary` / `third` / `success` / `danger` / `grey` / `info` / `warning` / `light` / `dark` / `default` / `white` / `black`)
    color: {
      type: String,
      default: 'primary'
    },
    // is the button type (button, submit or something else)
    type: {
      type: String,
      default: 'button'
    },
    // button size (`xl`, `lg` / `md` / `sm` / `mini`)
    size: {
      type: String,
      default: 'md'
    },
    // is a `boolean` to show the loader & disable it
    loading: {
      type: Boolean,
      default: false
    },
    // is a `boolean` to disable the button
    disabled: {
      type: Boolean,
      default: false
    },
    // apply the outline style
    outline: {
      type: Boolean,
      default: false
    },
    // apply the rounded style
    rounded: {
      type: Boolean,
      default: false
    },
    // apply the fab style
    fab: {
      type: Boolean,
      default: false
    },
    // apply the focus style
    active: {
      type: Boolean,
      default: false
    },
    // take 100% of the width
    block: {
      type: Boolean,
      default: false
    },
    // remove shadow/elevation
    noShadow: {
      type: Boolean,
      default: false
    },
    // should be a [material icon](https://material.io/resources/icons/) name (usefull with fab buttons)
    iconName: {
      type: String,
      default: null
    },
    // should be a [material icon](https://material.io/resources/icons/) name
    leftIconName: {
      type: String,
      default: null
    },
    // should be a [material icon](https://material.io/resources/icons/) name
    rightIconName: {
      type: String,
      default: null
    },
    // align text to left (for block button)
    justifyStart: {
      type: Boolean,
      default: false
    },
    // align text to right (for block button)
    justifyEnd: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    componentType: function componentType() {
      var _this$$attrs = this.$attrs,
          href = _this$$attrs.href,
          to = _this$$attrs.to;
      if (href) return 'a';else if (to) return 'router-link';
      return 'button';
    },
    isLink: function isLink() {
      return this.componentType === 'a';
    },
    isDisabled: function isDisabled() {
      var disabled = this.disabled,
          loading = this.loading;
      return loading || disabled;
    },
    classes: function classes() {
      var color = this.color,
          size = this.size,
          outline = this.outline,
          rounded = this.rounded,
          fab = this.fab,
          active = this.active,
          block = this.block,
          noShadow = this.noShadow,
          hasRightIcon = this.hasRightIcon,
          hasLeftIcon = this.hasLeftIcon,
          hasIcon = this.hasIcon,
          hasSlotDefault = this.hasSlotDefault;
      return [].concat(_toConsumableArray(color ? ["maz-btn--".concat(color)] : [null]), _toConsumableArray(size ? ["maz-btn--".concat(size)] : [null]), _toConsumableArray(outline ? ['maz-btn--outline'] : [null]), _toConsumableArray(rounded ? ['maz-btn--rounded'] : [null]), _toConsumableArray(block ? ['maz-btn--block'] : [null]), _toConsumableArray(fab ? ['maz-btn--fab'] : [null]), _toConsumableArray(active ? ['maz-active'] : [null]), _toConsumableArray(noShadow ? ['maz-no-shadow'] : [null]), _toConsumableArray(hasLeftIcon() ? ['maz-btn--icon--left'] : [null]), _toConsumableArray(hasRightIcon() ? ['maz-btn--icon--right'] : [null]), _toConsumableArray(hasIcon() ? ['maz-btn--icon'] : [null]), _toConsumableArray(!hasSlotDefault() ? ['maz-btn--no-text'] : [null]));
    },
    textClasses: function textClasses() {
      var justifyStart = this.justifyStart,
          justifyEnd = this.justifyEnd;
      return [].concat(_toConsumableArray(justifyStart ? ['maz-justify-start'] : [null]), _toConsumableArray(justifyEnd ? ['maz-justify-end'] : [null]), _toConsumableArray(!justifyStart && !justifyEnd ? ['maz-justify-center'] : [null]));
    }
  },
  methods: {
    hasSlotDefault: function hasSlotDefault() {
      return this.$slots['default'];
    },
    hasIcon: function hasIcon() {
      return this.hasLeftIcon() || this.hasRightIcon() || this.hasMainIcon();
    },
    hasMainIcon: function hasMainIcon() {
      return this.iconName || this.$slots['icon'];
    },
    hasLeftIcon: function hasLeftIcon() {
      return this.leftIconName || this.$slots['icon-left'];
    },
    hasRightIcon: function hasRightIcon() {
      return this.rightIconName || this.$slots['icon-right'];
    },
    handleClick: function handleClick(e) {
      // return click event
      this.$emit('click', e);
    },
    emitMouseEnter: function emitMouseEnter(e) {
      // return mouseenter event
      this.$emit('mouseenter', e);
    },
    emitMouseLeave: function emitMouseLeave(e) {
      // return mouseleave event
      this.$emit('mouseleave', e);
    },
    emitFocus: function emitFocus(e) {
      // return focus event
      this.$emit('focus', e);
    },
    emitBlur: function emitBlur(e) {
      // return blur event
      this.$emit('blur', e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazBtn/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazBtn_mainvue_type_script_lang_js_ = (MazBtn_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazBtn/_main.vue





/* normalize component */

var MazBtn_main_component = normalizeComponent(
  components_MazBtn_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_247f3a44_render,
  _mainvue_type_template_id_247f3a44_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazBtn_main_api; }
MazBtn_main_component.options.__file = "packages/components/MazBtn/_main.vue"
/* harmony default export */ var MazBtn_main = (MazBtn_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazBtn/index.js


MazBtn_main.install = function (Vue) {
  Vue.component(MazBtn_main.name, MazBtn_main);
};

/* harmony default export */ var MazBtn = (MazBtn_main);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazBottomSheet/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var MazBottomSheet_mainvue_type_script_lang_js_ = ({
  name: 'MazBottomSheet',
  components: {
    MazBtn: MazBtn
  },
  directives: {
    clickOutside: external_v_click_outside_default.a.directive
  },
  props: {
    value: {
      type: Boolean,
      required: false
    },
    excludedClasses: {
      type: Array,
      default: Array
    },
    persistent: {
      type: Boolean,
      required: false
    },
    noClose: {
      type: Boolean,
      required: false
    },
    noPadding: {
      type: Boolean,
      required: false
    },
    noOverlay: {
      type: Boolean,
      required: false
    },
    dark: {
      type: Boolean,
      required: false
    }
  },
  data: function data() {
    return {
      vcoConfig: {
        handler: this.closeSheet,
        middleware: this.preventClickOutside,
        events: ['click'],
        isActive: true
      }
    };
  },
  methods: {
    preventClickOutside: function preventClickOutside() {
      return !this.excludedClasses.includes(event.target.className);
    },
    closeSheet: function closeSheet() {
      if (this.persistent) return; // Return state of bottom sheet
      // @arg Boolean

      this.$emit('input', false); // Emit on close sheet

      this.$emit('close');
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazBottomSheet/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazBottomSheet_mainvue_type_script_lang_js_ = (MazBottomSheet_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazBottomSheet/_main.vue





/* normalize component */

var MazBottomSheet_main_component = normalizeComponent(
  components_MazBottomSheet_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_733e9cdc_render,
  _mainvue_type_template_id_733e9cdc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazBottomSheet_main_api; }
MazBottomSheet_main_component.options.__file = "packages/components/MazBottomSheet/_main.vue"
/* harmony default export */ var MazBottomSheet_main = (MazBottomSheet_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazBottomSheet/index.js


MazBottomSheet_main.install = function (Vue) {
  Vue.component(MazBottomSheet_main.name, MazBottomSheet_main);
};

/* harmony default export */ var MazBottomSheet = (MazBottomSheet_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazBtnGroup/_main.vue?vue&type=template&id=ff748a06&
var _mainvue_type_template_id_ff748a06_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "maz-base-component maz-btn-group maz-flex" },
    _vm._l(_vm.items, function(ref, i) {
      var label = ref.label
      var val = ref.value
      var icon = ref.icon
      var rightIcon = ref.rightIcon
      var leftIcon = ref.leftIcon
      return _c(
        "MazBtn",
        _vm._b(
          {
            key: "maz-btn-group-item-" + i,
            staticClass: "maz-btn-group__item",
            attrs: {
              active: val === _vm.value,
              "left-icon-name": leftIcon,
              "right-icon-name": rightIcon,
              "icon-name": icon
            },
            on: {
              click: function($event) {
                return _vm.$emit("input", val)
              }
            }
          },
          "MazBtn",
          _vm.$attrs,
          false
        ),
        [label ? [_vm._v("\n      " + _vm._s(label) + "\n    ")] : _vm._e()],
        2
      )
    }),
    1
  )
}
var _mainvue_type_template_id_ff748a06_staticRenderFns = []
_mainvue_type_template_id_ff748a06_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazBtnGroup/_main.vue?vue&type=template&id=ff748a06&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazBtnGroup/_main.vue?vue&type=script&lang=js&
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var MazBtnGroup_mainvue_type_script_lang_js_ = ({
  name: 'MazBtnGroup',
  components: {
    MazBtn: MazBtn
  },
  props: {
    value: {
      required: true,
      validator: function validator(prop) {
        return ['string', 'number', 'boolean'].includes(_typeof(prop)) || prop === null;
      }
    },
    items: {
      type: Array,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazBtnGroup/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazBtnGroup_mainvue_type_script_lang_js_ = (MazBtnGroup_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazBtnGroup/_main.vue





/* normalize component */

var MazBtnGroup_main_component = normalizeComponent(
  components_MazBtnGroup_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_ff748a06_render,
  _mainvue_type_template_id_ff748a06_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazBtnGroup_main_api; }
MazBtnGroup_main_component.options.__file = "packages/components/MazBtnGroup/_main.vue"
/* harmony default export */ var MazBtnGroup_main = (MazBtnGroup_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazBtnGroup/index.js


MazBtnGroup_main.install = function (Vue) {
  Vue.component(MazBtnGroup_main.name, MazBtnGroup_main);
};

/* harmony default export */ var MazBtnGroup = (MazBtnGroup_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazCheckbox/_main.vue?vue&type=template&id=dbf83586&
var _mainvue_type_template_id_dbf83586_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-checkbox",
      class: ["maz-checkbox--" + _vm.color]
    },
    [
      _c(
        "input",
        _vm._b(
          {
            staticClass: "maz-mr-2",
            attrs: { id: _vm.uniqueId, name: _vm.name, type: "checkbox" },
            domProps: { checked: _vm.value },
            on: {
              change: function($event) {
                return _vm.$emit("input", $event.target.checked)
              }
            }
          },
          "input",
          _vm.$attrs,
          false
        )
      ),
      _c(
        "label",
        {
          staticClass: "maz-m-0 maz-flex maz-align-center",
          attrs: { for: _vm.uniqueId }
        },
        [_vm._t("default")],
        2
      )
    ]
  )
}
var _mainvue_type_template_id_dbf83586_staticRenderFns = []
_mainvue_type_template_id_dbf83586_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazCheckbox/_main.vue?vue&type=template&id=dbf83586&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazCheckbox/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var MazCheckbox_mainvue_type_script_lang_js_ = ({
  name: 'MazCheckbox',
  mixins: [uniqueId],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'primary'
    },
    name: {
      type: String,
      default: 'maz-checkbox'
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazCheckbox/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazCheckbox_mainvue_type_script_lang_js_ = (MazCheckbox_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazCheckbox/_main.vue





/* normalize component */

var MazCheckbox_main_component = normalizeComponent(
  components_MazCheckbox_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_dbf83586_render,
  _mainvue_type_template_id_dbf83586_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazCheckbox_main_api; }
MazCheckbox_main_component.options.__file = "packages/components/MazCheckbox/_main.vue"
/* harmony default export */ var MazCheckbox_main = (MazCheckbox_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazCheckbox/index.js


MazCheckbox_main.install = function (Vue) {
  Vue.component(MazCheckbox_main.name, MazCheckbox_main);
};

/* harmony default export */ var MazCheckbox = (MazCheckbox_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazCollapse/_main.vue?vue&type=template&id=64aa90a7&
var _mainvue_type_template_id_64aa90a7_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-collapse maz-position-relative",
      class: {
        "maz-is-dark": _vm.dark,
        "is-open": _vm.isOpen
      }
    },
    [
      _c(
        "MazBtn",
        {
          staticClass:
            "maz-collapse__header-btn maz-flex maz-flex-center maz-border-radius-0",
          attrs: { color: "transparent", size: "md", "no-shadow": "" },
          on: { click: _vm.openContent }
        },
        [
          _vm._t("header-text", [_vm._v("\n      Default Header\n    ")]),
          _c("ArrowIcon", {
            staticClass: "maz-collapse__header-btn__arrow maz-ml-2",
            attrs: {
              white: _vm.dark,
              color: _vm.arrowColor,
              orientation: _vm.isOpen ? "up" : null
            }
          })
        ],
        2
      ),
      _c("MazTransitionExpand", { staticClass: "maz-collapse__content" }, [
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.hasContentOpen,
                expression: "hasContentOpen"
              }
            ]
          },
          [_vm._t("default", [_c("p", [_vm._v("Default Content")])])],
          2
        )
      ])
    ],
    1
  )
}
var _mainvue_type_template_id_64aa90a7_staticRenderFns = []
_mainvue_type_template_id_64aa90a7_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazCollapse/_main.vue?vue&type=template&id=64aa90a7&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTransitionExpand/_main.vue?vue&type=template&id=2b2d746e&
var _mainvue_type_template_id_2b2d746e_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "transition",
    {
      staticClass: "maz-base-component maz-transition-expand",
      attrs: { name: "maz-expand" },
      on: { enter: _vm.enter, "after-enter": _vm.afterEnter, leave: _vm.leave }
    },
    [_vm._t("default")],
    2
  )
}
var _mainvue_type_template_id_2b2d746e_staticRenderFns = []
_mainvue_type_template_id_2b2d746e_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazTransitionExpand/_main.vue?vue&type=template&id=2b2d746e&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTransitionExpand/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazTransitionExpand_mainvue_type_script_lang_js_ = ({
  name: 'MazTransitionExpand',
  methods: {
    enter: function enter(element) {
      var width = getComputedStyle(element).width;
      element.style.width = width;
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      element.style.height = 'auto';
      element.style.top = 'bottom';
      var height = getComputedStyle(element).height;
      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0; // Force repaint to make sure the
      // animation is triggered correctly.

      /* eslint-disable */

      getComputedStyle(element).height;
      /* eslint-enable */
      // Trigger the animation.
      // We use `setTimeout` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.

      this.$nextTick(function () {
        element.style.height = height;
      });
    },
    afterEnter: function afterEnter(element) {
      element.style.height = 'auto';
    },
    leave: function leave(element) {
      var height = getComputedStyle(element).height;
      element.style.height = height; // Force repaint to make sure the
      // animation is triggered correctly.

      /* eslint-disable */

      getComputedStyle(element).height;
      /* eslint-enable */

      this.$nextTick(function () {
        element.style.height = 0;
      });
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazTransitionExpand/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazTransitionExpand_mainvue_type_script_lang_js_ = (MazTransitionExpand_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazTransitionExpand/_main.vue





/* normalize component */

var MazTransitionExpand_main_component = normalizeComponent(
  components_MazTransitionExpand_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_2b2d746e_render,
  _mainvue_type_template_id_2b2d746e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazTransitionExpand_main_api; }
MazTransitionExpand_main_component.options.__file = "packages/components/MazTransitionExpand/_main.vue"
/* harmony default export */ var MazTransitionExpand_main = (MazTransitionExpand_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazTransitionExpand/index.js


MazTransitionExpand_main.install = function (Vue) {
  Vue.component(MazTransitionExpand_main.name, MazTransitionExpand_main);
};

/* harmony default export */ var MazTransitionExpand = (MazTransitionExpand_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/_subs/ArrowIcon/index.vue?vue&type=template&id=1c91afda&
var ArrowIconvue_type_template_id_1c91afda_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "maz-arrow-icon",
      class: [{ "is-white": _vm.dark }, _vm.orientation],
      attrs: {
        mlns: "http://www.w3.org/2000/svg",
        width: _vm.size,
        height: _vm.size,
        viewBox: "0 0 24 24"
      }
    },
    [
      _c("path", {
        staticClass: "arrow",
        class: [_vm.color],
        attrs: {
          fill: _vm.color,
          d: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        }
      }),
      _c("path", { attrs: { fill: "none", d: "M0 0h24v24H0V0z" } })
    ]
  )
}
var ArrowIconvue_type_template_id_1c91afda_staticRenderFns = []
ArrowIconvue_type_template_id_1c91afda_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/_subs/ArrowIcon/index.vue?vue&type=template&id=1c91afda&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/_subs/ArrowIcon/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ArrowIconvue_type_script_lang_js_ = ({
  name: 'ArrowIcon',
  props: {
    dark: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 24
    },
    orientation: {
      type: String,
      default: 'bottom'
    }
  }
});
// CONCATENATED MODULE: ./packages/components/_subs/ArrowIcon/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var _subs_ArrowIconvue_type_script_lang_js_ = (ArrowIconvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/_subs/ArrowIcon/index.vue





/* normalize component */

var ArrowIcon_component = normalizeComponent(
  _subs_ArrowIconvue_type_script_lang_js_,
  ArrowIconvue_type_template_id_1c91afda_render,
  ArrowIconvue_type_template_id_1c91afda_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ArrowIcon_api; }
ArrowIcon_component.options.__file = "packages/components/_subs/ArrowIcon/index.vue"
/* harmony default export */ var ArrowIcon = (ArrowIcon_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazCollapse/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/**
 * > MazCollpase is a component to show or not content
 */

/* harmony default export */ var MazCollapse_mainvue_type_script_lang_js_ = ({
  name: 'MazCollapse',
  components: {
    MazTransitionExpand: MazTransitionExpand,
    ArrowIcon: ArrowIcon,
    MazBtn: MazBtn
  },
  props: {
    // Value is a Boolean to open or close the collapse
    value: {
      type: Boolean,
      default: false
    },
    // Set `true` to enable dark mode
    dark: {
      type: Boolean,
      default: false
    },
    // Is the color of the arrow, must be a hex color
    arrowColor: {
      type: String,
      default: 'black'
    }
  },
  data: function data() {
    return {
      isOpen: this.value
    };
  },
  computed: {
    hasContentOpen: {
      get: function get() {
        return this.isOpen;
      },
      set: function set(value) {
        // return a `true` or `false` if the collapse is open or not
        // @arg Boolean
        this.$emit('input', value);
        this.isOpen = value;
      }
    }
  },
  watch: {
    value: function value(val) {
      this.isOpen = val;
    }
  },
  methods: {
    openContent: function openContent() {
      this.hasContentOpen = !this.hasContentOpen;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazCollapse/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazCollapse_mainvue_type_script_lang_js_ = (MazCollapse_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazCollapse/_main.vue





/* normalize component */

var MazCollapse_main_component = normalizeComponent(
  components_MazCollapse_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_64aa90a7_render,
  _mainvue_type_template_id_64aa90a7_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazCollapse_main_api; }
MazCollapse_main_component.options.__file = "packages/components/MazCollapse/_main.vue"
/* harmony default export */ var MazCollapse_main = (MazCollapse_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazCollapse/index.js


MazCollapse_main.install = function (Vue) {
  Vue.component(MazCollapse_main.name, MazCollapse_main);
};

/* harmony default export */ var MazCollapse = (MazCollapse_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDialog/_main.vue?vue&type=template&id=0553327c&
var _mainvue_type_template_id_0553327c_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "transition",
    {
      attrs: { name: "maz-dialog-fade" },
      on: { "after-enter": _vm.afterEnter, "after-leave": _vm.afterLeave }
    },
    [
      _vm.value
        ? _c(
            "div",
            {
              staticClass: "maz-base-component maz-dialog maz-dialog--mask",
              class: {
                "maz-dialog--success": _vm.success,
                "maz-dialog--danger": _vm.danger,
                "maz-dialog--fullsize": _vm.fullsize,
                "maz-is-dark": _vm.dark
              }
            },
            [
              _c(
                "div",
                {
                  staticClass: "maz-dialog__wrapper maz-flex maz-align-center"
                },
                [
                  _c(
                    "div",
                    {
                      directives: [
                        {
                          name: "click-outside",
                          rawName: "v-click-outside",
                          value: _vm.vcoConfig,
                          expression: "vcoConfig"
                        }
                      ],
                      staticClass:
                        "maz-dialog__container maz-dialog-animation maz-flex maz-direction-column maz-bg-color maz-border-radius",
                      style: _vm.widthStyle
                    },
                    [
                      !_vm.noHeader
                        ? _c(
                            "div",
                            {
                              staticClass:
                                "maz-dialog__header maz-flex maz-space-between maz-align-center maz-p-3"
                            },
                            [
                              _vm._t("title", [
                                _c(
                                  "p",
                                  { staticClass: "maz-dialog__header__title" },
                                  [
                                    _vm._v(
                                      "\n              " +
                                        _vm._s(_vm.title) +
                                        "\n            "
                                    )
                                  ]
                                )
                              ]),
                              !_vm.noClose
                                ? _c(
                                    "div",
                                    {
                                      staticClass: "maz-flex close-modal",
                                      on: {
                                        click: function($event) {
                                          return _vm.$emit("input", false)
                                        }
                                      }
                                    },
                                    [
                                      _c(
                                        "i",
                                        { staticClass: "material-icons" },
                                        [
                                          _vm._v(
                                            "\n              close\n            "
                                          )
                                        ]
                                      )
                                    ]
                                  )
                                : _vm._e()
                            ],
                            2
                          )
                        : _vm._e(),
                      _c(
                        "div",
                        {
                          staticClass: "maz-dialog__body maz-p-3 maz-text-color"
                        },
                        [_vm._t("default", [_c("p", [_vm._v("Content")])])],
                        2
                      ),
                      !_vm.noFooter
                        ? _c(
                            "div",
                            {
                              staticClass:
                                "maz-dialog__footer maz-flex maz-align-end maz-justify-end maz-p-3"
                            },
                            [
                              _vm._t("footer", [
                                _c(
                                  "MazBtn",
                                  {
                                    attrs: {
                                      color: "default",
                                      outline: "",
                                      size: "md"
                                    },
                                    on: { click: _vm.closeDialog }
                                  },
                                  [
                                    _vm._v(
                                      "\n              Close\n            "
                                    )
                                  ]
                                ),
                                !_vm.noConfirm
                                  ? _c(
                                      "MazBtn",
                                      {
                                        staticClass: "maz-ml-3",
                                        attrs: {
                                          size: "md",
                                          color: _vm.buttonConfirmColor
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.onConfirm($event)
                                          }
                                        }
                                      },
                                      [
                                        _vm._v(
                                          "\n              Confirm\n            "
                                        )
                                      ]
                                    )
                                  : _vm._e()
                              ])
                            ],
                            2
                          )
                        : _vm._e()
                    ]
                  )
                ]
              )
            ]
          )
        : _vm._e()
    ]
  )
}
var _mainvue_type_template_id_0553327c_staticRenderFns = []
_mainvue_type_template_id_0553327c_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazDialog/_main.vue?vue&type=template&id=0553327c&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(0);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDialog/_main.vue?vue&type=script&lang=js&


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var addListerner = function addListerner(keyPressHandler) {
  if (typeof window === 'undefined') return null;
  window.addEventListener('keydown', keyPressHandler);
};

var removeListerner = function removeListerner(keyPressHandler) {
  if (typeof window === 'undefined') return null;
  window.removeEventListener('keydown', keyPressHandler);
};

/* harmony default export */ var MazDialog_mainvue_type_script_lang_js_ = ({
  name: 'MazDialog',
  components: {
    MazBtn: MazBtn
  },
  directives: {
    clickOutside: external_v_click_outside_default.a.directive
  },
  props: {
    // `true` if dialog is open / `false` if is close
    value: {
      type: Boolean,
      required: true
    },
    // is the `max-width` of the dialog (number in pixels)
    maxWidth: {
      type: [Number || String],
      default: null
    },
    // is the `width` of the dialog (number in pixels)
    width: {
      type: [Number || String],
      default: null
    },
    // if is `true`, is not possible to close he dialog with a click outside
    persistent: {
      type: Boolean,
      default: false
    },
    // remove the header
    noHeader: {
      type: Boolean,
      default: false
    },
    // remove the footer
    noFooter: {
      type: Boolean,
      default: false
    },
    // remove the close button
    noClose: {
      type: Boolean,
      default: false
    },
    // remove the confirm button
    noConfirm: {
      type: Boolean,
      default: false
    },
    // add "success" style to the dialog
    success: {
      type: Boolean,
      default: false
    },
    // add "danger" style to the dialog
    danger: {
      type: Boolean,
      default: false
    },
    // add "dark" style to the dialog
    dark: {
      type: Boolean,
      default: false
    },
    // exclude elements classes (elements sometimes can close the dialog)
    excludedClasses: {
      type: Array,
      default: Array
    },
    // make dialog fullsize
    fullsize: {
      type: Boolean,
      default: false
    },
    // title of the dialog
    title: {
      type: String,
      default: 'Header title'
    }
  },
  computed: {
    widthStyle: function widthStyle() {
      var fullsize = this.fullsize,
          maxWidth = this.maxWidth,
          width = this.width;
      return {
        maxWidth: fullsize & !maxWidth ? null : Number.isInteger(maxWidth) ? "".concat(maxWidth, "px") : maxWidth,
        width: fullsize && !width ? null : Number.isInteger(width) ? "".concat(width, "px") : width
      };
    },
    buttonConfirmColor: function buttonConfirmColor() {
      return this.danger ? 'danger' : this.success ? 'success' : 'primary';
    },
    vcoConfig: function vcoConfig() {
      return {
        handler: this.closeDialog,
        middleware: this.preventClickOutside,
        events: ['click'],
        isActive: !this.fullsize
      };
    }
  },
  watch: {
    value: {
      handler: function handler(value) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!value) {
                    _context.next = 6;
                    break;
                  }

                  addListerner(_this.keyPressHandler);
                  _context.next = 4;
                  return _this.$nextTick();

                case 4:
                  _context.next = 7;
                  break;

                case 6:
                  removeListerner(_this.keyPressHandler);

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      immediate: true
    }
  },
  beforeDestroy: function beforeDestroy() {
    removeListerner(this.keyPressHandler);
  },
  methods: {
    keyPressHandler: function keyPressHandler(e) {
      if (e.keyCode === 27) {
        // escape
        this.closeDialog();
      }
    },
    preventClickOutside: function preventClickOutside() {
      var excludedClasses = this.excludedClasses;
      if (!event && !event.target || !event.target.classList) return true;
      var eventClasses = Array.from(event.target.classList);
      return !eventClasses.some(function (c) {
        return excludedClasses.includes(c);
      });
    },
    closeDialog: function closeDialog() {
      if (!this.persistent) {
        // sent when dialog is close
        // @arg Boolean `false`
        this.$emit('input', false);
      }
    },
    afterEnter: function afterEnter(e) {
      // sent when after dialog is open
      // @arg event
      this.$emit('opened', e);
    },
    afterLeave: function afterLeave(e) {
      // sent when after dialog is close
      // @arg event
      this.$emit('closed', e);
    },
    onConfirm: function onConfirm(e) {
      // sent when you click on confirm button
      // @arg event
      this.$emit('confirm', e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazDialog/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazDialog_mainvue_type_script_lang_js_ = (MazDialog_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazDialog/_main.vue





/* normalize component */

var MazDialog_main_component = normalizeComponent(
  components_MazDialog_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_0553327c_render,
  _mainvue_type_template_id_0553327c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazDialog_main_api; }
MazDialog_main_component.options.__file = "packages/components/MazDialog/_main.vue"
/* harmony default export */ var MazDialog_main = (MazDialog_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazDialog/index.js


MazDialog_main.install = function (Vue) {
  Vue.component(MazDialog_main.name, MazDialog_main);
};

/* harmony default export */ var MazDialog = (MazDialog_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDraggableList/_main.vue?vue&type=template&id=b673979a&
var _mainvue_type_template_id_b673979a_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-draggable-list maz-mb-3",
      class: {
        "maz-is-dark": _vm.dark
      }
    },
    [
      _c(
        "draggable",
        _vm._b(
          {
            attrs: { group: "modules" },
            on: {
              start: function($event) {
                _vm.drag = true
              },
              end: function($event) {
                _vm.drag = false
              }
            },
            model: {
              value: _vm.items,
              callback: function($$v) {
                _vm.items = $$v
              },
              expression: "items"
            }
          },
          "draggable",
          _vm.dragOptions,
          false
        ),
        [
          _c(
            "transition-group",
            {
              attrs: {
                type: "transition",
                tag: "div",
                name: !_vm.drag ? "maz-flip-list" : null
              }
            },
            _vm._l(_vm.value, function(item, i) {
              return _c(
                "div",
                {
                  key:
                    "" +
                    (_vm.itemKey ? item[_vm.itemKey] : Object.values(item)[0]),
                  staticClass:
                    "maz-draggable-list__item maz-flex maz-align-center maz-space-between"
                },
                [
                  _vm._t(
                    "default",
                    [
                      _c("span", [
                        _vm._v("\n            " + _vm._s(item) + "\n          ")
                      ])
                    ],
                    { item: item, index: i, tag: "div" }
                  )
                ],
                2
              )
            }),
            0
          )
        ],
        1
      )
    ],
    1
  )
}
var _mainvue_type_template_id_b673979a_staticRenderFns = []
_mainvue_type_template_id_b673979a_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazDraggableList/_main.vue?vue&type=template&id=b673979a&

// EXTERNAL MODULE: external "vuedraggable"
var external_vuedraggable_ = __webpack_require__(6);
var external_vuedraggable_default = /*#__PURE__*/__webpack_require__.n(external_vuedraggable_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDraggableList/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/**
 * > Smart Draggable List
 */

/* harmony default export */ var MazDraggableList_mainvue_type_script_lang_js_ = ({
  name: 'MazDraggableList',
  components: {
    draggable: external_vuedraggable_default.a
  },
  props: {
    // Must be an `Array` (use `v-model`)
    value: {
      type: Array,
      required: true
    },
    // is the item's key to build le list (must be different for each item)
    itemKey: {
      type: String,
      default: null
    },
    // set dark theme
    dark: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      drag: false,
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    };
  },
  computed: {
    items: {
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        // update the v-model
        // @arg list updated
        this.$emit('input', value);
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazDraggableList/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazDraggableList_mainvue_type_script_lang_js_ = (MazDraggableList_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazDraggableList/_main.vue





/* normalize component */

var MazDraggableList_main_component = normalizeComponent(
  components_MazDraggableList_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_b673979a_render,
  _mainvue_type_template_id_b673979a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazDraggableList_main_api; }
MazDraggableList_main_component.options.__file = "packages/components/MazDraggableList/_main.vue"
/* harmony default export */ var MazDraggableList_main = (MazDraggableList_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazDraggableList/index.js


MazDraggableList_main.install = function (Vue) {
  Vue.component(MazDraggableList_main.name, MazDraggableList_main);
};

/* harmony default export */ var MazDraggableList = (MazDraggableList_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDropdown/_main.vue?vue&type=template&id=3944840b&
var _mainvue_type_template_id_3944840b_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "LangSwitcher",
      staticClass: "maz-dropdown maz-base-component",
      class: { "maz-is-dark": _vm.dark },
      on: {
        mouseenter: function($event) {
          _vm.hover ? _vm.openMenu() : null
        },
        mouseleave: function($event) {
          _vm.hover ? _vm.closeMenu() : null
        }
      }
    },
    [
      _c(
        "MazBtn",
        _vm._b(
          {
            staticClass: "maz-dropdown__btn",
            attrs: { "no-shadow": "", color: _vm.color },
            nativeOn: {
              focus: function($event) {
                return _vm.openMenu()
              },
              blur: function($event) {
                return _vm.closeMenu()
              }
            }
          },
          "MazBtn",
          _vm.$attrs,
          false
        ),
        [
          _vm._t("default"),
          _c(
            "i",
            {
              staticClass: "maz-dropdown__btn__icon material-icons maz-ml-2",
              class: { rotate: _vm.dropdownOpen }
            },
            [_vm._v("\n      keyboard_arrow_down\n    ")]
          )
        ],
        2
      ),
      _c(
        "transition",
        {
          staticClass: "maz-bg-color",
          attrs: {
            tag: "div",
            name: _vm.hasPositionTop ? "maz-slideinvert" : "maz-slide"
          }
        },
        [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.dropdownOpen,
                  expression: "dropdownOpen"
                }
              ],
              staticClass:
                "maz-dropdown__dropdown maz-flex maz-direction-column maz-border-radius maz-bg-color maz-border maz-border-solid maz-border-color",
              class: [
                {
                  "maz-dropdown__dropdown--top": _vm.hasPositionTop
                },
                _vm.hasPositionLeft
                  ? "maz-dropdown__dropdown--left"
                  : "maz-dropdown__dropdown--right"
              ]
            },
            [_vm._t("dropdown")],
            2
          )
        ]
      )
    ],
    1
  )
}
var _mainvue_type_template_id_3944840b_staticRenderFns = []
_mainvue_type_template_id_3944840b_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazDropdown/_main.vue?vue&type=template&id=3944840b&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDropdown/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazDropdown_mainvue_type_script_lang_js_ = ({
  name: 'MazDropdown',
  inheritAttrs: false,
  props: {
    // dropdown is open on hover
    hover: {
      type: Boolean,
      default: false
    },
    // set dropdown open
    open: {
      type: Boolean,
      default: false
    },
    // set dark mode
    dark: {
      type: Boolean,
      default: false
    },
    // set dropdown position
    position: {
      type: String,
      default: 'right bottom'
    },
    // set color of button
    color: {
      type: String,
      default: 'transparent'
    }
  },
  data: function data() {
    return {
      isOpen: false
    };
  },
  computed: {
    dropdownOpen: function dropdownOpen() {
      return this.open || this.isOpen;
    },
    hasPositionTop: function hasPositionTop() {
      return this.position.includes('top');
    },
    hasPositionLeft: function hasPositionLeft() {
      return this.position.includes('left');
    }
  },
  methods: {
    openMenu: function openMenu() {
      this.isOpen = true;
    },
    closeMenu: function closeMenu() {
      this.isOpen = false;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazDropdown/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazDropdown_mainvue_type_script_lang_js_ = (MazDropdown_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazDropdown/_main.vue





/* normalize component */

var MazDropdown_main_component = normalizeComponent(
  components_MazDropdown_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_3944840b_render,
  _mainvue_type_template_id_3944840b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazDropdown_main_api; }
MazDropdown_main_component.options.__file = "packages/components/MazDropdown/_main.vue"
/* harmony default export */ var MazDropdown_main = (MazDropdown_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazDropdown/index.js


MazDropdown_main.install = function (Vue) {
  Vue.component(MazDropdown_main.name, MazDropdown_main);
};

/* harmony default export */ var MazDropdown = (MazDropdown_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDropzone/_main.vue?vue&type=template&id=210abe95&
var _mainvue_type_template_id_210abe95_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "VueDropzone",
    _vm._b(
      {
        ref: "mazDropzone",
        staticClass:
          "maz-base-component maz-dropzone maz-w-100 maz-h-100 maz-flex maz-flex-center",
        class: { "maz-is-dark": _vm.dark },
        attrs: {
          id: _vm.id,
          tabindex: "0",
          options: _vm.dropzoneOptions,
          "duplicate-check": _vm.duplicateCheck
        },
        on: {
          "vdropzone-file-added": _vm.fileAdded,
          "vdropzone-thumbnail": _vm.thumbnail,
          "vdropzone-error": _vm.fileError,
          "vdropzone-error-multiple": _vm.fileMultipleError,
          "vdropzone-removed-file": _vm.fileRemoved,
          "vdropzone-sending": _vm.sending,
          "vdropzone-max-files-reached": _vm.maxFilesReached,
          "vdropzone-success": _vm.fileUploadSuccess,
          "vdropzone-success-multiple": _vm.fileUploadMultipleSuccess,
          "vdropzone-duplicate-file": _vm.duplicateFile,
          "vdropzone-s3-upload-success": _vm.s3UploadSuccess,
          "vdropzone-s3-upload-error": _vm.s3UploadError,
          "vdropzone-queue-complete": _vm.queueComplete
        },
        nativeOn: {
          keydown: function($event) {
            return _vm.keyDown($event)
          }
        }
      },
      "VueDropzone",
      _vm.$attrs,
      false
    )
  )
}
var _mainvue_type_template_id_210abe95_staticRenderFns = []
_mainvue_type_template_id_210abe95_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazDropzone/_main.vue?vue&type=template&id=210abe95&

// EXTERNAL MODULE: external "vue2-dropzone"
var external_vue2_dropzone_ = __webpack_require__(7);
var external_vue2_dropzone_default = /*#__PURE__*/__webpack_require__.n(external_vue2_dropzone_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDropzone/_main.vue?vue&type=script&lang=js&


function _mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _mainvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { _mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { _mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/**
 * @module component - mazDropzone
 * @param {string} url
 * @param {string} acceptedFiles
 * @param {string} paramName
 * @param {object} headers
 * @param {object} translations
 * @param {number} maxFiles
 * @param {number} maxFilesize
 * @emits file-upload-success
 * @emits file-upload-error
 */

/* harmony default export */ var MazDropzone_mainvue_type_script_lang_js_ = ({
  name: 'MazDropzone',
  components: {
    VueDropzone: external_vue2_dropzone_default.a
  },
  props: {
    // URL to upload files
    url: {
      type: String,
      required: true
    },
    // Id of component
    id: {
      type: String,
      default: 'MazDropzone'
    },
    // File type accepted
    acceptedFiles: {
      type: String,
      default: 'image/*'
    },
    // File name uploaded
    paramName: {
      type: String,
      default: null
    },
    // Set request headers with your own (token, jwt)
    headers: {
      type: Object,
      default: null
    },
    // Messages translations (error, success)
    translations: {
      type: Object,
      default: null
    },
    // Max files number
    maxFiles: {
      type: Number,
      default: 1
    },
    // Max files size
    maxFilesize: {
      type: Number,
      default: 2
    },
    // User can remove files with a button
    addRemoveLinks: {
      type: Boolean,
      default: true
    },
    // Set dark theme
    dark: {
      type: Boolean,
      default: false
    },
    // If error remove all files in area
    removeFilesOnError: {
      type: Boolean,
      default: false
    },
    // If error remove file in area
    removeFileOnError: {
      type: Boolean,
      default: false
    },
    // Not upload immediatly the files
    autoProcessQueue: {
      type: Boolean,
      default: true
    },
    // Check files to avoid duplicates
    duplicateCheck: {
      type: Boolean,
      default: false
    },
    // Upload multiple files in only one request
    uploadMultiple: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    t: function t() {
      var defaultTranslation = {
        chooseOrDropAFile: 'Choose or drop a file',
        filesDescriptions: "(PNG or JPG under ".concat(this.maxFilesize, "MB)"),
        browserIsNotSupported: 'Your browser is not supported',
        fileIsTooBig: "File(s) too big (max: ".concat(this.maxFilesize, " MB)"),
        invalidFileType: "Invalid file(s) (PNG or JPG under ".concat(this.maxFilesize, "MB)"),
        dictRemoveFile: 'Remove',
        dictCancelUpload: 'Cancel upload',
        dictMaxFilesExceeded: "You can not upload any more files. (max: ".concat(this.maxFiles, " files)")
      };
      return _objectSpread(_objectSpread({}, defaultTranslation), this.translations);
    },
    dropzoneOptions: function dropzoneOptions() {
      return _objectSpread(_objectSpread({
        url: this.url,
        acceptedFiles: this.acceptedFiles,
        maxFilesize: this.maxFilesize,
        maxFiles: this.maxFiles,
        autoProcessQueue: this.autoProcessQueue,
        uploadMultiple: this.uploadMultiple
      }, this.paramName ? {
        paramName: this.paramName
      } : {}), {}, {
        dictDefaultMessage: "\n            <i class=\"material-icons\" aria-hidden=\"true\">cloud_upload</i>\n            <br />\n            <span>".concat(this.t.chooseOrDropAFile, "</span>\n            <br />\n            <span class=\"fs-12\">").concat(this.t.filesDescriptions, "</span>\n          "),
        dictFallbackMessage: this.t.browserIsNotSupported,
        dictFileTooBig: this.t.fileIsTooBig,
        dictInvalidFileType: this.t.invalidFileType,
        dictRemoveFile: this.t.dictRemoveFile,
        dictCancelUpload: this.t.dictCancelUpload,
        dictMaxFilesExceeded: this.t.dictMaxFilesExceeded,
        addRemoveLinks: this.addRemoveLinks,
        previewTemplate: "\n            <div class=\"dz-preview dz-file-preview maz-flex-1\">\n              <div class=\"dz-image\">\n                  <div data-dz-thumbnail-bg></div>\n              </div>\n              <div class=\"dz-details maz-flex maz-direction-column maz-align-center maz-justify-center\">\n                  <div class=\"dz-filename\"><span data-dz-name></span></div>\n                  <div class=\"dz-size\"><span data-dz-size></span></div>\n              </div>\n              <div class=\"dz-progress\">\n                <span class=\"dz-upload\" data-dz-uploadprogress></span>\n              </div>\n              <div class=\"dz-success-mark maz-text-center\">\n                <i class=\"material-icons\" aria-hidden=\"true\">done</i>\n              </div>\n              <div class=\"dz-error-mark maz-text-center\">\n                <i class=\"material-icons\" aria-hidden=\"true\">error_outline</i>\n              </div>\n            </div>\n          ",
        headers: this.headers
      });
    }
  },
  watch: {
    url: function url(val) {
      this.$refs.mazDropzone.setOption('url', val);
    }
  },
  mounted: function mounted() {
    this.$refs.mazDropzone.setOption('url', this.url);
  },
  methods: {
    keyDown: function keyDown(e) {
      var _this = this;

      return _mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.$nextTick();

              case 2:
                if (e.keyCode === 13 || e.keyCode === 32) {
                  e.preventDefault();

                  _this.$refs.mazDropzone.$el.click();
                }

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    thumbnail: function thumbnail(file, dataUrl) {
      var j;
      var len;
      var ref;
      var thumbnailElement;

      if (file.previewElement) {
        file.previewElement.classList.remove('dz-file-preview');
        ref = file.previewElement.querySelectorAll('[data-dz-thumbnail-bg]');

        for (j = 0, len = ref.length; j < len; j++) {
          thumbnailElement = ref[j];
          thumbnailElement.alt = file.name;
          thumbnailElement.style.backgroundImage = "url('".concat(dataUrl, "')");
        }

        return setTimeout(function () {
          return function () {
            return file.previewElement.classList.add('dz-image-preview');
          };
        }(this), 1);
      }
    },
    removeAllFiles: function removeAllFiles() {
      return this.$refs.mazDropzone.removeAllFiles();
    },
    removeFile: function removeFile(file) {
      return this.$refs.mazDropzone.removeFile(file);
    },
    processQueue: function processQueue() {
      return this.$refs.mazDropzone.processQueue();
    },
    getAcceptedFiles: function getAcceptedFiles() {
      return this.$refs.mazDropzone.getAcceptedFiles();
    },
    getRejectedFiles: function getRejectedFiles() {
      return this.$refs.mazDropzone.getRejectedFiles();
    },
    getQueuedFiles: function getQueuedFiles() {
      return this.$refs.mazDropzone.getQueuedFiles();
    },
    getUploadingFiles: function getUploadingFiles() {
      return this.$refs.mazDropzone.getUploadingFiles();
    },
    disable: function disable() {
      return this.$refs.mazDropzone.disable();
    },
    enable: function enable() {
      return this.$refs.mazDropzone.enable();
    },
    setOption: function setOption(optionName, value) {
      return this.$refs.mazDropzone.setOption(optionName, value);
    },
    manuallyAddFile: function manuallyAddFile(file, fileUrl) {
      return this.$refs.mazDropzone.manuallyAddFile(file, fileUrl);
    },
    setAWSSigningURL: function setAWSSigningURL(url) {
      return this.$refs.mazDropzone.setAWSSigningURL(url);
    },
    fileAdded: function fileAdded(file) {
      // Called whenever a new file is dropped in the zone.
      // @arg File
      this.$emit('file-added', file);
    },
    fileUploadSuccess: function fileUploadSuccess(file, response) {
      // Called when the file is successfully sent.
      // @arg Response, File
      this.$emit('file-upload-success', file, response);
    },
    fileUploadMultipleSuccess: function fileUploadMultipleSuccess(files, response, xhr) {
      // Called when the file is successfully sent.
      // @arg Response, Files, XHR
      this.$emit('file-upload-multiple-success', response, files, xhr);
    },
    fileError: function fileError(file, error, xhr) {
      // Called when an error occured while uploading the file.
      // @arg Error, File, XHR
      this.$emit('file-upload-error', error, file, xhr);
      if (this.removeFilesOnError) this.removeAllFiles();
      if (this.removeFileOnError) this.removeFile(file);
    },
    fileMultipleError: function fileMultipleError(files, error) {
      var _this2 = this;

      // Called when an error occured while uploading the file.
      // @arg Error
      this.$emit('file-upload-multiple-error', error);

      if (this.removeFileOnError) {
        files.forEach(function (f) {
          _this2.removeFile(f);
        });
      }
    },
    maxFilesReached: function maxFilesReached(file) {
      // Called when the number of files accepted reaches the maxFiles limit.
      // @arg File
      this.$emit('max-files-reached', file);
    },
    s3UploadError: function s3UploadError(e) {
      // If error occures in AWS S3 upload.
      // @arg errorMessage
      this.$emit('s3-upload-error', e);
    },
    s3UploadSuccess: function s3UploadSuccess(e) {
      // When file is uploaded to AWS S3 successfully.
      // @arg s3ObjectLocation
      this.$emit('s3-upload-success', e);
    },
    fileRemoved: function fileRemoved(e) {
      // A file was removed from the dropzone.
      // @arg File
      this.$emit('file-removed', e);
    },
    sending: function sending(file, xhr, formData) {
      // Modify the request and add addtional parameters to request before sending.
      // @arg file, xhr, formData
      this.$emit('file-sending', file, xhr, formData);
    },
    duplicateFile: function duplicateFile(file) {
      // Fired when duplicateCheck is enabled and duplicate file is found.
      // @arg file
      this.$emit('duplicate-file', file);
    },
    queueComplete: function queueComplete(e) {
      // Fired when queue has been completely processed/ uploaded.
      this.$emit('queue-complete', e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazDropzone/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazDropzone_mainvue_type_script_lang_js_ = (MazDropzone_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazDropzone/_main.vue





/* normalize component */

var MazDropzone_main_component = normalizeComponent(
  components_MazDropzone_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_210abe95_render,
  _mainvue_type_template_id_210abe95_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazDropzone_main_api; }
MazDropzone_main_component.options.__file = "packages/components/MazDropzone/_main.vue"
/* harmony default export */ var MazDropzone_main = (MazDropzone_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazDropzone/index.js


MazDropzone_main.install = function (Vue) {
  Vue.component(MazDropzone_main.name, MazDropzone_main);
};

/* harmony default export */ var MazDropzone = (MazDropzone_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazFlex/_main.vue?vue&type=template&id=1115db1a&
var _mainvue_type_template_id_1115db1a_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "maz-base-component maz-flex", class: [_vm.classes] },
    [_vm._t("default")],
    2
  )
}
var _mainvue_type_template_id_1115db1a_staticRenderFns = []
_mainvue_type_template_id_1115db1a_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazFlex/_main.vue?vue&type=template&id=1115db1a&

// CONCATENATED MODULE: ./packages/utils/debounce.js
/* harmony default export */ var debounce = (function (func, delay) {
  var debounceTimer;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      return func.apply(context, args);
    }, delay);
  };
});
// CONCATENATED MODULE: ./packages/utils/pascalCaseToKebabCase.js
/* harmony default export */ var pascalCaseToKebabCase = (function (string) {
  return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2').toLowerCase();
});
// CONCATENATED MODULE: ./packages/utils/index.js


// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazFlex/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//

var classesWithNumber = ['flex1', 'flex25', 'flex33', 'flex50', 'flex75', 'flex100'];

var hasNumberClass = function hasNumberClass(key) {
  return classesWithNumber.includes(key);
};

/* harmony default export */ var MazFlex_mainvue_type_script_lang_js_ = ({
  name: 'MazFlex',
  props: {
    flex: {
      type: Boolean,
      default: false
    },
    directionColumn: {
      type: Boolean,
      default: false
    },
    directionColumnReverse: {
      type: Boolean,
      default: false
    },
    directionRow: {
      type: Boolean,
      default: false
    },
    directionRowReverse: {
      type: Boolean,
      default: false
    },
    alignStart: {
      type: Boolean,
      default: false
    },
    alignEnd: {
      type: Boolean,
      default: false
    },
    alignCenter: {
      type: Boolean,
      default: false
    },
    justifyEnd: {
      type: Boolean,
      default: false
    },
    justifyStart: {
      type: Boolean,
      default: false
    },
    justifyCenter: {
      type: Boolean,
      default: false
    },
    spaceBetween: {
      type: Boolean,
      default: false
    },
    spaceAround: {
      type: Boolean,
      default: false
    },
    flex1: {
      type: Boolean,
      default: false
    },
    flex100: {
      type: Boolean,
      default: false
    },
    flex75: {
      type: Boolean,
      default: false
    },
    flex50: {
      type: Boolean,
      default: false
    },
    flex33: {
      type: Boolean,
      default: false
    },
    flex25: {
      type: Boolean,
      default: false
    },
    fill: {
      type: Boolean,
      default: false
    },
    fluid: {
      type: Boolean,
      default: false
    },
    wrap: {
      type: Boolean,
      default: false
    },
    grow: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes: function classes() {
      return Object.entries(this.$props).map(function (entry) {
        var key = entry[0];
        var value = entry[1];

        if (value) {
          return hasNumberClass(key) ? "maz-flex-".concat(key.split('flex')[1]) : "maz-".concat(pascalCaseToKebabCase(key));
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazFlex/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazFlex_mainvue_type_script_lang_js_ = (MazFlex_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazFlex/_main.vue





/* normalize component */

var MazFlex_main_component = normalizeComponent(
  components_MazFlex_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_1115db1a_render,
  _mainvue_type_template_id_1115db1a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazFlex_main_api; }
MazFlex_main_component.options.__file = "packages/components/MazFlex/_main.vue"
/* harmony default export */ var MazFlex_main = (MazFlex_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazFlex/index.js


MazFlex_main.install = function (Vue) {
  Vue.component(MazFlex_main.name, MazFlex_main);
};

/* harmony default export */ var MazFlex = (MazFlex_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazImg/_main.vue?vue&type=template&id=61f7feeb&
var _mainvue_type_template_id_61f7feeb_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "figure",
    {
      directives: [
        {
          name: "preview",
          rawName: "v-preview",
          value: { src: _vm.src, alt: _vm.alt, disabled: _vm.noZoom },
          expression: "{ src, alt, disabled: noZoom }"
        }
      ],
      ref: "MazImg",
      staticClass:
        "maz-base-component maz-img maz-flex maz-flex-center maz-direction-column maz-bg-color-light maz-space-between",
      class: {
        "maz-img--no-zoom": _vm.noZoom,
        "maz-img--no-shadow": _vm.noShadow,
        "maz-border-radius": !_vm.noBorderRadius,
        "maz-img--fullwidth": _vm.fullwidth,
        "maz-img--loading": _vm.loading
      },
      style: [_vm.containerSize]
    },
    [
      !_vm.loading
        ? _c("div", {
            staticClass: "maz-img__bg-img",
            class: {
              "maz-img__bg-img--contain maz-bg-color-light": _vm.contain
            },
            style: _vm.bgImg,
            attrs: { "aria-label": _vm.alt }
          })
        : _c("MazSpinner"),
      _c("MazBtn", {
        staticClass: "maz-img__show-btn",
        attrs: { fab: "", "left-icon-name": "visibility" }
      }),
      _vm.legend
        ? _c("figcaption", { staticClass: "maz-img__legend maz-p-2" }, [
            _vm._v("\n    " + _vm._s(_vm.legend) + "\n  ")
          ])
        : _vm._e()
    ],
    1
  )
}
var _mainvue_type_template_id_61f7feeb_staticRenderFns = []
_mainvue_type_template_id_61f7feeb_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazImg/_main.vue?vue&type=template&id=61f7feeb&

// CONCATENATED MODULE: ./packages/directives/img-preview/index.js
var style = "\n.maz-img-preview {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 1rem;\n  z-index: 1050;\n  background-color: rgba(86, 87, 117, .7);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n}\n\n.maz-img-preview img {\n  max-width: 100%;\n  max-height: 100%;\n}\n\n.maz-img-preview img,\n.maz-img-preview button {\n  transition: all 300ms ease-in-out;\n  opacity: 0;\n  transform: scale(0.5);\n}\n\n.maz-img-preview button {\n  margin-bottom: 20px;\n  border: none;\n  background-color: white;\n  height: 40px;\n  width: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 40px;\n  cursor: pointer;\n}\n\n.maz-img-preview button:hover {\n  background-color: #ccc;\n}\n\n.maz-img-preview.maz-animate img,\n.maz-img-preview.maz-animate button {\n  opacity: 1;\n  transform: scale(1);\n}";

var addStyle = function addStyle(styleString) {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'MazPreviewStyle';
  style.textContent = styleString;
  document.head.append(style);
};

var closePreview = function closePreview() {
  var container = document.querySelector('#MazImgPreviewFullsize');
  var style = document.querySelector('#MazPreviewStyle');

  if (container) {
    container.classList.remove('maz-animate');
  }

  setTimeout(function () {
    if (container) {
      container.remove();
    }

    if (style) {
      style.remove();
    }
  }, 500);
};

var keydownLister = function keydownLister(e) {
  if (e.keyCode === 27) {
    document.removeEventListener('keydown', keydownLister);
    closePreview();
  }
};

var renderPreview = function renderPreview(_ref) {
  var src = _ref.src,
      alt = _ref.alt;
  addStyle(style);
  var container = document.createElement('div');
  container.classList = 'maz-img-preview';
  container.setAttribute('id', 'MazImgPreviewFullsize');
  container.addEventListener('click', function (e) {
    if (container.isEqualNode(e.target)) {
      closePreview();
    }
  });
  var img = document.createElement('img');
  img.setAttribute('src', src);
  img.setAttribute('alt', alt);
  img.classList.add('maz-border-radius');
  var icon = document.createElement('i');
  icon.classList.add('material-icons');
  icon.appendChild(document.createTextNode('close'));
  var button = document.createElement('button');

  button.onclick = function () {
    closePreview();
  };

  button.appendChild(icon);
  container.append(button, img);
  document.body.appendChild(container);
  document.addEventListener('keydown', keydownLister);
  setTimeout(function () {
    if (container) {
      container.classList.add('maz-animate');
    }
  }, 150);
};

/* harmony default export */ var img_preview = ({
  bind: function bind(el, binding) {
    if (binding.value.disabled) {
      return;
    }

    if (!binding.value) {
      throw new Error('[MazUI](img-preview) url of image must be provided');
    }

    var options = {
      src: binding.value.src || binding.value,
      alt: binding.value.alt
    };
    var bindEvent = binding.arg || 'click';
    el.addEventListener(bindEvent, function () {
      return renderPreview(options);
    });
  },
  unbind: function unbind(el, binding) {
    var bindEvent = binding.arg || 'click';
    el.removeEventListener(bindEvent, function () {
      return renderPreview();
    });
  }
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazImg/_main.vue?vue&type=script&lang=js&
function _mainvue_type_script_lang_js_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _mainvue_type_script_lang_js_typeof = function _typeof(obj) { return typeof obj; }; } else { _mainvue_type_script_lang_js_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _mainvue_type_script_lang_js_typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var MazImg_mainvue_type_script_lang_js_ = ({
  name: 'MazImg',
  components: {
    MazSpinner: MazSpinner,
    MazBtn: MazBtn
  },
  directives: {
    preview: img_preview
  },
  props: {
    // path or url of image
    src: {
      validator: function validator(prop) {
        return ['string'].includes(_mainvue_type_script_lang_js_typeof(prop)) && prop !== '';
      },
      required: true
    },
    // alt attribute of image
    alt: {
      type: String,
      default: 'Image description'
    },
    // legend of image
    legend: {
      type: String,
      default: null
    },
    // show all image in the container
    contain: {
      type: Boolean,
      default: false
    },
    // remove shadow of container
    noShadow: {
      type: Boolean,
      default: false
    },
    // disable the zoom on click
    noZoom: {
      type: Boolean,
      default: false
    },
    // disable the zoom on click
    noBorderRadius: {
      type: Boolean,
      default: false
    },
    // display `width: 100%`
    fullwidth: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      width: null,
      height: null,
      loading: true,
      heightImage: null
    };
  },
  computed: {
    containerSize: function containerSize() {
      var height = this.height,
          width = this.width;
      return {
        width: "".concat(width, "px"),
        height: "".concat(height, "px")
      };
    },
    bgImg: function bgImg() {
      var src = this.src;
      return {
        backgroundImage: "url(".concat(src, ")")
      };
    }
  },
  watch: {
    src: function src() {
      this.setSizeImage();
    }
  },
  mounted: function mounted() {
    this.setSizeImage();
    this.setObserver();
  },
  methods: {
    setSizeImage: function setSizeImage() {
      var _this = this;

      try {
        var img = new Image();

        img.onload = function () {
          _this.loading = false;
          _this.width = img.width;
          _this.heightImage = img.height;
          _this.height = _this.getHeightRatio(img.height);
        };

        img.src = this.src;
      } catch (e) {
        throw new Error("[MazImg] Error while getting image dimensions: ".concat(e));
      }
    },
    getHeightRatio: function getHeightRatio(height) {
      try {
        var width = this.width;
        var MazImg = this.$refs.MazImg;
        if (!MazImg) return;
        var componentWidth = this.$refs.MazImg.clientWidth;
        var ratio = 1 - (width - componentWidth) / width;
        return height * ratio;
      } catch (e) {
        throw new Error("[MazImg] Error while calculte height size, ".concat(e));
      }
    },
    setObserver: function setObserver() {
      var _this2 = this;

      var elem = this.$refs.MazImg;
      var resizeObserver = new ResizeObserver(function () {
        _this2.height = _this2.getHeightRatio(_this2.heightImage);
      });
      resizeObserver.observe(elem);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazImg/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazImg_mainvue_type_script_lang_js_ = (MazImg_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazImg/_main.vue





/* normalize component */

var MazImg_main_component = normalizeComponent(
  components_MazImg_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_61f7feeb_render,
  _mainvue_type_template_id_61f7feeb_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazImg_main_api; }
MazImg_main_component.options.__file = "packages/components/MazImg/_main.vue"
/* harmony default export */ var MazImg_main = (MazImg_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazImg/index.js


MazImg_main.install = function (Vue) {
  Vue.component(MazImg_main.name, MazImg_main);
};

/* harmony default export */ var MazImg = (MazImg_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazInput/_main.vue?vue&type=template&id=5b617c72&
var _mainvue_type_template_id_5b617c72_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "parent",
      staticClass:
        "maz-base-component maz-overflow-hidden maz-input maz-border maz-border-color maz-border-color-hover maz-border-solid maz-border-radius",
      class: [
        {
          "is-focused": _vm.isFocus || _vm.focus,
          "is-valid": _vm.success,
          "has-value": _vm.value,
          "is-textarea": _vm.textarea,
          "has-error": _vm.error,
          "has-warning": _vm.warning,
          "is-disabled": _vm.disabled,
          "maz-is-dark": _vm.dark,
          "has-hint": _vm.hint,
          "has-no-label": !_vm.hasLabel && !_vm.hint,
          "has-left-icon": _vm.hasLeftIcon()
        },
        "maz-input--" + _vm.size,
        "has-" + _vm.leftNumberIcon + "-right-icon",
        "maz-input--" + _vm.color
      ],
      on: { click: _vm.focusInput }
    },
    [
      _vm.hasLeftIcon()
        ? _c(
            "div",
            {
              staticClass: "maz-input__icon maz-flex left",
              class: [
                _vm.textarea ? "maz-align-start maz-pt-2" : "maz-align-center"
              ]
            },
            [
              _vm._t("icon-left", [
                _c("i", { staticClass: "material-icons" }, [
                  _vm._v(_vm._s(_vm.leftIconName))
                ])
              ])
            ],
            2
          )
        : _vm._e(),
      _vm.hasRightIcon()
        ? _c(
            "div",
            {
              staticClass: "maz-input__icon maz-flex right",
              class: [
                _vm.textarea ? "maz-align-start maz-pt-2" : "maz-align-center"
              ]
            },
            [
              _vm._t("icon-right", [
                _c("i", { staticClass: "material-icons" }, [
                  _vm._v(_vm._s(_vm.rightIconName))
                ])
              ])
            ],
            2
          )
        : _vm._e(),
      _vm.getType === "checkbox" && !_vm.textarea
        ? _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.inputValue,
                    expression: "inputValue"
                  }
                ],
                ref: "MazInput",
                staticClass: "maz-input__input",
                class: {
                  "has-right-icon":
                    _vm.hasClearBtn || _vm.hasPasswordBtn || _vm.hasRightIcon()
                },
                attrs: {
                  id: _vm.uniqueId,
                  placeholder: _vm.placeholderValue,
                  "aria-label": _vm.placeholder,
                  disabled: _vm.disabled,
                  required: _vm.required,
                  readonly: _vm.readonly,
                  type: "checkbox"
                },
                domProps: {
                  checked: Array.isArray(_vm.inputValue)
                    ? _vm._i(_vm.inputValue, null) > -1
                    : _vm.inputValue
                },
                on: {
                  keydown: _vm.keyDown,
                  keyup: _vm.keyUp,
                  focus: _vm.onFocus,
                  blur: _vm.onBlur,
                  paste: _vm.onPaste,
                  change: [
                    function($event) {
                      var $$a = _vm.inputValue,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 && (_vm.inputValue = $$a.concat([$$v]))
                        } else {
                          $$i > -1 &&
                            (_vm.inputValue = $$a
                              .slice(0, $$i)
                              .concat($$a.slice($$i + 1)))
                        }
                      } else {
                        _vm.inputValue = $$c
                      }
                    },
                    _vm.onChange
                  ],
                  click: function($event) {
                    return _vm.$emit("click", $event)
                  }
                }
              },
              "input",
              _vm.$attrs,
              false
            )
          )
        : _vm.getType === "radio" && !_vm.textarea
        ? _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.inputValue,
                    expression: "inputValue"
                  }
                ],
                ref: "MazInput",
                staticClass: "maz-input__input",
                class: {
                  "has-right-icon":
                    _vm.hasClearBtn || _vm.hasPasswordBtn || _vm.hasRightIcon()
                },
                attrs: {
                  id: _vm.uniqueId,
                  placeholder: _vm.placeholderValue,
                  "aria-label": _vm.placeholder,
                  disabled: _vm.disabled,
                  required: _vm.required,
                  readonly: _vm.readonly,
                  type: "radio"
                },
                domProps: { checked: _vm._q(_vm.inputValue, null) },
                on: {
                  keydown: _vm.keyDown,
                  keyup: _vm.keyUp,
                  focus: _vm.onFocus,
                  blur: _vm.onBlur,
                  paste: _vm.onPaste,
                  change: [
                    function($event) {
                      _vm.inputValue = null
                    },
                    _vm.onChange
                  ],
                  click: function($event) {
                    return _vm.$emit("click", $event)
                  }
                }
              },
              "input",
              _vm.$attrs,
              false
            )
          )
        : !_vm.textarea
        ? _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.inputValue,
                    expression: "inputValue"
                  }
                ],
                ref: "MazInput",
                staticClass: "maz-input__input",
                class: {
                  "has-right-icon":
                    _vm.hasClearBtn || _vm.hasPasswordBtn || _vm.hasRightIcon()
                },
                attrs: {
                  id: _vm.uniqueId,
                  placeholder: _vm.placeholderValue,
                  "aria-label": _vm.placeholder,
                  disabled: _vm.disabled,
                  required: _vm.required,
                  readonly: _vm.readonly,
                  type: _vm.getType
                },
                domProps: { value: _vm.inputValue },
                on: {
                  keydown: _vm.keyDown,
                  keyup: _vm.keyUp,
                  focus: _vm.onFocus,
                  blur: _vm.onBlur,
                  paste: _vm.onPaste,
                  change: _vm.onChange,
                  click: function($event) {
                    return _vm.$emit("click", $event)
                  },
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.inputValue = $event.target.value
                  }
                }
              },
              "input",
              _vm.$attrs,
              false
            )
          )
        : _c(
            "textarea",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.inputValue,
                    expression: "inputValue"
                  }
                ],
                ref: "MazInput",
                staticClass: "maz-input__input maz-textarea",
                attrs: {
                  id: _vm.uniqueId,
                  placeholder: _vm.placeholderValue,
                  type: _vm.type,
                  required: _vm.required,
                  readonly: _vm.readonly
                },
                domProps: { value: _vm.inputValue },
                on: {
                  keydown: _vm.keyDown,
                  keyup: _vm.keyUp,
                  focus: _vm.onFocus,
                  blur: _vm.onBlur,
                  paste: _vm.onPaste,
                  change: _vm.onChange,
                  click: function($event) {
                    return _vm.$emit("click", $event)
                  },
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.inputValue = $event.target.value
                  }
                }
              },
              "textarea",
              _vm.$attrs,
              false
            )
          ),
      _vm.hasLabel || _vm.hint
        ? _c(
            "label",
            {
              ref: "label",
              staticClass: "maz-input__label",
              class: _vm.error ? "maz-text-danger" : null,
              attrs: { for: _vm.uniqueId, tabindex: "-1" },
              on: { click: _vm.focusInput }
            },
            [
              _vm._v(
                "\n    " +
                  _vm._s(_vm.hintValue || _vm.placeholderValue) +
                  "\n  "
              )
            ]
          )
        : _vm._e(),
      _c("transition-group", { attrs: { name: "maz-scale" } }, [
        _vm.hasClearBtn
          ? _c(
              "button",
              {
                key: "clear-button",
                staticClass:
                  "maz-input__toggle-btn --clear maz-flex maz-flex-center",
                class: { "has-right-icon": _vm.hasRightIcon() },
                attrs: { title: "clear", type: "button", tabindex: "-1" },
                on: {
                  click: function($event) {
                    $event.stopPropagation()
                    return _vm.clear($event)
                  }
                }
              },
              [
                _c(
                  "i",
                  { staticClass: "maz-input__toggle-btn__icon material-icons" },
                  [_vm._v("\n        close\n      ")]
                )
              ]
            )
          : _vm._e(),
        _vm.hasPasswordBtn
          ? _c(
              "button",
              {
                key: "password-button",
                staticClass:
                  "maz-input__toggle-btn password maz-flex maz-flex-center",
                class: {
                  "has-clear-btn": _vm.hasClearBtn,
                  "has-right-icon": _vm.hasRightIcon()
                },
                attrs: { title: "clear", type: "button", tabindex: "-1" },
                on: {
                  click: function($event) {
                    _vm.showPassword = !_vm.showPassword
                  }
                }
              },
              [
                _c(
                  "i",
                  { staticClass: "maz-input__toggle-btn__icon material-icons" },
                  [
                    _vm._v(
                      "\n        " +
                        _vm._s(
                          _vm.showPassword ? "visibility_off" : "visibility"
                        ) +
                        "\n      "
                    )
                  ]
                )
              ]
            )
          : _vm._e()
      ]),
      _vm.loading
        ? _c(
            "div",
            {
              staticClass: "maz-input__loader",
              class: { textarea: _vm.textarea }
            },
            [_c("div", { staticClass: "maz-input__loader__progress-bar" })]
          )
        : _vm._e()
    ],
    1
  )
}
var _mainvue_type_template_id_5b617c72_staticRenderFns = []
_mainvue_type_template_id_5b617c72_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazInput/_main.vue?vue&type=template&id=5b617c72&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazInput/_main.vue?vue&type=script&lang=js&
function MazInput_mainvue_type_script_lang_js_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MazInput_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return typeof obj; }; } else { MazInput_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MazInput_mainvue_type_script_lang_js_typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var DEBOUNCE = 500;
/**
 * > Beautiful input UI with loading & error manager
 */

/* harmony default export */ var MazInput_mainvue_type_script_lang_js_ = ({
  name: 'MazInput',
  mixins: [uniqueId],
  props: {
    // value of the input
    value: {
      validator: function validator(prop) {
        return ['string', 'number'].includes(MazInput_mainvue_type_script_lang_js_typeof(prop)) || prop === null;
      },
      default: null
    },
    // input id
    id: {
      type: String,
      default: null
    },
    // value of the input
    placeholder: {
      type: String,
      default: 'Enter text'
    },
    // replace the label if is present
    hint: {
      type: String,
      default: null
    },
    // input size (`'lg'` / `'sm'`)
    size: {
      type: String,
      default: null
    },
    // is the input size (`text` or `number`)
    type: {
      type: String,
      default: 'text'
    },
    // should be a [material icon](https://material.io/resources/icons/) name
    leftIconName: {
      type: String,
      default: null
    },
    // should be a [material icon](https://material.io/resources/icons/) name
    rightIconName: {
      type: String,
      default: null
    },
    // When is `true` the input has the error style
    error: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has the warning style
    warning: {
      type: Boolean,
      default: false
    },
    // When is `true` the input is disable
    disabled: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has the dark theme
    dark: {
      type: Boolean,
      default: false
    },
    // When is `true` the input is on readonly mode
    readonly: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has the valid style
    success: {
      type: Boolean,
      default: false
    },
    // When is `true` the input become required & has the `*` symbol
    required: {
      type: Boolean,
      default: false
    },
    // When is `true` the input is a textarea
    textarea: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has a progress bar animated
    loading: {
      type: Boolean,
      default: false
    },
    // When is `true` the input can be clear with a button on the right
    clearable: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has not label (top placeholder when value is not empty)
    noLabel: {
      type: Boolean,
      default: false
    },
    // When is `true` and is `required`, the `*` symbol is not showing
    noRequiredSymbol: {
      type: Boolean,
      default: false
    },
    // force focus style input
    focus: {
      type: Boolean,
      default: false
    },
    // color name in basic colors
    color: {
      type: String,
      default: 'primary'
    },
    // Add a debounce of 500ms to emit the value
    debounce: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      isFocus: false,
      showPassword: false
    };
  },
  computed: {
    inputValue: {
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        var valueToEmit = this.hasNumberType ? !value ? 0 : parseInt(value) : value;
        this.emitValue(valueToEmit);
      }
    },
    placeholderValue: function placeholderValue() {
      var placeholder = this.placeholder;
      if (this.required && placeholder && !this.noRequiredSymbol) placeholder += ' *';
      return placeholder;
    },
    hintValue: function hintValue() {
      var hint = this.hint;
      if (this.required && hint) hint += ' *';
      return hint;
    },
    hasNumberType: function hasNumberType() {
      return this.type === 'number';
    },
    hasLabel: function hasLabel() {
      return !this.noLabel;
    },
    getType: function getType() {
      return this.showPassword ? 'text' : this.type;
    },
    hasPasswordBtn: function hasPasswordBtn() {
      return this.type === 'password' && this.inputValue;
    },
    hasClearBtn: function hasClearBtn() {
      return this.clearable && this.inputValue && !this.textarea;
    },
    leftNumberIcon: function leftNumberIcon() {
      var array = [!!this.hasRightIcon(), !!this.hasClearBtn, !!this.hasPasswordBtn];
      return array.filter(function (a) {
        return a;
      }).length;
    }
  },
  methods: {
    debounceValue: debounce(function (value) {
      // return the input value (in `@input` or `v-model`)
      // @arg input
      this.$emit('input', value);
    }, DEBOUNCE),
    emitValue: function emitValue(value) {
      if (this.debounce) return this.debounceValue(value);
      this.$emit('input', value);
    },
    hasLeftIcon: function hasLeftIcon() {
      return this.leftIconName || this.$slots['icon-left'];
    },
    hasRightIcon: function hasRightIcon() {
      return this.rightIconName || this.$slots['icon-right'];
    },
    focusInput: function focusInput() {
      this.$refs.MazInput.focus();
    },
    onFocus: function onFocus(e) {
      // sent the focus event
      // @arg event
      this.$emit('focus', e);
      this.isFocus = true;
    },
    onBlur: function onBlur(e) {
      // sent the blur event
      // @arg event
      this.$emit('blur', e);
      this.isFocus = false;
    },
    onPaste: function onPaste(e) {
      // sent when text is past in the textfield
      // @arg event
      this.$emit('paste', e);
    },
    onChange: function onChange(e) {
      // sent on input change
      // @arg event
      this.$emit('change', e);
    },
    clear: function clear() {
      this.$emit('input', this.hasNumberType ? 0 : ''); // sent when the input is clear

      this.$emit('clear');
    },
    keyUp: function keyUp(e) {
      // sent the keyup event
      // @arg event
      this.$emit('keyup', e);
    },
    keyDown: function keyDown(e) {
      // sent the keydown event
      // @arg event
      this.$emit('keydown', e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazInput/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazInput_mainvue_type_script_lang_js_ = (MazInput_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazInput/_main.vue





/* normalize component */

var MazInput_main_component = normalizeComponent(
  components_MazInput_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_5b617c72_render,
  _mainvue_type_template_id_5b617c72_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazInput_main_api; }
MazInput_main_component.options.__file = "packages/components/MazInput/_main.vue"
/* harmony default export */ var MazInput_main = (MazInput_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazInput/index.js


MazInput_main.install = function (Vue) {
  Vue.component(MazInput_main.name, MazInput_main);
};

/* harmony default export */ var MazInput = (MazInput_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazInputTags/_main.vue?vue&type=template&id=f4f57e2a&
var _mainvue_type_template_id_f4f57e2a_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "maz-base-component maz-input-tags maz-flex maz-flex-wrap maz-align-center maz-border-color-hover",
      class: [
        {
          "is-focused": _vm.isFocus,
          "is-valid": _vm.success,
          "has-value": _vm.value,
          "has-error": _vm.error,
          "is-disabled": _vm.disabled,
          "maz-is-dark": _vm.dark
        },
        "maz-input-tags--" + _vm.size,
        "maz-input-tags--" + _vm.color
      ],
      on: {
        "!focus": function($event) {
          _vm.isFocus = true
        },
        "!blur": function($event) {
          _vm.isFocus = false
        }
      }
    },
    [
      _c(
        "transition-group",
        {
          staticClass: "maz-flex maz-flex-wrap maz-align-center maz-flex-1",
          attrs: { tag: "div", name: "maz-tags" }
        },
        [
          _vm._l(_vm.tags, function(tag, i) {
            return _c(
              "MazBtn",
              {
                key: "tag-" + i,
                staticClass: "maz-input-tags__tag maz-flex maz-align-center",
                attrs: {
                  disabled: _vm.disabled,
                  color: _vm.color,
                  size: _vm.size
                },
                on: {
                  click: function($event) {
                    $event.stopPropagation()
                    return _vm.removeTag(i)
                  }
                }
              },
              [
                _c("span", { staticClass: "maz-input-tags__tag__text" }, [
                  _vm._v("\n        " + _vm._s(tag) + "\n      ")
                ]),
                _c(
                  "i",
                  { staticClass: "maz-input-tags__tag__clear material-icons" },
                  [_vm._v("\n        close\n      ")]
                )
              ]
            )
          }),
          _c(
            "input",
            _vm._b(
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.inputValue,
                    expression: "inputValue"
                  }
                ],
                key: "input-tags",
                staticClass: "maz-input-tags__input maz-flex-1",
                attrs: {
                  type: "text",
                  placeholder: _vm.placeholder,
                  "aria-label": _vm.placeholder,
                  disabled: _vm.disabled,
                  readonly: _vm.readonly
                },
                domProps: { value: _vm.inputValue },
                on: {
                  keydown: [
                    function($event) {
                      if (
                        !$event.type.indexOf("key") &&
                        _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                      ) {
                        return null
                      }
                      $event.preventDefault()
                      return _vm.addTags($event)
                    },
                    function($event) {
                      if (
                        !$event.type.indexOf("key") &&
                        _vm._k($event.keyCode, "delete", [8, 46], $event.key, [
                          "Backspace",
                          "Delete",
                          "Del"
                        ])
                      ) {
                        return null
                      }
                      return _vm.removeLastTag($event)
                    }
                  ],
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.inputValue = $event.target.value
                  }
                }
              },
              "input",
              _vm.$attrs,
              false
            )
          ),
          _vm.hasClearBtn
            ? _c(
                "button",
                {
                  key: "clear-button",
                  staticClass:
                    "maz-input-tags__toggle-btn --clear maz-flex maz-flex-center",
                  attrs: {
                    title: "clear",
                    type: "button",
                    tabindex: "-1",
                    disabled: _vm.disabled
                  },
                  on: { click: _vm.cleanTags }
                },
                [
                  _c("span", {
                    staticClass: "maz-input-tags__toggle-btn__effect"
                  }),
                  _c(
                    "i",
                    {
                      staticClass:
                        "maz-input-tags__toggle-btn__icon material-icons"
                    },
                    [_vm._v("\n        close\n      ")]
                  )
                ]
              )
            : _vm._e()
        ],
        2
      ),
      _vm.loading
        ? _c("div", { staticClass: "maz-input-tags__loader" }, [
            _c("div", { staticClass: "maz-input__loader__progress-bar" })
          ])
        : _vm._e()
    ],
    1
  )
}
var _mainvue_type_template_id_f4f57e2a_staticRenderFns = []
_mainvue_type_template_id_f4f57e2a_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazInputTags/_main.vue?vue&type=template&id=f4f57e2a&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazInputTags/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/**
 * > UI Input tags
 */

/* harmony default export */ var MazInputTags_mainvue_type_script_lang_js_ = ({
  name: 'MazInputTags',
  components: {
    MazBtn: MazBtn
  },
  mixins: [uniqueId],
  props: {
    // Input value, can be a `Array` of `String` or `null`
    value: {
      validator: function validator(prop) {
        return Array.isArray(prop) || prop === null;
      },
      required: true
    },
    // input id
    id: {
      type: String,
      default: null
    },
    // input placeholder
    placeholder: {
      type: String,
      default: 'Add tags'
    },
    // When is `true` the input is disable
    disabled: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has the dark theme
    dark: {
      type: Boolean,
      default: false
    },
    // When is `true` the input is on readonly mode
    readonly: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has the error style (red)
    error: {
      type: Boolean,
      default: false
    },
    // When is `true` the input has the valid style (green)
    success: {
      type: Boolean,
      default: false
    },
    // When is `true` the input become required & has the `*` symbol
    required: {
      type: Boolean,
      default: false
    },
    // When is `true` the input is a textarea
    loading: {
      type: Boolean,
      default: false
    },
    // When is `true` the input can be clear with a button on the right
    clearable: {
      type: Boolean,
      default: false
    },
    // input size (`'lg'` / `'sm'`)
    size: {
      type: String,
      default: null
    },
    // color option
    color: {
      type: String,
      default: 'primary'
    }
  },
  data: function data() {
    return {
      inputValue: null,
      isFocus: false
    };
  },
  computed: {
    tags: {
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        if (!value) return;

        if (Array.isArray(this.tags)) {
          var tagsArray = JSON.parse(JSON.stringify(this.tags));
          tagsArray.push(value); // return the list of current tags
          // @arg `Array` or `null`

          this.$emit('input', tagsArray);
        } else {
          // return the list of tags (`Array` of `String`)
          this.$emit('input', Array(value));
        }
      }
    },
    hasClearBtn: function hasClearBtn() {
      return this.clearable && this.tags && this.tags.length;
    }
  },
  methods: {
    addTags: function addTags() {
      this.tags = this.inputValue;
      this.inputValue = null;
    },
    removeLastTag: function removeLastTag() {
      if (this.inputValue === null || this.inputValue === '') {
        var tagsArray = JSON.parse(JSON.stringify(this.tags));
        tagsArray.pop();
        this.$emit('input', tagsArray);
      }
    },
    removeTag: function removeTag(i) {
      var tagsArray = JSON.parse(JSON.stringify(this.tags));
      tagsArray.splice(i, 1);
      this.$emit('input', tagsArray);
    },
    cleanTags: function cleanTags() {
      this.$emit('input', null);
      this.inputValue = null;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazInputTags/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazInputTags_mainvue_type_script_lang_js_ = (MazInputTags_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazInputTags/_main.vue





/* normalize component */

var MazInputTags_main_component = normalizeComponent(
  components_MazInputTags_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_f4f57e2a_render,
  _mainvue_type_template_id_f4f57e2a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazInputTags_main_api; }
MazInputTags_main_component.options.__file = "packages/components/MazInputTags/_main.vue"
/* harmony default export */ var MazInputTags_main = (MazInputTags_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazInputTags/index.js


MazInputTags_main.install = function (Vue) {
  Vue.component(MazInputTags_main.name, MazInputTags_main);
};

/* harmony default export */ var MazInputTags = (MazInputTags_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazList/_main.vue?vue&type=template&id=e17a0e50&
var _mainvue_type_template_id_e17a0e50_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-list",
      class: {
        "maz-no-shadow": _vm.noShadow,
        "maz-is-dark": _vm.dark,
        "no-scroll": _vm.noScroll
      }
    },
    [
      _c(
        "transition-group",
        {
          attrs: { name: _vm.transition ? "maz-flip-list" : null, tag: "div" }
        },
        [_vm._t("default")],
        2
      )
    ],
    1
  )
}
var _mainvue_type_template_id_e17a0e50_staticRenderFns = []
_mainvue_type_template_id_e17a0e50_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazList/_main.vue?vue&type=template&id=e17a0e50&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazList/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazList_mainvue_type_script_lang_js_ = ({
  name: 'MazList',
  props: {
    // active the transition animation
    transition: {
      type: Boolean,
      default: false
    },
    // remove the shadow effect behind the list
    noShadow: {
      type: Boolean,
      default: false
    },
    // set dark mode
    dark: {
      type: Boolean,
      default: false
    },
    // remove overflow css property & scroll
    noScroll: {
      type: Boolean,
      default: false
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazList/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazList_mainvue_type_script_lang_js_ = (MazList_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazList/_main.vue





/* normalize component */

var MazList_main_component = normalizeComponent(
  components_MazList_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_e17a0e50_render,
  _mainvue_type_template_id_e17a0e50_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazList_main_api; }
MazList_main_component.options.__file = "packages/components/MazList/_main.vue"
/* harmony default export */ var MazList_main = (MazList_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazList/index.js


MazList_main.install = function (Vue) {
  Vue.component(MazList_main.name, MazList_main);
};

/* harmony default export */ var MazList = (MazList_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazList/MazListItem/_main.vue?vue&type=template&id=15021600&
var _mainvue_type_template_id_15021600_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    _vm.tag,
    {
      tag: "component",
      staticClass: "maz-base-component maz-list-item",
      class: {
        "has-hover": _vm.hover,
        "cursor-pointer": _vm.tag === "button"
      },
      on: {
        click: function($event) {
          return _vm.$emit("click", $event)
        }
      }
    },
    [_vm._t("default")],
    2
  )
}
var _mainvue_type_template_id_15021600_staticRenderFns = []
_mainvue_type_template_id_15021600_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazList/MazListItem/_main.vue?vue&type=template&id=15021600&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazList/MazListItem/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazListItem_mainvue_type_script_lang_js_ = ({
  name: 'MazListItem',
  props: {
    // You can change the balise type - Ex: `button`
    tag: {
      type: String,
      default: 'div'
    },
    // to set the hover color effect
    hover: {
      type: Boolean,
      default: false
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazList/MazListItem/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var MazList_MazListItem_mainvue_type_script_lang_js_ = (MazListItem_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazList/MazListItem/_main.vue





/* normalize component */

var MazListItem_main_component = normalizeComponent(
  MazList_MazListItem_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_15021600_render,
  _mainvue_type_template_id_15021600_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazListItem_main_api; }
MazListItem_main_component.options.__file = "packages/components/MazList/MazListItem/_main.vue"
/* harmony default export */ var MazListItem_main = (MazListItem_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazList/MazListItem/index.js


MazListItem_main.install = function (Vue) {
  Vue.component(MazListItem_main.name, MazListItem_main);
};

/* harmony default export */ var MazListItem = (MazListItem_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazLoader/_main.vue?vue&type=template&id=6c565066&
var _mainvue_type_template_id_6c565066_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-loader maz-flex maz-flex-center",
      class: {
        "maz-is-dark": _vm.dark
      }
    },
    [_vm._m(0)]
  )
}
var _mainvue_type_template_id_6c565066_staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "maz-loader__anim" }, [
      _c("div"),
      _c("div"),
      _c("div"),
      _c("div"),
      _c("div"),
      _c("div"),
      _c("div"),
      _c("div")
    ])
  }
]
_mainvue_type_template_id_6c565066_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazLoader/_main.vue?vue&type=template&id=6c565066&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazLoader/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazLoader_mainvue_type_script_lang_js_ = ({
  name: 'MazLoader',
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazLoader/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazLoader_mainvue_type_script_lang_js_ = (MazLoader_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazLoader/_main.vue





/* normalize component */

var MazLoader_main_component = normalizeComponent(
  components_MazLoader_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_6c565066_render,
  _mainvue_type_template_id_6c565066_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazLoader_main_api; }
MazLoader_main_component.options.__file = "packages/components/MazLoader/_main.vue"
/* harmony default export */ var MazLoader_main = (MazLoader_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazLoader/index.js


MazLoader_main.install = function (Vue) {
  Vue.component(MazLoader_main.name, MazLoader_main);
};

/* harmony default export */ var MazLoader = (MazLoader_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_main.vue?vue&type=template&id=133dee14&
var _mainvue_type_template_id_133dee14_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-pagination maz-flex maz-flex-center",
      class: { "maz-is-dark": _vm.dark }
    },
    [
      _c(
        "div",
        { staticClass: "maz-pagination__container maz-flex maz-align-center" },
        [
          _c("PaginationArrowBtn", {
            attrs: { dark: _vm.dark },
            on: { click: _vm.previous }
          }),
          _vm._l(_vm.pages, function(ref, i) {
            var number = ref.number
            var isActive = ref.isActive
            var disabled = ref.disabled
            var divider = ref.divider
            return [
              divider
                ? _c("PaginationDotsDivider", {
                    key: "pagination-btn-" + number + "-" + i
                  })
                : _c(
                    "PaginationNumberBtn",
                    {
                      key: "pagination-btn-" + number + "-" + i,
                      attrs: { disabled: disabled, active: isActive },
                      on: {
                        click: function($event) {
                          return _vm.emitPageValue(number)
                        }
                      }
                    },
                    [_vm._v("\n        " + _vm._s(number) + "\n      ")]
                  )
            ]
          }),
          _c("PaginationArrowBtn", {
            attrs: { dark: _vm.dark, right: "" },
            on: { click: _vm.next }
          })
        ],
        2
      )
    ]
  )
}
var _mainvue_type_template_id_133dee14_staticRenderFns = []
_mainvue_type_template_id_133dee14_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPagination/_main.vue?vue&type=template&id=133dee14&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_subs/PaginationArrowBtn/index.vue?vue&type=template&id=a85da87e&
var PaginationArrowBtnvue_type_template_id_a85da87e_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "MazBtn",
    {
      staticClass:
        "pagination-arrow-btn maz-flex maz-flex-center maz-flex-fixed",
      attrs: { size: "sm", fab: "" },
      on: { click: _vm.handleClick }
    },
    [
      _c("ArrowIcon", {
        attrs: {
          color: "#6F6A6A",
          orientation: _vm.right ? "right" : "left",
          dark: _vm.dark,
          size: 28
        }
      })
    ],
    1
  )
}
var PaginationArrowBtnvue_type_template_id_a85da87e_staticRenderFns = []
PaginationArrowBtnvue_type_template_id_a85da87e_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationArrowBtn/index.vue?vue&type=template&id=a85da87e&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_subs/PaginationArrowBtn/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var PaginationArrowBtnvue_type_script_lang_js_ = ({
  name: 'PaginationArrowBtn',
  components: {
    ArrowIcon: ArrowIcon,
    MazBtn: MazBtn
  },
  props: {
    right: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick: function handleClick(e) {
      this.$emit('click', e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationArrowBtn/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var _subs_PaginationArrowBtnvue_type_script_lang_js_ = (PaginationArrowBtnvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationArrowBtn/index.vue





/* normalize component */

var PaginationArrowBtn_component = normalizeComponent(
  _subs_PaginationArrowBtnvue_type_script_lang_js_,
  PaginationArrowBtnvue_type_template_id_a85da87e_render,
  PaginationArrowBtnvue_type_template_id_a85da87e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var PaginationArrowBtn_api; }
PaginationArrowBtn_component.options.__file = "packages/components/MazPagination/_subs/PaginationArrowBtn/index.vue"
/* harmony default export */ var PaginationArrowBtn = (PaginationArrowBtn_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_subs/PaginationNumberBtn/index.vue?vue&type=template&id=4a6bf93b&
var PaginationNumberBtnvue_type_template_id_4a6bf93b_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "MazBtn",
    {
      staticClass:
        "pagination-number-btn maz-flex maz-flex-center maz-flex-fixed",
      class: {
        active: _vm.active
      },
      attrs: { disabled: _vm.disabled, fab: "", size: "sm" },
      on: { click: _vm.handleClick }
    },
    [_vm._t("default")],
    2
  )
}
var PaginationNumberBtnvue_type_template_id_4a6bf93b_staticRenderFns = []
PaginationNumberBtnvue_type_template_id_4a6bf93b_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationNumberBtn/index.vue?vue&type=template&id=4a6bf93b&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_subs/PaginationNumberBtn/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var PaginationNumberBtnvue_type_script_lang_js_ = ({
  name: 'PaginationNumberBtn',
  components: {
    MazBtn: MazBtn
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick: function handleClick(evt) {
      this.$emit('click', evt);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationNumberBtn/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var _subs_PaginationNumberBtnvue_type_script_lang_js_ = (PaginationNumberBtnvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationNumberBtn/index.vue





/* normalize component */

var PaginationNumberBtn_component = normalizeComponent(
  _subs_PaginationNumberBtnvue_type_script_lang_js_,
  PaginationNumberBtnvue_type_template_id_4a6bf93b_render,
  PaginationNumberBtnvue_type_template_id_4a6bf93b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var PaginationNumberBtn_api; }
PaginationNumberBtn_component.options.__file = "packages/components/MazPagination/_subs/PaginationNumberBtn/index.vue"
/* harmony default export */ var PaginationNumberBtn = (PaginationNumberBtn_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_subs/PaginationDotsDivider/index.vue?vue&type=template&id=e551c7d2&
var PaginationDotsDividervue_type_template_id_e551c7d2_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "pagination-dots-divider maz-flex maz-flex-center maz-flex-fixed"
    },
    [_vm._v("\n  ...\n")]
  )
}
var PaginationDotsDividervue_type_template_id_e551c7d2_staticRenderFns = []
PaginationDotsDividervue_type_template_id_e551c7d2_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationDotsDivider/index.vue?vue&type=template&id=e551c7d2&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_subs/PaginationDotsDivider/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var PaginationDotsDividervue_type_script_lang_js_ = ({
  name: 'PaginationDotsDivider'
});
// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationDotsDivider/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var _subs_PaginationDotsDividervue_type_script_lang_js_ = (PaginationDotsDividervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPagination/_subs/PaginationDotsDivider/index.vue





/* normalize component */

var PaginationDotsDivider_component = normalizeComponent(
  _subs_PaginationDotsDividervue_type_script_lang_js_,
  PaginationDotsDividervue_type_template_id_e551c7d2_render,
  PaginationDotsDividervue_type_template_id_e551c7d2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var PaginationDotsDivider_api; }
PaginationDotsDivider_component.options.__file = "packages/components/MazPagination/_subs/PaginationDotsDivider/index.vue"
/* harmony default export */ var PaginationDotsDivider = (PaginationDotsDivider_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPagination/_main.vue?vue&type=script&lang=js&
function _mainvue_type_script_lang_js_toConsumableArray(arr) { return _mainvue_type_script_lang_js_arrayWithoutHoles(arr) || _mainvue_type_script_lang_js_iterableToArray(arr) || _mainvue_type_script_lang_js_unsupportedIterableToArray(arr) || _mainvue_type_script_lang_js_nonIterableSpread(); }

function _mainvue_type_script_lang_js_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _mainvue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _mainvue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _mainvue_type_script_lang_js_arrayLikeToArray(o, minLen); }

function _mainvue_type_script_lang_js_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _mainvue_type_script_lang_js_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _mainvue_type_script_lang_js_arrayLikeToArray(arr); }

function _mainvue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var divider = [{
  divider: true
}];
/* harmony default export */ var MazPagination_mainvue_type_script_lang_js_ = ({
  name: 'MazPagination',
  components: {
    PaginationArrowBtn: PaginationArrowBtn,
    PaginationNumberBtn: PaginationNumberBtn,
    PaginationDotsDivider: PaginationDotsDivider
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    pageCount: {
      type: Number,
      required: true
    },
    pageRange: {
      type: Number,
      default: 3
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit('input', n);
      }
    },
    allPages: function allPages() {
      var pageCount = this.pageCount,
          currentPage = this.currentPage;
      return Array.from({
        length: pageCount
      }, function (x, i) {
        var itemNumber = i + 1;
        return {
          number: itemNumber,
          isActive: itemNumber === currentPage
        };
      });
    },
    halfPageRange: function halfPageRange() {
      return Math.floor(this.pageRange / 2);
    },
    firstOne: function firstOne() {
      var allPages = this.allPages,
          halfPageRange = this.halfPageRange,
          currentPage = this.currentPage;
      return currentPage - halfPageRange > 1 ? allPages.slice(0, 1) : [];
    },
    lastOne: function lastOne() {
      var allPages = this.allPages,
          halfPageRange = this.halfPageRange,
          currentPage = this.currentPage,
          pageCount = this.pageCount;
      return currentPage < pageCount - halfPageRange ? allPages.slice(-1) : [];
    },
    rangeStartAt: function rangeStartAt() {
      var currentPage = this.currentPage,
          halfPageRange = this.halfPageRange,
          pageRange = this.pageRange,
          pageCount = this.pageCount;
      return currentPage - halfPageRange - 1 < 0 ? 0 : currentPage - halfPageRange - 1 > pageCount - pageRange ? pageCount - pageRange : currentPage - halfPageRange - 1;
    },
    rangeEndAt: function rangeEndAt() {
      var currentPage = this.currentPage,
          halfPageRange = this.halfPageRange,
          pageCount = this.pageCount,
          pageRange = this.pageRange;
      return currentPage + halfPageRange > pageCount ? pageCount : currentPage + halfPageRange < pageRange ? pageRange : currentPage + halfPageRange;
    },
    range: function range() {
      var allPages = this.allPages,
          rangeStartAt = this.rangeStartAt,
          rangeEndAt = this.rangeEndAt;
      return allPages.slice(rangeStartAt, rangeEndAt);
    },
    firstDivider: function firstDivider() {
      var currentPage = this.currentPage,
          halfPageRange = this.halfPageRange;
      return currentPage - halfPageRange > 2 ? divider : [];
    },
    lastDivider: function lastDivider() {
      var currentPage = this.currentPage,
          halfPageRange = this.halfPageRange,
          pageCount = this.pageCount;
      return currentPage < pageCount - halfPageRange - 1 ? divider : [];
    },
    pages: function pages() {
      var firstOne = this.firstOne,
          lastOne = this.lastOne,
          range = this.range,
          firstDivider = this.firstDivider,
          lastDivider = this.lastDivider;
      return [].concat(_mainvue_type_script_lang_js_toConsumableArray(firstOne), _mainvue_type_script_lang_js_toConsumableArray(firstDivider), _mainvue_type_script_lang_js_toConsumableArray(range), _mainvue_type_script_lang_js_toConsumableArray(lastDivider), _mainvue_type_script_lang_js_toConsumableArray(lastOne));
    }
  },
  methods: {
    emitPageValue: function emitPageValue(v) {
      this.$emit('input', v);
      this.$emit('page', v);
    },
    previous: function previous() {
      if (this.currentPage > 1) {
        this.emitPageValue(this.currentPage - 1);
      }
    },
    next: function next() {
      if (this.currentPage < this.pageCount) {
        this.emitPageValue(this.currentPage + 1);
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPagination/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazPagination_mainvue_type_script_lang_js_ = (MazPagination_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPagination/_main.vue





/* normalize component */

var MazPagination_main_component = normalizeComponent(
  components_MazPagination_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_133dee14_render,
  _mainvue_type_template_id_133dee14_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazPagination_main_api; }
MazPagination_main_component.options.__file = "packages/components/MazPagination/_main.vue"
/* harmony default export */ var MazPagination_main = (MazPagination_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazPagination/index.js


MazPagination_main.install = function (Vue) {
  Vue.component(MazPagination_main.name, MazPagination_main);
};

/* harmony default export */ var MazPagination = (MazPagination_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/_main.vue?vue&type=template&id=7e489288&
var _mainvue_type_template_id_7e489288_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "MazPicker",
      staticClass: "maz-base-component maz-picker",
      class: [
        {
          "maz-is-dark": _vm.dark
        },
        "maz-picker--" + _vm.color
      ],
      attrs: { id: _vm.uniqueId },
      on: {
        "!blur": function($event) {
          return _vm.closePicker($event, "blur")
        }
      }
    },
    [
      !_vm.inline
        ? _c(
            "MazInput",
            _vm._b(
              {
                attrs: {
                  id: _vm.uniqueId,
                  placeholder: _vm.placeholder,
                  readonly: "",
                  color: _vm.color,
                  focus: _vm.hasPickerOpen
                },
                on: {
                  focus: function($event) {
                    return _vm.openPicker(true)
                  }
                },
                model: {
                  value: _vm.inputValue,
                  callback: function($$v) {
                    _vm.inputValue = $$v
                  },
                  expression: "inputValue"
                }
              },
              "MazInput",
              _vm.$attrs,
              false
            ),
            [
              _vm._t("icon-left", null, { slot: "icon-left" }),
              _c(
                "div",
                {
                  staticClass: "maz-picker__arrow maz-flex maz-flex-center",
                  attrs: { slot: "icon-right", tabindex: "-1" },
                  slot: "icon-right"
                },
                [
                  _vm._t("arrow", [
                    _c("ArrowIcon", {
                      attrs: { orientation: _vm.hasPickerOpen ? "up" : null }
                    })
                  ])
                ],
                2
              )
            ],
            2
          )
        : _vm._e(),
      _vm.hasOverlay
        ? _c("button", {
            staticClass: "maz-picker__overlay",
            attrs: { tabindex: "-1" },
            on: { click: _vm.closePicker }
          })
        : _vm._e(),
      _c(
        "transition",
        { attrs: { name: _vm.pickerTransition } },
        [
          _vm.hasPickerOpen
            ? _c("PickersContainer", {
                ref: "PickersContainer",
                attrs: {
                  locale: _vm.locale,
                  position: _vm.calcPosition,
                  format: _vm.format,
                  "has-header": _vm.hasHeader,
                  "has-footer": _vm.hasFooter,
                  "has-validate": _vm.hasValidate,
                  "has-double": _vm.hasDouble,
                  "has-keyboard": _vm.hasKeyboard,
                  "has-now": _vm.hasNow,
                  "has-time": _vm.hasTime,
                  "has-date": _vm.hasDate,
                  "is-visible": _vm.hasPickerOpen,
                  "minute-interval": _vm.minuteInterval,
                  "now-translation": _vm.nowTranslation,
                  "min-date": _vm.minDate,
                  "max-date": _vm.maxDate,
                  "no-weekends-days": _vm.noWeekendsDays,
                  "disabled-dates": _vm.disabledDatesMoment,
                  "disabled-weekly": _vm.disabledWeekly,
                  "auto-close": _vm.autoClose,
                  shortcuts: _vm.shortcuts,
                  shortcut: _vm.shortcut,
                  "has-shortcuts": _vm.hasShortcuts,
                  "disabled-hours": _vm.disabledHours,
                  inline: _vm.inline,
                  color: _vm.color
                },
                model: {
                  value: _vm.dateMoment,
                  callback: function($$v) {
                    _vm.dateMoment = $$v
                  },
                  expression: "dateMoment"
                }
              })
            : _vm._e()
        ],
        1
      )
    ],
    1
  )
}
var _mainvue_type_template_id_7e489288_staticRenderFns = []
_mainvue_type_template_id_7e489288_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/_main.vue?vue&type=template&id=7e489288&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/index.vue?vue&type=template&id=503f5a3f&
var PickersContainervue_type_template_id_503f5a3f_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "pickers-container maz-elevation",
      class: [_vm.position, { inline: _vm.inline }],
      attrs: { tabindex: "-1" }
    },
    [
      _vm.hasHeader
        ? _c("HeaderPicker", {
            attrs: {
              value: _vm.dateMoment,
              locale: _vm.locale,
              "has-time": _vm.hasTime,
              "has-date": _vm.hasDate,
              format: _vm.format,
              color: _vm.color
            }
          })
        : _vm._e(),
      _c("Calendar", {
        attrs: {
          format: _vm.format,
          locale: _vm.locale,
          color: _vm.color,
          shortcut: _vm.shortcut,
          "min-date": _vm.minDate,
          "max-date": _vm.maxDate,
          "minute-interval": _vm.minuteInterval,
          "no-weekends-days": _vm.noWeekendsDays,
          "disabled-dates": _vm.disabledDates,
          "disabled-weekly": _vm.disabledWeekly,
          "is-visible": _vm.isVisible,
          "has-double": _vm.hasDouble,
          shortcuts: _vm.shortcuts,
          "has-keyboard": _vm.hasKeyboard,
          "has-time": _vm.hasTime,
          "has-date": _vm.hasDate,
          "has-shortcuts": _vm.hasShortcuts,
          "disabled-hours": _vm.disabledHours
        },
        model: {
          value: _vm.dateMoment,
          callback: function($$v) {
            _vm.dateMoment = $$v
          },
          expression: "dateMoment"
        }
      }),
      _vm.hasFooter
        ? _c("FooterPicker", {
            attrs: {
              color: _vm.color,
              value: _vm.dateMoment,
              "has-validate": _vm.hasValidate,
              "has-now": _vm.hasNow,
              "now-translation": _vm.nowTranslation
            }
          })
        : _vm._e()
    ],
    1
  )
}
var PickersContainervue_type_template_id_503f5a3f_staticRenderFns = []
PickersContainervue_type_template_id_503f5a3f_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/index.vue?vue&type=template&id=503f5a3f&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/HeaderPicker/index.vue?vue&type=template&id=bdf7cd7e&
var HeaderPickervue_type_template_id_bdf7cd7e_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "header-picker maz-p-2 maz-text-white maz-flex",
      class: ["maz-bg-" + _vm.color]
    },
    [
      _vm.hasDate
        ? _c(
            "div",
            {
              staticClass:
                "header-picker__date-container maz-flex-1 maz-flex maz-direction-column maz-space-around"
            },
            [
              _c(
                "TransitionGroup",
                {
                  staticClass: "header-picker__year maz-dots-text",
                  attrs: { name: _vm.transitionName, tag: "div" }
                },
                _vm._l([_vm.year], function(y) {
                  return _c("span", { key: y }, [
                    _vm._v("\n        " + _vm._s(y) + "\n      ")
                  ])
                }),
                0
              ),
              _c(
                "TransitionGroup",
                {
                  staticClass: "header-picker__date maz-dots-text",
                  attrs: { name: _vm.transitionName, tag: "div" }
                },
                _vm._l([_vm.dateFormatted], function(date) {
                  return _c(
                    "span",
                    { key: date, staticClass: "maz-dots-text" },
                    [
                      _vm._v(
                        "\n        " +
                          _vm._s(_vm.dateFormatted ? date : "-") +
                          "\n      "
                      )
                    ]
                  )
                }),
                0
              )
            ],
            1
          )
        : _vm._e(),
      _vm.hasTime && !_vm.isTwelveFormat
        ? _c(
            "div",
            {
              staticClass: "header-picker__time maz-flex",
              class: [!_vm.hasDate ? "maz-flex-center" : "maz-align-end"]
            },
            [
              _vm.timeFormatted.hour
                ? _c(
                    "TransitionGroup",
                    {
                      staticClass:
                        "header-picker__hour maz-flex maz-justify-end",
                      attrs: { name: _vm.transitionName }
                    },
                    _vm._l([_vm.timeFormatted.hour], function(hour) {
                      return _c("span", { key: hour }, [
                        _vm._v("\n        " + _vm._s(hour) + "\n      ")
                      ])
                    }),
                    0
                  )
                : _vm._e(),
              _c("span", { staticClass: "header-picker__dots-divider" }, [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.timeFormatted.hour ? ":" : "-") +
                    "\n    "
                )
              ]),
              _vm.timeFormatted.minute
                ? _c(
                    "TransitionGroup",
                    {
                      staticClass: "header-picker__minute",
                      attrs: { name: _vm.transitionName }
                    },
                    _vm._l([_vm.timeFormatted.minute], function(min) {
                      return _c("span", { key: min }, [
                        _vm._v("\n        " + _vm._s(min) + "\n      ")
                      ])
                    }),
                    0
                  )
                : _vm._e()
            ],
            1
          )
        : _vm.hasTime
        ? _c(
            "div",
            {
              staticClass: "header-picker__time maz-flex",
              class: [!_vm.hasDate ? "maz-flex-center" : "maz-align-end"]
            },
            [
              _c(
                "TransitionGroup",
                {
                  staticClass:
                    "header-picker__twelve maz-flex maz-justify-center",
                  attrs: { name: _vm.transitionName }
                },
                _vm._l([_vm.timeFormatted], function(time, i) {
                  return _c("span", { key: time + "-" + i }, [
                    _vm._v(
                      "\n        " +
                        _vm._s(_vm.timeFormatted || "-") +
                        "\n      "
                    )
                  ])
                }),
                0
              )
            ],
            1
          )
        : _vm._e(),
      _c(
        "MazBtn",
        {
          staticClass: "header-picker__close",
          attrs: { fab: "", size: "mini", "no-shadow": "" },
          on: { click: _vm.close }
        },
        [
          _c("i", { staticClass: "material-icons" }, [
            _vm._v("\n      close\n    ")
          ])
        ]
      )
    ],
    1
  )
}
var HeaderPickervue_type_template_id_bdf7cd7e_staticRenderFns = []
HeaderPickervue_type_template_id_bdf7cd7e_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/HeaderPicker/index.vue?vue&type=template&id=bdf7cd7e&

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(1);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(8);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: ./packages/filters/capitalize.js
/* harmony default export */ var capitalize = (function (val) {
  if (!val) return '';
  var string = val.toString();
  return string.charAt(0).toUpperCase() + string.slice(1);
});
// CONCATENATED MODULE: ./packages/components/MazPicker/utils.js



var getDefaultLocale = function getDefaultLocale() {
  if (typeof window === 'undefined') return 'en';
  var _window$navigator = window.navigator,
      userLanguage = _window$navigator.userLanguage,
      language = _window$navigator.language;
  var locale = (userLanguage || language || 'en').substr(0, 2);
  return locale;
};
var EventBus = new external_vue_default.a();
var checkIfTargetIsAllowedToCloseComponent = function checkIfTargetIsAllowedToCloseComponent(classesArray, target) {
  if (!target) return false;
  return classesArray.some(function (classes) {
    return classes.every(function (c) {
      var _target$classList;

      return ((_target$classList = target.classList) !== null && _target$classList !== void 0 ? _target$classList : []).contains(c);
    });
  });
};
var hasDateBetweenMinMaxDate = function hasDateBetweenMinMaxDate(date, minDate, maxDate, range) {
  return {
    isBefore: (range ? date.start : date).isBefore(minDate),
    isAfter: (range ? date.end : date).isAfter(maxDate)
  };
};
var forceUpdateComputedData = function forceUpdateComputedData() {
  return 'updated';
};
var utils_getDateMoment = function getDateMoment(value, format, range) {
  if (range) {
    if (typeof value === 'string') throw new Error('[MazPicker] range mode is enable: value must be an object like this \'{ start: null, end: null }\' or \'null\'');
    return {
      start: value && value.start ? external_moment_default()(value.start, format) : null,
      end: value && value.end ? external_moment_default()(value.end, format) : null
    };
  } else {
    return value ? external_moment_default()(value, format) : null;
  }
};
var utils_getFormattedValue = function getFormattedValue(value, format, formatted, range) {
  var formatValue = function formatValue(v) {
    return capitalize(external_moment_default()(v, format).format(formatted));
  };

  return range && value ? value.start || value.end ? "".concat(value.start ? formatValue(value.start) : '...', " - ").concat(value.end ? formatValue(value.end) : '...') : null : value ? formatValue(value) : null;
};
var DEFAULT_FORMAT_OPTIONS = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
};
var utils_getFormattedValuesIntl = function getFormattedValuesIntl() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _payload$locale = payload.locale,
      locale = _payload$locale === void 0 ? 'en' : _payload$locale,
      _payload$opts = payload.opts,
      opts = _payload$opts === void 0 ? DEFAULT_FORMAT_OPTIONS : _payload$opts,
      _payload$dates = payload.dates,
      dates = _payload$dates === void 0 ? [new Date()] : _payload$dates;
  return dates.map(function (d) {
    return d ? capitalize(new Intl.DateTimeFormat(locale, opts).format(d)) : '...';
  }).join(' - ');
};
var ArrayHourRange = function ArrayHourRange(start, end, twoDigit, isAfternoon, disabledHours) {
  return Array(end - start + 1).fill().map(function (_, idx) {
    var n = start + idx;
    var number = !isAfternoon ? n : n + 12;
    return {
      value: number,
      item: (twoDigit && n < 10 ? '0' : '') + n,
      disabled: disabledHours.includes(number)
    };
  });
};
var ArrayMinuteRange = function ArrayMinuteRange(start, end, twoDigit) {
  var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var disabledMinutes = arguments.length > 4 ? arguments[4] : undefined;
  var len = Math.floor(end / step) - start;
  return Array(len).fill().map(function (_, idx) {
    var number = start + idx * step;
    var txtMinute = (twoDigit && number < 10 ? '0' : '') + number;
    return {
      value: number,
      item: txtMinute,
      disabled: disabledMinutes.includes(number)
    };
  });
};
var utils_debounce = function debounce(fn, time) {
  var timeout;
  return function () {
    var _arguments = arguments,
        _this = this;

    var functionCall = function functionCall() {
      return fn.apply(_this, _arguments);
    };

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};
var getTimeFormat = function getTimeFormat(format) {
  var hasTime = format.includes('T');
  return hasTime ? format.split('T')[1] : format.split(' ').slice(1).join(' ');
};
var scrollSmoothElement = function scrollSmoothElement(elem, parentHeight, hasSmoothEffect) {
  var itemHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 28;
  if (!elem) return;
  var selected = elem.querySelector('.time-picker__column__item.maz-active');

  if (selected) {
    var boundsSelected = selected.getBoundingClientRect();
    var boundsElem = elem.getBoundingClientRect();

    if (boundsSelected && boundsElem) {
      var scrollValue = itemHeight / 2 + boundsSelected.top - boundsElem.top - parentHeight / 2;
      elem.scrollBy({
        top: scrollValue,
        behavior: hasSmoothEffect ? 'smooth' : 'auto'
      });
    }
  }
};
var findNearestNumberInList = function findNearestNumberInList(list, number) {
  var closest = list.reduce(function (prev, curr) {
    return Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev;
  });
  return closest;
};
var getValue = function getValue(scroll) {
  var _scroll$target$scroll, _scroll$target;

  var itemHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 28;
  var scrollTop = (_scroll$target$scroll = scroll === null || scroll === void 0 ? void 0 : (_scroll$target = scroll.target) === null || _scroll$target === void 0 ? void 0 : _scroll$target.scrollTop) !== null && _scroll$target$scroll !== void 0 ? _scroll$target$scroll : 0;
  return Math.round(scrollTop / itemHeight);
};
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/HeaderPicker/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var HeaderPickervue_type_script_lang_js_ = ({
  name: 'HeaderPicker',
  components: {
    MazBtn: MazBtn
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    locale: {
      type: String,
      required: true
    },
    hasTime: {
      type: Boolean,
      required: true
    },
    hasDate: {
      type: Boolean,
      required: true
    },
    format: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      transitionName: 'maz-slidevnext',
      currentDate: this.value
    };
  },
  computed: {
    isRangeMode: function isRangeMode() {
      return !!this.value && Object.keys(this.value).includes('start');
    },
    currentValue: function currentValue() {
      if (this.isRangeMode) {
        return this.value.end || external_moment_default()();
      }

      return this.value || external_moment_default()();
    },
    year: function year() {
      return this.currentValue.year();
    },
    dateFormatted: function dateFormatted() {
      var dates = [];
      var locale = this.locale;

      if (this.isRangeMode) {
        dates.push(this.value.start, this.value.end);
      } else {
        dates.push(this.value);
      }

      return utils_getFormattedValuesIntl({
        locale: locale,
        dates: dates
      });
    },
    timeFormatted: function timeFormatted() {
      var _this$value$format, _this$value, _this$value$format2, _this$value2, _this$value$format3, _this$value3;

      return !this.isTwelveFormat ? {
        hour: (_this$value$format = this === null || this === void 0 ? void 0 : (_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value.format('HH')) !== null && _this$value$format !== void 0 ? _this$value$format : null,
        minute: (_this$value$format2 = this === null || this === void 0 ? void 0 : (_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : _this$value2.format('mm')) !== null && _this$value$format2 !== void 0 ? _this$value$format2 : null
      } : (_this$value$format3 = this === null || this === void 0 ? void 0 : (_this$value3 = this.value) === null || _this$value3 === void 0 ? void 0 : _this$value3.format(this.timeFormat)) !== null && _this$value$format3 !== void 0 ? _this$value$format3 : null;
    },
    timeFormat: function timeFormat() {
      return getTimeFormat(this.format);
    },
    isTwelveFormat: function isTwelveFormat() {
      return this.timeFormat.includes('A') || this.timeFormat.includes('a');
    }
  },
  watch: {
    value: {
      handler: function handler() {
        var _this = this;

        var newValueIsSmaller = this.currentDate ? this.currentValue.isBefore(this.currentDate) : false;
        this.transitionName = newValueIsSmaller ? 'maz-slidevprev' : 'maz-slidevnext';
        this.$nextTick(function () {
          _this.currentDate = _this.currentValue;
        });
      },
      immediate: true
    }
  },
  methods: {
    close: function close(e) {
      EventBus.$emit('close', e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/HeaderPicker/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var PickersContainer_HeaderPickervue_type_script_lang_js_ = (HeaderPickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/HeaderPicker/index.vue





/* normalize component */

var HeaderPicker_component = normalizeComponent(
  PickersContainer_HeaderPickervue_type_script_lang_js_,
  HeaderPickervue_type_template_id_bdf7cd7e_render,
  HeaderPickervue_type_template_id_bdf7cd7e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var HeaderPicker_api; }
HeaderPicker_component.options.__file = "packages/components/MazPicker/PickersContainer/HeaderPicker/index.vue"
/* harmony default export */ var HeaderPicker = (HeaderPicker_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/index.vue?vue&type=template&id=bc701e78&
var Calendarvue_type_template_id_bc701e78_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "Calendar",
      staticClass:
        "calendar maz-position-relative maz-mw-100 maz-overflow-hidden maz-flex",
      class: {
        "is-range": _vm.isRangeMode
      },
      attrs: { id: "Calendar" + _vm._uid }
    },
    [
      _vm.hasShortcuts
        ? _c("RangeShortcuts", {
            ref: "RangeShortcuts",
            attrs: {
              shortcuts: _vm.shortcuts,
              value: _vm.shortcut,
              color: _vm.color,
              height: _vm.contentHeight
            },
            on: {
              "change-range": function($event) {
                return _vm.$emit("input", $event)
              }
            }
          })
        : _vm._e(),
      _vm.hasDate
        ? _c(
            "div",
            {
              ref: "MonthsContainer",
              staticClass:
                "calendar__months-container maz-overflow-hidden maz-flex-1"
            },
            [
              _c("MonthYearSwitcher", {
                staticClass: "maz-px-2",
                attrs: { months: _vm.months },
                on: {
                  "change-month": _vm.changeMonth,
                  "open-month-year-selector": function($event) {
                    _vm.yearMonthSelectorMode = $event
                  }
                }
              }),
              _c(
                "div",
                { staticClass: "maz-flex maz-overflow-x-auto" },
                _vm._l(_vm.months, function(month, i) {
                  return _c(
                    "div",
                    {
                      key: "month-" + i,
                      staticClass: "calendar__months maz-flex-1",
                      class: {
                        "has-double maz-border-top maz-border-top-solid maz-border-color":
                          _vm.hasDouble
                      },
                      staticStyle: { "min-width": "268px" }
                    },
                    [
                      _c("WeekDaysLabels", {
                        staticClass: "maz-p-2",
                        attrs: { locale: _vm.locale }
                      }),
                      _c("MonthPicker", {
                        ref: "MonthPicker",
                        refInFor: true,
                        staticClass: "maz-p-2",
                        attrs: {
                          month: month,
                          format: _vm.format,
                          "min-date": _vm.minDate,
                          "max-date": _vm.maxDate,
                          "has-keyboard": _vm.hasKeyboard,
                          "has-double": _vm.hasDouble,
                          "no-weekends-days": _vm.noWeekendsDays,
                          "disabled-dates": _vm.disabledDates,
                          "disabled-weekly": _vm.disabledWeekly,
                          color: _vm.color,
                          "hoverred-day": _vm.hoverredDay,
                          "is-visible": _vm.isVisible
                        },
                        on: {
                          "change-month": _vm.changeMonth,
                          "hoverred-day": function($event) {
                            _vm.hoverredDay = $event
                          }
                        },
                        model: {
                          value: _vm.dateMoment,
                          callback: function($$v) {
                            _vm.dateMoment = $$v
                          },
                          expression: "dateMoment"
                        }
                      })
                    ],
                    1
                  )
                }),
                0
              ),
              _vm.months.length
                ? _c("YearMonthSelector", {
                    attrs: {
                      month: _vm.months[0],
                      color: _vm.color,
                      "has-double": _vm.hasDouble
                    },
                    on: { "change-month-year": _vm.changeMonthYear },
                    model: {
                      value: _vm.yearMonthSelectorMode,
                      callback: function($$v) {
                        _vm.yearMonthSelectorMode = $$v
                      },
                      expression: "yearMonthSelectorMode"
                    }
                  })
                : _vm._e()
            ],
            1
          )
        : _vm._e(),
      _vm.hasTime
        ? _c("TimePicker", {
            attrs: {
              format: _vm.format,
              height: _vm.contentHeight,
              "min-date": _vm.minDate,
              "max-date": _vm.maxDate,
              "has-date": _vm.hasDate,
              color: _vm.color,
              "minute-interval": _vm.minuteInterval,
              "disabled-hours": _vm.disabledHours
            },
            model: {
              value: _vm.dateMoment,
              callback: function($$v) {
                _vm.dateMoment = $$v
              },
              expression: "dateMoment"
            }
          })
        : _vm._e()
    ],
    1
  )
}
var Calendarvue_type_template_id_bc701e78_staticRenderFns = []
Calendarvue_type_template_id_bc701e78_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/index.vue?vue&type=template&id=bc701e78&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/WeekDaysLabels/index.vue?vue&type=template&id=bb9db92a&
var WeekDaysLabelsvue_type_template_id_bb9db92a_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "week-days-labels" },
    _vm._l(_vm.weekDays, function(days, i) {
      return _c(
        "div",
        { key: i, staticClass: "week-days-labels__days maz-text-muted" },
        [_vm._v("\n    " + _vm._s(days) + "\n  ")]
      )
    }),
    0
  )
}
var WeekDaysLabelsvue_type_template_id_bb9db92a_staticRenderFns = []
WeekDaysLabelsvue_type_template_id_bb9db92a_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/WeekDaysLabels/index.vue?vue&type=template&id=bb9db92a&

// EXTERNAL MODULE: external "moment-range"
var external_moment_range_ = __webpack_require__(9);

// CONCATENATED MODULE: ./packages/components/MazPicker/modules/month.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var moment = Object(external_moment_range_["extendMoment"])(external_moment_default.a);

var month_Month = /*#__PURE__*/function () {
  function Month(month, year) {
    _classCallCheck(this, Month);

    this.start = moment([year, month]);
    this.end = this.start.clone().endOf('month');
    this.startNextMonth = this.start.clone().add(1, 'M');
    this.endNextMonth = this.start.clone().add(1, 'M').endOf('month');
    this.startPreviousMonth = this.start.clone().subtract(1, 'M');
    this.endPreviousMonth = this.start.clone().subtract(1, 'M').endOf('month');
    this.month = month;
    this.year = year;
  }

  _createClass(Month, [{
    key: "getWeekStart",
    value: function getWeekStart() {
      return this.start.weekday();
    }
  }, {
    key: "getFormatted",
    value: function getFormatted() {
      return capitalize(this.start.format('MMMM'));
    }
  }, {
    key: "getYear",
    value: function getYear() {
      return this.start.format('YYYY');
    }
  }, {
    key: "getWeeks",
    value: function getWeeks() {
      return this.end.week() - this.start.week() + 1;
    }
  }, {
    key: "getMonthDays",
    value: function getMonthDays() {
      var r1 = moment.range(this.start, this.end).by('days');
      return Array.from(r1);
    }
  }, {
    key: "getPreviousMonthDays",
    value: function getPreviousMonthDays() {
      var r1 = moment.range(this.startPreviousMonth, this.endPreviousMonth).by('days');
      var results = Array.from(r1);
      return results.slice(results.length - this.getWeekStart(), results.length);
    }
  }, {
    key: "getNextMonthDays",
    value: function getNextMonthDays() {
      var totalDaysLength = this.getWeekStart() + this.getMonthDays().length;
      var numberRestDays = totalDaysLength > 35 ? 42 - totalDaysLength : 35 - totalDaysLength;
      var r1 = moment.range(this.startNextMonth, this.endNextMonth).by('days');
      var results = Array.from(r1);
      return results.slice(0, numberRestDays);
    }
  }]);

  return Month;
}();


var month_getWeekDays = function getWeekDays() {
  var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en';
  var firstDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var firstDayNumber = firstDay === 0 ? 7 : firstDay || moment.localeData(locale).firstDayOfWeek();
  var days = moment.weekdaysShort();
  var keep = days.splice(firstDayNumber);
  var stay = days;
  days = keep.concat(stay);
  return days.map(function (d) {
    return capitalize(d);
  });
};
var month_getMonthsByFormat = function getMonthsByFormat(format) {
  return Array.apply(0, Array(12)).map(function (_, i) {
    return capitalize(moment().month(i).format(format));
  });
};
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/WeekDaysLabels/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var WeekDaysLabelsvue_type_script_lang_js_ = ({
  name: 'WeekDaysLabes',
  props: {
    locale: {
      type: String,
      default: null
    }
  },
  computed: {
    weekDays: function weekDays() {
      return month_getWeekDays(this.locale);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/WeekDaysLabels/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var Calendar_WeekDaysLabelsvue_type_script_lang_js_ = (WeekDaysLabelsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/WeekDaysLabels/index.vue





/* normalize component */

var WeekDaysLabels_component = normalizeComponent(
  Calendar_WeekDaysLabelsvue_type_script_lang_js_,
  WeekDaysLabelsvue_type_template_id_bb9db92a_render,
  WeekDaysLabelsvue_type_template_id_bb9db92a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var WeekDaysLabels_api; }
WeekDaysLabels_component.options.__file = "packages/components/MazPicker/PickersContainer/Calendar/WeekDaysLabels/index.vue"
/* harmony default export */ var WeekDaysLabels = (WeekDaysLabels_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/MonthPicker/index.vue?vue&type=template&id=73cc37fa&
var MonthPickervue_type_template_id_73cc37fa_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "TransitionGroup",
    {
      staticClass: "month-picker maz-position-relative",
      class: {
        "month-picker--long": _vm.monthDays.length + _vm.weekStart > 35
      },
      attrs: { tag: "div", name: _vm.transitionDaysName }
    },
    _vm._l([_vm.month], function(m) {
      return _c(
        "div",
        { key: m.month, staticClass: "month-picker__days" },
        [
          _vm._l(Array.from(Array(_vm.weekStart).keys()), function(w, i) {
            return _c("div", { key: "previous-" + i })
          }),
          _vm._l(_vm.allDays, function(day, i) {
            return _c(
              "MazBtn",
              {
                key: i,
                staticClass:
                  "month-picker__day maz-text-color maz-bg-transparent maz-flex maz-flex-center",
                class: {
                  highlight: _vm.isToday(day),
                  "is-keyboard-selected": _vm.isKeyboardSelected(day),
                  "is-in-range": !_vm.isDisabled(day) && _vm.isBetween(day),
                  "is-between-hoverred":
                    _vm.value &&
                    _vm.value.start &&
                    !_vm.isDisabled(day) &&
                    _vm.isBetweenHoverred(day),
                  "is-first-in-range": _vm.isFirstInRange(day),
                  "is-last-in-range": _vm.isLastInRange(day)
                },
                attrs: {
                  size: "mini",
                  color: _vm.color,
                  tabindex: "-1",
                  "no-shadow": !_vm.isSelectedDate(day),
                  disabled: _vm.isDisabled(day),
                  active: _vm.isSelectedDate(day)
                },
                on: {
                  mouseenter: function($event) {
                    return _vm.$emit("hoverred-day", day)
                  },
                  mouseleave: function($event) {
                    return _vm.$emit("hoverred-day", null)
                  },
                  click: function($event) {
                    return _vm.selectDay(day)
                  }
                }
              },
              [_vm._v("\n      " + _vm._s(day.format("D")) + "\n    ")]
            )
          })
        ],
        2
      )
    }),
    0
  )
}
var MonthPickervue_type_template_id_73cc37fa_staticRenderFns = []
MonthPickervue_type_template_id_73cc37fa_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/MonthPicker/index.vue?vue&type=template&id=73cc37fa&

// CONCATENATED MODULE: ./packages/components/MazPicker/mixins/keyboard-accessibility.js
/*
 * Vue mixin to inject the required methods, events to handle the date navigation
 * with the keyboard.
 * @module mixin - keyboardAccessibility
 */



var keyboard_accessibility_addListerner = function addListerner(_ref) {
  var keyPressed = _ref.keyPressed;
  if (typeof window === 'undefined') return null;
  window.addEventListener('keydown', keyPressed);
};

var keyboard_accessibility_removeListerner = function removeListerner(_ref2) {
  var keyPressed = _ref2.keyPressed;
  if (typeof window === 'undefined') return null;
  window.removeEventListener('keydown', keyPressed);
};

/* harmony default export */ var keyboard_accessibility = ({
  props: {
    hasKeyboard: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      keyboardSelectedDay: null
    };
  },
  computed: {
    currentValue: function currentValue() {
      var currentValue = this.isRangeMode ? this.keyboardSelectedDay || this.value.end || this.value.start || external_moment_default()() : this.keyboardSelectedDay || this.value || external_moment_default()();
      return currentValue instanceof external_moment_default.a ? currentValue.clone() : currentValue;
    }
  },
  methods: {
    keyPressed: function keyPressed(e) {
      /*
        13 : Enter
        27 : Escape
        32 : Space
        35 : Page Down
        36 : Page Up
        37 : Left
        38 : Up
        39 : Right
        40 : Down
        40 : Right
      */
      if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 35 || e.keyCode === 36) {
        e.view.event.preventDefault();
      }

      try {
        if (e.keyCode === 38) {
          this.previousWeek();
        } else if (e.keyCode === 37) {
          this.previousDay();
        } else if (e.keyCode === 39) {
          this.nextDay();
        } else if (e.keyCode === 40) {
          this.nextWeek();
        } else if (e.keyCode === 32 || e.keyCode === 13) {
          e.preventDefault();
          this.selectDay(this.keyboardSelectedDay);
        } else if (e.keyCode === 36) {
          this.previousMonth();
        } else if (e.keyCode === 35) {
          this.nextMonth();
        } else if (e.keyCode === 27) {
          EventBus.$emit('close', e);
        } // if ('activeElement' in document) document.activeElement.blur()

      } catch (err) {
        throw new Error('An error occured while switch date ' + err);
      }
    },
    previousWeek: function previousWeek() {
      var keyboardSelectedDay = this.currentValue.subtract(1, 'week');

      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay;
        this.checkMonth();
      }
    },
    previousDay: function previousDay() {
      var keyboardSelectedDay = this.currentValue.subtract(1, 'days');

      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay;
        this.checkMonth();
      }
    },
    nextDay: function nextDay() {
      var keyboardSelectedDay = this.currentValue.add(1, 'days');

      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay;
        this.checkMonth();
      }
    },
    nextWeek: function nextWeek() {
      var keyboardSelectedDay = this.currentValue.add(1, 'week');

      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay;
        this.checkMonth();
      }
    },
    previousMonth: function previousMonth() {
      var keyboardSelectedDay = this.currentValue.subtract(1, 'month');

      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay;
        this.checkMonth();
      }
    },
    nextMonth: function nextMonth() {
      var keyboardSelectedDay = this.currentValue.add(1, 'month');

      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay;
        this.checkMonth();
      }
    },
    checkMonth: function checkMonth() {
      var _this = this;

      this.$nextTick(function () {
        var newYear = parseInt(_this.currentValue.format('YYYY'));
        var currentYear = _this.month.year;
        var isSameYear = newYear === currentYear;

        if (parseInt(_this.currentValue.format('MM') - 1) !== _this.month.month && isSameYear) {
          if (parseInt(_this.currentValue.format('MM') - 1) > _this.month.month) {
            _this.$emit('change-month', 'next');
          } else {
            _this.$emit('change-month', 'prev');
          }
        } else if (!isSameYear) {
          if (newYear > currentYear) {
            _this.$emit('change-month', 'next');
          } else {
            _this.$emit('change-month', 'prev');
          }
        }
      });
    }
  },
  mounted: function mounted() {
    if (this.hasKeyboard && (this.inline || this.isVisible)) {
      var keyPressed = this.keyPressed;
      keyboard_accessibility_addListerner({
        keyPressed: keyPressed
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    var keyPressed = this.keyPressed;
    keyboard_accessibility_removeListerner({
      keyPressed: keyPressed
    });
  },
  watch: {
    isVisible: function isVisible(value) {
      var keyPressed = this.keyPressed;

      if (this.hasKeyboard && value) {
        keyboard_accessibility_addListerner({
          keyPressed: keyPressed
        });
      } else {
        keyboard_accessibility_removeListerner({
          keyPressed: keyPressed
        });
      }
    }
  }
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/MonthPicker/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var MonthPickervue_type_script_lang_js_ = ({
  name: 'MonthPicker',
  components: {
    MazBtn: MazBtn
  },
  mixins: [keyboard_accessibility],
  props: {
    value: {
      type: Object,
      default: null
    },
    month: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    format: {
      type: String,
      default: null
    },
    minDate: {
      type: String,
      default: null
    },
    maxDate: {
      type: String,
      default: null
    },
    noWeekendsDays: {
      type: Boolean,
      default: false
    },
    disabledDates: {
      type: Array,
      required: true
    },
    disabledWeekly: {
      type: Array,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    },
    hasDouble: {
      type: Boolean,
      required: true
    },
    hoverredDay: {
      type: Object,
      default: null
    }
  },
  data: function data() {
    return {
      transitionDaysName: 'maz-slidenext',
      currentMonth: this.month
    };
  },
  computed: {
    dateMoment: {
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        var _this$value$hour, _this$value, _this$value$minute, _this$value2;

        var valueToEmit = this.isRangeMode ? value : value.set({
          hour: (_this$value$hour = this === null || this === void 0 ? void 0 : (_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value.hour()) !== null && _this$value$hour !== void 0 ? _this$value$hour : 0,
          minute: (_this$value$minute = this === null || this === void 0 ? void 0 : (_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : _this$value2.minute()) !== null && _this$value$minute !== void 0 ? _this$value$minute : 0
        });
        this.$emit('input', valueToEmit);
      }
    },
    allDays: function allDays() {
      return this.monthDays;
    },
    monthDays: function monthDays() {
      return this.month.getMonthDays();
    },
    weekStart: function weekStart() {
      return this.month.getWeekStart();
    },
    isRangeMode: function isRangeMode() {
      return !!this.dateMoment && Object.keys(this.dateMoment).includes('start');
    },
    minDateDay: function minDateDay() {
      return this.minDate ? external_moment_default()(this.minDate, this.format).startOf('day') : null;
    },
    maxDateDay: function maxDateDay() {
      return this.maxDate ? external_moment_default()(this.maxDate, this.format).endOf('day') : null;
    }
  },
  watch: {
    month: function month(value) {
      var _this = this;

      var newValueIsSmaller = this.currentMonth.start > value.start;
      this.transitionDaysName = newValueIsSmaller ? 'maz-slideprev' : 'maz-slidenext';
      this.$nextTick(function () {
        _this.currentMonth = value;
      });
    }
  },
  mounted: function mounted() {
    if (this.noWeekendsDays && this.isWeekEndDay(this.dateMoment)) {
      throw new Error('[MazPicker]: the value provide is a weekend day and you use the option \'no-weekends-days\'');
    }

    if (this.isDateDisabled(this.dateMoment)) {
      throw new Error('[MazPicker]: the value provide is a disabled date by the option \'disabled-dates\'');
    }
  },
  methods: {
    isToday: function isToday(day) {
      return day.isSame(new Date(), 'day');
    },
    isBetweenHoverred: function isBetweenHoverred(day) {
      if (!this.isRangeMode || this.dateMoment.end) return false;
      return day.isBetween(this.dateMoment.start, this.hoverredDay, null, '[]');
    },
    isBetween: function isBetween(day) {
      if (!this.isRangeMode) return false;
      return day.isBetween(this.dateMoment.start, this.dateMoment.end, null, '[]');
    },
    isFirstInRange: function isFirstInRange(day) {
      if (!this.isRangeMode) return false;
      return day.isSame(this.dateMoment.start, 'day');
    },
    isLastInRange: function isLastInRange(day) {
      if (!this.isRangeMode) return false;
      return day.isSame(this.dateMoment.end, 'day');
    },
    isSelectedDate: function isSelectedDate(day) {
      var _this$dateMoment$star, _this$dateMoment, _this$dateMoment$star2, _this$dateMoment$end$, _this$dateMoment2, _this$dateMoment2$end;

      return this.isRangeMode ? ((_this$dateMoment$star = (_this$dateMoment = this.dateMoment) === null || _this$dateMoment === void 0 ? void 0 : (_this$dateMoment$star2 = _this$dateMoment.start) === null || _this$dateMoment$star2 === void 0 ? void 0 : _this$dateMoment$star2.isSame(day, 'day')) !== null && _this$dateMoment$star !== void 0 ? _this$dateMoment$star : false) || ((_this$dateMoment$end$ = (_this$dateMoment2 = this.dateMoment) === null || _this$dateMoment2 === void 0 ? void 0 : (_this$dateMoment2$end = _this$dateMoment2.end) === null || _this$dateMoment2$end === void 0 ? void 0 : _this$dateMoment2$end.isSame(day, 'day')) !== null && _this$dateMoment$end$ !== void 0 ? _this$dateMoment$end$ : false) : this.dateMoment ? this.dateMoment.isSame(day, 'day') : false;
    },
    isDisabled: function isDisabled(day) {
      return day.startOf('day').isBefore(this.minDateDay) || day.startOf('day').isAfter(this.maxDateDay) || this.noWeekendsDays && this.isWeekEndDay(day) || this.isDateDisabled(day) || this.isDayDisabledWeekly(day);
    },
    isWeekEndDay: function isWeekEndDay(day) {
      var dayConst = day.day();
      var weekendsDaysNumbers = [6, 0];
      return this.noWeekendsDays ? weekendsDaysNumbers.indexOf(dayConst) > -1 : false;
    },
    isDateDisabled: function isDateDisabled(day) {
      return this.disabledDates.some(function (d) {
        return d.isSame(day, 'day');
      });
    },
    isDayDisabledWeekly: function isDayDisabledWeekly(day) {
      var dayConst = day.day();
      return this.disabledWeekly.includes(dayConst);
    },
    isKeyboardSelected: function isKeyboardSelected(day) {
      return day.isSame(this.keyboardSelectedDay, 'day');
    },
    selectDay: function selectDay(day) {
      EventBus.$emit('day-selected');
      var valueToSend = day;

      if (this.isRangeMode) {
        var _this$dateMoment3 = this.dateMoment,
            start = _this$dateMoment3.start,
            end = _this$dateMoment3.end;

        if (!start || start && end || day.isBefore(this.dateMoment.start)) {
          valueToSend = {
            start: day,
            end: null
          };
        } else {
          valueToSend = {
            start: this.dateMoment.start,
            end: day
          };
        }
      }

      this.dateMoment = valueToSend;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/MonthPicker/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var Calendar_MonthPickervue_type_script_lang_js_ = (MonthPickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/MonthPicker/index.vue





/* normalize component */

var MonthPicker_component = normalizeComponent(
  Calendar_MonthPickervue_type_script_lang_js_,
  MonthPickervue_type_template_id_73cc37fa_render,
  MonthPickervue_type_template_id_73cc37fa_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MonthPicker_api; }
MonthPicker_component.options.__file = "packages/components/MazPicker/PickersContainer/Calendar/MonthPicker/index.vue"
/* harmony default export */ var MonthPicker = (MonthPicker_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/MonthYearSwitcher/index.vue?vue&type=template&id=68045a33&
var MonthYearSwitchervue_type_template_id_68045a33_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "month-year-switcher maz-flex maz-space-between maz-align-center maz-py-2"
    },
    [
      _c(
        "MazBtn",
        {
          staticClass:
            "month-year-switcher__previous maz-flex maz-flex-center maz-bg-transparent maz-hover-bg-color maz-no-focus-bg",
          attrs: {
            fab: "",
            "no-shadow": "",
            color: "grey",
            size: "mini",
            tabindex: "-1"
          },
          on: {
            click: function($event) {
              return _vm.changeMonth("prev")
            }
          }
        },
        [_c("ArrowIcon", { attrs: { orientation: "left" } })],
        1
      ),
      _c(
        "div",
        { staticClass: "maz-flex-1 maz-flex maz-flex-center" },
        [
          _c(
            "MazBtn",
            {
              staticClass:
                "maz-text-color maz-bg-transparent maz-hover-bg-color maz-no-focus-bg maz-p-2 maz-mr-1",
              attrs: { "no-shadow": "", tabindex: "-1", color: "grey" },
              on: {
                click: function($event) {
                  return _vm.$emit("open-month-year-selector", "month")
                }
              }
            },
            _vm._l(_vm.months, function(m, i) {
              return _c("span", { key: i }, [
                _vm._v("\n        " + _vm._s(m.getFormatted()) + "\n        "),
                _vm.months.length > 1 && i === 0
                  ? _c("span", [_vm._v("\n          - \n        ")])
                  : _vm._e()
              ])
            }),
            0
          ),
          _c(
            "MazBtn",
            {
              staticClass:
                "maz-text-color maz-bg-transparent maz-hover-bg-color maz-no-focus-bg maz-p-2",
              attrs: { tabindex: "-1", "no-shadow": "", color: "grey" },
              on: {
                click: function($event) {
                  return _vm.$emit("open-month-year-selector", "year")
                }
              }
            },
            [_vm._v("\n      " + _vm._s(_vm.year) + "\n    ")]
          )
        ],
        1
      ),
      _c(
        "MazBtn",
        {
          staticClass:
            "maz-flex maz-flex-center maz-bg-transparent maz-hover-bg-color maz-no-focus-bg",
          attrs: {
            fab: "",
            "no-shadow": "",
            color: "grey",
            size: "mini",
            tabindex: "-1"
          },
          on: {
            click: function($event) {
              return _vm.changeMonth("next")
            }
          }
        },
        [_c("ArrowIcon", { attrs: { orientation: "right" } })],
        1
      )
    ],
    1
  )
}
var MonthYearSwitchervue_type_template_id_68045a33_staticRenderFns = []
MonthYearSwitchervue_type_template_id_68045a33_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/MonthYearSwitcher/index.vue?vue&type=template&id=68045a33&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/MonthYearSwitcher/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var MonthYearSwitchervue_type_script_lang_js_ = ({
  name: 'MonthYearSwitcher',
  components: {
    ArrowIcon: ArrowIcon,
    MazBtn: MazBtn
  },
  props: {
    months: {
      type: Array,
      required: true
    }
  },
  computed: {
    year: function year() {
      var years = this.months.map(function (m) {
        return m.getYear();
      });
      return Array.from(new Set(years)).join(' - ');
    },
    isDouble: function isDouble() {
      return this.months && this.months.length > 1;
    }
  },
  methods: {
    changeMonth: function changeMonth(val) {
      this.$emit('change-month', val);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/MonthYearSwitcher/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var Calendar_MonthYearSwitchervue_type_script_lang_js_ = (MonthYearSwitchervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/MonthYearSwitcher/index.vue





/* normalize component */

var MonthYearSwitcher_component = normalizeComponent(
  Calendar_MonthYearSwitchervue_type_script_lang_js_,
  MonthYearSwitchervue_type_template_id_68045a33_render,
  MonthYearSwitchervue_type_template_id_68045a33_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MonthYearSwitcher_api; }
MonthYearSwitcher_component.options.__file = "packages/components/MazPicker/PickersContainer/Calendar/MonthYearSwitcher/index.vue"
/* harmony default export */ var MonthYearSwitcher = (MonthYearSwitcher_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/YearMonthSelector/index.vue?vue&type=template&id=464e04d2&
var YearMonthSelectorvue_type_template_id_464e04d2_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("transition", { attrs: { name: "maz-slide" } }, [
    _vm.isOpen
      ? _c(
          "div",
          {
            staticClass:
              "year-month-selector maz-p-2 maz-flex maz-direction-column"
          },
          [
            _c(
              "div",
              { staticClass: "maz-flex maz-justify-end maz-align-center" },
              [
                _vm.value === "year"
                  ? _c(
                      "div",
                      { staticClass: "maz-flex maz-align-center" },
                      [
                        _c(
                          "MazBtn",
                          {
                            staticClass:
                              "maz-flex maz-flex-center maz-mr-1 maz-bg-transparent maz-hover-bg-color maz-no-focus-bg",
                            attrs: {
                              fab: "",
                              "no-shadow": "",
                              size: "mini",
                              color: "grey",
                              tabindex: "-1"
                            },
                            on: {
                              click: function($event) {
                                return _vm.updateYears("prev")
                              }
                            }
                          },
                          [
                            _c("ArrowIcon", {
                              attrs: { orientation: "left", color: "text-grey" }
                            })
                          ],
                          1
                        ),
                        _c(
                          "MazBtn",
                          {
                            staticClass:
                              "maz-flex maz-flex-center maz-mr-1 maz-bg-transparent maz-hover-bg-color maz-no-focus-bg",
                            attrs: {
                              fab: "",
                              "no-shadow": "",
                              size: "mini",
                              color: "grey",
                              tabindex: "-1"
                            },
                            on: {
                              click: function($event) {
                                return _vm.updateYears("next")
                              }
                            }
                          },
                          [
                            _c("ArrowIcon", {
                              attrs: {
                                orientation: "right",
                                color: "text-grey"
                              }
                            })
                          ],
                          1
                        )
                      ],
                      1
                    )
                  : _vm._e(),
                _c(
                  "MazBtn",
                  {
                    staticClass:
                      "year-month-selector__close maz-bg-transparent maz-hover-bg-color maz-no-focus-bg",
                    attrs: {
                      fab: "",
                      "no-shadow": "",
                      size: "mini",
                      color: "grey",
                      tabindex: "-1"
                    },
                    on: { click: _vm.closePanel }
                  },
                  [
                    _c(
                      "i",
                      {
                        staticClass: "material-icons maz-text-color maz-fs-20"
                      },
                      [_vm._v("\n          close\n        ")]
                    )
                  ]
                )
              ],
              1
            ),
            _c(
              "div",
              {
                staticClass:
                  "maz-flex-1 maz-flex maz-flex-wrap maz-space-between maz-align-center maz-pt-2"
              },
              [
                _vm._l(_vm.months, function(m, i) {
                  return _c(
                    "MazBtn",
                    {
                      key: i,
                      staticClass:
                        "year-month-selector__btn maz-bg-transparent maz-no-shadow maz-px-3 maz-flex-20 maz-mx-1",
                      class: [
                        _vm.currentMonth !== i
                          ? "maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-" +
                            _vm.color
                          : "maz-focus-" + _vm.color,
                        { "mx-3": _vm.hasDouble }
                      ],
                      attrs: {
                        color: _vm.color,
                        active: _vm.currentMonth === i,
                        tabindex: "-1"
                      },
                      on: {
                        click: function($event) {
                          return _vm.selectMonth(i)
                        }
                      }
                    },
                    [_vm._v("\n        " + _vm._s(m) + "\n      ")]
                  )
                }),
                _vm._l(_vm.years, function(year) {
                  return _c(
                    "MazBtn",
                    {
                      key: year,
                      staticClass:
                        "year-month-selector__btn maz-bg-transparent maz-no-shadow",
                      class: [
                        _vm.currentYear !== year
                          ? "maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-" +
                            _vm.color
                          : "maz-focus-" + _vm.color
                      ],
                      attrs: {
                        color: _vm.color,
                        active: _vm.currentYear === year,
                        size: "md",
                        tabindex: "-1"
                      },
                      on: {
                        click: function($event) {
                          return _vm.selectYear(year)
                        }
                      }
                    },
                    [_vm._v("\n        " + _vm._s(year) + "\n      ")]
                  )
                })
              ],
              2
            )
          ]
        )
      : _vm._e()
  ])
}
var YearMonthSelectorvue_type_template_id_464e04d2_staticRenderFns = []
YearMonthSelectorvue_type_template_id_464e04d2_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/YearMonthSelector/index.vue?vue&type=template&id=464e04d2&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/YearMonthSelector/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var ArrayRange = function ArrayRange(start, end) {
  return Array(end - start + 1).fill().map(function (_, idx) {
    var n = start + idx;
    return n;
  });
};

/* harmony default export */ var YearMonthSelectorvue_type_script_lang_js_ = ({
  name: 'YearMonthSelector',
  components: {
    ArrowIcon: ArrowIcon,
    MazBtn: MazBtn
  },
  props: {
    value: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    month: {
      type: Object,
      required: true
    },
    hasDouble: {
      type: Boolean,
      required: true
    }
  },
  data: function data() {
    return {
      years: [],
      months: []
    };
  },
  computed: {
    isOpen: function isOpen() {
      return this.value !== null;
    },
    currentMonth: function currentMonth() {
      return this.month.month;
    },
    currentYear: function currentYear() {
      return this.month.year;
    },
    isMonthMode: function isMonthMode() {
      return this.value === 'month';
    }
  },
  watch: {
    value: {
      handler: function handler() {
        this.isMonthMode ? this.getMonths() : this.getYears();
      },
      immediate: true
    }
  },
  methods: {
    closePanel: function closePanel() {
      this.$emit('input', null);
    },
    getMonths: function getMonths() {
      this.years = [];
      this.months = month_getMonthsByFormat(this.hasDouble ? 'MMMM' : 'MMM');
    },
    getYears: function getYears() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.hasDouble ? 17 : 7;
      this.months = [];
      this.years = ArrayRange(this.month.year - offset, this.month.year + offset);
    },
    selectMonth: function selectMonth(monthNumber) {
      this.$emit('change-month-year', {
        month: monthNumber,
        year: this.currentYear
      });
      this.closePanel();
    },
    selectYear: function selectYear(year) {
      this.$emit('change-month-year', {
        month: this.currentMonth,
        year: year
      });
      this.closePanel();
    },
    updateYears: function updateYears(period) {
      var offset = this.hasDouble ? 17 : 7;
      var offsetYears = period === 'next' ? offset : -offset;
      this.years = ArrayRange(this.years[0] + offsetYears, this.years[this.years.length - 1] + offsetYears);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/YearMonthSelector/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var Calendar_YearMonthSelectorvue_type_script_lang_js_ = (YearMonthSelectorvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/YearMonthSelector/index.vue





/* normalize component */

var YearMonthSelector_component = normalizeComponent(
  Calendar_YearMonthSelectorvue_type_script_lang_js_,
  YearMonthSelectorvue_type_template_id_464e04d2_render,
  YearMonthSelectorvue_type_template_id_464e04d2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var YearMonthSelector_api; }
YearMonthSelector_component.options.__file = "packages/components/MazPicker/PickersContainer/Calendar/YearMonthSelector/index.vue"
/* harmony default export */ var YearMonthSelector = (YearMonthSelector_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/RangeShortcuts/index.vue?vue&type=template&id=df1cac5e&
var RangeShortcutsvue_type_template_id_df1cac5e_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "range-shortcuts maz-flex maz-direction-column maz-px-2 maz-py-1 maz-border-color maz-border-right maz-border-right-solid maz-overflow-y-auto",
      style: [
        {
          height: _vm.height + "px",
          width: 140 + "px",
          minWidth: 140 + "px"
        }
      ]
    },
    _vm._l(_vm.shortcuts, function(shortcut) {
      return _c(
        "MazBtn",
        {
          key: shortcut.key,
          staticClass:
            "shortcut-button maz-flex-1 maz-my-1 maz-bg-transparent maz-no-shadow",
          class: [
            _vm.selectedShortcut !== shortcut.key
              ? "maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-" +
                _vm.color
              : "maz-focus-" + _vm.color
          ],
          attrs: {
            active: _vm.selectedShortcut === shortcut.key,
            size: "sm",
            color: _vm.color,
            tabindex: "-1"
          },
          on: {
            click: function($event) {
              return _vm.select(shortcut)
            }
          }
        },
        [
          _c("span", { staticClass: "maz-flex-1" }, [
            _vm._v("\n      " + _vm._s(shortcut.label) + "\n    ")
          ])
        ]
      )
    }),
    1
  )
}
var RangeShortcutsvue_type_template_id_df1cac5e_staticRenderFns = []
RangeShortcutsvue_type_template_id_df1cac5e_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/RangeShortcuts/index.vue?vue&type=template&id=df1cac5e&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/RangeShortcuts/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var SHORTCUT_TYPES = ['day', 'date', '-day', 'isoWeek', '-isoWeek', 'month', '-month', 'quarter', 'year', '-year', 'week', '-week'];
/**
 * Component used to show a list of the shortcuts currently available
 * and select one of them.
 * @module component - RangeShortcuts
 * @param {Array} shortcuts
 */

/* harmony default export */ var RangeShortcutsvue_type_script_lang_js_ = ({
  name: 'RangeShortcuts',
  components: {
    MazBtn: MazBtn
  },
  props: {
    value: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    height: {
      type: Number,
      required: true
    },
    shortcuts: {
      type: Array,
      default: Array,
      validator: function validator(val) {
        return val.every(function (shortcut) {
          var isValueInteger = Number.isInteger(shortcut.value);
          var isFunction = typeof shortcut.value === 'function';
          return shortcut.key && shortcut.label && (isValueInteger || isFunction ? true : SHORTCUT_TYPES.includes(shortcut.value));
        });
      }
    }
  },
  data: function data() {
    return {
      computedTypes: {},
      selectedShortcut: null
    };
  },
  watch: {
    shortcuts: {
      handler: function handler() {
        this.init();
      },
      immediate: true
    }
  },
  mounted: function mounted() {
    var _this = this;

    EventBus.$on('day-selected', function () {
      _this.selectedShortcut = null;
    });
  },
  beforeDestroy: function beforeDestroy() {
    EventBus.$off('day-selected');
  },
  methods: {
    init: function init() {
      var _this2 = this;

      /**
       * Find the pre-selected shortcut
       */
      if (this.value) {
        var selectedShortcut = this.shortcuts.find(function (shortcut) {
          return shortcut.key === _this2.value;
        });
        if (selectedShortcut) this.select(selectedShortcut);
      }
    },

    /**
     * Returns the shortcut values according to the key
     * @function getShortcutByKey
     * @param {string} shortcutKey
     * @returns {Object}
     */
    getShortcutByKey: function getShortcutByKey(shortcutKey) {
      var shortcut = this.shortcuts.find(function (sc) {
        return sc.key === shortcutKey;
      });
      if (!shortcut) return false;
      var value = shortcut.value;
      /**
       * Case where the value is a specific number of days.
       */

      if (typeof value === 'number') {
        return {
          start: external_moment_default()().subtract(value, 'd'),
          end: external_moment_default()(),
          value: value
        };
      }
      /**
       * Case where the value is a function that is in charge of
       * handling the start & end values
       */


      if (typeof value === 'function') {
        var _value = value(),
            start = _value.start,
            end = _value.end;

        if (!start || !end) throw new Error('Missing "start" or "end" values.');
        if (!external_moment_default.a.isMoment(start) || !external_moment_default.a.isMoment(end)) throw new Error('The "start" or "end" values are not moment objects.');
        return {
          start: start,
          end: end
        };
      }

      switch (value) {
        case 'year':
        case 'month':
        case 'quarter':
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
          return {
            start: external_moment_default()().startOf(value),
            end: external_moment_default()().endOf(value),
            value: value
          };

        case '-month':
          return {
            start: external_moment_default()().subtract(1, 'months').startOf('month'),
            end: external_moment_default()().subtract(1, 'months').endOf('month'),
            value: value
          };

        case '-year':
          return {
            start: external_moment_default()().subtract(1, 'years').startOf('year'),
            end: external_moment_default()().subtract(1, 'years').endOf('year'),
            value: value
          };

        case '-week':
          return {
            start: external_moment_default()().subtract(1, 'weeks').startOf('week'),
            end: external_moment_default()().subtract(1, 'weeks').endOf('week'),
            value: value
          };

        case '-isoWeek':
          return {
            start: external_moment_default()().subtract(1, 'weeks').startOf('isoWeek'),
            end: external_moment_default()().subtract(1, 'weeks').endOf('isoWeek'),
            value: value
          };

        case '-day':
          return {
            start: external_moment_default()().subtract(1, 'days').startOf('day'),
            end: external_moment_default()().subtract(1, 'days').endOf('day'),
            value: value
          };
      }
    },
    select: function select(shortcut) {
      this.selectedShortcut = shortcut.key;

      var _this$getShortcutByKe = this.getShortcutByKey(this.selectedShortcut),
          start = _this$getShortcutByKe.start,
          end = _this$getShortcutByKe.end,
          value = _this$getShortcutByKe.value;

      this.$emit('change-range', {
        start: start,
        end: end,
        value: value
      });
      /**
       * Calls a callback function (if defined) on shortcut click
       */

      if (shortcut.callback) {
        if (typeof shortcut.callback !== 'function') throw new Error('The callback must be a function.');
        shortcut.callback({
          shortcut: shortcut,
          start: start,
          end: end
        });
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/RangeShortcuts/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var Calendar_RangeShortcutsvue_type_script_lang_js_ = (RangeShortcutsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/RangeShortcuts/index.vue





/* normalize component */

var RangeShortcuts_component = normalizeComponent(
  Calendar_RangeShortcutsvue_type_script_lang_js_,
  RangeShortcutsvue_type_template_id_df1cac5e_render,
  RangeShortcutsvue_type_template_id_df1cac5e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var RangeShortcuts_api; }
RangeShortcuts_component.options.__file = "packages/components/MazPicker/PickersContainer/Calendar/RangeShortcuts/index.vue"
/* harmony default export */ var RangeShortcuts = (RangeShortcuts_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/TimePicker/index.vue?vue&type=template&id=0e8386c8&
var TimePickervue_type_template_id_0e8386c8_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "TimePicker",
      staticClass: "time-picker maz-flex maz-flex-fixed maz-flex-1",
      class: {
        "maz-border-left maz-border-left-solid maz-border-color": _vm.hasDate
      },
      style: [{ height: (_vm.hasDate ? _vm.height : 150) + "px" }]
    },
    _vm._l(_vm.columns, function(column) {
      return _c(
        "div",
        {
          key: column.type,
          ref: column.type,
          refInFor: true,
          staticClass:
            "time-picker__column maz-flex-1 maz-flex maz-direction-column maz-align-center",
          class: "time-picker__column-" + column.type,
          on: {
            scroll: function($event) {
              _vm.noScrollEvent
                ? null
                : column.type === "hours"
                ? _vm.onScrollHours($event)
                : column.type === "minutes"
                ? _vm.onScrollMinutes($event)
                : _vm.onScrollApms($event)
            }
          }
        },
        [
          _c("div", { staticClass: "before", style: [_vm.columnPadding] }),
          _vm._l(column.items, function(ref) {
            var item = ref.item
            var disabled = ref.disabled
            var v = ref.value
            return _c(
              "MazBtn",
              {
                key: item,
                staticClass:
                  "time-picker__column__item maz-flex maz-flex-center maz-flex-fixed maz-bg-transparent maz-text-color maz-p-0",
                attrs: {
                  size: "mini",
                  tabindex: "-1",
                  "no-shadow": "",
                  color: _vm.color,
                  active: _vm.isActive(column.type, v),
                  disabled: disabled
                },
                on: {
                  click: function($event) {
                    disabled ? null : _vm.selectTime(v, column.type)
                  }
                }
              },
              [_vm._v("\n      " + _vm._s(item) + "\n    ")]
            )
          }),
          _c("div", { staticClass: "after", style: [_vm.columnPadding] })
        ],
        2
      )
    }),
    0
  )
}
var TimePickervue_type_template_id_0e8386c8_staticRenderFns = []
TimePickervue_type_template_id_0e8386c8_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/TimePicker/index.vue?vue&type=template&id=0e8386c8&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/TimePicker/index.vue?vue&type=script&lang=js&


function TimePickervue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function TimePickervue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { TimePickervue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { TimePickervue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function TimePickervue_type_script_lang_js_toConsumableArray(arr) { return TimePickervue_type_script_lang_js_arrayWithoutHoles(arr) || TimePickervue_type_script_lang_js_iterableToArray(arr) || TimePickervue_type_script_lang_js_unsupportedIterableToArray(arr) || TimePickervue_type_script_lang_js_nonIterableSpread(); }

function TimePickervue_type_script_lang_js_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function TimePickervue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return TimePickervue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return TimePickervue_type_script_lang_js_arrayLikeToArray(o, minLen); }

function TimePickervue_type_script_lang_js_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function TimePickervue_type_script_lang_js_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return TimePickervue_type_script_lang_js_arrayLikeToArray(arr); }

function TimePickervue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var ITEM_HEIGHT = 28;
/* harmony default export */ var TimePickervue_type_script_lang_js_ = ({
  name: 'TimePicker',
  components: {
    MazBtn: MazBtn
  },
  props: {
    value: {
      type: Object,
      default: Object
    },
    format: {
      type: String,
      default: null
    },
    minDate: {
      type: String,
      default: null
    },
    maxDate: {
      type: String,
      default: null
    },
    minuteInterval: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    hasDate: {
      type: Boolean,
      required: true
    },
    disabledHours: {
      type: Array,
      required: true
    },
    color: {
      type: String,
      default: null
    }
  },
  data: function data() {
    return {
      hour: null,
      minute: null,
      apm: null,
      noScrollEvent: false,
      columnPadding: {}
    };
  },
  computed: {
    dateMoment: {
      get: function get() {
        return this.value || external_moment_default()();
      },
      set: function set(value) {
        this.$emit('input', value);
      }
    },
    timeFormat: function timeFormat() {
      var _this$format$toLowerC, _this$format;

      var hasTimeFormat = (_this$format$toLowerC = (_this$format = this.format) === null || _this$format === void 0 ? void 0 : _this$format.toLowerCase().includes('h')) !== null && _this$format$toLowerC !== void 0 ? _this$format$toLowerC : false;

      if (hasTimeFormat) {
        return getTimeFormat(this.format);
      } else {
        throw new Error('[MazPicker]: Time format must be indicated or set "no-timer" option');
      }
    },
    isTwelveFormat: function isTwelveFormat() {
      return this.timeFormat.includes('h');
    },
    hours: function hours() {
      var _timeFormat$toLowerCa;

      var timeFormat = this.timeFormat,
          apm = this.apm,
          isTwelveFormat = this.isTwelveFormat,
          _disabledHours = this._disabledHours;
      var twoDigit = (_timeFormat$toLowerCa = timeFormat === null || timeFormat === void 0 ? void 0 : timeFormat.toLowerCase().includes('hh')) !== null && _timeFormat$toLowerCa !== void 0 ? _timeFormat$toLowerCa : false;
      var isAfternoon = apm ? apm === 'pm' || apm === 'PM' : false;
      var minH = isTwelveFormat ? 1 : 0;
      var maxH = isTwelveFormat ? 12 : 23;
      return ArrayHourRange(minH, maxH, twoDigit, isAfternoon, _disabledHours);
    },
    minutes: function minutes() {
      var _this$timeFormat$toLo, _this$timeFormat;

      var minuteInterval = this.minuteInterval,
          disabledMinutes = this.disabledMinutes;
      var twoDigit = (_this$timeFormat$toLo = (_this$timeFormat = this.timeFormat) === null || _this$timeFormat === void 0 ? void 0 : _this$timeFormat.toLowerCase().includes('mm')) !== null && _this$timeFormat$toLo !== void 0 ? _this$timeFormat$toLo : false;
      return ArrayMinuteRange(0, 60, twoDigit, minuteInterval, disabledMinutes);
    },
    apms: function apms() {
      var isTwelveFormat = this.isTwelveFormat,
          timeFormat = this.timeFormat;
      if (!timeFormat.includes('A') && !timeFormat.includes('a')) return null;
      var upper = [{
        value: 'AM',
        item: 'AM'
      }, {
        value: 'PM',
        item: 'PM'
      }];
      var lower = [{
        value: 'am',
        item: 'am'
      }, {
        value: 'pm',
        item: 'pm'
      }];
      return isTwelveFormat ? timeFormat.includes('A') ? upper : lower : null;
    },
    columns: function columns() {
      var hours = this.hours,
          minutes = this.minutes,
          apms = this.apms;
      return [{
        type: 'hours',
        items: hours
      }, {
        type: 'minutes',
        items: minutes
      }].concat(TimePickervue_type_script_lang_js_toConsumableArray(apms ? [{
        type: 'apms',
        items: apms
      }] : []));
    },
    isMinDate: function isMinDate() {
      var dateMoment = this.dateMoment,
          minDate = this.minDate;
      return dateMoment ? dateMoment.isSame(minDate, 'day') : false;
    },
    isMaxDate: function isMaxDate() {
      var dateMoment = this.dateMoment,
          maxDate = this.maxDate;
      return dateMoment ? dateMoment.isSame(maxDate, 'day') : false;
    },
    isMinHour: function isMinHour() {
      var dateMoment = this.dateMoment,
          minDate = this.minDate;
      return dateMoment.isSame(minDate, 'hour');
    },
    isMaxHour: function isMaxHour() {
      var dateMoment = this.dateMoment,
          maxDate = this.maxDate;
      return dateMoment.isSame(maxDate, 'hour');
    },
    disabledMinutes: function disabledMinutes() {
      var isMinDate = this.isMinDate,
          isMaxDate = this.isMaxDate,
          isMinHour = this.isMinHour,
          isMaxHour = this.isMaxHour,
          minDate = this.minDate,
          maxDate = this.maxDate,
          format = this.format;

      if (isMinDate && isMinHour) {
        // get min limit of minDate
        var minMinute = parseInt(external_moment_default()(minDate, format).format('m'), 10);
        return Array.from({
          length: minMinute
        }, function (x, i) {
          return i;
        });
      } else if (isMaxDate && isMaxHour) {
        // get min limit of maxDate
        var maxMinute = parseInt(external_moment_default()(maxDate, format).format('m'), 10);
        return Array.from({
          length: maxMinute
        }).fill().map(function (_, i) {
          return 60 - i;
        });
      }

      return [];
    },
    _disabledHours: function _disabledHours() {
      var hoursDisabled;
      var isMinDate = this.isMinDate,
          isMaxDate = this.isMaxDate,
          minDate = this.minDate,
          maxDate = this.maxDate,
          format = this.format,
          disabledHours = this.disabledHours;

      if (isMinDate) {
        var minHour = parseInt(external_moment_default()(minDate, format).format('H'), 10);
        hoursDisabled = Array.from({
          length: minHour
        }, function (x, i) {
          return i;
        });
      } else if (isMaxDate) {
        var maxhour = parseInt(external_moment_default()(maxDate, format).format('H'), 10);
        hoursDisabled = Array.from({
          length: 24 - maxhour
        }).fill().map(function (_, i) {
          return 24 - i;
        });
      }

      return [].concat(TimePickervue_type_script_lang_js_toConsumableArray(hoursDisabled ? hoursDisabled : []), TimePickervue_type_script_lang_js_toConsumableArray(disabledHours));
    }
  },
  watch: {
    value: {
      handler: function handler(value) {
        var _this = this;

        return TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (value) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return");

                case 2:
                  _context.next = 4;
                  return _this.setTime();

                case 4:
                  _context.next = 6;
                  return _this.validateTime();

                case 6:
                  _context.next = 8;
                  return _this.emitValue();

                case 8:
                  _context.next = 10;
                  return _this.initPositionView();

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      immediate: true
    },
    format: {
      handler: function handler(newValue, oldValue) {
        var _this2 = this;

        return TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
          return regenerator_default.a.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (newValue !== oldValue) {
                    _this2.validateFormat();
                  }

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }))();
      },
      immediate: true
    },
    height: {
      handler: function handler(newValue, oldValue) {
        var _this3 = this;

        return TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee3() {
          return regenerator_default.a.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(newValue === oldValue)) {
                    _context3.next = 2;
                    break;
                  }

                  return _context3.abrupt("return");

                case 2:
                  _context3.next = 4;
                  return _this3.buildColumnPad();

                case 4:
                  _context3.next = 6;
                  return _this3.initPositionView();

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }))();
      },
      immediate: true
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    this.$watch(function (vm) {
      return [vm.disabledMinutes, vm._disabledHours].join();
    }, /*#__PURE__*/TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee4() {
      return regenerator_default.a.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _this4.emitValue();

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  },
  methods: {
    setTime: function setTime() {
      var dateMoment = this.dateMoment,
          isTwelveFormat = this.isTwelveFormat,
          apms = this.apms;
      if (!dateMoment) return;
      var hour = parseInt(dateMoment.format('H'), 10); // set hour value

      this.hour = isTwelveFormat && [0, 12].includes(hour) ? hour === 0 ? 12 : 24 : hour; // set minute value

      this.minute = parseInt(dateMoment.format('m'), 10);
      if (isTwelveFormat) this.apm = this.hour > 12 ? apms[1].value : apms[0].value;
    },
    validateTime: function validateTime() {
      var _this5 = this;

      return TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee5() {
        var isDisabled, getAvailableTime, hour, minute;
        return regenerator_default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _this5.$nextTick();

              case 2:
                isDisabled = _this5.isDisabled, getAvailableTime = _this5.getAvailableTime, hour = _this5.hour, minute = _this5.minute;
                _this5.hour = isDisabled('hours', hour) ? getAvailableTime('hours', hour) : hour;
                _this5.minute = isDisabled('minutes', minute) ? getAvailableTime('minutes', minute) : minute;

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    isDisabled: function isDisabled(type, value) {
      return type === 'minutes' ? this.disabledMinutes.includes(value) : this._disabledHours.includes(value);
    },
    isActive: function isActive(type, value) {
      var hour = this.hour,
          minute = this.minute,
          apm = this.apm;
      return (type === 'hours' ? hour : type === 'minutes' ? minute : apm ? apm : null) === value;
    },
    getAvailableTime: function getAvailableTime(type, number) {
      var list = this[type].map(function (i) {
        return !i.disabled ? i.value : null;
      }).filter(function (i) {
        return i !== null;
      });
      return findNearestNumberInList(list, number);
    },
    onScrollHours: utils_debounce( /*#__PURE__*/function () {
      var _ref2 = TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee6(scroll) {
        var _apm$toLowerCase;

        var apm, isTwelveFormat, initPositionView, emitValue, value, hour;
        return regenerator_default.a.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                apm = this.apm, isTwelveFormat = this.isTwelveFormat, initPositionView = this.initPositionView, emitValue = this.emitValue;
                value = getValue(scroll);
                hour = isTwelveFormat ? ((_apm$toLowerCase = apm === null || apm === void 0 ? void 0 : apm.toLowerCase()) !== null && _apm$toLowerCase !== void 0 ? _apm$toLowerCase : false) === 'am' ? value + 1 : value + 1 + 12 : value;
                this.hour = hour === 24 && !isTwelveFormat ? 23 : hour;
                _context6.next = 6;
                return emitValue();

              case 6:
                _context6.next = 8;
                return initPositionView('hours');

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), 100),
    onScrollMinutes: utils_debounce( /*#__PURE__*/function () {
      var _ref3 = TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee7(scroll) {
        var minuteInterval, initPositionView, emitValue, value, minute;
        return regenerator_default.a.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                minuteInterval = this.minuteInterval, initPositionView = this.initPositionView, emitValue = this.emitValue;
                value = getValue(scroll);
                minute = value * minuteInterval;
                this.minute = minute === 60 ? 59 : minute;
                _context7.next = 6;
                return emitValue();

              case 6:
                _context7.next = 8;
                return initPositionView('minutes');

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }(), 100),
    onScrollApms: utils_debounce( /*#__PURE__*/function () {
      var _ref4 = TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee8(scroll) {
        var apms, apm, hour, initPositionView, emitValue, value, newHour;
        return regenerator_default.a.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                apms = this.apms, apm = this.apm, hour = this.hour, initPositionView = this.initPositionView, emitValue = this.emitValue;
                value = getValue(scroll);

                if (apms && apms[value] && apm !== apms[value].value) {
                  newHour = apm === apms[1].value ? hour - 12 : hour + 12;
                  this.hour = newHour;
                }

                _context8.next = 5;
                return emitValue();

              case 5:
                _context8.next = 7;
                return initPositionView('apms');

              case 7:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }(), 100),
    selectTime: function selectTime(item, type) {
      var _this6 = this;

      return TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee9() {
        var hour, apm, apms, initPositionView, emitValue, newHour;
        return regenerator_default.a.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                hour = _this6.hour, apm = _this6.apm, apms = _this6.apms, initPositionView = _this6.initPositionView, emitValue = _this6.emitValue;

                if (type === 'hours') {
                  _this6.hour = item;
                } else if (type === 'minutes') {
                  _this6.minute = item;
                } else if (type === 'apms' && apm !== item) {
                  newHour = item === apms[1].value ? hour + 12 : hour - 12;
                  _this6.hour = newHour;
                }

                _context9.next = 4;
                return emitValue();

              case 4:
                _context9.next = 6;
                return initPositionView(type);

              case 6:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }))();
    },
    emitValue: function emitValue() {
      var h = this.hour,
          m = this.minute,
          format = this.format,
          isTwelveFormat = this.isTwelveFormat;
      var hour = isTwelveFormat && [12, 24].includes(h) ? h === 24 ? 12 : 0 : h;
      var minute = m ? m : 0;
      this.dateMoment = external_moment_default()(this.dateMoment.set({
        hour: hour,
        minute: minute
      }), format);
    },
    validateFormat: function validateFormat() {
      if (this.isTwelveFormat && !this.apms) throw new Error("MazPicker - Format Error : To have the twelve hours format, the format must have \"A\" or \"a\" (Ex : ".concat(this.format, " a)"));
    },
    buildColumnPad: function buildColumnPad() {
      var _this7 = this;

      return TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee10() {
        var _this7$$refs$TimePick, _this7$$refs, _this7$$refs$TimePick2;

        var pad;
        return regenerator_default.a.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return _this7.$nextTick();

              case 2:
                pad = ((_this7$$refs$TimePick = (_this7$$refs = _this7.$refs) === null || _this7$$refs === void 0 ? void 0 : (_this7$$refs$TimePick2 = _this7$$refs.TimePicker) === null || _this7$$refs$TimePick2 === void 0 ? void 0 : _this7$$refs$TimePick2.clientHeight) !== null && _this7$$refs$TimePick !== void 0 ? _this7$$refs$TimePick : 150) / 2 - ITEM_HEIGHT / 2;
                _this7.columnPadding = {
                  height: "".concat(pad, "px"),
                  flex: "0 0 ".concat(pad, "px")
                };

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }))();
    },
    initPositionView: function initPositionView() {
      var _arguments = arguments,
          _this8 = this;

      return TimePickervue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee11() {
        var containers, hasSmoothEffect;
        return regenerator_default.a.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                containers = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : _this8.isTwelveFormat ? ['hours', 'minutes', 'apms'] : ['hours', 'minutes'];
                _context11.next = 3;
                return _this8.$nextTick();

              case 3:
                if (!Array.isArray(containers)) containers = [containers];
                _this8.noScrollEvent = true;
                hasSmoothEffect = true;
                containers.forEach(function (container) {
                  var _this8$$refs$TimePick, _this8$$refs$TimePick2;

                  if (!_this8.$refs[container]) return;
                  var elem = _this8.$refs[container][0];
                  var timePickerHeight = (_this8$$refs$TimePick = (_this8$$refs$TimePick2 = _this8.$refs.TimePicker) === null || _this8$$refs$TimePick2 === void 0 ? void 0 : _this8$$refs$TimePick2.clientHeight) !== null && _this8$$refs$TimePick !== void 0 ? _this8$$refs$TimePick : null;
                  scrollSmoothElement(elem, timePickerHeight, hasSmoothEffect, ITEM_HEIGHT);
                });
                setTimeout(function () {
                  _this8.noScrollEvent = false;
                }, 300);

              case 8:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }))();
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/TimePicker/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var Calendar_TimePickervue_type_script_lang_js_ = (TimePickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/TimePicker/index.vue





/* normalize component */

var TimePicker_component = normalizeComponent(
  Calendar_TimePickervue_type_script_lang_js_,
  TimePickervue_type_template_id_0e8386c8_render,
  TimePickervue_type_template_id_0e8386c8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var TimePicker_api; }
TimePicker_component.options.__file = "packages/components/MazPicker/PickersContainer/Calendar/TimePicker/index.vue"
/* harmony default export */ var TimePicker = (TimePicker_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/Calendar/index.vue?vue&type=script&lang=js&


function Calendarvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Calendarvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Calendarvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Calendarvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








var CONTENT_HEIGHT = 275;
/* harmony default export */ var Calendarvue_type_script_lang_js_ = ({
  name: 'Calendar',
  components: {
    WeekDaysLabels: WeekDaysLabels,
    MonthPicker: MonthPicker,
    MonthYearSwitcher: MonthYearSwitcher,
    YearMonthSelector: YearMonthSelector,
    RangeShortcuts: RangeShortcuts,
    TimePicker: TimePicker
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    format: {
      type: String,
      default: null
    },
    shortcut: {
      type: String,
      default: null
    },
    locale: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    minDate: {
      type: String,
      default: null
    },
    maxDate: {
      type: String,
      default: null
    },
    noWeekendsDays: {
      type: Boolean,
      default: false
    },
    disabledDates: {
      type: Array,
      required: true
    },
    disabledWeekly: {
      type: Array,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    hasDouble: {
      type: Boolean,
      required: true
    },
    hasKeyboard: {
      type: Boolean,
      required: true
    },
    shortcuts: {
      type: Array,
      default: null
    },
    hasShortcuts: {
      type: Boolean,
      required: true
    },
    hasTime: {
      type: Boolean,
      required: true
    },
    hasDate: {
      type: Boolean,
      required: true
    },
    minuteInterval: {
      type: Number,
      required: true
    },
    disabledHours: {
      type: Array,
      required: true
    }
  },
  data: function data() {
    return {
      months: [],
      yearMonthSelectorMode: null,
      hoverredDay: null,
      contentHeight: CONTENT_HEIGHT
    };
  },
  computed: {
    dateMoment: {
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        this.$emit('input', value);
      }
    },
    isRangeMode: function isRangeMode() {
      return !!this.value && Object.keys(this.value).includes('start');
    },
    currentValue: function currentValue() {
      var value = this.value;

      if (this.isRangeMode) {
        return value.end || value.start || external_moment_default()();
      }

      return value || external_moment_default()();
    }
  },
  watch: {
    value: {
      handler: function handler(newValue, oldValue) {
        var newCurrentValue = this.isRangeMode && newValue ? newValue.end || newValue.start : newValue;
        var oldCurrentValue = this.isRangeMode && oldValue ? oldValue.end || oldValue.start : oldValue;

        if (!this.months.length || this.isDifferentYear(newCurrentValue, oldCurrentValue) || this.monthsAreDifferent(newCurrentValue, oldCurrentValue) && !this.valueIsInMonths(newCurrentValue.month())) {
          this.updateMonth();
        }
      },
      immediate: true
    },
    months: {
      handler: function handler() {
        var _this = this;

        return Calendarvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
          var MonthsContainer;
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this.contentHeight = CONTENT_HEIGHT;
                  _context.next = 3;
                  return _this.$nextTick();

                case 3:
                  MonthsContainer = _this.$refs.MonthsContainer;
                  _this.contentHeight = MonthsContainer && MonthsContainer.clientHeight ? MonthsContainer.clientHeight : CONTENT_HEIGHT;

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      immediate: true
    },
    locale: {
      handler: function handler() {
        this.updateMonth();
      },
      immediate: true
    }
  },
  methods: {
    updateMonth: function updateMonth() {
      var value = this.value;
      var currentYear = this.currentValue.year();
      var currentMonth = this.currentValue.month();
      var hasRangeValuesOnDifferentsMonths = value && value.start && value.end && value.start.month() !== value.end.month();
      this.months = this.getMonths({
        year: currentYear,
        month: hasRangeValuesOnDifferentsMonths ? currentMonth - 1 : currentMonth
      });
    },
    monthsAreDifferent: function monthsAreDifferent(newValue, oldValue) {
      if (!newValue || !oldValue) return false;
      return newValue.month() !== oldValue.month();
    },
    valueIsInMonths: function valueIsInMonths(newMonth) {
      return this.months.some(function (m) {
        return m.month === newMonth;
      });
    },
    isDifferentYear: function isDifferentYear(newCurrentValue, oldCurrentValue) {
      if (!newCurrentValue || !oldCurrentValue) return false;
      return newCurrentValue.year() !== oldCurrentValue.year();
    },
    changeMonth: function changeMonth(val) {
      var month = this.months[0].month + (val === 'prev' ? -1 : +1);
      var year = this.months[0].year;

      if (month > 11 || month < 0) {
        year += val === 'prev' ? -1 : +1;
        month = val === 'prev' ? 11 : 0;
      }

      this.months = this.getMonths({
        year: year,
        month: month
      });
    },
    changeMonthYear: function changeMonthYear(payload) {
      this.months = this.getMonths(payload);
    },
    getMonths: function getMonths(_ref) {
      var _this2 = this;

      var month = _ref.month,
          year = _ref.year;
      var numberOfMonths = Array.from(Array(this.hasDouble ? 2 : 1).keys());
      return numberOfMonths.map(function (i) {
        var newMonthNumber = month + i;
        var monthNumber = newMonthNumber === 12 ? 0 : newMonthNumber;
        var yearNumber = newMonthNumber === 12 ? year + 1 : year;
        return new month_Month(monthNumber, yearNumber, _this2.locale);
      });
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var PickersContainer_Calendarvue_type_script_lang_js_ = (Calendarvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/Calendar/index.vue





/* normalize component */

var Calendar_component = normalizeComponent(
  PickersContainer_Calendarvue_type_script_lang_js_,
  Calendarvue_type_template_id_bc701e78_render,
  Calendarvue_type_template_id_bc701e78_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Calendar_api; }
Calendar_component.options.__file = "packages/components/MazPicker/PickersContainer/Calendar/index.vue"
/* harmony default export */ var Calendar = (Calendar_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/FooterPicker/index.vue?vue&type=template&id=d11bdf62&
var FooterPickervue_type_template_id_d11bdf62_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "footer-picker maz-p-2 maz-flex maz-justify-end maz-border-top maz-border-top-solid maz-border-color"
    },
    [
      _vm.hasNow
        ? _c(
            "MazBtn",
            {
              staticClass:
                "footer-picker__now maz-bg-transparent maz-no-shadow maz-px-3 maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color",
              attrs: { size: "mini", tabindex: "-1", color: _vm.color },
              on: { click: _vm.now }
            },
            [_vm._v("\n    " + _vm._s(_vm.nowTranslation) + "\n  ")]
          )
        : _vm._e(),
      _vm.hasValidate
        ? _c(
            "MazBtn",
            {
              staticClass: "footer-picker__validate",
              attrs: {
                outline: "",
                size: "mini",
                tabindex: "-1",
                disabled: !_vm.currentValue,
                color: "success"
              },
              on: { click: _vm.validate }
            },
            [
              _c("i", { staticClass: "material-icons" }, [
                _vm._v("\n      check\n    ")
              ])
            ]
          )
        : _vm._e()
    ],
    1
  )
}
var FooterPickervue_type_template_id_d11bdf62_staticRenderFns = []
FooterPickervue_type_template_id_d11bdf62_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/FooterPicker/index.vue?vue&type=template&id=d11bdf62&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/FooterPicker/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var FooterPickervue_type_script_lang_js_ = ({
  name: 'FooterPicker',
  components: {
    MazBtn: MazBtn
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    hasValidate: {
      type: Boolean,
      required: true
    },
    hasNow: {
      type: Boolean,
      required: true
    },
    nowTranslation: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  computed: {
    isRangeMode: function isRangeMode() {
      return !!this.value && Object.keys(this.value).includes('start');
    },
    currentValue: function currentValue() {
      if (this.isRangeMode) {
        return this.value.end;
      }

      return this.value;
    }
  },
  methods: {
    validate: function validate(e) {
      EventBus.$emit('validate', e);
    },
    now: function now(e) {
      EventBus.$emit('now', e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/FooterPicker/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var PickersContainer_FooterPickervue_type_script_lang_js_ = (FooterPickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/FooterPicker/index.vue





/* normalize component */

var FooterPicker_component = normalizeComponent(
  PickersContainer_FooterPickervue_type_script_lang_js_,
  FooterPickervue_type_template_id_d11bdf62_render,
  FooterPickervue_type_template_id_d11bdf62_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var FooterPicker_api; }
FooterPicker_component.options.__file = "packages/components/MazPicker/PickersContainer/FooterPicker/index.vue"
/* harmony default export */ var FooterPicker = (FooterPicker_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/PickersContainer/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var PickersContainervue_type_script_lang_js_ = ({
  name: 'PickersContainer',
  components: {
    HeaderPicker: HeaderPicker,
    Calendar: Calendar,
    FooterPicker: FooterPicker
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    format: {
      type: String,
      default: null
    },
    shortcut: {
      type: String,
      default: null
    },
    locale: {
      type: String,
      default: null
    },
    position: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    hasHeader: {
      type: Boolean,
      required: true
    },
    hasFooter: {
      type: Boolean,
      required: true
    },
    hasValidate: {
      type: Boolean,
      required: true
    },
    hasNow: {
      type: Boolean,
      required: true
    },
    nowTranslation: {
      type: String,
      required: true
    },
    minDate: {
      type: String,
      default: null
    },
    maxDate: {
      type: String,
      default: null
    },
    noWeekendsDays: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    disabledDates: {
      type: Array,
      required: true
    },
    disabledWeekly: {
      type: Array,
      required: true
    },
    hasDouble: {
      type: Boolean,
      required: true
    },
    hasKeyboard: {
      type: Boolean,
      required: true
    },
    hasTime: {
      type: Boolean,
      required: true
    },
    hasDate: {
      type: Boolean,
      required: true
    },
    shortcuts: {
      type: Array,
      default: null
    },
    hasShortcuts: {
      type: Boolean,
      required: true
    },
    minuteInterval: {
      type: Number,
      required: true
    },
    disabledHours: {
      type: Array,
      required: true
    }
  },
  computed: {
    dateMoment: {
      get: function get() {
        return this.value;
      },
      set: function set(value) {
        this.$emit('input', value);
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var MazPicker_PickersContainervue_type_script_lang_js_ = (PickersContainervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/PickersContainer/index.vue





/* normalize component */

var PickersContainer_component = normalizeComponent(
  MazPicker_PickersContainervue_type_script_lang_js_,
  PickersContainervue_type_template_id_503f5a3f_render,
  PickersContainervue_type_template_id_503f5a3f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var PickersContainer_api; }
PickersContainer_component.options.__file = "packages/components/MazPicker/PickersContainer/index.vue"
/* harmony default export */ var PickersContainer = (PickersContainer_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPicker/_main.vue?vue&type=script&lang=js&


function MazPicker_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function MazPicker_mainvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { MazPicker_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { MazPicker_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function MazPicker_mainvue_type_script_lang_js_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MazPicker_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return typeof obj; }; } else { MazPicker_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MazPicker_mainvue_type_script_lang_js_typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







var NOT_ALLOWED_CLASSES_TO_CLOSE = [['year-month-selector__btn'], ['year-month-selector__close']];
var DOUBLE_PICKER_HEIGHT = 435;
var PICKER_HEIGHT = 386;
var HEADER_HEIGHT = 57;
var FOOTER_HEIGHT = 54;
/**
 * > Date, Time & Range Picker
 */

/* harmony default export */ var MazPicker_mainvue_type_script_lang_js_ = ({
  name: 'MazPicker',
  components: {
    PickersContainer: PickersContainer,
    ArrowIcon: ArrowIcon,
    MazInput: MazInput
  },
  mixins: [uniqueId],
  props: {
    // v-model --> input value
    // must be is the same format like
    value: {
      validator: function validator(prop) {
        return ['string', 'object'].includes(MazPicker_mainvue_type_script_lang_js_typeof(prop)) || prop === null;
      },
      default: null
    },
    // if is `true`, the picker is open
    open: {
      type: Boolean,
      default: false
    },
    // moment JS locale
    locale: {
      validator: function validator(prop) {
        return ['string'].includes(MazPicker_mainvue_type_script_lang_js_typeof(prop)) || prop === null;
      },
      default: getDefaultLocale()
    },
    // override the date picker postion (top / bottom / left / right)
    position: {
      type: String,
      default: null
    },
    // the value in `v-model` will be returned in this format
    format: {
      type: String,
      default: 'YYYY-MM-DD h:mm a'
    },
    // the value in `@formatted` event & shown in input will be formatted with this (formats availables on [MomentJS](https://momentjs.com/))
    formatted: {
      type: String,
      default: 'llll'
    },
    // minimum date the user can set (same format as the model)
    minDate: {
      type: String,
      default: null
    },
    // maximum date the user can set (same format as the model)
    maxDate: {
      type: String,
      default: null
    },
    // set dark mode
    dark: {
      type: Boolean,
      default: false
    },
    // Date picker is always open
    persistent: {
      type: Boolean,
      default: false
    },
    // to remove the picker's header
    noHeader: {
      type: Boolean,
      default: false
    },
    // to remove the picker's footer (buttons container)
    noFooter: {
      type: Boolean,
      default: false
    },
    // to remove the `now` button
    noNow: {
      type: Boolean,
      default: false
    },
    // translation of now of button
    nowTranslation: {
      type: String,
      default: 'Now'
    },
    // all week-ends days disabled
    noWeekendsDays: {
      type: Boolean,
      default: false
    },
    // close picker on select date
    autoClose: {
      type: Boolean,
      default: false
    },
    // Inline picker UI (no input, no dialog)
    inline: {
      type: Boolean,
      default: false
    },
    // disabled dates `Array of dates (same format as the value/format attribute)`,
    disabledDates: {
      type: Array,
      default: Array
    },
    // Days of the week which are disabled every week, in Array format with day index, Sunday as 0 and Saturday as 6: `[0,4,6]`
    disabledWeekly: {
      type: Array,
      default: Array
    },
    // show double calendar
    double: {
      type: Boolean,
      default: false
    },
    // Enable range mode to select periode
    range: {
      type: Boolean,
      default: false
    },
    // Change placeholder/label of input
    placeholder: {
      type: String,
      default: 'Select date time'
    },
    // Disabled keyboard accessibility & navigation
    noKeyboard: {
      type: Boolean,
      default: false
    },
    // Disabled time picker
    noTime: {
      type: Boolean,
      default: false
    },
    // Disabled date picker
    noDate: {
      type: Boolean,
      default: false
    },
    // Change minute interval in time picker
    minuteInterval: {
      type: Number,
      default: 1
    },
    // Must be an Array of integer: `0` to `24` (0 = 12am, 24 = 12pm) => `[0,1,2,3,4,5,6,7,19,20,21,22,23]`
    disabledHours: {
      type: Array,
      default: Array
    },
    // Disable the overlay on mobile
    noOverlay: {
      type: Boolean,
      default: false
    },
    // pre selected shortcut: provide a shortcut key
    shortcut: {
      type: String,
      default: null
    },
    // Disabled shortcuts in range mode
    noShortcuts: {
      type: Boolean,
      default: false
    },
    // shortcuts for range mode
    shortcuts: {
      type: Array,
      default: function _default() {
        return [{
          key: 'thisWeek',
          label: 'This week',
          value: 'isoWeek'
        }, {
          key: 'lastWeek',
          label: 'Last week',
          value: '-isoWeek'
        }, {
          key: 'last7Days',
          label: 'Last 7 days',
          value: 7
        }, {
          key: 'last30Days',
          label: 'Last 30 days',
          value: 30
        }, {
          key: 'thisMonth',
          label: 'This month',
          value: 'month'
        }, {
          key: 'lastMonth',
          label: 'Last month',
          value: '-month'
        }, {
          key: 'thisYear',
          label: 'This year',
          value: 'year'
        }, {
          key: 'lastYear',
          label: 'Last year',
          value: '-year'
        }];
      }
    },
    // choose main color
    color: {
      type: String,
      default: 'primary'
    }
  },
  data: function data() {
    return {
      isOpen: null,
      calcPosition: 'bottom left',
      update: false
    };
  },
  computed: {
    inputValue: {
      get: function get() {
        forceUpdateComputedData(this.update);
        return capitalize(utils_getFormattedValue(this.value, this.format, this.formatted, this.range));
      },
      set: function set() {
        this.emitValue(null);
      }
    },
    dateMoment: {
      get: function get() {
        forceUpdateComputedData(this.update);
        return utils_getDateMoment(this.value, this.format, this.range);
      },
      set: function set(value) {
        this.emitValue(value);
      }
    },
    minDateDay: function minDateDay() {
      return this.minDate ? external_moment_default()(this.minDate, this.format).startOf('day') : null;
    },
    maxDateDay: function maxDateDay() {
      return this.maxDate ? external_moment_default()(this.maxDate, this.format).endOf('day') : null;
    },
    hasPickerOpen: function hasPickerOpen() {
      return this.isOpen || this.open || this.inline;
    },
    pickerTransition: function pickerTransition() {
      return this.calcPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert';
    },
    hasHeader: function hasHeader() {
      return !this.noHeader;
    },
    hasFooter: function hasFooter() {
      return !this.noFooter && (this.hasValidate || this.hasNow);
    },
    hasValidate: function hasValidate() {
      return !this.inline && !this.autoClose;
    },
    hasNow: function hasNow() {
      return !this.noNow && !this.range;
    },
    hasKeyboard: function hasKeyboard() {
      return !this.noKeyboard && !this.hasDouble;
    },
    disabledDatesMoment: function disabledDatesMoment() {
      var _this = this;

      return this.disabledDates.map(function (d) {
        return external_moment_default()(d, _this.format);
      });
    },
    hasDouble: function hasDouble() {
      return this.double;
    },
    hasTime: function hasTime() {
      return !this.noTime && !this.range;
    },
    hasDate: function hasDate() {
      return !this.noDate;
    },
    hasShortcuts: function hasShortcuts() {
      return !this.noShortcuts && this.range;
    },
    hasOverlay: function hasOverlay() {
      return !this.noOverlay && this.hasPickerOpen && !this.inline;
    }
  },
  watch: {
    dateMoment: {
      handler: function handler(value) {
        var minDateDay = this.minDateDay,
            maxDateDay = this.maxDateDay,
            range = this.range;

        if (value && (minDateDay || maxDateDay)) {
          if (range) return;

          var _hasDateBetweenMinMax = hasDateBetweenMinMaxDate(value, minDateDay, maxDateDay, range),
              isBefore = _hasDateBetweenMinMax.isBefore,
              isAfter = _hasDateBetweenMinMax.isAfter;

          if (isAfter) this.emitValue(this.maxDateDay);
          if (isBefore) this.emitValue(this.minDateDay);
        }

        this.emitFormatted(value);
      },
      immediate: true
    },
    locale: {
      handler: function handler(locale) {
        external_moment_default.a.locale(locale);
        this.update = !this.update;
      },
      immediate: true
    },
    hasPickerOpen: {
      handler: function handler(value) {
        var _this2 = this;

        return MazPicker_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
          var verticalPosition;
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _this2.getVerticalPosition();

                case 2:
                  verticalPosition = _context.sent;
                  if (value) _this2.calcPosition = _this2.position || "".concat(verticalPosition, " left");

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      immediate: true
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    EventBus.$on('validate', function () {
      _this3.closePicker(); // emit when the user click on validate button


      _this3.$emit('validate');
    });
    EventBus.$on('now', function () {
      _this3.emitValue(external_moment_default()()); // emit when the user click on now button


      _this3.$emit('now');
    });
    EventBus.$on('close', function () {
      _this3.closePicker();
    });
  },
  beforeDestroy: function beforeDestroy() {
    EventBus.$off('validate');
    EventBus.$off('now');
    EventBus.$off('close'); // emit on before destroy

    this.$emit('destroy');
  },
  methods: {
    emitValue: function emitValue(value) {
      var valueToSend;
      var range = this.range,
          autoClose = this.autoClose,
          closePicker = this.closePicker,
          format = this.format;

      if (this.range) {
        if (value) {
          var start = value.start,
              end = value.end;
          valueToSend = {
            start: start instanceof external_moment_default.a ? start.format(format) : null,
            end: end instanceof external_moment_default.a ? end.format(format) : null
          };
        } else {
          valueToSend = null;
        }
      } else {
        valueToSend = value instanceof external_moment_default.a ? value.format(format) : null;
      }

      var sameHaseCurrentValue = valueToSend === this.value;
      if (sameHaseCurrentValue) return;
      if (autoClose && !range) closePicker();
      if (autoClose && range && value.start && value.end) closePicker(); // return the date value (in `@input` or `v-model`)
      // @arg date formatted with "format" option

      this.$emit('input', valueToSend);
    },
    emitFormatted: function emitFormatted(value) {
      if (this.value) {
        // return the date value (in `@formatted` event)
        // @arg date formatted with "formatted" option
        this.$emit('formatted', utils_getFormattedValue(value, this.format, this.formatted, this.range));
      }
    },
    openPicker: function openPicker() {
      this.isOpen = true; // emit when picker is show

      this.$emit('is-shown');
    },
    closePicker: function closePicker() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (this.$el.contains(e.relatedTarget) || checkIfTargetIsAllowedToCloseComponent(NOT_ALLOWED_CLASSES_TO_CLOSE, e.target)) return;
      this.isOpen = false; // emit when picker is hide

      this.$emit('is-hidden');
    },
    getVerticalPosition: function getVerticalPosition() {
      var _this4 = this;

      return MazPicker_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
        var parentRect, windowHeight, datePickerHeight;
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(typeof window === 'undefined')) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", 'top');

              case 2:
                _context2.next = 4;
                return _this4.$nextTick();

              case 4:
                parentRect = _this4.$refs.MazPicker.getBoundingClientRect();
                windowHeight = window.innerHeight;
                datePickerHeight = _this4.hasDouble ? DOUBLE_PICKER_HEIGHT : PICKER_HEIGHT;
                datePickerHeight = _this4.noFooter ? datePickerHeight - HEADER_HEIGHT : datePickerHeight;
                datePickerHeight = _this4.noHeader ? datePickerHeight - FOOTER_HEIGHT : datePickerHeight;

                if (!(parentRect.top < datePickerHeight)) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", 'bottom');

              case 13:
                if (!(windowHeight - (parentRect.height + datePickerHeight + parentRect.top) >= 0)) {
                  _context2.next = 17;
                  break;
                }

                return _context2.abrupt("return", 'bottom');

              case 17:
                return _context2.abrupt("return", 'top');

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPicker/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazPicker_mainvue_type_script_lang_js_ = (MazPicker_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPicker/_main.vue





/* normalize component */

var MazPicker_main_component = normalizeComponent(
  components_MazPicker_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_7e489288_render,
  _mainvue_type_template_id_7e489288_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazPicker_main_api; }
MazPicker_main_component.options.__file = "packages/components/MazPicker/_main.vue"
/* harmony default export */ var MazPicker_main = (MazPicker_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazPicker/index.js


MazPicker_main.install = function (Vue) {
  Vue.component(MazPicker_main.name, MazPicker_main);
};

/* harmony default export */ var MazPicker = (MazPicker_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPlotly/_main.vue?vue&type=template&id=66102fb0&
var _mainvue_type_template_id_66102fb0_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    staticClass: "maz-base-component maz-plotly",
    attrs: { id: _vm.uniqueId }
  })
}
var _mainvue_type_template_id_66102fb0_staticRenderFns = []
_mainvue_type_template_id_66102fb0_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPlotly/_main.vue?vue&type=template&id=66102fb0&

// EXTERNAL MODULE: external "plotly.js-dist"
var external_plotly_js_dist_ = __webpack_require__(2);
var external_plotly_js_dist_default = /*#__PURE__*/__webpack_require__.n(external_plotly_js_dist_);

// CONCATENATED MODULE: ./packages/components/MazPlotly/events.js
var eventsName = ['AfterExport', 'AfterPlot', 'Animated', 'AnimatingFrame', 'AnimationInterrupted', 'AutoSize', 'BeforeExport', 'ButtonClicked', 'Click', 'ClickAnnotation', 'Deselect', 'DoubleClick', 'Framework', 'Hover', 'LegendClick', 'LegendDoubleClick', 'Relayout', 'Restyle', 'Redraw', 'Selected', 'Selecting', 'SliderChange', 'SliderEnd', 'SliderStart', 'Transitioning', 'TransitionInterrupted', 'Unhover'];
var events = eventsName.map(function (evt) {
  return evt.toLocaleLowerCase();
}).map(function (eventName) {
  return {
    completeName: 'plotly_' + eventName,
    handler: function handler(context) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        context.$emit.apply(context, [eventName].concat(args));
      };
    }
  };
});
/* harmony default export */ var MazPlotly_events = (events);
// CONCATENATED MODULE: ./packages/components/MazPlotly/methods.js

var plotlyFunctions = ['restyle', 'relayout', 'update', 'addTraces', 'deleteTraces', 'moveTraces', 'extendTraces', 'prependTraces', 'purge'];
var methods = plotlyFunctions.reduce(function (all, functionName) {
  all[functionName] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return external_plotly_js_dist_default.a[functionName].apply(external_plotly_js_dist_default.a, [this.$el].concat(args));
  };

  return all;
}, {});
/* harmony default export */ var MazPlotly_methods = (methods);
// CONCATENATED MODULE: ./packages/components/MazPlotly/helper.js
var cached = function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

var regex = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(regex, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPlotly/_main.vue?vue&type=script&lang=js&
function _mainvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _mainvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { _mainvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { _mainvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { _mainvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _mainvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//





/* harmony default export */ var MazPlotly_mainvue_type_script_lang_js_ = ({
  name: 'MazPlotly',
  mixins: [uniqueId],
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: null
    },
    layout: {
      type: Object,
      default: null
    },
    id: {
      type: String,
      default: null
    }
  },
  data: function data() {
    return {
      scheduled: null,
      innerLayout: _mainvue_type_script_lang_js_objectSpread({}, this.layout)
    };
  },
  computed: {
    options: function options() {
      var _this = this;

      var optionsFromAttrs = Object.keys(this.$attrs).reduce(function (acc, key) {
        acc[camelize(key)] = _this.$attrs[key];
        return acc;
      }, {});
      return _mainvue_type_script_lang_js_objectSpread({
        responsive: false
      }, optionsFromAttrs);
    }
  },
  watch: {
    data: {
      handler: function handler() {
        this.schedule({
          replot: true
        });
      },
      deep: true
    },
    options: {
      handler: function handler(value, old) {
        if (JSON.stringify(value) === JSON.stringify(old)) {
          return;
        }

        this.schedule({
          replot: true
        });
      },
      deep: true
    },
    layout: function layout(_layout) {
      this.innerLayout = _mainvue_type_script_lang_js_objectSpread({}, _layout);
      this.schedule({
        replot: false
      });
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    external_plotly_js_dist_default.a.newPlot(this.$el, this.data, this.innerLayout, this.options);
    MazPlotly_events.forEach(function (evt) {
      _this2.$el.on(evt.completeName, evt.handler(_this2));
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize);
    }
  },
  beforeDestroy: function beforeDestroy() {
    var _this3 = this;

    MazPlotly_events.forEach(function (event) {
      return _this3.$el.removeAllListeners(event.completeName);
    });
    external_plotly_js_dist_default.a.purge(this.$el);

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  },
  methods: _mainvue_type_script_lang_js_objectSpread(_mainvue_type_script_lang_js_objectSpread({}, MazPlotly_methods), {}, {
    onResize: function onResize() {
      external_plotly_js_dist_default.a.Plots.resize(this.$el);
    },
    schedule: function schedule(context) {
      var _this4 = this;

      var scheduled = this.scheduled;

      if (scheduled) {
        scheduled.replot = scheduled.replot || context.replot;
        return;
      }

      this.scheduled = context;
      this.$nextTick(function () {
        var replot = _this4.scheduled.replot;
        _this4.scheduled = null;

        if (replot) {
          _this4.react();

          return;
        }

        _this4.relayout(_this4.innerLayout);
      });
    },
    toImage: function toImage(options) {
      var allOptions = Object.assign(this.getPrintOptions(), options);
      return external_plotly_js_dist_default.a.toImage(this.$el, allOptions);
    },
    downloadImage: function downloadImage(options) {
      var filename = "plot--".concat(new Date().toISOString());
      var allOptions = Object.assign(this.getPrintOptions(), {
        filename: filename
      }, options);
      return external_plotly_js_dist_default.a.downloadImage(this.$el, allOptions);
    },
    getPrintOptions: function getPrintOptions() {
      var $el = this.$el;
      return {
        format: 'png',
        width: $el.clientWidth,
        height: $el.clientHeight
      };
    },
    react: function react() {
      external_plotly_js_dist_default.a.react(this.$el, this.data, this.innerLayout, this.options);
    }
  })
});
// CONCATENATED MODULE: ./packages/components/MazPlotly/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazPlotly_mainvue_type_script_lang_js_ = (MazPlotly_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPlotly/_main.vue





/* normalize component */

var MazPlotly_main_component = normalizeComponent(
  components_MazPlotly_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_66102fb0_render,
  _mainvue_type_template_id_66102fb0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazPlotly_main_api; }
MazPlotly_main_component.options.__file = "packages/components/MazPlotly/_main.vue"
/* harmony default export */ var MazPlotly_main = (MazPlotly_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazPlotly/index.js


MazPlotly_main.install = function (Vue) {
  Vue.component(MazPlotly_main.name, MazPlotly_main);
};

/* harmony default export */ var MazPlotly = (MazPlotly_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazProgressBar/_main.vue?vue&type=template&id=68a231e4&
var _mainvue_type_template_id_68a231e4_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "maz-base-component maz-progress-bar maz-flex maz-align-center maz-bg-color-light",
      class: { "maz-border-radius-0": _vm.noRadius }
    },
    [
      _c("div", {
        staticClass: "maz-progress-bar__bg maz-border-radius",
        class: [
          {
            "maz-border-radius-0": _vm.noRadius
          },
          _vm.bgColor ? "maz-bg-" + _vm.bgColor : null
        ],
        style: [_vm.getOuterStyle]
      }),
      _c(
        "div",
        {
          staticClass: "maz-progress-bar__line maz-border-radius",
          class: [
            {
              "maz-border-radius-0": _vm.noRadius
            },
            "maz-progress-bar__line--" + _vm.color
          ],
          style: _vm.getLineStyle
        },
        [
          _vm.animated
            ? _c("div", {
                staticClass: "maz-progress-bar__line__anim maz-border-radius",
                class: [
                  {
                    "maz-border-radius-0": !_vm.noRadius
                  }
                ]
              })
            : _vm._e()
        ]
      )
    ]
  )
}
var _mainvue_type_template_id_68a231e4_staticRenderFns = []
_mainvue_type_template_id_68a231e4_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazProgressBar/_main.vue?vue&type=template&id=68a231e4&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazProgressBar/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazProgressBar_mainvue_type_script_lang_js_ = ({
  name: 'MazProgressBar',
  props: {
    // progress value integer, should be between `0` and `100`
    percent: {
      type: Number,
      required: true
    },
    // disable border radius
    noRadius: {
      type: Boolean,
      default: false
    },
    // enable white animation progress
    animated: {
      type: Boolean,
      default: false
    },
    // progress bar height
    height: {
      type: Number,
      default: 4
    },
    // use basic colors from 'maz-ui' or hex/name colors, you can use array with hex colors to set an linear-gradient background
    color: {
      type: [String, Array, Function],
      default: 'primary'
    },
    // use basic colors from 'maz-ui'
    bgColor: {
      type: [String, Array, Function],
      default: null
    }
  },
  computed: {
    getOuterStyle: function getOuterStyle() {
      var height = this.height;
      return {
        height: "".concat(height, "px")
      };
    },
    getLineStyle: function getLineStyle() {
      var percent = this.percent,
          height = this.height,
          color = this.color;
      var result = {
        width: "".concat(percent, "%"),
        height: "".concat(height, "px")
      };

      if (typeof color === 'string') {
        result.backgroundColor = color;
      } else if (Array.isArray(color)) {
        result.backgroundImage = "linear-gradient(to right, ".concat(color.join(', '), ")");
      } else if (typeof color === 'function') {
        result.backgroundColor = color(percent);
      }

      return result;
    }
  },
  mounted: function mounted() {
    var percent = this.percent;
    var test = percent >= 0 && percent <= 100;
    if (!test) throw new Error('[ProgressBar] The progress bar percent should between 0 and 100');
  }
});
// CONCATENATED MODULE: ./packages/components/MazProgressBar/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazProgressBar_mainvue_type_script_lang_js_ = (MazProgressBar_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazProgressBar/_main.vue





/* normalize component */

var MazProgressBar_main_component = normalizeComponent(
  components_MazProgressBar_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_68a231e4_render,
  _mainvue_type_template_id_68a231e4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazProgressBar_main_api; }
MazProgressBar_main_component.options.__file = "packages/components/MazProgressBar/_main.vue"
/* harmony default export */ var MazProgressBar_main = (MazProgressBar_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazProgressBar/index.js


MazProgressBar_main.install = function (Vue) {
  Vue.component(MazProgressBar_main.name, MazProgressBar_main);
};

/* harmony default export */ var MazProgressBar = (MazProgressBar_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPhoneNumberInput/_main.vue?vue&type=template&id=0022c02d&
var _mainvue_type_template_id_0022c02d_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-phone-number-input maz-flex",
      class: [
        { "maz-is-dark": _vm.dark },
        "maz-phone-number-input--" + _vm.size
      ],
      attrs: { id: _vm.id }
    },
    [
      !_vm.noCountrySelector
        ? _c("MazSelect", {
            ref: "CountrySelector",
            staticClass: "country-selector",
            class: {
              "no-padding-left": _vm.noFlags || !_vm.countryCode
            },
            attrs: {
              value: _vm.countryCode,
              options: _vm.countriesSorted,
              placeholder: _vm.t.countrySelectorLabel,
              search: "",
              position: _vm.position,
              "search-placeholder": _vm.t.countrySelectorSearchPlaceholder,
              "items-height": _vm.countriesHeight,
              error: _vm.shouldChooseCountry,
              hint: _vm.shouldChooseCountry ? _vm.t.countrySelectorError : null,
              size: _vm.size,
              success: _vm.isValid && !_vm.noValidation,
              disabled: _vm.disabled,
              "input-value": _vm.callingCode,
              "list-width": 250,
              config: {
                labelKey: "dialCode",
                searchKey: "name",
                valueKey: "iso2"
              },
              color: _vm.color
            },
            on: {
              input: function($event) {
                return _vm.setCountryCode($event, true)
              }
            },
            scopedSlots: _vm._u(
              [
                {
                  key: "default",
                  fn: function(ref) {
                    var option = ref.option
                    return [
                      _c("div", { staticClass: "maz-flex maz-align-center" }, [
                        !_vm.noFlags
                          ? _c(
                              "div",
                              {
                                staticClass:
                                  "country-selector__flag-container maz-mr-2"
                              },
                              [
                                _c("div", {
                                  class:
                                    "maz-flag maz-flag-" +
                                    option.iso2.toLowerCase()
                                })
                              ]
                            )
                          : _vm._e(),
                        _vm.showCodeOnList
                          ? _c(
                              "span",
                              {
                                staticClass:
                                  "country-selector__calling-code maz-flex-fixed maz-text-muted",
                                class: {
                                  "maz-text-muted-dark": option.isSelected
                                }
                              },
                              [
                                _vm._v(
                                  "\n          +" +
                                    _vm._s(option.dialCode) +
                                    "\n        "
                                )
                              ]
                            )
                          : _vm._e(),
                        _c(
                          "div",
                          {
                            staticClass:
                              "maz-dots-text maz-flex-1 maz-text-left maz-text-color",
                            class: {
                              "maz-text-white": option.isSelected
                            }
                          },
                          [
                            _vm._v(
                              "\n          " +
                                _vm._s(option.name) +
                                "\n        "
                            )
                          ]
                        )
                      ])
                    ]
                  }
                }
              ],
              null,
              false,
              2447316597
            )
          })
        : _vm._e(),
      _vm.countryCode && !_vm.noFlags
        ? _c(
            "button",
            {
              staticClass: "maz-phone-number-input__country-flag",
              attrs: { tabindex: "-1" },
              on: { click: _vm.focusCountrySelector }
            },
            [
              _c("div", {
                class: "maz-flag maz-flag-" + _vm.countryCode.toLowerCase()
              })
            ]
          )
        : _vm._e(),
      _c(
        "MazInput",
        _vm._b(
          {
            ref: "PhoneNumberInput",
            staticClass: "input-phone-number maz-flex-1",
            class: {
              "has-border-radius": _vm.noCountrySelector
            },
            attrs: {
              id: _vm.uniqueId ? _vm.uniqueId + "_phone_number" : null,
              value: _vm.asYouTypeNumber,
              placeholder: _vm.placeholder || _vm.t.phoneNumberLabel,
              hint: _vm.hint || _vm.hintValue,
              disabled: _vm.disabled,
              size: _vm.size,
              success: _vm.isValid && !_vm.noValidation,
              clearable: "",
              color: _vm.color
            },
            on: {
              keydown: function(e) {
                _vm.lastKeyPressed = e.keyCode
              },
              focus: function($event) {
                return _vm.$emit("focus", $event)
              },
              blur: function($event) {
                return _vm.$emit("blur", $event)
              },
              change: function($event) {
                return _vm.$emit("change", $event)
              },
              clear: function($event) {
                return _vm.$emit("clear", $event)
              },
              input: _vm.buildResults
            }
          },
          "MazInput",
          _vm.$attrs,
          false
        ),
        [
          _vm._t("icon-left", null, { slot: "icon-left" }),
          _vm._t("icon-right", null, { slot: "icon-right" })
        ],
        2
      )
    ],
    1
  )
}
var _mainvue_type_template_id_0022c02d_staticRenderFns = []
_mainvue_type_template_id_0022c02d_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/_main.vue?vue&type=template&id=0022c02d&

// EXTERNAL MODULE: external "libphonenumber-js"
var external_libphonenumber_js_ = __webpack_require__(3);

// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/constantes/js/phoneCodeCountries.js
var allCountries = [['Afghanistan (‫افغانستان‬‎)', 'af', '93'], ['Albania (Shqipëri)', 'al', '355'], ['Algeria (‫الجزائر‬‎)', 'dz', '213'], ['American Samoa', 'as', '1684'], // [
//   'Andorra',
//   'ad',
//   '376'
// ],
['Angola', 'ao', '244'], ['Anguilla', 'ai', '1264'], ['Antigua and Barbuda', 'ag', '1268'], ['Argentina', 'ar', '54'], ['Armenia (Հայաստան)', 'am', '374'], ['Aruba', 'aw', '297'], ['Australia', 'au', '61', 0], ['Austria (Österreich)', 'at', '43'], ['Azerbaijan (Azərbaycan)', 'az', '994'], ['Bahamas', 'bs', '1242'], ['Bahrain (‫البحرين‬‎)', 'bh', '973'], ['Bangladesh (বাংলাদেশ)', 'bd', '880'], ['Barbados', 'bb', '1246'], ['Belarus (Беларусь)', 'by', '375'], ['Belgium (België)', 'be', '32'], ['Belize', 'bz', '501'], ['Benin (Bénin)', 'bj', '229'], ['Bermuda', 'bm', '1441'], ['Bhutan (འབྲུག)', 'bt', '975'], ['Bolivia', 'bo', '591'], ['Bosnia and Herzegovina (Босна и Херцеговина)', 'ba', '387'], ['Botswana', 'bw', '267'], ['Brazil (Brasil)', 'br', '55'], ['British Indian Ocean Territory', 'io', '246'], ['British Virgin Islands', 'vg', '1284'], ['Brunei', 'bn', '673'], ['Bulgaria (България)', 'bg', '359'], ['Burkina Faso', 'bf', '226'], ['Burundi (Uburundi)', 'bi', '257'], ['Cambodia (កម្ពុជា)', 'kh', '855'], ['Cameroon (Cameroun)', 'cm', '237'], ['Canada', 'ca', '1', 1, ['204', '226', '236', '249', '250', '289', '306', '343', '365', '387', '403', '416', '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587', '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807', '819', '825', '867', '873', '902', '905']], ['Cape Verde (Kabu Verdi)', 'cv', '238'], ['Caribbean Netherlands', 'bq', '599', 1], ['Cayman Islands', 'ky', '1345'], ['Central African Republic (République centrafricaine)', 'cf', '236'], ['Chad (Tchad)', 'td', '235'], ['Chile', 'cl', '56'], ['China (中国)', 'cn', '86'], ['Christmas Island', 'cx', '61', 2], ['Cocos (Keeling) Islands', 'cc', '61', 1], ['Colombia', 'co', '57'], ['Comoros (‫جزر القمر‬‎)', 'km', '269'], ['Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)', 'cd', '243'], ['Congo (Republic) (Congo-Brazzaville)', 'cg', '242'], ['Cook Islands', 'ck', '682'], ['Costa Rica', 'cr', '506'], ['Côte d’Ivoire', 'ci', '225'], ['Croatia (Hrvatska)', 'hr', '385'], ['Cuba', 'cu', '53'], ['Curaçao', 'cw', '599', 0], ['Cyprus (Κύπρος)', 'cy', '357'], ['Czech Republic (Česká republika)', 'cz', '420'], ['Denmark (Danmark)', 'dk', '45'], ['Djibouti', 'dj', '253'], ['Dominica', 'dm', '1767'], ['Dominican Republic (República Dominicana)', 'do', '1', 2, ['809', '829', '849']], ['Ecuador', 'ec', '593'], ['Egypt (‫مصر‬‎)', 'eg', '20'], ['El Salvador', 'sv', '503'], ['Equatorial Guinea (Guinea Ecuatorial)', 'gq', '240'], ['Eritrea', 'er', '291'], ['Estonia (Eesti)', 'ee', '372'], ['Ethiopia', 'et', '251'], ['Falkland Islands (Islas Malvinas)', 'fk', '500'], ['Faroe Islands (Føroyar)', 'fo', '298'], ['Fiji', 'fj', '679'], ['Finland (Suomi)', 'fi', '358', 0], ['France', 'fr', '33'], ['French Guiana (Guyane française)', 'gf', '594'], ['French Polynesia (Polynésie française)', 'pf', '689'], ['Gabon', 'ga', '241'], ['Gambia', 'gm', '220'], ['Georgia (საქართველო)', 'ge', '995'], ['Germany (Deutschland)', 'de', '49'], ['Ghana (Gaana)', 'gh', '233'], ['Gibraltar', 'gi', '350'], ['Greece (Ελλάδα)', 'gr', '30'], ['Greenland (Kalaallit Nunaat)', 'gl', '299'], ['Grenada', 'gd', '1473'], ['Guadeloupe', 'gp', '590', 0], ['Guam', 'gu', '1671'], ['Guatemala', 'gt', '502'], ['Guernsey', 'gg', '44', 1], ['Guinea (Guinée)', 'gn', '224'], ['Guinea-Bissau (Guiné Bissau)', 'gw', '245'], ['Guyana', 'gy', '592'], ['Haiti', 'ht', '509'], ['Honduras', 'hn', '504'], ['Hong Kong (香港)', 'hk', '852'], ['Hungary (Magyarország)', 'hu', '36'], ['Iceland (Ísland)', 'is', '354'], ['India (भारत)', 'in', '91'], ['Indonesia', 'id', '62'], ['Iran (‫ایران‬‎)', 'ir', '98'], ['Iraq (‫العراق‬‎)', 'iq', '964'], ['Ireland', 'ie', '353'], ['Isle of Man', 'im', '44', 2], ['Israel (‫ישראל‬‎)', 'il', '972'], ['Italy (Italia)', 'it', '39', 0], ['Jamaica', 'jm', '1876'], ['Japan (日本)', 'jp', '81'], ['Jersey', 'je', '44', 3], ['Jordan (‫الأردن‬‎)', 'jo', '962'], ['Kazakhstan (Казахстан)', 'kz', '7', 1], ['Kenya', 'ke', '254'], ['Kiribati', 'ki', '686'], ['Kosovo', 'xk', '383'], ['Kuwait (‫الكويت‬‎)', 'kw', '965'], ['Kyrgyzstan (Кыргызстан)', 'kg', '996'], ['Laos (ລາວ)', 'la', '856'], ['Latvia (Latvija)', 'lv', '371'], ['Lebanon (‫لبنان‬‎)', 'lb', '961'], ['Lesotho', 'ls', '266'], ['Liberia', 'lr', '231'], ['Libya (‫ليبيا‬‎)', 'ly', '218'], ['Liechtenstein', 'li', '423'], ['Lithuania (Lietuva)', 'lt', '370'], ['Luxembourg', 'lu', '352'], ['Macau (澳門)', 'mo', '853'], ['Macedonia (FYROM) (Македонија)', 'mk', '389'], ['Madagascar (Madagasikara)', 'mg', '261'], ['Malawi', 'mw', '265'], ['Malaysia', 'my', '60'], ['Maldives', 'mv', '960'], ['Mali', 'ml', '223'], ['Malta', 'mt', '356'], ['Marshall Islands', 'mh', '692'], ['Martinique', 'mq', '596'], ['Mauritania (‫موريتانيا‬‎)', 'mr', '222'], ['Mauritius (Moris)', 'mu', '230'], ['Mayotte', 'yt', '262', 1], ['Mexico (México)', 'mx', '52'], ['Micronesia', 'fm', '691'], ['Moldova (Republica Moldova)', 'md', '373'], ['Monaco', 'mc', '377'], ['Mongolia (Монгол)', 'mn', '976'], ['Montenegro (Crna Gora)', 'me', '382'], ['Montserrat', 'ms', '1664'], ['Morocco (‫المغرب‬‎)', 'ma', '212', 0], ['Mozambique (Moçambique)', 'mz', '258'], ['Myanmar (Burma) (မြန်မာ)', 'mm', '95'], ['Namibia (Namibië)', 'na', '264'], ['Nauru', 'nr', '674'], ['Nepal (नेपाल)', 'np', '977'], ['Netherlands (Nederland)', 'nl', '31'], ['New Caledonia (Nouvelle-Calédonie)', 'nc', '687'], ['New Zealand', 'nz', '64'], ['Nicaragua', 'ni', '505'], ['Niger (Nijar)', 'ne', '227'], ['Nigeria', 'ng', '234'], ['Niue', 'nu', '683'], ['Norfolk Island', 'nf', '672'], ['North Korea (조선 민주주의 인민 공화국)', 'kp', '850'], ['Northern Mariana Islands', 'mp', '1670'], ['Norway (Norge)', 'no', '47', 0], ['Oman (‫عُمان‬‎)', 'om', '968'], ['Pakistan (‫پاکستان‬‎)', 'pk', '92'], ['Palau', 'pw', '680'], ['Palestine (‫فلسطين‬‎)', 'ps', '970'], ['Panama (Panamá)', 'pa', '507'], ['Papua New Guinea', 'pg', '675'], ['Paraguay', 'py', '595'], ['Peru (Perú)', 'pe', '51'], ['Philippines', 'ph', '63'], ['Poland (Polska)', 'pl', '48'], ['Portugal', 'pt', '351'], ['Puerto Rico', 'pr', '1', 3, ['787', '939']], ['Qatar (‫قطر‬‎)', 'qa', '974'], ['Réunion (La Réunion)', 're', '262', 0], ['Romania (România)', 'ro', '40'], ['Russia (Россия)', 'ru', '7', 0], ['Rwanda', 'rw', '250'], ['Saint Barthélemy', 'bl', '590', 1], ['Saint Helena', 'sh', '290'], ['Saint Kitts and Nevis', 'kn', '1869'], ['Saint Lucia', 'lc', '1758'], ['Saint Martin (Saint-Martin (partie française))', 'mf', '590', 2], ['Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)', 'pm', '508'], ['Saint Vincent and the Grenadines', 'vc', '1784'], ['Samoa', 'ws', '685'], ['San Marino', 'sm', '378'], ['São Tomé and Príncipe (São Tomé e Príncipe)', 'st', '239'], ['Saudi Arabia (‫المملكة العربية السعودية‬‎)', 'sa', '966'], ['Senegal (Sénégal)', 'sn', '221'], ['Serbia (Србија)', 'rs', '381'], ['Seychelles', 'sc', '248'], ['Sierra Leone', 'sl', '232'], ['Singapore', 'sg', '65'], ['Sint Maarten', 'sx', '1721'], ['Slovakia (Slovensko)', 'sk', '421'], ['Slovenia (Slovenija)', 'si', '386'], ['Solomon Islands', 'sb', '677'], ['Somalia (Soomaaliya)', 'so', '252'], ['South Africa', 'za', '27'], ['South Korea (대한민국)', 'kr', '82'], ['South Sudan (‫جنوب السودان‬‎)', 'ss', '211'], ['Spain (España)', 'es', '34'], ['Sri Lanka (ශ්‍රී ලංකාව)', 'lk', '94'], ['Sudan (‫السودان‬‎)', 'sd', '249'], ['Suriname', 'sr', '597'], ['Svalbard and Jan Mayen', 'sj', '47', 1], ['Swaziland', 'sz', '268'], ['Sweden (Sverige)', 'se', '46'], ['Switzerland (Schweiz)', 'ch', '41'], ['Syria (‫سوريا‬‎)', 'sy', '963'], ['Taiwan (台灣)', 'tw', '886'], ['Tajikistan', 'tj', '992'], ['Tanzania', 'tz', '255'], ['Thailand (ไทย)', 'th', '66'], ['Timor-Leste', 'tl', '670'], ['Togo', 'tg', '228'], ['Tokelau', 'tk', '690'], ['Tonga', 'to', '676'], ['Trinidad and Tobago', 'tt', '1868'], ['Tunisia (‫تونس‬‎)', 'tn', '216'], ['Turkey (Türkiye)', 'tr', '90'], ['Turkmenistan', 'tm', '993'], ['Turks and Caicos Islands', 'tc', '1649'], ['Tuvalu', 'tv', '688'], ['U.S. Virgin Islands', 'vi', '1340'], ['Uganda', 'ug', '256'], ['Ukraine (Україна)', 'ua', '380'], ['United Arab Emirates (‫الإمارات العربية المتحدة‬‎)', 'ae', '971'], ['United Kingdom', 'gb', '44', 0], ['United States', 'us', '1', 0], ['Uruguay', 'uy', '598'], ['Uzbekistan (Oʻzbekiston)', 'uz', '998'], ['Vanuatu', 'vu', '678'], ['Vatican City (Città del Vaticano)', 'va', '39', 1], ['Venezuela', 've', '58'], ['Vietnam (Việt Nam)', 'vn', '84'], ['Wallis and Futuna (Wallis-et-Futuna)', 'wf', '681'], ['Western Sahara (‫الصحراء الغربية‬‎)', 'eh', '212', 1], ['Yemen (‫اليمن‬‎)', 'ye', '967'], ['Zambia', 'zm', '260'], ['Zimbabwe', 'zw', '263'], ['Åland Islands', 'ax', '358', 1]];
var countriesIso = allCountries.map(function (country) {
  return country[1].toUpperCase();
});
var countries = allCountries.map(function (country) {
  return {
    name: country[0],
    iso2: country[1].toUpperCase(),
    dialCode: country[2],
    priority: country[3] || 0,
    areaCodes: country[4] || null
  };
});
// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/utils/index.js


function utils_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function utils_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { utils_ownKeys(Object(source), true).forEach(function (key) { utils_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { utils_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function utils_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function utils_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function utils_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { utils_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { utils_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var browserLocale = function browserLocale() {
  if (typeof window === 'undefined') return null;
  var browserLocale = window.navigator.userLanguage || window.navigator.language;
  var locale = browserLocale ? browserLocale.substr(3, 4).toUpperCase() : null;
  if (locale === '') locale = browserLocale.substr(0, 2).toUpperCase(); // fallback to US country

  if (locale === 'EN') locale = 'US';
  return locale;
};
var isCountryAvailable = /*#__PURE__*/function () {
  var _ref = utils_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee(locale) {
    return regenerator_default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!countriesIso.includes(locale)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", true);

          case 3:
            throw "MazPhoneNumberInput: The country ".concat(locale, " is not available");

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            throw new Error(_context.t0);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));

  return function isCountryAvailable(_x) {
    return _ref.apply(this, arguments);
  };
}();
var utils_getResultsFromPhoneNumber = function getResultsFromPhoneNumber(phoneNumber, countryCode) {
  var parsing = phoneNumber ? Object(external_libphonenumber_js_["parsePhoneNumberFromString"])(phoneNumber, countryCode) : null;
  var results = {
    countryCode: countryCode,
    isValid: false
  };

  if (parsing) {
    results = utils_objectSpread(utils_objectSpread({}, results), {}, {
      countryCode: parsing.country,
      countryCallingCode: parsing.countryCallingCode,
      nationalNumber: parsing.nationalNumber,
      isValid: parsing.isValid(),
      type: parsing.getType(),
      formatInternational: parsing.formatInternational(),
      formatNational: parsing.formatNational(),
      uri: parsing.getURI(),
      e164: parsing.format('E.164')
    });
  }

  return results;
};
var utils_getAsYouTypeFormat = function getAsYouTypeFormat(phoneNumber, countryCode) {
  if (!phoneNumber) return null;
  return countryCode ? new external_libphonenumber_js_["AsYouType"](countryCode).input(phoneNumber) : phoneNumber;
};
var fetchCountryCode = /*#__PURE__*/function () {
  var _ref2 = utils_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
    var response, responseText, result;
    return regenerator_default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fetch('https://ip2c.org/s');

          case 3:
            response = _context2.sent;
            _context2.next = 6;
            return response.text();

          case 6:
            responseText = _context2.sent;
            result = (responseText || '').toString();

            if (!(result && result[0] === '1')) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", result.substr(2, 2));

          case 10:
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", new Error('[MazPhoneNumberInput] Error while fetching country code'));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));

  return function fetchCountryCode() {
    return _ref2.apply(this, arguments);
  };
}();
// EXTERNAL MODULE: external "libphonenumber-js/examples.mobile.json"
var examples_mobile_json_ = __webpack_require__(10);
var examples_mobile_json_default = /*#__PURE__*/__webpack_require__.n(examples_mobile_json_);

// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/constantes/locales/index.js
/* harmony default export */ var locales = ({
  countrySelectorLabel: 'Country code',
  countrySelectorError: 'Choose country',
  countrySelectorSearchPlaceholder: 'Search country',
  phoneNumberLabel: 'Phone number',
  example: 'Example:'
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSelect/_main.vue?vue&type=template&id=2fb08d76&
var _mainvue_type_template_id_2fb08d76_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-select",
      class: [
        {
          "has-list-open": _vm.hasOpenList,
          "maz-is-dark": _vm.dark
        },
        "maz-select--" + _vm.color,
        "maz-select--" + _vm.size
      ],
      on: {
        "!blur": function($event) {
          return _vm.closeList($event)
        }
      }
    },
    [
      _vm.multiple
        ? _c(
            "div",
            {
              ref: "SelectedTags",
              staticClass: "maz-select__tags maz-flex maz-align-center",
              class: {
                "maz-left-offset": _vm.hasLeftIcon
              }
            },
            [
              _c(
                "transition-group",
                {
                  ref: "SelectedTagsContainer",
                  staticClass: "maz-flex maz-align-center maz-h-100",
                  attrs: { tag: "div", name: "maz-tags" }
                },
                _vm._l(_vm.selectedOptions, function(option, i) {
                  return _c(
                    "MazBtn",
                    {
                      key: "tags-" + i,
                      staticClass: "maz-select__tag maz-flex maz-align-center",
                      attrs: {
                        disabled: _vm.disabled,
                        color: _vm.color,
                        size: _vm.size
                      },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          $event.stopPropagation()
                          return _vm.removeOption(option[_vm.config.valueKey])
                        }
                      }
                    },
                    [
                      _c("span", { staticClass: "maz-select__tag__text" }, [
                        _vm._v(
                          "\n          " +
                            _vm._s(option[_vm.config.labelKey]) +
                            "\n        "
                        )
                      ]),
                      _c(
                        "i",
                        {
                          staticClass: "maz-select__tag__clear material-icons"
                        },
                        [_vm._v("\n          close\n        ")]
                      )
                    ]
                  )
                }),
                1
              )
            ],
            1
          )
        : _vm._e(),
      _c(
        "MazInput",
        _vm._b(
          {
            ref: "textField",
            attrs: {
              value: _vm.valueShown,
              readonly: "",
              "no-label": _vm.hasNoLabel,
              color: _vm.color,
              size: _vm.size,
              placeholder: _vm.placeholderShown,
              disabled: _vm.disabled,
              focus: _vm.hasOpenList
            },
            on: {
              clear: function($event) {
                return _vm.emitValues(null)
              },
              keydown: function($event) {
                _vm.search ? null : _vm.keyboardNav($event)
              },
              keyup: function($event) {
                return _vm.$emit("keyup", $event)
              },
              blur: function($event) {
                return _vm.$emit("blur", $event)
              },
              change: function($event) {
                return _vm.$emit("change", $event)
              },
              paste: function($event) {
                return _vm.$emit("paste", $event)
              },
              click: function($event) {
                return _vm.$emit("click", $event)
              },
              focus: _vm.openList
            }
          },
          "MazInput",
          _vm.$attrs,
          false
        ),
        [
          _vm._t("icon-left", null, { slot: "icon-left" }),
          _c(
            "div",
            {
              staticClass: "maz-select__toggle",
              attrs: { slot: "icon-right", tabindex: "-1" },
              slot: "icon-right"
            },
            [
              _vm._t("arrow", [
                _c(
                  "svg",
                  {
                    staticClass: "maz-select__toggle__arrow",
                    attrs: {
                      mlns: "http://www.w3.org/2000/svg",
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24"
                    }
                  },
                  [
                    _c("path", {
                      staticClass: "arrow",
                      attrs: {
                        d:
                          "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                      }
                    }),
                    _c("path", {
                      attrs: { fill: "none", d: "M0 0h24v24H0V0z" }
                    })
                  ]
                )
              ])
            ],
            2
          )
        ],
        2
      ),
      _c("transition", { attrs: { name: _vm.listTransition } }, [
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.hasOpenList,
                expression: "hasOpenList"
              }
            ],
            staticClass: "maz-select__options-list maz-flex",
            class: [
              _vm.hasPositionTop
                ? "maz-select__options-list--top maz-direction-column-reverse"
                : "maz-direction-column",
              { "maz-select__options-list--right": _vm.hasPositionRight }
            ],
            style: [_vm.itemListSize]
          },
          [
            _vm.search
              ? _c("MazInput", {
                  ref: "SearchInput",
                  staticClass: "maz-m-1",
                  attrs: {
                    color: _vm.color,
                    value: _vm.searchQuery,
                    placeholder: _vm.searchPlaceholder,
                    size: "sm",
                    "no-label": "",
                    name: "new_search_in_options",
                    autocomplete: "off"
                  },
                  on: {
                    input: _vm.searchInOptions,
                    keydown: [
                      _vm.keyboardNav,
                      function($event) {
                        if (
                          !$event.type.indexOf("key") &&
                          _vm._k($event.keyCode, "esc", 27, $event.key, [
                            "Esc",
                            "Escape"
                          ])
                        ) {
                          return null
                        }
                        return _vm.closeList($event)
                      }
                    ]
                  }
                })
              : _vm._e(),
            _c(
              "div",
              {
                ref: "optionsList",
                staticClass:
                  "maz-select__options-list__items maz-flex maz-direction-column"
              },
              [
                _vm._l(_vm.optionsShown, function(option, i) {
                  return _c(
                    "button",
                    {
                      key: i,
                      staticClass:
                        "maz-select__options-list__item flex maz-align-center maz-text-left",
                      class: [
                        {
                          selected:
                            _vm.values.length &&
                            _vm.values.includes(option[_vm.config.valueKey])
                        },
                        {
                          "keyboard-selected":
                            _vm.tmpValue === option[_vm.config.valueKey]
                        }
                      ],
                      style: [_vm.optionHeight],
                      attrs: { tabindex: "-1", type: "button" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          $event.stopPropagation()
                          return _vm.updateValue(option[_vm.config.valueKey])
                        }
                      }
                    },
                    [
                      _vm._t(
                        "default",
                        [
                          _c(
                            "span",
                            {
                              staticClass: "maz-dots-text",
                              class: [
                                {
                                  "maz-text-muted": !option[_vm.config.valueKey]
                                },
                                _vm.values.includes(option[_vm.config.valueKey])
                                  ? "maz-text-white"
                                  : "maz-text-color"
                              ]
                            },
                            [
                              _vm._v(
                                "\n              " +
                                  _vm._s(option[_vm.config.labelKey]) +
                                  "\n            "
                              )
                            ]
                          )
                        ],
                        {
                          option: Object.assign({}, option, {
                            isSelected: _vm.values.includes(
                              option[_vm.config.valueKey]
                            )
                          }),
                          tag: "div"
                        }
                      )
                    ],
                    2
                  )
                }),
                !_vm.optionsShown.length
                  ? _vm._t(
                      "no-results",
                      [
                        _c(
                          "div",
                          {
                            staticClass:
                              "maz-select__options-list__no-results maz-p-1 maz-flex maz-flex-center"
                          },
                          [
                            _c(
                              "i",
                              { staticClass: "material-icons maz-text-danger" },
                              [
                                _vm._v(
                                  "\n              search_off\n            "
                                )
                              ]
                            )
                          ]
                        )
                      ],
                      { tag: "div" }
                    )
                  : _vm._e()
              ],
              2
            )
          ],
          1
        )
      ])
    ],
    1
  )
}
var _mainvue_type_template_id_2fb08d76_staticRenderFns = []
_mainvue_type_template_id_2fb08d76_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSelect/_main.vue?vue&type=template&id=2fb08d76&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSelect/_main.vue?vue&type=script&lang=js&


function MazSelect_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function MazSelect_mainvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { MazSelect_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { MazSelect_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function MazSelect_mainvue_type_script_lang_js_toConsumableArray(arr) { return MazSelect_mainvue_type_script_lang_js_arrayWithoutHoles(arr) || MazSelect_mainvue_type_script_lang_js_iterableToArray(arr) || MazSelect_mainvue_type_script_lang_js_unsupportedIterableToArray(arr) || MazSelect_mainvue_type_script_lang_js_nonIterableSpread(); }

function MazSelect_mainvue_type_script_lang_js_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function MazSelect_mainvue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MazSelect_mainvue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MazSelect_mainvue_type_script_lang_js_arrayLikeToArray(o, minLen); }

function MazSelect_mainvue_type_script_lang_js_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function MazSelect_mainvue_type_script_lang_js_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return MazSelect_mainvue_type_script_lang_js_arrayLikeToArray(arr); }

function MazSelect_mainvue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function MazSelect_mainvue_type_script_lang_js_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MazSelect_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return typeof obj; }; } else { MazSelect_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MazSelect_mainvue_type_script_lang_js_typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/**
 * > Beautiful select input
 */

/* harmony default export */ var MazSelect_mainvue_type_script_lang_js_ = ({
  name: 'MazSelect',
  components: {
    MazInput: MazInput,
    MazBtn: MazBtn
  },
  mixins: [uniqueId],
  props: {
    // is the value of the input
    value: {
      required: true,
      validator: function validator(prop) {
        return ['number', 'string', 'boolean'].includes(MazSelect_mainvue_type_script_lang_js_typeof(prop)) || Array.isArray(prop) || prop === null;
      }
    },
    // list of the options
    options: {
      type: Array,
      required: true
    },
    // When is `true` the select is disabled
    disabled: {
      type: Boolean,
      default: false
    },
    // When is `true` the select has the dark style
    dark: {
      type: Boolean,
      default: false
    },
    // Item in list height in pixel
    itemHeight: {
      type: Number,
      default: 35
    },
    // List height in pixel
    listHeight: {
      type: Number,
      default: 260
    },
    // List width in pixel or percent (:list-width="100", list-width="100%")
    listWidth: {
      type: [Number, String],
      default: null
    },
    // The select has no label in the input
    placeholder: {
      type: String,
      default: 'Select option'
    },
    // When is `true` the select you select multiple values
    noLabel: {
      type: Boolean,
      default: false
    },
    // When is `true` the select you select multiple values
    multiple: {
      type: Boolean,
      default: false
    },
    // When is `true` the select has an input to search in options
    search: {
      type: Boolean,
      default: false
    },
    // the search input placeholder
    searchPlaceholder: {
      type: String,
      default: 'Search in options'
    },
    // the search input placeholder
    color: {
      type: String,
      default: 'primary'
    },
    // input size
    size: {
      type: String,
      default: 'md'
    },
    // When is `true` the option list is open
    open: {
      type: Boolean,
      default: false
    },
    // set the position of option list (`top`, `top right`, `bottom right`)
    position: {
      type: String,
      default: 'left bottom'
    },
    // set label key and value key - Ex: `{ labelKey: '<your_object_key>', valueKey: '<your_object_key>', searchKey: '<your_object_key>' }`
    config: {
      type: Object,
      default: function _default() {
        return {
          labelKey: 'label',
          valueKey: 'value',
          searchKey: 'label'
        };
      }
    },
    // force value shown on input
    inputValue: {
      type: String,
      default: null
    }
  },
  data: function data() {
    return {
      listIsOpen: false,
      query: '',
      tmpValue: null,
      searchQuery: null,
      filteredOptions: null
    };
  },
  computed: {
    hasPositionTop: function hasPositionTop() {
      return this.position.includes('top');
    },
    hasPositionRight: function hasPositionRight() {
      return this.position.includes('right');
    },
    listTransition: function listTransition() {
      return this.position.includes('bottom') ? 'maz-slide' : 'maz-slideinvert';
    },
    hasOpenList: function hasOpenList() {
      return this.open || this.listIsOpen;
    },
    values: function values() {
      var multiple = this.multiple,
          value = this.value,
          options = this.options;
      if (!options) throw new Error('[MazSelect] options should be provide');
      if (multiple && !Array.isArray(value) && value !== null) throw new Error('[MazSelect] value should be an array or null');
      if (!multiple && Array.isArray(value)) throw new Error('[MazSelect] value should be a string, a number or null');
      return value ? multiple ? MazSelect_mainvue_type_script_lang_js_toConsumableArray(value) : [value] : [];
    },
    hasLeftIcon: function hasLeftIcon() {
      return this.$attrs.leftIconName || this.$slots['icon-left'];
    },
    placeholderShown: function placeholderShown() {
      var placeholder = this.placeholder,
          multiple = this.multiple,
          values = this.values;
      return multiple && values.length ? null : placeholder;
    },
    hasNoLabel: function hasNoLabel() {
      return this.multiple || this.noLabel;
    },
    optionHeight: function optionHeight() {
      return {
        height: "".concat(this.itemHeight, "px"),
        flex: "0 0 ".concat(this.itemHeight, "px")
      };
    },
    itemListSize: function itemListSize() {
      var listHeight = this.listHeight,
          listWidth = this.listWidth;
      var width = !Number.isInteger(listWidth) ? listWidth : "".concat(listWidth, "px");
      return {
        maxHeight: "".concat(listHeight, "px"),
        width: width,
        maxWidth: width
      };
    },
    tmpValueIndex: function tmpValueIndex() {
      var config = this.config,
          tmpValue = this.tmpValue,
          optionsShown = this.optionsShown;
      return optionsShown.findIndex(function (c) {
        return c[config.valueKey] === tmpValue;
      });
    },
    selectedValueIndex: function selectedValueIndex() {
      var values = this.values,
          options = this.options,
          config = this.config;
      return values.length ? options.findIndex(function (c) {
        return c[config.valueKey] === values[values.length - 1];
      }) : null;
    },
    valueShown: function valueShown() {
      if (this.inputValue) return this.inputValue;
      var multiple = this.multiple,
          options = this.options,
          values = this.values,
          value = this.value,
          config = this.config;
      var valueSelected = options.find(function (o) {
        return o[config.valueKey] === value;
      });
      var result = valueSelected && valueSelected[config.valueKey] && !multiple ? valueSelected[config.labelKey] : values[0] ? ' ' : null;
      return result;
    },
    optionsShown: function optionsShown() {
      return this.filteredOptions || this.options;
    },
    selectedOptions: function selectedOptions() {
      var values = this.values,
          options = this.options,
          config = this.config;
      var optionsSelected = [];
      values.forEach(function (v) {
        return optionsSelected.push(options.find(function (o) {
          return v === o[config.valueKey];
        }));
      });
      return optionsSelected;
    }
  },
  watch: {
    value: {
      handler: function handler() {
        var multiple = this.multiple;
        if (multiple) this.scrollTags();
      },
      immediate: true
    }
  },
  methods: {
    scrollTags: function scrollTags() {
      var _this = this;

      return MazSelect_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
        var _SelectedTagsContaine, _SelectedTagsContaine2;

        var _this$$refs, SelectedTags, SelectedTagsContainer;

        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.$nextTick();

              case 2:
                _this$$refs = _this.$refs, SelectedTags = _this$$refs.SelectedTags, SelectedTagsContainer = _this$$refs.SelectedTagsContainer;
                if (SelectedTags) SelectedTags.scrollLeft = (_SelectedTagsContaine = SelectedTagsContainer === null || SelectedTagsContainer === void 0 ? void 0 : (_SelectedTagsContaine2 = SelectedTagsContainer.$el) === null || _SelectedTagsContaine2 === void 0 ? void 0 : _SelectedTagsContaine2.clientWidth) !== null && _SelectedTagsContaine !== void 0 ? _SelectedTagsContaine : null;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    removeOption: function removeOption(value) {
      var values = this.values,
          multiple = this.multiple;
      var leftValues = values.filter(function (v) {
        return v !== value;
      });
      var valueToReturn = leftValues.length ? multiple ? leftValues : leftValues[0] : null;
      this.emitValues(valueToReturn);
    },
    closeList: function closeList() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (this.$el.contains(e.relatedTarget)) return;
      this.$emit('close');
      this.listIsOpen = false;
      this.isFocus = false;
    },
    openList: function openList(e) {
      this.$emit('focus', e);
      var disabled = this.disabled,
          search = this.search,
          values = this.values;

      if (!disabled) {
        if (disabled) return; // sent when the list is open

        this.$emit('open');
        this.isFocus = true;
        this.listIsOpen = true;
        this.selectFirstValue();
        if (search) this.focusSearchInput();
        if (values.length) this.scrollToSelectedOnFocus(this.selectedValueIndex);
      }
    },
    clearSearch: function clearSearch() {
      this.searchQuery = null;
      this.filteredOptions = null;
    },
    reset: function reset() {
      var _this2 = this;

      return MazSelect_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.clearSearch();

                if (!_this2.multiple) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                _this2.closeList();

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    selectFirstValue: function selectFirstValue() {
      var multiple = this.multiple,
          value = this.value,
          options = this.options,
          config = this.config;
      if (value || multiple) return;
      var valueToReturn = options[0][config.valueKey] || null;
      this.tmpValue = valueToReturn;
      this.emitValues(valueToReturn, true);
    },
    updateValue: function updateValue(value) {
      var multiple = this.multiple,
          values = this.values,
          removeOption = this.removeOption;
      if (values.includes(value) && multiple) return removeOption(value);
      this.tmpValue = value;
      if (value) values.push(value);
      var valueToReturn = multiple && value ? values : value;
      this.emitValues(valueToReturn);
    },
    focusSearchInput: function focusSearchInput() {
      var _this3 = this;

      return MazSelect_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee3() {
        var SearchInput;
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this3.$nextTick();

              case 2:
                SearchInput = _this3.$refs.SearchInput;
                SearchInput.$el.querySelector('input').focus();

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    emitValues: function emitValues(values, noReset) {
      var _this4 = this;

      return MazSelect_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee4() {
        return regenerator_default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // return the select input
                // @arg the option value selected
                _this4.$emit('input', values);

                if (!noReset) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt("return");

              case 3:
                _context4.next = 5;
                return _this4.$nextTick();

              case 5:
                _this4.reset();

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    scrollToSelectedOnFocus: function scrollToSelectedOnFocus(arrayIndex) {
      var _this5 = this;

      return MazSelect_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee5() {
        return regenerator_default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _this5.$nextTick();

              case 2:
                _this5.$refs.optionsList.scrollTop = arrayIndex * _this5.itemHeight - _this5.itemHeight * 3;

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    keyboardNav: function keyboardNav(e) {
      var code = e.keyCode;
      var hasOpenList = this.hasOpenList,
          tmpValueIndex = this.tmpValueIndex,
          optionsShown = this.optionsShown,
          openList = this.openList,
          tmpValue = this.tmpValue,
          search = this.search,
          config = this.config;

      if (code === 40 || code === 38) {
        if (!hasOpenList) openList();
        var index = code === 40 ? tmpValueIndex + 1 : tmpValueIndex - 1;

        if (index === -1 || index >= optionsShown.length) {
          index = index === -1 ? optionsShown.length - 1 : 0;
        }

        this.tmpValue = optionsShown[index][config.valueKey];
        this.scrollToSelectedOnFocus(index);
      } else if (code === 13) {
        // enter key
        e.preventDefault();
        hasOpenList ? this.updateValue(tmpValue) : this.openList();
      } else if (code === 27) {
        // escape key
        this.closeList();
      } else if (!search) {
        // typing an option's name
        this.searching(e);
      }
    },
    searching: function searching(e) {
      var _this6 = this;

      var config = this.config,
          options = this.options;
      var code = e.keyCode;
      clearTimeout(queryTimer);
      var queryTimer = setTimeout(function () {
        _this6.query = '';
      }, 2000);
      var q = String.fromCharCode(code);

      if (code === 8 && this.query !== '') {
        this.query = this.query.substring(0, this.query.length - 1);
      } else if (/[a-zA-Z-e ]/.test(q)) {
        if (!this.hasOpenList) this.openList();
        this.query += q.toLowerCase();
        var resultIndex = options.findIndex(function (o) {
          _this6.tmpValue = o[config.valueKey];
          return o[config.searchKey].toLowerCase().includes(_this6.query);
        });

        if (resultIndex !== -1) {
          this.scrollToSelectedOnFocus(resultIndex);
        }
      }
    },
    searchInOptions: function searchInOptions(query) {
      var config = this.config,
          options = this.options;
      this.searchQuery = query === '' ? null : query;
      if (!this.searchQuery) return this.filteredOptions = options;
      var searchQuery = query.toLowerCase();
      var filteredOptions = options.filter(function (o) {
        return o[config.valueKey] && o[config.searchKey].toLowerCase().includes(searchQuery);
      });
      this.tmpValue = filteredOptions.length ? filteredOptions[0][config.valueKey] : null;
      this.filteredOptions = filteredOptions;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazSelect/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazSelect_mainvue_type_script_lang_js_ = (MazSelect_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazSelect/_main.vue





/* normalize component */

var MazSelect_main_component = normalizeComponent(
  components_MazSelect_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_2fb08d76_render,
  _mainvue_type_template_id_2fb08d76_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazSelect_main_api; }
MazSelect_main_component.options.__file = "packages/components/MazSelect/_main.vue"
/* harmony default export */ var MazSelect_main = (MazSelect_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazSelect/index.js


MazSelect_main.install = function (Vue) {
  Vue.component(MazSelect_main.name, MazSelect_main);
};

/* harmony default export */ var MazSelect = (MazSelect_main);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPhoneNumberInput/_main.vue?vue&type=script&lang=js&


function MazPhoneNumberInput_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function MazPhoneNumberInput_mainvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { MazPhoneNumberInput_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { MazPhoneNumberInput_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function MazPhoneNumberInput_mainvue_type_script_lang_js_toConsumableArray(arr) { return MazPhoneNumberInput_mainvue_type_script_lang_js_arrayWithoutHoles(arr) || MazPhoneNumberInput_mainvue_type_script_lang_js_iterableToArray(arr) || MazPhoneNumberInput_mainvue_type_script_lang_js_unsupportedIterableToArray(arr) || MazPhoneNumberInput_mainvue_type_script_lang_js_nonIterableSpread(); }

function MazPhoneNumberInput_mainvue_type_script_lang_js_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function MazPhoneNumberInput_mainvue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MazPhoneNumberInput_mainvue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MazPhoneNumberInput_mainvue_type_script_lang_js_arrayLikeToArray(o, minLen); }

function MazPhoneNumberInput_mainvue_type_script_lang_js_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function MazPhoneNumberInput_mainvue_type_script_lang_js_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return MazPhoneNumberInput_mainvue_type_script_lang_js_arrayLikeToArray(arr); }

function MazPhoneNumberInput_mainvue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function MazPhoneNumberInput_mainvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function MazPhoneNumberInput_mainvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { MazPhoneNumberInput_mainvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { MazPhoneNumberInput_mainvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { MazPhoneNumberInput_mainvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function MazPhoneNumberInput_mainvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function MazPhoneNumberInput_mainvue_type_script_lang_js_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MazPhoneNumberInput_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return typeof obj; }; } else { MazPhoneNumberInput_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MazPhoneNumberInput_mainvue_type_script_lang_js_typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ var MazPhoneNumberInput_mainvue_type_script_lang_js_ = ({
  name: 'MazPhoneNumberInput',
  components: {
    MazInput: MazInput,
    MazSelect: MazSelect
  },
  mixins: [uniqueId],
  props: {
    value: {
      validator: function validator(prop) {
        return ['string', 'number'].includes(MazPhoneNumberInput_mainvue_type_script_lang_js_typeof(prop)) || prop === null;
      },
      default: null
    },
    id: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // set default phone number (Ex: `default-phone-number="0658585858"`)
    defaultPhoneNumber: {
      type: String,
      default: null
    },
    // set default country code (Ex: `default-country-code="FR"`)
    defaultCountryCode: {
      type: String,
      default: null
    },
    // Same as MazInput (options: `sm|md|lg`)
    size: {
      type: String,
      default: null
    },
    // Countries selected will be at the top of the list - Ex : `preferred-countries="['FR', 'BE', 'DE']`
    preferredCountries: {
      type: Array,
      default: null
    },
    // Only countries selected are in list - Ex : `only-countries="['FR', 'BE', 'DE']`
    onlyCountries: {
      type: Array,
      default: null
    },
    // Countries seleted are remove from the list - Ex : `ignored-countries="['FR', 'BE', 'DE']`
    ignoredCountries: {
      type: Array,
      default: Array
    },
    // Translate text in component - By default `{ countrySelectorLabel: 'Country code', countrySelectorError: 'Choose country', phoneNumberLabel: 'Phone number', example: 'Example:' }`
    translations: {
      type: Object,
      default: null
    },
    // Remove the validation UI state (success border color)
    noValidation: {
      type: Boolean,
      default: false
    },
    // Remove flags in country selector
    noFlags: {
      type: Boolean,
      default: false
    },
    // Remove the number example from the label input
    noExample: {
      type: Boolean,
      default: false
    },
    // Change the height of country item in list
    countriesHeight: {
      type: Number,
      default: 30
    },
    // Disable use of browser locale to init the country selector (usefull for Nuxt.JS)
    noUseBrowserLocale: {
      type: Boolean,
      default: false
    },
    // Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)
    fetchCountry: {
      type: Boolean,
      default: false
    },
    // The country selector is not shown, you can validate your phone number with the country code set
    noCountrySelector: {
      type: Boolean,
      default: false
    },
    // Show the country phone code in the list
    showCodeOnList: {
      type: Boolean,
      default: false
    },
    // Enable the dark mode
    dark: {
      type: Boolean,
      default: false
    },
    // Use color
    color: {
      type: String,
      default: 'primary'
    },
    // Set placholder of phone number input
    placeholder: {
      type: String,
      default: null
    },
    // hint message shown on phone number text field
    hint: {
      type: String,
      default: null
    },
    // set the position of countries list (ex: `top`, `top right`, `bottom right`)
    position: {
      type: String,
      default: 'left bottom'
    }
  },
  data: function data() {
    return {
      results: {},
      countryCode: this.defaultCountryCode,
      lastKeyPressed: null,
      asYouTypeNumber: this.defaultPhoneNumber
    };
  },
  computed: {
    t: function t() {
      return MazPhoneNumberInput_mainvue_type_script_lang_js_objectSpread(MazPhoneNumberInput_mainvue_type_script_lang_js_objectSpread({}, locales), this.translations);
    },
    callingCode: function callingCode() {
      var _this = this;

      var countryCode = this.countryCode;

      var getDialCode = function getDialCode(code) {
        var result = _this.countriesSorted.find(function (m) {
          return m.iso2 === code;
        });

        return result ? result.dialCode : null;
      };

      return countryCode ? "+".concat(getDialCode(countryCode) || Object(external_libphonenumber_js_["getCountryCallingCode"])(countryCode)) : null;
    },
    // input states
    shouldChooseCountry: function shouldChooseCountry() {
      return !this.countryCode && !!this.asYouTypeNumber;
    },
    isValid: function isValid() {
      return this.results.isValid;
    },
    hasEmptyPhone: function hasEmptyPhone() {
      var asYouTypeNumber = this.asYouTypeNumber;
      return asYouTypeNumber === '' || !asYouTypeNumber;
    },
    // hint values
    phoneNumberExample: function phoneNumberExample() {
      var countryCode = this.countryCode;
      var phoneNumber = countryCode ? Object(external_libphonenumber_js_["getExampleNumber"])(countryCode, examples_mobile_json_default.a) : null;
      return phoneNumber ? phoneNumber.formatNational() : null;
    },
    hintValue: function hintValue() {
      var noExample = this.noExample,
          phoneNumberExample = this.phoneNumberExample,
          hasEmptyPhone = this.hasEmptyPhone,
          isValid = this.isValid,
          t = this.t;
      return noExample || !phoneNumberExample ? null : hasEmptyPhone || isValid ? null : "".concat(t.example, " ").concat(phoneNumberExample);
    },
    // Countries list management
    countriesList: function countriesList() {
      var _this2 = this;

      return countries.filter(function (item) {
        return !_this2.ignoredCountries.includes(item.iso2);
      });
    },
    countriesFiltered: function countriesFiltered() {
      var _this3 = this;

      var countries = this.onlyCountries || this.preferredCountries;
      return countries.map(function (country) {
        return _this3.countriesList.find(function (item) {
          return item.iso2.includes(country);
        });
      });
    },
    otherCountries: function otherCountries() {
      var _this4 = this;

      return this.countriesList.filter(function (item) {
        return !_this4.preferredCountries.includes(item.iso2);
      });
    },
    countriesSorted: function countriesSorted() {
      return this.preferredCountries ? [].concat(MazPhoneNumberInput_mainvue_type_script_lang_js_toConsumableArray(this.countriesFiltered), MazPhoneNumberInput_mainvue_type_script_lang_js_toConsumableArray(this.otherCountries)) : this.onlyCountries ? this.countriesFiltered : this.countriesList;
    }
  },
  watch: {
    defaultPhoneNumber: {
      handler: function handler(phoneNumber, oldPhoneNumber) {
        if (!phoneNumber || phoneNumber === oldPhoneNumber) return;
        this.buildResults(phoneNumber);
      },
      immediate: true
    },
    defaultCountryCode: {
      handler: function handler(newValue, oldValue) {
        if (!newValue || newValue === oldValue) return;
        this.setCountryCode(newValue);
      },
      immediate: true
    }
  },
  mounted: function mounted() {
    var _this5 = this;

    return MazPhoneNumberInput_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
      var defaultCountryCode, fetchCountry, noUseBrowserLocale, setCountryCode, locale;
      return regenerator_default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              defaultCountryCode = _this5.defaultCountryCode, fetchCountry = _this5.fetchCountry, noUseBrowserLocale = _this5.noUseBrowserLocale, setCountryCode = _this5.setCountryCode;
              if (!_this5.defaultPhoneNumber && _this5.value) _this5.buildResults(_this5.value);

              if (!(defaultCountryCode && fetchCountry)) {
                _context.next = 5;
                break;
              }

              throw new Error('MazPhoneNumberInput: Do not use \'fetch-country\' and \'default-country-code\' options in the same time');

            case 5:
              if (!(defaultCountryCode && noUseBrowserLocale)) {
                _context.next = 7;
                break;
              }

              throw new Error('MazPhoneNumberInput: If you use a \'default-country-code\', do not use \'no-use-browser-locale\' options');

            case 7:
              if (!defaultCountryCode) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return");

            case 9:
              if (!fetchCountry) {
                _context.next = 15;
                break;
              }

              _context.next = 12;
              return fetchCountryCode();

            case 12:
              _context.t0 = _context.sent;
              _context.next = 23;
              break;

            case 15:
              if (!noUseBrowserLocale) {
                _context.next = 19;
                break;
              }

              _context.t1 = null;
              _context.next = 22;
              break;

            case 19:
              _context.next = 21;
              return browserLocale();

            case 21:
              _context.t1 = _context.sent;

            case 22:
              _context.t0 = _context.t1;

            case 23:
              locale = _context.t0;
              if (locale) setCountryCode(locale);
              _context.next = 30;
              break;

            case 27:
              _context.prev = 27;
              _context.t2 = _context["catch"](0);
              throw new Error(_context.t2);

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 27]]);
    }))();
  },
  methods: {
    buildResults: function buildResults(phoneNumber, noAutoUpdateCountryCode) {
      var _this6 = this;

      return MazPhoneNumberInput_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
        var asYouTypeNumber, lastKeyPressed, countryCode, value, backSpacePressed, lastCharacOfPhoneNumber, _this6$results, isValid, e164, valueToEmit;

        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                asYouTypeNumber = _this6.asYouTypeNumber, lastKeyPressed = _this6.lastKeyPressed, countryCode = _this6.countryCode, value = _this6.value;
                backSpacePressed = lastKeyPressed === 8;
                _context2.next = 4;
                return _this6.$nextTick();

              case 4:
                lastCharacOfPhoneNumber = asYouTypeNumber ? asYouTypeNumber.slice(asYouTypeNumber.length - 1) : false;

                if (backSpacePressed && lastCharacOfPhoneNumber && lastCharacOfPhoneNumber === ')') {
                  _this6.asYouTypeNumber = asYouTypeNumber.slice(0, -1);
                }

                _context2.next = 8;
                return utils_getResultsFromPhoneNumber(phoneNumber, countryCode);

              case 8:
                _this6.results = _context2.sent;
                _context2.next = 11;
                return utils_getAsYouTypeFormat(phoneNumber, countryCode);

              case 11:
                _this6.asYouTypeNumber = _context2.sent;

                if (!noAutoUpdateCountryCode && _this6.results && _this6.results.countryCode && countryCode !== _this6.results.countryCode) {
                  _this6.setCountryCode(_this6.results.countryCode);
                } // sent when the user tape
                // @arg Object with all parsed values


                _this6.$emit('update', _this6.results);

                _this6$results = _this6.results, isValid = _this6$results.isValid, e164 = _this6$results.e164;
                valueToEmit = isValid ? e164 : _this6.asYouTypeNumber;

                if (!(!valueToEmit && valueToEmit === value)) {
                  _context2.next = 18;
                  break;
                }

                return _context2.abrupt("return");

              case 18:
                // sent when the user tape
                // @arg Phone number value formatted in e164 format (international format)
                _this6.$emit('input', valueToEmit);

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    setCountryCode: function setCountryCode(locale, focusPhoneNumberInput) {
      var _this7 = this;

      return MazPhoneNumberInput_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee3() {
        var buildResults, asYouTypeNumber, countryAvailable;
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                buildResults = _this7.buildResults, asYouTypeNumber = _this7.asYouTypeNumber;
                countryAvailable = isCountryAvailable(locale);

                if (focusPhoneNumberInput) {
                  _this7.focusPhoneNumberInput();

                  if (asYouTypeNumber && asYouTypeNumber.includes('+')) _this7.asYouTypeNumber = null;
                }

                if (countryAvailable && locale) {
                  _this7.countryCode = locale;
                  buildResults(_this7.asYouTypeNumber, true);
                }

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    focusCountrySelector: function focusCountrySelector() {
      var _this8 = this;

      return MazPhoneNumberInput_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee4() {
        return regenerator_default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this8.$nextTick();

              case 2:
                _this8.$refs.CountrySelector.$el.querySelector('input').focus();

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    focusPhoneNumberInput: function focusPhoneNumberInput() {
      var _this9 = this;

      return MazPhoneNumberInput_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee5() {
        return regenerator_default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _this9.$nextTick();

              case 2:
                _this9.$refs.PhoneNumberInput.$el.querySelector('input').focus();

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazPhoneNumberInput_mainvue_type_script_lang_js_ = (MazPhoneNumberInput_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/_main.vue





/* normalize component */

var MazPhoneNumberInput_main_component = normalizeComponent(
  components_MazPhoneNumberInput_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_0022c02d_render,
  _mainvue_type_template_id_0022c02d_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazPhoneNumberInput_main_api; }
MazPhoneNumberInput_main_component.options.__file = "packages/components/MazPhoneNumberInput/_main.vue"
/* harmony default export */ var MazPhoneNumberInput_main = (MazPhoneNumberInput_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/index.js


MazPhoneNumberInput_main.install = function (Vue) {
  Vue.component(MazPhoneNumberInput_main.name, MazPhoneNumberInput_main);
};

/* harmony default export */ var MazPhoneNumberInput = (MazPhoneNumberInput_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazRadio/_main.vue?vue&type=template&id=ce35213a&
var _mainvue_type_template_id_ce35213a_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-radio maz-flex maz-align-center",
      class: ["maz-radio--" + _vm.color]
    },
    [
      _c("input", {
        staticClass: "maz-mr-2",
        attrs: { id: _vm.uniqueId, name: _vm.name, type: "radio" },
        domProps: {
          checked: _vm.value === _vm.radioValue,
          value: _vm.radioValue
        },
        on: {
          change: function($event) {
            return _vm.$emit("input", $event.target.value)
          }
        }
      }),
      _c(
        "label",
        {
          staticClass: "maz-m-0 maz-flex maz-align-center",
          attrs: { for: _vm.uniqueId }
        },
        [_vm._t("default")],
        2
      )
    ]
  )
}
var _mainvue_type_template_id_ce35213a_staticRenderFns = []
_mainvue_type_template_id_ce35213a_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazRadio/_main.vue?vue&type=template&id=ce35213a&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazRadio/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var MazRadio_mainvue_type_script_lang_js_ = ({
  name: 'MazRadio',
  mixins: [uniqueId],
  props: {
    value: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'primary'
    },
    name: {
      type: String,
      default: 'maz-radio'
    },
    radioValue: {
      type: String,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazRadio/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazRadio_mainvue_type_script_lang_js_ = (MazRadio_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazRadio/_main.vue





/* normalize component */

var MazRadio_main_component = normalizeComponent(
  components_MazRadio_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_ce35213a_render,
  _mainvue_type_template_id_ce35213a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazRadio_main_api; }
MazRadio_main_component.options.__file = "packages/components/MazRadio/_main.vue"
/* harmony default export */ var MazRadio_main = (MazRadio_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazRadio/index.js


MazRadio_main.install = function (Vue) {
  Vue.component(MazRadio_main.name, MazRadio_main);
};

/* harmony default export */ var MazRadio = (MazRadio_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazReadMore/_main.vue?vue&type=template&id=b22844f6&
var _mainvue_type_template_id_b22844f6_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "maz-base-component maz-read-more maz-flex maz-direction-column"
    },
    [
      _c("p", { class: [_vm.textClass] }, [_vm._v(_vm._s(_vm.textToShow))]),
      _vm.isTextLong
        ? _c(
            "a",
            {
              attrs: { href: "#", "aria-role": "button" },
              on: {
                click: function($event) {
                  $event.preventDefault()
                  _vm.textVisible = !_vm.textVisible
                }
              }
            },
            [
              _vm._v(
                "\n    " +
                  _vm._s(_vm.textVisible ? _vm.t.readLess : _vm.t.readMore) +
                  "\n  "
              )
            ]
          )
        : _vm._e()
    ]
  )
}
var _mainvue_type_template_id_b22844f6_staticRenderFns = []
_mainvue_type_template_id_b22844f6_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazReadMore/_main.vue?vue&type=template&id=b22844f6&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazReadMore/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazReadMore_mainvue_type_script_lang_js_ = ({
  name: 'MazReadMore',
  props: {
    text: {
      type: String,
      default: null
    },
    textClass: {
      type: String,
      default: null
    },
    truncateLength: {
      type: Number,
      default: 200
    },
    translations: {
      type: Object,
      default: Object
    }
  },
  data: function data() {
    return {
      textVisible: false
    };
  },
  computed: {
    t: function t() {
      return {
        readMore: this.translations.readMore || 'Read more',
        readLess: this.translations.readLess || 'Read less'
      };
    },
    isTextLong: function isTextLong() {
      return this.text && this.text.length > this.truncateLength;
    },
    textToShow: function textToShow() {
      return this.isTextLong && !this.textVisible ? "".concat(this.text.slice(0, this.truncateLength), "...") : this.text;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazReadMore/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazReadMore_mainvue_type_script_lang_js_ = (MazReadMore_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazReadMore/_main.vue





/* normalize component */

var MazReadMore_main_component = normalizeComponent(
  components_MazReadMore_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_b22844f6_render,
  _mainvue_type_template_id_b22844f6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazReadMore_main_api; }
MazReadMore_main_component.options.__file = "packages/components/MazReadMore/_main.vue"
/* harmony default export */ var MazReadMore_main = (MazReadMore_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazReadMore/index.js


MazReadMore_main.install = function (Vue) {
  Vue.component(MazReadMore_main.name, MazReadMore_main);
};

/* harmony default export */ var MazReadMore = (MazReadMore_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazResponsiveMenu/_main.vue?vue&type=template&id=7b86cbed&
var _mainvue_type_template_id_7b86cbed_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "maz-base-component maz-responsive-menu maz-flex maz-align-center"
    },
    [
      _c(
        "button",
        {
          ref: "button-open",
          staticClass: "maz-btn maz-btn--primary--outline maz-btn--icon",
          on: {
            click: function($event) {
              _vm.open = !_vm.open
            }
          }
        },
        [
          _c("i", { staticClass: "material-icons" }, [
            _vm._v("\n      menu\n    ")
          ])
        ]
      ),
      _c("transition", { attrs: { name: "maz-slide" } }, [
        _vm.open
          ? _c(
              "div",
              {
                directives: [
                  {
                    name: "closable",
                    rawName: "v-closable",
                    value: {
                      exclude: ["button-open"],
                      handler: "close"
                    },
                    expression:
                      "{\n        exclude: ['button-open'],\n        handler: 'close'\n      }"
                  }
                ],
                staticClass:
                  "maz-responsive-menu-collapse maz-flex maz-direction-column maz-border-radius"
              },
              _vm._l(_vm.routes, function(ref, i) {
                var name = ref.name
                var label = ref.label
                return _c(
                  "router-link",
                  {
                    key: "routes-" + i,
                    staticClass:
                      "maz-responsive-menu-collapse__items maz-dots-text",
                    attrs: { to: { name: name } },
                    nativeOn: {
                      click: function($event) {
                        _vm.open = false
                      }
                    }
                  },
                  [_vm._v("\n        " + _vm._s(label) + "\n      ")]
                )
              }),
              1
            )
          : _vm._e()
      ])
    ],
    1
  )
}
var _mainvue_type_template_id_7b86cbed_staticRenderFns = []
_mainvue_type_template_id_7b86cbed_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazResponsiveMenu/_main.vue?vue&type=template&id=7b86cbed&

// CONCATENATED MODULE: ./packages/directives/v-closable/index.js
var handleOutsideClick;
/* harmony default export */ var v_closable = ({
  bind: function bind(el, binding, vnode) {
    // Here's the click/touchstart handler
    // (it is registered below)
    handleOutsideClick = function handleOutsideClick(e) {
      e.stopPropagation(); // Get the handler method name and the exclude array
      // from the object used in v-closable

      var _binding$value = binding.value,
          handler = _binding$value.handler,
          exclude = _binding$value.exclude; // This variable indicates if the clicked element is excluded

      var clickedOnExcludedEl = false;

      if (exclude && exclude.length) {
        exclude.forEach(function (refName) {
          // We only run this code if we haven't detected
          // any excluded element yet
          if (!clickedOnExcludedEl) {
            // Get the element using the reference name
            var excludedEl = vnode.context.$refs[refName]; // See if this excluded element
            // is the same element the user just clicked on

            clickedOnExcludedEl = excludedEl.contains(e.target);
          }
        });
      } // We check to see if the clicked element is not
      // the dialog element and not excluded


      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        // If the clicked element is outside the dialog
        // and not the button, then call the outside-click handler
        // from the same component this directive is used in
        vnode.context[handler]();
      }
    }; // Register click/touchstart event listeners on the whole page


    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
  },
  unbind: function unbind() {
    // If the element that has v-closable is removed, then
    // unbind click/touchstart listeners from the whole page
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('touchstart', handleOutsideClick);
  }
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazResponsiveMenu/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var MazResponsiveMenu_mainvue_type_script_lang_js_ = ({
  name: 'MazResponsiveMenu',
  directives: {
    closable: v_closable
  },
  props: {
    routes: {
      type: Array,
      required: true
    }
  },
  data: function data() {
    return {
      open: false
    };
  },
  methods: {
    close: function close() {
      if (this.open) {
        this.open = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazResponsiveMenu/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazResponsiveMenu_mainvue_type_script_lang_js_ = (MazResponsiveMenu_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazResponsiveMenu/_main.vue





/* normalize component */

var MazResponsiveMenu_main_component = normalizeComponent(
  components_MazResponsiveMenu_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_7b86cbed_render,
  _mainvue_type_template_id_7b86cbed_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazResponsiveMenu_main_api; }
MazResponsiveMenu_main_component.options.__file = "packages/components/MazResponsiveMenu/_main.vue"
/* harmony default export */ var MazResponsiveMenu_main = (MazResponsiveMenu_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazResponsiveMenu/index.js


MazResponsiveMenu_main.install = function (Vue) {
  Vue.component(MazResponsiveMenu_main.name, MazResponsiveMenu_main);
};

/* harmony default export */ var MazResponsiveMenu = (MazResponsiveMenu_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSearch/_main.vue?vue&type=template&id=c5d051bc&
var _mainvue_type_template_id_c5d051bc_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-search",
      class: [
        { "maz-is-dark": _vm.dark },
        "maz-search--" + _vm.color,
        "maz-search--" + _vm.size
      ],
      on: {
        "!blur": function($event) {
          return _vm.closeList($event)
        }
      }
    },
    [
      _c(
        "MazInput",
        _vm._b(
          {
            ref: "textField",
            attrs: {
              color: _vm.color,
              loading: _vm.loading,
              debounce: _vm.debounce,
              size: _vm.size
            },
            on: {
              input: _vm.inputEvent,
              keydown: _vm.keyboardNav,
              focus: _vm.openList,
              keyup: function($event) {
                return _vm.$emit("keyup", $event)
              },
              change: function($event) {
                return _vm.$emit("change", $event)
              },
              clear: function($event) {
                return _vm.$emit("clear", $event)
              },
              blur: function($event) {
                return _vm.$emit("blur", $event)
              },
              paste: function($event) {
                return _vm.$emit("paste", $event)
              },
              click: function($event) {
                return _vm.$emit("click", $event)
              }
            },
            model: {
              value: _vm.query,
              callback: function($$v) {
                _vm.query = $$v
              },
              expression: "query"
            }
          },
          "MazInput",
          _vm.$attrs,
          false
        ),
        [
          _vm._t("icon-left", null, { slot: "icon-left" }),
          _vm._t("icon-right", null, { slot: "icon-right" })
        ],
        2
      ),
      _c("transition", { attrs: { name: "maz-slide" } }, [
        _vm.hasListOpen
          ? _c(
              "div",
              { ref: "itemsList", staticClass: "maz-search__items" },
              [
                _vm._l(_vm.items, function(item, i) {
                  return _c(
                    "button",
                    {
                      key: i,
                      ref: "item",
                      refInFor: true,
                      staticClass: "maz-search__items__item",
                      class: [
                        {
                          selected:
                            _vm.value ===
                            (_vm.itemValue
                              ? _vm.getItemQuery(_vm.itemValue, item)
                              : item)
                        },
                        { "keyboard-selected": _vm.tmpValue === item }
                      ],
                      attrs: { type: "button", tabindex: "-1" },
                      on: {
                        click: function($event) {
                          $event.stopPropagation()
                          return _vm.updateValue(item)
                        }
                      }
                    },
                    [
                      _vm._t(
                        "default",
                        [
                          _c("p", [
                            _vm._v(
                              _vm._s(
                                _vm.itemText
                                  ? _vm.getItemQuery(_vm.itemText, item)
                                  : item
                              )
                            )
                          ])
                        ],
                        { item: item, tag: "div" }
                      )
                    ],
                    2
                  )
                }),
                _vm.hasNoDataSlot
                  ? _vm._t(
                      "no-data",
                      [
                        _c(
                          "div",
                          {
                            staticClass:
                              "maz-search__no-data maz-p-2 maz-flex maz-flex-center"
                          },
                          [
                            _c(
                              "i",
                              { staticClass: "material-icons maz-text-danger" },
                              [_vm._v("\n            search_off\n          ")]
                            )
                          ]
                        )
                      ],
                      { tag: "div" }
                    )
                  : _vm._e()
              ],
              2
            )
          : _vm._e()
      ])
    ],
    1
  )
}
var _mainvue_type_template_id_c5d051bc_staticRenderFns = []
_mainvue_type_template_id_c5d051bc_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSearch/_main.vue?vue&type=template&id=c5d051bc&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSearch/_main.vue?vue&type=script&lang=js&
function MazSearch_mainvue_type_script_lang_js_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MazSearch_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return typeof obj; }; } else { MazSearch_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MazSearch_mainvue_type_script_lang_js_typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var resolve = function resolve(path, obj) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce(function (prev, curr) {
    return prev && prev[curr];
  }, obj);
};
/**
 * > UI search input component. The search component extends MazInput, so all props/options of [MazInput](/documentation/maz-input) are available here.
 */


/* harmony default export */ var MazSearch_mainvue_type_script_lang_js_ = ({
  name: 'MazSearch',
  components: {
    MazInput: MazInput
  },
  props: {
    // Is the value return when you select an item
    value: {
      validator: function validator(prop) {
        return ['string', 'number', 'boolean', 'object', 'array'].includes(MazSearch_mainvue_type_script_lang_js_typeof(prop)) || prop === null;
      },
      required: true
    },
    // set the initial query input value (will emit "request" event on created)
    initialQuery: {
      type: String,
      default: null
    },
    // Array of your results request
    items: {
      type: Array,
      default: null
    },
    // It's a key name of your result object to be returned in the model
    itemValue: {
      type: String,
      default: null
    },
    // It's a key name of your result object to be shown in the list
    itemText: {
      type: String,
      default: null
    },
    // Enable or disable the `dark-mode`
    dark: {
      type: Boolean,
      default: false
    },
    // to show `no-data` slot (when you request has no results)
    noData: {
      type: Boolean,
      default: false
    },
    // Choose your color
    color: {
      type: String,
      default: 'primary'
    },
    // To open the list
    open: {
      type: Boolean,
      default: false
    },
    // Add loading effect to input
    loading: {
      type: Boolean,
      default: false
    },
    // Replace the query typed by the "item text" selected in list
    replaceOnSelect: {
      type: Boolean,
      default: false
    },
    // Clear query typed on select
    clearOnSelect: {
      type: Boolean,
      default: false
    },
    // remove debounce before send request
    debounce: {
      type: Boolean,
      default: true
    },
    // input size
    size: {
      type: String,
      default: 'md'
    }
  },
  data: function data() {
    return {
      query: this.initialQuery,
      listOpen: false,
      tmpValue: null,
      inDebounce: false
    };
  },
  computed: {
    tmpValueIndex: function tmpValueIndex() {
      var _this = this;

      return this.items.findIndex(function (c) {
        return c === _this.tmpValue;
      });
    },
    selectedValueIndex: function selectedValueIndex() {
      var _this2 = this;

      var itemValue = this.itemValue,
          items = this.items,
          value = this.value,
          getItemQuery = this.getItemQuery;
      return value && items && items.length ? items.findIndex(function (c) {
        return (itemValue ? getItemQuery(itemValue, c) : c) === _this2.value;
      }) : null;
    },
    hasEmptyQuery: function hasEmptyQuery() {
      return this.query === null || this.query === '';
    },
    hasNoDataSlot: function hasNoDataSlot() {
      return (!this.items || !this.items.length) && !this.hasEmptyQuery && this.noData && !this.inDebounce && !this.loading;
    },
    hasListOpen: function hasListOpen() {
      return this.open || this.listOpen;
    }
  },
  watch: {
    query: function query(oldValue, newValue) {
      if (oldValue !== newValue && !this.hasListOpen && !this.hasEmptyQuery) this.openList();
    }
  },
  created: function created() {
    if (this.initialQuery) this.inputEvent(this.initialQuery);
  },
  methods: {
    getItemQuery: function getItemQuery(query, item) {
      return resolve(query, item);
    },
    openList: function openList(e) {
      this.$emit('focus', e);
      this.listOpen = true;
      if (this.value) this.scrollToSelectedOnFocus(this.selectedValueIndex);
    },
    closeList: function closeList() {
      var _this3 = this;

      setTimeout(function () {
        _this3.listOpen = false;
      }, 300);
    },
    updateValue: function updateValue(item) {
      var itemValue = this.itemValue,
          itemText = this.itemText,
          replaceOnSelect = this.replaceOnSelect,
          clearOnSelect = this.clearOnSelect,
          getItemQuery = this.getItemQuery;
      var valueReturned = itemValue ? getItemQuery(itemValue, item) : item; // event sent when user select an item in the items list
      // @arg The argument is a the item or an item[key] if you use `item-value`

      this.$emit('input', valueReturned);

      if (replaceOnSelect) {
        this.query = itemText ? getItemQuery(itemText, item) : JSON.stringify(item);
      } else if (clearOnSelect) {
        this.query = null;
      }

      this.closeList();
    },
    inputEvent: function inputEvent(q) {
      this.$emit('request', q);
    },
    scrollToSelectedOnFocus: function scrollToSelectedOnFocus(arrayIndex) {
      var _this4 = this;

      this.$nextTick(function () {
        var itemHeight = _this4.$refs.item && _this4.$refs.item[0] && _this4.$refs.item[0].clientHeight;
        if (_this4.$refs.itemsList) _this4.$refs.itemsList.scrollTop = arrayIndex * itemHeight - itemHeight;
      });
    },
    keyboardNav: function keyboardNav(e) {
      this.$emit('keydown', e);
      if (!Array.isArray(this.items) || !this.items.length) return;
      var code = e.keyCode;

      if (code === 40 || code === 38) {
        if (!this.hasListOpen) this.openList();
        var index = code === 40 ? this.tmpValueIndex + 1 : this.tmpValueIndex - 1;

        if (index === -1 || index >= this.items.length) {
          index = index === -1 ? this.items.length - 1 : 0;
        }

        this.tmpValue = this.items[index];
        this.scrollToSelectedOnFocus(index);
      } else if (code === 13) {
        // enter key
        e.preventDefault();
        this.hasListOpen ? this.updateValue(this.tmpValue) : this.openList();
      } else if (code === 27) {
        // escape key
        this.closeList();
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazSearch/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazSearch_mainvue_type_script_lang_js_ = (MazSearch_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazSearch/_main.vue





/* normalize component */

var MazSearch_main_component = normalizeComponent(
  components_MazSearch_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_c5d051bc_render,
  _mainvue_type_template_id_c5d051bc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazSearch_main_api; }
MazSearch_main_component.options.__file = "packages/components/MazSearch/_main.vue"
/* harmony default export */ var MazSearch_main = (MazSearch_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazSearch/index.js


MazSearch_main.install = function (Vue) {
  Vue.component(MazSearch_main.name, MazSearch_main);
};

/* harmony default export */ var MazSearch = (MazSearch_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSidebar/_main.vue?vue&type=template&id=3dababc4&
var _mainvue_type_template_id_3dababc4_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-sidebar",
      class: {
        "maz-is-dark": _vm.dark
      },
      on: {
        mouseover: function($event) {
          _vm.isHover = true
        },
        mouseleave: function($event) {
          _vm.isHover = false
        }
      }
    },
    [
      _c(
        "div",
        {
          ref: "MazSidebar",
          staticClass:
            "maz-sidebar__wrapper maz-flex maz-flex-fixed maz-m-h-100 maz-mh-100",
          class: {
            "is-close": !_vm.isOpen,
            "is-absolute": _vm.absolute,
            "has-shadow": !_vm.noShadow,
            "is-right": _vm.right,
            "is-mini": _vm.mini
          },
          style: [_vm.wrapperStyle],
          attrs: { id: _vm.uniqueId }
        },
        [
          _c("transition", { attrs: { name: "fade", mode: "in-out" } }, [
            _c(
              "div",
              {
                staticClass:
                  "maz-sidebar__wrapper__content maz-flex maz-flex-1 maz-w-100 maz-direction-column"
              },
              [_vm._t("default", null, { isOpen: _vm.isOpen })],
              2
            )
          ]),
          _vm.hasCloseBtn
            ? _c("div", { staticClass: "maz-sidebar__wrapper__close-btn" }, [
                _c(
                  "button",
                  {
                    staticClass: "maz-flex maz-flex-center",
                    on: {
                      click: function($event) {
                        _vm.isOpen = !_vm.isOpen
                      }
                    }
                  },
                  [
                    _vm._t("button-icon", [
                      _c("ArrowIcon", {
                        attrs: { orientation: _vm.isOpen ? "left" : "right" }
                      })
                    ])
                  ],
                  2
                )
              ])
            : _vm._e(),
          _vm.loading && _vm.isOpen
            ? _c(
                "div",
                {
                  staticClass:
                    "maz-sidebar__wrapper__load-layer maz-flex maz-flex-center"
                },
                [_vm._t("content-loader", [_c("MazLoader")])],
                2
              )
            : _vm._e()
        ],
        1
      ),
      _vm.layer && _vm.isOpen
        ? _c("div", {
            staticClass: "maz-sidebar__wrapper__opacity-layer",
            on: {
              click: function($event) {
                _vm.isOpen = false
              }
            }
          })
        : _vm._e()
    ]
  )
}
var _mainvue_type_template_id_3dababc4_staticRenderFns = []
_mainvue_type_template_id_3dababc4_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSidebar/_main.vue?vue&type=template&id=3dababc4&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSidebar/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/**
 * Generic component used to show a togglable sidebar (left or right) in the layout
 * @module component - MazSidebar
 * @param {boolean} loading - Show / hide the loader inside the sidebar component
 * @param {number} width - The sidebar width
 * @param {boolean} [noCloseBtn=false] - Specify if the sidebar should have or not the toggle button
 * @param {boolean} [noShadow=false] - Specify if the sidebar should have the drop shadow
 * @param {boolean} [absolute=false] - Specify if the sidebar should be positionned in an absolute way.
 * @param {boolean} [isOpen=false] - Is the sidebar open or not
 * @param {boolean} [right=false] - Specify the sidebar direction, by default the sidebar is positionned in the left side.
 * @param {boolean} [dark=false] - Specify the dark mode
 * @param {boolean} [layer=false] - Add layer under content, click on it to close sidebar
 * @param {boolean} [mini=false] - Add layer under content, click on it to close sidebar
 * @param {number} [miniSize=60] - Mini width
 * @param {boolean} [expandOnHover=false] - With mini, open expand sidebar on hover
 * @emits toggle-menu
 */

/* harmony default export */ var MazSidebar_mainvue_type_script_lang_js_ = ({
  name: 'MazSidebar',
  components: {
    MazLoader: MazLoader,
    ArrowIcon: ArrowIcon
  },
  mixins: [uniqueId],
  props: {
    // Boolean to open or not the sidebar
    value: {
      type: Boolean,
      default: false
    },
    // set id of sidebar
    id: {
      type: String,
      default: null
    },
    // Size bar width
    width: {
      type: Number,
      default: 300
    },
    // Show loading layer
    loading: {
      type: Boolean,
      default: false
    },
    // So that the user cannot close the sidebar
    noCloseBtn: {
      type: Boolean,
      default: false
    },
    // Remove shadow UI
    noShadow: {
      type: Boolean,
      default: false
    },
    // the sidebar goes over the content
    absolute: {
      type: Boolean,
      default: false
    },
    // Must be activated if you want to integrate it on the right side
    right: {
      type: Boolean,
      default: false
    },
    // Dark mode
    dark: {
      type: Boolean,
      default: false
    },
    // Gray layer above the content, if you click on it, the side bar closes
    layer: {
      type: Boolean,
      default: false
    },
    // reduces the size of the sidebar width when she is closed
    mini: {
      type: Boolean,
      default: false
    },
    // width size of sidebar with mini mode
    miniWidth: {
      type: Number,
      default: 60
    },
    // expand sidebar on hover (only with mini option)
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      isHover: false,
      open: this.value
    };
  },
  computed: {
    isOpen: {
      get: function get() {
        var open = this.open,
            isHover = this.isHover,
            hasExpandOnHover = this.hasExpandOnHover;
        var showOnExpend = hasExpandOnHover ? isHover : false;
        return open || showOnExpend;
      },
      set: function set(value) {
        // return a `true` or `false` if the sidebar is open or not
        // @arg Boolean
        this.$emit('input', value);
        this.open = value;
      }
    },
    hasExpandOnHover: function hasExpandOnHover() {
      var expandOnHover = this.expandOnHover,
          mini = this.mini;
      return expandOnHover && mini;
    },
    hasCloseBtn: function hasCloseBtn() {
      var noCloseBtn = this.noCloseBtn,
          hasExpandOnHover = this.hasExpandOnHover;
      return !noCloseBtn && !hasExpandOnHover;
    },
    wrapperStyle: function wrapperStyle() {
      var mini = this.mini,
          width = this.width,
          isOpen = this.isOpen,
          layer = this.layer,
          miniWidth = this.miniWidth;
      var widthSize = mini ? miniWidth : 0;
      return {
        width: "".concat(isOpen ? width : widthSize, "px"),
        flex: "0 0 ".concat(isOpen ? width : widthSize, "px"),
        zIndex: isOpen && layer ? 1040 : 1030
      };
    }
  },
  watch: {
    value: function value(val) {
      this.open = val;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazSidebar/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazSidebar_mainvue_type_script_lang_js_ = (MazSidebar_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazSidebar/_main.vue





/* normalize component */

var MazSidebar_main_component = normalizeComponent(
  components_MazSidebar_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_3dababc4_render,
  _mainvue_type_template_id_3dababc4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazSidebar_main_api; }
MazSidebar_main_component.options.__file = "packages/components/MazSidebar/_main.vue"
/* harmony default export */ var MazSidebar_main = (MazSidebar_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazSidebar/index.js


MazSidebar_main.install = function (Vue) {
  Vue.component(MazSidebar_main.name, MazSidebar_main);
};

/* harmony default export */ var MazSidebar = (MazSidebar_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSlider/_main.vue?vue&type=template&id=13a411ca&
var _mainvue_type_template_id_13a411ca_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-slider",
      class: ["maz-slider--" + _vm.color],
      style: [_vm.wrapperStyle],
      on: {
        mousemove: _vm.handleMousemove,
        mouseup: _vm.handleMouseup,
        mouseleave: _vm.handleMouseup
      }
    },
    [
      _c(
        "div",
        {
          ref: "MazSlider",
          staticClass: "maz-slider__bar maz-flex maz-flex-center",
          style: [_vm.barStyle],
          attrs: { role: "slider" }
        },
        [
          _vm._l(_vm.dividers, function(div, i) {
            return _c("div", {
              key: "divider-" + i,
              staticClass: "maz-slider__divider",
              style: [_vm.dividers[i]]
            })
          }),
          _vm._l(_vm.computedValue, function(btn, i) {
            return _c(
              "button",
              {
                key: "cursor-" + i,
                ref: "Cursor",
                refInFor: true,
                staticClass:
                  "maz-slider__btn maz-flex maz-flex-center maz-bg-color-light",
                class: {
                  "active-cursor": i === _vm.activeCursor && !_vm.noCursorAnim
                },
                style: [_vm.buttonStyles[i]],
                attrs: { type: "button", "data-label": _vm.getLabel(i) },
                on: {
                  mousedown: function($event) {
                    return _vm.handleMousedown($event, i)
                  },
                  focus: function($event) {
                    return _vm.handleMousedown($event, i)
                  },
                  blur: function($event) {
                    return _vm.blurCursor(i)
                  },
                  keydown: function($event) {
                    return _vm.cursorKeyDown($event, i)
                  }
                }
              },
              [
                i === _vm.activeCursor && !_vm.noCursorAnim
                  ? _c("ArrowIcon", {
                      attrs: { orientation: "left", size: _vm.sizeValue * 2 }
                    })
                  : _vm._e(),
                _c("span", { staticClass: "maz-text-color" }, [
                  _vm._v("\n        " + _vm._s(_vm.tmpValues[i]) + "\n      ")
                ]),
                i === _vm.activeCursor && !_vm.noCursorAnim
                  ? _c("ArrowIcon", {
                      attrs: { orientation: "right", size: _vm.sizeValue * 2 }
                    })
                  : _vm._e()
              ],
              1
            )
          })
        ],
        2
      )
    ]
  )
}
var _mainvue_type_template_id_13a411ca_staticRenderFns = []
_mainvue_type_template_id_13a411ca_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSlider/_main.vue?vue&type=template&id=13a411ca&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSlider/_main.vue?vue&type=script&lang=js&


function MazSlider_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function MazSlider_mainvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { MazSlider_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { MazSlider_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function MazSlider_mainvue_type_script_lang_js_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MazSlider_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return typeof obj; }; } else { MazSlider_mainvue_type_script_lang_js_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MazSlider_mainvue_type_script_lang_js_typeof(obj); }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var getOpacityCoeff = function getOpacityCoeff(index, middle, length) {
  var currentIndex = index + 1;
  var isBiggerThanMiddle = middle < currentIndex;
  var deviation = isBiggerThanMiddle ? currentIndex - middle : middle - currentIndex;
  return 100 / length * deviation / 100;
};

var isBetween = function isBetween(value, prev, next, direction) {
  return direction === 'minus' ? prev ? value >= prev : true : next ? value <= next : true;
};

/* harmony default export */ var MazSlider_mainvue_type_script_lang_js_ = ({
  name: 'MazSlider',
  components: {
    ArrowIcon: ArrowIcon
  },
  props: {
    // Array of cursors values
    value: {
      required: true,
      validator: function validator(prop) {
        return ['number'].includes(MazSlider_mainvue_type_script_lang_js_typeof(prop)) || Array.isArray(prop) || prop === null;
      }
    },
    // array of cursors label
    labels: {
      type: Array,
      default: null
    },
    // min value of sliders
    min: {
      type: Number,
      default: 0
    },
    // max value of sliders
    max: {
      type: Number,
      default: 100
    },
    // height size of slider bar
    size: {
      type: Number,
      default: 8
    },
    // remove div in different colors
    noDivider: {
      type: Boolean,
      default: false
    },
    // become a logarithmic slider (exponential)
    log: {
      type: Boolean,
      default: false
    },
    // main slider color
    color: {
      type: String,
      default: 'primary'
    },
    // disables cursor animation when active
    noCursorAnim: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      activeCursor: null,
      buttonPositions: [],
      buttonStyles: [],
      tmpValues: null,
      dividers: []
    };
  },
  computed: {
    computedValue: function computedValue() {
      var value = this.value;
      return typeof value === 'number' ? [value] : value ? value : [0];
    },
    minLog: function minLog() {
      return Math.log(this.min || 1);
    },
    maxLog: function maxLog() {
      return Math.log(this.max);
    },
    scale: function scale() {
      var minLog = this.minLog,
          maxLog = this.maxLog,
          min = this.min,
          max = this.max;
      return (maxLog - minLog) / (max - min);
    },
    range: function range() {
      var min = this.min,
          max = this.max;
      return max - min;
    },
    sizeValue: function sizeValue() {
      var size = this.size;
      return size < 8 ? 8 : size;
    },
    buttonSize: function buttonSize() {
      var size = this.sizeValue;
      return {
        height: size * 2
      };
    },
    barStyle: function barStyle() {
      var size = this.size,
          sizeValue = this.sizeValue;
      return {
        height: "".concat(size, "px"),
        fontSize: "".concat(sizeValue, "px")
      };
    },
    wrapperStyle: function wrapperStyle() {
      var labels = this.labels,
          sizeValue = this.sizeValue,
          noCursorAnim = this.noCursorAnim;
      return {
        padding: "".concat(sizeValue * 1.5, "px ").concat(sizeValue * (noCursorAnim ? 2 : 5.5), "px"),
        paddingTop: labels ? "".concat(sizeValue * 4, "px") : "".concat(sizeValue * 1.5, "px")
      };
    },
    hasMultipleValues: function hasMultipleValues() {
      return Array.isArray(this.value);
    }
  },
  watch: {
    value: {
      handler: function handler() {
        this.tmpValues = this.computedValue;
      },
      immediate: true
    }
  },
  mounted: function mounted() {
    var buildComponent = this.buildComponent;
    buildComponent(true);
    window.addEventListener('resize', buildComponent); // watch multiples values

    this.$watch(function (vm) {
      return [vm.computedValue, vm.min, vm.max, vm.sizeValue, vm.log].join();
    }, function () {
      buildComponent(true);
    });
  },
  destroyed: function destroyed() {
    var buildComponent = this.buildComponent;
    window.removeEventListener('resize', buildComponent);
  },
  methods: {
    cursorKeyDown: function cursorKeyDown(e, i) {
      // ArrowLeft
      if (e.keyCode === 37) {
        e.preventDefault();

        if (isBetween(this.tmpValues[i] - 1, this.tmpValues[i - 1], this.tmpValues[i + 1], 'minus')) {
          this.tmpValues[i]--;
          this.emitValue(this.tmpValues);
        }
      } // ArrowRight


      if (e.keyCode === 39) {
        e.preventDefault();

        if (isBetween(this.tmpValues[i] + 1, this.tmpValues[i - 1], this.tmpValues[i + 1], 'plus')) {
          this.tmpValues[i]++;
          this.emitValue(this.tmpValues);
        }
      }
    },
    blurCursor: function blurCursor(i) {
      this.activeCursor = null;
      this.setBtnStyle(i);
    },
    buildComponent: function buildComponent(emitValue) {
      var _this = this;

      return MazSlider_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(emitValue === true)) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return _this.checkValues();

              case 3:
                _context.next = 5;
                return _this.calcPos();

              case 5:
                _context.next = 7;
                return _this.$nextTick();

              case 7:
                _this.computedValue.forEach(function (b, i) {
                  return _this.setBtnDividers(i);
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    checkValues: function checkValues() {
      var _this2 = this;

      return MazSlider_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
        var min, max, computedValue, valuesChecked;
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // check if values are not below the min or above the max
                min = _this2.min, max = _this2.max, computedValue = _this2.computedValue;
                valuesChecked = computedValue.map(function (v) {
                  return v < min ? min : v > max ? max : v;
                });

                _this2.emitValue(valuesChecked);

                _this2.tmpValues = valuesChecked;

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    emitValue: function emitValue(values) {
      var hasMultipleValues = this.hasMultipleValues;
      var valueToEmit = hasMultipleValues ? values.slice() : values[0];
      this.$emit('input', valueToEmit);
    },
    getLabel: function getLabel(i) {
      var labels = this.labels;
      return labels ? labels[i] : null;
    },
    setBtnDividers: function setBtnDividers(i) {
      this.setBtnStyle(i);
      if (!this.noDivider) this.setDividers();
    },
    setBtnStyle: function setBtnStyle(i) {
      var _this3 = this;

      return MazSlider_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee3() {
        var height, buttonPositions, noCursorAnim, Cursor, width, isActive, btnStyle;
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this3.$nextTick();

              case 2:
                height = _this3.buttonSize.height;
                buttonPositions = _this3.buttonPositions, noCursorAnim = _this3.noCursorAnim;
                Cursor = _this3.$refs.Cursor; // get width of text in cursor + padding/space

                width = Cursor[i].querySelector('span').clientWidth + 16;
                isActive = i === _this3.activeCursor;
                btnStyle = {
                  // 16 = space for arrows
                  width: "".concat(isActive && !noCursorAnim ? width + 16 : width, "px"),
                  height: "".concat(height, "px"),
                  left: "".concat(buttonPositions[i] - width / 2, "px")
                };

                _this3.$set(_this3.buttonStyles, i, btnStyle);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    setDividers: function setDividers() {
      var buttonPositions = this.buttonPositions; // remove getters/setters of vue

      var base = buttonPositions.slice(); // add an item to generate one more divider

      base.push(0);
      var baseLength = base.length;
      var middle = Math.round(baseLength / 2); // generate dividers items with style

      this.dividers = base.map(function (pos, i) {
        return {
          left: "".concat(i === 0 ? 0 : buttonPositions[i - 1], "px"),
          right: "".concat(i + 1 === baseLength ? 0 : 'calc( 100% - ' + pos + 'px )'),
          backgroundColor: middle === i + 1 ? null : i < middle // ligthen
          ? "rgba(255, 255, 255, ".concat(getOpacityCoeff(i, middle, baseLength), ")") // darken
          : "rgba(0, 0, 0, ".concat(getOpacityCoeff(i, middle, baseLength), ")")
        };
      });
    },
    calcPos: function calcPos() {
      var _this4 = this;

      return MazSlider_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee4() {
        var MazSlider, tmpValues, min, scale, range, minLog, max, log, barWidth;
        return regenerator_default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this4.$nextTick();

              case 2:
                MazSlider = _this4.$refs.MazSlider;
                tmpValues = _this4.tmpValues, min = _this4.min, scale = _this4.scale, range = _this4.range, minLog = _this4.minLog, max = _this4.max, log = _this4.log;
                barWidth = MazSlider.clientWidth;
                _this4.buttonPositions = tmpValues.map(function (v) {
                  return log ? barWidth / max * (min + (Math.log(v) - minLog) / scale) : barWidth / range * (v - min);
                });

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    getCursorsValues: function getCursorsValues() {
      var _this5 = this;

      return MazSlider_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee5() {
        var range, scale, buttonPositions, max, min, minLog, log, barWidth;
        return regenerator_default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _this5.$nextTick();

              case 2:
                range = _this5.range, scale = _this5.scale, buttonPositions = _this5.buttonPositions, max = _this5.max, min = _this5.min, minLog = _this5.minLog, log = _this5.log;
                barWidth = _this5.$refs.MazSlider.clientWidth;
                return _context5.abrupt("return", log ? buttonPositions.map(function (pos) {
                  var position = pos / (barWidth / max);
                  var value = Math.exp((position - min) * scale + minLog);
                  return Math.round(value);
                }) : buttonPositions.map(function (pos) {
                  return Math.round(pos / (barWidth / range)) + min;
                }));

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    handleMousedown: function handleMousedown(e, i) {
      e.preventDefault();
      if (this.activeCursor !== null) return;
      this.activeCursor = i;
      this.setBtnDividers(i);
    },
    handleMouseup: function handleMouseup() {
      var _this6 = this;

      return MazSlider_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee6() {
        var activeCursor, getCursorsValues, values;
        return regenerator_default.a.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                activeCursor = _this6.activeCursor, getCursorsValues = _this6.getCursorsValues;

                if (!(activeCursor === null)) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt("return");

              case 3:
                _context6.next = 5;
                return getCursorsValues();

              case 5:
                values = _context6.sent;

                // emit values of cursors
                // @arg array of numbers
                _this6.emitValue(values);

                _this6.activeCursor = null;

                _this6.setBtnDividers(activeCursor);

              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    handleMousemove: function handleMousemove(e) {
      var _this7 = this;

      return MazSlider_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee7() {
        var activeCursor, buttonPositions, getCursorsValues, barWidth, position, prevValue, nextValue;
        return regenerator_default.a.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return _this7.$nextTick();

              case 2:
                activeCursor = _this7.activeCursor, buttonPositions = _this7.buttonPositions, getCursorsValues = _this7.getCursorsValues;

                if (!(activeCursor === null)) {
                  _context7.next = 5;
                  break;
                }

                return _context7.abrupt("return");

              case 5:
                _context7.next = 7;
                return getCursorsValues();

              case 7:
                _this7.tmpValues = _context7.sent;
                barWidth = _this7.$refs.MazSlider.clientWidth;
                position = buttonPositions[activeCursor];
                prevValue = buttonPositions[activeCursor - 1] || 0;
                nextValue = buttonPositions[activeCursor + 1] || barWidth;

                buttonPositions[activeCursor] = function () {
                  var pos = position + e.movementX;

                  if (pos < prevValue) {
                    return prevValue;
                  } else if (pos > nextValue) {
                    return nextValue;
                  }

                  return pos;
                }();

                _this7.setBtnDividers(activeCursor);

                _this7.buttonPositions = buttonPositions;

              case 15:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }))();
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazSlider/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazSlider_mainvue_type_script_lang_js_ = (MazSlider_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazSlider/_main.vue





/* normalize component */

var MazSlider_main_component = normalizeComponent(
  components_MazSlider_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_13a411ca_render,
  _mainvue_type_template_id_13a411ca_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazSlider_main_api; }
MazSlider_main_component.options.__file = "packages/components/MazSlider/_main.vue"
/* harmony default export */ var MazSlider_main = (MazSlider_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazSlider/index.js


MazSlider_main.install = function (Vue) {
  Vue.component(MazSlider_main.name, MazSlider_main);
};

/* harmony default export */ var components_MazSlider = (MazSlider_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazStepper/_main.vue?vue&type=template&id=274438f9&
var _mainvue_type_template_id_274438f9_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "maz-base-component maz-stepper maz-flex maz-w-100",
      class: [
        {
          "maz-is-dark": _vm.dark
        },
        "maz-stepper--" + _vm.color,
        "maz-space-" + _vm.space
      ]
    },
    _vm._l(_vm.stepsNumber, function(step, i) {
      return _c(
        "MazBtn",
        {
          key: i,
          staticClass: "maz-stepper__step maz-flex maz-flex-center",
          class: [
            {
              "is-active": step === _vm.value
            },
            "maz-stepper__step--" + _vm.variant
          ],
          style: [_vm.stepStyle],
          attrs: {
            "no-shadow": !_vm.shadow,
            color: _vm.color,
            disabled: _vm.isDisabled(step, _vm.value) && step !== _vm.value
          },
          on: {
            click: function($event) {
              _vm.disabled ? null : _vm.emitStep(step)
            }
          }
        },
        [
          _vm.showStepNumber
            ? _c("span", { staticClass: "maz-stepper__step__number" }, [
                _vm._v(_vm._s(step))
              ])
            : _vm._e()
        ]
      )
    }),
    1
  )
}
var _mainvue_type_template_id_274438f9_staticRenderFns = []
_mainvue_type_template_id_274438f9_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazStepper/_main.vue?vue&type=template&id=274438f9&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazStepper/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var MazStepper_mainvue_type_script_lang_js_ = ({
  name: 'MazStepper',
  components: {
    MazBtn: MazBtn
  },
  props: {
    // value of active step
    value: {
      type: Number,
      required: true
    },
    // steps number
    steps: {
      type: Number,
      default: 1
    },
    // choose a color from list
    color: {
      type: String,
      default: 'primary'
    },
    // If is `true`, item number is shown
    showStepNumber: {
      type: Boolean,
      default: false
    },
    // flexbox space (`around`, `between`)
    space: {
      type: String,
      default: 'around'
    },
    // step size
    size: {
      type: Number,
      default: 10
    },
    // step style (`dot`, `square`)
    variant: {
      type: String,
      default: 'dot'
    },
    // add shadow elevation to step buttons
    shadow: {
      type: Boolean,
      default: false
    },
    // disallow step click
    disabled: {
      type: Boolean,
      default: false
    },
    // disallow multiple steps click
    disabledSteps: {
      type: Array,
      default: Array
    },
    // disallow next steps from current step
    disabledNextSteps: {
      type: Boolean,
      default: false
    },
    // disallow previous steps from current step
    disabledPreviousSteps: {
      type: Boolean,
      default: false
    },
    // set dark mode
    dark: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    stepsNumber: function stepsNumber() {
      var steps = this.steps;
      return Array.from({
        length: steps
      }, function (x, i) {
        return i + 1;
      });
    },
    stepStyle: function stepStyle() {
      var size = this.size;
      return {
        height: "".concat(size, "px"),
        width: "".concat(size, "px"),
        fontSize: "".concat(size / 1.5, "px")
      };
    }
  },
  methods: {
    emitStep: function emitStep(step) {
      // return the step number clicked
      // @arg `Number`
      this.$emit('input', step);
    },
    isDisabled: function isDisabled(step) {
      var disabled = this.disabled,
          disabledSteps = this.disabledSteps,
          disabledNextSteps = this.disabledNextSteps,
          disabledPreviousSteps = this.disabledPreviousSteps,
          value = this.value;
      return disabled || disabledSteps.includes(step) || disabledNextSteps && value < step || disabledPreviousSteps && value > step;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazStepper/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazStepper_mainvue_type_script_lang_js_ = (MazStepper_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazStepper/_main.vue





/* normalize component */

var MazStepper_main_component = normalizeComponent(
  components_MazStepper_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_274438f9_render,
  _mainvue_type_template_id_274438f9_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazStepper_main_api; }
MazStepper_main_component.options.__file = "packages/components/MazStepper/_main.vue"
/* harmony default export */ var MazStepper_main = (MazStepper_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazStepper/index.js


MazStepper_main.install = function (Vue) {
  Vue.component(MazStepper_main.name, MazStepper_main);
};

/* harmony default export */ var MazStepper = (MazStepper_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSwitch/_main.vue?vue&type=template&id=4b0caca4&
var _mainvue_type_template_id_4b0caca4_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: "maz-base-component maz-switch maz-switch--" + _vm.color },
    [
      _c(
        "input",
        _vm._b(
          {
            staticClass: "maz-switch__input",
            attrs: {
              id: _vm.uniqueId,
              type: "checkbox",
              name: _vm.name,
              disabled: _vm.disabled
            },
            domProps: { checked: _vm.value },
            on: { change: _vm.emit }
          },
          "input",
          _vm.$attrs,
          false
        )
      ),
      _c(
        "label",
        {
          staticClass: "maz-switch__toggle",
          class: [_vm.bgColorClassTransparency],
          attrs: { for: _vm.uniqueId }
        },
        [_c("span", { class: [_vm.bgColorClass] })]
      )
    ]
  )
}
var _mainvue_type_template_id_4b0caca4_staticRenderFns = []
_mainvue_type_template_id_4b0caca4_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSwitch/_main.vue?vue&type=template&id=4b0caca4&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSwitch/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var MazSwitch_mainvue_type_script_lang_js_ = ({
  name: 'MazSwitch',
  mixins: [uniqueId],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    bgColorClassTransparency: function bgColorClassTransparency() {
      return this.value ? "maz-bg-".concat(this.color, "-before-transparency") : 'maz-bg-grey-before-transparency';
    },
    bgColorClass: function bgColorClass() {
      return this.value ? "maz-bg-".concat(this.color) : 'maz-bg-white';
    }
  },
  methods: {
    emit: function emit(e) {
      // Return the input value
      // @arg Boolean
      this.$emit('input', e.target.checked);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazSwitch/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_MazSwitch_mainvue_type_script_lang_js_ = (MazSwitch_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazSwitch/_main.vue





/* normalize component */

var MazSwitch_main_component = normalizeComponent(
  components_MazSwitch_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_4b0caca4_render,
  _mainvue_type_template_id_4b0caca4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazSwitch_main_api; }
MazSwitch_main_component.options.__file = "packages/components/MazSwitch/_main.vue"
/* harmony default export */ var MazSwitch_main = (MazSwitch_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazSwitch/index.js


MazSwitch_main.install = function (Vue) {
  Vue.component(MazSwitch_main.name, MazSwitch_main);
};

/* harmony default export */ var MazSwitch = (MazSwitch_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTabsLayout/MazTabsBar/_main.vue?vue&type=template&id=3ecad75e&
var _mainvue_type_template_id_3ecad75e_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "MazTabsBar",
      staticClass: "maz-base-component maz-tabs-bar",
      class: {
        "maz-is-dark": _vm.dark,
        "align-left": _vm.alignLeft
      }
    },
    [
      _vm._l(_vm.items, function(ref, i) {
        var label = ref.label
        var disabled = ref.disabled
        return _c(
          "MazBtn",
          {
            key: i,
            ref: "MazTabsBarItem",
            refInFor: true,
            staticClass: "maz-tabs-bar__item",
            class: { active: _vm.currentTab === i, disabled: disabled },
            attrs: {
              "no-shadow": "",
              color: "transparent",
              to: _vm.useAnchor ? "#" + _vm.labelNormalize(label) : null
            },
            nativeOn: {
              click: function($event) {
                disabled ? null : _vm.setValue(i)
              }
            }
          },
          [_vm._v("\n    " + _vm._s(label) + "\n  ")]
        )
      }),
      _c(
        "div",
        {
          staticClass: "maz-tabs-bar__indicator",
          style: _vm.tabsIndicatorState
        },
        [_c("div", { staticClass: "maz-sub-bar" })]
      )
    ],
    2
  )
}
var _mainvue_type_template_id_3ecad75e_staticRenderFns = []
_mainvue_type_template_id_3ecad75e_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsBar/_main.vue?vue&type=template&id=3ecad75e&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTabsLayout/MazTabsBar/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var toSnakeCase = function toSnakeCase(string) {
  return string.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(function (word) {
    return word.toLowerCase();
  }).join('_');
};

var getIndexOfCurrentAnchor = function getIndexOfCurrentAnchor(tabs, value) {
  if (typeof window === 'undefined') return value;
  var anchor = window.location.hash.replace('#', '');
  var index = tabs.findIndex(function (_ref) {
    var label = _ref.label;
    return toSnakeCase(label) === anchor;
  });
  return index === -1 ? 0 : index;
};

/* harmony default export */ var MazTabsBar_mainvue_type_script_lang_js_ = ({
  name: 'MazTabsBar',
  props: {
    // tabs objects - ex: `[ { label: 'First Tab' }, { label: 'Second Tab', disabled: true }]`
    items: {
      type: Array,
      required: true
    },
    // current tab active
    value: {
      type: Number,
      default: 1
    },
    // set the dark theme
    dark: {
      type: Boolean,
      default: false
    },
    // the tabs bar will be align on left
    alignLeft: {
      type: Boolean,
      default: false
    },
    // you should use the history mode with VueRouter && do not use `v-model` value
    useAnchor: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      currentTab: null,
      isMounted: false
    };
  },
  computed: {
    tabsIndicatorState: function tabsIndicatorState() {
      var currentTab = this.currentTab,
          isMounted = this.isMounted;
      if (!Number.isInteger(currentTab) || !isMounted) return;
      var tabsItem = this.$refs.MazTabsBarItem ? this.$refs.MazTabsBarItem[currentTab] : null;
      var indicatorWidth = tabsItem ? tabsItem.$el.clientWidth : 0;
      var translateXValue = tabsItem ? tabsItem.$el.offsetLeft : 0;
      return {
        transform: "translateX(".concat(translateXValue, "px)"),
        width: "".concat(indicatorWidth, "px")
      };
    }
  },
  created: function created() {
    var value = this.value,
        useAnchor = this.useAnchor,
        items = this.items;
    if (value < 1 || value > items.length) throw new Error("[Maz-ui](maz-tabs-bar) The init value should be between 1 and ".concat(items.length));
    if (!useAnchor) this.setValue(value - 1);
  },
  mounted: function mounted() {
    this.isMounted = true;
    var useAnchor = this.useAnchor,
        currentTab = this.currentTab;

    if (useAnchor) {
      var valueIndex = this.value - 1;
      var tabActive = useAnchor && !Number.isInteger(currentTab) ? getIndexOfCurrentAnchor(this.items, valueIndex) : valueIndex;
      this.setValue(tabActive);
    }
  },
  methods: {
    setValue: function setValue(i) {
      this.currentTab = i;
      this.$root.mazTabsLayoutActive = i;
      this.$emit('input', i + 1);
    },
    labelNormalize: function labelNormalize(label) {
      return toSnakeCase(label);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsBar/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var MazTabsLayout_MazTabsBar_mainvue_type_script_lang_js_ = (MazTabsBar_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsBar/_main.vue





/* normalize component */

var MazTabsBar_main_component = normalizeComponent(
  MazTabsLayout_MazTabsBar_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_3ecad75e_render,
  _mainvue_type_template_id_3ecad75e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazTabsBar_main_api; }
MazTabsBar_main_component.options.__file = "packages/components/MazTabsLayout/MazTabsBar/_main.vue"
/* harmony default export */ var MazTabsBar_main = (MazTabsBar_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsBar/index.js


MazTabsBar_main.install = function (Vue) {
  Vue.component(MazTabsBar_main.name, MazTabsBar_main);
};

/* harmony default export */ var MazTabsBar = (MazTabsBar_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTabsLayout/MazTabsContent/_main.vue?vue&type=template&id=e529b978&
var _mainvue_type_template_id_e529b978_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "MazTabsContent",
      staticClass: "maz-base-component maz-tabs-content",
      class: { "maz-overflow-hidden": _vm.hideOverflow }
    },
    [_vm._t("default")],
    2
  )
}
var _mainvue_type_template_id_e529b978_staticRenderFns = []
_mainvue_type_template_id_e529b978_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContent/_main.vue?vue&type=template&id=e529b978&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTabsLayout/MazTabsContent/_main.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var MazTabsContent_mainvue_type_script_lang_js_ = ({
  name: 'MazTabsContent',
  props: {
    // Set the current active tab (use it you don't use MazTabsBar)
    activeTab: {
      type: Number,
      default: null
    }
  },
  data: function data() {
    return {
      currentTab: null,
      hideOverflow: false
    };
  },
  computed: {
    tabsBarActiveTab: function tabsBarActiveTab() {
      var tabsBarComponent = this.$parent.$children.find(function (c) {
        return typeof c.$refs.MazTabsBar !== 'undefined';
      });

      var _ref = tabsBarComponent || {
        currentTab: this.$root.mazTabsLayoutActive
      },
          currentTab = _ref.currentTab;

      return currentTab;
    }
  },
  watch: {
    activeTab: {
      handler: function handler(value) {
        this.setOverflowHiddenTemp();
        this.currentTab = value ? value - 1 : null;
      },
      immediate: true
    },
    tabsBarActiveTab: {
      handler: function handler(value) {
        if (Number.isInteger(this.activeTab)) return;
        this.setOverflowHiddenTemp();
        this.currentTab = value;
      },
      immediate: true
    }
  },
  methods: {
    setOverflowHiddenTemp: function setOverflowHiddenTemp() {
      this.hideOverflow = true;
      this.allowOverFlow();
    },
    allowOverFlow: debounce(function () {
      this.hideOverflow = false;
    }, 700)
  }
});
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContent/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var MazTabsLayout_MazTabsContent_mainvue_type_script_lang_js_ = (MazTabsContent_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContent/_main.vue





/* normalize component */

var MazTabsContent_main_component = normalizeComponent(
  MazTabsLayout_MazTabsContent_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_e529b978_render,
  _mainvue_type_template_id_e529b978_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazTabsContent_main_api; }
MazTabsContent_main_component.options.__file = "packages/components/MazTabsLayout/MazTabsContent/_main.vue"
/* harmony default export */ var MazTabsContent_main = (MazTabsContent_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContent/index.js


MazTabsContent_main.install = function (Vue) {
  Vue.component(MazTabsContent_main.name, MazTabsContent_main);
};

/* harmony default export */ var MazTabsContent = (MazTabsContent_main);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTabsLayout/MazTabsContentItem/_main.vue?vue&type=template&id=2c4d8537&
var _mainvue_type_template_id_2c4d8537_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("transition", { attrs: { name: _vm.transitionName, tag: "div" } }, [
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.isCurrentTab,
            expression: "isCurrentTab"
          }
        ],
        ref: "MazTabsContentItem",
        staticClass: "maz-base-component maz-tabs-content-item"
      },
      [_vm._t("default")],
      2
    )
  ])
}
var _mainvue_type_template_id_2c4d8537_staticRenderFns = []
_mainvue_type_template_id_2c4d8537_render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContentItem/_main.vue?vue&type=template&id=2c4d8537&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazTabsLayout/MazTabsContentItem/_main.vue?vue&type=script&lang=js&


function MazTabsContentItem_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function MazTabsContentItem_mainvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { MazTabsContentItem_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { MazTabsContentItem_mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var MazTabsContentItem_mainvue_type_script_lang_js_ = ({
  name: 'MazTabsContentItem',
  props: {
    step: {
      type: Number,
      default: null
    }
  },
  data: function data() {
    return {
      transitionName: null,
      currentTab: null
    };
  },
  computed: {
    itemStepNumber: function itemStepNumber() {
      if (Number.isInteger(this.step)) return this.step - 1;
      var currentUid = this._uid;
      var index = this.$parent.$children.findIndex(function (c) {
        return c._uid === currentUid;
      });
      return index;
    },
    isCurrentTab: function isCurrentTab() {
      return this.currentTab === this.itemStepNumber;
    }
  },
  watch: {
    '$parent.currentTab': {
      handler: function handler(value, oldValue) {
        var _this = this;

        return MazTabsContentItem_mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
          var newTabIsBigger;
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  newTabIsBigger = oldValue < value;
                  _this.transitionName = newTabIsBigger ? 'maz-tab-transition' : 'maz-tab-reverse-transition';
                  _context.next = 4;
                  return _this.$nextTick();

                case 4:
                  _this.currentTab = value;

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      },
      immediate: true
    }
  },
  created: function created() {
    this.currentTab = this.$parent.currentTab;
  }
});
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContentItem/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var MazTabsLayout_MazTabsContentItem_mainvue_type_script_lang_js_ = (MazTabsContentItem_mainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContentItem/_main.vue





/* normalize component */

var MazTabsContentItem_main_component = normalizeComponent(
  MazTabsLayout_MazTabsContentItem_mainvue_type_script_lang_js_,
  _mainvue_type_template_id_2c4d8537_render,
  _mainvue_type_template_id_2c4d8537_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var MazTabsContentItem_main_api; }
MazTabsContentItem_main_component.options.__file = "packages/components/MazTabsLayout/MazTabsContentItem/_main.vue"
/* harmony default export */ var MazTabsContentItem_main = (MazTabsContentItem_main_component.exports);
// CONCATENATED MODULE: ./packages/components/MazTabsLayout/MazTabsContentItem/index.js


MazTabsContentItem_main.install = function (Vue) {
  Vue.component(MazTabsContentItem_main.name, MazTabsContentItem_main);
};

/* harmony default export */ var MazTabsContentItem = (MazTabsContentItem_main);
// EXTERNAL MODULE: ./package.json
var package_0 = __webpack_require__(5);

// CONCATENATED MODULE: ./packages/index.js
/* Automatically generated by './build/build-entries.js (thanks element-ui)' */

/* eslint-disable */





































var components = [MazAvatar, MazBottomSheet, MazBtn, MazBtnGroup, MazCheckbox, MazCollapse, MazDialog, MazDraggableList, MazDropdown, MazDropzone, MazFlex, MazImg, MazInput, MazInputTags, MazList, MazListItem, MazLoader, MazPagination, MazPicker, MazPlotly, MazProgressBar, MazPhoneNumberInput, MazRadio, MazReadMore, MazResponsiveMenu, MazSearch, MazSelect, MazSidebar, components_MazSlider, MazSpinner, MazStepper, MazSwitch, MazTabsBar, MazTabsContent, MazTabsContentItem, MazTransitionExpand];

var install = function install(Vue) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  components.forEach(function (component) {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

/* harmony default export */ var packages_0 = __webpack_exports__["default"] = ({
  version: package_0["a" /* version */],
  install: install,
  MazAvatar: MazAvatar,
  MazBottomSheet: MazBottomSheet,
  MazBtn: MazBtn,
  MazBtnGroup: MazBtnGroup,
  MazCheckbox: MazCheckbox,
  MazCollapse: MazCollapse,
  MazDialog: MazDialog,
  MazDraggableList: MazDraggableList,
  MazDropdown: MazDropdown,
  MazDropzone: MazDropzone,
  MazFlex: MazFlex,
  MazImg: MazImg,
  MazInput: MazInput,
  MazInputTags: MazInputTags,
  MazList: MazList,
  MazListItem: MazListItem,
  MazLoader: MazLoader,
  MazPagination: MazPagination,
  MazPicker: MazPicker,
  MazPlotly: MazPlotly,
  MazProgressBar: MazProgressBar,
  MazPhoneNumberInput: MazPhoneNumberInput,
  MazRadio: MazRadio,
  MazReadMore: MazReadMore,
  MazResponsiveMenu: MazResponsiveMenu,
  MazSearch: MazSearch,
  MazSelect: MazSelect,
  MazSidebar: MazSidebar,
  MazSlider: components_MazSlider,
  MazSpinner: MazSpinner,
  MazStepper: MazStepper,
  MazSwitch: MazSwitch,
  MazTabsBar: MazTabsBar,
  MazTabsContent: MazTabsContent,
  MazTabsContentItem: MazTabsContentItem,
  MazTransitionExpand: MazTransitionExpand
});

/* eslint-enable */

/***/ })
/******/ ])["default"];