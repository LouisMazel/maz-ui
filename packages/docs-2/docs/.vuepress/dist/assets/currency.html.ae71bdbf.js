import{_ as i,e as d,j as k,k as m,r as o,o as v,c as b,b as n,a as t,t as g,u as _,F as h,d as s,i as c,B as f}from"./app.d6fe649e.js";const y=n("h1",{id:"currency",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#currency","aria-hidden":"true"},"#"),s(" currency")],-1),x=n("blockquote",null,[n("p",null,[s("The module "),n("code",null,"currency"),s(" is a function to format numbers to currency")])],-1),q=s("This module use the native api "),F={href:"https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",target:"_blank",rel:"noopener noreferrer"},V=s("Intl.NumberFormat"),w=s(" from browsers"),I=n("p",null,"Enter only numbers",-1),N={style:{padding:"16px","margin-top":"16px","background-color":"var(--maz-color-bg-lighter)"},class:"flex flex-center rounded gap-05"},z=s(" formatted value: "),E=c(`<div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MazInput</span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>numberValue<span class="token punctuation">&quot;</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>number<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
    <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">padding</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span> <span class="token property">margin-top</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span> <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--maz-color-bg-lighter<span class="token punctuation">)</span><span class="token punctuation">;</span></span><span class="token punctuation">&quot;</span></span></span>
  <span class="token punctuation">&gt;</span></span>
    {{ priceFormatted }}
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> <span class="token punctuation">{</span> currency <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;maz-ui&#39;</span>
  <span class="token keyword">import</span> <span class="token punctuation">{</span> ref<span class="token punctuation">,</span> computed <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

  <span class="token keyword">const</span> numberValue <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">69</span><span class="token punctuation">)</span>

  <span class="token keyword">const</span> priceFormatted <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    <span class="token function">currency</span><span class="token punctuation">(</span>numberValue<span class="token punctuation">.</span>value<span class="token punctuation">,</span> <span class="token string">&#39;fr-FR&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">currency</span><span class="token operator">:</span> <span class="token string">&#39;EUR&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="options" tabindex="-1"><a class="header-anchor" href="#options" aria-hidden="true">#</a> Options</h2>`,2),R=s("All options from "),B={href:"https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",target:"_blank",rel:"noopener noreferrer"},O=s("Intl.NumberFormat"),j=s(" are availables"),S=c(`<div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">FilterCurrencyOptions</span> <span class="token keyword">extends</span> <span class="token class-name">Intl</span><span class="token punctuation">.</span>NumberFormatOptions <span class="token punctuation">{</span>
  round<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),C=d({setup(M){const a=k(69),l=m(()=>f(a.value,"fr-FR",{currency:"EUR"}));return(T,e)=>{const p=o("ExternalLinkIcon"),u=o("MazInput");return v(),b(h,null,[y,x,n("blockquote",null,[n("p",null,[q,n("a",F,[V,t(p)]),w])]),I,t(u,{modelValue:a.value,"onUpdate:modelValue":e[0]||(e[0]=r=>a.value=r),type:"number"},null,8,["modelValue"]),n("div",N,[z,n("strong",null,g(_(l)),1)]),E,n("blockquote",null,[n("p",null,[R,n("a",B,[O,t(p)]),j])]),S],64)}}});var G=i(C,[["__file","currency.html.vue"]]);export{G as default};
