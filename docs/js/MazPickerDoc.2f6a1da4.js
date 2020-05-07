(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MazPickerDoc"],{7918:function(e,a,t){},a8e6:function(e,a,t){"use strict";var l=t("7918"),n=t.n(l);n.a},da31:function(e,a,t){"use strict";t.r(a);var l=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"maz-picker-doc"},[e._m(0),t("br"),t("p",{staticClass:"maz-mb-3"},[e._v(" You can use any locale available in moment package. Locales are dynamically imported. ")]),t("div",{staticClass:"maz-flex maz-flex-1"},[t("MazBtnGroup",{attrs:{items:e.locales},model:{value:e.locale,callback:function(a){e.locale=a},expression:"locale"}})],1),t("hr",{staticClass:"maz-border-top maz-border-solid maz-border-color maz-my-3"}),t("p",{staticClass:"maz-fw-700 maz-mb-3"},[e._v(" Top or bottom position of pickers is calculate ")]),t("p",{staticClass:"maz-mb-3"},[e._v(' You can set the position with "position" props attribute : ')]),t("CodeContainer",{attrs:{language:"html",code:e.positionCodeExample}}),t("hr",{staticClass:"maz-border-top maz-border-solid maz-border-color maz-my-3"}),t("div",{staticClass:"examples maz-my-3"},[t("ComponentContainer",{attrs:{code:e.codeExample}},[t("h3",[e._v("Date Time Picker")]),t("h5",{staticClass:"maz-mb-3"},[e._v(" Basic ")]),t("p",{staticClass:"maz-mb-3"},[t("strong",[e._v("Options:")]),e._v(" none ")]),t("p",[t("strong",[e._v("Value")]),e._v(" : "+e._s(e.pickerValue||"null")+" ")]),t("p",{staticClass:"maz-mb-2"},[t("strong",[e._v("Formatted value")]),e._v(" : "+e._s(e.pickerFormatted||"null")+" ")]),t("MazPicker",{attrs:{locale:e.locale,format:"DD-MM-YYYY HH:mm"},on:{formatted:function(a){e.pickerFormatted=a}},model:{value:e.pickerValue,callback:function(a){e.pickerValue=a},expression:"pickerValue"}})],1),t("ComponentContainer",{attrs:{code:e.clearableExample}},[t("h3",[e._v("Date Picker")]),t("h5",{staticClass:"maz-mb-3"},[e._v(" Small input size clearable with input value formatted ")]),t("p",{staticClass:"maz-mb-3"},[t("strong",[e._v("Options:")]),e._v(' no-time - clearable - size="sm" - formatted="ll" - placeholder="Select date" ')]),t("p",[t("strong",[e._v("Value")]),e._v(" : "+e._s(e.pickerValue2||"null")+" ")]),t("p",{staticClass:"maz-mb-2"},[t("strong",[e._v("Formatted value")]),e._v(" : "+e._s(e.pickerFormatted2||"null")+" ")]),t("MazPicker",{attrs:{clearable:"",placeholder:"Select date",size:"sm","no-time":"",formatted:"ll",locale:e.locale},on:{formatted:function(a){e.pickerFormatted2=a}},model:{value:e.pickerValue2,callback:function(a){e.pickerValue2=a},expression:"pickerValue2"}})],1),t("ComponentContainer",{attrs:{code:e.doubleExample}},[t("h3",[e._v("Double Date Picker")]),t("h5",{staticClass:"maz-mb-3"},[e._v(" Large input size - french format - custom placeholder ")]),t("p",{staticClass:"maz-mb-3"},[t("strong",[e._v("Options:")]),e._v(' double - size="lg" - format="DD-MM-YYYY" - placeholder="Select date in big calander" - no-time ')]),t("p",[t("strong",[e._v("Value")]),e._v(" : "+e._s(e.pickerValue3||"null")+" ")]),t("p",{staticClass:"maz-mb-2"},[t("strong",[e._v("Formatted value")]),e._v(" : "+e._s(e.pickerFormatted3||"null")+" ")]),t("MazPicker",{attrs:{placeholder:"Select date in big calendar",format:"DD-MM-YYYY","no-time":"",size:"lg",double:"",locale:e.locale},on:{formatted:function(a){e.pickerFormatted3=a}},model:{value:e.pickerValue3,callback:function(a){e.pickerValue3=a},expression:"pickerValue3"}})],1),t("ComponentContainer",{attrs:{code:e.rangeExample}},[t("h3",[e._v("Range Double Date Picker")]),t("h5",{staticClass:"maz-mb-3"},[e._v(" Position forced ")]),t("p",{staticClass:"maz-mb-3"},[t("strong",[e._v("Options:")]),e._v(' range - double - position="top right" - placeholder="Select period" ')]),t("p",[t("strong",[e._v("Value")]),e._v(" : "+e._s(e.pickerRangeValues||"null")+" ")]),t("p",{staticClass:"maz-mb-2"},[t("strong",[e._v("Formatted value")]),e._v(" : "+e._s(e.pickerRangeValuesFormatted||"null")+" ")]),t("MazPicker",{attrs:{placeholder:"Select period",range:"",double:"",position:"top right",locale:e.locale},on:{formatted:function(a){e.pickerRangeValuesFormatted=a}},model:{value:e.pickerRangeValues,callback:function(a){e.pickerRangeValues=a},expression:"pickerRangeValues"}})],1),t("ComponentContainer",{attrs:{code:e.inlineExample}},[t("h3",[e._v("Inline Double Date Time Picker")]),t("h5",{staticClass:"maz-mb-3"},[e._v(" Min & max dates provided & without time picker ")]),t("p",{staticClass:"maz-mb-3"},[t("strong",[e._v("Options:")]),e._v(' inline - min-date="2020-05-05" - max-date="2020-05-27" - no-time ')]),t("p",[t("strong",[e._v("Value")]),e._v(" : "+e._s(e.pickerValue4||"null")+" ")]),t("p",{staticClass:"maz-mb-2"},[t("strong",[e._v("Formatted value")]),e._v(" : "+e._s(e.pickerFormatted4||"null")+" ")]),t("MazPicker",{attrs:{inline:"","no-time":"",double:"","min-date":"2020-05-05","max-date":"2020-06-22",locale:e.locale},on:{formatted:function(a){e.pickerFormatted4=a}},model:{value:e.pickerValue4,callback:function(a){e.pickerValue4=a},expression:"pickerValue4"}})],1),t("ComponentContainer",{attrs:{code:e.inlineExample}},[t("h3",[e._v("Time Picker")]),t("h5",{staticClass:"maz-mb-3"},[e._v(" Min & max dates provided & without time picker ")]),t("p",{staticClass:"maz-mb-3"},[t("strong",[e._v("Options:")]),e._v(' no-date - placeholder="Select time" ')]),t("p",[t("strong",[e._v("Value")]),e._v(" : "+e._s(e.pickerValue5||"null")+" ")]),t("p",{staticClass:"maz-mb-2"},[t("strong",[e._v("Formatted value")]),e._v(" : "+e._s(e.pickerFormatted5||"null")+" ")]),t("MazPicker",{attrs:{placeholder:"Select time","no-date":"",locale:e.locale},model:{value:e.pickerValue5,callback:function(a){e.pickerValue5=a},expression:"pickerValue5"}})],1),t("ComponentContainer",{attrs:{code:e.inlineExample}},[t("h3",{staticClass:"maz-mb-3"},[e._v(" Disabled ")]),t("p",[e._v("Value : "+e._s(e.pickerValue4||"null"))]),t("p",{staticClass:"maz-mb-2"},[e._v(" Formatted value : "+e._s(e.pickerFormatted4||"null")+" ")]),t("MazPicker",{attrs:{disabled:"",locale:e.locale},model:{value:e.pickerValue4,callback:function(a){e.pickerValue4=a},expression:"pickerValue4"}})],1)],1)],1)},n=[function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("p",{staticClass:"maz-fw-700 maz-mb-3"},[e._v(" This component is based on "),t("a",{attrs:{target:"_blank",href:"https://momentjs.com/"}},[e._v("MomentJS")])])}],r=function(){if("undefined"===typeof window)return null;var e=window.navigator,a=e.userLanguage,t=e.language,l=(a||t||"en").substr(0,2);return l},o={name:"MazPickerDoc",data:function(){return{locale:r(),locales:[{label:"English",value:"en"},{label:"French",value:"fr"},{label:"Italian",value:"it"},{label:"Spanish",value:"es"},{label:"Russian",value:"ru"}],pickerValue:"22-03-2020 01:13",pickerFormatted:null,codeExample:'<template>\n  <MazPicker\n    v-model="pickerValue"\n    @formatted="pickerFormatted = $event"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      pickerValue: null,\n      pickerFormatted: null\n    }\n  }\n}',pickerValue2:"2020-02-03",pickerFormatted2:null,clearableExample:'<template>\n  <MazPicker\n    v-model="pickerValue2"\n    clearable\n    size="sm"\n    placeholder="Select date"\n    formatted="ll"\n    @formatted="pickerFormatted2 = $event"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      pickerValue2: \'2020-02-03\',\n      pickerFormatted2: null\n    }\n  }\n}',pickerValue3:"03-02-2020",pickerFormatted3:null,doubleExample:'<template>\n  <MazPicker\n    v-model="pickerValue3"\n    placeholder="Select date in big calendar"\n    format="DD-MM-YYYY"\n    clearable\n    size="lg"\n    double\n    @formatted="pickerFormatted3 = $event"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      pickerFormatted2: null,\n      pickerValue3: \'03-02-2020\'\n    }\n  }\n}',pickerValue4:"2020-05-15",pickerFormatted4:null,inlineExample:'<template>\n  <MazPicker\n    v-model="pickerValue4"\n    placeholder="Select time"\n    no-date\n    @formatted="pickerFormatted4 = $event"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      pickerValue4: null,\n      pickerFormatted4: null\n    }\n  }\n}',pickerValue5:null,pickerFormatted5:null,timeExample:'<template>\n  <MazPicker\n    v-model="pickerValue4"\n    no-time\n    @formatted="pickerFormatted4 = $event"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      pickerValue4: null,\n      pickerFormatted4: null\n    }\n  }\n}',pickerRangeValues:null,pickerRangeValuesFormatted:null,rangeExample:'<template>\n  <MazPicker\n    v-model="pickerRangeValues"\n    placeholder="Select period"\n    range\n    double\n    position="bottom right"\n    :locale="locale"\n    @formatted="pickerRangeValuesFormatted = $event"\n  />\n</template>\n\nexport default {\n  data () {\n    return {\n      pickerFormatted3: null,\n      pickerValue4: null\n    }\n  }\n}',positionCodeExample:'<MazPicker\n  v-model="pickerValue"\n  position="top right"\n  @formatted="pickerFormatted = $event"\n/>'}}},i=o,c=(t("a8e6"),t("2877")),s=Object(c["a"])(i,l,n,!1,null,"5335f63a",null);a["default"]=s.exports}}]);
//# sourceMappingURL=MazPickerDoc.2f6a1da4.js.map