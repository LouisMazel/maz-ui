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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
/* 1 */,
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
/* 4 */,
/* 5 */,
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

/***/ })
/******/ ]);