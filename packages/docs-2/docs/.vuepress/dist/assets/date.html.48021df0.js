import{_ as r,e as d,j as k,k as v,r as o,o as m,c as g,b as n,a as t,t as b,u as _,F as h,d as a,i as l,U as f}from"./app.d6fe649e.js";const y=n("h1",{id:"date",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#date","aria-hidden":"true"},"#"),a(" date")],-1),x=n("blockquote",null,[n("p",null,[a("The module "),n("code",null,"date"),a(" is a function to format date")])],-1),q=a("This module use the native api "),V={href:"https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",target:"_blank",rel:"noopener noreferrer"},F=a("Intl.DateTimeFormat"),I=a(" from browsers"),T={style:{padding:"16px","margin-top":"16px","background-color":"var(--maz-color-bg-lighter)"},class:"flex flex-center rounded gap-05"},w=a(" formatted value: "),z=l(`<div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MazInput</span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dateValue<span class="token punctuation">&quot;</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>date<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
    <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">padding</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span> <span class="token property">margin-top</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span> <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--maz-color-bg-lighter<span class="token punctuation">)</span><span class="token punctuation">;</span></span><span class="token punctuation">&quot;</span></span></span>
  <span class="token punctuation">&gt;</span></span>
    {{ dateFormatted }}
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> <span class="token punctuation">{</span> date <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;maz-ui&#39;</span>
  <span class="token keyword">import</span> <span class="token punctuation">{</span> ref<span class="token punctuation">,</span> computed <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

  <span class="token keyword">const</span> dateValue <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token string">&#39;2022-02-01&#39;</span><span class="token punctuation">)</span>

  <span class="token keyword">const</span> dateFormatted <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    dateValue<span class="token punctuation">.</span>value <span class="token operator">?</span> <span class="token function">date</span><span class="token punctuation">(</span>dateValue<span class="token punctuation">.</span>value<span class="token punctuation">,</span> <span class="token string">&#39;en-US&#39;</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
  <span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="options" tabindex="-1"><a class="header-anchor" href="#options" aria-hidden="true">#</a> Options</h2>`,2),D=a("All options from "),S={href:"https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",target:"_blank",rel:"noopener noreferrer"},O=a("Intl.DateTimeFormat"),U=a(" are availables"),N=l(`<h2 id="default-options" tabindex="-1"><a class="header-anchor" href="#default-options" aria-hidden="true">#</a> Default options</h2><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">const</span> <span class="token constant">DEFAULT_OPTIONS</span><span class="token operator">:</span> Intl<span class="token punctuation">.</span>DateTimeFormatOptions <span class="token operator">=</span> <span class="token punctuation">{</span>
  month<span class="token operator">:</span> <span class="token string">&#39;short&#39;</span><span class="token punctuation">,</span>
  day<span class="token operator">:</span> <span class="token string">&#39;numeric&#39;</span><span class="token punctuation">,</span>
  year<span class="token operator">:</span> <span class="token string">&#39;numeric&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),j=d({setup(E){const s=k("2022-02-01"),c=v(()=>s.value?f(s.value,"en-US"):void 0);return(B,e)=>{const p=o("ExternalLinkIcon"),i=o("MazInput");return m(),g(h,null,[y,x,n("blockquote",null,[n("p",null,[q,n("a",V,[F,t(p)]),I])]),t(i,{modelValue:s.value,"onUpdate:modelValue":e[0]||(e[0]=u=>s.value=u),type:"date"},null,8,["modelValue"]),n("div",T,[w,n("strong",null,b(_(c)),1)]),z,n("blockquote",null,[n("p",null,[D,n("a",S,[O,t(p)]),U])]),N],64)}}});var M=r(j,[["__file","date.html.vue"]]);export{M as default};
