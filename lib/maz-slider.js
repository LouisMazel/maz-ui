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
/******/ 	return __webpack_require__(__webpack_require__.s = 45);
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

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSlider/_main.vue?vue&type=template&id=13a411ca&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazSlider/_main.vue?vue&type=template&id=13a411ca&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(1);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./packages/components/_subs/ArrowIcon/index.vue + 4 modules
var ArrowIcon = __webpack_require__(7);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazSlider/_main.vue?vue&type=script&lang=js&


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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


var getOpacityCoeff = function getOpacityCoeff(index, middle, length) {
  var currentIndex = index + 1;
  var isBiggerThanMiddle = middle < currentIndex;
  var deviation = isBiggerThanMiddle ? currentIndex - middle : middle - currentIndex;
  return 100 / length * deviation / 100;
};

var isBetween = function isBetween(value, prev, next, direction) {
  return direction === 'minus' ? prev ? value >= prev : true : next ? value <= next : true;
};

/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
  name: 'MazSlider',
  components: {
    ArrowIcon: ArrowIcon["a" /* default */]
  },
  props: {
    // Array of cursors values
    value: {
      required: true,
      validator: function validator(prop) {
        return ['number'].includes(_typeof(prop)) || Array.isArray(prop) || prop === null;
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee2() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee3() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee4() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee5() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee6() {
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee7() {
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
 /* harmony default export */ var MazSlider_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazSlider/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazSlider_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazSlider/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazSlider/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var components_MazSlider = __webpack_exports__["default"] = (_main);

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

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ })

/******/ });