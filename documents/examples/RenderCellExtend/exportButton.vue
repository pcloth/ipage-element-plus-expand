<template>
    <div>
        <p>尝试一下，点击导出。
            <p v-for="item,index in queryList" :key="index">第{{index+1}}次查询：{{item.count}}</p>
        </p>
        <RenderCell v-model="value" :item="item"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                queryList:[],
                item:{
                    slot:'export',
                    props:{
                        splitCount:30,
                        queryApi: this.fetchDataList,
                        columns:[
                            {
                                title:'项目',
                                key:'label'
                            },
                            {
                                title:'数值',
                                key:'value'
                            }
                        ]
                    },
                    on:{
                        clickExport:(loadData)=>{
                            this.queryList = []
                            console.log('clickExport',loadData)
                        }
                    }
                },

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
                    this.queryList.push({count:records.length})
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