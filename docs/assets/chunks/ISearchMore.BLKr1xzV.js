import{_ as a,B as t,o as s,b as c}from"./framework.Bwtibv-e.js";const n={data(){return{filter:{gender:1},results:{},searchItems:[{id:"name",label:"姓名",props:{placeholder:"请输入姓名"}},{id:"gender",label:"性别",slot:"select",props:{placeholder:"请选择性别"},options:[{label:"男",value:1},{label:"女",value:2},{label:"中性",value:3,disabled:!0}]},{id:"createTime",label:"创建时间",slot:"date-picker",isMore:!0,props:{type:"daterange",startPlaceholder:"请输入开始时间",endPlaceholder:"请输入结束时间"}}]}}};function p(d,l,i,u,e,m){const r=t("ISearch");return s(),c(r,{modelValue:e.filter,"onUpdate:modelValue":l[0]||(l[0]=o=>e.filter=o),searchItems:e.searchItems},null,8,["modelValue","searchItems"])}const f=a(n,[["render",p]]);export{f as default};
