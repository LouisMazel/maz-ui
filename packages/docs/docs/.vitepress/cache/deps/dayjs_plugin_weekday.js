import {
  __commonJS
} from "./chunk-RSJERJUL.js";

// ../../node_modules/.pnpm/dayjs@1.11.7/node_modules/dayjs/plugin/weekday.js
var require_weekday = __commonJS({
  "../../node_modules/.pnpm/dayjs@1.11.7/node_modules/dayjs/plugin/weekday.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_weekday = t();
    }(exports, function() {
      "use strict";
      return function(e, t) {
        t.prototype.weekday = function(e2) {
          var t2 = this.$locale().weekStart || 0, i = this.$W, n = (i < t2 ? i + 7 : i) - t2;
          return this.$utils().u(e2) ? n : this.subtract(n, "day").add(e2, "day");
        };
      };
    });
  }
});
export default require_weekday();
//# sourceMappingURL=dayjs_plugin_weekday.js.map
