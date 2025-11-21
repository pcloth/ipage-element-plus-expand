<template>
    <IPage 
        @resetFields="resetFields"
        v-bind="ipageProps" 
    />
</template>
<script>
    export default {
        data(){
            return {
                ipageProps:{
                    reloadForm:true,
                    tableOn:{
                        rowClick:(_,row)=>{
                            console.log('rowClick',row)
                        }
                    },
                    searchProps:{
                        queryFunc:this.queryFunc
                    },
                    deleteFunc:()=>{
                        console.log('deleteFunc')
                        return new Promise((resolve)=>{
                            setTimeout(()=>{
                                resolve(true)
                            },1000)
                        })
                    },
                    searchItems:[
                        {
                            id:'name',
                            label:'姓名',
                            props:{
                                placeholder:"请输入姓名"
                            },
                        },
                        {
                            id:'gender',
                            label:'性别',
                            slot:'select',
                            props:{
                                placeholder:"请选择性别"
                            },
                            options:[
                                {
                                    label:'男',
                                    value:1
                                },
                                {
                                    label:'女',
                                    value:2
                                },
                                {
                                    label:'保密',
                                    value:3,
                                    disabled:true
                                }
                            ]
                        },
                    ],
                    columns:[
                        {
                            columnProps:{
                                prop:'name',
                                label:'姓名'
                            }
                        },
                        {
                            columnProps:{
                                prop:'gender',
                                label:'性别',
                                formatter:(val)=>{
                                    return {
                                        1:'男',
                                        2:'女',
                                        3:'保密'
                                        }[val.gender]
                                }
                            }
                        }
                    ],
                    formItems:[
                        {
                            id:'name',
                            label:'姓名',
                            slot:'input',
                            props:{
                                placeholder:"请输入姓名"
                            },
                        },
                        {
                            id:'add',
                            label:'地址',
                            slot:'select-more',
                            props:{
                                service:(params)=>{
                                    return new Promise((resolve, reject) => {
                                        const records = []
                                        for(let i=0;i<10;i++){
                                            records.push({
                                                label:'地址'+i,
                                                value:i
                                            })
                                        }
                                        setTimeout(()=>{
                                            resolve({data:{records}})
                                        },500)
                                    })
                                }
                            }
                        },
                        {
                            id:'gender',
                            label:'性别',
                            slot:'select',
                            props:{
                                placeholder:"请选择性别"
                            },
                            options:[
                                {
                                    label:'男',
                                    value:1
                                },
                                {
                                    label:'女',
                                    value:2
                                },
                                {
                                    label:'保密',
                                    value:3,
                                }
                            ]
                        },
                    ],
                    deleteFunc:async (data)=>{
                        // 发起删除请求
                        return true
                    },
                    formProps:{
                        gutter: 30,
                        submitFunc:async (data)=>{
                            // 发起保存请求
                            return true
                        }
                    }
                }
                
            }
        },
        methods:{
            resetFields(form){
                console.log('resetFields',form)
            },
            async queryFunc(params){
                return new Promise((resolve, reject) => {
                    const records = []
                    for(let i=0;i<10;i++){
                        records.push({
                            name:'张三'+i,
                            gender:(i%2)+1,
                        })
                    }
                    setTimeout(()=>{
                        resolve({
                            data:{
                                records
                            },
                            total:records.length
                        })
                    },1500)
                })
            },
        }
    }
</script>