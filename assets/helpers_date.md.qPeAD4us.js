import{G as p}from"./chunks/theme.9vhiVbfA.js";import{d as r,e as d,f as F,c as g,a as s,A as a,z as t,b as o,am as D,Y as y,o as c}from"./chunks/framework.CmVSId67.js";const A={id:"frontmatter-title",tabindex:"-1"},E=s("a",{class:"header-anchor",href:"#frontmatter-title","aria-label":'Permalink to "{{ $frontmatter.title }}"'},"​",-1),C=s("blockquote",null,[s("p",null,[a("This module use the native api "),s("a",{href:"https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",target:"_blank",rel:"noreferrer"},"Intl.DateTimeFormat"),a(" from browsers")])],-1),u={style:{padding:"16px","margin-top":"16px","background-color":"var(--maz-color-bg-lighter)"},class:"flex flex-center rounded gap-05"},m=D(`<div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazInput</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> v-model</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">dateValue</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">date</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;"> /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    style</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#7AA2F7;">padding</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> 16</span><span style="--shiki-light:#D73A49;--shiki-dark:#F7768E;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">;</span><span style="--shiki-light:#005CC5;--shiki-dark:#7AA2F7;"> margin-top</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> 16</span><span style="--shiki-light:#D73A49;--shiki-dark:#F7768E;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">;</span><span style="--shiki-light:#005CC5;--shiki-dark:#7AA2F7;"> background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> var</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#C0CAF5;">--maz-color-bg-lighter</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">;</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">    {{</span><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;"> dateFormatted</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> }}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">ts</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> { </span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;">date</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> }</span><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">maz-ui</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> { </span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;">ref</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;"> computed</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> }</span><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">vue</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#BB9AF7;"> dateValue</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">2022-02-01</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#BB9AF7;"> dateFormatted</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> computed</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(()</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> =&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">    dateValue</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#7DCFFF;">value</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> ?</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> date</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">dateValue</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#7DCFFF;">value</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">en-US</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> :</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> undefined</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">  )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span></code></pre></div><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h2><blockquote><p>All options from <a href="https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat" target="_blank" rel="noreferrer">Intl.DateTimeFormat</a> are available</p></blockquote><h2 id="default-options" tabindex="-1">Default options <a class="header-anchor" href="#default-options" aria-label="Permalink to &quot;Default options&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#BB9AF7;"> DEFAULT_OPTIONS</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;"> Intl</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">DateTimeFormatOptions</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">  month</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">short</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">  day</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">numeric</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">  year</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">numeric</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">}</span></span></code></pre></div>`,5),_=JSON.parse('{"title":"date","description":"The module date is a function that formats date","frontmatter":{"title":"date","description":"The module date is a function that formats date"},"headers":[],"relativePath":"helpers/date.md","filePath":"helpers/date.md","lastUpdated":1712658001000}'),B={name:"helpers/date.md"},q=r({...B,setup(f){const i=d("2022-02-01"),l=F(()=>i.value?p(i.value,"en-US"):void 0);return(n,h)=>{const k=y("MazInput");return c(),g("div",null,[s("h1",A,[a(t(n.$frontmatter.title)+" ",1),E]),s("p",null,t(n.$frontmatter.description),1),C,o(k,{modelValue:i.value,"onUpdate:modelValue":h[0]||(h[0]=e=>i.value=e),type:"date"},null,8,["modelValue"]),s("div",u,[a(" formatted value: "),s("strong",null,t(l.value),1)]),m])}}});export{_ as __pageData,q as default};