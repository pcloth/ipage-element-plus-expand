<template>
    <RenderCell :item="item"/>
</template>
<script lang="jsx">
    export default {
        data(){
            return {
                item:{
                    slot:'render',
                    isFormItem:false,
                    render:(loadData)=>{
                        console.log(loadData,'loadData')
                        return <span>这是一个自定义渲染</span>
                    }
                }
            }
        }
    }
</script>