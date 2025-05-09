<template>
    <el-select
        v-model="customValue"
        style="width: 100%"
        v-bind="$props"
        filterable
        remote
        clearable
        reserve-keyword
        :placeholder="placeholder"
        :remote-method="handleRemoteSearch"
        @change="handleChange"
        @clear="handleClear"
        @visible-change="handleVisibleChange"
    >
        <template #prefix>
            <el-icon class="loading-revolve">
                <Loading v-if="customLoading" />
            </el-icon>
        </template>
        <div :class="['LabelSelectCpmBox']">
            <template v-for="(item, index) in echoOptions">
                <el-option
                    v-if="canShowEcho(item)"
                    :key="item[keyField] ? item[keyField] : index"
                    :label="getLabel(item)"
                    :value="item[valueField]"
                    :disabled="disabledFunc(item)"
                />
            </template>
            <el-option
                v-for="(item, index) in options"
                :key="item[keyField] ? item[keyField] : index"
                :label="getLabel(item)"
                :value="item[valueField]"
                :disabled="disabledFunc(item)"
            />
            <el-option
                ref="readMoreRef"
                :value="-28347922"
                :label="loadMoreText"
                disabled
            />
        </div>
    </el-select>
</template>
<script>
import { ElSelect } from "element-plus";
const { props: elSelectProps } = ElSelect;
import { config as $c } from "../config";
import { getPathValue, preventRepeat } from "../utils";
import { Loading } from "@element-plus/icons-vue";
import { nextTick } from "vue";
export default {
    components: {
        Loading
    },
    name: "SelectMore",
    props: {
        ...elSelectProps,
        modelValue: {
            type: [String, Object, Number, Boolean, Array]
        },
        service: {
            type: Function,
            default: () => {}
        },
        labelField: {
            type: String,
            default: "label"
        },
        valueField: {
            type: String,
            default: "value"
        },
        keyField: {
            type: String,
            default: "id"
        },
        /**
         * 接口查询的字段，默认 keyword
         */
        searchKey: {
            type: String,
            default: "keyword"
        },
        /**
         * 额外要传入的参数
         */
        additionalParams: {
            type: Object,
            default: () => ({})
        },
        /**
         * 传入要禁用项的函数，返回true表示禁用，返回false表示不禁用
         */
        disabledFunc: {
            type: Function,
            default: () => false
        },
        /**
         * 显示的多个label，支持数组，根据 - 分割
         */
        labelFieldArr: {
            type: Array,
            default: () => []
        },
        /** 用于自己控制显示label */
        labelFunc: {
            type: Function
        },
        placeholder: {
            type: String,
            default: "搜索选择"
        },
        echoFunc: {
            type: Function
        }
    },
    data() {
        return {
            customValue: this.modelValue,
            params: {
                pageNo: 1,
                pageSize: 10,
                keyword: ""
            },
            customLoading: false,
            // 用于滚动刷新
            that: this,
            options: [],
            echoOptions: [],
            queryWord: "",
            total: 0
        };
    },
    watch: {
        modelValue: {
            handler(value) {
                this.customValue = value;
                this.checkEchoFunc();
            },
            immediate: true
        },
        customValue(val) {
            this.$emit("update:modelValue", val);
        }
    },
    computed: {
        noData() {
            return this.options.length >= this.total;
        },
        loadMoreText() {
            let msg = "";
            if (this.customLoading) {
                msg = "加载中...";
            } else if (this.noData) {
                msg = "没有更多了";
            } else {
                msg = "加载更多";
            }
            return msg;
        }
    },
    async created() {
        this.getList = preventRepeat(params => this._getList(params), 500);
        this.init();
        this.listening();
    },
    beforeUnmount() {
        this.readMoreObserver?.disconnect();
    },
    methods: {
        canShowEcho(item) {
            // 如果item已经在options中，不显示
            return (
                item &&
                !this.options.some(
                    it => it[this.valueField] === item[this.valueField]
                )
            );
        },
        getValueByPath(obj, path) {
            const keys = path.split(".");
            let result = obj;
            for (const key of keys) {
                result = result[key];
                if (!result) return null;
            }
            return result;
        },
        getLabel(item) {
            if (this.labelFunc) {
                return this.labelFunc(item);
            }
            if (this.labelFieldArr.length === 0) {
                return item[this.labelField];
            } else {
                return this.labelFieldArr
                    .map(field => this.getValueByPath(item, field))
                    .join(" - ");
            }
        },
        async init() {
            this.total = 0;
            this.queryWord = "";
            this.params.pageNo = 1;
            this.options = [];
            this.checkEchoFunc();
        },
        async checkEchoFunc() {
            await nextTick();
            const flag = this.modelValue && this.echoFunc ? true : false;
            if (flag) {
                // 没有回显数据的时候才调用
                this.echoOptions = await this.echoFunc();
            }
        },
        // 监听加载更多是否显示
        async listening() {
            await this.$nextTick();
            // 防御一下在ssr环境中编译
            if(typeof window === 'undefined') return;
            const el = this.$refs.readMoreRef?.$el;
            // 防御一下被show=false了
            if(!el){return}
            this.readMoreObserver = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    this.handleScrollToEnd();
                }
            });
            this.readMoreObserver.observe(el);
        },
        handleVisibleChange(show) {
            if (show) {
                if (this.options.length === 0) {
                    this.init();
                    this.getList();
                }
            }
        },
        handleClear() {
            this.echoOptions = [];
            this.init();
        },
        handleChange(args) {
            if (Array.isArray(args)) {
                // 多选
                const selected = this.options.filter(it =>
                    args.includes(it[this.valueField])
                );
                this.echoOptions = selected;
                this.$emit("getCurrentItem", selected, args);
            } else {
                // 单选
                if (!args) {
                    return;
                }
                const currentItem = this.options.find(
                    it => it[this.valueField] === args
                );
                this.echoOptions = [currentItem];
                this.$emit("getCurrentItem", currentItem, args);
            }
        },
        realPageParams() {
            // 根据search.mode参数配置分页参数
            const searchOptions = $c.get("search");
            let params = {};
            if (searchOptions.beforeFunc) {
                params = searchOptions.beforeFunc(this.params);
            } else if (searchOptions.mode === "page") {
                params[searchOptions.pageNo] = this.params.pageNo;
                params[searchOptions.pageSize] = this.params.pageSize;
            } else if (searchOptions.mode === "offset") {
                params[searchOptions.offset] =
                    (this.params.pageNo - 1) * this.params.pageSize;
                params[searchOptions.limit] = this.params.pageSize;
            }
            return params;
        },
        getList() {},
        async _getList(query) {
            try {
                this.customLoading = true;
                const queryWord = query || this.queryWord;
                const params = {
                    ...this.realPageParams(),
                    ...this.additionalParams
                };
                if (queryWord) {
                    params[this.searchKey] = queryWord;
                }
                const res = await this.service(params);
                const keyPaths = $c.get("response");
                let data = [];
                let total = 0;
                if (keyPaths.beforeFunc) {
                    const { data: data_, total: total_ } =
                        keyPaths.beforeFunc(res);
                    data = data_ || [];
                    total = total_ || 0;
                } else {
                    data = getPathValue(keyPaths.data, res, []);
                    total = getPathValue(keyPaths.total, res, 0);
                }
                this.options = [...this.options, ...data];
                this.total = total;
            } catch (error) {
                this.$message.error(error.message || "加载失败");
            } finally {
                setTimeout(() => {
                    this.customLoading = false;
                }, 200);
            }
        },
        handleRemoteSearch(query) {
            // 搜索词发生变化时才触发
            if (this.queryWord === query) return;
            this.options = [];
            this.queryWord = query;
            this.params.pageNo = 1;
            this.getList(this.queryWord);
        },
        handleScrollToEnd() {
            if (!this.customLoading && this.options.length < this.total) {
                this.params.pageNo++;
                this.getList(this.queryWord);
            }
        }
    }
};
</script>
<style lang="scss">
.selectLoad {
    // 减少出现Uncaught ResizeObserver loop completed with undelivered notifications.
    overflow: hidden;
}
.selectLoad:after {
    position: relative;
    z-index: 1000;
    content: "加载中...";
    display: inline-block;
    text-align: center;
    color: #979797;
    width: 100%;
    line-height: 30px;
    overflow: hidden;
    font-size: 13px;
}

.noData:after {
    position: relative;
    z-index: 1000;
    content: "已经到底了";
    color: #979797;
    display: inline-block;
    text-align: center;
    width: 100%;
    line-height: 30px;
    overflow: hidden;
    font-size: 13px;
}

.statusIcon {
    display: flex;
    height: 100%;
    align-items: center;
}

.loading-revolve {
    animation: loading-revolve 3s linear infinite;
}
@keyframes loading-revolve {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
