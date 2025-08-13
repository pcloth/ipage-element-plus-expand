<template>
    <div>
        <IPage :searchItems="searchItems" :columns="columns" :formItems="formItems" v-bind="otherProps" />
    </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import type { CellItemType } from "@compiled";
// import type {CellItemType} from "@/../../packages/components/src/type";
import area from "./area"

const areaData = ref([])

const initArea = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            areaData.value = area
            resolve(areaData.value)
        }, 1000)
    })
}

initArea();


defineOptions({
    name: ""
});

/** 搜索字段 */
const searchItems = ref<CellItemType[]>([
    {
        id: "name",
        slot: "input",
        label: "姓名"
    }
]);

/** 展示字段 */
const columns = ref<any[]>([
    {
        columnProps: {
            prop: "name",
            label: "姓名",
            width: 100,
        }
    },
    {
        columnProps: {
            prop: "age",
            label: "年龄",
            width: 100,
            formatter: (row, column, cellValue, index) => {
                return cellValue + "岁";
            }
        }
    },
    {
        columnProps: {
            prop: "address",
            label: "地址",
            width: 200
        }
    }
]);

/** 编辑表单字段 */
const formItems = ref<any[]>([
    {
        id: 'searchAreaCodes',
        label: '区县/镇街',
        slot: 'cascader',
        props: {
            options: area,
            props: {
                label: 'name',
                value: 'id',
                // checkStrictly: true,
                emitPath: true
            },
            clearable: true,
        },
        on: {
            change: (value, { data }) => {
                console.log(value, data, 'change');
            }
        }
    },
    {
        id: 'name',
        label: '姓名',
        slot: 'input',
        props: {
            placeholder: "请输入姓名"
        },
    },
    {
        id: 'add',
        label: '地址',
        slot: 'select-more',
        props: {
            service: (params) => {
                return new Promise((resolve, reject) => {
                    const records = []
                    for (let i = 0; i < 10; i++) {
                        records.push({
                            label: '地址' + i,
                            value: i
                        })
                    }
                    setTimeout(() => {
                        resolve({ data: { records } })
                    }, 500)
                })
            }
        }
    },
    {
        id: 'gender',
        label: '性别',
        slot: 'select',
        props: {
            placeholder: "请选择性别"
        },
        options: [
            {
                label: '男',
                value: 1
            },
            {
                label: '女',
                value: 2
            },
            {
                label: '保密',
                value: 3,
            }
        ]
    },
]);

/** 其他页面参数 */
const otherProps = ref<Record<string, any>>({
    beforeEditOpenFunc: (ld) => {
        console.log('beforeEditOpenFunc', ld)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ ...ld.data })
            }, 1000)
        })
    },
    editButton: {
        tip: '编辑测试',
        show: (loadata) => {
            console.log("loadata show", loadata);
            return true
        }
    },
    searchProps: {
        queryFunc: (params) => {
            console.log("查询参数", params);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        data: {
                            records: [
                                {
                                    id: 1,
                                    name: "张三",
                                    age: 18
                                },
                                {
                                    id: 2,
                                    name: "李四",
                                    age: 20
                                }
                            ],
                            total: 2
                        }


                    });
                }, 1000);
            });
        }
    },
    formProps: {
        gutter: 30,
        submitFunc: async (data) => {
            // 发起保存请求
            return true
        }
    }
});
</script>

<style lang="scss" scoped></style>
