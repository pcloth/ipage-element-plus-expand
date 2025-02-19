<template>
    <div>{{ props.label }}</div>
    <!-- <div class="range-item" 
        :style="mergeStyle"
        :class="{
            'range-item-disabled': isDisabled(item),
            'range-item-selected': isSelected(item),
            'range-item-mid': isMid(index)

        }"
        @click.stop="selectItem(item)"
        ></div> -->
</template>

<script setup lang="ts">
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    value: {
        type: [String, Number, Boolean, Object, Array, Symbol, Function],
        default: ''
    }
})
</script>

<style lang="scss">

</style>