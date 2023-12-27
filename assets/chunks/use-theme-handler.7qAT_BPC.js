import{h as n,g as T,j as i}from"./framework.z3pCfM0g.js";function g(){return typeof document<"u"}const f={darkClass:"dark",lightClass:"light",storageThemeKey:"theme",storageThemeValueDark:"dark",storageThemeValueLight:"light",storageThemeValueSystem:"system"},r=n("system"),l=n("system");function c({darkClass:e,lightClass:a,storageThemeKey:s,storageThemeValueDark:t,setLocalStorageValue:m=!0,setSelectedTheme:u=!0}){g()&&(document.documentElement.classList.remove(a),document.documentElement.classList.add(e),r.value=t,u&&(l.value=t),m&&(localStorage[s]=t))}function h({darkClass:e,lightClass:a,storageThemeKey:s,storageThemeValueLight:t,setLocalStorageValue:m=!0,setSelectedTheme:u=!0}){g()&&(document.documentElement.classList.remove(e),document.documentElement.classList.add(a),r.value=t,u&&(l.value=t),m&&(localStorage[s]=t))}function d(e){g()&&(document.documentElement.classList.remove(e.darkClass),document.documentElement.classList.remove(e.lightClass),r.value=e.storageThemeValueSystem,l.value=e.storageThemeValueSystem,e.setLocalStorageValue&&(localStorage[e.storageThemeKey]=e.storageThemeValueSystem),y({...e,setSelectedTheme:!1}))}function o(){return window.matchMedia("(prefers-color-scheme: dark)").matches}function y(e){g()&&(e.onlyWithStoredValue?localStorage[e.storageThemeKey]===e.storageThemeValueDark||localStorage[e.storageThemeKey]===e.storageThemeValueSystem&&o()?c({...e,setLocalStorageValue:!1,setSelectedTheme:!1}):(localStorage[e.storageThemeKey]===e.storageThemeValueLight||localStorage[e.storageThemeKey]===e.storageThemeValueSystem&&!o())&&h({...e,setLocalStorageValue:!1,setSelectedTheme:!1}):localStorage[e.storageThemeKey]===e.storageThemeValueDark||!(e.storageThemeKey in localStorage)&&o()||localStorage[e.storageThemeKey]===e.storageThemeValueSystem&&o()?c({...e,setLocalStorageValue:!1,setSelectedTheme:!1}):h({...e,setLocalStorageValue:!1,setSelectedTheme:!1}))}function S({shouldSetDarkMode:e,...a}){return typeof e!="boolean"?d(a):e?c(a):h(a)}function V(e){return r.value===e.storageThemeValueDark?h(e):c(e)}function v(e=f){const a={...f,...e},s=T(()=>l.value===a.storageThemeValueDark),t=T(()=>l.value===a.storageThemeValueLight),m=T(()=>l.value===a.storageThemeValueSystem);return i(()=>{localStorage[a.storageThemeKey]&&(r.value=localStorage[a.storageThemeKey],l.value=localStorage[a.storageThemeKey])}),{autoSetTheme:u=>y({...a,...u}),toggleTheme:()=>V(a),setSystemTheme:()=>d({...a,setLocalStorageValue:!0}),setDarkTheme:()=>S({...a,shouldSetDarkMode:!0}),setLightTheme:()=>S({...a,shouldSetDarkMode:!1}),hasDarkTheme:s,hasLightTheme:t,hasSystemTheme:m,theme:r,selectedTheme:l}}export{g as i,v as u};
