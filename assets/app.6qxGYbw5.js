var ve=Object.defineProperty;var ye=(t,e,a)=>e in t?ve(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var M=(t,e,a)=>(ye(t,typeof e!="symbol"?e+"":e,a),a);import{d as D,h as A,g as d,y as J,j as ee,o as m,b as w,w as j,n as U,a1 as F,K as be,e as T,t as O,k as g,m as E,a as we,c as $,I as Ae,O as te,ac as _e,aa as ze,T as ke,W as f,X as p,_ as G,v as I,ad as Te,ae as Ee,af as Ce,ag as Oe,ah as Le,ai as xe,aj as $e,ak as Ie,al as De,am as Pe,u as Se,z as qe,an as Ne,ao as Re,ap as Be,aq as Ve}from"./chunks/framework.z3pCfM0g.js";import{t as Me}from"./chunks/theme.seUlGbEd.js";import{v as je,m as Fe,c as He}from"./chunks/index.mEg1Ak_K.js";import{i as ae}from"./chunks/use-theme-handler.7qAT_BPC.js";import{u as Ue}from"./chunks/use-timer.Fq-2MVpM.js";import"./chunks/MazToast.vue_vue_type_style_index_1_scoped_c033ac0f_lang.w40geAFS.js";import{s as Ge}from"./chunks/sleep.JASjerMi.js";import"./chunks/MazDialogPromise.vue_vue_type_script_setup_true_lang.oATvaCbD.js";import"./chunks/MazBtn.-G1eJNIw.js";import"./chunks/dayjs.min.8MX-qMPj.js";import"./chunks/date.GuA9KFVc.js";import"./chunks/capitalize._xbw7uFu.js";import"./chunks/MazSpinner.92kh8Ma1.js";import"./chunks/x-mark.VHiIF9qc.js";import"./chunks/chart.nVR4Bvnt.js";import"./chunks/check.fAFngIAg.js";import"./chunks/click-outside.2z45SkcO.js";import"./chunks/lazy-img.JAS2RLwT.js";import"./chunks/MazIcon.vue_vue_type_script_setup_true_lang.9dcQ_5eE.js";import"./chunks/inject-strict.aPooVEJM.js";import"./chunks/currency.B-QsTd8v.js";import"./chunks/getCountries.j5zCGMYw.js";const We={install(t){t.directive("fullscreen-img",je)}},Xe={class:"m-toast__message-wrapper"},Ke={class:"m-toast__message"},Qe={class:"maz-flex maz-items-center maz-gap-2"},Ye={key:0},Ze={class:"progress-bar maz-absolute maz-inset-x-0 maz-bottom-0 maz-h-1"},Je=D({__name:"MazToast",props:{position:{type:String,default:"bottom-right"},maxToasts:{type:[Number,Boolean],default:!1},timeout:{type:Number,default:1e4},queue:{type:Boolean,default:!1},noPauseOnHover:{type:Boolean,default:!1},type:{type:String,default:"info"},message:{type:String,required:!0},link:{type:Object,default:void 0},action:{type:Object,default:void 0},persistent:{type:Boolean,default:!1}},emits:["close","click","open"],setup(t,{emit:e}){const a=f(()=>p(()=>import("./chunks/MazBtn.-G1eJNIw.js"),__vite__mapDeps([0,1]))),o=f(()=>p(()=>import("./chunks/x-mark.VHiIF9qc.js"),__vite__mapDeps([2,1]))),c=f(()=>p(()=>import("./chunks/arrow-top-right-on-square.s_Q_5e-x.js"),__vite__mapDeps([3,1]))),v=f(()=>p(()=>import("./chunks/exclamation-triangle.IKneZf1S.js"),__vite__mapDeps([4,1]))),h=f(()=>p(()=>import("./chunks/exclamation-circle.ztuR8pEa.js"),__vite__mapDeps([5,1]))),l=f(()=>p(()=>import("./chunks/information-circle.RfdVJbSa.js"),__vite__mapDeps([6,1]))),u=f(()=>p(()=>import("./chunks/check-circle.QCwkdNFu.js"),__vite__mapDeps([7,1]))),P=f(()=>p(()=>import("./chunks/link.dTJeRqNZ.js"),__vite__mapDeps([8,1]))),y=A(),r=t,k=d(()=>{switch(r.type){case"danger":return v;case"info":return l;case"success":return u;case"warning":return h;default:return}}),b=e,S=d(()=>r.position.includes("top")?"top":"bottom"),L=d(()=>r.position.includes("left")?"left":r.position.includes("right")?"right":"center"),oe=d(()=>L.value!=="center"?L.value==="right"?"m-slide-right":"m-slide-left":S.value==="top"?"m-slide-top":"m-slide-bottom"),q=A(!1),N=A(!1),R=A(),W=`m-toast-container --${S.value} --${L.value}`,x=`.${W.replaceAll(" ",".")}`,{start:se,stop:re,pause:ie,resume:ce,remainingTime:le}=Ue({callback:V,timeout:r.timeout});function ue(){const n=document.querySelector(x);if(!n&&!n){const s=document.body,i=document.createElement("div");i.className=W,s.append(i)}}function me(){const n=document.querySelector(x);return!r.queue&&r.maxToasts===!1?!1:typeof r.maxToasts=="number"&&n?r.maxToasts<=n.childElementCount:n&&n.childElementCount>0}function X(){if(me()){R.value=setTimeout(X,250);return}const n=document.querySelector(x);y.value&&n&&n.prepend(y.value),N.value=!0,se()}const K=A("100%");function de(){switch(r.type){case"danger":return"maz-bg-danger-700";case"info":return"maz-bg-info-700";case"success":return"maz-bg-success-700";case"warning":return"maz-bg-warning-700";default:return"maz-bg-secondary"}}J(()=>le.value,n=>{if(typeof n=="number"){const s=100*n/r.timeout;K.value=`${s}%`,n<=0&&V()}});function B(n){b("click",n),r.persistent||V()}async function pe(n,s){var i;q.value=!0,await n(),q.value=!1,(i=r.action)!=null&&i.closeToast&&B(s)}function Q(n){r.noPauseOnHover||(n?ie():ce())}function fe(){re(),R.value&&clearTimeout(R.value)}function V(){fe(),N.value=!1}function ge(){b("open")}function he(){var s;b("close"),(s=y.value)==null||s.remove();const n=document.querySelector(x);n&&!(n!=null&&n.hasChildNodes())&&n.remove()}return ee(()=>{ue(),X()}),(n,s)=>(m(),w(ke,{name:oe.value,onAfterLeave:he,onAfterEnter:ge},{default:j(()=>[ze(g("button",{ref_key:"Toaster",ref:y,class:U(["m-toast",[`--${t.type}`,`--${S.value}`,`--${L.value}`,{"maz-pb-1":t.timeout}]]),role:"alert",onMouseover:s[2]||(s[2]=i=>Q(!0)),onMouseleave:s[3]||(s[3]=i=>Q(!1)),onClick:s[4]||(s[4]=F(i=>{var Y;return t.link&&!((Y=t.link)!=null&&Y.closeToast)?void 0:B(i)},["stop"]))},[k.value?(m(),w(be(k.value),{key:0,class:"maz-text-2xl"})):T("",!0),g("div",Xe,[g("p",Ke,O(t.message),1)]),t.action?(m(),w(E(a),{key:1,"data-test":"action-btn",color:t.type,pastel:"",loading:q.value,size:"sm",onClick:s[0]||(s[0]=F(i=>pe(t.action.func,i),["stop"]))},{default:j(()=>[we(O(t.action.text),1)]),_:1},8,["color","loading"])):T("",!0),t.link?(m(),w(E(a),{key:2,"data-test":"link-btn",color:t.type,pastel:"",size:"xs",href:t.link.href,target:t.link.target??"_self"},{default:j(()=>{var i;return[g("div",Qe,[t.link.text?(m(),$("span",Ye,O(t.link.text),1)):T("",!0),((i=t.link)==null?void 0:i.target)=="_blank"?(m(),w(E(c),{key:1,class:"maz-text-xl"})):(m(),w(E(P),{key:2,class:"maz-text-xl"}))])]}),_:1},8,["color","href","target"])):T("",!0),t.persistent?T("",!0):(m(),$("button",{key:3,class:"--close",onClick:s[1]||(s[1]=F(i=>B(i),["stop"]))},[Ae(E(o),{class:"--icon maz-text-xl"})])),g("div",Ze,[g("div",{style:te({width:K.value}),class:U(["maz-h-full !maz-transition-all !maz-duration-200 !maz-ease-linear",de()])},null,6)])],34),[[_e,N.value]])]),_:1},8,["name"]))}}),et=G(Je,[["__scopeId","data-v-c033ac0f"]]),tt={position:"bottom-right",timeout:1e4,persistent:!1};class at{constructor(e,a){this.app=e,this.globalOptions=a}show(e,a){const o={message:e,...a},c={...tt,...o,...this.globalOptions,...a};Fe(et,{props:c,app:this.app})}getLocalOptions(e,a){return{type:e,...a}}message(e,a){return this.show(e,this.getLocalOptions("theme",a))}success(e,a){return this.show(e,this.getLocalOptions("success",a))}error(e,a){return this.show(e,this.getLocalOptions("danger",a))}info(e,a){return this.show(e,this.getLocalOptions("info",a))}warning(e,a){return this.show(e,this.getLocalOptions("warning",a))}}let Z;const nt={install(t,e){Z=new at(t,e),t.provide("toast",Z)}},_="",ot=t=>t.filter((e,a,o)=>a===o.indexOf(e)),st=t=>(e=_)=>typeof e=="function"?t.findIndex((...a)=>e(...a))>-1:t.includes(e),rt=t=>t.length>0,it=t=>(e=_)=>ot([...t,e]),ct=t=>(e=_)=>t.filter(a=>a!==e);class lt{constructor(){M(this,"_loaders",A([]))}get loaders(){return d(()=>this._loaders.value)}stop(e=_){this._loaders.value=ct(this._loaders.value)(e)}start(e=_){return this._loaders.value=it(this._loaders.value)(e),()=>this.stop(e)}get anyLoading(){return d(()=>rt(this._loaders.value))}isLoading(e=_){return d(()=>st(this._loaders.value)(e)).value}}const ut=new lt,mt={install:t=>{t.provide("wait",ut)}},H={delay:100,observer:{root:void 0,rootMargin:"0px",threshold:.2},animation:{once:!0,duration:300,delay:0}};class dt{constructor(e){M(this,"options");this.options={delay:(e==null?void 0:e.delay)??H.delay,observer:{...H.observer,...e==null?void 0:e.observer},animation:{...H.animation,...e==null?void 0:e.animation}}}handleIntersect(e,a){for(const o of e){const v=o.target.getAttribute("data-maz-aos-children")==="true",h=o.target.getAttribute("data-maz-aos")?[o.target]:[];if(v){const l=[...document.querySelectorAll("[data-maz-aos-anchor]")].map(u=>u.getAttribute("data-maz-aos-anchor")===`#${o.target.id}`?u:void 0);for(const u of l)u&&h.push(u)}for(const l of h){const u=l.getAttribute("data-maz-aos-once"),P=typeof u=="string"?u==="true":this.options.animation.once;if(typeof this.options.observer.threshold=="number"&&o.intersectionRatio>this.options.observer.threshold){const y=l.getAttribute("data-maz-aos-duration"),r=l.getAttribute("data-maz-aos-delay");if(y||(l.style.transitionDuration=`${this.options.animation.duration}ms`,setTimeout(()=>{l.style.transitionDuration="0"},1e3)),r||(l.style.transitionDelay=`${this.options.animation.delay}ms`,setTimeout(()=>{l.style.transitionDelay="0"},1e3)),l.classList.add("maz-aos-animate"),P){const k=l.getAttribute("data-maz-aos-anchor");if(k){const b=document.querySelector(k);b&&a.unobserve(b)}a.unobserve(l)}}else l.classList.remove("maz-aos-animate")}}}async handleObserver(){await Ge(this.options.delay);const e=new IntersectionObserver(this.handleIntersect.bind(this),{...this.options.observer});for(const a of document.querySelectorAll("[data-maz-aos]")){const o=a.getAttribute("data-maz-aos-anchor");if(o){const c=document.querySelector(o);c?(c.setAttribute("data-maz-aos-children","true"),e.observe(c)):console.warn(`[maz-ui](aos) no element found with selector "${o}"`)}else e.observe(a)}}runAnimations(){if(ae())return this.handleObserver();console.warn("[MazAos](runAnimations) should be executed on client side")}}let C;const pt={install:(t,e)=>{C=new dt(e),t.provide("aos",C),ae()&&(e!=null&&e.router?e.router.afterEach(async()=>{C.runAnimations()}):C.runAnimations())}},ft=t=>{if(window.dataLayer&&window.gtag)return;const e=document.createElement("script");e.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,e.async=!0,document.head.appendChild(e),window.dataLayer=window.dataLayer||[],window.gtag=function(){dataLayer.push(arguments)},gtag("js",new Date),gtag("config",t)},gt=({id:t})=>{t&&typeof window<"u"&&ft(t)},ht=D({__name:"ColorContainer",props:{color:{type:String,required:!0},hex:{type:String,required:!0}},setup(t){return(e,a)=>(m(),$("div",{class:U(["color-container rounded",[`--${t.color}`]]),style:te(`background-color: var(--maz-color-${t.color}); color: var(--maz-color-${t.color}-contrast);`)},[g("span",null,O(t.color)+": "+O(t.hex),1)],6))}}),vt=G(ht,[["__scopeId","data-v-4f2137d5"]]),yt=["href","title"],bt=["src","alt"],wt=D({__name:"NpmBadge",props:{package:{type:String,required:!0},distTag:{type:String,default:"latest"}},setup(t){const e=t,a=d(()=>`https://www.npmjs.com/package/${e.package}`),o=d(()=>e.distTag?`${e.package}@${e.distTag}`:e.package),c=d(()=>`https://badgen.net/npm/v/${e.package}/${e.distTag}?label=${encodeURIComponent(o.value)}`);return(v,h)=>(m(),$("a",{class:"npm-badge",href:a.value,title:t.package,target:"_blank",rel:"noopener noreferrer"},[g("img",{src:c.value,alt:t.package},null,8,bt)],8,yt))}}),At=G(wt,[["__scopeId","data-v-fbd6ca08"]]),_t={...Me,enhanceApp(t){gt({id:"G-EM35TM23ZC"});const{app:e,router:{route:a}}=t;e.provide("mazIconPath","/maz-ui-3/icons"),e.component("ColorContainer",vt),e.component("NpmBadge",At),Object.entries(He).forEach(([v,h])=>{e.component(v,h)});const o={persistent:!1,position:"bottom-right",timeout:1e4},c={delay:500,animation:{duration:400,once:!1,delay:0}};e.use(nt,o),e.use(mt),e.use(pt,c),e.use(We),J(()=>a.path,()=>{I&&C.runAnimations()})}};function ne(t){if(t.extends){const e=ne(t.extends);return{...e,...t,async enhanceApp(a){e.enhanceApp&&await e.enhanceApp(a),t.enhanceApp&&await t.enhanceApp(a)}}}return t}const z=ne(_t),zt=D({name:"VitePressApp",setup(){const{site:t}=Se();return ee(()=>{qe(()=>{document.documentElement.lang=t.value.lang,document.documentElement.dir=t.value.dir})}),t.value.router.prefetchLinks&&Ne(),Re(),Be(),z.setup&&z.setup(),()=>Ve(z.Layout)}});async function kt(){const t=Et(),e=Tt();e.provide(Ee,t);const a=Ce(t.route);return e.provide(Oe,a),e.component("Content",Le),e.component("ClientOnly",xe),Object.defineProperties(e.config.globalProperties,{$frontmatter:{get(){return a.frontmatter.value}},$params:{get(){return a.page.value.params}}}),z.enhanceApp&&await z.enhanceApp({app:e,router:t,siteData:$e}),{app:e,router:t,data:a}}function Tt(){return Ie(zt)}function Et(){let t=I,e;return De(a=>{let o=Pe(a),c=null;return o&&(t&&(e=o),(t||e===o)&&(o=o.replace(/\.js$/,".lean.js")),c=p(()=>import(o),__vite__mapDeps([]))),I&&(t=!1),c},z.NotFound)}I&&kt().then(({app:t,router:e,data:a})=>{e.go().then(()=>{Te(e.route,a.site),t.mount("#app")})});export{kt as createApp};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/chunks/MazBtn.-G1eJNIw.js","assets/chunks/framework.z3pCfM0g.js","assets/chunks/x-mark.VHiIF9qc.js","assets/chunks/arrow-top-right-on-square.s_Q_5e-x.js","assets/chunks/exclamation-triangle.IKneZf1S.js","assets/chunks/exclamation-circle.ztuR8pEa.js","assets/chunks/information-circle.RfdVJbSa.js","assets/chunks/check-circle.QCwkdNFu.js","assets/chunks/link.dTJeRqNZ.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}