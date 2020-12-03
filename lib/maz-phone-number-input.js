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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 2 */
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
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazBtn/_main.vue?vue&type=template&id=247f3a44&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazBtn/_main.vue?vue&type=template&id=247f3a44&

// EXTERNAL MODULE: ./packages/components/MazSpinner/index.js + 5 modules
var MazSpinner = __webpack_require__(5);

// EXTERNAL MODULE: ./packages/mixins/uniqueId.js
var uniqueId = __webpack_require__(2);

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

/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazBtn',
  components: {
    MazSpinner: MazSpinner["default"]
  },
  mixins: [uniqueId["a" /* default */]],
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
 /* harmony default export */ var MazBtn_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazBtn/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazBtn_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazBtn/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazBtn/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazBtn = __webpack_exports__["default"] = (_main);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSpinner/_main.vue?vue&type=template&id=67a8ca41&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


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
/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
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
 /* harmony default export */ var MazSpinner_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazSpinner/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazSpinner_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazSpinner/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazSpinner/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazSpinner = __webpack_exports__["default"] = (_main);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ debounce; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* reexport */ pascalCaseToKebabCase; });

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



/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazInput/_main.vue?vue&type=template&id=5b617c72&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazInput/_main.vue?vue&type=template&id=5b617c72&

// EXTERNAL MODULE: ./packages/mixins/uniqueId.js
var uniqueId = __webpack_require__(2);

// EXTERNAL MODULE: ./packages/utils/index.js + 2 modules
var utils = __webpack_require__(6);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazInput/_main.vue?vue&type=script&lang=js&
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazInput',
  mixins: [uniqueId["a" /* default */]],
  props: {
    // value of the input
    value: {
      validator: function validator(prop) {
        return ['string', 'number'].includes(_typeof(prop)) || prop === null;
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
    debounceValue: Object(utils["a" /* debounce */])(function (value) {
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
 /* harmony default export */ var MazInput_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazInput/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazInput_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazInput/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazInput/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazInput = __webpack_exports__["default"] = (_main);

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, exports) {

module.exports = require("libphonenumber-js");

/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSelect/_main.vue?vue&type=template&id=2fb08d76&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSelect/_main.vue?vue&type=template&id=2fb08d76&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(1);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./packages/components/MazInput/index.js + 5 modules
var MazInput = __webpack_require__(8);

// EXTERNAL MODULE: ./packages/components/MazBtn/index.js + 5 modules
var MazBtn = __webpack_require__(4);

// EXTERNAL MODULE: ./packages/mixins/uniqueId.js
var uniqueId = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSelect/_main.vue?vue&type=script&lang=js&


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazSelect',
  components: {
    MazInput: MazInput["default"],
    MazBtn: MazBtn["default"]
  },
  mixins: [uniqueId["a" /* default */]],
  props: {
    // is the value of the input
    value: {
      required: true,
      validator: function validator(prop) {
        return ['number', 'string', 'boolean'].includes(_typeof(prop)) || Array.isArray(prop) || prop === null;
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
      return value ? multiple ? _toConsumableArray(value) : [value] : [];
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee3() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee4() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee5() {
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
 /* harmony default export */ var MazSelect_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazSelect/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazSelect_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazSelect/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazSelect/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazSelect = __webpack_exports__["default"] = (_main);

/***/ }),
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports) {

module.exports = require("libphonenumber-js/examples.mobile.json");

/***/ }),
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPhoneNumberInput/_main.vue?vue&type=template&id=0022c02d&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/_main.vue?vue&type=template&id=0022c02d&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(1);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: external "libphonenumber-js"
var external_libphonenumber_js_ = __webpack_require__(11);

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


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var browserLocale = function browserLocale() {
  if (typeof window === 'undefined') return null;
  var browserLocale = window.navigator.userLanguage || window.navigator.language;
  var locale = browserLocale ? browserLocale.substr(3, 4).toUpperCase() : null;
  if (locale === '') locale = browserLocale.substr(0, 2).toUpperCase(); // fallback to US country

  if (locale === 'EN') locale = 'US';
  return locale;
};
var isCountryAvailable = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee(locale) {
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
    results = _objectSpread(_objectSpread({}, results), {}, {
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
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
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
var examples_mobile_json_ = __webpack_require__(20);
var examples_mobile_json_default = /*#__PURE__*/__webpack_require__.n(examples_mobile_json_);

// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/constantes/locales/index.js
/* harmony default export */ var locales = ({
  countrySelectorLabel: 'Country code',
  countrySelectorError: 'Choose country',
  countrySelectorSearchPlaceholder: 'Search country',
  phoneNumberLabel: 'Phone number',
  example: 'Example:'
});
// EXTERNAL MODULE: ./packages/components/MazInput/index.js + 5 modules
var MazInput = __webpack_require__(8);

// EXTERNAL MODULE: ./packages/components/MazSelect/index.js + 5 modules
var MazSelect = __webpack_require__(15);

// EXTERNAL MODULE: ./packages/mixins/uniqueId.js
var uniqueId = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPhoneNumberInput/_main.vue?vue&type=script&lang=js&


function _mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _mainvue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { _mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { _mainvue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _mainvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _mainvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { _mainvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { _mainvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { _mainvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _mainvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'MazPhoneNumberInput',
  components: {
    MazInput: MazInput["default"],
    MazSelect: MazSelect["default"]
  },
  mixins: [uniqueId["a" /* default */]],
  props: {
    value: {
      validator: function validator(prop) {
        return ['string', 'number'].includes(_typeof(prop)) || prop === null;
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
      return _mainvue_type_script_lang_js_objectSpread(_mainvue_type_script_lang_js_objectSpread({}, locales), this.translations);
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
      return this.preferredCountries ? [].concat(_toConsumableArray(this.countriesFiltered), _toConsumableArray(this.otherCountries)) : this.onlyCountries ? this.countriesFiltered : this.countriesList;
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

    return _mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
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

      return _mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
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

      return _mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee3() {
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

      return _mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee4() {
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

      return _mainvue_type_script_lang_js_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee5() {
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
 /* harmony default export */ var MazPhoneNumberInput_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazPhoneNumberInput_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazPhoneNumberInput/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazPhoneNumberInput/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazPhoneNumberInput = __webpack_exports__["default"] = (_main);

/***/ })
/******/ ]);