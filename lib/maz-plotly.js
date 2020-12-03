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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
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

/***/ 10:
/***/ (function(module, exports) {

module.exports = require("plotly.js-dist");

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

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPlotly/_main.vue?vue&type=template&id=66102fb0&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    staticClass: "maz-base-component maz-plotly",
    attrs: { id: _vm.uniqueId }
  })
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazPlotly/_main.vue?vue&type=template&id=66102fb0&

// EXTERNAL MODULE: external "plotly.js-dist"
var external_plotly_js_dist_ = __webpack_require__(10);
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

// EXTERNAL MODULE: ./packages/mixins/uniqueId.js
var uniqueId = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazPlotly/_main.vue?vue&type=script&lang=js&
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//





/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazPlotly',
  mixins: [uniqueId["a" /* default */]],
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
      innerLayout: _objectSpread({}, this.layout)
    };
  },
  computed: {
    options: function options() {
      var _this = this;

      var optionsFromAttrs = Object.keys(this.$attrs).reduce(function (acc, key) {
        acc[camelize(key)] = _this.$attrs[key];
        return acc;
      }, {});
      return _objectSpread({
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
      this.innerLayout = _objectSpread({}, _layout);
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
  methods: _objectSpread(_objectSpread({}, MazPlotly_methods), {}, {
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
 /* harmony default export */ var MazPlotly_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazPlotly/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazPlotly_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazPlotly/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazPlotly/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazPlotly = __webpack_exports__["default"] = (_main);

/***/ })

/******/ });