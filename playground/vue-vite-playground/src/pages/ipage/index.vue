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
defineOptions({
    name: ""
});

/** 搜索字段 */
const searchItems = ref<any[]>([
    {
        id: "name",
        slot:"input",
        label:"姓名"
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
