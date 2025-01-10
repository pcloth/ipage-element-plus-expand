<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules">
            <template v-for="item in allItems">
            <RenderCell v-model="form[item.id]" :item="item" :formData="form" :allItems="allItems"/>
            </template>
        </el-form>
    </div>
    
</template>
<script>
    export default {
        data(){
            return {
                form:{
                    name:'',
                    gender:'',
                    suject:null,
                },
                showsuject:false,
                rules:{
                    name:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ]
                },
                allItems:[
                    {
                        id:'name',
                        slot:'input',
                        label:'姓名',
                        isFormItem:true,
                        props:{
                            placeholder:"请输入姓名"
                        },
                        on:{
                            input:(value,loadData)=>{
                                console.log('input',value,loadData)
                            }
                        }
                    },
                    {
                        id:'gender',
                        slot:'select',
                        label:'性别',
                        isFormItem:true,
                        props:{
                            clearable:true
                        },
                        options:[
                            {
                                label:'男',
                                value:'1'
                            },
                            {
                                label:'女',
                                value:'2'
                            }
                        ],
                        on:{
                            change:(value,{data,allItems})=>{
                                console.log(value,data,'gender change')
                                let show = true;
                                if(value==='1'){
                                    data.suject = '20001'
                                }else if(value==='2'){
                                    data.suject = '20002'
                                }else{
                                    show = false
                                    data.suject = null
                                }
                                allItems[2].show = show
                            }
                        }
                    },
                    {
                        id:'suject',
                        slot:'select',
                        label:'科目',
                        show:false,
                        isFormItem:true,
                        props:{
                            disabled:true
                        },
                        options:[
                            {
                                label:'1000米',
                                value:'20001'
                            },
                            {
                                label:'800米',
                                value:'20002'
                            }
                        ]
                    },
                    {
                        id:'submit',
                        slot:'button',
                        tip:'提交',
                        show:true,
                        props:{
                            type:'primary'
                        },
                        on:{
                            click:(e,loadData)=>{
                                console.log('click',e,loadData)
                                this.$refs.form.validate()
                            }
                        }
                    }
                ]
            }
        }
    }
</script>