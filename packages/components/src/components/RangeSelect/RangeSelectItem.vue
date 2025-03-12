<template>
    <div
        class="range-item"
        :class="{
            'range-item-disabled': callBack('isDisabled', props._item),
            'range-item-selected': callBack('isSelected', props._item), //isSelected(item),
            'range-item-mid': callBack('isMid', props._item) //isMid(item),
        }"
        :style="func.mergeStyle"
        @click.stop="callBack('selectItem', props._item)"
    >
        <slot>
            <div>{{ props.label }}</div>
        </slot>
        <slot name="item-extra" :item="props._item">
            <div class="range-name" v-if="callBack('isStart', props._index)">
                {{ func.rangeName[0] }}
            </div>
            <div class="range-name" v-if="callBack('isEnd', props._index)">
                {{ func.rangeName[1] }}
            </div>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from "vue";
const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    value: {
        type: [String, Number, Boolean, Object, Array, Symbol, Function],
        default: ""
    },
    _index: {
        type: Number
    },
    _item: {
        type: Object,
        default: () => {}
    }
});
const func = inject<any>("func");
const callBack = (name: string, ...args: any[]) => {
    return func.emitParent(name, ...args);
};
onMounted(() => {
    callBack("accpetChild", props._item, props._index);
});
</script>

<style lang="scss"></style>
