<template>
    <div>
        <RenderCell v-model="name" :item="item"/>
    </div>
    
</template>
<script>
    export default {
        data(){
            return {
                name:'',
                item:{
                    id:'name',
                    slot:'input',
                    isFormItem:false,
                    props:{
                        placeholder:"请输入姓名"
                    },
                    on:{
                        input:(value,loadData)=>{
                            console.log('input',value,loadData)
                        }
                    }
                }
            }
        }
    }
</script>