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
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
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

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazImg/_main.vue?vue&type=template&id=61f7feeb&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


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
// EXTERNAL MODULE: ./packages/components/MazBtn/index.js + 5 modules
var MazBtn = __webpack_require__(4);

// EXTERNAL MODULE: ./packages/components/MazSpinner/index.js + 5 modules
var MazSpinner = __webpack_require__(5);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazImg/_main.vue?vue&type=script&lang=js&
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



/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazImg',
  components: {
    MazSpinner: MazSpinner["default"],
    MazBtn: MazBtn["default"]
  },
  directives: {
    preview: img_preview
  },
  props: {
    // path or url of image
    src: {
      validator: function validator(prop) {
        return ['string'].includes(_typeof(prop)) && prop !== '';
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
 /* harmony default export */ var MazImg_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazImg/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazImg_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazImg/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazImg/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazImg = __webpack_exports__["default"] = (_main);

/***/ }),

/***/ 4:
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

/***/ 5:
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

/***/ })

/******/ });