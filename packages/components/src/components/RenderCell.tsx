import {
    defineComponent,
    getCurrentInstance,
    PropType,
    h,
    withDirectives,
    resolveDirective
} from "vue";
import { toEventsAppendParams, fnToValue, preventRepeat } from "../utils";
import { ElementConfig } from "./ElementConfig";
import { QuestionFilled } from "@element-plus/icons-vue";

import RenderCell from "./RenderCell";
import { config as $c } from "../config";
import type { CellItemType, LoadDataType } from "../type";
import ipageMask from "../directives/mask/directive";
import ipageMoney from "../directives/money/index";
const cellProps = {
    modelValue: {
        type: [String, Number, Array, Object, Boolean]
        /**
         * 默认值暂时放""副作用较小
         * ""会让组件报错，直接不定义默认值可能更好一些，观察一下哪些组件会报问题
         */
        // default: ""
    },
    item: {
        type: Object as PropType<CellItemType>
    },
    allItems: {
        type: Array
    },
    formData: {
        type: Object
    },
    qData: {
        type: Object
    },
    isFormItem: {
        type: Boolean
    },
    defaultProps: {
        type: Object,
        default() {
            return {};
        }
    },
    defaultSlot: {
        type: String
    },
    defaultSpan: {
        type: Number
    }
};

/** 初始化插槽 */
const initSlots = (slots: object, cellProps: any, loadData: LoadDataType) => {
    const _slots = {};
    for (const key in slots) {
        const slot: any = slots[key];
        if (typeof slot === "function") {
            _slots[key] = (...arag) => {
                return slot(...arag, loadData);
            };
            continue;
        } else if (Array.isArray(slot)) {
            /** 循环渲染本组件 */
            _slots[key] = () => {
                return (
                    <>
                        {slot.map((item: any) => {
                            return (
                                <RenderCell
                                    item={item}
                                    allItems={cellProps.allItems}
                                    isFormItem={cellProps.isFormItem}
                                    formData={cellProps.formData}
                                    defaultSlot={cellProps.defaultSlot}
                                ></RenderCell>
                            );
                        })}
                    </>
                );
            };
        } else if (typeof slot === "object") {
            /** 渲染自定义组件 */
            _slots[key] = () => {
                return (
                    <RenderCell
                        item={slot}
                        allItems={cellProps.allItems}
                        isFormItem={cellProps.isFormItem}
                        formData={cellProps.formData}
                        defaultSlot={cellProps.defaultSlot}
                    ></RenderCell>
                );
            };
        }
    }
    return _slots;
};

/** 处理其他值 */
const pressOtherValues = ($props: any, val: any) => {
    const { item, formData } = $props;
    if (item.otherValueRange) {
        const otherValues = {};
        if (val && Array.isArray(val)) {
            val.forEach((v: any, i: number) => {
                otherValues[item.otherValueRange[i]] = v;
            });
        }
        item.otherValueRange.forEach(key => {
            formData[key] = otherValues[key];
        });
    }
};

const makeDom = ($props, $rcell, $context) => {
    const { item, modelValue, defaultSlot } = $props;
    const { emit } = $context;

    const {
        id,
        slot = defaultSlot,
        label,
        tip,
        options,
        optionDom, // 自定义option
        _i_options = item.options, // 用户处理实际的options
        directives = [],
        mask,
        money,
        debounce,
        valueWatch,
        slots = {},
        props = {},
        on = {},
        show = true,
        _i_show = true, // 用于标识是否显示
        canShowFunc,
        isFormItem,
        formItemProps = {},
        isCol = false,
        span,
        colProps = {},
        isButtonGroup = false,
        ...rest
    } = item;

    let domConfig = ElementConfig[slot];

    if (!domConfig) {
        domConfig = $c.get("extendedRenderCell")[slot];
    }
    if (!domConfig) {
        return null;
    }

    /** 以最内层配置为优先 */
    let $isFormItem = isFormItem;
    if (isFormItem === undefined) {
        $isFormItem = $props.isFormItem;
    }
    const loadData: LoadDataType = {
        item: $props.item,
        data: $props.formData,
        qData: $props.qData,
        allItems: $props.allItems,
        $rcell
    };

    /** 处理是否显示 */
    if (canShowFunc !== undefined) {
        /** 兼容旧参数 */
        fnToValue(canShowFunc, loadData).then(v => {
            if (_i_show !== v) {
                item._i_show = v;
                $rcell.$forceUpdate();
            }
        });
    } else if (show !== undefined) {
        fnToValue(show, loadData).then(v => {
            if (_i_show !== v) {
                item._i_show = v;
                $rcell.$forceUpdate();
            }
        });
    }

    if (!_i_show) {
        return null;
    }
    /** 处理options */
    if (options) {
        if (["AsyncFunction", "Function"].includes(options.constructor.name)) {
            const nv = options(loadData);
            if (nv.constructor.name === "Promise") {
                nv.then(v => {
                    item._i_options = v;
                    $rcell.$forceUpdate();
                });
            } else {
                item._i_options = nv;
                $rcell.$forceUpdate();
            }
            item.options = null; // 避免一直加载
        } else if (options.constructor.name === "Array") {
            // 如果传入本身就是array，不额外处理一次
            item._i_options = options;
        } else if (options.constructor.name === "Promise") {
            options.then(v => {
                item._i_options = v;
                $rcell.$forceUpdate();
            });
            item.options = null; // 避免一直加载
        }
    }

    if (!slots.default && item._i_options) {
        // 如果外部传入default，就使用默认渲染
        slots.default = () => {
            if (!Array.isArray(item._i_options)) {
                return [];
            }
            return item._i_options.map((row: any) => {
                // 如果外部传入了optionDom，就使用外部的，否则使用默认的
                const _otions_ = optionDom
                    ? optionDom(loadData, row)
                    : domConfig.optionDom(loadData, row);
                _otions_.props = row;
                return _otions_;
            });
        };
    }

    // 寻找on里面的事件，给其添加荷载数据
    const onEvent = toEventsAppendParams(on, loadData, true);
    // 寻找props里面的事件，给其添加荷载数据
    const onProps = toEventsAppendParams(props, loadData, false);
    // 给插槽方法添加荷载数据
    if (domConfig.tipIsDefault && tip && !slots.default) {
        // tip转入default插槽
        slots.default = () => {
            return tip;
        };
    }
    const onSlots = initSlots(slots, $props, loadData);

    const mergeProps = {
        ...$props.defaultProps,
        ...rest,
        ...onProps,
        ...onEvent
    };
    let dom = null;
    if (mask) {
        directives.push({ name: "ipage-mask", value: mask });
    }
    if (money){
        directives.push({ name: "ipage-money", value: money });
    }
    /** 处理指令 */
    if (directives && directives.length) {
        const directiveList = directives.map(row => {
            return [
                // 加载指令对象
                resolveDirective(row.name),
                row.value,
                row.argument,
                row.modifiers
            ];
        });
        dom = withDirectives(
            h(domConfig.dom(loadData), mergeProps, onSlots),
            directiveList
        );
    } else {
        dom = h(domConfig.dom(loadData), mergeProps, onSlots);
    }
    /** 处理v-model */
    if(!dom.props){
        dom.props = {};
    }
    dom.props.modelValue = modelValue;
    pressOtherValues($props, modelValue);
    valueWatch && valueWatch(modelValue, loadData);

    /** 额外防抖 */
    const hasDebounce = debounce || domConfig.debounce;
    if (hasDebounce) {
        const debounceTimer = hasDebounce === true ? 300 : hasDebounce;
        dom.props["onUpdate:modelValue"] = preventRepeat(val => {
            pressOtherValues($props, val);
            valueWatch && valueWatch(val, loadData);
            emit("update:modelValue", val);
        }, debounceTimer);
    } else {
        dom.props["onUpdate:modelValue"] = val => {
            pressOtherValues($props, val);
            valueWatch && valueWatch(val, loadData);
            emit("update:modelValue", val);
        };
    }

    /** 添加表单项目 */
    if ($isFormItem) {
        let labelSlot = null;
        if (formItemProps.tip) {
            // 被表单添加提示信息
            if (typeof formItemProps.tip === "string") {
                labelSlot = () => (
                    <span>
                        <span>{label}</span>
                        <el-tooltip
                            effect="dark"
                            content={formItemProps.tip}
                            placement="top-start"
                        >
                            <el-icon style="margin-left:5px;">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </span>
                );
            } else {
                labelSlot = () => (
                    <span>
                        <span>{label}</span>
                        <RenderCell item={formItemProps.tip} />
                    </span>
                );
            }
        }
        dom = (
            <el-form-item
                label={label}
                prop={id}
                v-slots={{ label: labelSlot }}
                {...formItemProps}
            >
                {dom}
            </el-form-item>
        );
    }
    /** 添加列项目
     * 如果指定了span或者默认span，就添加列
     */
    const span_ = span || $props.defaultSpan;
    if (isCol || span_) {
        if (span_) {
            colProps.span = span_;
        }
        dom = <el-col {...colProps}>{dom}</el-col>;
    }
    if (isButtonGroup) {
        dom = <el-button-group>{dom}</el-button-group>;
    }
    return dom;
};

export default defineComponent({
    name: "RenderCell",
    props: cellProps,
    directives: { ipageMask, ipageMoney },
    setup(props, context) {
        // console.log(props.defaultProps, context, "RenderCell", this);
        const $rcell = getCurrentInstance()?.proxy;
        return () => makeDom(props, $rcell, context);
    }
});
