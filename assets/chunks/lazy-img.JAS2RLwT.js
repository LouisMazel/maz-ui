var d=Object.defineProperty;var c=(a,s,e)=>s in a?d(a,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[s]=e;var r=(a,s,e)=>(c(a,typeof s!="symbol"?s+"":s,e),e);import{X as m}from"./framework.z3pCfM0g.js";const g="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",u={baseClass:"m-lazy-img",loadedClass:"m-lazy-loaded",loadingClass:"m-lazy-loading",errorClass:"m-lazy-error",noPhotoClass:"m-lazy-no-photo",noPhoto:!1,observerOnce:!0,loadOnce:!1,noUseErrorPhoto:!1,observerOptions:{threshold:.1}};class v{constructor(s={}){r(this,"observers",[]);r(this,"defaultOptions",u);r(this,"options");r(this,"onImgLoadedCallback");r(this,"onImgErrorCallback");r(this,"hasImgLoaded",!1);this.options=this.buildOptions(s),this.onImgLoadedCallback=this.imageIsLoaded.bind(this),this.onImgErrorCallback=this.imageHasError.bind(this)}async loadErrorPhoto(){const{default:s}=await m(()=>import("./no-photography.WcfB9OSI.js"),__vite__mapDeps([]));return s}buildOptions(s){return{...this.defaultOptions,...s,observerOptions:{...this.defaultOptions.observerOptions,...s.observerOptions}}}removeClass(s,e){s.classList.remove(e)}addClass(s,e){s.classList.add(e)}removeAllStateClasses(s){this.removeClass(s,this.options.loadedClass),this.removeClass(s,this.options.loadingClass),this.removeClass(s,this.options.errorClass),this.removeClass(s,this.options.noPhotoClass)}setBaseClass(s){this.addClass(s,this.options.baseClass)}imageIsLoading(s){var e,t;this.addClass(s,this.options.loadingClass),(t=(e=this.options).onLoading)==null||t.call(e,s)}imageHasNoPhoto(s){this.removeClass(s,this.options.loadingClass),this.addClass(s,this.options.noPhotoClass),this.setDefaultPhoto(s)}imageIsLoaded(s){var e,t;this.hasImgLoaded=!0,this.removeClass(s,this.options.loadingClass),this.addClass(s,this.options.loadedClass),(t=(e=this.options).onLoaded)==null||t.call(e,s)}imageHasError(s,e){var t,o;console.warn("[maz-ui][MazLazyImg] Error while loading image",e),this.removeClass(s,this.options.loadingClass),this.addClass(s,this.options.errorClass),(o=(t=this.options).onError)==null||o.call(t,s),this.setDefaultPhoto(s)}getImageUrl(s,e){const t=this.getImgElement(s).getAttribute("data-lazy-src");if(t)return t;e.value;const o=typeof e.value=="object"?e.value.src:e.value;return o||console.warn("[maz-ui][MazLazyImg] src url is not defined"),o}async setPictureSourceUrls(s){const e=s.querySelectorAll("source");if(e.length>0)for await(const t of e){const o=t.getAttribute("data-lazy-srcset");o?t.srcset=o:console.warn('[maz-ui][MazLazyImg] the "[data-lazy-srcset]" attribute is not provided on "<source />"')}else console.warn('[maz-ui][MazLazyImg] No "<source />" elements provided into the "<picture />" element'),this.imageHasError(s)}hasBgImgMode(s){return s.arg==="bg-image"}isPictureElement(s){return s instanceof HTMLPictureElement}getImgElement(s){return this.isPictureElement(s)?s.querySelector("img"):s}async setDefaultPhoto(s){if(this.options.noUseErrorPhoto)return;const e=this.options.errorPhoto??await this.loadErrorPhoto(),t=s.querySelectorAll("source");if(t.length>0)for await(const o of t)o.srcset=e;else this.setImgSrc(s,e)}addEventListenerToImg(s){const e=this.getImgElement(s);e.addEventListener("load",()=>this.onImgLoadedCallback(s),{once:!0}),e.addEventListener("error",t=>this.onImgErrorCallback(s,t),{once:!0})}async loadImage(s,e){if(this.imageIsLoading(s),this.isPictureElement(s))this.addEventListenerToImg(s),await this.setPictureSourceUrls(s);else{const t=this.getImageUrl(s,e);if(!t)return this.imageHasError(s);this.hasBgImgMode(e)?(s.style.backgroundImage=`url('${t}')`,this.imageIsLoaded(s)):(this.addEventListenerToImg(s),this.setImgSrc(s,t))}}setImgSrc(s,e){const t=this.getImgElement(s);t.src=e}handleIntersectionObserver(s,e,t,o){var h,i;this.observers.push(o);for(const n of t)if(n.isIntersecting){if((i=(h=this.options).onIntersecting)==null||i.call(h,n.target),this.options.observerOnce&&o.unobserve(s),this.options.loadOnce&&this.hasImgLoaded)return;this.loadImage(s,e)}}createObserver(s,e){const t=(i,n)=>{this.handleIntersectionObserver(s,e,i,n)},o=this.options.observerOptions;new IntersectionObserver(t,o).observe(s)}async imageHandler(s,e,t){if(t==="update")for await(const o of this.observers)o.unobserve(s);window.IntersectionObserver?this.createObserver(s,e):this.loadImage(s,e)}async bindUpdateHandler(s,e,t){if(this.options.noPhoto)return this.imageHasNoPhoto(s);await this.imageHandler(s,e,t)}async add(s,e){if(this.hasBgImgMode(e)&&this.isPictureElement(s))throw new Error(`[MazLazyImg] You can't use the "bg-image" mode with "<picture />" element`);setTimeout(()=>this.setBaseClass(s),0),s.getAttribute("src")||this.setImgSrc(s,g),await this.bindUpdateHandler(s,e,"bind")}async update(s,e){e.value!==e.oldValue&&(this.hasImgLoaded=!1,this.removeAllStateClasses(s),await this.bindUpdateHandler(s,e,"update"))}remove(s,e){this.hasImgLoaded=!1,this.hasBgImgMode(e)&&(s.style.backgroundImage=""),this.removeAllStateClasses(s);for(const t of this.observers)t.unobserve(s);this.observers=[]}}let l;const f={created(a,s){const e=typeof s.value=="object"?s.value:{};l=new v(e),l.add(a,s)},updated(a,s){l.update(a,s)},unmounted(a,s){l.remove(a,s)}};export{f as v};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}