import{_ as o,e as l,M as c,x as i,o as u,c as r,a as d,w as k,u as a,A as m,F as v,b as n,d as s,i as h}from"./app.d6fe649e.js";const g=n("h1",{id:"theme-handler",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#theme-handler","aria-hidden":"true"},"#"),s(" theme-handler")],-1),b=n("p",null,"It's a Vue composable to handling UI theme: Automatically set dark and light theme and switch between them",-1),y=n("h2",{id:"demo",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#demo","aria-hidden":"true"},"#"),s(" Demo")],-1),T=n("br",null,null,-1),_=s(" Toggle theme "),f=h(`<h2 id="how-to-use-it" tabindex="-1"><a class="header-anchor" href="#how-to-use-it" aria-hidden="true">#</a> How to use it ?</h2><p>In your main Vue component (often App.vue - default layout for nuxt)</p><p><code>App.vue</code> or <code>layouts/default.vue</code></p><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
    <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>app<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{
      <span class="token punctuation">&#39;</span>--has-dark-theme<span class="token punctuation">&#39;</span>: hasDarkTheme,
      <span class="token punctuation">&#39;</span>--has-light-theme<span class="token punctuation">&#39;</span>: hasLightTheme,
    }<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- Theme switching --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MazBtn</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>button<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>toggleTheme<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      Toggle theme
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>MazBtn</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> <span class="token punctuation">{</span> onMounted <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

  <span class="token keyword">import</span> <span class="token punctuation">{</span> useThemeHandler <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;maz-ui&#39;</span>
  <span class="token keyword">import</span> type <span class="token punctuation">{</span> ThemeHandlerOptions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;maz-ui&#39;</span>
  <span class="token keyword">import</span> MazBtn <span class="token keyword">from</span> <span class="token string">&#39;maz-ui/components/MazBtn&#39;</span>

  <span class="token comment">// optional</span>
  <span class="token keyword">const</span> <span class="token literal-property property">options</span><span class="token operator">:</span> ThemeHandlerOptions <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment">/* should be &quot;dark&quot; to works with maz-ui */</span>
    <span class="token literal-property property">darkClass</span><span class="token operator">:</span> <span class="token string">&#39;dark&#39;</span><span class="token punctuation">,</span>
    <span class="token comment">/* local storage preferences */</span>
    <span class="token literal-property property">storageThemeKey</span><span class="token operator">:</span> <span class="token string">&#39;theme&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">storageThemeValueDark</span><span class="token operator">:</span> <span class="token string">&#39;dark&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">storageThemeValueLight</span><span class="token operator">:</span> <span class="token string">&#39;light&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> <span class="token punctuation">{</span>
    autoSetTheme<span class="token punctuation">,</span>
    toggleTheme<span class="token punctuation">,</span>
    theme<span class="token punctuation">,</span>
    hasDarkTheme<span class="token punctuation">,</span>
    hasLightTheme
  <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useThemeHandler</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span>

  <span class="token function">onMounted</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">/*
    * will automatically set the theme according
    * with the user preferences and class to &lt;html /&gt; element
    */</span>
    <span class="token function">autoSetTheme</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),w=l({setup(q){const t={darkClass:"dark",storageThemeKey:"theme",storageThemeValueDark:"dark",storageThemeValueLight:"light"},{autoSetTheme:e,toggleTheme:p,theme:x,hasDarkTheme:V,hasLightTheme:z}=c(t);return i(()=>{e()}),(M,B)=>(u(),r(v,null,[g,b,y,T,d(a(m),{type:"button",onClick:a(p)},{default:k(()=>[_]),_:1},8,["onClick"]),f],64))}});var D=o(w,[["__file","theme-handler.html.vue"]]);export{D as default};
