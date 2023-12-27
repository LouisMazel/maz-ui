import{_ as a,c as o,k as t,a as r,t as d,R as s,o as n}from"./chunks/framework.ZYjSPqzW.js";const y=JSON.parse('{"title":"{{ $frontmatter.title }}","description":"MazBackdrop is a standalone component to manage components that need a backdrop","frontmatter":{"description":"MazBackdrop is a standalone component to manage components that need a backdrop"},"headers":[],"relativePath":"components/maz-backdrop.md","filePath":"components/maz-backdrop.md","lastUpdated":1703694488000}'),l={name:"components/maz-backdrop.md"},i={id:"frontmatter-title",tabindex:"-1"},c=t("a",{class:"header-anchor",href:"#frontmatter-title","aria-label":'Permalink to "{{ $frontmatter.title }}"'},"​",-1),p=s('<div class="info custom-block"><p class="custom-block-title">INFO</p><p>Before you have to import the global css files in your project, follow instructions in <a href="./../guide/getting-started">Getting Started</a></p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This component uses <code>&lt;Teleport to=&quot;body&quot;&gt;</code>, so you can implement this component anywhere you want</p></div><h2 id="props-event-slots" tabindex="-1">Props, Event &amp; Slots <a class="header-anchor" href="#props-event-slots" aria-label="Permalink to &quot;Props, Event &amp; Slots&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table><thead><tr><th>Prop name</th><th>Description</th><th>Type</th><th>Values</th><th>Default</th></tr></thead><tbody><tr><td>modelValue</td><td></td><td>boolean</td><td>-</td><td>false</td></tr><tr><td>teleportSelector</td><td></td><td>string</td><td>-</td><td>&#39;body&#39;</td></tr><tr><td>beforeClose</td><td></td><td>Function</td><td>-</td><td>undefined</td></tr><tr><td>persistent</td><td></td><td>boolean</td><td>-</td><td>false</td></tr><tr><td>noCloseOnEscKey</td><td></td><td>boolean</td><td>-</td><td>false</td></tr><tr><td>transitionName</td><td></td><td>string</td><td>-</td><td>&#39;backdrop-anim&#39;</td></tr><tr><td>backdropClass</td><td></td><td>array|string|object</td><td>-</td><td>undefined</td></tr><tr><td>backdropContentClass</td><td></td><td>array|string|object</td><td>-</td><td>undefined</td></tr></tbody></table><h3 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to &quot;Events&quot;">​</a></h3><table><thead><tr><th>Event name</th><th>Properties</th><th>Description</th></tr></thead><tbody><tr><td>open</td><td></td><td></td></tr><tr><td>before-close</td><td></td><td></td></tr><tr><td>close</td><td></td><td></td></tr><tr><td>update:model-value</td><td></td><td></td></tr></tbody></table><h3 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h3><table><thead><tr><th>Name</th><th>Description</th><th>Bindings</th></tr></thead><tbody><tr><td>default</td><td></td><td></td></tr></tbody></table>',9);function h(e,m,b,u,f,_){return n(),o("div",null,[t("h1",i,[r(d(e.$frontmatter.title)+" ",1),c]),t("p",null,d(e.$frontmatter.description),1),p])}const v=a(l,[["render",h]]);export{y as __pageData,v as default};