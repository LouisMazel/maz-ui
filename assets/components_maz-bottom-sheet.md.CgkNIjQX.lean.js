import{e as g,c,a as i,A as n,z as k,b as e,x as l,al as d,X as o,o as y}from"./chunks/framework.Cj2Is6yp.js";const F={id:"frontmatter-title",tabindex:"-1"},m=i("a",{class:"header-anchor",href:"#frontmatter-title","aria-label":'Permalink to "{{ $frontmatter.title }}"'},"​",-1),A=d("",3),D=i("h3",{class:"maz-text-center maz-mb-4"}," Your content ",-1),E={class:"maz-flex maz-flex-center"},B=d("",8),f=JSON.parse('{"title":"MazBottomSheet","description":"MazBottomSheet is a standalone component like a simple dialog but at the bottom of screen","frontmatter":{"title":"MazBottomSheet","description":"MazBottomSheet is a standalone component like a simple dialog but at the bottom of screen"},"headers":[],"relativePath":"components/maz-bottom-sheet.md","filePath":"components/maz-bottom-sheet.md","lastUpdated":1714692269000}'),u={name:"components/maz-bottom-sheet.md"},_=Object.assign(u,{setup(C){const t=g(!1);return(h,s)=>{const p=o("MazBtn"),r=o("MazBottomSheet",!0);return y(),c("div",null,[i("h1",F,[n(k(h.$frontmatter.title)+" ",1),m]),i("p",null,k(h.$frontmatter.description),1),A,e(p,{onClick:s[0]||(s[0]=a=>t.value=!0)},{default:l(()=>[n("Open Bottom Sheet")]),_:1}),e(r,{modelValue:t.value,"onUpdate:modelValue":s[2]||(s[2]=a=>t.value=a)},{default:l(()=>[D,i("div",E,[e(p,{outline:"",onClick:s[1]||(s[1]=a=>t.value=!1)},{default:l(()=>[n(" Close Bottom Sheet ")]),_:1})])]),_:1},8,["modelValue"]),B])}}});export{f as __pageData,_ as default};