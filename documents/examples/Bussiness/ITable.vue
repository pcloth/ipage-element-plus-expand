<template>
    <ITable :data="dataList" :useColumnKeys="false" :showColumnKeys="showColumnKeys" :columns="columns" tableHeight="auto" />
</template>
<script lang="jsx">
    export default {
        data() {
            return {
                value:'test',
                dataList: [],
                showColumnKeys:["name","gender"],
                columns: [
                    {
                        columnProps: {
                            prop: "name",
                            label: "姓名",
                        },
                    },
                    {
                        columnProps: {
                            prop: "gender",
                            label: "性别",
                            width: 100,
                            formatter: (row) => {
                                return { 1: "男", 2: "女" }[row.gender];
                            },
                        },
                    },

                    {
                        columnProps: {
                            label: "联络地址",
                        },
                        children: [
                            {
                                columnProps: {
                                    prop: "province",
                                    label: "省份",
                                },
                            },
                            {
                                columnProps: {
                                    prop: "city",
                                    label: "城市",
                                },
                            },
                            {
                                columnProps: {
                                    prop: "address",
                                    label: "地址",
                                },
                            },
                        ],
                    },
                    {   
                        slots: {
                            header:()=><el-input v-model={this.value} placeholder="请输入内容"/>,
                            default:({row})=>{
                                if(row.gender===1){
                                    return <el-button>报名</el-button>
                                }
                            }
                        },
                    },
                ],
            };
        },
        mounted() {
            const dataList = [];
            for (let i = 0; i < 10; i++) {
                dataList.push({
                    name: "张三",
                    gender: (i % 2) + 1,
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1518 弄",
                });
            }
            this.dataList = dataList;
            console.log(dataList, "dataList>>");
        },
        methods: {},
    };
</script>