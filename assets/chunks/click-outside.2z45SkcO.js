import{P as i}from"./framework.z3pCfM0g.js";const n="__vue_click_away__",s=()=>document.ontouchstart===null?"touchstart":"click",u=async(t,e)=>{r(t);const d=e.instance,o=e.value,c=typeof o=="function";if(!c)throw new Error("[maz-ui](vClickOutside) the callback should be a function");await i(),t[n]=a=>{if((!t||!t.contains(a.target))&&o&&c)return o.call(d,a)};const l=s();document.addEventListener(l,t[n],!1)},r=t=>{const e=s();document.removeEventListener(e,t[n],!1),delete t[n]},m=(t,e)=>{e.value!==e.oldValue&&u(t,e)},f={mounted:u,updated:m,unmounted:r};export{f as d};
