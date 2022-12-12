import{_ as o,o as l,c as p,a as s,b as e,t as n,f as t}from"./app.2b23eb6f.js";const g=JSON.parse('{"title":"useAos","description":"Vue composable to handling aos plugin in your components","frontmatter":{"title":"useAos","description":"Vue composable to handling aos plugin in your components"},"headers":[{"level":2,"title":"Usage","slug":"usage","link":"#usage","children":[]},{"level":2,"title":"Documentation","slug":"documentation","link":"#documentation","children":[]}],"relativePath":"composables/use-aos.md","lastUpdated":1670541083000}'),c={name:"composables/use-aos.md"},r={id:"frontmatter-title",tabindex:"-1"},i=s("a",{class:"header-anchor",href:"#frontmatter-title","aria-hidden":"true"},"#",-1),D=t(`<div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>You must install <a href="./../plugins/aos#install">aos plugin</a> before use it</p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>More info about <a href="./../plugins/aos">aos plugin</a> in its documentation</p></div><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">img</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">data-maz-aos</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">scale-in</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">lang</span><span style="color:#A6ACCD;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">setup</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">useAos</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">vue</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> aos </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useAos</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">onMounted</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">aos</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">runAnimations</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="documentation" tabindex="-1">Documentation <a class="header-anchor" href="#documentation" aria-hidden="true">#</a></h2>`,5);function y(a,F,A,u,d,C){return l(),p("div",null,[s("h1",r,[e(n(a.$frontmatter.title)+" ",1),i]),s("p",null,n(a.$frontmatter.description),1),D])}const h=o(c,[["render",y]]);export{g as __pageData,h as default};
