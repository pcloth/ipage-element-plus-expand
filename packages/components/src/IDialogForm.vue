<template>
    <el-dialog
        v-model="dialogVisible"
        v-bind="mergeDialogProps"
        v-on="dialogOn"
    >
        <slot name="header" />
        <IForm
            v-model="formValue"
            v-bind="iFormProps"
            @changeForm="changeForm"
            @beforeSubmit="beforeSubmit"
            @afterSubmit="afterSubmit"
            @validationFailed="validationFailed"
            @cancel="cancel"
        />
    </el-dialog>
</template>
<script lang="ts">
import IForm from "./IForm.vue";
import { config as $c } from "./config";
export default {
    name: "IDialogForm",
    components: {
        IForm
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: Object,
            default: () => ({})
        },
        dialogProps: {
            type: Object,
            default: () => ({})
        },
        dialogOn: {
            type: Object,
            default: () => ({})
        },
        iFormProps: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            formValue: this.modelValue,
            dialogVisible: this.show
        };
    },
    computed: {
        mergeDialogProps() {
            return {
                ...$c.get("dialogProps"),
                ...this.dialogProps
            };
        }
    },
    watch: {
        modelValue(val) {
            this.formValue = val;
        },

        formValue(val) {
            this.$emit("update:modelValue", val);
        },
        dialogVisible(val) {
            this.$emit("update:show", val);
        },
        show(val) {
            this.dialogVisible = val;
        }
    },
    methods: {
        changeForm(form, item) {
            this.$emit("changeForm", form, item);
        },
        beforeSubmit(form) {
            this.$emit("beforeSubmit", form);
        },
        afterSubmit(res) {
            this.dialogVisible = false;
            this.$emit("afterSubmit", res);
        },
        validationFailed(form) {
            this.$emit("validationFailed", form);
        },
        cancel(form) {
            this.$emit("cancel", form);
        }
    }
};
</script>
<style lang="scss"></style>
