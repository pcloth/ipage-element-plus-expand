<script lang="jsx">
import { toEventsAppendParams } from "./utils";
import { config as $c } from "./config";
import RenderCell from "./components/RenderCell";
import ITableColumn from "./components/ITableColumn.vue";
export default {
    name: "ITable",
    components: {
        ITableColumn,
        RenderCell
    },
    props: {
        // 数据表
        data: {
            type: Array,
            default: () => []
        },
        // 渲染表参数
        columns: {
            type: Array,
            default: () => []
        },
        tableProps: {
            type: Object,
            default: () => $c.get("tableProps")
        },
        tableSlots: {
            type: Object,
            default: () => ({})
        },
        tableOn: {
            type: Object,
            default: () => $c.get("tableOn")
        },
        tableHeight: {
            type: [Number, String],
            default: () => $c.get("tableHeight")
        },
        className: {
            type: String,
            default: () => $c.get("class").ITableRoot
        },
        /** 可显示的字段 */
        showColumnKeys: {
            type: Array,
            default: () => []
        },
        showColumnFilter:{
            type:Boolean,
            default: false
        }
    },
    data() {
        return {
            // height:'400px'
            showTable: true
        };
    },
    mounted() {},
    watch: {
        columns: {
            handler() {
                this.reDarw();
            },
            deep: true
        }
    },
    computed: {
        tableEvent() {
            const loadData = {
                data: this.data,
                allItems: this.columns,
                $table: this
            };
            return toEventsAppendParams(this.tableOn || {}, loadData, this);
        }
    },
    methods: {
        doLayout() {
            if (this.$refs.table && this.$refs.table.doLayout) {
                this.$refs.table.doLayout();
            }
        },
        /** 重绘表格，如果要控制嵌套列的隐藏，需要手动重绘 */
        reDarw() {
            this.showTable = false;
            setTimeout(() => {
                this.showTable = true;
            }, 0);
        },
        reSize() {
            // this.height = `${this.tableHeight}px`
            this.$nextTick(() => {
                this.doLayout();
            });
        },
        checkCanShow(item) {
            const loadData = {
                item: item,
                allItems: this.columns,
                $column: this
            };
            let canShow = true;
            const { show } = item;
            if (show !== undefined) {
                if (typeof show === "boolean") {
                    canShow = item.show;
                } else if (show.constructor.name === "Function") {
                    canShow = item.show(loadData);
                } else if (show.constructor.name === "Boolean") {
                    canShow = item.show;
                } else {
                    throw new Error("show参数必须是方法或者布尔值");
                }
            }
            return canShow;
        }
    },
    render() {
        if (!this.showTable) return null;
        const columnDoms = [];
        const children = this.columns || [];
        children.forEach((item,idx) => {
            if(!item.columnProps){
                item.columnProps = {}
            }
            if(!item.columnProps.prop){
                item.columnProps.prop = `column${idx}`;
            }
            const prop = item.columnProps.prop;
            const isOperate = item.isOperate;
            const canShowChild =
                isOperate || this.showColumnFilter && this.showColumnKeys.includes(prop)||!this.showColumnFilter;
            if (canShowChild) {
                columnDoms.push(
                    <ITableColumn
                        item={item}
                        columns={this.columns}
                        showColumnKeys={this.showColumnKeys}
                        showColumnFilter={this.showColumnFilter}
                    ></ITableColumn>
                );
            }
        });
        return (
            <el-table
                ref="table"
                class={this.className}
                data={this.data}
                {...{
                    height: this.tableHeight,
                    ...this.tableProps,
                    ...this.tableEvent
                }}
            >
                {columnDoms}
            </el-table>
        );
    }
};
</script>

<style></style>
