import{d as c,p as s,G as a,a as d,B as r,o as i,c as m,at as f}from"./framework.D-so3_v_.js";const _={class:"pages"};function g(n){return typeof n=="function"||Object.prototype.toString.call(n)==="[object Object]"&&!f(n)}const y=c({__name:"easyUpload4",setup(n){const u=s([{url:"",title:"身份证正面",accept:".jpg"},{url:"",title:"身份证背面",accept:".jpg"},{url:"",title:"尺寸测试0.1MB",size:.1,accept:"*.*"},{url:"https://media.w3.org/2010/05/sintel/trailer.mp4",title:"手持身份证录制视频",controls:!1}]),p=s({id:"images",slot:"easy-upload",props:{mode:"template",uploadFunc:o=>(console.log("uploadFunc",o),new Promise((t,e)=>{setTimeout(()=>{const l=new FileReader;l.readAsDataURL(o.raw),l.onload=()=>{t({data:{linkPath:l.result}})},l.onerror=()=>{e(new Error("File upload failed"))}},1e3)})),responseSrcPath:"data.linkPath"},slots:{title:({file:o,index:t})=>{console.log("title",o,t);let e=a("span",null,[o.title]);return t===0&&(e=a(r("el-button"),null,{default:()=>[d("测试")]})),t===1&&(e=a(r("el-tag"),{type:"primary"},{default:()=>[o.title]})),a(r("el-tooltip"),{effect:"dark",content:"这里放入更多操作指引",placement:"top"},g(e)?e:{default:()=>[e]})}}});return(o,t)=>{const e=r("RenderCell");return i(),m("div",_,[a(e,{modelValue:u.value,"onUpdate:modelValue":t[0]||(t[0]=l=>u.value=l),item:p.value},null,8,["modelValue","item"])])}}});export{y as default};
