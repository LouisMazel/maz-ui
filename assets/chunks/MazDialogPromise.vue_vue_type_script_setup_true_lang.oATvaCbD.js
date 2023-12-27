import{h as L,d as M,j as N,y as I,_ as P,o as u,b,I as E,w as v,c as $,k,n as S,a1 as F,r as c,M as D,e as A,T as W,a7 as H,a8 as K,g as z,t as p,a as y,m as i,W as h,X as T,F as w,E as R}from"./framework.z3pCfM0g.js";const q=L(),g=L([]),U=(e,o)=>new Promise((d,n)=>{g.value=[...g.value,{id:e,isActive:!0,resolve:async()=>{await(o==null?void 0:o()),d(!0)},reject:n}]}),O=e=>(g.value=g.value.filter(({id:o})=>o!==e),g.value),V=(e,o,d=!1)=>{var n;o&&((n=o[e])==null||n.call(o,d),o.isActive=!1,setTimeout(()=>{O(o.id)},500))},X=()=>({confirmDialogData:q,dialogState:g,showDialogAndWaitChoice:U,removeDialogFromState:O,rejectDialog:(e,o="cancel")=>V("reject",e,o),resolveDialog:(e,o="accept")=>V("resolve",e,o)}),j="--backdrop-present",G=()=>{document.documentElement.classList.add(j)},J=async()=>{document.querySelector(".m-backdrop.--present")||document.documentElement.classList.remove(j)},Q=M({inheritAttrs:!1,props:{modelValue:{type:Boolean,default:!1},teleportSelector:{type:String,default:"body"},beforeClose:{type:Function,default:void 0},persistent:{type:Boolean,default:!1},noCloseOnEscKey:{type:Boolean,default:!1},transitionName:{type:String,default:"backdrop-anim"},backdropClass:{type:[Array,String,Object],default:void 0},backdropContentClass:{type:[Array,String,Object],default:void 0}},emits:["open","before-close","close","update:model-value"],setup(e,{emit:o}){const d=L(e.modelValue),n=()=>{r(!1)},r=async f=>{var B;f||(o("before-close"),await((B=e.beforeClose)==null?void 0:B.call(e))),d.value=f},m=()=>{o("open")},a=()=>{o("update:model-value",!1),o("close"),t()},l=()=>{e.persistent||n()},s=f=>{!e.noCloseOnEscKey&&f.key==="Escape"&&!e.persistent&&n()},C=()=>{G(),document.addEventListener("keyup",s,!1)},t=()=>{document.removeEventListener("keyup",s),J()};return N(()=>{e.modelValue?C():t()}),I(()=>e.modelValue,f=>{d.value=f,f?C():t()}),{onBackdropAnimationEnter:m,onBackdropAnimationLeave:a,onBackdropClicked:l,close:n,present:d,toggleModal:r,onKeyPress:s}}});function Y(e,o,d,n,r,m){return u(),b(H,{to:e.teleportSelector},[E(W,{appear:"",name:e.transitionName,onAfterEnter:e.onBackdropAnimationEnter,onAfterLeave:e.onBackdropAnimationLeave},{default:v(()=>[e.present?(u(),$("div",{key:0,class:S(["m-backdrop --present",[e.backdropClass]]),tabindex:"-1",role:"dialog"},[k("button",{class:S(["m-backdrop-overlay",{"--disabled":e.persistent}]),tabindex:"-1",onClick:o[0]||(o[0]=F((...a)=>e.onBackdropClicked&&e.onBackdropClicked(...a),["self"]))},null,2),k("div",D({class:["m-backdrop-content",e.backdropContentClass]},e.$attrs,{role:"document",tabindex:"0"}),[c(e.$slots,"default",{close:e.close})],16)],2)):A("",!0)]),_:3},8,["name","onAfterEnter","onAfterLeave"])],8,["to"])}const Z=P(Q,[["render",Y]]),x={key:0,id:"dialogTitle",class:"maz-my-0 maz-text-xl maz-font-semibold"},_={id:"dialogDesc",class:"m-dialog-content"},ee={key:0,class:"m-dialog-footer"},te=M({__name:"MazDialog",props:{title:{type:String,default:void 0},noClose:{type:Boolean,default:!1},width:{type:String,default:"500px"},maxWidth:{type:String,default:"95vw"},maxHeight:{type:String,default:"95vh"},scrollable:{type:Boolean,default:!1}},emits:["update:model-value","close","open"],setup(e){const o=h(()=>T(()=>import("./MazBtn.-G1eJNIw.js"),__vite__mapDeps([0,1]))),d=h(()=>T(()=>import("./x-mark.VHiIF9qc.js"),__vite__mapDeps([2,1]))),n=K(),r=z(()=>({...n,class:void 0,style:void 0})),m=z(()=>({class:n.class,style:n.style}));return(a,l)=>(u(),b(Z,D(r.value,{"transition-name":"modal-anim","aria-labelledby":"dialogTitle","aria-describedby":"dialogDesc",onClose:l[0]||(l[0]=s=>a.$emit("close",s)),onOpen:l[1]||(l[1]=s=>a.$emit("open",s)),"onUpdate:modelValue":l[2]||(l[2]=s=>a.$emit("update:model-value",s))}),{default:v(({close:s})=>[k("div",D({class:["m-dialog",{"--scrollable":e.scrollable}],role:"dialog","aria-modal":"true",style:[{width:e.width,maxWidth:e.maxWidth,maxHeight:e.maxHeight}]},m.value),[c(a.$slots,"header",{close:s},()=>[k("div",{class:S(["m-dialog-header",{"--has-title":a.$slots.title||e.title}])},[a.$slots.title||e.title?(u(),$("h2",x,[c(a.$slots,"title",{},()=>[y(p(e.title),1)],!0)])):A("",!0),e.noClose?A("",!0):(u(),b(i(o),{key:1,class:"m-dialog-closebtn",color:"transparent",onClick:s},{default:v(()=>[E(i(d),{class:"maz-text-lg"})]),_:2},1032,["onClick"]))],2)],!0),k("div",_,[c(a.$slots,"default",{close:s},void 0,!0)]),a.$slots.footer?(u(),$("div",ee,[c(a.$slots,"footer",{close:s},void 0,!0)])):A("",!0)],16)]),_:3},16))}}),oe=P(te,[["__scopeId","data-v-48cfd34f"]]),ae={class:"maz-space-x-2"},le=M({__name:"MazDialogPromise",props:{data:{type:Object,default:void 0},identifier:{type:String,required:!0},buttons:{type:Array,default:()=>[]}},setup(e){const o=h(()=>T(()=>import("./MazBtn.-G1eJNIw.js"),__vite__mapDeps([0,1]))),d=e,{dialogState:n,rejectDialog:r,resolveDialog:m}=X(),a=z(()=>n.value.find(({id:l})=>l===d.identifier));return(l,s)=>{var C;return u(),b(oe,{"model-value":((C=a.value)==null?void 0:C.isActive)??!1,"onUpdate:modelValue":s[2]||(s[2]=t=>i(r)(a.value))},{title:v(()=>[c(l.$slots,"title",{},()=>{var t;return[y(p((t=e.data)==null?void 0:t.title),1)]})]),default:v(()=>[c(l.$slots,"default",{resolve:t=>i(m)(a.value,t),reject:t=>i(r)(a.value,t)},()=>{var t;return[y(p((t=e.data)==null?void 0:t.message),1)]})]),footer:v(()=>[c(l.$slots,"footer-button",{resolve:t=>i(m)(a.value,t),reject:t=>i(r)(a.value,t)},()=>[k("div",ae,[e.buttons.length>0?(u(!0),$(w,{key:0},R(e.buttons,(t,f)=>(u(),b(i(o),{key:f,color:t.color,size:t.size,outline:t.outline,rounded:t.rounded,disabled:t.disabled,block:t.block,loading:t.loading,onClick:B=>t.type==="resolve"?i(m)(a.value,t.response):i(r)(a.value,t.response)},{default:v(()=>[y(p(t.text),1)]),_:2},1032,["color","size","outline","rounded","disabled","block","loading","onClick"]))),128)):(u(),$(w,{key:1},[E(i(o),{color:"danger",outline:"",onClick:s[0]||(s[0]=t=>i(r)(a.value))},{default:v(()=>[c(l.$slots,"cancel-text",{},()=>{var t;return[y(p(((t=e.data)==null?void 0:t.cancelText)||"Cancel"),1)]})]),_:3}),E(i(o),{color:"success",onClick:s[1]||(s[1]=t=>i(m)(a.value))},{default:v(()=>[c(l.$slots,"confirm-text",{},()=>{var t;return[y(p(((t=e.data)==null?void 0:t.confirmText)||"Confirm"),1)]})]),_:3})],64))])])]),_:3},8,["model-value"])}}});export{Z as M,le as _,oe as a,X as u};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/chunks/MazBtn.-G1eJNIw.js","assets/chunks/framework.z3pCfM0g.js","assets/chunks/x-mark.VHiIF9qc.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}