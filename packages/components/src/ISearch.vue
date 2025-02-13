<template>
    <el-form
        ref="formRef"
        :model="form"
        v-if="!hideSearch"
        :class="className"
        v-bind="mergeFormProps"
        @submit.prevent="singleInputEnter"
    >
        <template v-for="v in searchItems" :key="v.id">
            <RenderCell
                :ref="v.id"
                v-if="!v.isMore && !allinMore"
                :item="v"
                :allItems="searchItems"
                :isFormItem="isFormItem"
                v-model="form[v.id]"
                :formData="form"
                defaultSlot="input"
                :defaultProps="mergeInputProps"
                @change="handleChange"
            />
        </template>
        <el-form-item v-if="canShowButton">
            <RenderCell v-if="canShowResetButton" :item="mergeResetButton" />
            <RenderCell v-if="canShowSubmitButton" :item="mergeSubmitButton" />
            <el-popover
                v-if="hasMore"
                placement="bottom"
                trigger="click"
                width="auto"
                :teleported="false"
            >
                <template #reference>
                    <el-badge :hidden="!moreParams" is-dot>
                        <div class="high-search-button">
                            <span>更多搜索</span>
                            <div class="icon">
                                <i class="el-icon-s-operation" />
                            </div>
                        </div>
                    </el-badge>
                </template>

                <div class="high-search-popover">
                    <div class="title">更多搜索</div>
                    <div class="content">
                        <template v-for="(v, k) in searchItems">
                            <RenderCell
                                :ref="v.id"
                                :item="v"
                                :key="k"
                                v-if="v.isMore || allinMore"
                                :allItems="searchItems"
                                :isFormItem="isFormItem"
                                v-model="form[v.id]"
                                :formData="form"
                                defaultSlot="input"
                                @change="handleChange"
                                :defaultProps="mergeInputProps"
                            />
                        </template>
                    </div>
                </div>
            </el-popover>
        </el-form-item>
        <!-- 扩展按钮 -->
        <RenderCell
            v-for="v in expandButtons"
            :item="v"
            :key="v.id"
            :allItems="expandButtons"
            :formData="form"
            defaultSlot="button"
            :defaultProp="buttonProp"
        />
    </el-form>
</template>

<script lang="jsx">
import RenderCell from "./components/RenderCell";
import {
    meargeObject,
    deepAssign,
    preventRepeat,
    effectiveValue
} from "./utils";
import { config as $c } from "./config";

export default {
    name: "ISearch",
    components: {
        RenderCell
    },
    props: {
        hideSearch: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: Object,
            default() {
                return {};
            }
        },
        isFormItem: {
            type: Boolean,
            default: $c.get("search.isFormItem")
        },
        // 重置按钮按下要不要重新搜索
        resetReQuery: {
            type: Boolean,
            default: true
        },
        formProps: {
            type: Object,
            default() {
                return $c.get("searchFormProps");
            }
        },
        inputProp: {
            type: Object,
            default() {
                return $c.get("searchInput");
            }
        },
        buttonProp: {
            type: Object,
            default() {
                return $c.get("searchExpandButtonProps");
            }
        },
        /** 扩展按钮列表 */
        expandButtons: {
            type: Array,
            default() {
                return [];
            }
        },
        /** 是否显示搜索按钮 */
        // showSearchButton: {
        //     type: Boolean,
        //     default: $c.get("showSearchButton")
        // },

        /** 搜索按钮的配置 */
        // searchButtonProps: {
        //     type: Object,
        //     default() {
        //         return $c.get("searchButtonProps");
        //     }
        // },
        /** 是否显示重置按钮 */
        // showResetButton: {
        //     type: Boolean,
        //     default: $c.get("showResetButton")
        // },
        /** 重置按钮的配置 */
        // resetButtonProps: {
        //     type: Object,
        //     default() {
        //         return $c.get("resetButtonProps");
        //     }
        // },
        searchSubmitButton: {
            type: [Object, Boolean],
            default() {
                return $c.get("searchSubmitButton");
            }
        },
        searchResetButton: {
            type: [Object, Boolean],
            default() {
                return $c.get("searchResetButton");
            }
        },
        /** 搜索项目 */
        searchItems: {
            type: Array,
            default() {
                return [];
            }
        },
        /** 附加查询参数 */
        qData: {
            type: Object,
            default() {
                return {};
            }
        },
        /** 查询方法，需要是一个Promise对象 */
        queryFunc: {
            type: Function
        },
        autoQuery: {
            type: Boolean,
            default: $c.get("search.autoQuery")
        },
        /** 强制所有搜索项目进more 比如在有些手机尺寸上可以用这个控制 */
        allinMore: {
            type: Boolean,
            default: $c.get("allinMore")
        },
        className: {
            type: String,
            default: $c.get("class").ISearchRoot
        },
        /** 
         * 是否单输入框回车搜索
         */
        singleInput: {
            type: Boolean,
            default: $c.get("search.singleInput")
        }
    },
    computed: {
        hasMore() {
            return this.allinMore || this.searchItems.some(v => v.isMore);
        },
        canShowButton() {
            //const oldVerStatus = this.showSearchButton || this.showResetButton;
            const newVerStatus =
                this.searchSubmitButton || this.searchResetButton
                    ? true
                    : false;
            const expandButtonsStatus =
                this.expandButtons && this.expandButtons.length;
            return newVerStatus || expandButtonsStatus;
        },
        canShowSubmitButton() {
            return this.searchSubmitButton ? true : false;
        },
        canShowResetButton() {
            return this.searchResetButton ? true : false;
        },
        mergeSubmitButton() {
            const rcellData = {
                show: this.canShowSubmitButton,
                slot: "button",
                tip: "搜索",
                props: {
                    loading: this.loading
                    // ...this.searchButtonProps
                },
                on: {
                    click: () => this.handleSearch()
                }
            };
            return deepAssign(
                rcellData,
                this.searchSubmitButton
                    ? this.searchSubmitButton
                    : { show: false }
            );
        },
        mergeResetButton() {
            const rcellData = {
                show: this.canShowResetButton,
                slot: "button",
                tip: "重置",
                props: {
                    loading: this.loading
                    // ...this.resetButtonProps
                },
                on: {
                    click: () => this.handleReset()
                }
            };
            return deepAssign(
                rcellData,
                this.searchResetButton
                    ? this.searchResetButton
                    : { show: false }
            );
        },
        mergeFormProps() {
            return {
                ...$c.get("searchFormProps"),
                ...this.formProps
            };
        },
        mergeInputProps() {
            return {
                ...$c.get("searchInputProps"),
                ...this.inputProp
            };
        }
    },
    watch: {
        form(val) {
            this.$emit("update:modelValue", val);
        },
        modelValue: {
            handler() {
                this.form = this.modelValue;
                this.clearValidate();
            },
            deep: true
        }
    },
    data() {
        return {
            form: { ...(this.modelValue || {}) },
            loading: false,
            initSearch: false,
            openHighSearch: false,
            moreParams: false
        };
    },
    beforeMount() {
        this.initOptions();
    },
    created() {
        // 外部调用最好也调用这一个
        this.handleSearch = preventRepeat(
            params => this._handleSearchNow(params),
            500
        );
    },
    mounted() {
        if (this.autoQuery) {
            this.handleSearch();
        }
    },
    methods: {
        initOptions() {
            // 制作查询表单数据
            this.form = this.modelValue;
        },
        mergeQData(obj = {}) {
            const newObj = meargeObject(
                {},
                this.form || {},
                this.qData || {},
                obj || {}
            );
            // 清理空字符串和null
            Object.keys(newObj).forEach(key => {
                if (newObj[key] === "" || newObj[key] === null) {
                    delete newObj[key];
                }
            });
            return newObj;
        },
        clearValidate() {
            this.$nextTick(() => {
                this.$refs.formRef?.clearValidate();
            });
        },
        checkMoreParams() {
            this.$nextTick(() => {
                let moreParams = false;
                this.searchItems.forEach(it => {
                    if (it.isMore && effectiveValue(this.form[it.id])) {
                        moreParams = true;
                    }
                });
                this.moreParams = moreParams;
            });
        },
        handleChange(value, loadData) {
            this.checkMoreParams();
            this.$emit("changeParams", this.form, value, loadData);
        },
        async _handleSearchNow(qdata) {
            try {
                await this.$refs.formRef.validate();
            } catch (info) {
                // 校验表单失败
                Object.keys(info).forEach(key => {
                    info[key].forEach(row => {
                        this.$message.error(row.message);
                        return;
                    });
                });
            }
            await this.$nextTick();
            return new Promise(resolve => {
                const fromData = this.mergeQData(qdata);
                this.$emit("beforeSearch", fromData);
                // 如果有查询方法
                if (this.queryFunc) {
                    this.loading = true;
                    this.queryFunc(fromData)
                        .then(res => {
                            this.loading = false;
                            this.$emit("searchSuccess", res);
                            resolve(true);
                        })
                        .catch(error => {
                            this.$emit("searchFail", error);
                        })
                        .finally(data => {
                            this.$emit("searchFinally", data);
                            this.loading = false;
                        });
                } else {
                    resolve(true);
                }
            });
        },
        handleSearchExBtn(btn) {
            this.$emit("clickExBtn", btn);
        },
        handleReset() {
            this.searchItems.forEach(item => {
                this.form[item.id] = undefined;
                // this.$set(this.form, item.id, undefined);
            });
            this.checkMoreParams();
            if (this.resetReQuery) {
                this.handleSearch();
            }
            this.$emit("changeParams", this.form);
            this.$emit("resetFields", this.form);
        },
        singleInputEnter() {
            if(this.singleInput){
                this.handleSearch();
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.high-search-button {
    display: inline-flex;
    align-items: center;
    border-left: solid 1px #f0f0f0;
    cursor: pointer;
    padding-left: 16px;
    margin-left: 16px;
    color: #185aff;

    & > span {
        font-size: 14px;
        margin-right: 5px;
    }
}

.high-search-popover {
    & > .title {
        font-size: 14px;
        font-weight: bold;
        line-height: 1;
        text-align: center;
        padding: 20px 16px 16px;
    }

    & > .content {
        margin: 0 16px;

        .title-setting {
            display: inline-flex;
            width: 100%;
        }

        :deep(.el-form-item--small.el-form-item) {
            margin-bottom: 16px;
        }

        :deep(.el-form-item__content) {
            display: flex;

            .el-input,
            .el-select {
                flex: 1;
            }
        }
    }

    & > .handle {
        display: flex;
        padding: 0 16px 12px;

        & > .close {
            flex: 1;
        }

        .el-button {
            font-size: 12px;
        }

        .el-button.el-button--primary,
        .el-button.el-button--default {
            padding: 8px;
        }
    }
}

.isearch {
    :deep(.el-form-item__content) {
        min-width: 80px;
    }
    :deep(.el-input) {
        width: 160px;
    }
}
</style>
