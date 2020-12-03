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
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
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

/***/ 17:
/***/ (function(module, exports) {

module.exports = require("vue2-dropzone");

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDropzone/_main.vue?vue&type=template&id=210abe95&
var render = function() {
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
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/components/MazDropzone/_main.vue?vue&type=template&id=210abe95&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(1);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: external "vue2-dropzone"
var external_vue2_dropzone_ = __webpack_require__(17);
var external_vue2_dropzone_default = /*#__PURE__*/__webpack_require__.n(external_vue2_dropzone_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/MazDropzone/_main.vue?vue&type=script&lang=js&


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

/* harmony default export */ var _mainvue_type_script_lang_js_ = ({
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

      return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
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
 /* harmony default export */ var MazDropzone_mainvue_type_script_lang_js_ = (_mainvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/components/MazDropzone/_main.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  MazDropzone_mainvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/components/MazDropzone/_main.vue"
/* harmony default export */ var _main = (component.exports);
// CONCATENATED MODULE: ./packages/components/MazDropzone/index.js


_main.install = function (Vue) {
  Vue.component(_main.name, _main);
};

/* harmony default export */ var MazDropzone = __webpack_exports__["default"] = (_main);

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ })

/******/ });