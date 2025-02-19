<template>
    <div class="range-select">
        <!-- <slot>
            <div class="range-item" 
                :style="mergeStyle"
                :class="{
                    'range-item-disabled': isDisabled(item),
                    'range-item-selected': isSelected(item),
                    'range-item-mid': isMid(index)

                }"
                @click.stop="selectItem(item)"></div>
        </slot> -->
        <div
            class="range-item"
            :style="mergeStyle"
            :class="{
                'range-item-disabled': isDisabled(item),
                'range-item-selected': isSelected(item),
                'range-item-mid': isMid(index)
            }"
            @click.stop="selectItem(item)"
            v-for="(item, index) in props.options"
            :key="index"
        >
            <slot name="item" :item="item">
                <div>{{ item[props.valueProps.label] }}</div>
            </slot>
            <slot name="item-extra" :item="item">
                <div class="range-name" v-if="isStart(index)">
                    {{ props.rangeName[0] }}
                </div>
                <div class="range-name" v-if="isEnd(index)">
                    {{ props.rangeName[1] }}
                </div>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import RangeSelectItem from "./RangeSelectItem.vue";
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
const emit = defineEmits(["update:modelValue"]);

const mergeStyle = computed(() => {
    return {
        width: "50px",
        height: "30px",
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
    return props.disabled || hasDisabled || status;
};

const getRangeMinMaxIndex = () => {
    const one = currentList.value[0];
    const two = currentList.value[1];
    const oneIndex = props.options.findIndex(
        (item: any) =>
            item[props.valueProps.value] === one[props.valueProps.value]
    );
    const twoIndex = props.options.findIndex(
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
        if (currentList.value.length === 1) {
            current = currentList.value[0];
            return (
                index ===
                props.options.findIndex(
                    (item: any) =>
                        item[props.valueProps.value] ===
                        current[props.valueProps.value]
                )
            );
        } else if (currentList.value.length === 2) {
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
            const { maxIndex } = getRangeMinMaxIndex();
            if (index === maxIndex) {
                return true;
            }
        }
    }
    return false;
};

// 是否是中间选中的
const isMid = (index: number) => {
    if (props.mode === "range" && currentKeyList.value.length === 2) {
        const { minIndex, maxIndex } = getRangeMinMaxIndex();
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
        currentList.value = props.options.filter((item: any) =>
            currentKeyList.value.includes(item[props.valueProps.value])
        );
    }
};

onMounted(() => {
    initValue();
});

const putOutValue = () => {
    let arr = [];
    if (props.valueIsItem) {
        arr = JSON.parse(JSON.stringify(currentList.value));
        arr.sort((a: any, b: any) => {
            const startIndex = props.options.findIndex(
                (item: any) =>
                    item[props.valueProps.value] === a[props.valueProps.value]
            );
            const endIndex = props.options.findIndex(
                (item: any) =>
                    item[props.valueProps.value] === b[props.valueProps.value]
            );
            return startIndex - endIndex;
        });
    } else {
        arr = JSON.parse(JSON.stringify(currentKeyList.value));
        arr.sort((a: any, b: any) => {
            const startIndex = props.options.findIndex(
                (item: any) => item[props.valueProps.value] === a
            );
            const endIndex = props.options.findIndex(
                (item: any) => item[props.valueProps.value] === b
            );
            return startIndex - endIndex;
        });
    }
    console.log("putOutValue", arr);
    emit("update:modelValue", arr);
};

watch(
    () => props.modelValue,
    () => {
        initValue();
    }
);

// watch(
//     () => currentList.value,
//     () => {
//         console.log("watch currentList", currentList.value);
//         putOutValue();
//     }
// );

const selectItem = (item: any) => {
    if (isDisabled(item)) return;
    if (props.mode === "picker") {
        const value = item[props.valueProps.value];
        if (isSelected(item)) {
            currentKeyList.value = currentKeyList.value.filter(
                (key: any) => key !== value
            );
            currentList.value = props.options.filter((item: any) =>
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
            if (isSelected(item)) {
                currentKeyList.value = currentKeyList.value.filter(
                    (key: any) => key !== item[props.valueProps.value]
                );
                currentList.value = props.options.filter((item: any) =>
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
</script>

<style lang="scss" scoped>
.range-select {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;

    .range-item {
        padding: 10px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

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
