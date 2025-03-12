<template>
    <div class="range-select">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, provide } from "vue";

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    /** 直接采用item作为value */
    valueIsItem: {
        type: Boolean,
        default: false
    },
    valueProps: {
        type: Object,
        default: () => {
            return {
                value: "value",
                label: "label"
            };
        }
    },
    itemStyle: {
        type: Object,
        default: () => {}
    },
    disabled: {
        type: Boolean,
        default: false
    },
    /**
     * picker: 挑选模式，只能选择limit个，limit=0不限制
     * range: 范围模式，只能选择两个
     */
    mode: {
        type: String,
        default: "picker"
    },
    // 强制排序，开始必须小于结束
    sort: {
        type: Boolean,
        default: false
    },
    /**
     * 是否允许开始和结束相同
     */
    allowsStartEndSame: {
        type: Boolean,
        default: true
    },
    limit: {
        type: Number,
        default: 0
    },
    /** 可选项 */
    options: {
        type: Array as () => any[],
        default: () => []
    },
    /** 禁止选择的列表 */
    disabledValues: {
        type: Array as () => string[],
        default: () => []
    },
    rangeName: {
        type: Array as () => string[],
        default: () => ["开始", "结束"]
    }
});
const emit = defineEmits(["update:modelValue", "change"]);

const mergeStyle = computed(() => {
    return {
        width: "72px",
        height: "72px",
        ...props.itemStyle
    };
});
const currentList = ref<any>([]);
const currentKeyList = ref<any>([]);

const isSelected = (item: any) => {
    return currentKeyList.value.includes(item[props.valueProps.value]);
};

const isDisabled = (item: any) => {
    const status =
        props.limit &&
        currentList.value.length >= props.limit &&
        !isSelected(item);
    const hasDisabled = props.disabledValues.find(
        (value: string) => item[props.valueProps.value] === value
    );
    return props.disabled || hasDisabled || status || item.disabled;
};

const getRangeMinMaxIndex = () => {
    const one = currentList.value[0];
    const two = currentList.value[1];
    const oneIndex = children.value.findIndex(
        (item: any) =>
            item[props.valueProps.value] === one[props.valueProps.value]
    );
    const twoIndex = children.value.findIndex(
        (item: any) =>
            item[props.valueProps.value] === two[props.valueProps.value]
    );
    const maxIndex = Math.max(oneIndex, twoIndex);
    const minIndex = Math.min(oneIndex, twoIndex);
    return {
        maxIndex,
        minIndex
    };
};
const isStart = (index: number) => {
    let current = currentList.value[0];
    if (props.mode === "range") {
        if (!props.sort && currentList.value.length) {
            current = currentList.value[0];
            return (
                index ===
                children.value.findIndex(
                    (item: any) =>
                        item[props.valueProps.value] ===
                        current[props.valueProps.value]
                )
            );
        }
        if (props.sort && currentList.value.length >= 1) {
            const { minIndex } = getRangeMinMaxIndex();
            if (index === minIndex) {
                return true;
            }
        }
    }
    return false;
};

const isEnd = (index: number) => {
    if (props.mode === "range") {
        if (currentList.value.length === 2) {
            if (props.sort) {
                const { maxIndex } = getRangeMinMaxIndex();
                return index === maxIndex;
            } else {
                const endItem = currentList.value[1];
                return (
                    index ===
                    children.value.findIndex(
                        (item: any) =>
                            item[props.valueProps.value] ===
                            endItem[props.valueProps.value]
                    )
                );
            }
        }
    }
    return false;
};

// 是否是中间选中的
const isMid = (item: any) => {
    if (props.mode === "range" && currentKeyList.value.length === 2) {
        const { minIndex, maxIndex } = getRangeMinMaxIndex();
        const index = children.value.findIndex(
            (i: any) =>
                i[props.valueProps.value] === item[props.valueProps.value]
        );
        if (index > minIndex && index < maxIndex) {
            return true;
        }
    }
    return false;
};

const initValue = () => {
    if (props.valueIsItem) {
        currentKeyList.value = props.modelValue.map(
            (item: any) => item[props.valueProps.value]
        );
        currentList.value = props.modelValue;
    } else {
        currentKeyList.value = props.modelValue;
        const arr: any = [];
        currentKeyList.value.forEach((key: any) => {
            const item = children.value.find(
                (item: any) => item[props.valueProps.value] === key
            );
            arr.push(item);
        });
        currentList.value = arr;
    }
};

onMounted(() => {
    initValue();
});

const putOutValue = () => {
    let arr = [];
    if (props.valueIsItem) {
        arr = JSON.parse(JSON.stringify(currentList.value));
        props.sort &&
            arr.sort((a: any, b: any) => {
                const startIndex = children.value.findIndex(
                    (item: any) =>
                        item[props.valueProps.value] ===
                        a[props.valueProps.value]
                );
                const endIndex = children.value.findIndex(
                    (item: any) =>
                        item[props.valueProps.value] ===
                        b[props.valueProps.value]
                );
                return startIndex - endIndex;
            });
    } else {
        arr = JSON.parse(JSON.stringify(currentKeyList.value));
        props.sort &&
            arr.sort((a: any, b: any) => {
                const startIndex = children.value.findIndex(
                    (item: any) => item[props.valueProps.value] === a
                );
                const endIndex = children.value.findIndex(
                    (item: any) => item[props.valueProps.value] === b
                );
                return startIndex - endIndex;
            });
    }
    emit("update:modelValue", arr);
    emit("change", arr);
};

watch(
    () => props.modelValue,
    () => {
        initValue();
    }
);

const selectItem = (item: any) => {
    if (isDisabled(item)) return;
    if (props.mode === "picker") {
        const value = item[props.valueProps.value];
        if (isSelected(item)) {
            currentKeyList.value = currentKeyList.value.filter(
                (key: any) => key !== value
            );
            currentList.value = children.value.filter((item: any) =>
                currentKeyList.value.includes(item[props.valueProps.value])
            );
        } else {
            if (props.limit && currentList.value.length >= props.limit) return;
            currentKeyList.value.push(item[props.valueProps.value]);
            currentList.value.push(item);
        }
    } else if (props.mode === "range") {
        if (currentKeyList.value.length >= 2) {
            currentKeyList.value = [];
            currentList.value = [];
        } else {
            if (isSelected(item) && !props.allowsStartEndSame) {
                currentKeyList.value = currentKeyList.value.filter(
                    (key: any) => key !== item[props.valueProps.value]
                );
                currentList.value = children.value.filter((item: any) =>
                    currentKeyList.value.includes(item[props.valueProps.value])
                );
            } else {
                currentKeyList.value.push(item[props.valueProps.value]);
                currentList.value.push(item);
            }
        }
    }
    putOutValue();
};

const children = ref<any>([]);
const childrenMaps = ref<any>({});
const accpetChild = (item: any, index: any) => {
    childrenMaps.value[index] = item;
    const indexList = Object.keys(childrenMaps.value);
    children.value = indexList.map(key => childrenMaps.value[key]);
};

provide("func", {
    isDisabled,
    isSelected,
    isMid,
    isStart,
    isEnd,
    selectItem,
    mergeStyle: mergeStyle.value,
    rangeName: props.rangeName,
    emitParent: (name: string, ...args: any[]) => {
        let func = null;
        switch (name) {
            case "isDisabled":
                func = isDisabled;
                break;
            case "isSelected":
                func = isSelected;
                break;
            case "isMid":
                func = isMid;
                break;
            case "isStart":
                func = isStart;
                break;
            case "isEnd":
                func = isEnd;
                break;
            case "selectItem":
                func = selectItem;
                break;
            case "accpetChild":
                func = accpetChild;
                break;
            default:
                break;
        }
        if (func) {
            return func(...args);
        }
    }
});
</script>

<style lang="scss">
.range-select {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;

    .range-item {
        padding: 10px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        padding: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        line-height: 1.5;
        box-sizing: border-box;

        &:hover {
            background-color: #f5f5f5;
        }

        &.range-item-disabled {
            cursor: not-allowed;
            background-color: #f0f0f0;
            // pointer-events: none;
        }

        &.range-item-selected {
            background-color: #409eff;
            color: #fff;
        }

        &.range-item-mid {
            background-color: #cde4fb;
        }

        .range-name {
            font-size: 12px;
            color: #eee;
        }
    }
}
</style>
