::: details 查看代码
```vue
<template>
    <IPage
        :searchItems="searchItems"
        :columns="columns"
        :formItems="formItems"
        v-bind="otherProps"
    />
</template>
<script setup lang="ts">
import { ref } from "vue"
/** 搜索字段 */
const searchItems = ref<CellItemType[]>([]);

/** 展示字段 */
const columns = ref<ColumnType[]>([]);

/** 编辑表单字段 */
const formItems = ref<CellItemType[]>([]);

/** 其他页面参数 */
const otherProps = ref<Record<string, any>>({});
</script>
```
:::

