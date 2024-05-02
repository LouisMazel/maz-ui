import{s as l,c as h,a as i,A as t,z as a,b as k,al as e,X as p,o as r}from"./chunks/framework.Cj2Is6yp.js";const b=JSON.parse('{"title":"Nuxt Module","description":"This module enables auto imports of CSS files, components, composables and installs plugins and directives","frontmatter":{"title":"Nuxt Module","description":"This module enables auto imports of CSS files, components, composables and installs plugins and directives"},"headers":[],"relativePath":"guide/nuxt.md","filePath":"guide/nuxt.md","lastUpdated":1714692269000}'),y={name:"guide/nuxt.md"},d={id:"frontmatter-title",tabindex:"-1"},o=i("a",{class:"header-anchor",href:"#frontmatter-title","aria-label":'Permalink to "{{ $frontmatter.title }}"'},"​",-1),g=i("div",{class:"info custom-block"},[i("p",{class:"custom-block-title"},"INFO"),i("p",null,"Module compatible with Nuxt v3 or later")],-1),D=i("h2",{id:"installation",tabindex:"-1"},[t("Installation "),i("a",{class:"header-anchor",href:"#installation","aria-label":'Permalink to "Installation"'},"​")],-1),c={class:"maz-flex maz-gap-0.5"},f=e(`<div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;"> maz-ui</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"># or yarn add maz-ui</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"># or pnpm add maz-ui</span></span></code></pre></div><p>Add it to your Nuxt modules:</p><p>See all <a href="#module-options">available options here</a></p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;"> default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> defineNuxtConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">  modules</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">maz-ui/nuxt</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">]</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">  mazUi</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">    injectComponents</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">    injectCss</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">    injectAos</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#41A6B5;">      injectCss</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">    }</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">    injectUseToast</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">    injectUseThemeHandler</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">    devtools</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#FF9E64;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">  }</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F7768E;--shiki-light-font-weight:inherit;--shiki-dark-font-weight:bold;">  ...</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  // You can also use the public runtime config</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">  runtimeConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#A9B1D6;">: </span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#73DACA;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#41A6B5;">      mazUi</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F7768E;--shiki-light-font-weight:inherit;--shiki-dark-font-weight:bold;">        ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">})</span></span></code></pre></div><h2 id="basic-usage" tabindex="-1">Basic usage <a class="header-anchor" href="#basic-usage" aria-label="Permalink to &quot;Basic usage&quot;">​</a></h2><p>The components, plugins and tools are auto-imported</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazBtn</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;">click</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">toggleTheme</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9AA5CE;">    Button auto-imported</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#DE5971;">MazBtn</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">ts</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#BB9AF7;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#BB9AF7;"> toast</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> useToast</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#9D7CD8;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  const</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#BB9AF7;">    autoSetTheme</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#BB9AF7;">    toggleTheme</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">  }</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;"> useThemeHandler</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#C0CAF5;">  toast</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;">show</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">Success message</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#7AA2F7;">  autoSetTheme</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#F7768E;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#BA3C97;">&gt;</span></span></code></pre></div><h2 id="module-options" tabindex="-1">Module Options <a class="header-anchor" href="#module-options" aria-label="Permalink to &quot;Module Options&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light tokyo-night vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#7DCFFF;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;"> MazUiNuxtOptions</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of main css file</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> true</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#73DACA;">  injectCss</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Install aos plugin and enable auto-import of useAos composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#73DACA;">  injectAos</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">?:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">    |</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">    |</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">Omit</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">AosOptions</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">,</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;"> &#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECE6A;">router</span><span style="--shiki-light:#032F62;--shiki-dark:#89DDFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#89DDFF;">&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">        /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">         * Auto inject aos CSS file</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">         * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> true</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">         */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#73DACA;">        injectCss</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">        /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">         * Set \`true\` to re-run animations on page change</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">         * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">         */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#73DACA;">        router</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">      })</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Install toaster plugin and enable auto-import of useToast composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseToast</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;"> ToasterOptions</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Install wait plugin and enable auto-import of useWait composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseWait</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of useThemeHandler composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseThemeHandler</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;"> ThemeHandlerOptions</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of useIdleTimeout composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseIdleTimeout</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of useUserVisibility composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseUserVisibility</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of useTimer composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseTimer</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of useWindowSize composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseWindowSize</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of useBreakpoints composable</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectUseBreakpoints</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Globally install of v-zoom-img directive</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  installVZoomImg</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Globally install of v-click-outside directive</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  installVClickOutside</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Globally install of v-fullscreen-img directive</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  installVFullscreenImg</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Globally install of v-lazy-img directive</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  installVLazyImg</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;"> vLazyImgOptions</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Globally install of v-tooltip directive</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  installVTooltip</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span><span style="--shiki-light:#D73A49;--shiki-dark:#89DDFF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;"> vTooltipOptions</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable auto-import of all components</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> true</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  injectComponents</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Default path to public svg icons folder for \`&lt;MazIcon /&gt;\` component</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> undefined</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  defaultMazIconPath</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> string</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * Enable Nuxt Devtools integration</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#646E9C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">@default</span><span style="--shiki-light:#24292E;--shiki-dark:#5A638C;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> true</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#51597D;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#C0CAF5;">  devtools</span><span style="--shiki-light:#D73A49;--shiki-dark:#BB9AF7;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#0DB9D7;"> boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#9ABDF5;">}</span></span></code></pre></div>`,9);function A(s,F,C,E,u,B){const n=p("NpmBadge");return r(),h("div",null,[i("h1",d,[t(a(s.$frontmatter.title)+" ",1),o]),i("p",null,a(s.$frontmatter.description),1),g,D,i("div",c,[k(n,{package:"maz-ui"})]),f])}const v=l(y,[["render",A]]);export{b as __pageData,v as default};