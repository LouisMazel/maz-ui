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
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
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


/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazLoader/_main.vue?vue&type=template&id=6c565066&
var render = function() {
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
var staticRenderFns = [
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
render._withStripped = true


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
/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazLoader',
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  }
});
// CONCATENATED MODULE: ./packages/components/MazLoader/_main.vue?vue&type=script&lang=js&
 /* harmony default export */ var MazLoader_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazLoader/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazLoader_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazLoader/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazLoader/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazLoader = __webpack_exports__["default"] = (_main);

/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
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

/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSidebar/_main.vue?vue&type=template&id=3dababc4&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSidebar/_main.vue?vue&type=template&id=3dababc4&

// EXTERNAL MODULE: ./packages/components/MazLoader/index.js + 5 modules
var MazLoader = __webpack_require__(14);

// EXTERNAL MODULE: ./packages/mixins/uniqueId.js
var uniqueId = __webpack_require__(2);

// EXTERNAL MODULE: ./packages/components/_subs/ArrowIcon/index.vue + 4 modules
var ArrowIcon = __webpack_require__(7);

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

/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazSidebar',
  components: {
    MazLoader: MazLoader["default"],
    ArrowIcon: ArrowIcon["a" /* default */]
  },
  mixins: [uniqueId["a" /* default */]],
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
 /* harmony default export */ var MazSidebar_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazSidebar/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazSidebar_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazSidebar/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazSidebar/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazSidebar = __webpack_exports__["default"] = (_main);

/***/ }),

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/_subs/ArrowIcon/index.vue?vue&type=template&id=1c91afda&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


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
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/_subs/ArrowIcon/index.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  _subs_ArrowIconvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/_subs/ArrowIcon/index.vue"
/* harmony default export */ var ArrowIcon = __webpack_exports__["a"] = (component.exports);

/***/ })

/******/ });