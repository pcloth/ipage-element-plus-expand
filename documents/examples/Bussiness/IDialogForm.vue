<template>
    <div class="pages">
        <el-button type="primary" @click="show = true">打开弹窗</el-button>
        <IDialogForm v-model="formValue" :iFormProps="iFormProps" v-model:show="show"></IDialogForm>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const show = ref(false);
const formValue = ref({});
/** 编辑表单字段 */
const iFormProps = ref({
    formItems: [
        {
            id: "name",
            slot: "input",
            label: "姓名",
            props: {
                placeholder: "请输入姓名"
            }
        }
    ]
});


</script>

<style lang="scss"></style>