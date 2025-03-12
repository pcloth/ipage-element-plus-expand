<template>
    <div>
        <el-alert style="margin-bottom: 10px;" :closable="false" type="success">尝试一下，点选几个。</el-alert>
        <RenderCell v-model="value" :item="item" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            value: [],
            item: {
                slot: 'range-select',
                options: [
                    { label: '星期一', value: 1 },
                    { label: '星期二', value: 2 },
                    { label: '星期三', value: 3 },
                    { label: '星期四', value: 4 },
                    { label: '星期五', value: 5 },
                    { label: '星期六', value: 6 },
                    { label: '星期日', value: 7 },
                ]
            },

        }
    },
}
</script>