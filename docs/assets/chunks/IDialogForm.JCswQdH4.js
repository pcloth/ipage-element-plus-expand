import{d as u,p as s,B as a,o as i,c as d,G as n,w as f,a as v}from"./framework.Bwtibv-e.js";const _={class:"pages"},V=u({__name:"IDialogForm",setup(c){const t=s(!1),l=s({}),r=s({formItems:[{id:"name",slot:"input",label:"姓名",props:{placeholder:"请输入姓名"}}]});return(w,o)=>{const m=a("el-button"),p=a("IDialogForm",!0);return i(),d("div",_,[n(m,{type:"primary",onClick:o[0]||(o[0]=e=>t.value=!0)},{default:f(()=>o[3]||(o[3]=[v("打开弹窗")])),_:1}),n(p,{modelValue:l.value,"onUpdate:modelValue":o[1]||(o[1]=e=>l.value=e),iFormProps:r.value,show:t.value,"onUpdate:show":o[2]||(o[2]=e=>t.value=e)},null,8,["modelValue","iFormProps","show"])])}}});export{V as default};
