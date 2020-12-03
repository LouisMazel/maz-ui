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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
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
/* 11 */,
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

/***/ })
/******/ ]);