<template>
    <div class="pageTemplate" :class="className">
        <slot name="search">
            <ISearch ref="isearch" @resetFields="resetFields" v-model="filter" v-bind="searchProps"
                :qData="realPageParams" @searchSuccess="searchSuccess" :search-items="searchItems"
                @beforeSearch="beforeSearch" @searchFail="searchFail" @searchFinally="searchFinally" />
        </slot>
        <slot name="operation">
            <div class="operation" :class="operationClass" v-if="addButton || operationButtons.length">
                <RenderCell defaultSlot="button" :isFormItem="false" v-for="(item, oix) in operations" :item="item"
                    :key="item.id ? item.id : `operation${oix}`" />
            </div>
        </slot>
        <div ref="tablewrap" class="tableWrap" :class="tableWrap">
            <slot name="table" :data="dataList" :loading="dataLoading">
                <ITable v-loading="dataLoading" :tableProps="tableProps" :tableHeight="tableHeight"
                    :tableSlots="tableSlots" :tableOn="tableOn" ref="table" :data="dataList" :columns="mergeColumns"
                    :showColumnFilter="showColumnFilter" :showColumnKeys="showColumnKeys" />
            </slot>
            <slot name="pagination">
                <el-pagination ref="pagination" class="pagination" :class="paginationClass" :total="total"
                    v-model:current-page="filterQData.pageNo" v-model:page-size="filterQData.pageSize"
                    @current-change="pageChange" @size-change="handleSizeChange" v-bind="mergePaginationProps" />
            </slot>
        </div>

        <el-dialog v-bind="mergeDialogProps" :title="dialogTitle" v-model="showDialog">
            <slot name="dialog-header" />
            <slot name="dialog-content" :row="currentRow">
                <!-- 加一个骨架屏幕，等详情接口加载完后在进行渲染表单，避免有些组件初始化时候参数有问题 -->
                <el-skeleton :rows="formItems.length" animated v-if="formLoading" />
                <IForm v-model="currentRow" :loading="formSubmitLoading" @beforeSubmit="beforeSubmit"
                    @validationFailed="validationFailed" @cancel="showDialog = false" @afterSubmit="afterSubmit"
                    ref="iform" v-else-if="merageShowDialog" v-bind="formProps"
                    :formItems="formItems" :formRules="formRules" />
                <slot name="dialog-more" :row="currentRow" />
            </slot>
            <template v-slot:footer>
                <slot name="dialog-footer" :row="currentRow" />
            </template>
        </el-dialog>
    </div>
</template>

<script lang="tsx">
import { deepAssign, getPathValue } from "./utils";
import { config as $c } from "./config";
import { ElMessageBox, ElMessage } from "element-plus";
// @ts-ignore
import ITable from "./ITable.vue";
// @ts-ignore
import IForm from "./IForm.vue";
// @ts-ignore
import ISearch from "./ISearch.vue";
import RenderCell from "./components/RenderCell";
// @ts-ignore
import ITableColFilter from "./components/ITableColFilter.vue";
import type { CellItemType, ColumnType, LoadDataType } from "./type";
import { PropType, defineComponent } from "vue";

export default defineComponent({
    name: "IPage",
    emits: [
        "resetFields",
        "update:searchValue",
        "searchSuccess",
        "beforeSearch",
        "searchFail",
        "searchFinally",
        "beforeSubmit",
        "validationFailed",
        "afterSubmit",
        "delete-row",
        "delete-error",
        "tableHeightUpdate"
    ],
    components: {
        RenderCell,
        ISearch,
        ITable,
        IForm,
        ITableColFilter
    },
    props: {
        searchItems: {
            type: Array as PropType<CellItemType[]>,
            default: () => []
        },
        searchValue: {
            type: Object,
            default: () => ({})
        },
        searchProps: {
            type: Object,
            default: () => ({})
        },
        formProps: {
            type: Object,
            default: () => ({})
        },
        columns: {
            type: Array as PropType<ColumnType[]>,
            default: () => []
        },
        showColumnButton: {
            type: Boolean,
            default: true
        },
        /** 是否显示字段隐藏控制器 */
        showColumnFilter: {
            type: Boolean,
            default: true
        },
        // 支持renderCell组件参数格式
        columnButtons: {
            type: Array as PropType<CellItemType[]>,
            default: () => []
        },
        columnButtonProps: {
            type: Object as PropType<CellItemType>,
            default: () => {
                return {};
            }
        },
        paginationProps: {
            type: Object,
            default: () => ({})
        },
        tableProps: {
            type: Object,
            default: () => ({})
        },
        tableOn: {
            type: Object,
            default: () => ({})
        },
        tableSlots: {
            type: Object,
            default: () => ({})
        },
        tableWrap: {
            type: String,
            default: () => $c.get("class").tableWrap
        },
        // tableFixHeight: {
        //     type: Number,
        //     default: 0
        // },
        dialogProps: {
            type: Object,
            default: () => {
                return {
                    appendToBody: true,
                    title: ""
                };
            }
        },
        // 添加按钮
        addButton: {
            type: [Object,Boolean] as PropType<CellItemType|Boolean>,
            default: () => {
                return {};
            }
        },
        // 工具条
        toolbarButtons: {
            type: [Array , Boolean] as PropType<CellItemType[]|Boolean>,
            default: () => {
                return [];
            }
        },
        // 操作区按钮
        operationButtons: {
            type: Array,
            default: () => []
        },
        operationClass: {
            type: String,
            default: () => $c.get("class").IPageOperation
        },
        paginationClass: {
            type: String,
            default: () => $c.get("class").IPagePagination
        },
        // 行编辑按钮
        editButton: {
            type: [Object , Boolean] as PropType<CellItemType|Boolean>,
            default: () => {
                return {};
            }
        },
        // 编辑表单字段
        formItems: {
            type: Array as PropType<CellItemType[]>,
            default: () => []
        },
        // 编辑表单校验规则
        formRules: {
            type: Object,
            default: () => ({})
        },
        beforeAddOpenFunc:{
            type: Function
        },
        // 新增表单打开前接口
        befoceAddOpenFunc: {
            type: Function
        },
        // 编辑表单打开前接口
        befoceEditOpenFunc: {
            type: Function
        },
        beforeEditOpenFunc: {
            type: Function
        },
        deleteButton: {
            type: [Object , Boolean] as PropType<CellItemType|Boolean>,
            default: () => {
                return {};
            }
        },
        // 删除数据
        deleteFunc: {
            type: [Function, Boolean],
            default: false
        },
        className: {
            type: String,
            default: () => $c.get("class").IPageRoot
        },
        /** 是否在打开的时候重绘表单 */
        reloadForm: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tableHeight: $c.get("tableHeight"),
            dataList: [],
            dataLoading: false,
            total: 0,
            filterQData: {
                pageNo: 1,
                pageSize: 10
            },
            filter: this.searchValue,
            formData: {},
            formSubmitLoading: false,
            formLoading: false,
            showDialog: false,
            currentRow: {},
            dialogType: "",
            dialogTitle: "",
            dialogProps_: {},
            defaultAddButton: {
                ...$c.get("button"),
                ...$c.get("addButton"),
                on: {
                    click: (_: any, loadData: LoadDataType) => {
                        _.stopPropagation();
                        this._openDialog_("add", loadData);
                    }
                }
            },
            defaultEditButton: {
                ...$c.get("button"),
                ...$c.get("editButton"),
                on: {
                    click: (_: any, loadData: LoadDataType) => {
                        _.stopPropagation();
                        this._openDialog_("edit", loadData);
                    }
                }
            },
            defaultDeleteButton: {
                ...$c.get("button"),
                ...$c.get("deleteButton"),
                on: {
                    click: (_: any, loadData: LoadDataType) => {
                        _.stopPropagation();
                        this.askDelete(loadData);
                    }
                }
            },
            defaultTableToolbar: [
                {
                    ...$c.get("toolbarButton"),
                    ...$c.get("refreshButton"),
                    on: {
                        click: (_: any, loadData: LoadDataType) => {
                            _.stopPropagation();
                            const { $rcell } = loadData;
                            $rcell.$el.classList.add("refreshAnimation");
                            this.handleSearch().finally(() => {
                                $rcell.$el.classList.remove("refreshAnimation");
                            });
                        }
                    }
                }
            ],
            showColumnKeys: []
        };
    },
    watch: {
        filter: {
            handler() {
                this.filterQData.pageNo = 1;
                this.$emit("update:searchValue", this.filter);
            },
            deep: true
        },
        searchValue: {
            handler() {
                this.filter = this.searchValue;
            },
            deep: true
        },
        columns: {
            handler() {
                this._calculateDisplayableFields(this.columns);
            },
            deep: true
        }
    },
    computed: {
        merageShowDialog(){
            const shome = this.dialogType === 'edit' || this.dialogType === 'add'
            if(this.reloadForm){
                return this.showDialog && shome;
            }
            return shome;
        },
        operations(): CellItemType[] {
            const operations = [];
            if (this.addButton && typeof this.addButton === "object") {
                operations.push(
                    deepAssign(this.defaultAddButton, this.addButton)
                );
            }
            operations.push(...this.operationButtons);
            if (this.toolbarButtons && Array.isArray(this.toolbarButtons)) {
                this.toolbarButtons.forEach(btn => {
                    operations.push(deepAssign($c.get("toolbarButton"), btn));
                });
            }
            // 刷新按钮移动到操作区
            // this.defaultTableToolbar.forEach(btn=>{
            //     operations.push(deepAssign($c.get('toolbarButton'), btn));
            // })
            // 根据sort排序
            operations.sort((a, b) => {
                const sortA = a?.sort || 0;
                const sortB = b?.sort || 0;
                return sortA - sortB;
            });
            return operations;
        },
        mergeColumns(): ColumnType[] {
            const mergeColumns = this._getColumns(this.columns);
            // 默认数据操作区域
            if (this.showColumnButton) {
                const props_ = deepAssign(
                    $c.get("columnButtonProps"),
                    this.columnButtonProps
                );
                mergeColumns.push({
                    ...props_,
                    slots: {
                        /** 筛选可见字段功能 */
                        header: (data: any, loadData: LoadDataType) => {
                            const className = "IPage_toolBar";
                            return (
                                <div class={className}>
                                    <span>{props_.columnProps.label}</span>
                                    {this.showColumnFilter ? (
                                        <ITableColFilter
                                            value={this.showColumnKeys}
                                            onChangeFilter={(val:any) => {
                                                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                                this.showColumnKeys = val;
                                            }}
                                            allItems={loadData.allItems}
                                            loadData={loadData}
                                        />
                                    ) : null}
                                </div>
                            );
                        }
                    },
                    render: (scope: any) => {
                        const row = scope.row;
                        const buttons = [];
                        let editButtonConf:any = {};
                        let deleteButtonConf:any = {};
                        if (this._hasButton(this.editButton)) {
                            editButtonConf = this._vColumnRenderCell_(
                                [
                                    deepAssign(
                                        this.defaultEditButton,
                                        this.editButton
                                    )
                                ],
                                row,
                                scope
                            )[0];
                            buttons.push(editButtonConf);
                        }
                        if (this._hasButton(this.deleteButton)) {
                            deleteButtonConf = this._vColumnRenderCell_(
                                [
                                    deepAssign(
                                        this.defaultDeleteButton,
                                        this.deleteButton
                                    )
                                ],
                                row,
                                scope
                            )[0];
                            buttons.push(deleteButtonConf);
                        }
                        buttons.push(
                            ...this._vColumnRenderCell_(this.columnButtons, row, scope)
                        );
                        // 排序
                        buttons.sort((a:any, b:any) => {
                            let sortA = a?.props?.item?.sort || 0;
                            let sortB = b?.props?.item?.sort || 0;
                            if (this._hasButton(this.editButton)) {
                                // 编辑按钮默认是排序1
                                if (
                                    sortA === 0 &&
                                    a.props.item.id ===
                                    editButtonConf.props.item.id
                                )
                                    sortA = 1;
                                if (
                                    sortB === 0 &&
                                    b.props.item.id ===
                                    editButtonConf.props.item.id
                                )
                                    sortB = 1;
                            }
                            if (this._hasButton(this.deleteButton)) {
                                // 删除按钮默认是排序2
                                if (
                                    sortA === 0 &&
                                    a.props.item.id ===
                                    deleteButtonConf.props.item.id
                                )
                                    sortA = 2;
                                if (
                                    sortB === 0 &&
                                    b.props.item.id ===
                                    deleteButtonConf.props.item.id
                                )
                                    sortB = 2;
                            }
                            return sortA - sortB;
                        });
                        return buttons;
                    }
                });
            }
            return mergeColumns;
        },
        mergeDialogProps(): any {
            return {
                ...$c.get("dialogProps"),
                ...this.dialogProps,
                title: this.dialogTitle,
                ...(this.dialogProps_ || {})
            };
        },
        mergePaginationProps(): any {
            const obj = deepAssign(
                $c.get("paginationProps"),
                this.paginationProps
            );
            return obj;
        },
        mergeDeleteButton(): CellItemType {
            return deepAssign(
                this.defaultDeleteButton,
                this.deleteButton || {}
            );
        },
        realPageParams(): any {
            // 根据search.mode参数配置分页参数
            const searchOptions = $c.get("search");
            let params:any = {};
            if (searchOptions.beforeFunc) {
                params = searchOptions.beforeFunc(this.filterQData);
            } else if (searchOptions.mode === "page") {
                params[searchOptions.pageNo] = this.filterQData.pageNo;
                params[searchOptions.pageSize] = this.filterQData.pageSize;
            } else if (searchOptions.mode === "offset") {
                params[searchOptions.offset] =
                    (this.filterQData.pageNo - 1) * this.filterQData.pageSize;
                params[searchOptions.limit] = this.filterQData.pageSize;
            }
            return params;
        }
    },
    methods: {
        _hasButton(buttonConf: CellItemType | Boolean) {
            if (typeof buttonConf === "boolean") {
                return buttonConf;
            } else if (typeof buttonConf === "object") {
                return true;
            }
            return false;
        },
        _calculateDisplayableFields(columns: ColumnType[]): string[] {
            const showColumnKeys: string[] = [];
            columns.forEach((item, idx) => {
                if (!item.columnProps) {
                    item.columnProps = {}
                }
                if (!item.columnProps.prop) {
                    item.columnProps.prop = `column${idx}`;
                }
                const prop = item.columnProps.prop;
                showColumnKeys.push(prop);
                if (item.children) {
                    const children = this._calculateDisplayableFields(
                        item.children
                    );
                    showColumnKeys.push(...children);
                }
            });
            return showColumnKeys;
        },
        _getColumns(columns: ColumnType[]) {
            const _columns: ColumnType[] = [];
            columns.forEach(item => {
                const prop:string = item.columnProps.prop;
                if (item.children) {
                    item.children = this._getColumns(item.children);
                }
                _columns.push({
                    ...item,
                    // @ts-ignore
                    show: this.showColumnKeys.includes(prop)
                });
            });
            return _columns;
        },
        _vColumnRenderCell_(allItems: CellItemType[], row: any, scope:any) {
            return allItems.map(item => {
                return (
                    <RenderCell
                        allItems={allItems}
                        item={{ ...$c.get("button"), ...item }}
                        formData={row}
                        isFormItem={false}
                        qData={scope}
                    ></RenderCell>
                );
            });
        },
        // 准备给外部使用的唤醒弹窗方法
        openDialog(row: any, dialogProps: any) {
            this.dialogProps_ = dialogProps || {};
            this.currentRow = row;
            this.showDialog = true;
        },
        async _openDialog_(type: string, loadData: LoadDataType) {
            this.dialogType = type;
            let openApi = null;
            if (type === "add") {
                // @ts-ignore
                this.dialogTitle = this.addButton?.dialogTitle || "新增";
                openApi = this.beforeAddOpenFunc || this.befoceAddOpenFunc;
                if(this.befoceAddOpenFunc){
                    console.warn('befoceAddOpenFunc已废弃，请使用beforeAddOpenFunc');
                }
            } else if (type === "edit") {
                // @ts-ignore
                this.dialogTitle = this.editButton?.dialogTitle || "编辑";
                openApi = this.beforeEditOpenFunc || this.befoceEditOpenFunc;
                if(this.befoceEditOpenFunc){
                    console.warn('befoceEditOpenFunc已废弃，请使用beforeEditOpenFunc');
                }
            }
            if (openApi) {
                this.showDialog = true;
                this.formLoading = true;
                try {
                    this.currentRow = await openApi(loadData);
                } catch (error) {
                    console.log(error, "错误");
                } finally {
                    this.formLoading = false;
                }
            } else {
                this.currentRow = { ...loadData.data };
                this.showDialog = true;
            }
            this.$nextTick(() => {
                // @ts-ignore
                this.$refs.iform?.clearValidate();
            });
        },
        pageChange(pageNo: number) {
            this.filterQData.pageNo = pageNo;
            this.handleSearch();
        },
        handleSizeChange(pageSize: number) {
            this.filterQData.pageSize = pageSize;
            this.filterQData.pageNo = 1;
            this.handleSearch();
        },
        handleSearch(params: any = {}) {
            // @ts-ignore
            return this.$refs?.isearch?.handleSearch(params);
        },
        _handleSearchNow(params: any) {
            // @ts-ignore
            return this.$refs?.isearch?._handleSearchNow(params);
        },
        searchSuccess(res: any) {
            const keyPaths = $c.get("response");
            let data = [];
            let total = 0;
            if (keyPaths.beforeFunc) {
                // 有自定义搜索结果处理函数
                const { data: data_, total: total_ } = keyPaths.beforeFunc(res);
                data = data_ || [];
                total = total_ || 0;
            } else {
                data = getPathValue(keyPaths.data, res, []);
                total = getPathValue(keyPaths.total, res, 0);
            }

            this.total = +total;
            this.dataList = data;
            if (this.$refs.table) {
                // @ts-ignore
                this.$refs?.table?.doLayout();
            }
            this.$emit("searchSuccess", res);
        },
        resetFields(form: any) {
            this.$emit("resetFields", form);
        },
        beforeSubmit(data: any) {
            this.$emit("beforeSubmit", data);
        },
        validationFailed(data: any) {
            this.$emit("validationFailed", data);
        },
        afterSubmit(data: any) {
            this.handleSearch();
            this.showDialog = false;
            this.$emit("afterSubmit", data);
        },
        async askDelete(loadData: LoadDataType) {
            if (this.deleteFunc) {
                // @ts-ignore
                const deleteConf:any = this.mergeDeleteButton.deleteConf || {};
                if(deleteConf.showAskDeleteDialog){
                    const title = deleteConf.askDeleteTitle || "提示";
                    const message = deleteConf.askDeleteMessage || "此操作将永久删除该数据, 是否继续?";
                    const confirmButtonText = deleteConf.askDeleteConfirmButtonText || "确定";
                    const cancelButtonText = deleteConf.askDeleteCancelButtonText || "取消";
                    await ElMessageBox.confirm(message, title, {
                        confirmButtonText: confirmButtonText,
                        cancelButtonText: cancelButtonText,
                        type: "warning"
                    });
                }
                
                try{
                    // @ts-ignore
                    await this.deleteFunc(loadData.data)
                    if(deleteConf.showDeleteSuccessMessage !== false){
                        ElMessage({
                            type: "success",
                            message: deleteConf.deleteSuccessMessage || "删除成功!"
                        });
                    }
                    // @ts-ignore
                    this.$refs?.isearch?.handleSearch();
                } catch (error) {
                    this.$emit("delete-error", error)
                }
            }
            this.$emit("delete-row", loadData);
        },
        beforeSearch(params: any) {
            this.dataList = [];
            this.dataLoading = true;
            this.$emit("beforeSearch", params);
        },
        searchFail(data: any) {
            this.$emit("searchFail", data);
        },
        searchFinally(data: any) {
            this.$emit("searchFinally", data);
            this.dataLoading = false;
        },
        //设置表格高度
        tableHeightUpdate() {
            // @ts-ignore
            if (this.resize) {
                // @ts-ignore
                this.resize = clearTimeout(this.resize);
            }
            // @ts-ignore
            this.resize = setTimeout(() => {
                // @ts-ignore //  获取外框的尺寸 
                const tableBoxSize = this.$refs.tablewrap?.clientHeight || 0;
                // 获取分页栏的尺寸
                const paginationSize =
                    this.$refs.pagination?.$el?.clientHeight || 0;
                //计算尺寸
                this.tableHeight = tableBoxSize ? tableBoxSize : undefined;
                const paginationSizeMargin = 20;
                if (this.tableHeight) {
                    this.tableHeight = Math.ceil(
                        this.tableHeight - paginationSize - paginationSizeMargin
                    );
                }
                //更新布局
                this.$nextTick(() => {
                    this.$emit("tableHeightUpdate", this.tableHeight);
                    // @ts-ignore
                    this.$refs.table && this.$refs.table.reSize();
                });
            }, 300);
        },
        tableHeightEventSwitch(on:any) {
            // 防御一下在ssr环境中编译
            if (typeof window === "undefined") return;
            // @ts-ignore
            window[["addEventListener", "removeEventListener"][on ? 0 : 1]](
                "resize",
                this.tableHeightUpdate,
                false
            );
        }
    },
    created() {
        const tableHeightMode = $c.get("tableHeightMode");
        if (tableHeightMode === "parent") {
            //更新表格高度
            this.tableHeightUpdate();

            //监听页面尺寸变化
            this.tableHeightEventSwitch(1);
        } else if (tableHeightMode === "data") {
            this.tableHeight = 0;
        }
        // @ts-ignore
        this.showColumnKeys = this._calculateDisplayableFields(this.columns);
    }
});
</script>

<style lang="scss">
.pageTemplate {
    min-height: 500px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .operation {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 20px;
    }

    .pagination {
        margin-top: 20px;
    }
}

.tableWrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    min-width: 0;
}

@keyframes refreshRotate {
    0% {
        -webkit-transform: rotate(0deg);
    }

    50% {
        -webkit-transform: rotate(180deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

.refreshAnimation {
    animation: refreshRotate 1s linear infinite;
}

.IPage_toolBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
