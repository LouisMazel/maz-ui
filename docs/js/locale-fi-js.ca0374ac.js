(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["locale-fi-js"],{"81e9":function(e,u,a){(function(e,u){u(a("c1df"))})(0,(function(e){"use strict";var u="nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),a=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",u[7],u[8],u[9]];function n(e,u,a,n){var i="";switch(a){case"s":return n?"muutaman sekunnin":"muutama sekunti";case"ss":return n?"sekunnin":"sekuntia";case"m":return n?"minuutin":"minuutti";case"mm":i=n?"minuutin":"minuuttia";break;case"h":return n?"tunnin":"tunti";case"hh":i=n?"tunnin":"tuntia";break;case"d":return n?"päivän":"päivä";case"dd":i=n?"päivän":"päivää";break;case"M":return n?"kuukauden":"kuukausi";case"MM":i=n?"kuukauden":"kuukautta";break;case"y":return n?"vuoden":"vuosi";case"yy":i=n?"vuoden":"vuotta";break}return i=t(e,n)+" "+i,i}function t(e,n){return e<10?n?a[e]:u[e]:e}var i=e.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:n,ss:n,m:n,mm:n,h:n,hh:n,d:n,dd:n,M:n,MM:n,y:n,yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}});return i}))}}]);
//# sourceMappingURL=locale-fi-js.ca0374ac.js.map