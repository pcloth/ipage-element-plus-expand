import{d as s,p as n,B as p,o as d,c as u,G as c}from"./framework.D-so3_v_.js";const i={class:"pages"},f=s({__name:"easyUpload3",setup(m){const l=n([{url:"",title:"身份证正面",accept:".jpg"},{url:"",title:"身份证背面",accept:".jpg"},{url:"",title:"尺寸测试0.1MB",size:.1,accept:"*.*"},{url:"https://media.w3.org/2010/05/sintel/trailer.mp4",title:"手持身份证录制视频",controls:!1}]),r=n({id:"images",slot:"easy-upload",props:{mode:"template",uploadFunc:t=>(console.log("uploadFunc",t),new Promise((a,o)=>{setTimeout(()=>{const e=new FileReader;e.readAsDataURL(t.raw),e.onload=()=>{a({data:{linkPath:e.result}})},e.onerror=()=>{o(new Error("File upload failed"))}},1e3)})),responseSrcPath:"data.linkPath"}});return(t,a)=>{const o=p("RenderCell");return d(),u("div",i,[c(o,{modelValue:l.value,"onUpdate:modelValue":a[0]||(a[0]=e=>l.value=e),item:r.value},null,8,["modelValue","item"])])}}});export{f as default};
