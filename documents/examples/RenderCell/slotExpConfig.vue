<template>
    <RenderCell :item="item"/>
</template>
<script lang="jsx">
    // 你正式引入用配置用这个
    // import { config } from "ipage-element-plus-expand";

    // 这个引入只是为了演示，实际你项目中应该引入上面那个
    import {config} from "../../../packages/components/src"
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