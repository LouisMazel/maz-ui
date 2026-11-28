const TARGET_HIDDEN = '[data-maz-reveal-state="hidden"]:not([data-maz-reveal-items]),[data-maz-reveal-state="hidden"][data-maz-reveal-items] [data-maz-reveal-item]'
const TARGET_IN = '[data-maz-reveal-state="in"]:not([data-maz-reveal-items]),[data-maz-reveal-state="in"][data-maz-reveal-items] [data-maz-reveal-item]'
const TARGET_SCROLL = '[data-maz-reveal-mode="scroll"]:not([data-maz-reveal-items]),[data-maz-reveal-mode="scroll"][data-maz-reveal-items] [data-maz-reveal-item]'

const REDUCED = '--mr-x:0px;--mr-y:0px;--mr-s:1;--mr-b:0px;--mr-o:0;--mr-cf:none;--mr-ct:none;--maz-reveal-duration:150ms!important;--maz-reveal-delay:0ms!important;--maz-reveal-stagger:0ms!important;--maz-reveal-cascade:0ms!important'

/**
 * The stylesheet of `v-reveal`, `MazReveal`, `useReveal` and `data-maz-reveal`. Injected by the first reveal on the
 * client: an app that does not use them does not load it, and nothing is hidden before it runs (SSR, no JS).
 * The `[data-maz-reveal-state]` attribute only exists once the system is ready.
 */
export const REVEAL_CSS = `
[data-maz-reveal]{--mr-dir:1;--mr-dist:var(--maz-reveal-distance,1.25rem);--mr-x:0px;--mr-y:0px;--mr-s:1;--mr-b:0px;--mr-o:0;--mr-cf:none;--mr-ct:none}
[data-maz-reveal]:dir(rtl){--mr-dir:-1}
[data-maz-reveal="slide-up"]{--mr-y:var(--mr-dist)}
[data-maz-reveal="slide-down"]{--mr-y:calc(var(--mr-dist)*-1)}
[data-maz-reveal="slide-start"]{--mr-x:calc(var(--mr-dist)*-1*var(--mr-dir))}
[data-maz-reveal="slide-end"]{--mr-x:calc(var(--mr-dist)*var(--mr-dir))}
[data-maz-reveal="slide-left"]{--mr-x:var(--mr-dist)}
[data-maz-reveal="slide-right"]{--mr-x:calc(var(--mr-dist)*-1)}
[data-maz-reveal="blur"]{--mr-b:10px}
[data-maz-reveal="scale"]{--mr-s:.92}
[data-maz-reveal="curtain-up"]{--mr-o:1;--mr-cf:inset(100% 0 0 0);--mr-ct:inset(0)}
[data-maz-reveal="curtain-down"]{--mr-o:1;--mr-cf:inset(0 0 100% 0);--mr-ct:inset(0)}
[data-maz-reveal="curtain-start"]{--mr-o:1;--mr-cf:inset(0 calc((1 - var(--mr-dir))*50%) 0 calc((1 + var(--mr-dir))*50%));--mr-ct:inset(0)}
[data-maz-reveal="curtain-end"]{--mr-o:1;--mr-cf:inset(0 calc((1 + var(--mr-dir))*50%) 0 calc((1 - var(--mr-dir))*50%));--mr-ct:inset(0)}
[data-maz-reveal="iris"]{--mr-o:1;--mr-cf:circle(0% at 50% 50%);--mr-ct:circle(75% at 50% 50%)}
[data-maz-reveal="settle"]{--mr-o:1;--mr-s:1.08;--mr-cf:inset(100% 0 0 0);--mr-ct:inset(0)}
[data-maz-reveal="lines"]{--mr-o:1;--mr-y:110%}
[data-maz-reveal="words"]{--mr-y:.5em;--mr-b:6px}
[data-maz-reveal-blur]{--mr-b:var(--maz-reveal-blur,10px)}
${TARGET_HIDDEN}{opacity:var(--mr-o);transform:translate(var(--mr-x),var(--mr-y)) scale(var(--mr-s));filter:blur(var(--mr-b));clip-path:var(--mr-cf)}
${TARGET_IN}{opacity:1;transform:none;filter:blur(0px);clip-path:var(--mr-ct);will-change:opacity,transform;transition-property:opacity,transform,filter,clip-path;transition-duration:calc(var(--maz-reveal-duration,var(--maz-motion-slower,450ms))*var(--maz-motion-scale,1));transition-timing-function:var(--maz-reveal-easing,var(--maz-easing-out,cubic-bezier(.16,1,.3,1)));transition-delay:calc(var(--maz-reveal-delay,0ms) + var(--maz-reveal-cascade,0ms) + var(--maz-i,0)*var(--maz-reveal-stagger,0ms))}
@keyframes maz-reveal-scroll{from{opacity:var(--mr-o);transform:translate(var(--mr-x),var(--mr-y)) scale(var(--mr-s));filter:blur(var(--mr-b));clip-path:var(--mr-cf)}to{opacity:1;transform:none;filter:blur(0px);clip-path:var(--mr-ct)}}
@supports (animation-timeline:view()){${TARGET_SCROLL}{animation:maz-reveal-scroll linear both;animation-timeline:view();animation-range:var(--maz-reveal-range,entry 20% cover 30%)}}
.m-reveal-line{display:block;overflow:hidden;padding-block:.12em;margin-block:-.12em}
.m-reveal-line>[data-maz-reveal-item]{display:block}
.m-reveal-word{display:inline-block}
.m-reveal-sr{position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
html.m-motion-reduced [data-maz-reveal]{${REDUCED}}
@media (prefers-reduced-motion:reduce){html:not(.m-motion-full) [data-maz-reveal]{${REDUCED}}}
`.trim()
