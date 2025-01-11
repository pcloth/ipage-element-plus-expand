<template>
    <RenderCell :item="item"/>
</template>
<script lang="jsx">
    // import { config } from "ipage-element-plus-expand";
    import { config } from "../../../dist"
    config.set({
        extendedRenderCell:{
            demo:{
                dom:()=><el-button></el-button>,
            }
        }
    })
    export default {
        data(){
            return {
                item:{
                    slot:'demo',
                    slots:{
                        default:()=><span>点击看看</span>
                    },
                    isFormItem:false,
                    props:{
                        type:'primary'
                    },
                    on:{
                        click:()=>{
                            alert('点击了自定义组件')
                        }
                    }
                },
            }
        }
    }
</script>