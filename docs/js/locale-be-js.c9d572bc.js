(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["locale-be-js"],{"1fc1":function(_,e,t){(function(_,e){e(t("c1df"))})(0,(function(_){"use strict";function e(_,e){var t=_.split("_");return e%10===1&&e%100!==11?t[0]:e%10>=2&&e%10<=4&&(e%100<10||e%100>=20)?t[1]:t[2]}function t(_,t,s){var a={ss:t?"секунда_секунды_секунд":"секунду_секунды_секунд",mm:t?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:t?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===s?t?"хвіліна":"хвіліну":"h"===s?t?"гадзіна":"гадзіну":_+" "+e(a[s],+_)}var s=_.defineLocale("be",{months:{format:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_"),standalone:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_")},monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:{format:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_"),standalone:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),isFormat:/\[ ?[Ууў] ?(?:мінулую|наступную)? ?\] ?dddd/},weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:t,mm:t,h:t,hh:t,d:"дзень",dd:t,M:"месяц",MM:t,y:"год",yy:t},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(_){return/^(дня|вечара)$/.test(_)},meridiem:function(_,e,t){return _<4?"ночы":_<12?"раніцы":_<17?"дня":"вечара"},dayOfMonthOrdinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(_,e){switch(e){case"M":case"d":case"DDD":case"w":case"W":return _%10!==2&&_%10!==3||_%100===12||_%100===13?_+"-ы":_+"-і";case"D":return _+"-га";default:return _}},week:{dow:1,doy:7}});return s}))}}]);
//# sourceMappingURL=locale-be-js.c9d572bc.js.map