import{_ as n,B as c,o as m,b as d}from"./framework.Bwtibv-e.js";const f={data(){return{formData:{gender:1},results:{},formItems:[{id:"name",label:"姓名",props:{placeholder:"请输入姓名"}},{id:"address",label:"地址",slot:"cascader"},{id:"gender",label:"性别",slot:"select",props:{placeholder:"请选择性别"},options:[{label:"男",value:1},{label:"女",value:2},{label:"中性",value:3,disabled:!0}]}],formRules:{name:{required:!0,message:"请输入姓名",trigger:"blur"},gender:{required:!0,message:"请选择性别",trigger:"blur"}}}},methods:{async queryFunc(r){return new Promise((s,t)=>{const o=[];for(let e=0;e<10;e++)o.push({name:"张三",gender:e%2+1});setTimeout(()=>{s({data:{records:o},total:o.length})},1500)})},searchSuccess(r){console.log(r,r),this.results=JSON.stringify(r)}}};function i(r,s,t,o,e,l){const a=c("IForm",!0);return m(),d(a,{modelValue:e.formData,"onUpdate:modelValue":s[0]||(s[0]=u=>e.formData=u),formItems:e.formItems,formRules:e.formRules,queryFunc:l.queryFunc,onSearchSuccess:l.searchSuccess},null,8,["modelValue","formItems","formRules","queryFunc","onSearchSuccess"])}const g=n(f,[["render",i]]);export{g as default};
