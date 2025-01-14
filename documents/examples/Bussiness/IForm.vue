<template>
    <IForm 
        v-model="formData" 
        :formItems="formItems" 
        :formRules="formRules"
        :queryFunc="queryFunc"
        @searchSuccess="searchSuccess"
    />
</template>
<script>
    export default {
        data(){
            return {
                formData:{
                    gender:1,
                },
                results:{},
                formItems:[
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
                                label:'中性',
                                value:3,
                                disabled:true
                            }
                        ]
                    },
                ],
                formRules:{
                    name:{ required: true, message: '请输入姓名', trigger: 'blur' },
                    gender:{ required: true, message: '请选择性别', trigger: 'blur' },
                }
            }
        },
        methods:{
            async queryFunc(params){
                return new Promise((resolve, reject) => {
                    const records = []
                    for(let i=0;i<10;i++){
                        records.push({
                            name:'张三',
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
            searchSuccess(resp){
                console.log(resp,resp)
                this.results = JSON.stringify(resp)
            }
        }
    }
</script>