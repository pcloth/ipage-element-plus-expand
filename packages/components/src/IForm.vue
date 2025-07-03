<template>
    <el-form ref="formRef" :model="form" :class="formClass" v-bind="formProps || {}" v-on="formOn || {}"
        :rules="formRules" @submit.prevent="nativeFormSubmission" v-loading="loading">
        <el-row :gutter="gutter">
            <template v-for="v in formItems" :key="v.id">
                <RenderCell v-model="form[v.id]" :item="v" :allItems="formItems" :formData="form" :qData="qData"
                    :isFormItem="true" defaultSlot="input" :defaultSpan="12" />
            </template>
            <el-col class="ipage_iform_buttons" :span="24" v-if="canShowButton">
                <template v-for="btn in mergeActionButtons" :key="btn.id">
                    <RenderCell v-model="form[btn.id]" :item="btn" :formData="form" :qData="qData"
                        :allItems="expandButtons" defaultSlot="button" />
                </template>
            </el-col>
        </el-row>
    </el-form>
</template>

<script lang="jsx">
import RenderCell from "./components/RenderCell";
import { preventRepeat, deepAssign } from "./utils";
import { config as $c } from "./config";
export default {
    name: "IForm",
    components: {
        RenderCell
    },
    props: {
        modelValue: {
            type: Object,
            default: () => { }
        },
        formClass: {
            type: String,
            default() {
                return $c.get("class").IFormRoot || $c.get("formClass");
            }
        },
        gutter: {
            type: Number,
            default: ()=>$c.get('gutter')||0
        },
        /** 表单配置 */
        formProps: {
            type: Object,
            default() {
                return $c.get("formProps");
            }
        },
        formOn: {
            type: Object,
            default() {
                return $c.get("formOn");
            }
        },
        /** 表单校验规格配置 */
        formRules: {
            type: Object,
            default() {
                return {};
            }
        },
        /** 扩展按钮列表 */
        expandButtons: {
            type: Array,
            default() {
                return $c.get("expandButtons");
            }
        },
        /** 默认的表单配置 */
        formOption: {
            type: Object,
            default() {
                return {
                    /** 表单项的宽度 */
                    itemWidth: "100%"
                };
            }
        },
        /** 是否显示表单按钮 */
        showSubmitButton: {
            type: Boolean,
            default: () => $c.get("showSubmitButton")
        },
        submitTitle: {
            type: String,
            default: () => $c.get("submitTitle")
        },
        cancelTitle: {
            type: String,
            default: () => $c.get("cancelTitle")
        },
        /** 表单按钮的配置 */
        submitButtonProps: {
            type: Object,
            default() {
                return () => $c.get("submitButtonProps");
            }
        },
        /** 是否显示重置按钮 */
        showCancelButton: {
            type: Boolean,
            default: () => $c.get("showCancelButton")
        },
        /** 重置按钮的配置 */
        cancelButtonProps: {
            type: Object,
            default() {
                return () => $c.get("cancelButtonProps");
            }
        },
        /** 新版本的提交按钮参数 */
        submitButton: {
            type: [Object, Boolean],
            default() {
                return () => $c.get("formSubmitButton");
            }
        },
        /** 新版本的取消按钮参数 */
        cancelButton: {
            type: [Object, Boolean],
            default() {
                return () => $c.get("formCancelButton");
            }
        },
        /** 表单项目 */
        formItems: {
            type: Array,
            default() {
                return [];
            }
        },
        /** 提交方法，需要是一个Promise对象 */
        submitFunc: {
            type: Function
        },
        submitPreventRepeat: {
            type: Boolean,
            default: () => $c.get("submitPreventRepeat")
        },
        loading: {
            type: Boolean,
            default: false
        },
        qData: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            form: this.modelValue,
            submitLoading: false,
            initForm: false
        };
    },
    watch: {
        modelValue: {
            handler() {
                // console.log('watch form',JSON.stringify(this.value))
                this.form = this.modelValue;
                this.clearValidate();
            },
            deep: true
        },
        form(val) {
            this.$emit("input", val);
            this.$emit("update:modelValue", val);
        }
    },
    computed: {
        canShowButton() {
            const oldVerStatus = this.showSubmitButton || this.showCancelButton;
            const newVerStatus =
                this.submitButton || this.cancelButton ? true : false;
            const expandButtonsStatus =
                this.expandButtons && this.expandButtons.length;
            return oldVerStatus || newVerStatus || expandButtonsStatus;
        },
        canShowSubmitButton() {
            return this.showSubmitButton || (this.submitButton ? true : false);
        },
        canShowCancelButton() {
            return this.showCancelButton || (this.cancelButton ? true : false);
        },
        mergeSubmitButton() {
            const rcellData = {
                show: this.canShowSubmitButton,
                slot: "button",
                tip: this.submitTitle,
                isFormItem: false,
                props: {
                    ...this.submitButtonProps
                },
                on: {
                    click: () => this.handleSubmit()
                }
            };
            return deepAssign(
                rcellData,
                this.submitButton ? this.submitButton : { show: false }
            );
        },
        mergeCancelButton() {
            const rcellData = {
                show: this.canShowCancelButton,
                slot: "button",
                tip: this.cancelTitle,
                isFormItem: false,
                props: {
                    ...this.cancelButtonProps
                },
                on: {
                    click: () => this.handleCancel()
                }
            };
            return deepAssign(
                rcellData,
                this.cancelButton ? this.cancelButton : { show: false }
            );
        },
        mergeActionButtons() {
            const buttons = [];
            if (this.canShowSubmitButton) {
                buttons.push(this.mergeSubmitButton);
            }
            if (this.canShowCancelButton) {
                buttons.push(this.mergeCancelButton);
            }
            if (this.expandButtons && this.expandButtons.length) {
                buttons.push(...this.expandButtons);
            }
            // 对按钮进行排序
            buttons.sort((a, b) => {
                return (a.sort || 0) - (b.sort || 0);
            });
            return buttons;
        }
    },
    created() {
        if (this.submitPreventRepeat) {
            this.handleSubmit = preventRepeat(params => {
                this._handleSubmit(params);
            }, 1000);
        } else {
            this.handleSubmit = this._handleSubmit;
        }
    },
    methods: {
        nativeFormSubmission() {
            this.$emit("nativeFormSubmit", this.form);
        },
        initOptions() {
            // 制作查询表单数据
            this.form = this.modelValue;
        },
        clearValidate() {
            this.$nextTick(() => {
                this.$refs.formRef?.clearValidate();
            });
        },
        calculateWidth(item) {
            if (item.width) {
                return item.width + "px";
            } else {
                return this.formOption.itemWidth;
            }
        },
        handleChange(value, item) {
            this.form[item.id] = value;
            this.$emit("changeForm", this.form, item);
        },
        _handleSubmit() {
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    if (this.submitLoading) {
                        return;
                    }
                    this.$emit("beforeSubmit", this.form);
                    if (this.submitFunc) {
                        this.submitLoading = true;
                        this.submitFunc(this.form)
                            .then(res => {
                                this.$emit("afterSubmit", res);
                            })
                            .finally(() => {
                                setTimeout(() => {
                                    this.submitLoading = false;
                                }, 500);
                            });
                    }
                } else {
                    this.$emit("validationFailed", this.form);
                }
            });
        },
        handleCancel() {
            this.$refs.formRef.resetFields();
            this.$emit("cancel", this.form);
        },
        setFormData(key, value) {
            console.log(key, value, "setFormData", this.form);
            this.form[key] = value;
        }
    }
};
</script>

<style scoped lang="scss">
.ipage_iform_buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
