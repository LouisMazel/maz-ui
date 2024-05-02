import{p as e,s as r}from"./chunks/theme.BxREWgn5.js";import{d,g,c as n,a,A as h,z as l,u as F,t as o,x as y,al as k,X as A,o as i}from"./chunks/framework.Cj2Is6yp.js";const D={id:"frontmatter-title",tabindex:"-1"},c=a("a",{class:"header-anchor",href:"#frontmatter-title","aria-label":'Permalink to "{{ $frontmatter.title }}"'},"​",-1),E=k('<div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>You must install the <a href="./../plugins/wait#install">wait plugin</a> before using it</p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>More info about the <a href="./../plugins/wait">wait plugin</a> in its documentation</p></div><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to &quot;Usage&quot;">​</a></h2>',3),u={key:1},B=k(`<div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazFullscreenLoader</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> v-if</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">wait</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;">isLoading</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">MAIN_LOADER</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9AA5CE;">    Loading</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazFullscreenLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">p</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> v-else</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#9AA5CE;"> Loaded </span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">ts</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> { </span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;">onMounted</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> }</span><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">vue</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> { </span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;">useWait</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;"> sleep</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> }</span><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">maz-ui</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#BB9AF7;"> wait</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> useWait</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;">  onMounted</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">async</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> ()</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">    wait</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">MAIN_LOADER</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">    await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> sleep</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;">2000</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">    wait</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;">stop</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">MAIN_LOADER</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span></code></pre></div>`,1),w=JSON.parse('{"title":"useWait","description":"Vue composable for handling wait plugins","frontmatter":{"title":"useWait","description":"Vue composable for handling wait plugins"},"headers":[],"relativePath":"composables/use-wait.md","filePath":"composables/use-wait.md","lastUpdated":1714692269000}'),C={name:"composables/use-wait.md"},v=d({...C,setup(m){const s=e();return g(async()=>{s.start("MAIN_LOADER"),await r(2e3),s.stop("MAIN_LOADER")}),(t,f)=>{const p=A("MazFullscreenLoader");return i(),n("div",null,[a("h1",D,[h(l(t.$frontmatter.title)+" ",1),c]),a("p",null,l(t.$frontmatter.description),1),E,F(s).isLoading("MAIN_LOADER")?(i(),o(p,{key:0},{default:y(()=>[h(" Loading ")]),_:1})):(i(),n("p",u," Loaded ")),B])}}});export{w as __pageData,v as default};