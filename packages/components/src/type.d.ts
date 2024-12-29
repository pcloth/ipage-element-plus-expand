export type CellItemType = {
    /**
     * 如果需要排序的情况，比如columnButtons里面的按钮，可以通过sort来控制按钮的顺序
     */
    sort?: number;
    /**
     * 唯一标识，如果是input，会尝试通过id来获取值，如果是button，会尝试通过id来获取点击事件
     */
    id?: string;
    /**
     * 组件类型
     */
    slot?: string;
    /** 如果在传入到表单，会作为表单的item-label */
    label?: string;
    /** 有些组件会把这个值丢到default插槽中，比如button，span */
    tip?: string;
    /** 子组件的列表数据 */
    options?: Function | Array<object> | Promise<Array<object>>;
    /** 自定义指令配置 */
    directives?: Array<object>;
    /** 防抖参数 */
    debounce?: number | false;
    /** 自定义渲染函数 */
    render?: Function;
    /** 传递给组件的插槽 */
    slots?: object;
    /** 传递给组件的数据 */
    props?: object;
    /** 用于接受组件事件的方法集合 */
    on?: object;
    /** 是否显示本渲染单元，
     * 类似v-show功能，可以传入布尔值和方法，包括异步方法，只接受true或者false返回值，catch不接受
     * 已知问题：在table的column中使用时，如果表格有tree，会造成循环渲染问题；
     *  */
    show?: boolean | Function | Promise<boolean>;
    /** 是否包裹一个el-form-item 组件 */
    isFormItem?: boolean;
    /** el-form-item 组件的props参数 */
    formItemProps?: {
        /** 可以给表单的label上插入一个提示信息 */
        tip?: String | CellItemType;
        // 其他都是给el-form-item的props
        [key: string]: any;
    };
    /** 是否包裹一个el-col 组件 */
    isCol?: boolean;
    /** el-col 组件的props参数 */
    colProps?: object;
    /** 当前组件是否有valueRange
     * 比如date-pcker组件，如果指定了时间范围，将会获得一个array的value，你可以在这里配置它们映射的其他value
     * 比如['start','end']，将会把['2021-01-01','2021-01-02']映射成{start:'2021-01-01',end:'2021-01-02'}
     */
    otherValueRange?: Array<string>;
    /** 考虑一下，当值发生变化的时候，触发一个watch钩子，当不方便做外部watch的时候，可以从这里直接拿到变化状态 */
    valueWatch?: Function;
    /** 自定义options的节点 loadData, row */
    optionDom?: Function;
    /** 
     * 限定输入范围：
     * 方法一：传入字符串或者数组字符串，表示如下默认值：

    mask:"##-###"

    其中默认的规则有：
        C: { pattern: /[\u4e00-\u9fa5]/ },
        "#": { pattern: /\d/ },
        X: { pattern: /[0-9a-zA-Z]/ },
        S: { pattern: /[a-zA-Z]/ },
        A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
        "!": { escape: true }

       方法二：传入对象，表示自定义规则，比如：
        mask:{
            mask:"ff",
            tokens:{
                f:{
                    pattern: /[a-zA-Z]/, 
                    transform: v => v.toLocaleUpperCase() 
                }
            }
        }
        它将只接收2个英文，并转换成大写
     *  */
    mask?: string|Array<string> | Object;
};

export type ColumnType = {
    /** 传递给el-table-column组件的参数 */
    columnProps?: object;
    /** 渲染函数，jsx模式 */
    render?: Function;
    /** 使用RenderCell组件配置 */
    cell?: CellItemType;
};

type ElementConfigType = {
    [key: string]: {
        dom: (loadData?: any) => JSX.Element;
        optionDom?: (loadData: any, item?: any) => JSX.Element;
        tipIsDefault?: boolean;
        debounce?: boolean;
    };
};

/**
 * 扩展组件配置参数类型
 * TODO 有些any类型需要后续优化
 */
export type IPageElementPlusExpandConfigType = {
    options: {
        class?: any;
        response?: any;
        search?: any;
        tableHeightMode?: "parent" | "data";
        tableHeight?: number;
        dialogProps?: any;
        dialogOn?: any;
        columnButtonProps?: any;
        paginationProps?: any;
        toolbarButton?: CellItemType;
        button?: CellItemType;
        addButton?: CellItemType | false;
        editButton?: CellItemType | false;
        deleteButton?: CellItemType | false;
        refreshButton?: CellItemType | false;
        formClass?: string;
        formProps?: any;
        formOn?: any;
        expandButtons?: Array<CellItemType>;
        //// 这部分参数后期干掉
        showSubmitButton?: boolean;
        submitTitle: string;
        cancelTitle: string;
        submitButtonProps?: any;
        showCancelButton?: boolean;
        cancelButtonProps?: any;
        /** 表单提交按钮 */
        formSubmitButton?: CellItemType | false;
        /** 表单取消按钮 */
        formCancelButton?: CellItemType | false;
        ElementConfigType?: ElementConfigType;
        /** 提交按钮是否节流 */
        submitPreventRepeat?: boolean;
        /** 搜索区form默认props，传递给el-form组件 */
        searchFormProps?: any;
        /** 搜索区输入框默认props，传递给element-plus组件 */
        searchInputProps?: any;
        /** 搜索区扩展按钮默认参数 */
        searchExpandButtonProps?: CellItemType;
        searchSubmitButton?: CellItemType | false;
        searchResetButton?: CellItemType | false;
        allinMore?: boolean;
        /** 表格的props参数，直接传递给el-table */
        tableProps?: any;
        /** 表格的on参数，直接传递给el-table，绑定所有事件 */
        tableOn?: any;
        extendedRenderCell?: ElementConfigType;
    };
    get: (deepPath: string) => any;
    set: (options: any) => void;
};
