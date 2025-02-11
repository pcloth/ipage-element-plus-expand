<template>
    <div>
        <IPage
            :searchItems="searchItems"
            :columns="columns"
            :formItems="formItems"
            v-bind="otherProps"
        />
    </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import type {CellItemType} from "@compiled";
// import type {CellItemType} from "@/../../packages/components/src/type";
defineOptions({
    name: ""
});

/** 搜索字段 */
const searchItems = ref<CellItemType[]>([
    {
        id: "name",
        slot:"input",
        label:"姓名"
    },
    {
        id: "age",
        slot:"input",
        label:"年龄",
        mask:"##"
    }
]);

/** 展示字段 */
const columns = ref<any[]>([]);

/** 编辑表单字段 */
const formItems = ref<any[]>([]);

/** 其他页面参数 */
const otherProps = ref<Record<string, any>>({});
</script>

<style lang="scss" scoped></style>
