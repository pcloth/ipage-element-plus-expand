<template>
    <div>
        <el-alert style="margin-bottom: 10px;" :closable="false" type="success">尝试一下，滚动到底。</el-alert>
        <RenderCell v-model="value" :item="item"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                item:{
                    slot:'select-more',
                    placeholder:'请选择档案盒编号',
                    service: this.fetchDataList,
                }
            }
        },
        methods:{
            async fetchDataList(params){
                console.log(params,'params')
                // 以下只是模拟接口分页数据
                return new Promise((resolve)=>{
                    const records = []
                    const firstId = (params.pageNo-1)*params.pageSize
                    for(let i=0;i<params.pageSize;i++){
                        records.push({
                            label:`测试数据 - ${firstId+i}`,
                            value:`test${firstId+i}`,
                        })
                    }
                    setTimeout(()=>{
                        // 这里返回的数据格式按照ISearch的配置response.data
                        resolve({
                            data:{
                                total:40,
                                records
                            }
                        })
                    })
                })
            }
        }
    }
</script>