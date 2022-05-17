import{_ as p,r as t,o,c as e,b as n,a as c,F as l,d as s,i}from"./app.d6fe649e.js";const u={},r=n("h1",{id:"theme",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#theme","aria-hidden":"true"},"#"),s(" Theme")],-1),d=n("p",null,[s("You must override "),n("code",null,"--maz-***"),s(" CSS variables")],-1),k=n("strong",null,"Tip",-1),m=s(": Use color palette generator: "),v={href:"https://noeldelgado.github.io/shadowlord/#1e90ff",target:"_blank",rel:"noopener noreferrer"},b=s("noeldelgado.github.io"),y=s(" (and set the percent parameter to 17,5%)"),f=i(`<h2 id="list-of-css-variables" tabindex="-1"><a class="header-anchor" href="#list-of-css-variables" aria-hidden="true">#</a> List of CSS variables</h2><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token selector">:root</span> <span class="token punctuation">{</span>
  <span class="token comment">/* PRIMARY */</span>
  <span class="token property">--maz-color-primary-50</span><span class="token punctuation">:</span> #e3f1ff<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-100</span><span class="token punctuation">:</span> #bcdeff<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-200</span><span class="token punctuation">:</span> #94caff<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-300</span><span class="token punctuation">:</span> #6db7ff<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-400</span><span class="token punctuation">:</span> #45a3ff<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary</span><span class="token punctuation">:</span> #1e90ff<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-600</span><span class="token punctuation">:</span> #1977d2<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-700</span><span class="token punctuation">:</span> #145ea6<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-800</span><span class="token punctuation">:</span> #0e4479<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-900</span><span class="token punctuation">:</span> #092b4d<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-contrast</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--maz-color-primary-alpha</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>30 144 255 / 60%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* SECONDARY */</span>
  <span class="token property">--maz-color-secondary-50</span><span class="token punctuation">:</span> #e3f9f3<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-100</span><span class="token punctuation">:</span> #bbf1e3<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-200</span><span class="token punctuation">:</span> #93e9d2<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-300</span><span class="token punctuation">:</span> #6be1c2<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-400</span><span class="token punctuation">:</span> #44d9b1<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary</span><span class="token punctuation">:</span> #1cd1a1<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-600</span><span class="token punctuation">:</span> #17ac85<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-700</span><span class="token punctuation">:</span> #128869<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-800</span><span class="token punctuation">:</span> #0d634c<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-900</span><span class="token punctuation">:</span> #083f30<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-contrast</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--maz-color-secondary-alpha</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>28 209 161 / 60%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* INFO */</span>
  <span class="token property">--maz-color-info-50</span><span class="token punctuation">:</span> #e2f3f6<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-100</span><span class="token punctuation">:</span> #b9e3ea<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-200</span><span class="token punctuation">:</span> #91d3dd<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-300</span><span class="token punctuation">:</span> #68c3d1<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-400</span><span class="token punctuation">:</span> #40b2c4<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info</span><span class="token punctuation">:</span> #17a2b8<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-600</span><span class="token punctuation">:</span> #138698<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-700</span><span class="token punctuation">:</span> #0f6978<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-800</span><span class="token punctuation">:</span> #0b4d57<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-900</span><span class="token punctuation">:</span> #073137<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-contrast</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--maz-color-info-alpha</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>23 162 184 / 60%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* SUCCESS */</span>
  <span class="token property">--maz-color-success-50</span><span class="token punctuation">:</span> #f2f9e5<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-100</span><span class="token punctuation">:</span> #e1f0c2<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-200</span><span class="token punctuation">:</span> #cfe79e<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-300</span><span class="token punctuation">:</span> #bddf7a<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-400</span><span class="token punctuation">:</span> #acd656<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success</span><span class="token punctuation">:</span> #9acd32<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-600</span><span class="token punctuation">:</span> #7fa929<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-700</span><span class="token punctuation">:</span> #648521<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-800</span><span class="token punctuation">:</span> #496118<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-900</span><span class="token punctuation">:</span> #2e3e0f<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-contrast</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--maz-color-success-alpha</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>154 205 50 / 60%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* WARNING */</span>
  <span class="token property">--maz-color-warning-50</span><span class="token punctuation">:</span> #fff6e5<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-100</span><span class="token punctuation">:</span> #fee9c1<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-200</span><span class="token punctuation">:</span> #fedd9d<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-300</span><span class="token punctuation">:</span> #fdd079<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-400</span><span class="token punctuation">:</span> #fdc455<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning</span><span class="token punctuation">:</span> #fcb731<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-600</span><span class="token punctuation">:</span> #d09728<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-700</span><span class="token punctuation">:</span> #a47720<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-800</span><span class="token punctuation">:</span> #785717<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-900</span><span class="token punctuation">:</span> #4c370f<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-contrast</span><span class="token punctuation">:</span> #374151<span class="token punctuation">;</span>
  <span class="token property">--maz-color-warning-alpha</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>252 183 49 / 60%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* DANGER */</span>
  <span class="token property">--maz-color-danger-50</span><span class="token punctuation">:</span> #ffedec<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-100</span><span class="token punctuation">:</span> #ffd3d2<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-200</span><span class="token punctuation">:</span> #ffbab8<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-300</span><span class="token punctuation">:</span> #ffa09e<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-400</span><span class="token punctuation">:</span> #ff8784<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger</span><span class="token punctuation">:</span> #ff6d6a<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-600</span><span class="token punctuation">:</span> #d25a57<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-700</span><span class="token punctuation">:</span> #a64745<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-800</span><span class="token punctuation">:</span> #793432<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-900</span><span class="token punctuation">:</span> #4d2120<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-contrast</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--maz-color-danger-alpha</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>255 109 106 / 60%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* WHITE */</span>
  <span class="token property">--maz-color-white</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--maz-color-white-contrast</span><span class="token punctuation">:</span> black<span class="token punctuation">;</span>

  <span class="token comment">/* BLACK */</span>
  <span class="token property">--maz-color-black</span><span class="token punctuation">:</span> black<span class="token punctuation">;</span>
  <span class="token property">--maz-color-black-contrast</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>

  <span class="token comment">/* TEXT COLOR LIGHT */</span>
  <span class="token property">--maz-color-text-light</span><span class="token punctuation">:</span> #d9d9d9<span class="token punctuation">;</span>
  <span class="token property">--maz-color-muted-light</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>0 0 0 / 54%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* TEXT COLOR DARK */</span>
  <span class="token property">--maz-color-text-dark</span><span class="token punctuation">:</span> #212427<span class="token punctuation">;</span>
  <span class="token property">--maz-color-muted-dark</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>228 228 228 / 54%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* BG OVERLAY */</span>
  <span class="token property">--maz-bg-overlay</span><span class="token punctuation">:</span> <span class="token function">rgb</span><span class="token punctuation">(</span>0 0 0 / 50%<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* BG LIGHT COLOR */</span>
  <span class="token property">--maz-bg-color-light</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--maz-bg-color-light-light</span><span class="token punctuation">:</span> #efefef<span class="token punctuation">;</span>
  <span class="token property">--maz-bg-color-light-lighter</span><span class="token punctuation">:</span> #f2f2f2<span class="token punctuation">;</span>

  <span class="token comment">/* BG DARK COLOR */</span>
  <span class="token property">--maz-bg-color-dark</span><span class="token punctuation">:</span> #21222e<span class="token punctuation">;</span>
  <span class="token property">--maz-bg-color-dark-light</span><span class="token punctuation">:</span> #303144<span class="token punctuation">;</span>
  <span class="token property">--maz-bg-color-dark-lighter</span><span class="token punctuation">:</span> #3b3c53<span class="token punctuation">;</span>

  <span class="token comment">/**
  * FONT FAMILY
  * Not used in the library --&gt; Use this variable on your &lt;html&gt; element (optional)
  **/</span>
  <span class="token property">--maz-font-family</span><span class="token punctuation">:</span> system-ui<span class="token punctuation">,</span> -apple-system<span class="token punctuation">,</span> blinkmacsystemfont<span class="token punctuation">,</span> <span class="token string">&#39;Segoe UI&#39;</span><span class="token punctuation">,</span>
    roboto<span class="token punctuation">,</span> oxygen<span class="token punctuation">,</span> ubuntu<span class="token punctuation">,</span> cantarell<span class="token punctuation">,</span> <span class="token string">&#39;Fira Sans&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Droid Sans&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;Helvetica Neue&#39;</span><span class="token punctuation">,</span> sans-serif<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function z(g,h){const a=t("ExternalLinkIcon");return o(),e(l,null,[r,d,n("blockquote",null,[n("p",null,[k,m,n("a",v,[b,c(a)]),y])]),f],64)}var w=p(u,[["render",z],["__file","theme.html.vue"]]);export{w as default};
