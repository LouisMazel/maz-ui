import{d as g,f as x,o as r,c as i,a as m,b as u,x as h,u as l,k as p,H as v,I as w,t as D,A as M,z as S,m as f,s as B}from"./framework.BQqLx3mW.js";import{h as C,y as n,F as c,a4 as q,V as k,Z as z}from"./theme.Bk-t8Ir4.js";const V={class:"maz-picker-month-switcher"},$={class:"maz-picker-month-switcher__header"},I=g({__name:"MazPickerMonthSwitcher",props:{calendarDate:{type:String,required:!0},color:{type:String,required:!0},locale:{type:String,required:!0},double:{type:Boolean,required:!0}},emits:["update:calendar-date","close"],setup(o,{emit:b}){const a=o,d=b,y=x(()=>Array.from({length:12},(s,e)=>e).map(s=>{const e=C(a.calendarDate).set("month",s);return a.double?{label:`${n(c(e.format(),a.locale,{month:"short"}))} - ${n(c(e.add(1,"month").format(),a.locale,{month:"short"}))}`,date:e}:{label:n(c(e.format(),a.locale,{month:"long"})),date:e}})),_=s=>{d("update:calendar-date",s.format()),d("close")};return(s,e)=>(r(),i("div",V,[m("div",$,[u(k,{size:"xs",color:"transparent",type:"button",onClick:e[0]||(e[0]=p(t=>s.$emit("close",t),["stop"]))},{default:h(()=>[u(l(q),{class:"maz-text-lg"})]),_:1})]),m("div",{class:f(["maz-picker-month-switcher__main",{"--has-double":o.double}])},[(r(!0),i(v,null,w(y.value,t=>(r(),D(k,{key:t.label,size:a.double?"sm":"xs",class:f({"--is-selected":l(z)(t.date,o.calendarDate,"month")}),color:l(z)(t.date,o.calendarDate,"month")?o.color:"transparent",type:"button",onClick:p(N=>_(t.date),["stop"])},{default:h(()=>[M(S(t.label),1)]),_:2},1032,["size","class","color","onClick"]))),128))],2)]))}}),P=B(I,[["__scopeId","data-v-173d1034"]]);export{P as default};