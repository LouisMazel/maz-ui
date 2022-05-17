import{_ as h,e as _,j as f,r as e,o as u,c as r,b as n,a,w as d,F as k,f as q,d as s,i as y,u as w}from"./app.d6fe649e.js";const z=n("h1",{id:"mazselect",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#mazselect","aria-hidden":"true"},"#"),s(" MazSelect")],-1),x=s("Before you have to import the global css files in your project, follow instructions in "),S=s("Getting Started"),V=n("h2",{id:"basic-usage",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#basic-usage","aria-hidden":"true"},"#"),s(" Basic usage")],-1),M=n("blockquote",null,[n("p",null,[n("code",null,"options"),s(" should be an array of "),n("code",null,"{ value: any, label: string }")])],-1),j=s("This component use "),B=s("MazInput"),C=s(", so it inherits all his props"),N={class:"flex flex-col gap-05"},L=y(`<div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MazSelect</span>
    <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color in colors<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>selectValue<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Select color<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>color<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:options</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>colors<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> MazSelect <span class="token keyword">from</span> <span class="token string">&#39;maz-ui/components/MazInput&#39;</span>
  <span class="token keyword">import</span> <span class="token punctuation">{</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

  <span class="token keyword">const</span> selectValue <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  <span class="token keyword">const</span> colors <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token string">&#39;primary&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;secondary&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;info&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;success&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;warning&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;danger&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;white&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;black&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span>

  <span class="token keyword">const</span> colorsObject <span class="token operator">=</span> colors<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">color</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">value</span><span class="token operator">:</span> color<span class="token punctuation">,</span>
    <span class="token literal-property property">label</span><span class="token operator">:</span> color<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="props-events-emitted" tabindex="-1"><a class="header-anchor" href="#props-events-emitted" aria-hidden="true">#</a> Props &amp; Events emitted</h2>`,2),P=_({setup(D){const o=f(),p=["primary","secondary","info","success","warning","danger","white","black"],v=p.map(t=>({value:t,label:t}));return(t,l)=>{const c=e("RouterLink"),m=e("MazSelect"),b=e("ComponentPropDoc");return u(),r(k,null,[z,n("blockquote",null,[n("p",null,[x,a(c,{to:"/guide/getting-started.html"},{default:d(()=>[S]),_:1})])]),V,M,n("blockquote",null,[n("p",null,[j,a(c,{to:"/components/maz-input.html"},{default:d(()=>[B]),_:1}),C])]),n("div",N,[(u(),r(k,null,q(p,i=>a(m,{key:i,label:"Select color",modelValue:o.value,"onUpdate:modelValue":l[0]||(l[0]=g=>o.value=g),color:i,options:w(v)},null,8,["modelValue","color","options"])),64))]),L,a(b,{component:"MazSelect"})],64)}}});var F=h(P,[["__file","maz-select.html.vue"]]);export{F as default};
