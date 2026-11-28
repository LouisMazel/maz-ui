const REDUCED = 'html.m-motion-reduced'
const REDUCED_MEDIA = '@media (prefers-reduced-motion:reduce){html:not(.m-motion-full)'

/**
 * Stylesheet of `v-press`. Injected the first time the directive is used
 */
export const PRESS_CSS = `
[data-maz-press]{transition:scale calc(var(--maz-motion-fast,100ms)*var(--maz-motion-scale,1)) var(--maz-easing-bounce,cubic-bezier(.34,1.56,.64,1));touch-action:manipulation}
[data-maz-press][data-maz-pressed]{scale:var(--maz-press-scale,.97);transition-duration:calc(var(--maz-motion-instant,80ms)*var(--maz-motion-scale,1));transition-timing-function:var(--maz-easing-out,ease-out)}
${REDUCED} [data-maz-press]{transition:none;scale:none!important}
${REDUCED_MEDIA} [data-maz-press]{transition:none;scale:none!important}}
`

/**
 * Stylesheet of `v-ripple`. Injected the first time the directive is used
 */
export const RIPPLE_CSS = `
@property --mr-x{syntax:'<length>';inherits:false;initial-value:0px}
@property --mr-y{syntax:'<length>';inherits:false;initial-value:0px}
@property --mr-r{syntax:'<length>';inherits:false;initial-value:0px}
[data-maz-ripple]::before{--mr-x:var(--maz-ripple-x,50%);--mr-y:var(--maz-ripple-y,50%);--mr-r:0px;content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:var(--maz-ripple-opacity,.12);background:radial-gradient(circle at var(--mr-x) var(--mr-y),var(--maz-ripple-color,currentColor) var(--mr-r),transparent calc(var(--mr-r) + .5px))}
[data-maz-ripple-state="in"]::before{--mr-r:var(--maz-ripple-size,0px);transition:--mr-r calc(var(--maz-ripple-duration,var(--maz-motion-slow,300ms))*var(--maz-motion-scale,1)) var(--maz-easing-out,cubic-bezier(.16,1,.3,1))}
[data-maz-ripple-state="out"]::before{--mr-x:var(--maz-ripple-out-x,50%);--mr-y:var(--maz-ripple-out-y,50%);--mr-r:0px;transition-property:--mr-r,--mr-x,--mr-y;transition-duration:calc(var(--maz-ripple-duration,var(--maz-motion-slow,300ms))*var(--maz-motion-scale,1));transition-timing-function:var(--maz-easing-out,cubic-bezier(.16,1,.3,1))}
[data-maz-ripple-state="wave"]::before{--mr-r:var(--maz-ripple-size,0px);opacity:0;transition:--mr-r calc(var(--maz-ripple-duration,var(--maz-motion-slow,300ms))*var(--maz-motion-scale,1)) var(--maz-easing-out,cubic-bezier(.16,1,.3,1)),opacity calc(var(--maz-ripple-duration,var(--maz-motion-slow,300ms))*var(--maz-motion-scale,1)) var(--maz-easing-out,ease-out)}
${REDUCED} [data-maz-ripple]::before{display:none}
${REDUCED_MEDIA} [data-maz-ripple]::before{display:none}}
`

/**
 * Stylesheet of `v-tilt`. Injected the first time the directive is used
 */
export const TILT_CSS = `
@property --maz-tilt-fz{syntax:'<length>';inherits:false;initial-value:0px}
@keyframes maz-tilt-float{50%{--maz-tilt-fz:var(--maz-tilt-float-distance,.75rem);translate:0 calc(var(--maz-tilt-float-distance,.75rem)*-.4)}}
[data-maz-tilt]{transform:perspective(var(--maz-tilt-perspective,800px)) translateZ(var(--maz-tilt-fz)) rotateX(var(--maz-tilt-rx,0deg)) rotateY(var(--maz-tilt-ry,0deg));transform-style:preserve-3d}
[data-maz-tilt-float]{animation:maz-tilt-float var(--maz-tilt-float-duration,6s) ease-in-out infinite}
[data-maz-tilt-float][data-maz-tilt-idle]{animation-play-state:paused}
.m-tilt-glare{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:radial-gradient(circle at var(--maz-tilt-gx,50%) var(--maz-tilt-gy,50%),var(--maz-tilt-glare-color,color-mix(in srgb,var(--maz-primary,currentColor) 22%,transparent)),transparent 60%);transition:opacity calc(var(--maz-motion-normal,200ms)*var(--maz-motion-scale,1)) var(--maz-easing-out,ease-out)}
[data-maz-tilt][data-maz-tilt-active] .m-tilt-glare{opacity:1}
${REDUCED} [data-maz-tilt]{transform:none}
${REDUCED} [data-maz-tilt-float]{animation:none}
${REDUCED} .m-tilt-glare{display:none}
${REDUCED_MEDIA} [data-maz-tilt]{transform:none}
${REDUCED_MEDIA} [data-maz-tilt-float]{animation:none}
${REDUCED_MEDIA} .m-tilt-glare{display:none}}
`

/**
 * Stylesheet of `v-draw`. Injected the first time the directive is used
 */
export const DRAW_CSS = `
[data-maz-draw-state="hidden"] [data-maz-draw-stroke]{stroke-dasharray:var(--maz-draw-length);stroke-dashoffset:var(--maz-draw-length)}
[data-maz-draw-state="in"] [data-maz-draw-stroke]{stroke-dasharray:var(--maz-draw-length);stroke-dashoffset:0;transition:stroke-dashoffset calc(var(--maz-draw-duration,var(--maz-motion-slower,450ms)*2)*var(--maz-motion-scale,1)) var(--maz-easing-in-out,ease-in-out) calc(var(--maz-draw-delay,0ms) + var(--maz-i,0)*var(--maz-draw-stagger,0ms))}
@keyframes maz-draw-scroll{from{stroke-dashoffset:var(--maz-draw-length)}to{stroke-dashoffset:0}}
@supports (animation-timeline:view()){[data-maz-draw-mode="scroll"] [data-maz-draw-stroke]{stroke-dasharray:var(--maz-draw-length);animation:maz-draw-scroll linear both;animation-timeline:view();animation-range:entry calc(var(--maz-rank,0)*8%) entry calc(70% + var(--maz-rank,0)*6%)}}
${REDUCED} [data-maz-draw-state] [data-maz-draw-stroke],${REDUCED} [data-maz-draw-mode] [data-maz-draw-stroke]{stroke-dasharray:none;stroke-dashoffset:0;transition:none;animation:none}
${REDUCED_MEDIA} [data-maz-draw-state] [data-maz-draw-stroke],html:not(.m-motion-full) [data-maz-draw-mode] [data-maz-draw-stroke]{stroke-dasharray:none;stroke-dashoffset:0;transition:none;animation:none}}
`
