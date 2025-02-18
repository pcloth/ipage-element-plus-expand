<template>
    <div class="range-select">
        <div class="range-item" 
        :style="mergeStyle"
        :class="{
            'range-item-disabled': props.disabled || (props.limit && currentList.length >= props.limit && !isSelected(item)),
            'range-item-selected': isSelected(item),
            'range-item-mid': isMideSelected(index)

        }"
        @click.stop="selectItem(item)"
        v-for="(item, index) in props.options" :key="index">
            <slot name="item" :item="item">
                <div>{{ item[props.valueProps.label] }}</div>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch,computed,onMounted } from 'vue'
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
                value: 'value',
                label: 'label'
            }
        }
    },
    itemStyle:{
        type: Object,
        default:()=>{}
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
        default: 'range'
    },
    limit: {
        type: Number,
        default: 3
    },
    /** 可选项 */
    options: {
        type: Array as () => any[],
        default: () => []
    }
})
const emit = defineEmits([
    'update:modelValue'
])

const mergeStyle = computed(()=>{
    return {
        width:'50px',
        height:'30px',
        ...props.itemStyle
    }
})
const currentList = ref<any>([])
const currentKeyList = ref<any>([])

const isSelected = (item:any)=>{
    return currentKeyList.value.includes(item[props.valueProps.value])
}
// 是否是中间选中的
const isMideSelected = (index:number)=>{
    if(props.mode==="range" && currentKeyList.value.length === 2){
        const one = currentList.value[0]
        const two = currentList.value[1]
        const oneIndex = props.options.findIndex((item:any)=>item[props.valueProps.value] === one[props.valueProps.value])
        const twoIndex = props.options.findIndex((item:any)=>item[props.valueProps.value] === two[props.valueProps.value])
        const maxIndex = Math.max(oneIndex,twoIndex)
        const minIndex = Math.min(oneIndex,twoIndex)
        if(index>minIndex && index<maxIndex){
            return true
        }
    }
    return false
}

const initValue = ()=>{
    if(props.valueIsItem){
        currentKeyList.value = props.modelValue.map((item:any)=>item[props.valueProps.value])
        currentList.value = props.modelValue
    }else {
        currentKeyList.value = props.modelValue
        currentList.value = props.options.filter((item:any)=>currentKeyList.value.includes(item[props.valueProps.value]))
    }
    
}

onMounted(()=>{
    initValue()
})

const putOutValue = ()=>{
    if(props.valueIsItem){
        emit('update:modelValue', currentList.value)
    }else {
        emit('update:modelValue', currentKeyList.value)
    }
}

watch(()=>props.modelValue, ()=>{
    initValue()
})

watch(()=>currentList.value, ()=>{
    putOutValue()
})

const selectItem = (item:any)=>{
    if(props.disabled) return
    if(props.mode === 'picker'){
        const value = item[props.valueProps.value]
        if(isSelected(item)){
            currentKeyList.value = currentKeyList.value.filter((key:any)=>key !== value)
            currentList.value = props.options.filter((item:any)=>currentKeyList.value.includes(item[props.valueProps.value]))
        }else {
            if(props.limit && currentList.value.length >= props.limit) return
            currentKeyList.value.push(item[props.valueProps.value])
            currentList.value.push(item)
        }
        
    }else if(props.mode === 'range'){
        if(currentKeyList.value.length >= 2){
            currentKeyList.value = []
            currentList.value = []
        }else {
            if(isSelected(item)){
                currentKeyList.value = currentKeyList.value.filter((key:any)=>key !== item[props.valueProps.value])
                currentList.value = props.options.filter((item:any)=>currentKeyList.value.includes(item[props.valueProps.value]))
            }else {
                currentKeyList.value.push(item[props.valueProps.value])
                currentList.value.push(item)
            }
        }
    }
    // putOutValue()
}

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
        &:hover {
            background-color: #f5f5f5;
        }
        &.range-item-disabled {
            cursor: not-allowed;
            background-color: #f0f0f0;
            pointer-events: none;
        }
        &.range-item-selected {
            background-color: #409eff;
            color: #fff;
        }
        &.range-item-mid {
            background-color: #cde4fb;
        }
    }
}
</style>