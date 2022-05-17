import{_ as k,e as m,j as l,r as p,o as v,c as g,b as n,a as o,w as b,t as u,F as f,d as s,i as h}from"./app.d6fe649e.js";const q=n("h1",{id:"mazinputprice",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#mazinputprice","aria-hidden":"true"},"#"),s(" MazInputPrice")],-1),_=s("Before you have to import the global css files in your project, follow instructions in "),P=s("Getting Started"),y=n("h2",{id:"basic-usage",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#basic-usage","aria-hidden":"true"},"#"),s(" Basic usage")],-1),z=h(`<div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MazInputPrice</span>
    <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>priceValue<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Enter your price<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">currency</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>USD<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">locale</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>en-US<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:min</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>5<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:max</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1000<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@formatted</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>formattedPrice = $event<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>


<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> <span class="token punctuation">{</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>
  <span class="token keyword">import</span> MazInputPrice <span class="token keyword">from</span> <span class="token string">&#39;maz-ui/components/MazInputPrice&#39;</span>

  <span class="token keyword">const</span> priceValue <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> formattedPrice <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="props-events-emitted" tabindex="-1"><a class="header-anchor" href="#props-events-emitted" aria-hidden="true">#</a> Props, Events emitted</h2>`,2),x=m({setup(V){const t=l(2),c=l();return(w,a)=>{const i=p("RouterLink"),r=p("MazInputPrice"),d=p("ComponentPropDoc");return v(),g(f,null,[q,n("blockquote",null,[n("p",null,[_,o(i,{to:"/guide/getting-started.html"},{default:b(()=>[P]),_:1})])]),y,n("p",null,[o(r,{modelValue:t.value,"onUpdate:modelValue":a[0]||(a[0]=e=>t.value=e),label:"Enter your price",currency:"USD",locale:"en-US",min:5,max:1e3,onFormatted:a[1]||(a[1]=e=>c.value=e)},null,8,["modelValue"])]),n("p",null,"priceValue: "+u(t.value),1),n("p",null,"formattedPrice: "+u(c.value),1),z,o(d,{component:"MazInputPrice"})],64)}}});var M=k(x,[["__file","maz-input-price.html.vue"]]);export{M as default};
