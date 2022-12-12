import{h as C,r as t,o as d,c as A,a as l,b as p,t as i,e as n,w as o,f as D}from"./app.2b23eb6f.js";const u={id:"frontmatter-title",tabindex:"-1"},m=l("a",{class:"header-anchor",href:"#frontmatter-title","aria-hidden":"true"},"#",-1),g=D('<div class="info custom-block"><p class="custom-block-title">INFO</p><p>Before you have to import the global css files in your project, follow instructions in <a href="./../guide/getting-started">Getting Started</a></p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This component use <code>&lt;Teleport to=&quot;body&quot;&gt;</code> with <a href="./maz-backdrop">MazBackdrop</a>, so you can implement this component everywhere and it inherits all his props</p></div><h2 id="basic-usage" tabindex="-1">Basic usage <a class="header-anchor" href="#basic-usage" aria-hidden="true">#</a></h2>',3),f=l("p",null," Your content ",-1),_=D(`<div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">MazBtn</span><span style="color:#89DDFF;"> @</span><span style="color:#C792EA;">click</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">isOpen</span><span style="color:#89DDFF;"> = </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">Open Dialog</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#FFCB6B;">MazBtn</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">MazDialog</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">isOpen</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">title</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Dialog Title</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      Your content</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;"> #</span><span style="color:#C792EA;">footer</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">MazBtn</span><span style="color:#89DDFF;"> @</span><span style="color:#C792EA;">click</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">isOpen</span><span style="color:#89DDFF;"> = </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        Confirm</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#FFCB6B;">MazBtn</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#FFCB6B;">MazDialog</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">setup</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ref</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">vue</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> MazDialog </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">maz-ui/components/MazDialog</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> isOpen </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ref</span><span style="color:#A6ACCD;">(</span><span style="color:#FF9CAC;">false</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div><h2 id="props-events-emitted" tabindex="-1">Props &amp; Events emitted <a class="header-anchor" href="#props-events-emitted" aria-hidden="true">#</a></h2>`,2),z=JSON.parse('{"title":"MazDialog","description":"MazDialog is a standalone dialog component to show important informations to the user or propose specific action. Many options available. You can hide the header or the footer, full-size layout, differents states etc.","frontmatter":{"title":"MazDialog","description":"MazDialog is a standalone dialog component to show important informations to the user or propose specific action. Many options available. You can hide the header or the footer, full-size layout, differents states etc."},"headers":[{"level":2,"title":"Basic usage","slug":"basic-usage","link":"#basic-usage","children":[]},{"level":2,"title":"Props & Events emitted","slug":"props-events-emitted","link":"#props-events-emitted","children":[]}],"relativePath":"components/maz-dialog.md","lastUpdated":1670454806000}'),h={name:"components/maz-dialog.md"},b=Object.assign(h,{setup(v){const a=C(!1);return(c,s)=>{const r=t("MazBtn"),F=t("MazDialog",!0),y=t("ComponentPropDoc");return d(),A("div",null,[l("h1",u,[p(i(c.$frontmatter.title)+" ",1),m]),l("p",null,i(c.$frontmatter.description),1),g,n(r,{onClick:s[0]||(s[0]=e=>a.value=!0)},{default:o(()=>[p("Open Dialog")]),_:1}),n(F,{modelValue:a.value,"onUpdate:modelValue":s[2]||(s[2]=e=>a.value=e),title:"Dialog Title"},{footer:o(()=>[n(r,{onClick:s[1]||(s[1]=e=>a.value=!1)},{default:o(()=>[p(" Confirm ")]),_:1})]),default:o(()=>[f]),_:1},8,["modelValue"]),_,n(y,{component:"MazDialog"})])}}});export{z as __pageData,b as default};
