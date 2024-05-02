import{d as p,c as r,a as n,A as o,z as e,b as s,x as g,al as t,X as l,o as c}from"./chunks/framework.Cj2Is6yp.js";const F={id:"frontmatter-title",tabindex:"-1"},y=n("a",{class:"header-anchor",href:"#frontmatter-title","aria-label":'Permalink to "{{ $frontmatter.title }}"'},"​",-1),D=t('<div class="info custom-block"><p class="custom-block-title">INFO</p><p>Before you have to import the global css files in your project, follow instructions in <a href="./../guide/getting-started">Getting Started</a></p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This component uses <a href="./../directives/lazy-img">vLazyImg</a> directive</p></div><h2 id="basic-usage" tabindex="-1">Basic usage <a class="header-anchor" href="#basic-usage" aria-label="Permalink to &quot;Basic usage&quot;">​</a></h2>',3),u=t(`<div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazAvatar</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> src</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&amp;scale=80</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">ts</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;"> MazAvatar</span><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">maz-ui/components/MazAvatar</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span></code></pre></div><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>See all the options props <a href="#props-event-slots">here</a></p></div>`,3),m={class:"flex space-between gap-05 items-center flex-wrap"},E=t(`<div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazAvatar</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    caption</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">Louis Mazel</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    size</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">1.5rem</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazAvatar</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    src</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&amp;scale=80&amp;seed=maz-ui</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    size</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">2rem</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    href</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&amp;scale=80&amp;seed=maz-ui</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    target</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">_blank</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    rounded-size</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">none</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    clickable</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    no-size</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> #</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">icon</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">      &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazIcon</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> name</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">eye</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazAvatar</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazAvatar</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    src</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&amp;scale=80&amp;seed=200</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    size</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">2.5rem</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    clickable</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    rounded-size</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">xl</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">    @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">click</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">clicked</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazAvatar</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    src</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&amp;scale=80&amp;seed=600</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    size</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">3rem</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">    bordered</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">ts</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">  import</span><span style="--shiki-light:#24292E;--shiki-dark:#0DB9D7;"> MazAvatar</span><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">maz-ui/components/MazAvatar</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> clicked</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> ()</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> { </span><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">console</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">clicked</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">) }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span></code></pre></div><h2 id="on-error" tabindex="-1">On Error <a class="header-anchor" href="#on-error" aria-label="Permalink to &quot;On Error&quot;">​</a></h2>`,2),A=t('<div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-dark:#FF5370;--shiki-light-font-style:italic;--shiki-dark-font-style:inherit;">MazAvatar</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> @error</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">error</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;"> /&gt;</span></span></code></pre></div><h2 id="fallback-image-loaded-on-error" tabindex="-1">Fallback image loaded on error <a class="header-anchor" href="#fallback-image-loaded-on-error" aria-label="Permalink to &quot;Fallback image loaded on error&quot;">​</a></h2>',2),b=t('<div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-dark:#FF5370;--shiki-light-font-style:italic;--shiki-dark-font-style:inherit;">MazAvatar</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> fallback-src</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&amp;scale=80&amp;seed=100</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;"> /&gt;</span></span></code></pre></div><h2 id="props-event-slots" tabindex="-1">Props, Event &amp; Slots <a class="header-anchor" href="#props-event-slots" aria-label="Permalink to &quot;Props, Event &amp; Slots&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table><thead><tr><th>Prop name</th><th>Description</th><th>Type</th><th>Values</th><th>Default</th></tr></thead><tbody><tr><td>src</td><td>The source of the image</td><td>union</td><td>-</td><td>undefined</td></tr><tr><td>caption</td><td>The caption of the avatar</td><td>union</td><td>-</td><td>undefined</td></tr><tr><td>href</td><td>The link of the avatar</td><td>string</td><td>-</td><td>undefined</td></tr><tr><td>to</td><td>The link (router-link) of the avatar</td><td>union</td><td>-</td><td>undefined</td></tr><tr><td>alt</td><td>The alt of the image</td><td>string</td><td>-</td><td>&#39;avatar image&#39;</td></tr><tr><td>target</td><td>The target of the link</td><td>string</td><td>-</td><td>&#39;_self&#39;</td></tr><tr><td>size</td><td>The size of the avatar</td><td>string</td><td>-</td><td>undefined</td></tr><tr><td>bordered</td><td>Add a border to the avatar</td><td>boolean</td><td>-</td><td></td></tr><tr><td>clickable</td><td>Make the avatar clickable</td><td>boolean</td><td>-</td><td></td></tr><tr><td>square</td><td>Make the avatar square</td><td>boolean</td><td>-</td><td></td></tr><tr><td>noElevation</td><td>Remove the shadow</td><td>boolean</td><td>-</td><td></td></tr><tr><td>showCaption</td><td>Show the caption</td><td>boolean</td><td>-</td><td></td></tr><tr><td>imageHeightFull</td><td>Make the image height full</td><td>boolean</td><td>-</td><td></td></tr><tr><td>noLoader</td><td>Remove the loader</td><td>boolean</td><td>-</td><td></td></tr><tr><td>buttonColor</td><td>The color of the clickable button</td><td>Color</td><td>-</td><td>&#39;info&#39;</td></tr><tr><td>noClickableIcon</td><td>Remove the icon on hover when component is clickable</td><td>boolean</td><td>-</td><td></td></tr><tr><td>letterCount</td><td>Number of letters to display in the round text</td><td>number</td><td>-</td><td>undefined</td></tr><tr><td>roundedSize</td><td>Size of the rounded<br><code>@values</code> <code>&#39;none&#39; | &#39;sm&#39; | &#39;md&#39; | &#39;lg&#39; | &#39;xl&#39; | &#39;full&#39;</code></td><td>union</td><td>-</td><td>&#39;full&#39;</td></tr><tr><td>fallbackSrc</td><td>The fallback src to replace the src on loading error</td><td>string</td><td>-</td><td>undefined</td></tr><tr><td>noPhoto</td><td>Load the fallback image by default</td><td>boolean</td><td>-</td><td></td></tr></tbody></table><h3 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to &quot;Events&quot;">​</a></h3><table><thead><tr><th>Event name</th><th>Properties</th><th>Description</th></tr></thead><tbody><tr><td>click</td><td></td><td></td></tr><tr><td>error</td><td></td><td>Emitted when the image is in error</td></tr><tr><td>loaded</td><td></td><td>Emitted when the image is loaded</td></tr><tr><td>loading</td><td></td><td>Emitted when the image is loading</td></tr><tr><td>intersecting</td><td></td><td>Emitted when the image is intersecting</td></tr></tbody></table><h3 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h3><table><thead><tr><th>Name</th><th>Description</th><th>Bindings</th></tr></thead><tbody><tr><td>round-text</td><td></td><td></td></tr><tr><td>icon</td><td></td><td></td></tr><tr><td>caption</td><td></td><td></td></tr></tbody></table>',8),q=JSON.parse('{"title":"MazAvatar","description":"MazAvatar is a standalone component to display images or svgs in a wrapper","frontmatter":{"title":"MazAvatar","description":"MazAvatar is a standalone component to display images or svgs in a wrapper"},"headers":[],"relativePath":"components/maz-avatar.md","filePath":"components/maz-avatar.md","lastUpdated":1714692269000}'),C={name:"components/maz-avatar.md"},z=p({...C,setup(B){const h=()=>{console.log("clicked")},d=a=>{console.error("error",a)};return(a,v)=>{const i=l("MazAvatar",!0),k=l("MazIcon");return c(),r("div",null,[n("h1",F,[o(e(a.$frontmatter.title)+" ",1),y]),n("p",null,e(a.$frontmatter.description),1),D,s(i,{src:"https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80"}),u,n("div",m,[s(i,{caption:"Louis Mazel",size:"1.5rem"}),s(i,{src:"https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui",size:"2rem",href:"https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui",target:"_blank","rounded-size":"none",clickable:""},{icon:g(()=>[s(k,{name:"eye",style:{color:"white"},size:"2rem"})]),_:1}),s(i,{src:"https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=200",size:"2.5rem",clickable:"","rounded-size":"xl","button-color":"danger",onClick:h}),s(i,{src:"https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=600",size:"3rem",bordered:"",noElevation:""})]),E,s(i,{onError:d}),A,s(i,{class:"vp-raw","fallback-src":"https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100"}),b])}}});export{q as __pageData,z as default};