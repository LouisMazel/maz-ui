import{d as b,e as C,f as D,o as u,c as y,a as m,b as r,x as l,u as o,k as i,G as w,H as S,t as Y,z as B,A as M,m as q,s as I}from"./framework.VWXXS9mT.js";import{h as c,D as N,U as z,T as d,a2 as T,X as _}from"./theme.GKc-7CSW.js";const V={class:"maz-picker-year-switcher"},A={class:"maz-picker-year-switcher__header"},L={class:"maz-flex maz-space-x-2"},P={class:"maz-picker-year-switcher__main"},X=b({__name:"MazPickerYearSwitcher",props:{color:{type:String,required:!0},locale:{type:String,required:!0},calendarDate:{type:String,required:!0}},emits:["update:calendar-date","close"],setup(n,{emit:v}){const p=n,f=v,a=C(p.calendarDate),k=D(()=>Array.from({length:15},(t,s)=>s-7).map(t=>{const s=c(a.value).get("year"),e=c(a.value).set("year",s+t);return{label:N(e.format(),p.locale,{year:"numeric"}),date:e}})),h=t=>{f("update:calendar-date",c(t).format()),f("close")},x=()=>{a.value=c(a.value).subtract(7,"year").format()},g=()=>{a.value=c(a.value).add(7,"year").format()};return(t,s)=>(u(),y("div",V,[m("div",A,[m("div",L,[r(d,{size:"xs",color:"transparent",type:"button",onClick:i(x,["stop"])},{default:l(()=>[r(o(z),{class:"maz-text-lg"})]),_:1}),r(d,{size:"xs",color:"transparent",type:"button",onClick:i(g,["stop"])},{default:l(()=>[r(o(z),{class:"maz-rotate-180 maz-text-lg"})]),_:1})]),r(d,{size:"xs",color:"transparent",type:"button",onClick:s[0]||(s[0]=i(e=>t.$emit("close",e),["stop"]))},{default:l(()=>[r(o(T),{class:"maz-text-lg"})]),_:1})]),m("div",P,[(u(!0),y(w,null,S(k.value,e=>(u(),Y(d,{key:e.label,size:"sm",type:"button",class:q({"--is-selected":o(_)(e.date,n.calendarDate,"year")}),color:o(_)(e.date,n.calendarDate,"year")?n.color:"transparent",onClick:i($=>h(e.date),["stop"])},{default:l(()=>[M(B(e.label),1)]),_:2},1032,["class","color","onClick"]))),128))])]))}}),F=I(X,[["__scopeId","data-v-13cd7701"]]);export{F as default};